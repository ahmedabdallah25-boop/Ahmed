#!/usr/bin/env python3
"""Generate channel stills and clips with Alibaba's Qwen-Image and Wan models.

Reads the job list in qwen-media.json, submits every job to DashScope at once,
polls until each task finishes, and downloads the results.

  python automation/qwen_media.py --list
  python automation/qwen_media.py --only part14-thumb-A
  python automation/qwen_media.py --kind image --out media/thumbs
  python automation/qwen_media.py --dry-run          # print prompts, call nothing

Needs DASHSCOPE_API_KEY (QWEN_API_KEY is accepted too). Stdlib only, so CI needs
no pip install.

Every job is submitted before any is polled, so a batch of twelve stills costs
one task's wall-clock, not twelve. A run is green only if every selected job
produced a file — a partial batch exits 1.
"""
import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

HERE = Path(__file__).parent
CONFIG = json.loads((HERE / "qwen-media.json").read_text())

SUBMIT_PATHS = {
    "image": "/api/v1/services/aigc/text2image/image-synthesis",
    "video": "/api/v1/services/aigc/video-generation/video-synthesis",
}
TASK_PATH = "/api/v1/tasks/{task_id}"
TERMINAL = {"SUCCEEDED", "FAILED", "CANCELED", "UNKNOWN"}
MEDIA_SUFFIXES = (".png", ".jpg", ".jpeg", ".webp", ".mp4", ".mov", ".webm")


def api_key() -> str:
    key = os.environ.get("DASHSCOPE_API_KEY") or os.environ.get("QWEN_API_KEY")
    if not key:
        sys.exit("Need DASHSCOPE_API_KEY (or QWEN_API_KEY) — see .github/QWEN.md")
    return key


def call(path: str, key: str, body: dict | None = None, asynchronous: bool = False) -> dict:
    """POST when body is given, GET otherwise. Raises RuntimeError on API errors."""
    url = CONFIG["endpoint"].rstrip("/") + path
    headers = {"Authorization": f"Bearer {key}"}
    data = None
    if body is not None:
        headers["Content-Type"] = "application/json"
        data = json.dumps(body).encode()
    if asynchronous:
        headers["X-DashScope-Async"] = "enable"
    req = urllib.request.Request(url, data=data, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        # DashScope puts the useful part (code, message) in the body, not the status.
        detail = e.read().decode("utf-8", "replace")[:500]
        raise RuntimeError(f"HTTP {e.code} from {path}: {detail}") from None
    except urllib.error.URLError as e:
        raise RuntimeError(f"Could not reach {url}: {e.reason}") from None


def build_request(job: dict) -> dict:
    """Merge the house style and the per-kind defaults into one DashScope body."""
    kind = job.get("kind", "image")
    defaults = dict(CONFIG.get(kind, {}))
    model = job.get("model") or defaults.pop("model")

    prompt = job["prompt"]
    style = job.get("style", CONFIG.get("house_style", ""))
    if style and not job.get("no_style"):
        prompt = f"{prompt.rstrip().rstrip('.')}. {style.strip()}"

    negative = job.get("negative_prompt", CONFIG.get("negative_prompt", ""))
    inputs = {"prompt": prompt}
    if negative:
        inputs["negative_prompt"] = negative

    parameters = {k: v for k, v in defaults.items() if k != "model"}
    parameters.update(job.get("parameters", {}))
    return {"model": model, "input": inputs, "parameters": parameters}


def find_urls(node) -> list[str]:
    """Pull result URLs out of the task payload.

    The field differs by model family (results[].url for images, video_url for
    Wan), so walk the whole output rather than betting on one shape.
    """
    found = []
    if isinstance(node, str):
        clean = node.split("?", 1)[0].lower()
        if node.startswith("http") and clean.endswith(MEDIA_SUFFIXES):
            found.append(node)
    elif isinstance(node, dict):
        for value in node.values():
            found += find_urls(value)
    elif isinstance(node, list):
        for value in node:
            found += find_urls(value)
    return found


def download(url: str, dest: Path) -> Path:
    suffix = Path(url.split("?", 1)[0]).suffix or ".bin"
    dest = dest.with_suffix(suffix)
    dest.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url, timeout=300) as resp, dest.open("wb") as f:
        while chunk := resp.read(1 << 16):
            f.write(chunk)
    return dest


def select(args) -> list[dict]:
    jobs = CONFIG["jobs"]
    if args.kind:
        jobs = [j for j in jobs if j.get("kind", "image") == args.kind]
    if args.only:
        wanted = [n.strip() for n in args.only.split(",") if n.strip()]
        by_name = {j["name"]: j for j in jobs}
        missing = [n for n in wanted if n not in by_name]
        if missing:
            sys.exit(f"No such job(s): {', '.join(missing)}. Try --list.")
        jobs = [by_name[n] for n in wanted]
    return jobs


def main():
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("--only", help="comma-separated job names")
    p.add_argument("--kind", choices=("image", "video"))
    p.add_argument("--out", default=CONFIG.get("out_dir", "media/qwen"))
    p.add_argument("--timeout", type=int, default=CONFIG.get("timeout_seconds", 900),
                   help="seconds to wait for the whole batch (default %(default)s)")
    p.add_argument("--list", action="store_true", help="show the jobs and exit")
    p.add_argument("--dry-run", action="store_true", help="print request bodies, call nothing")
    args = p.parse_args()

    jobs = select(args)
    if not jobs:
        sys.exit("No jobs matched.")

    if args.list:
        for job in jobs:
            print(f"{job['name']:<28} {job.get('kind', 'image'):<6} {job['prompt'][:70]}…")
        return

    if args.dry_run:
        for job in jobs:
            print(f"--- {job['name']}")
            print(json.dumps(build_request(job), indent=2, ensure_ascii=False))
        return

    key = api_key()
    out = Path(args.out)

    # Submit everything first, then poll — the batch runs in parallel server-side.
    pending, failures = {}, {}
    for job in jobs:
        kind = job.get("kind", "image")
        try:
            resp = call(SUBMIT_PATHS[kind], key, build_request(job), asynchronous=True)
            task_id = resp.get("output", {}).get("task_id")
            if not task_id:
                raise RuntimeError(f"no task_id in response: {json.dumps(resp)[:300]}")
            pending[job["name"]] = task_id
            print(f"submitted  {job['name']:<28} {task_id}")
        except RuntimeError as e:
            failures[job["name"]] = str(e)
            print(f"FAILED     {job['name']:<28} {e}", file=sys.stderr)

    written, deadline = {}, time.monotonic() + args.timeout
    while pending:
        if time.monotonic() > deadline:
            for name in pending:
                failures[name] = f"still running after {args.timeout}s"
            break
        time.sleep(CONFIG.get("poll_seconds", 10))
        for name, task_id in list(pending.items()):
            try:
                output = call(TASK_PATH.format(task_id=task_id), key).get("output", {})
            except RuntimeError as e:
                failures[name] = str(e)
                pending.pop(name)
                continue

            status = output.get("task_status", "UNKNOWN")
            if status not in TERMINAL:
                continue
            pending.pop(name)

            urls = find_urls(output)
            if status != "SUCCEEDED" or not urls:
                reason = output.get("message") or output.get("code") or "no media in the result"
                failures[name] = f"{status}: {reason}"
                print(f"FAILED     {name:<28} {failures[name]}", file=sys.stderr)
                continue

            paths = [download(url, out / (name if len(urls) == 1 else f"{name}-{i + 1}"))
                     for i, url in enumerate(urls)]
            written[name] = paths
            print(f"done       {name:<28} {', '.join(str(x) for x in paths)}")

    print(f"\n{len(written)}/{len(jobs)} job(s) produced files in {out}/")
    if failures:
        print(f"{len(failures)} failed:", file=sys.stderr)
        for name, why in failures.items():
            print(f"  {name}: {why}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
