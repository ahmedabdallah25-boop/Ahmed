#!/usr/bin/env python3
"""Write pending-prompts.txt — every shot still missing an image, ready to paste.

  python3 make_pending_prompts.py [--track A|B]

Reads timeline.csv (run build_timeline.py first) and prompts-ready.txt. Blocks are
grouped by chapter in the pack's own generation order: the keystone chapter first,
then the shared chapter, then S111, then the rest in timeline order. Re-frame
parents are called out because they need the extra pixels.
"""
import csv, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
track = sys.argv[sys.argv.index("--track") + 1].upper() if "--track" in sys.argv else "A"

# timeline.csv is track-resolved, so rebuild it for the track being written rather
# than trusting whatever the last run left behind.
subprocess.run([sys.executable, os.path.join(HERE, "build_timeline.py"), "--track", track],
               check=True, capture_output=True)
rows = list(csv.DictReader(open(os.path.join(HERE, "timeline.csv"), encoding="utf-8")))
neg = ""
for line in open(os.path.join(HERE, "prompts-ready.txt"), encoding="utf-8"):
    if line.startswith("faces, facial features"):
        neg = line.strip()
        break

parents = {}
for r in rows:
    if r["rf_parent"]:
        parents.setdefault(r["rf_parent"], []).append(f'{r["id"]} ({r["tin"]}-{r["tout"]})')

pending = [r for r in rows if r["status"] == "PENDING"]
PRIORITY = ["CH.04", "CH.09", "CH.11", "CH.01", "CH.02", "CH.03", "CH.05",
            "CH.06", "CH.07", "CH.08", "CH.10"]
pending.sort(key=lambda r: (PRIORITY.index(r["chapter"]), int(r["id"][1:])))

out = [
    "=" * 78,
    'CLARITY IN THE QURAN — "THE ONE SOUND THE QURAN FORBIDS YOU TO MAKE"',
    f"PENDING PROMPTS — {len(pending)} shots still to generate · Track {track}",
    "=" * 78,
    "",
    "Generated from timeline.csv. Anything already filed in images/ is not here.",
    "",
    "SETTINGS",
    "  · 16:9. Target 1920x1080 minimum; the batches so far came back 1376x768,",
    "    which is under a 1080p timeline and cannot carry a push.",
    "  · Shots marked RE-FRAME PARENT are pushed into later in the edit. Generate",
    "    those at 2560x1440 or larger, or the move will be soft.",
    "  · No Arabic, no lettering, no numbers — in any shot. The nine Quranic cards",
    "    are typeset in the editor. A generated one cannot be proofed to a mushaf.",
    "  · Check the bottom-right corner for a generator watermark before filing.",
    "",
    "ORDER — the pack's own: keystone first, then the shared chapter, then S111.",
    "  " + " ".join(f"{c}({sum(1 for r in pending if r['chapter'] == c)})"
                    for c in PRIORITY if any(r["chapter"] == c for r in pending)),
    "",
]

chapter = None
for r in pending:
    if r["chapter"] != chapter:
        chapter = r["chapter"]
        out += ["", "=" * 78, f"{chapter}", "=" * 78, ""]
    out.append("-" * 78)
    head = f'{r["id"]} · {r["tin"]}–{r["tout"]} · {r["dur"]}s'
    out.append(head)
    if r["id"] in parents:
        out.append(f'  ** RE-FRAME PARENT — generate large. Pushed into by: {", ".join(parents[r["id"]])}')
    out += ["-" * 78, "PROMPT", r["prompt"], "", "NEGATIVE", neg, ""]

path = os.path.join(HERE, f"pending-prompts{'' if track == 'A' else '-trackB'}.txt")
open(path, "w", encoding="utf-8").write("\n".join(out))
print(f"{len(pending)} pending prompts -> {os.path.basename(path)}")
