#!/usr/bin/env python3
"""Audit filed stills against the pack's stated variables, mechanically.

  python3 audit_images.py [images/S01.jpg ...]     (default: everything in images/)

Section 01 of the scene pack fixes the look in measurable terms: a five-colour
palette, one warm source with deep navy everywhere else, 16:9, and no lettering.
This checks what can be counted — hue distribution, aspect, resolution, and a
bright-corner heuristic for generator watermarks. Composition and the face rule
still need eyes; this narrows where to point them.
"""
import os, sys, glob, colorsys
from PIL import Image

PALETTE = {"navy": (200, 260), "ochre": (25, 50), "terracotta": (5, 25), "sage": (50, 100)}
TARGET_AR = 16 / 9
MIN_W = 1920          # a 1080p timeline
RF_MIN_W = 2200       # a plate that a re-frame will push into

def classify(h, s, v):
    if s < 0.12:
        return "neutral"
    hd = h * 360
    for name, (lo, hi) in PALETTE.items():
        if lo <= hd < hi:
            return name
    return "off"

def audit(path, sample=200):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    small = im.resize((sample, int(sample * h / w)))
    counts, sat, val = {}, 0.0, 0.0
    raw = small.tobytes()
    px = [(raw[i], raw[i + 1], raw[i + 2]) for i in range(0, len(raw), 3)]
    for r, g, b in px:
        hh, ss, vv = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        counts[classify(hh, ss, vv)] = counts.get(classify(hh, ss, vv), 0) + 1
        sat += ss
        val += vv
    n = len(px)
    pct = {k: 100 * v / n for k, v in counts.items()}

    # watermark heuristic: bright, near-white specks in the bottom-right corner
    # A generator watermark is a small bright mark. Most plates also carry a bright
    # cream margin in that corner, which is why this reports a band, not a maximum:
    # a few tenths of a percent is a speck, tens of percent is the paper edge.
    roi = im.crop((int(w * 0.88), int(h * 0.84), w, h)).convert("L")
    rp = list(roi.tobytes())
    med = sorted(rp)[len(rp) // 2]
    hot = sum(1 for p in rp if p > max(225, med + 60))
    return dict(w=w, h=h, ar=w / h, pct=pct, sat=sat / n, val=val / n,
                hot=100 * hot / len(rp))

def main(paths):
    print(f"{'file':<12}{'size':>11} {'ar':>6}  {'navy':>5}{'ochre':>6}{'terra':>6}{'sage':>6}"
          f"{'neut':>6}{'OFF':>6}  {'sat':>5}{'val':>6}{'corner':>7}  flags")
    for p in paths:
        a = audit(p)
        f = []
        if abs(a["ar"] - TARGET_AR) / TARGET_AR > 0.01:
            f.append("aspect")
        if a["w"] < MIN_W:
            f.append("under-1080p")
        if a["pct"].get("off", 0) > 5:
            f.append("off-palette")
        if a["sat"] > 0.45:
            f.append("saturated")
        if 0.05 < a["hot"] < 3:
            f.append("corner-mark?")
        if a["pct"].get("navy", 0) < 25:
            f.append("low-navy")
        print(f"{os.path.basename(p):<12}{a['w']}x{a['h']:<6}{a['ar']:>6.3f}  "
              + "".join(f"{a['pct'].get(k, 0):>5.1f}" + " " for k in
                        ("navy", "ochre", "terracotta", "sage", "neutral", "off"))
              + f" {a['sat']:>5.2f}{a['val']:>6.2f}{a['hot']:>6.2f}%  " + " ".join(f))

if __name__ == "__main__":
    args = sys.argv[1:] or sorted(glob.glob("images/S*"))
    main(args)
