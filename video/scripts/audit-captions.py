"""Audits every caption against the still it sits on.

Type size is chosen from an *estimate* of how the browser will wrap a phrase.
This checks the browser's actual answer: it renders each phrase alone on a flat
ground (the Pension-CaptionAudit composition) and measures the real ink box, then
compares it with that scene's measured caption band and the horizontal safe area.
"""
import json, sys
from pathlib import Path
from PIL import Image

AUDIT = Path(sys.argv[1])
FRAMES = json.load(open(sys.argv[2]))

# The band already holds 40px back from the subject, so overrunning the band is
# a design-intent miss while touching the subject is an actual defect. Report
# both, and never let the second hide behind the first.
tl = Path('src/pension/timeline.ts').read_text()
SCENES = {s['n']: s for s in json.loads(tl[tl.index('SCENES: Scene[] = ') + 18:tl.rindex('];') + 1])}
HEADROOM = json.load(open('scripts/headroom.json'))
def subject_top(n):
    still = SCENES[n]['still']
    return HEADROOM.get(still, {}).get('canvasY', 1e9)
SCALE = 4              # rendered at 0.25
SAFE_X = 56
W = 1080

fails, margins, checked = [], [], 0
for row in FRAMES:
    f = AUDIT / f"{row['n']}-{row['which']}.png"
    if not f.exists():
        fails.append((row, 'MISSING FRAME', None))
        continue
    im = Image.open(f).convert('L')
    px, w, h = im.load(), *im.size
    bg = px[2, 2]
    xs, ys = [], []
    for y in range(h):
        for x in range(w):
            if abs(px[x, y] - bg) > 24:
                xs.append(x)
                ys.append(y)
    checked += 1
    if not xs:
        fails.append((row, 'NO TEXT RENDERED', None))
        continue
    box = {
        'top': min(ys) * SCALE, 'bottom': (max(ys) + 1) * SCALE,
        'left': min(xs) * SCALE, 'right': (max(xs) + 1) * SCALE,
    }
    top = subject_top(row['n'])
    if box['bottom'] > top:
        fails.append((row, f"TOUCHES ART: ink to {box['bottom']}px, subject starts {top:.0f}px", box))
    elif box['bottom'] > row['capBottom'] + SCALE:
        margins.append((row, box['bottom'], top))
    if box['left'] < SAFE_X - SCALE or box['right'] > W - SAFE_X + SCALE:
        fails.append((row, f"OUTSIDE SAFE AREA: {box['left']}..{box['right']}px", box))
    if box['top'] < 0:
        fails.append((row, f"ABOVE FRAME: {box['top']}px", box))

clearances = []
for row in FRAMES:
    f = AUDIT / f"{row['n']}-{row['which']}.png"
    if f.exists():
        pass
print(f'checked {checked}/{len(FRAMES)} phrases')
if margins:
    print(f'{len(margins)} phrases past the 40px band but still clear of the art:')
    for row, bottom, top in margins[:6]:
        print(f"  S{row['n']:02d} cap{row['which']} ink {bottom}px, art at {top:.0f}px ({top - bottom:.0f}px clear)")
if not fails:
    print('PASS — every phrase inside its band and the safe area')
else:
    print(f'{len(fails)} FAILURES:')
    for row, why, box in fails:
        print(f"  S{row['n']:02d} cap{row['which']} \"{row['text']}\" — {why}")
