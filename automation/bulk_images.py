#!/usr/bin/env python3
"""Generate a whole manifest of images in one run, against Google's image models.

    python automation/bulk_images.py --manifest media/clarity/plates/manifest.json
    python automation/bulk_images.py --manifest ... --live --workers 4

Dry run by default, like every other write path in this repo. The first click
prices the job and prints what it would render; nothing is spent and nothing is
written until --live.

WHY THIS EXISTS AND WHY IT IS NOT "FLOW"

Google Flow (labs.google/flow) has no public API. It is a UI on top of the Gemini
image and video models, sold with the AI Pro/Ultra subscription, and the only ways
to drive it in bulk are a browser extension or a reverse-engineered private
endpoint — both of which mean handing a third party a logged-in Google session,
and neither of which can run from a container that has no browser and no Google
cookie. What Flow actually generates images with is reachable directly: Nano
Banana Pro is gemini-3-pro-image on the Gemini API. That is what this drives.

So this is the bulk path Flow does not offer: one manifest in, N PNGs out, with
concurrency, resume, and receipts.

RESUME IS THE POINT. Every entry names its own output file, and an entry whose
file already exists is skipped unless --force. A run that dies at plate 140 of
180 is restarted with the same command and costs 40 images, not 180. Interrupt it
freely.

NEGATIVES ARE PROSE HERE, NOT A FIELD. Imagen takes a negativePrompt; the Gemini
image models do not. The manifest's negative block is appended to the prompt as an
instruction instead. It is weaker than a real negative field — check plate 61's
"no calligraphy" rather than assuming it held.

SEEDS ARE NOT EXPOSED. The Gemini image API has no seed parameter, so the
manifest's seed_group cannot be honoured by re-running the same seed. For a
line/wash pair, render the wash first and pass it back as the line pass's
reference (an entry's "reference" key), which is the fallback the manifest itself
documents.
"""
import argparse
import base64
import json
import mimetypes
import os
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from threading import Lock

ROOT = Path(__file__).resolve().parent.parent
HOST = "https://generativelanguage.googleapis.com/v1beta/models"

# GA June 2026. Pre-GA this was gemini-3-pro-image-preview; pass --model if the
# account is still on the preview alias.
DEFAULT_MODEL = "gemini-3-pro-image"

PRICES = {  # USD per image, interactive (not Vertex batch) rates
    "gemini-3-pro-image": 0.134,
    "gemini-3-pro-image-preview": 0.134,
}

PRINT = Lock()


def say(*a):
    with PRINT:
        print(*a, flush=True)


def load(manifest):
    path = Path(manifest)
    if not path.is_absolute():
        path = ROOT / path
    if not path.exists():
        sys.exit(f"no manifest at {path}")
    doc = json.loads(path.read_text(encoding="utf-8"))
    entries = doc.get("entries") if isinstance(doc, dict) else doc
    if not entries:
        sys.exit(f"{path} has no entries[]")
    for i, e in enumerate(entries):
        if not e.get("prompt"):
            sys.exit(f"entry {i} ({e.get('id', '?')}) has no prompt")
        if not e.get("out"):
            sys.exit(f"entry {i} ({e.get('id', '?')}) has no out path")
    return entries


def body(entry, size):
    """Build one generateContent request."""
    text = entry["prompt"]
    if entry.get("negative"):
        text += "\n\nDo not include: " + entry["negative"]

    parts = [{"text": text}]
    for ref in entry.get("references") or ([entry["reference"]] if entry.get("reference") else []):
        p = Path(ref)
        if not p.is_absolute():
            p = ROOT / p
        if not p.exists():
            raise FileNotFoundError(f"reference missing: {ref}")
        mime = mimetypes.guess_type(p.name)[0] or "image/png"
        parts.append({"inline_data": {
            "mime_type": mime,
            "data": base64.b64encode(p.read_bytes()).decode("ascii"),
        }})

    # The API wants 1K/2K/4K uppercase; a lowercase value is silently ignored
    # and you get a 1K square back that looks like the flags did nothing.
    cfg = {"responseModalities": ["TEXT", "IMAGE"],
           "imageConfig": {"imageSize": size.upper()}}
    if entry.get("aspect_ratio"):
        cfg["imageConfig"]["aspectRatio"] = entry["aspect_ratio"]
    return {"contents": [{"role": "user", "parts": parts}], "generationConfig": cfg}


def call(model, payload, key, tries=4):
    """POST one generation. Retries 429 and 5xx with exponential backoff."""
    req = urllib.request.Request(
        f"{HOST}/{model}:generateContent",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "x-goog-api-key": key},
        method="POST",
    )
    for attempt in range(tries):
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            detail = e.read().decode("utf-8", "replace")[:400]
            if e.code in (429, 500, 502, 503, 504) and attempt < tries - 1:
                wait = 2 ** (attempt + 1)
                say(f"    {e.code}, retrying in {wait}s")
                time.sleep(wait)
                continue
            raise RuntimeError(f"HTTP {e.code}: {detail}") from None
        except urllib.error.URLError as e:
            if attempt < tries - 1:
                time.sleep(2 ** (attempt + 1))
                continue
            raise RuntimeError(f"network: {e.reason}") from None
    raise RuntimeError("exhausted retries")


def pull_image(resp):
    """Dig the base64 PNG out of candidates[].content.parts[].inlineData.data."""
    for cand in resp.get("candidates") or []:
        for part in (cand.get("content") or {}).get("parts") or []:
            blob = part.get("inlineData") or part.get("inline_data")
            if blob and blob.get("data"):
                return base64.b64decode(blob["data"])
    blocked = (resp.get("promptFeedback") or {}).get("blockReason")
    if blocked:
        raise RuntimeError(f"blocked by safety filter: {blocked}")
    finish = (resp.get("candidates") or [{}])[0].get("finishReason")
    raise RuntimeError(f"no image in response (finishReason={finish})")


def render(entry, model, size, key):
    out = Path(entry["out"])
    if not out.is_absolute():
        out = ROOT / out
    out.parent.mkdir(parents=True, exist_ok=True)
    data = pull_image(call(model, body(entry, size), key))
    out.write_bytes(data)
    return out, len(data)


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--manifest", default="media/clarity/plates/manifest.json")
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--size", default="2k", choices=["1k", "2k", "4k"],
                    help="imageConfig.imageSize (default 2k)")
    ap.add_argument("--workers", type=int, default=4,
                    help="parallel requests; raise only if your quota allows")
    ap.add_argument("--limit", type=int, help="render at most N entries — use for a pilot")
    ap.add_argument("--only", help="comma-separated entry ids, or a prefix like S002")
    ap.add_argument("--force", action="store_true", help="re-render entries whose file exists")
    ap.add_argument("--live", action="store_true", help="actually spend credits and write files")
    args = ap.parse_args()

    entries = load(args.manifest)

    if args.only:
        want = [s.strip() for s in args.only.split(",") if s.strip()]
        entries = [e for e in entries
                   if e["id"] in want or any(e["id"].startswith(w) for w in want)]

    todo, skipped = [], 0
    for e in entries:
        out = Path(e["out"])
        if not out.is_absolute():
            out = ROOT / out
        if out.exists() and not args.force:
            skipped += 1
            continue
        todo.append(e)

    if args.limit:
        todo = todo[:args.limit]

    unit = PRICES.get(args.model)
    cost = f"~${len(todo) * unit:.2f}" if unit else "unpriced model"
    say(f"manifest : {args.manifest}")
    say(f"model    : {args.model} @ {args.size}")
    say(f"to render: {len(todo)}   already on disk: {skipped}   est: {cost}")

    if not todo:
        say("nothing to do.")
        return 0

    if not args.live:
        for e in todo[:10]:
            say(f"  would render {e['id']:<14} -> {e['out']}")
        if len(todo) > 10:
            say(f"  ... and {len(todo) - 10} more")
        say("\nDRY RUN. Re-run with --live to spend.")
        return 0

    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not key:
        sys.exit("GEMINI_API_KEY is not set. Mint one at aistudio.google.com/apikey "
                 "and export it — never commit it, this repo is public.")

    done, failed, started = [], [], time.time()
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        jobs = {pool.submit(render, e, args.model, args.size, key): e for e in todo}
        for i, fut in enumerate(as_completed(jobs), 1):
            e = jobs[fut]
            try:
                out, size = fut.result()
                done.append(e["id"])
                say(f"[{i}/{len(todo)}] ok   {e['id']:<14} {size // 1024}KB  {out.name}")
            except Exception as exc:  # one bad plate must not kill the run
                failed.append({"id": e["id"], "error": str(exc)})
                say(f"[{i}/{len(todo)}] FAIL {e['id']:<14} {exc}")

    receipts = ROOT / Path(args.manifest).parent / "receipts.json"
    receipts.parent.mkdir(parents=True, exist_ok=True)
    receipts.write_text(json.dumps({
        "model": args.model, "size": args.size,
        "rendered": done, "failed": failed,
        "seconds": round(time.time() - started, 1),
    }, indent=2), encoding="utf-8")

    say(f"\n{len(done)} rendered, {len(failed)} failed, "
        f"{round(time.time() - started)}s. receipts -> {receipts}")
    if failed:
        say("Re-run the same command to retry only the failures — finished plates are skipped.")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
