#!/usr/bin/env python3
"""Builds a contact sheet of the Inflation footage and scores caption zones.

Two jobs, one decode:

  1. Tile one representative still per detected scene into a labelled grid, so
     the cut list can be checked by eye and every shot judged at a glance.
  2. Score the three candidate caption bands (top / middle / bottom) of each
     scene for how "busy" they are, so captions can be placed where the frame
     is actually empty rather than always pinned to the bottom.

The busy-ness score is deliberately simple: mean Sobel-ish gradient magnitude
plus luminance variance, both normalised. High score = detail there = do not
put text over it. There is no subject segmentation available in this
environment (no model host is reachable), so this is a proxy, and its output
is a *draft* that gets corrected by looking at the sheet.

Usage:
  python3 scripts/analyse-frames.py <out-dir>
"""

import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

FFMPEG = "node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg"
SRC = "public/inflation.mp4"
FPS = 24
W, H = 1072, 1920

# Caption bands as fractions of frame height. These match the zones the
# composition can place a cue in.
BANDS = {
    "top": (0.08, 0.30),
    "middle": (0.39, 0.61),
    "bottom": (0.68, 0.90),
}

# Thumbnail size in the contact sheet.
TW, TH = 168, 301
COLS = 8


def load_cuts():
    """Re-run the detector and parse its scene table (keeps one source of truth)."""
    out = subprocess.run(
        ["node", "scripts/detect-cuts.mjs"], capture_output=True, text=True
    ).stdout
    cuts = []
    for line in out.splitlines():
        parts = line.split()
        if len(parts) > 4 and parts[1] == "frame" and parts[0].isdigit():
            cuts.append(int(parts[2]))
    if not cuts:
        sys.exit("could not parse cuts from detect-cuts.mjs")
    return cuts


def grab(frame_idx):
    """Decode a single frame at full resolution as RGB."""
    r = subprocess.run(
        [
            FFMPEG, "-hide_banner", "-loglevel", "error",
            "-ss", f"{frame_idx / FPS:.4f}",
            "-i", SRC,
            "-frames:v", "1",
            "-f", "image2pipe", "-c:v", "rawvideo", "-pix_fmt", "rgb24",
            "-",
        ],
        capture_output=True,
    )
    if len(r.stdout) < W * H * 3:
        return None
    return np.frombuffer(r.stdout[: W * H * 3], np.uint8).reshape(H, W, 3)


def busyness(gray, y0, y1):
    """0..1-ish score for how much is going on in a horizontal band."""
    band = gray[int(y0 * H) : int(y1 * H)].astype(np.float32)
    gx = np.abs(np.diff(band, axis=1)).mean()
    gy = np.abs(np.diff(band, axis=0)).mean()
    edge = (gx + gy) / 2 / 40.0
    var = band.std() / 70.0
    return round(float(min(edge * 0.65 + var * 0.35, 1.0)), 3)


def main():
    out_dir = Path(sys.argv[1] if len(sys.argv) > 1 else "out/frames")
    out_dir.mkdir(parents=True, exist_ok=True)

    cuts = load_cuts()
    total = 2400
    report = []
    thumbs = []

    for i, start in enumerate(cuts):
        end = cuts[i + 1] if i + 1 < len(cuts) else total
        mid = start + (end - start) // 2
        rgb = grab(mid)
        if rgb is None:
            print(f"scene {i}: decode failed at frame {mid}", file=sys.stderr)
            continue
        gray = rgb @ np.array([0.299, 0.587, 0.114], np.float32)

        scores = {k: busyness(gray, a, b) for k, (a, b) in BANDS.items()}
        best = min(scores, key=scores.get)
        report.append(
            {
                "scene": i,
                "start": start,
                "end": end,
                "seconds": round(start / FPS, 2),
                "length": round((end - start) / FPS, 2),
                "mid": mid,
                "scores": scores,
                "suggested": best,
            }
        )

        im = Image.fromarray(rgb).resize((TW, TH), Image.LANCZOS)
        d = ImageDraw.Draw(im)
        # Band guides, so the sheet shows exactly where text could land.
        for name, (a, b) in BANDS.items():
            colour = (60, 255, 130) if name == best else (255, 90, 90)
            d.rectangle([2, a * TH, TW - 3, b * TH], outline=colour, width=2)
        d.rectangle([0, 0, 44, 20], fill=(0, 0, 0))
        d.text((5, 5), f"{i}", fill=(255, 210, 90))
        thumbs.append(im)

    rows = (len(thumbs) + COLS - 1) // COLS
    sheet = Image.new("RGB", (COLS * (TW + 6), rows * (TH + 6)), (12, 14, 18))
    for n, im in enumerate(thumbs):
        sheet.paste(im, ((n % COLS) * (TW + 6) + 3, (n // COLS) * (TH + 6) + 3))
    sheet_path = out_dir / "contact-sheet.png"
    sheet.save(sheet_path)

    (out_dir / "placement.json").write_text(json.dumps(report, indent=2))
    print(f"{len(thumbs)} scenes -> {sheet_path}")
    for r in report:
        s = r["scores"]
        print(
            f"  {r['scene']:2}  {r['seconds']:6.2f}s  len {r['length']:4.2f}s   "
            f"top {s['top']:.2f}  mid {s['middle']:.2f}  bot {s['bottom']:.2f}   "
            f"-> {r['suggested']}"
        )


if __name__ == "__main__":
    main()
