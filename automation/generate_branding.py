#!/usr/bin/env python3
"""Generate the Deen & Dinar brand assets into media/branding/:

  banner.png     2560x1440 channel banner (text inside the 1546x423 safe area)
  avatar.png     800x800 profile picture (YouTube crops it to a circle)
  thumb_template.png  1280x720 thumbnail base with the brand frame

Deterministic flat design — navy / gold / white — so assets can be
regenerated after editing the palette or copy below. Text comes from
automation/rebrand.json (single source of truth).

Requires Pillow and the DejaVu fonts (fonts-dejavu-core on Debian/Ubuntu).
"""
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "media" / "branding"
CFG = json.loads((Path(__file__).parent / "rebrand.json").read_text())

NAVY = (13, 27, 42)
NAVY_SOFT = (23, 42, 63)
GOLD = (212, 175, 55)
WHITE = (245, 247, 250)
MUTED = (163, 177, 194)

FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
]
S = 2  # supersample factor for smooth curves, downscaled at save time


def font(size):
    for path in FONT_CANDIDATES:
        if Path(path).exists():
            return ImageFont.truetype(path, size * S)
    raise SystemExit("No usable bold font found — install fonts-dejavu-core.")


def canvas(w, h, color=NAVY):
    return Image.new("RGB", (w * S, h * S), color)


def save(img, name, w, h):
    OUT.mkdir(parents=True, exist_ok=True)
    img.resize((w, h), Image.LANCZOS).save(OUT / name)
    print(f"wrote {OUT / name}")


def ring(draw, cx, cy, r, color, width):
    box = [(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S]
    draw.ellipse(box, outline=color, width=width * S)


def disc(draw, cx, cy, r, color):
    draw.ellipse([(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S], fill=color)


def crescent(img, cx, cy, r, color=GOLD):
    """Filled circle with an offset navy circle punched over it."""
    d = ImageDraw.Draw(img)
    disc(d, cx, cy, r, color)
    disc(d, cx + int(r * 0.42), cy - int(r * 0.32), r, NAVY)


def colored_text(draw, cx, cy, parts, fnt):
    """Center a sequence of (text, color) segments horizontally at (cx, cy)."""
    total = sum(draw.textlength(t, font=fnt) for t, _ in parts)
    x = cx * S - total / 2
    for text, color in parts:
        draw.text((x, cy * S), text, font=fnt, fill=color, anchor="lm")
        x += draw.textlength(text, font=fnt)


def overlay_rings(base, specs):
    """Draw translucent gold rings/discs (the 'coins') on an RGB image."""
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for kind, cx, cy, r, alpha, width in specs:
        color = (*GOLD, alpha)
        if kind == "ring":
            ring(d, cx, cy, r, color, width)
        else:
            disc(d, cx, cy, r, color)
    base.paste(layer, (0, 0), layer)


def banner():
    img = canvas(2560, 1440)
    overlay_rings(img, [
        ("disc", 2150, 700, 520, 10, 0),
        ("ring", 2150, 700, 520, 42, 5),
        ("ring", 2150, 700, 395, 28, 3),
        ("disc", 380, 760, 470, 8, 0),
        ("ring", 380, 760, 470, 30, 4),
        ("ring", 2350, 1240, 180, 25, 3),
        ("ring", 210, 210, 150, 22, 3),
    ])
    d = ImageDraw.Draw(img)
    # everything below stays inside the TV-to-mobile safe area (507..2053 x 508..931)
    colored_text(d, 1280, 650, [("DEEN ", WHITE), ("&", GOLD), (" DINAR", WHITE)], font(150))
    d.rectangle([(1280 - 170) * S, 752 * S, (1280 + 170) * S, 756 * S], fill=GOLD)
    d.text((1280 * S, 822 * S), CFG["tagline"], font=font(50), fill=MUTED, anchor="mm")
    save(img, "banner.png", 2560, 1440)


def avatar():
    img = canvas(800, 800)
    d = ImageDraw.Draw(img)
    ring(d, 400, 400, 332, GOLD, 13)
    overlay_rings(img, [("ring", 400, 400, 296, 70, 3)])
    crescent(img, 400, 262, 80)
    d = ImageDraw.Draw(img)
    colored_text(d, 400, 462, [("D", WHITE), ("&", GOLD), ("D", WHITE)], font(200))
    d.text((400 * S, 618 * S), "DEEN & DINAR", font=font(38), fill=MUTED, anchor="mm")
    save(img, "avatar.png", 800, 800)


def thumb_template():
    img = canvas(1280, 720)
    overlay_rings(img, [
        ("disc", 1120, 340, 400, 10, 0),
        ("ring", 1120, 340, 400, 45, 4),
        ("ring", 1120, 340, 305, 28, 3),
    ])
    d = ImageDraw.Draw(img)
    d.rectangle([0, 706 * S, 1280 * S, 720 * S], fill=GOLD)
    d.text((64 * S, 400 * S), "YOUR 4-WORD", font=font(110), fill=WHITE, anchor="lm")
    d.text((64 * S, 525 * S), "HOOK HERE", font=font(110), fill=GOLD, anchor="lm")
    d.text((64 * S, 70 * S), "D&D", font=font(42), fill=GOLD, anchor="lm")
    save(img, "thumb_template.png", 1280, 720)


if __name__ == "__main__":
    banner()
    avatar()
    thumb_template()
