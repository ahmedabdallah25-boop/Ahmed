#!/usr/bin/env python3
"""Kinetic burned-in captions for Part 15 — the successor to cinematic_captions.py.

What this does differently from Part 14 (cinematic_captions.py):

  1. Legibility. Part 14 shipped Outline 0 / Shadow 0 flat white. That is fine over
     the dark interiors and falls apart over the bright bokeh end card and the
     spotlit scenes. Here every caption carries an outline plus a soft drop shadow,
     so it survives any plate.
  2. Motion. Part 14 captions cut in and out. These pop in with a scale overshoot,
     drift upward a few pixels while held, and fade out — movement the eye catches
     in a feed without reading effort.
  3. Emphasis. The one word carrying the claim is tinted gold and slightly larger.
     On a video about gold that doubles as art direction.
  4. Placement. Part 14 used OpenCV face detection to find a clear band. AMIR has no
     face, and OpenCV is not available here, so instead each scene's own frame is
     sampled and the calmest of three candidate bands (by luminance variance) wins —
     the caption lands where the picture is quietest.
  5. Payoff beats. Scenes 17 and 21 are the mechanism payoff and the emotional peak.
     They get a longer hold and a heavier treatment.

Usage:
    python kinetic_captions.py --video media/part15-raw.mp4 --out media/part15.mp4
"""
import argparse
import json
import subprocess
import tempfile
from pathlib import Path

from PIL import Image

W, H = 1080, 1920

# ASS colours are &HBBGGRR. Gold sampled from the render's key light.
GOLD = "&H34A8E8&"
WHITE = "&HFFFFFF&"

# Shorts UI keep-out: the bottom strip carries the title, handle and action rail;
# the top carries the search affordance. These are the bounds for the caption BLOCK,
# not its centre — see place() which subtracts half the rendered height.
SAFE_TOP, SAFE_BOT = int(H * 0.20), int(H * 0.79)

# DejaVu Sans Bold is a much wider face than Part 14's Bebas Neue, so the same point
# size wraps to four lines and overruns the UI strip. Condense it and measure the
# wrap so placement can account for the real block height.
SCALE_X = 78
CHAR_W = 0.62 * (SCALE_X / 100)   # approx advance per cap glyph, in em
LINE_H = 1.22
USABLE = W - 140


def wrap_lines(text, size):
    """Rough line count for a caption at this size — enough to place it safely."""
    per_line = max(8, int(USABLE / (size * CHAR_W)))
    words, lines, cur = text.split(), 1, 0
    for word in words:
        add = len(word) + (1 if cur else 0)
        if cur + add > per_line and cur:
            lines += 1
            cur = len(word)
        else:
            cur += add
    return lines


def place(y, text, size):
    """Clamp the caption centre so the whole block stays clear of the Shorts UI."""
    half = wrap_lines(text, size) * size * LINE_H / 2
    return int(max(SAFE_TOP + half, min(y, SAFE_BOT - half)))

# Words that carry the claim in each caption get the gold treatment.
EMPHASIS = {
    "sleep", "gold", "any", "promise", "stealing", "lent", "more", "fix",
    "diluted", "two", "scarce", "approved", "earned", "yours", "caught",
    "paper", "screen", "holding", "machine", "metal", "strict", "hand",
    "delay", "sale", "hundred", "kills", "hands", "IOU", "real", "claim",
    "owe",
}

# Scene -> (start, end) on the assembled cut, from scene-cut detection cross-checked
# against the render order in the scene pack. Scene 13 shares segment 12's window;
# the two are one continuous shot in the supplied footage.
SCENE_WINDOWS = [
    (1, 0.0, 4.9), (2, 4.9, 8.9), (3, 8.9, 14.6), (4, 14.6, 22.3),
    (5, 22.3, 32.4), (6, 32.4, 35.0), (7, 35.0, 38.0), (8, 38.0, 41.5),
    (9, 41.5, 44.8), (10, 44.8, 47.1), (11, 47.1, 50.0), (12, 50.0, 53.8),
    (13, 53.8, 57.6), (14, 57.6, 60.6), (15, 60.6, 64.2), (16, 64.2, 68.0),
    (17, 68.0, 71.7), (18, 71.7, 76.0), (19, 76.0, 78.4), (20, 78.4, 82.2),
    (21, 82.2, 87.7), (22, 87.7, 94.0), (23, 94.0, 99.5), (24, 99.5, 110.5),
    (25, 110.5, 121.0), (26, 121.0, 140.42),
]

PAYOFF = {17, 21}


def ts(t):
    """Seconds -> ASS 0:00:00.00"""
    if t < 0:
        t = 0
    h, r = divmod(t, 3600)
    m, s = divmod(r, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def phrases_in(phr, a, b):
    """Speech phrases overlapping [a,b), clipped to it."""
    out = []
    for s, e in phr:
        if e > a and s < b:
            out.append((max(s, a), min(e, b)))
    return out


MIN_HOLD = 0.75


def split_window(phr, a, b, n, texts=None):
    """Divide [a,b) into n caption slots, cutting at the pause nearest the point
    the text lengths imply.

    Picking the *largest* pause is wrong: the biggest gap inside a scene window is
    often the run-up to the next scene's first word, which strands the second
    caption on a fraction of a second. Weighting by text length and then snapping to
    the closest real pause puts the cut where the speaker actually breathes.
    """
    if n == 1:
        return [(a, b)]
    span = b - a
    if texts and sum(len(t) for t in texts):
        frac = len(texts[0]) / sum(len(t) for t in texts)
    else:
        frac = 0.5
    target = a + span * frac

    p = phrases_in(phr, a, b)
    cuts = [(p[i][1] + p[i + 1][0]) / 2 for i in range(len(p) - 1)]
    # only pauses that leave both halves watchable
    cuts = [c for c in cuts if c - a >= MIN_HOLD and b - c >= MIN_HOLD]
    cut = min(cuts, key=lambda c: abs(c - target)) if cuts else target
    cut = max(a + MIN_HOLD, min(cut, b - MIN_HOLD)) if span > 2 * MIN_HOLD else (a + b) / 2
    return [(a, cut), (cut, b)]


def calm_band(video, t):
    """Sample one frame; return the y of the calmest of three candidate bands."""
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as f:
        png = f.name
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(t), "-i", str(video),
                    "-frames:v", "1", "-vf", "scale=135:240", png], check=False)
    try:
        im = Image.open(png).convert("L")
    except Exception:
        return int(H * 0.66), False
    px = im.load()
    w, h = im.size
    best, best_y, bright = None, int(H * 0.66), False
    for frac in (0.42, 0.60, 0.74):
        y0 = int(h * (frac - 0.055))
        y1 = int(h * (frac + 0.055))
        vals = [px[x, y] for y in range(max(0, y0), min(h, y1)) for x in range(w)]
        if not vals:
            continue
        mean = sum(vals) / len(vals)
        var = sum((v - mean) ** 2 for v in vals) / len(vals)
        if best is None or var < best:
            best, best_y, bright = var, int(H * frac), mean > 140
    Path(png).unlink(missing_ok=True)
    return max(SAFE_TOP, min(best_y, SAFE_BOT)), bright


def style_text(text, size, payoff):
    """Uppercase, with the claim word tinted gold and bumped up."""
    words = text.split()
    out = []
    for w in words:
        bare = w.strip(",.—:;?!").lower()
        if bare in EMPHASIS:
            big = int(size * (1.16 if payoff else 1.10))
            out.append(f"{{\\c{GOLD}\\fs{big}}}{w.upper()}{{\\c{WHITE}\\fs{size}}}")
        else:
            out.append(w.upper())
    return " ".join(out)


def build_ass(cards, base):
    head = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,DejaVu Sans,{base},&H00FFFFFF,&H000000FF,&H00101010,&HA0000000,-1,0,0,0,{SCALE_X},100,1,0,1,4,3,5,70,70,60,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    rows = []
    for c in cards:
        size = int(base * (1.14 if c["payoff"] else 1.0))
        txt = style_text(c["text"], size, c["payoff"])
        dur = max(0.5, c["end"] - c["start"])
        fin = min(260, int(dur * 1000 * 0.22))
        fout = min(240, int(dur * 1000 * 0.20))
        y = place(c["y"], c["text"], size)
        # pop-in overshoot, then a slow upward drift while held
        eff = (f"\\an5\\move(540,{y+14},540,{y-10},0,{int(dur*1000)})"
               f"\\fad({fin},{fout})"
               f"\\fscx82\\fscy82\\t(0,190,\\fscx104\\fscy104)\\t(190,300,\\fscx100\\fscy100)")
        if c["payoff"]:
            eff += "\\bord5\\shad4"
        rows.append(f"Dialogue: 0,{ts(c['start'])},{ts(c['end'])},Cap,,0,0,0,,"
                    f"{{{eff}\\fs{size}}}{txt}")
    return head + "\n".join(rows) + "\n"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", default="media/part15-raw.mp4")
    ap.add_argument("--out", default="media/part15.mp4")
    ap.add_argument("--caps", default="/tmp/caps.json")
    ap.add_argument("--phrases", default="/tmp/phrases.json")
    ap.add_argument("--ass-only", action="store_true")
    a = ap.parse_args()

    scenes = {s["n"]: s["caps"] for s in json.load(open(a.caps))}
    phr = json.load(open(a.phrases))
    base = int(H * 0.043)

    cards = []
    for n, s, e in SCENE_WINDOWS:
        caps = scenes.get(n, [])
        if not caps:
            continue
        y, _ = calm_band(a.video, s + (e - s) * 0.5)
        for (cs, ce), text in zip(split_window(phr, s, e, len(caps), caps), caps):
            cards.append({"text": text, "start": cs, "end": ce - 0.08,
                          "y": y, "payoff": n in PAYOFF})

    ass = Path("media/part15.ass")
    ass.write_text(build_ass(cards, base), encoding="utf-8")
    print(f"{len(cards)} caption cards -> {ass}")
    if a.ass_only:
        return

    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", a.video,
                    "-vf", f"ass={ass}", "-c:v", "libx264", "-crf", "18",
                    "-preset", "medium", "-pix_fmt", "yuv420p",
                    "-c:a", "copy", "-movflags", "+faststart", a.out], check=True)
    print("wrote", a.out)


if __name__ == "__main__":
    main()
