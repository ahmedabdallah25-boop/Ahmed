#!/usr/bin/env python3
"""Build a clean SRT caption track from a timestamped YouTube transcript dump.

Why this exists: both long-form uploads shipped with `hasCaption: false`. Search
is one of only three surfaces a 191-sub channel can reach with long-form, and an
uncaptioned 18-minute talking explainer gives search nothing to index. The
earlier run concluded a caption track needed the video master file — it doesn't.
`captions().insert` takes a caption file and a video id, nothing else.

Input is the transcript JSON shape returned by the Nexlev transcript tool:

    {"videoId": "...", "transcript": [{"startMs", "endMs", "startTime", "text"}, ...]}

ASR returns a *rolling* window: cue time ranges overlap heavily, but the text
does not repeat. So the clean reconstruction is to treat each cue's text as new
words and let each cue end where the next one starts.

Usage:
    python make_captions.py transcript.json ../media/<video_id>.srt
"""
import json
import re
import sys
from pathlib import Path

MAX_LINE = 42      # characters per caption line — broadcast-standard readability
MAX_LINES = 2
MIN_CUE_MS = 1000
MAX_CUE_MS = 6000

# ASR speaker-change markers and bracketed non-speech events add nothing to a
# single-narrator explainer and hurt the indexable text.
NOISE = re.compile(r"(>>|\[[^\]]*\])")


def load_words(path: Path):
    """Flatten transcript cues into (word, start_ms, end_ms), timing interpolated.

    Each cue's end is clamped to the next cue's start, undoing the rolling-window
    overlap. Words inside a cue are spread evenly across its corrected duration.
    """
    data = json.loads(path.read_text())
    cues = sorted(data["transcript"], key=lambda c: int(c["startMs"]))

    words = []
    for i, cue in enumerate(cues):
        text = NOISE.sub(" ", cue["text"])
        tokens = text.split()
        if not tokens:
            continue

        start = int(cue["startMs"])
        end = int(cue["endMs"])
        if i + 1 < len(cues):
            end = min(end, int(cues[i + 1]["startMs"]))
        if end <= start:
            end = start + 40 * len(tokens)

        step = (end - start) / len(tokens)
        for j, token in enumerate(tokens):
            words.append((token, start + round(j * step), start + round((j + 1) * step)))
    return words


def group(words):
    """Regroup words into caption cues that respect line length and duration."""
    budget = MAX_LINE * MAX_LINES
    cues, cur = [], []

    def flush():
        if cur:
            cues.append((" ".join(w for w, _, _ in cur), cur[0][1], cur[-1][2]))
            cur.clear()

    for word, start, end in words:
        too_long = cur and len(" ".join(w for w, _, _ in cur)) + 1 + len(word) > budget
        too_slow = cur and end - cur[0][1] > MAX_CUE_MS
        if too_long or too_slow:
            flush()
        cur.append((word, start, end))
        # A sentence ending is the most natural place to break a caption.
        if word.endswith((".", "?", "!")) and len(" ".join(w for w, _, _ in cur)) > MAX_LINE:
            flush()
    flush()
    return cues


def wrap(text):
    """Balance a cue across at most MAX_LINES lines."""
    words, lines, cur = text.split(), [], ""
    for word in words:
        candidate = f"{cur} {word}".strip()
        if cur and len(candidate) > MAX_LINE and len(lines) < MAX_LINES - 1:
            lines.append(cur)
            cur = word
        else:
            cur = candidate
    lines.append(cur)
    return "\n".join(lines)


def ts(ms):
    ms = max(0, int(ms))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def to_srt(cues):
    out = []
    for i, (text, start, end) in enumerate(cues, 1):
        end = max(end, start + MIN_CUE_MS)
        if i < len(cues):                       # never overlap the next cue
            end = min(end, cues[i][1])
        out.append(f"{i}\n{ts(start)} --> {ts(end)}\n{wrap(text)}\n")
    return "\n".join(out)


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src, dest = Path(sys.argv[1]), Path(sys.argv[2])
    cues = group(load_words(src))
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(to_srt(cues), encoding="utf-8")
    words = sum(len(c[0].split()) for c in cues)
    print(f"{dest}: {len(cues)} cues, {words} words, ends {ts(cues[-1][2])}")


if __name__ == "__main__":
    main()
