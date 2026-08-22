#!/usr/bin/env python3
"""Fail if clarity/vo-emotion-tags.json has drifted from the script it tags.

    python automation/test_clarity_vo_tags.py

The tag config addresses the VO script by quoting a sentence out of it. That is
the right way round — line numbers and character offsets rot on the first edit,
a quoted sentence does not — but it means the two files can silently disagree.
Reword one sentence in script-revelation-order.md and its anchor matches nothing;
the export still runs, the tag simply never appears, and the only way to notice
is to read 40KB of output looking for a bracket that is not there.

Four checks.

  1. Every anchor resolves to EXACTLY ONE position in its batch. Zero means a
     tag that silently vanished. Two or more means the tag lands wherever the
     string first happened to occur, which is not where anybody chose.

  2. Every tag is in allowed_tags, and allowed_tags contains nothing
     performative. This is a Quran channel; [laughs] or [shouting] over this
     material is a credibility problem, not a taste one, and the guard belongs
     in the repo rather than in whoever is editing the JSON that day.

  3. No tag opens a batch. A tag at character 0 is the model's strongest and
     most literal reading of it — nothing precedes it in that generation to
     moderate it — and it fires exactly at the seam where the previous batch's
     audio ends, so every join gets an audible restart. The first draft of the
     config had 23 of 32 tags there, because it was written by scanning each
     batch's opening line rather than reading for the turn.

  4. Density stays sparing. One tag per ~190 words is the documented intent;
     a config that has crept past one per 100 is a performance that swings
     line to line, which on this subject reads as insincere.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from clarity_export import batches  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
TAGS = ROOT / "clarity" / "vo-emotion-tags.json"

PERFORMATIVE = ("laugh", "shout", "sarcas", "excited", "sings", "giggl", "sigh")
MIN_WORDS_PER_TAG = 100


def main():
    cfg = json.loads(TAGS.read_text(encoding="utf-8"))
    bs = batches()
    by_n = {b["n"]: b for b in bs}
    allowed = set(cfg["allowed_tags"])
    placements = cfg["placements"]
    fails = []

    for p in placements:
        n, tag, anchor = p["batch"], p["tag"], p["anchor"]
        if n not in by_n:
            fails.append(f"batch {n}: no such batch in the script")
            continue
        text = by_n[n]["text"]
        hits = text.count(anchor)
        if hits != 1:
            fails.append(f"batch {n}: anchor {anchor!r} appears {hits} times, "
                         "needs exactly 1")
        elif text.startswith(anchor):
            fails.append(f"batch {n}: [{tag}] would open the batch — anchor "
                         f"{anchor!r} is its first sentence. Move it to the "
                         "sentence where the register actually turns.")
        if tag not in allowed:
            fails.append(f"batch {n}: [{tag}] is not in allowed_tags")

    bad = [t for t in allowed if any(w in t.lower() for w in PERFORMATIVE)]
    if bad:
        fails.append("allowed_tags contains performative direction: "
                     + ", ".join(sorted(bad)))

    words = sum(len(b["text"].split()) for b in bs)
    per = words // max(len(placements), 1)
    if per < MIN_WORDS_PER_TAG:
        fails.append(f"density is 1 tag per {per} words — under the "
                     f"{MIN_WORDS_PER_TAG}-word floor. The tags are meant to mark "
                     "the few places the register turns, not decorate the prose.")

    if fails:
        print("FAIL: clarity/vo-emotion-tags.json is out of sync with the script.\n")
        for f in fails:
            print("  " + f)
        return 1

    kinds = {}
    for p in placements:
        kinds[p["tag"]] = kinds.get(p["tag"], 0) + 1
    print(f"OK: {len(placements)} tags across {len({p['batch'] for p in placements})}"
          f"/{len(bs)} batches — 1 per {per} words, none opening a batch")
    for t, c in sorted(kinds.items(), key=lambda kv: -kv[1]):
        print(f"  {t:<12} {c}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
