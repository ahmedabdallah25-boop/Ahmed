"""Edit the training attendance sheet scan:
 - clear trainer name handwriting, write "Ahmed"
 - change training date to 26 June 2026
 - clear start / end time
"""
import random
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SRC = sys.argv[1] if len(sys.argv) > 1 else 'attendance-sheet-original.jpeg'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'training-attendance-sheet-26-june-2026.png'
FONT = 'PatrickHand.ttf'  # Google Fonts, downloaded separately

im = Image.open(SRC).convert('RGB')
W, H = im.size
S = 4  # supersample factor for drawing


def clean_band(img, box, rank_size=13, pct=0.85, passes=2):
    """Replace a rectangular band with an ink-free estimate of the paper."""
    region = img.crop(box)
    rank = int(pct * rank_size * rank_size)
    bg = region
    for _ in range(passes):
        chans = [c.filter(ImageFilter.RankFilter(rank_size, rank)) for c in bg.split()]
        bg = Image.merge('RGB', chans)
    bg = bg.filter(ImageFilter.GaussianBlur(1.2))
    # re-add a little scan grain so the patch does not read as flat
    px = bg.load()
    rnd = random.Random(7)
    for y in range(bg.size[1]):
        for x in range(bg.size[0]):
            n = rnd.gauss(0, 2.2)
            r, g, b = px[x, y]
            px[x, y] = (max(0, min(255, int(r + n))),
                        max(0, min(255, int(g + n))),
                        max(0, min(255, int(b + n))))
    img.paste(bg, box)


def column_darkness_y(img, x, y_lo, y_hi):
    """Locate a printed rule in one column: darkest 3px run, then centroid."""
    px = img.load()

    def lum(y):
        r, g, b = px[x, y]
        return (r + g + b) / 3.0

    best = min(range(y_lo, y_hi - 2), key=lambda y: lum(y) + lum(y + 1) + lum(y + 2))
    tot = 0.0
    acc = 0.0
    for y in range(best - 2, best + 5):
        w = max(0.0, 190.0 - lum(y))
        tot += w
        acc += w * y
    return acc / tot if tot > 0 else None


def fit_rule(img, xs, y_lo, y_hi):
    """Least-squares fit of a printed horizontal rule from clean sample columns."""
    pts = [(x, column_darkness_y(img, x, y_lo, y_hi)) for x in xs]
    pts = [(x, y) for x, y in pts if y is not None]
    n = len(pts)
    mx = sum(p[0] for p in pts) / n
    my = sum(p[1] for p in pts) / n
    num = sum((p[0] - mx) * (p[1] - my) for p in pts)
    den = sum((p[0] - mx) ** 2 for p in pts)
    slope = num / den if den else 0.0
    return slope, my - slope * mx


def rule_color(img, xs, y_lo, y_hi):
    px = img.load()
    best = []
    for x in xs:
        col = min(range(y_lo, y_hi), key=lambda y: sum(px[x, y]))
        best.append(px[x, col])
    best.sort(key=lambda c: sum(c))
    pick = best[:max(1, len(best) // 2)]
    return tuple(int(sum(c[i] for c in pick) / len(pick)) for i in range(3))


def draw_rule(img, x0, x1, slope, intercept, color, width=1.35):
    """Anti-aliased horizontal rule via supersampled mask."""
    w, h = (x1 - x0), 24
    y_top = int(intercept + slope * x0) - h // 2
    mask = Image.new('L', (w * S, h * S), 0)
    d = ImageDraw.Draw(mask)
    ya = (intercept + slope * x0 - y_top) * S
    yb = (intercept + slope * x1 - y_top) * S
    d.line([(0, ya), (w * S, yb)], fill=255, width=max(1, int(width * S)))
    mask = mask.resize((w, h), Image.LANCZOS)
    patch = Image.new('RGB', (w, h), color)
    img.paste(patch, (x0, y_top), mask)


def draw_text(img, text, xy, size, color, angle=0.0, spacing=0.0, seed=3):
    """Render handwriting-style text supersampled, then composite as ink."""
    font = ImageFont.truetype(FONT, size * S)
    tmp = Image.new('L', (img.size[0] * S, img.size[1] * S), 0)
    d = ImageDraw.Draw(tmp)
    rnd = random.Random(seed)
    x = xy[0] * S
    y = xy[1] * S
    for ch in text:
        # small per-character baseline wobble so the line does not read as typeset
        d.text((x, y + rnd.uniform(-0.5, 0.5) * S), ch, font=font, fill=255)
        x += d.textlength(ch, font=font) + (spacing + rnd.uniform(-0.15, 0.25)) * S
    box = tmp.getbbox()
    mask = tmp.crop(box).resize(((box[2] - box[0]) // S, (box[3] - box[1]) // S), Image.LANCZOS)
    if angle:
        mask = mask.rotate(angle, resample=Image.BICUBIC, expand=True)
    mask = mask.filter(ImageFilter.GaussianBlur(0.4))
    patch = Image.new('RGB', mask.size, color)
    img.paste(patch, (box[0] // S, box[1] // S), mask)


INK = (46, 50, 68)

# ---------------------------------------------------------------- date / time
# Right-hand value cells: training date row y 200-221, start/end time row
# y 221-241.  Rules are fitted from ink-free columns at BOTH ends of each rule
# so the redrawn segment is an interpolation, never an extrapolation.
date_xs = [574, 577, 580, 583, 586, 589, 592] + list(range(760, 831, 10))
sep_slope, sep_int = fit_rule(im, date_xs, 214, 229)                       # date | time rule
ven_slope, ven_int = fit_rule(im, date_xs, 233, 248)                       # time | venue rule
line_col = rule_color(im, list(range(780, 828, 4)), 216, 227)
clean_band(im, (573, 200, 831, 244))
draw_rule(im, 573, 831, sep_slope, sep_int, line_col)
draw_rule(im, 573, 831, ven_slope, ven_int, line_col)
draw_text(im, '26 June 2026', (588, 199), 21, INK, angle=0.4, spacing=0.3)

# ------------------------------------------------------------------- trainer
bot_xs = [165, 170, 412, 418, 424, 430, 436, 440]                         # header block base rule
bot_slope, bot_int = fit_rule(im, bot_xs, 274, 288)
line_col2 = rule_color(im, list(range(412, 440, 3)), 274, 285)
# cleaned in two bands so the white margin below the block cannot bleed into
# the yellow cell above it
clean_band(im, (175, 261, 442, 280))                                      # cell interior
clean_band(im, (175, 280, 442, 289))                                      # descenders below rule
draw_rule(im, 175, 442, bot_slope, bot_int, line_col2)
draw_text(im, 'Ahmed', (183, 261), 20, INK, angle=0.5, spacing=0.4)

im.save(OUT)
print('saved', OUT, im.size)
