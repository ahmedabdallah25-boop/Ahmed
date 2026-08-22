#!/usr/bin/env python3
"""Export the two things a producer actually works from.

    python automation/clarity_export.py

  media/clarity/export/clarity-image-prompts.csv    180 plate prompts
  media/clarity/export/clarity-voiceover-script.txt 28 TTS batches, clean
  media/clarity/export/vo/batch-NN.txt              one file per batch

The repo already holds both of these — plates/manifest.json and
script-revelation-order.md — but neither is a working format. The manifest is a
200KB JSON for programmatic use; the script is a documented markdown file with
blockquote markers, timecodes and [VERIFY] tags threaded through the prose. This
strips both down to what gets pasted into a generator.

WHAT IS DELIBERATELY REMOVED FROM THE VO TEXT

[VERIFY] tags. They are editorial markers and were never spoken — the script is
built so each sentence survives its own tag being deleted. But removing them
silently would be the whole point of the convention lost, so every one is listed
in the header of the exported script, against the batch it came from. Nothing
that needs checking disappears just because it left the recording text.
"""
import csv
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "media" / "clarity" / "plates" / "manifest.json"
SCRIPT = ROOT / "clarity" / "script-revelation-order.md"
OUT = ROOT / "media" / "clarity" / "export"

VERIFY = re.compile(r"`\[VERIFY:?\s*([^\]]*)\]`")

# Markdown emphasis is invisible in the rendered document and audible in a TTS
# render: an engine reads *order* as a literal asterisk, or mis-stresses the
# word around it. The script uses italics for stress, which is right in the
# document and must never reach the engine.
MD = [(re.compile(r"\*\*([^*\n]+)\*\*"), r"\1"),
      (re.compile(r"\*([^*\n]+)\*"), r"\1"),
      (re.compile(r"`([^`\n]+)`"), r"\1"),
      (re.compile(r"(?<!\w)_([^_\n]+)_(?!\w)"), r"\1")]


def export_prompts():
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    dest = OUT / "clarity-image-prompts.csv"
    with dest.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["id", "scene", "seed_group", "pass", "act", "cue_at",
                    "vo_cue", "prompt", "negative_prompt", "aspect_ratio", "save_as"])
        for e in data["entries"]:
            w.writerow([e["id"], e["scene"], e["seed_group"], e["pass"], e["act"],
                        e["cue_at"], e["vo_cue"], e["prompt"], e["negative"],
                        e["aspect_ratio"], Path(e["out"]).name])
    return dest, len(data["entries"]), data["scenes"]


def batches():
    src = SCRIPT.read_text(encoding="utf-8")
    out, act = [], None
    parts = re.split(r"(^### BATCH .*$|^# ACT .*$)", src, flags=re.M)
    for i in range(1, len(parts), 2):
        head, body = parts[i], parts[i + 1]
        if head.startswith("# ACT"):
            act = head.lstrip("# ").strip()
            continue
        num, tc = re.search(r"BATCH (\d+) · ([\d:–]+)", head).groups()
        raw = body.split("\n---")[0].split("\n# ")[0]
        lines = [l.strip()[1:].strip() for l in raw.split("\n") if l.strip().startswith(">")]
        # blank quote lines are paragraph breaks in the source; keep them as such
        paras, cur = [], []
        for l in lines:
            if l:
                cur.append(l)
            elif cur:
                paras.append(" ".join(cur)); cur = []
        if cur:
            paras.append(" ".join(cur))
        text = "\n\n".join(paras)
        flags = VERIFY.findall(text)
        text = re.sub(r"\s+", " ", VERIFY.sub("", text))
        # re-split into paragraphs after the whitespace collapse
        text = "\n\n".join(p.strip() for p in "\n\n".join(paras).split("\n\n"))
        text = VERIFY.sub("", text)
        text = "\n\n".join(re.sub(r"[ \t]+", " ", p).strip() for p in text.split("\n\n"))
        text = re.sub(r"\s+([.,;:])", r"\1", text)
        for rx, rep in MD:
            text = rx.sub(rep, text)
        out.append({"n": num, "tc": tc, "act": act, "text": text, "verify": flags})
    return out


def export_vo():
    bs = batches()
    (OUT / "vo").mkdir(parents=True, exist_ok=True)
    for b in bs:
        (OUT / "vo" / f"batch-{b['n']}.txt").write_text(b["text"] + "\n", encoding="utf-8")

    flagged = [(b["n"], v) for b in bs for v in b["verify"]]
    longest = max(len(b["text"]) for b in bs)
    words = sum(len(b["text"].split()) for b in bs)

    head = [
        "CLARITY IN THE QURAN — VOICEOVER SCRIPT",
        "Every Surah in the Order It Was Actually Revealed",
        "",
        f"{len(bs)} batches · {words:,} words · longest batch {longest} characters",
        "",
        "HOW TO GENERATE",
        "",
        "  Paste ONE batch at a time. Every batch is under 2,400 characters, which",
        "  clears the smallest common TTS cap without re-splitting.",
        "",
        "  1. Same voice and identical settings on every batch. Write them down",
        "     before batch 01 and do not tune mid-way — a stability change at",
        "     batch 09 is audible as a different person.",
        "  2. If a batch needs a fix, regenerate it AND the one before it, then",
        "     listen to the seam. Never regenerate one in isolation.",
        "  3. Leave about 350ms of silence at each join, not zero.",
        "  4. Numbers are written as words on purpose. Do not convert them to",
        "     digits — engines read bare digits inconsistently between batches.",
        "  5. Arabic is transliterated on purpose, for the same reason. The Arabic",
        "     the viewer SEES is typeset in the edit, not spoken by the engine.",
        "",
        "  Seven recitation inserts are NOT in this file and must not be",
        "  synthesised. They are a real reciter: Al-Alaq 96:1-5, the oath-openings",
        "  montage, Al-Kawthar 108, Al-Isra 17:23-24, Al-Hujurat 49:13,",
        "  Al-Maida 5:3, An-Nasr 110. See the scene pack for placement.",
        "",
        "CHECK BEFORE YOU RECORD",
        "",
        f"  The script carries {len(flagged)} claims marked for verification. They are",
        "  NOT in the text below — they were editorial markers, never spoken — but",
        "  the claims themselves are still in the sentences. Clear each against a",
        "  printed source first. Each sentence is written to survive deletion, so",
        "  anything you cannot source can be cut rather than softened.",
        "",
    ]
    for n, v in flagged:
        head.append(f"  batch {n} — {v}")
    head += ["", "=" * 78, ""]

    body = []
    seen_act = None
    for b in bs:
        if b["act"] != seen_act:
            seen_act = b["act"]
            body += ["", "-" * 78, seen_act, "-" * 78, ""]
        body += [f"[ BATCH {b['n']} · {b['tc']} · {len(b['text'])} chars ]", "",
                 b["text"], ""]

    dest = OUT / "clarity-voiceover-script.txt"
    dest.write_text("\n".join(head + body).rstrip() + "\n", encoding="utf-8")
    return dest, len(bs), words, longest, len(flagged)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    p, n, scenes = export_prompts()
    print(f"{p.relative_to(ROOT)}  —  {n} plates across {scenes} scenes")
    v, nb, words, longest, flags = export_vo()
    print(f"{v.relative_to(ROOT)}  —  {nb} batches, {words:,} words, "
          f"longest {longest} chars, {flags} verify notes")
    print(f"{(OUT / 'vo').relative_to(ROOT)}/batch-NN.txt  —  {nb} single-batch files")
    if longest > 2400:
        print("WARNING: a batch exceeds the 2,400-character working cap")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
