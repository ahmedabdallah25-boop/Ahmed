#!/usr/bin/env python3
"""Measure a Clarity script instead of asserting its numbers.

    python3 automation/clarity_measure.py clarity/script-appointed-time.md

Every Clarity script carries a runtime table at the top, and the repo convention is
"measured, not estimated". This walks the file and produces those numbers, so the
table can be corrected rather than guessed at.

WHAT COUNTS AS SPOKEN

Only blockquote lines ('> ') inside a '### BATCH' section. Everything else in the
file is documentation. From those lines it removes:

  [VERIFY: ...]            editorial markers, never spoken, may wrap across lines
  [RECITATION INSERT ...]  a real reciter is heard here, not the TTS voice
  `backticks` and *emphasis*   markup a TTS engine would read aloud or mis-stress

The recitation seconds are read out of the insert markers themselves ('· 20s'),
and a mid-roll CTA is read out of its own heading the same way, so the finished
runtime is speech plus everything else on the timeline and not a separate guess.

KNOWN LIMIT. The seconds are only read when the marker carries them in the form
'[RECITATION INSERT · Al-A'raf 7:34 · 14s]'. script-revelation-order.md writes
its inserts without the trailing '· Ns', so this reports 0 recitation seconds
for that file and its finished runtime comes out as speech alone. Its word and
batch counts are still correct. Add the durations to those markers, or read that
file's own table for the runtime.
"""
import re
import sys
from pathlib import Path

BATCH_RE = re.compile(r"^###\s+BATCH\s+(\d+)", re.M)
VERIFY_RE = re.compile(r"\[VERIFY:.*?\]", re.S)
RECITE_RE = re.compile(r"\[RECITATION INSERT[^\]]*\]")
SECONDS_RE = re.compile(r"\[RECITATION INSERT[^\]]*?·\s*(\d+)s\s*\]")
CTA_RE = re.compile(r"MID-ROLL CTA[^\n]*?·\s*(\d+)s")


def clean(text: str) -> str:
    text = VERIFY_RE.sub(" ", text)
    text = RECITE_RE.sub(" ", text)
    text = text.replace("`", "").replace("**", "").replace("*", "")
    return re.sub(r"\s+", " ", text).strip()


def main(path: Path) -> int:
    src = path.read_text(encoding="utf-8")

    recitation_s = sum(int(m) for m in SECONDS_RE.findall(src))
    cta_s = sum(int(m) for m in CTA_RE.findall(src))
    verify_n = len(VERIFY_RE.findall(src))

    starts = [(m.group(1), m.start()) for m in BATCH_RE.finditer(src)]
    if not starts:
        print(f"no '### BATCH' sections found in {path}", file=sys.stderr)
        return 1
    bounds = [(n, s, (starts[i + 1][1] if i + 1 < len(starts) else len(src)))
              for i, (n, s) in enumerate(starts)]

    total_words = 0
    longest = ("", 0)
    print(f"{'batch':>6}  {'words':>6}  {'chars':>6}")
    for name, start, end in bounds:
        quoted = [ln[2:] for ln in src[start:end].splitlines() if ln.startswith("> ")]
        # A [VERIFY:] block can wrap across quoted lines, so clean the joined text.
        body = clean("\n".join(quoted))
        words, chars = len(body.split()), len(body)
        total_words += words
        if chars > longest[1]:
            longest = (name, chars)
        print(f"{name:>6}  {words:>6}  {chars:>6}")

    def hms(sec: float) -> str:
        return f"{int(sec) // 60}:{int(sec) % 60:02d}"

    print()
    print(f"batches                 {len(bounds)}")
    print(f"spoken words            {total_words:,}")
    print(f"longest batch           {longest[1]:,} chars (batch {longest[0]})")
    print(f"[VERIFY] tags           {verify_n}")
    print(f"recitation inserts      {len(SECONDS_RE.findall(src))}, {recitation_s}s")
    print(f"mid-roll CTA            {cta_s}s")
    for wpm in (140, 130):
        speech = total_words / wpm * 60
        print(f"at {wpm} wpm              speech {hms(speech)}   "
              f"finished {hms(speech + recitation_s + cta_s)}")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__, file=sys.stderr)
        sys.exit(2)
    sys.exit(main(Path(sys.argv[1])))
