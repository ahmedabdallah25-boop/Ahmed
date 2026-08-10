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

# The canvas covers the still onto 1080x1920, and the Ken Burns push reaches
# 1.057. Worst case (most cropped) is what the caption must clear.
#
# The source size is read per image rather than assumed. The pension stills are
# all 768x1376, which is what this used to hardcode; the student-loan set is
# mixed — 768x1376 from the sheet-referenced renders, 1152x2048 from the rest —
# and a hardcoded divisor puts the band in the wrong place for every still that
# is not the assumed size.
MAX_PUSH = 1.057


def canvas_geometry(w, h):
    cover = max(1080 / w, 1920 / h)
    render_h = h * cover * MAX_PUSH
    return render_h, (1920 - render_h) / 2


rows = {}
for f in sorted(list(SCENES.glob('*.jpeg')) + list(SCENES.glob('*.png'))):
    src = Image.open(f)
    RENDER_H, OFFSET_Y = canvas_geometry(*src.size)
    im = src.convert('L').resize((96, 172))
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
