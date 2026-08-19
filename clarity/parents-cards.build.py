#!/usr/bin/env python3
"""Build the overlay-card track for "The One Sound the Quran Forbids You to Make".

Alignment method (no ASR available): the read follows the script verbatim, so
words are distributed across the *speech* intervals of the master audio in
proportion to their duration. Silences come from
    ffmpeg -i master.mp4 -af silencedetect=noise=-38dB:d=0.30 -f null -
dumped as "start<TAB>end" per line into parents-silence.txt.
Every card start is then snapped to the nearest silence boundary within 2.5s,
so cards enter on the narrator's own pauses. Measured drift on 10 probe
phrases: within +-2.1s before snapping.

Usage:  python3 clarity/parents-cards.build.py > clarity/parents-cards.ass
"""
import re, sys, os

HERE = os.path.dirname(os.path.abspath(__file__))
DUR = 1887.96
SCRIPT = os.environ.get("PARENTS_SCRIPT", os.path.join(HERE, "parents-script.txt"))

sil = [tuple(map(float, l.split())) for l in open(os.path.join(HERE, "parents-silence.txt"))]
speech, prev = [], 0.0
for a, b in sil:
    if a > prev: speech.append((prev, a))
    prev = b
if prev < DUR: speech.append((prev, DUR))
spd = [e - s for s, e in speech]; TOT = sum(spd)

txt = open(SCRIPT).read()
body = txt[txt.index("=\n", txt.index("=====", txt.index("THE COMMAND THAT NEVER TRAVELS ALONE"))): txt.index("[END]")]
body = "\n".join(l for l in body.split("\n")
                 if not (l.startswith("====") or l.strip().startswith(("BLOCK ", "NOTE")) or l.startswith("  ")))
words = [w for w in re.split(r"\s+", re.sub(r"\[[a-z]+\]", " ", body)) if w]
N = len(words)
norm = lambda w: re.sub(r"[^a-z0-9]", "", w.lower())
nw = [norm(w) for w in words]

def t_at(i):
    target, acc = i / N * TOT, 0.0
    for (s, e), d in zip(speech, spd):
        if acc + d >= target: return s + (target - acc)
        acc += d
    return DUR

def cue(phrase):
    tgt = [norm(w) for w in phrase.split()]
    for i in range(N - len(tgt)):
        if nw[i:i + len(tgt)] == tgt: return t_at(i)
    sys.exit("anchor not found: " + phrase)

def snap(t):
    edges = [e for _, e in sil] + [s for s, _ in sil]
    best = min(edges, key=lambda x: abs(x - t))
    return best if abs(best - t) <= 2.5 else t

def ts(t):
    t = max(t, 0); h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"

# ---------------------------------------------------------------- palette / geometry
GOLD, CREAM, WHITE, INK = "&H0041A4D9&", "&H00E3EDF2&", "&H00FFFFFF&", "&H00120C08&"
HERO_Y, BAND_Y = 540, 828

def panel(x, y, w, h, start, end, layer=0):
    d = (f"{{\\an7\\pos({x-w//2},{y-h//2})\\p1\\1c{INK}\\1a&H26&\\3c{GOLD}\\3a&H4D&\\bord3\\shad0"
         f"\\fad(240,240)}}m 0 0 l {w} 0 l {w} {h} l 0 {h}")
    return f"Dialogue: {layer},{ts(start)},{ts(end)},Panel,,0,0,0,,{d}"

def line(style, x, y, start, end, text, layer=1, pop=True, fs=None):
    ov = f"\\an5\\pos({x},{y})\\fad(240,220)"
    if fs: ov += f"\\fs{fs}"
    if pop: ov += "\\fscx92\\fscy92\\t(0,200,\\fscx102\\fscy102)\\t(200,320,\\fscx100\\fscy100)"
    return f"Dialogue: {layer},{ts(start)},{ts(end)},{style},,0,0,0,,{{{ov}}}{text}"

def rule(x, y, w, start, end, layer=1):
    return (f"Dialogue: {layer},{ts(start)},{ts(end)},Panel,,0,0,0,,"
            f"{{\\an7\\pos({x-w//2},{y})\\p1\\1c{GOLD}\\1a&H33&\\bord0\\shad0\\fad(300,220)}}m 0 0 l {w} 0 l {w} 3 l 0 3")

CARDS, ev = [], []

def verse(anchor, ref, ar, en, hook=None, dur=9.0, hero=True):
    CARDS.append(("verse", anchor, ref, ar, en, hook, dur, hero))
def term(anchor, ar, translit, gloss, dur=5.6):
    CARDS.append(("term", anchor, ar, translit, gloss, None, dur, False))
def hadith(anchor, src, quote, dur=7.0):
    CARDS.append(("hadith", anchor, src, quote, None, None, dur, False))
def hook(anchor, text, dur=4.6):
    CARDS.append(("hook", anchor, text, None, None, None, dur, False))
def listcard(anchor, title, items, dur=11.0):
    CARDS.append(("list", anchor, title, items, None, None, dur, True))

# ---------------------------------------------------------------- the card track
verse("Worship none but Him", "APPEARS 5 TIMES IN THE QURAN",
      "وَبِٱلْوَٰلِدَيْنِ إِحْسَـٰنًا",
      "“...and to parents, good treatment.”",
      "THE ONLY OBLIGATION GOD BOLTS TO HIS OWN NAME", dur=9.5)
term("Your Lord has decreed", "قَضَىٰ", "QADA", "decreed  ·  not suggested, not encouraged")
verse("if one of them, or both of them", "AL-ISRA 17:23",
      "إِمَّا يَبْلُغَنَّ عِندَكَ ٱلْكِبَرَ أَحَدُهُمَآ أَوْ كِلَاهُمَا",
      "“If one of them, or both of them, reach old age with you...”",
      "INDAKA — YOUR ROOF, YOUR WATCH. THE VERSE MEANS AN ADULT.", dur=10.0)
hadith("Surah al-Baqarah, verse 83", "AL-BAQARAH 2:83  ·  ADDITION: ORDER",
       "Parents named first — then orphans, then the poor.\\NThe duty to the weak starts at home.", dur=6.5)
hadith("Surah an-Nisa, verse 36", "AN-NISA 4:36  ·  ADDITION: RANGE",
       "The same verse that reaches the traveller\\Npassing through your town starts with your mother.", dur=6.5)
hadith("Surah al-An'am, verse 151", "AL-AN'AM 6:151  ·  ADDITION: CONTEXT",
       "Do not discard the old. Do not discard the young.\\NOne verse. Both directions.", dur=6.5)
verse("Be grateful to Me, and to your parents", "LUQMAN 31:14",
      "أَنِ ٱشْكُرْ لِى وَلِوَٰلِدَيْكَ",
      "“Be grateful to Me — and to your parents.”",
      "GRATITUDE TO GOD AND TO THEM: ONE SENTENCE, ONE LETTER APART", dur=10.0)
term("Wahnan ala wahn.", "وَهْنًا عَلَىٰ وَهْنٍ", "WAHNAN ALA WAHN",
     "weakness upon weakness  ·  it compounded as you grew", dur=6.2)
verse("Do not say to them:", "AL-ISRA 17:23",
      "فَلَا تَقُل لَّهُمَآ أُفٍّ",
      "“Do not say to them: uff.”",
      "THE SMALLEST SOUND OF IRRITATION — FORBIDDEN BY NAME", dur=10.0)
hook("It is a noise.", "UFF IS NOT A WORD.\\N{\\c" + GOLD + "}IT IS A NOISE.", dur=5.0)
hook("had there been a lesser thing than uff",
     "IF ANYTHING SMALLER THAN {\\c" + GOLD + "}UFF{\\c" + WHITE + "} EXISTED,\\N"
     "{\\c" + GOLD + "}THAT{\\c" + WHITE + "} IS WHAT WOULD HAVE BEEN FORBIDDEN.", dur=6.0)
hook("The temptation is the sigh.",
     "NOT SHOUTING.\\NTHE {\\c" + GOLD + "}SIGH{\\c" + WHITE + "}. THE {\\c" + GOLD + "}TONE{\\c" + WHITE + "}. THE {\\c" + GOLD + "}FACE{\\c" + WHITE + "}.", dur=5.4)
term("Qawlan karima.", "قَوْلًا كَرِيمًا", "QAWLAN KARIMA",
     "a noble word  ·  the tone you'd use for someone above you", dur=6.4)
term("Birr al-walidayn.", "بِرّ", "BIRR",
     "expansive goodness  ·  it has no ceiling, and you never finish it", dur=6.4)
term("The opposite is uquq.", "عُقُوق", "UQUQ",
     "from a root meaning to split, to tear, to cut through", dur=6.4)
hadith("and he sat up to say it", "BUKHARI & MUSLIM  ·  THE GRAVEST SINS, IN ORDER",
       "1.  Shirk — associating partners with God\\N"
       "2.  {\\c" + GOLD + "}Uquq al-walidayn — cutting off your parents{\\c" + CREAM + "}\\N"
       "     ...before killing. Before theft.", dur=9.0)
hadith("Paradise lies beneath the feet", "AL-HAKIM: AUTHENTIC  ·  IBN HAJAR: CHAINS DISPUTED",
       "“Stay with her — Paradise is at her feet.”\\N"
       "Said to one man who wanted to leave and fight.", dur=8.0)
hadith("Let your struggle be with them.", "BUKHARI & MUSLIM  ·  UNDISPUTED",
       "“Go back to them, and let your struggle be with them.”", dur=7.0)
hook("And God answered his mother's prayer.",
     "HE WAS PRAYING.\\NTHE TRADITION STILL SAYS HE WAS {\\c" + GOLD + "}WRONG{\\c" + WHITE + "}.", dur=5.6)
hook("It looks like a schedule.",
     "YOU CANNOT NEGLECT THEM BECAUSE YOU'RE LAZY.\\N"
     "YOU ALSO CANNOT NEGLECT THEM BECAUSE YOU'RE {\\c" + GOLD + "}BUSY WITH GOD{\\c" + WHITE + "}.", dur=6.4)
verse("do not obey them.", "LUQMAN 31:15",
      "فَلَا تُطِعْهُمَا وَصَاحِبْهُمَا فِى ٱلدُّنْيَا مَعْرُوفًا",
      "“Do not obey them — and keep company with them\\Nin this world with what is good.”",
      "REFUSE THEM. AND STAY.", dur=10.0)
hook("She ate.", "HE DIDN'T YIELD AN INCH.\\NHE {\\c" + GOLD + "}REMAINED HER SON{\\c" + WHITE + "}.", dur=5.0)
hook("Birr is left.",
     "BIRR WAS NEVER DEFINED AS {\\c" + GOLD + "}PROXIMITY{\\c" + WHITE + "}.\\N"
     "IT CAN BE SENT FROM A SAFE DISTANCE.", dur=6.4)
verse("Lower to them the wing", "AL-ISRA 17:24",
      "وَٱخْفِضْ لَهُمَا جَنَاحَ ٱلذُّلِّ مِنَ ٱلرَّحْمَةِ",
      "“Lower to them the wing of humility, out of mercy.”",
      "A BIRD LOWERS ITS WING TO SHELTER SOMETHING. THE CARE REVERSES.", dur=10.0)
verse("My Lord, have mercy on them, as they raised me when I was", "AL-ISRA 17:24  ·  THE DU'A HE HANDED YOU",
      "رَّبِّ ٱرْحَمْهُمَا كَمَا رَبَّيَانِى صَغِيرًا",
      "Rabbi irhamhuma kama rabbayani saghira\\N“My Lord, have mercy on them, as they raised me when I was small.”",
      None, dur=11.0)
listcard("You pray for them.", "IT DOESN'T END AT THE GRAVE  ·  5 THINGS STILL OPEN TO YOU",
         "1.  Pray for them\\N2.  Ask forgiveness for them\\N3.  Fulfil what they promised\\N"
         "4.  Keep the ties that existed only through them\\N5.  Honour their friends")
verse("My Lord, have mercy on them, as they raised me when I was small. If",
      "SAY IT BEFORE YOU SLEEP TONIGHT",
      "رَّبِّ ٱرْحَمْهُمَا كَمَا رَبَّيَانِى صَغِيرًا",
      "“My Lord, have mercy on them, as they raised me when I was small.”",
      "ELEVEN WORDS. HE KNEW YOU'D NEED THEM HANDED TO YOU.", dur=12.0)

# ---------------------------------------------------------------- emit
timed = []
for c in CARDS:
    kind, anchor = c[0], c[1]
    timed.append((snap(cue(anchor) - 0.15), c))
timed.sort(key=lambda x: x[0])
for i, (st, c) in enumerate(timed):
    kind, anchor, a, b, d, hk, dur, hero = c
    end = st + dur
    if i + 1 < len(timed): end = min(end, timed[i + 1][0] - 0.4)
    y = HERO_Y if hero else BAND_Y
    if kind == "verse":
        multi = "\\N" in d
        h = (370 if hk else 300) + (44 if multi else 0)
        top = y - h // 2
        ev.append(panel(960, y, 1520, h, st, end))
        ev.append(line("Kicker", 960, top + 50, st, end, a))
        ev.append(line("Arabic", 960, top + 148, st + 0.12, end, b, fs=88))
        ev.append(rule(960, top + 214, 1000, st + 0.2, end))
        ev.append(line("Trans", 960, top + (274 if multi else 264), st + 0.2, end, d))
        if hk: ev.append(line("Hook", 960, y + h // 2 - 46, st + 0.45, end, hk, fs=34))
    elif kind == "term":
        h = 210
        ev.append(panel(960, BAND_Y, 1200, h, st, end))
        ev.append(line("Arabic", 960, BAND_Y - 50, st + 0.1, end, a, fs=76))
        ev.append(line("Kicker", 960, BAND_Y + 12, st + 0.2, end, b))
        ev.append(line("Trans", 960, BAND_Y + 66, st + 0.25, end, d, fs=38))
    elif kind == "hadith":
        h = 200
        ev.append(panel(960, BAND_Y, 1260, h, st, end))
        ev.append(line("Kicker", 960, BAND_Y - 62, st, end, a))
        ev.append(rule(960, BAND_Y - 42, 860, st + 0.15, end))
        ev.append(line("Trans", 960, BAND_Y + 20, st + 0.2, end, b, fs=42))
    elif kind == "hook":
        ev.append(panel(960, BAND_Y, 1300, 176, st, end))
        ev.append(line("Hook", 960, BAND_Y, st + 0.1, end, a, fs=48))
    elif kind == "list":
        h = 330
        ev.append(panel(960, HERO_Y, 1240, h, st, end))
        ev.append(line("Kicker", 960, HERO_Y - h // 2 + 44, st, end, a))
        ev.append(rule(960, HERO_Y - h // 2 + 68, 900, st + 0.15, end))
        ev.append(line("Trans", 960, HERO_Y + 24, st + 0.2, end, b, fs=42, pop=False))

print("""[Script Info]
; Overlay-card track — "The One Sound the Quran Forbids You to Make"
; Generated by clarity/parents-cards.build.py — edit the card table there, not here.
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.709

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Panel,DejaVu Sans,40,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,5,0,0,0,1
Style: Kicker,DejaVu Sans,30,""" + GOLD + """,&H000000FF,&H00120C08,&H64000000,-1,0,0,0,100,100,4,0,1,2,0,5,0,0,0,1
Style: Arabic,Amiri,76,&H00FFFFFF,&H000000FF,&H00120C08,&H64000000,0,0,0,0,100,100,0,0,1,2,2,5,0,0,0,1
Style: Trans,DejaVu Serif,42,""" + CREAM + """,&H000000FF,&H00120C08,&H64000000,0,1,0,0,100,100,0,0,1,2,1,5,0,0,0,1
Style: Hook,DejaVu Sans,54,&H00FFFFFF,&H000000FF,&H00120C08,&H64000000,-1,0,0,0,100,100,2,0,1,3,2,5,0,0,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text""")
print("\n".join(ev))
sys.stderr.write(f"{len(timed)} cards, {len(ev)} events\n")
