"""Replace the Arabic on-screen text of the poster animation with English.

Text is static across frames, so: one stroke mask from the temporal median,
inpaint each frame under that mask, then composite pre-rendered English text.
"""
import glob, os, sys
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter

FR = sys.argv[1]          # dir with frames_%03d.png
OUT = sys.argv[2]         # output dir for frames
FONTS = sys.argv[3]
os.makedirs(OUT, exist_ok=True)
files = sorted(glob.glob(os.path.join(FR, "frames_*.png")))
frames = [cv2.imread(f) for f in files]
H, W = frames[0].shape[:2]

# (x0, y0, x1, y1) erase box, plus layout for the English
R = {
    "title":     (160, 62, 614, 123),
    "hourglass": (326, 163, 575, 218),
    "child_tag": (128, 237, 208, 260),
    "child":     (114, 263, 218, 288),
    "youth":     (514, 305, 652, 368),
    "mature":    (106, 420, 229, 498),
    "old":       (522, 505, 628, 583),
    "grave":     (288, 677, 468, 708),
    "box":       (134, 736, 616, 824),
    "banner":    (166, 846, 596, 877),
}

# English: list of (text, weight, italic) paragraphs; box gets bold + regular
TEXT = {
    "title":     [("The Human Journey…", "Bold", False), ("From the Cradle to the Grave", "Bold", False)],
    "hourglass": [("Life slips by like grains of sand…", "SemiBold", False),
                  ("so make the best use of it.", "SemiBold", False)],
    "child_tag": [("Childhood:", "Bold", False)],
    "child":     [("The story begins.", "SemiBold", False)],
    "youth":     [("Youth:", "Bold", False), ("Dreams and striving.", "SemiBold", False)],
    "mature":    [("Maturity:", "Bold", False),
                  ("Responsibilities and", "SemiBold", False),
                  ("worldly cares.", "SemiBold", False)],
    "old":       [("Old age:", "Bold", False), ("Life moves on,", "SemiBold", False),
                  ("strength fades.", "SemiBold", False)],
    "grave":     [("The grave: the journey’s end.", "Bold", False)],
    "box":       [("Do not be deceived by this world, do not delay your repentance, "
                   "and do not waste your life on what will not benefit you.", "Bold", False),
                  ("Do all the good you can, forgive, leave a good mark, and prepare to meet "
                   "Allah; for however long life is, it is short, and departure asks no "
                   "one’s permission.", "Medium", False)],
    "banner":    [("We are all passing through… so make your passage through this world "
                   "one of obedience and a good legacy.", "SemiBold", False)],
}
WRAP = {"box", "banner"}  # paragraphs that auto-wrap; others are one line each
ALIGN = {"hourglass": "left"}
CAP = {k: 16 for k in ("child_tag","child","youth","mature","old","grave","hourglass")}
CAP.update(title=27, youth=15, banner=13)
LH = {"banner": 1.0, "title": 1.0}
SS = 4  # supersample

def font(weight, size, italic=False):
    f = ImageFont.truetype(os.path.join(FONTS, "EBGi.ttf" if italic else "EBG.ttf"), size)
    f.set_variation_by_name(weight)
    return f

def wrap(text, f, width):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if f.getlength(t) <= width or not cur:
            cur = t
        else:
            lines.append(cur); cur = w
    lines.append(cur)
    return lines

def layout(key, size):
    x0, y0, x1, y1 = R[key]
    bw = (x1 - x0 - 4) * SS
    lines = []
    for i, (txt, wt, it) in enumerate(TEXT[key]):
        s = size if not (key == "box" and i == 1) else int(size * 0.88)
        f = font(wt, s * SS, it)
        parts = wrap(txt, f, bw) if key in WRAP else [txt]
        for p in parts:
            lines.append((p, f))
    lh = [int(f.size * LH.get(key, 1.08)) for _, f in lines]
    total_h = sum(lh)
    fits = total_h <= (y1 - y0) * SS and all(f.getlength(t) <= bw for t, f in lines)
    return lines, lh, total_h, fits

def render(key, ink):
    x0, y0, x1, y1 = R[key]
    size = CAP.get(key, 40)
    while size > 6:
        lines, lh, th, ok = layout(key, size)
        if ok: break
        size -= 1
    w, h = (x1 - x0) * SS, (y1 - y0) * SS
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    y = (h - th) // 2
    for (t, f), l in zip(lines, lh):
        tw = f.getlength(t)
        x = 2 * SS if ALIGN.get(key) == "left" else (w - tw) / 2
        d.text((x, y), t, font=f, fill=ink + (255,))
        y += l
    layer = layer.resize((x1 - x0, y1 - y0), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.35))
    print(f"{key}: size {size}px, {len(lines)} lines")
    return layer

# ---- static stroke mask from temporal median ----
med = np.median(np.stack(frames[::6]), axis=0).astype(np.uint8)
gray = cv2.cvtColor(med, cv2.COLOR_BGR2GRAY)
mask = np.zeros((H, W), np.uint8)
inks = []
for k, (x0, y0, x1, y1) in R.items():
    sub = gray[y0:y1, x0:x1]
    paper = np.percentile(sub, 70)
    m = (sub < paper - 45).astype(np.uint8) * 255
    inks.append(med[y0:y1, x0:x1][sub < np.percentile(sub, 10)])
    mask[y0:y1, x0:x1] = m
mask = cv2.dilate(mask, np.ones((5, 5), np.uint8), iterations=1)
# keep mask inside the boxes
clip = np.zeros_like(mask)
for x0, y0, x1, y1 in R.values():
    clip[y0:y1, x0:x1] = 255
mask &= clip
cv2.imwrite(os.path.join(OUT, "_mask.png"), mask)
b, g, r = np.median(np.concatenate(inks), axis=0)
ink = (int(r), int(g), int(b))
print("ink", ink)

layers = {k: render(k, ink) for k in R}

for i, fr in enumerate(frames):
    clean = cv2.inpaint(fr, mask, 4, cv2.INPAINT_TELEA)
    im = Image.fromarray(cv2.cvtColor(clean, cv2.COLOR_BGR2RGB))
    for k, (x0, y0, x1, y1) in R.items():
        im.alpha_composite if False else im.paste(layers[k], (x0, y0), layers[k])
    im.save(os.path.join(OUT, "out_%03d.png" % (i + 1)))
print("frames", len(frames))
