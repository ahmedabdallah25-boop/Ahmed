"""Measures how much clear headroom each still actually has.

Every prompt in the pack claims "subject in the lower two-thirds, clean
headroom above", but the stills do not honour that equally — some figures reach
much higher than others. A single fixed caption band therefore lands on a face
in a handful of scenes. This finds the real top of the subject in each image so
the caption band can be set per scene instead of assumed.
"""
import json, sys
from pathlib import Path
from PIL import Image

SCENES = Path(sys.argv[1])
OUT = Path(sys.argv[2])

# The canvas covers a 768x1376 still onto 1080x1920, and the Ken Burns push
# reaches 1.057. Worst case (most cropped) is what the caption must clear.
COVER = max(1080 / 768, 1920 / 1376)
MAX_PUSH = 1.057
RENDER_H = 1376 * COVER * MAX_PUSH
OFFSET_Y = (1920 - RENDER_H) / 2

rows = {}
for f in sorted(SCENES.glob('*.jpeg')):
    im = Image.open(f).convert('L').resize((96, 172))
    px = im.load()
    w, h = im.size
    # Background is the paper: overwhelmingly the most common tone.
    hist = {}
    for y in range(h):
        for x in range(w):
            hist[px[x, y]] = hist.get(px[x, y], 0) + 1
    bg = max(hist, key=hist.get)

    top = h
    for y in range(h):
        ink = sum(1 for x in range(w) if abs(px[x, y] - bg) > 14)
        if ink > w * 0.02:          # 2% of the row carries real content
            top = y
            break
    frac = top / h
    rows[f.name] = {
        'frac': round(frac, 4),
        'canvasY': round(OFFSET_Y + frac * RENDER_H, 1),
    }

json.dump(rows, open(OUT, 'w'), indent=2)
vals = sorted(v['canvasY'] for v in rows.values())
print(f'{len(rows)} stills measured')
print(f'subject top (canvas px): min {vals[0]:.0f}  median {vals[len(vals)//2]:.0f}  max {vals[-1]:.0f}')
tight = {k: v['canvasY'] for k, v in rows.items() if v['canvasY'] < 500}
print(f'tight stills (<500px of headroom): {len(tight)}')
for k, v in sorted(tight.items(), key=lambda kv: kv[1])[:8]:
    print(f'   {k} {v:.0f}px')
