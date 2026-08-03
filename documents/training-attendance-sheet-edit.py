"""Edit the training attendance sheet scan:
  - Training Date:  cleared, left blank
  - Trainer Name:   cleared, left blank

Erased areas are rebuilt from clean reference columns of the same form, each
column aligned on its own rule line and tone-matched to the local paper, so the
scan's texture, yellow gradient and slightly bowed rules are preserved.

Set DATE_TEXT / TRAINER_TEXT to fill either field back in with pen strokes.
"""
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SRC = '/root/.claude/uploads/59914bd6-a0e8-5d90-93fe-cc01a64e0685/74ec4abf-IMG_6212.jpeg'
OUT = 'training-attendance-sheet-edited.jpg'
FONT = 'caveat-latin-600-normal.ttf'
SS = 6            # supersampling factor used when drawing pen strokes
INK = (42, 42, 46)
DATE_TEXT = ''    # e.g. '30/06/2026'
TRAINER_TEXT = ''  # e.g. 'Ahmed'

img = Image.open(SRC).convert('RGB')
arr = np.array(img).astype(np.float64)
lum0 = arr.mean(axis=2)
H, W, _ = arr.shape
rng = np.random.default_rng(11)


def band_line(x, y0, y1, half=18):
    """Y centre of the rule line at column x, measured from a horizontal band so
    stray handwriting can't drag the estimate."""
    xa, xb = max(0, x - half), min(W, x + half + 1)
    prof = lum0[y0:y1, xa:xb].mean(axis=1)
    d = np.clip(prof.max() - prof, 0, None)
    d = np.where(d > 0.55 * d.max(), d, 0.0)
    return y0 + float((d * np.arange(len(prof))).sum() / d.sum())


def sample(xr, yf):
    y0 = int(np.floor(yf))
    t = yf - y0
    return arr[y0, xr] * (1 - t) + arr[y0 + 1, xr] * t


def paper_tone(x0, x1, rows_by_x):
    """Mean colour of the un-inked paper over a set of rows, per column."""
    vals = []
    for x in range(x0, x1):
        for y in rows_by_x(x):
            if lum0[y, x] > 212:
                vals.append(arr[y, x])
    return np.array(vals).mean(axis=0)


def erase(x0, x1, target_line, dy_top, dy_bot, ref_cols, ref_win, offsets):
    """Rebuild rect [x0,x1) x [line+dy_top, line+dy_bot] from ref_cols.
    dy_top may be a callable of x.  offsets = (yellow_off, white_off)."""
    ref_pos = {xr: band_line(xr, *ref_win) for xr in ref_cols}
    off_y, off_w = offsets
    for x in range(x0, x1):
        L = target_line(x)
        top = dy_top(x) if callable(dy_top) else dy_top
        ya, yb = int(round(L + top)), int(round(L + dy_bot))
        for y in range(ya, yb + 1):
            if not (0 <= y < H):
                continue
            d = y - L
            vals = np.array([sample(xr, ref_pos[xr] + d) for xr in ref_cols])
            base = np.median(vals, axis=0)
            # tone match: yellow above the rule, white below, blended across it
            t = np.clip((d + 2.0) / 4.0, 0.0, 1.0)
            arr[y, x] = base + off_y * (1 - t) + off_w * t
        arr[ya:yb + 1, x] += rng.normal(0, 1.2, (yb - ya + 1, 3))
    np.clip(arr, 0, 255, out=arr)


def render(text, size, rot):
    font = ImageFont.truetype(FONT, size)
    pad = 60
    tw = int(font.getlength(text)) + 2 * pad
    asc, desc = font.getmetrics()
    th = asc + desc + 2 * pad
    layer = Image.new('L', (tw, th), 0)
    ImageDraw.Draw(layer).text((pad, pad), text, font=font, fill=255)
    layer = layer.rotate(rot, resample=Image.BICUBIC, center=(pad, pad + asc))
    small = layer.resize((tw // SS, th // SS), Image.LANCZOS)
    small = small.filter(ImageFilter.GaussianBlur(0.4))
    m = np.clip(np.array(small).astype(np.float64) / 255.0 * 1.35, 0, 1)
    return m, pad / SS, (pad + asc) / SS


def fit_size(text, rot, target, mode):
    lo, hi, best = 20, 400, 20
    for _ in range(22):
        mid = (lo + hi) / 2
        m, _, _ = render(text, int(round(mid)), rot)
        ys, xs = np.nonzero(m > 0.25)
        got = (xs.max() - xs.min()) if mode == 'w' else (ys.max() - ys.min())
        best = int(round(mid))
        lo, hi = (mid, hi) if got < target else (lo, mid)
    return best


def write_ink(text, pen_x, baseline_y, size, rot, ink=INK):
    m, mx, my = render(text, size, rot)
    x0, y0 = int(round(pen_x - mx)), int(round(baseline_y - my))
    for j in range(m.shape[0]):
        yy = y0 + j
        if not (0 <= yy < H):
            continue
        row = m[j]
        for i in np.nonzero(row > 0.004)[0]:
            xx = x0 + int(i)
            if 0 <= xx < W:
                a = row[i]
                arr[yy, xx] = arr[yy, xx] * (1 - a) + np.array(ink) * a
    np.clip(arr, 0, 255, out=arr)


# =========================================================== Training Date ===
# value cell x 592..888; rule between "Training Date" and "Start / End Time"
date_line = lambda x: 249.30 - 0.0194 * (x - 596)
REF_D = list(range(800, 881, 2))
D_WIN = (239, 256)
yell = paper_tone(600, 731, lambda x: range(232, 242)) - \
       paper_tone(800, 881, lambda x: range(int(band_line(x, *D_WIN)) - 17,
                                            int(band_line(x, *D_WIN)) - 7))
belw = paper_tone(600, 731, lambda x: range(251, 255)) - \
       paper_tone(800, 881, lambda x: range(int(band_line(x, *D_WIN)) + 3,
                                            int(band_line(x, *D_WIN)) + 7))
erase(593, 737, date_line, -20.5, 5.0, REF_D, D_WIN, (yell, belw))
if DATE_TEXT:
    write_ink(DATE_TEXT, 605, 246.5, fit_size(DATE_TEXT, 1.2, 112, 'w'), 1.2)

# ============================================================ Trainer Name ===
# value cell x 131..442; bottom rule of the header block sits at ~321 here.
# "traffic zones" (part of the topic above) dips into this row on the right,
# so the top of the erase steps down under it.
trainer_line = lambda x: 321.50 - 0.0045 * (x - 200)
t_top = lambda x: -19.0 if x < 386 else -16.5
REF_T = list(range(620, 661, 2)) + list(range(680, 791, 2))
T_WIN = (308, 325)
yell_t = paper_tone(140, 396, lambda x: range(304, 317)) - \
         paper_tone(620, 791, lambda x: range(int(band_line(x, *T_WIN)) - 17,
                                              int(band_line(x, *T_WIN)) - 5))
whit_t = paper_tone(140, 396, lambda x: range(325, 334)) - \
         paper_tone(620, 791, lambda x: range(int(band_line(x, *T_WIN)) + 5,
                                              int(band_line(x, *T_WIN)) + 13))
erase(132, 402, trainer_line, t_top, 13.5, REF_T, T_WIN, (yell_t, whit_t))
if TRAINER_TEXT:
    write_ink(TRAINER_TEXT, 137, 321.0, fit_size(TRAINER_TEXT, 0.8, 20, 'h'), 0.8)

Image.fromarray(arr.round().astype(np.uint8)).save(OUT, quality=95, subsampling=0)
print('wrote', OUT)
