#!/usr/bin/env python3
"""
Recover the storyboard out of the original render.

The source Short burned its narration in at ~24px, highlighting the spoken word
in amber. That caption track is a free, perfectly-synced transcript — this reads
it back out, so the new captions land on the same syllables without any speech
recognition (HuggingFace is blocked on this network, so Whisper was not an
option anyway).

Three passes, in this order, because OCR is the expensive and least reliable
part and this arrangement needs the fewest calls at the best input quality:

1. **Segment with pixels, not text.** Within one caption line the glyph mask
   never changes — only the amber highlight moves. Hashing the binarised text
   mask splits the 600 sampled frames into ~30 distinct lines for free.
2. **OCR once per line, upscaled 3x.** Small type OCRs badly at native size;
   one clean read per line beats 600 noisy ones.
3. **Word timings from the highlight.** Column gaps in the glyph mask give word
   boundaries; the amber run says which word is being spoken.

Usage:
    ffmpeg -i source.mp4 -vf "crop=1080:150:0:1140,fps=10" strip/%04d.png
    python build_beats.py <strip-dir> <out.json>
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

SAMPLE_FPS = 10
VIDEO_FPS = 30

PILL_DARK = 95        # luminance below this is pill background
TEXT_BRIGHT = 120     # luminance above this is glyph
WORD_GAP = 8          # empty columns that separate two words
MIN_PILL_W = 70       # narrower than this is a chart label, not a caption
MAX_PILL_W = 940      # wider than this is a full-width table row
MIN_PILL_H, MAX_PILL_H = 28, 78
UPSCALE = 3


def _norm(s: str) -> str:
    """Compare captions ignoring the spacing and case OCR is unreliable about."""
    return "".join(c for c in s.lower() if c.isalnum())


def luminance(a: np.ndarray) -> np.ndarray:
    return a[:, :, 0] * 0.299 + a[:, :, 1] * 0.587 + a[:, :, 2] * 0.114


def find_pill(lum: np.ndarray):
    """Locate the narration pill: a dark, centred, non-full-width rounded box."""
    dark = lum < PILL_DARK
    rows = np.nonzero(dark.sum(1) > 120)[0]
    if rows.size < MIN_PILL_H:
        return None
    for band in sorted(
        np.split(rows, np.nonzero(np.diff(rows) > 4)[0] + 1), key=len, reverse=True
    ):
        h = len(band)
        if not (MIN_PILL_H <= h <= MAX_PILL_H):
            continue
        y0, y1 = int(band[0]), int(band[-1])
        # 0.3 not 0.7: a column running through a glyph stroke is only ~40%
        # dark, and a stricter threshold carves the pill up at every letter.
        cols = np.nonzero(dark[y0:y1 + 1].sum(0) > h * 0.3)[0]
        if cols.size < MIN_PILL_W:
            continue
        # The pill is a solid rectangle, so its columns are contiguous. Taking
        # min/max here instead would swallow any chart rule sharing these rows.
        run = max(
            np.split(cols, np.nonzero(np.diff(cols) > 15)[0] + 1), key=len
        )
        x0, x1 = int(run[0]), int(run[-1])
        w = x1 - x0
        if not (MIN_PILL_W <= w <= MAX_PILL_W):
            continue          # too narrow to be text, or a full-width table row
        return y0, y1, x0, x1
    return None


def word_clusters(mask: np.ndarray):
    """Column runs of glyph pixels, merged across gaps narrower than WORD_GAP."""
    cols = mask.sum(0) > 0
    clusters, start, gap = [], None, 0
    for x, on in enumerate(cols):
        if on:
            if start is None:
                start = x
            gap = 0
        elif start is not None:
            gap += 1
            if gap >= WORD_GAP:
                clusters.append((start, x - gap))
                start = None
    if start is not None:
        clusters.append((start, len(cols) - 1))
    return [c for c in clusters if c[1] - c[0] >= 3]


def analyse(png: Path):
    a = np.array(Image.open(png).convert("RGB")).astype(float)
    pill = find_pill(luminance(a))
    if pill is None:
        return None
    y0, y1, x0, x1 = pill
    sub = a[y0 + 3:y1 - 2, x0 + 4:x1 - 3]
    if sub.size == 0 or sub.shape[0] < 10:
        return None

    text = luminance(sub) > TEXT_BRIGHT
    clusters = word_clusters(text)
    if not clusters:
        return None

    R, G, B = sub[:, :, 0], sub[:, :, 1], sub[:, :, 2]
    amber = (R > 160) & (B < 140) & ((R - B) > 82) & ((G - B) > 34) & text
    acols = np.nonzero(amber.sum(0) > 0)[0]
    hl = (int(acols.min()), int(acols.max())) if acols.size > 5 else None

    return {
        "idx": int(png.stem),
        "box": (y0, y1, x0, x1),
        "clusters": clusters,
        "hl": hl,
        # Signature: glyph layout is constant across a line; the highlight is not.
        "sig": (x1 - x0, len(clusters), tuple(c[0] // 6 for c in clusters)),
        "png": png,
    }


def ocr_line(rec, ocr) -> str:
    """One high-quality read of the whole pill, upscaled."""
    y0, y1, x0, x1 = rec["box"]
    im = Image.open(rec["png"]).convert("RGB").crop((x0 + 3, y0 + 2, x1 - 2, y1 - 1))
    im = im.resize((im.width * UPSCALE, im.height * UPSCALE), Image.LANCZOS)
    res, _ = ocr(np.array(im))
    if not res:
        return ""
    res.sort(key=lambda r: min(p[0] for p in r[0]))
    return " ".join(r[1] for r in res).strip()


def main(strip_dir: str, out_path: str) -> None:
    from rapidocr_onnxruntime import RapidOCR

    ocr = RapidOCR()
    recs = [analyse(p) for p in sorted(Path(strip_dir).glob("*.png"))]

    # --- pass 1: segment by glyph signature ---------------------------------
    segments = []
    for r in recs:
        if r is None:
            continue
        if segments and segments[-1]["sig"] == r["sig"] and r["idx"] - segments[-1]["end"] <= 2:
            segments[-1]["end"] = r["idx"]
            segments[-1]["frames"].append(r)
        else:
            segments.append(
                {"sig": r["sig"], "start": r["idx"], "end": r["idx"], "frames": [r]}
            )
    segments = [s for s in segments if s["end"] - s["start"] >= 2]

    # --- pass 2: one OCR per segment, from its cleanest frame ---------------
    for s in segments:
        mid = s["frames"][len(s["frames"]) // 2]
        s["line"] = ocr_line(mid, ocr)
        s["clusters"] = mid["clusters"]

    segments = [s for s in segments if s["line"]]

    # The glyph signature drifts a little as the amber highlight moves, so one
    # spoken line can land in two or three segments. Merge neighbours that read
    # as the same sentence, and keep the reading with the most words (OCR drops
    # characters more often than it invents them).
    merged = []
    for s in segments:
        prev = merged[-1] if merged else None
        same = (
            prev
            and s["start"] - prev["end"] <= 4
            and _norm(s["line"]) == _norm(prev["line"])
        )
        if same:
            prev["end"] = s["end"]
            prev["frames"] += s["frames"]
            if len(s["line"].split()) > len(prev["line"].split()):
                prev["line"], prev["clusters"] = s["line"], s["clusters"]
        else:
            merged.append(s)
    segments = merged

    # --- pass 3: word timings from the amber highlight ----------------------
    out = []
    for si, seg in enumerate(segments):
        words = seg["line"].split()
        if not words:
            continue
        seg_from = round(seg["start"] * VIDEO_FPS / SAMPLE_FPS)
        seg_to = round((seg["end"] + 1) * VIDEO_FPS / SAMPLE_FPS)
        if si + 1 < len(segments):
            seg_to = min(seg_to, round(segments[si + 1]["start"] * VIDEO_FPS / SAMPLE_FPS))
        if seg_to - seg_from < 4:
            continue

        n_cl = len(seg["clusters"])
        first_seen = {}
        for f in seg["frames"]:
            if not f["hl"]:
                continue
            hx0, hx1 = f["hl"]
            hit = next(
                (i for i, (c0, c1) in enumerate(seg["clusters"])
                 if min(hx1, c1) >= max(hx0, c0) - 3),
                None,
            )
            if hit is None:
                continue
            wi = hit if n_cl == len(words) else (
                min(len(words) - 1, round(hit * (len(words) - 1) / (n_cl - 1)))
                if n_cl > 1 else 0
            )
            first_seen.setdefault(wi, f["idx"])

        starts = [
            round(first_seen[i] * VIDEO_FPS / SAMPLE_FPS) if i in first_seen else None
            for i in range(len(words))
        ]

        known = [i for i, s_ in enumerate(starts) if s_ is not None]
        if not known:
            span = (seg_to - seg_from) / len(words)
            starts = [round(seg_from + i * span) for i in range(len(words))]
        else:
            if known[0] != 0:
                starts[0] = seg_from
                known = [0] + known
            for a, b in zip(known, known[1:]):
                if b - a > 1:
                    step = (starts[b] - starts[a]) / (b - a)
                    for k in range(a + 1, b):
                        starts[k] = round(starts[a] + step * (k - a))
            last = known[-1]
            if last < len(words) - 1:
                step = max(3, (seg_to - starts[last]) / (len(words) - last))
                for k in range(last + 1, len(words)):
                    starts[k] = round(starts[last] + step * (k - last))

        starts = [max(seg_from, s_) for s_ in starts]
        for i in range(1, len(starts)):
            starts[i] = max(starts[i], starts[i - 1] + 2)

        ends = starts[1:] + [seg_to]
        out.append({
            "from": seg_from,
            "to": seg_to,
            "words": [
                {"text": w, "from": s_, "to": max(s_ + 2, e)}
                for w, s_, e in zip(words, starts, ends)
            ],
        })

    json.dump(out, open(out_path, "w"), indent=1)
    print(f"{len(out)} caption lines -> {out_path}")
    for c in out:
        print(f'{c["from"]:>5}-{c["to"]:<5} {" ".join(w["text"] for w in c["words"])}')


if __name__ == "__main__":
    main(*sys.argv[1:3])
