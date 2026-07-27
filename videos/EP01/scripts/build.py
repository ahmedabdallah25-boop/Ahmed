#!/usr/bin/env python3
"""Assemble the EP01 caption-rail + graphic-card composition.

Reads transcript.json (word-level) and the CARDS spec below, emits
public/cards/card-NN.html fragments plus the assembled public/index.html
with a single paused GSAP master timeline.

Card placement zones were chosen from a per-moment ink-density probe of the
source (scripts/regions.py): the source is a bright cream animation that
already carries its own tables and charts, so cards land only where the
frame measured empty.
"""
import html
import json
import os
import re

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30
W, H = 1920, 1080
DUR = 1071.0

# ── palette sampled from the source artwork ──────────────────────────────
INK = "#17130E"
CREAM = "#F7F0DE"
GOLD = "#E8B54B"
TEAL = "#2E6F6B"
RUST = "#C0553C"
OLIVE = "#7C8A4E"

# ── caption rail geometry ────────────────────────────────────────────────
# The source's own progress bar sits at y~97.5% (=1053). The rail clears it.
RAIL = dict(left=210, top=952, width=1500, height=80)

# ── ASR repairs: (approx time, wrong, right) ─────────────────────────────
CORR = [
    (60.8, "donor.", "dollar."),
    (214.0, "not.", "nod."),
    (279.8, "donors", "dollars"),
    (378.1, "Study.", "Steady."),
    (504.2, "Nitty", "Nearly"),
    (618.8, "Uneath", "Underneath"),
    (642.4, "Goodyears", "good"),
    (693.3, "donas.", "dollars."),
    (738.4, "lumber", "number"),
    (830.6, "meets", "needs"),
    (879.2, "Bilar", "Bilal"),
    (953.5, "Finland,", "finished"),
    (1013.2, "Villar.", "Bilal."),
    (1066.4, "halab.", "halal."),
]
# name normalisations applied everywhere
NORM = {"Sami": "Sammy", "Sami's": "Sammy's", "Summi": "Sammy", "Summy": "Sammy",
        "Sammy,": "Sammy,", "Adams'": "Adam's", "Adams": "Adam's"}

ZONES = {  # card-host bounds
    "TOP": (0, 0, 1920, 380),
    "RIGHT": (1040, 150, 840, 790),
    "LEFT": (40, 150, 840, 790),
    "LOWRIGHT": (990, 540, 890, 400),
    "CENTER": (380, 280, 1160, 520),
}

# ── the storyboard: (start, dur, zone, template, accent, content) ────────
CARDS = [
    (3.0, 6.0, "TOP", "setup", TEAL, dict(kicker="MEET ADAM & SAMMY",
     chips=["AGE 30", "$58,000 / YEAR", "$12,000 SAVED"])),
    (13.6, 4.4, "TOP", "stat", TEAL, dict(kicker="EACH PUTS ASIDE",
     value="$200", sub="every month, without fail")),
    (24.9, 5.0, "TOP", "quote", RUST, dict(text="Nothing separates these two men.")),
    (30.4, 4.3, "TOP", "quote", RUST, dict(text="Except what they believe money is for.")),
    # The source runs its own "30 YEARS FROM NOW" table across 49-61s, so this
    # card holds until 62.3 where the frame measures clean again.
    (62.3, 6.0, "TOP", "compare", GOLD, dict(kicker="30 YEARS FROM NOW",
     rows=[("ADAM", "$110,000", RUST), ("SAMMY", "$469,000", OLIVE)])),
    (68.4, 3.4, "TOP", "stat", RUST, dict(kicker="ADAM · SAVINGS ACCOUNT",
     value="1.5%", sub="annual rate")),
    (92.9, 5.0, "LOWRIGHT", "quote", RUST, dict(text="The number only ever goes up.")),
    (107.5, 5.5, "RIGHT", "stat", OLIVE, dict(kicker="SAMMY · INDEX FUND",
     value="$12,000", sub="total stock market  ·  + $200 / mo")),
    (120.8, 5.0, "TOP", "quote", OLIVE, dict(
     text="A fractional slice of several thousand businesses.")),
    (156.3, 4.7, "TOP", "versus", GOLD, dict(
     left_label="ADAM", left_text="CERTAINTY", left_accent=RUST,
     right_label="SAMMY", right_text="OWNERSHIP", right_accent=OLIVE)),
    (186.2, 5.0, "LOWRIGHT", "stat", RUST, dict(kicker="SAMMY · WEEK ONE",
     value="$11,600", sub="down $400, for no reason at all")),
    (250.4, 6.0, "TOP", "compare", GOLD, dict(kicker="YEAR 3  ·  BOTH DEPOSITED $19,200",
     rows=[("ADAM", "$19,900", RUST), ("SAMMY", "$14,600", OLIVE)])),
    (279.7, 5.5, "TOP", "stat", RUST, dict(kicker="SAMMY IS BEHIND BY",
     value="$5,300", sub="and $4,600 below what he actually put in")),
    (296.4, 5.0, "RIGHT", "quote", GOLD, dict(
     text="This is the moment the entire outcome is decided.")),
    (322.9, 5.0, "RIGHT", "quote", RUST, dict(text="Most people sell here.")),
    (340.0, 5.0, "TOP", "quote", OLIVE, dict(
     text="He keeps sending $200 a month into an investment that has lost him money.")),
    (351.3, 5.5, "TOP", "stat", OLIVE, dict(kicker="THE 36 DEPOSITS MADE WHILE IT WAS DOWN",
     value="MORE SHARES", sub="than at any other point in the whole 30 years")),
    (361.1, 4.5, "TOP", "stat", OLIVE, dict(kicker="THE SAME BUSINESSES",
     value="A THIRD OFF", sub="it feels like a mistake you repeat monthly")),
    (382.2, 5.5, "TOP", "compare", GOLD, dict(kicker="YEAR 7  ·  THE CROSSOVER",
     rows=[("ADAM", "$31,000", RUST), ("SAMMY", "$40,000", OLIVE)])),
    (420.0, 4.6, "TOP", "quote", OLIVE, dict(
     text="The crash handed him four years of cheap buying.")),
    (432.4, 6.0, "TOP", "stat", RUST, dict(kicker="INFLATION  ·  ~3% A YEAR",
     value="$25,200", sub="what Adam's $31,000 will actually buy")),
    (462.7, 5.5, "TOP", "compare", GOLD, dict(kicker="WHAT ADAM'S 1.5% REALLY IS",
     rows=[("ADAM LENDS AT", "1.5%", RUST), ("THE BANK RELENDS AT", "6.92%", TEAL)])),
    (480.2, 5.0, "LEFT", "quote", RUST, dict(
     text="He is not a customer of that bank. He is a supplier.")),
    (497.0, 6.0, "TOP", "compare", GOLD, dict(kicker="YEAR 10",
     rows=[("ADAM", "$39,800", RUST), ("SAMMY", "$78,000", OLIVE)])),
    (516.0, 5.5, "TOP", "stat", RUST, dict(kicker="THEN THE SECOND CRASH",
     value="$52,000", sub="ten years of volatility for $12,000 of lead")),
    (544.5, 5.0, "TOP", "quote", GOLD, dict(text="Would you still be holding?")),
    (603.7, 5.5, "TOP", "quote", GOLD, dict(
     text="Nobody warns you that the unpleasantness is the price.")),
    (640.0, 6.0, "TOP", "versus", GOLD, dict(
     left_label="ADAM", left_text="A LENDER", left_accent=RUST,
     right_label="SAMMY", right_text="AN OWNER", right_accent=OLIVE)),
    (665.3, 5.0, "TOP", "stat", TEAL, dict(kicker="A BODY OF LAW THAT SPENT",
     value="1,400 YEARS", sub="on exactly this line")),
    (693.1, 4.9, "TOP", "stat", RUST, dict(kicker="YEAR 30  ·  ADAM  ·  DEPOSITED $84,000",
     value="$109,600", sub="less buying power than the day he started")),
    (725.0, 6.0, "TOP", "stat", OLIVE, dict(kicker="YEAR 30  ·  SAMMY  ·  DEPOSITED $84,000",
     value="$468,900", sub="$359,300 apart  ·  not one dollar more saved")),
    (743.3, 6.0, "TOP", "quote", GOLD, dict(
     text="Compounding does almost nothing for a very long time — then almost everything.")),
    (786.0, 5.5, "TOP", "stat", TEAL, dict(kicker="RUN SAMMY AT 6% INSTEAD",
     value="$268,000", sub="still 2.5× Adam  ·  but the number moves")),
    (860.0, 5.5, "LEFT", "setup", TEAL, dict(kicker="MEET BILAL",
     chips=["AGE 30", "$58,000 / YEAR", "$12,000 SAVED", "$200 / MONTH"])),
    (883.2, 6.5, "TOP", "list", TEAL, dict(kicker="BILAL'S FUND SCREENS OUT",
     items=["conventional banking & insurance", "alcohol", "gambling",
            "tobacco", "weapons", "adult content"])),
    (907.1, 6.0, "TOP", "quote", TEAL, dict(
     text="RIBA — you may not rent out money.", sub="a return should attach to doing something and carrying its risk")),
    (929.7, 6.0, "TOP", "stat", TEAL, dict(kicker="MUDARABA",
     value="CAPITAL + WORK", sub="profit split agreed in advance  ·  losses included")),
    (953.3, 5.5, "LOWRIGHT", "stat", TEAL, dict(kicker="YEAR 30  ·  BILAL",
     value="$418,800", sub="$50,100 behind Sammy — deliberately")),
    (1002.3, 6.0, "TOP", "stat", GOLD, dict(kicker="BILAL FINISHED",
     value="$309,000", sub="ahead of Adam — the number that matters")),
    (1014.8, 5.0, "TOP", "quote", GOLD, dict(
     text="The real choice isn't Sammy vs Bilal. It's whether to be an owner at all.")),
    (1055.0, 4.8, "LOWRIGHT", "quote", RUST, dict(
     text="Adam took a guaranteed slow loss — and was told it was safety.")),
]


def q(t):
    """Quantize to the frame grid."""
    return round(round(t * FPS) / FPS, 4)


# ── transcript → corrected words → caption cues ──────────────────────────
def load_words():
    words = json.load(open(f"{HERE}/transcript.json"))
    for t, wrong, right in CORR:
        best, bi = 1e9, None
        for i, w in enumerate(words):
            if w["text"] == wrong and abs(w["start"] - t) < best:
                best, bi = abs(w["start"] - t), i
        if bi is not None:
            words[bi]["text"] = right
    for w in words:
        base = NORM.get(w["text"].rstrip(".,?!"))
        if base:
            tail = w["text"][len(w["text"].rstrip(".,?!")):]
            w["text"] = base + tail
    return words


def make_cues(words, max_words=6, max_span=3.0, max_gap=0.8):
    cues, cur = [], []
    for i, w in enumerate(words):
        if cur:
            span = w["end"] - cur[0]["start"]
            gap = w["start"] - cur[-1]["end"]
            if len(cur) >= max_words or span > max_span or gap > max_gap:
                cues.append(cur)
                cur = []
        cur.append(w)
        if w["text"].endswith((".", "?", "!")) and len(cur) >= 3:
            cues.append(cur)
            cur = []
    if cur:
        cues.append(cur)
    return [c for c in cues if c]


# ── card fragment rendering ──────────────────────────────────────────────
def esc(s):
    return html.escape(str(s))


def chars(cid, eid, text, cls):
    # Per-character spans let a line break fall between any two letters, which
    # splits words ("that b / ank"). Wrap each word in a nowrap group so breaks
    # can only land on real spaces.
    groups = []
    for word in text.split(" "):
        inner = "".join(f'<span class="char">{esc(c)}</span>' for c in word)
        groups.append(f'<span class="wgrp">{inner}</span>')
    spans = '<span class="char">&nbsp;</span>'.join(groups)
    return (f'<div id="{eid}" class="{cls}" data-anim="kinetic-chars" '
            f'data-anim-at="0.18" data-anim-duration="0.5" data-anim-stagger="0.012" '
            f'data-anim-pattern="pop">{spans}</div>')


NUMRE = re.compile(r"^\$?([\d,]+)$")


def render_card(cid, zone, tmpl, accent, c):
    """Return (fragment_html, [anim descriptors])."""
    anims = []
    body = []
    kicker = c.get("kicker")
    if kicker:
        body.append(f'<div id="{cid}-k" class="kicker" data-anim="fade-in" '
                    f'data-anim-at="0.05" data-anim-duration="0.35">{esc(kicker)}</div>')
        anims.append(("fade", f"#{cid}-k", 0.05, 0.35, None))
    body.append(f'<div id="{cid}-rule" class="rule" data-anim="grow-x" '
                f'data-anim-at="0.22" data-anim-duration="0.5" data-anim-target-w="160"></div>')
    anims.append(("growx", f"#{cid}-rule", 0.22, 0.5, 160))

    if tmpl == "stat":
        v = c["value"]
        m = NUMRE.match(v)
        if m:
            n = int(m.group(1).replace(",", ""))
            pre = "$" if v.startswith("$") else ""
            body.append(f'<div id="{cid}-v" class="value" data-anim="count-up" '
                        f'data-anim-at="0.3" data-anim-duration="0.9" data-anim-from="0" '
                        f'data-anim-to="{n}" data-anim-format=",d">{pre}0</div>')
            anims.append(("count", f"#{cid}-v", 0.3, 0.9, (n, pre)))
        else:
            body.append(chars(cid, f"{cid}-v", v, "value"))
            anims.append(("chars", f"#{cid}-v", 0.18, 0.5, 0.012))
        if c.get("sub"):
            body.append(f'<div id="{cid}-s" class="sub" data-anim="fade-in" '
                        f'data-anim-at="0.72" data-anim-duration="0.4">{esc(c["sub"])}</div>')
            anims.append(("fade", f"#{cid}-s", 0.72, 0.4, None))

    elif tmpl == "quote":
        body.append(chars(cid, f"{cid}-v", c["text"], "quote"))
        anims.append(("chars", f"#{cid}-v", 0.18, 0.5, 0.012))
        if c.get("sub"):
            body.append(f'<div id="{cid}-s" class="sub" data-anim="fade-in" '
                        f'data-anim-at="0.8" data-anim-duration="0.4">{esc(c["sub"])}</div>')
            anims.append(("fade", f"#{cid}-s", 0.8, 0.4, None))

    elif tmpl == "setup":
        chips = "".join(f'<span class="chip">{esc(x)}</span>' for x in c["chips"])
        body.append(f'<div id="{cid}-v" class="chips" data-anim="slide-in" '
                    f'data-anim-at="0.3" data-anim-duration="0.5" data-anim-from="bottom" '
                    f'data-anim-distance="26">{chips}</div>')
        anims.append(("slide", f"#{cid}-v", 0.3, 0.5, 26))

    elif tmpl == "list":
        items = "".join(f'<span class="li">{esc(x)}</span>' for x in c["items"])
        body.append(f'<div id="{cid}-v" class="chips" data-anim="slide-in" '
                    f'data-anim-at="0.3" data-anim-duration="0.5" data-anim-from="bottom" '
                    f'data-anim-distance="26">{items}</div>')
        anims.append(("slide", f"#{cid}-v", 0.3, 0.5, 26))

    elif tmpl == "compare":
        rows = []
        for i, (name, val, col) in enumerate(c["rows"]):
            rows.append(
                f'<div class="row" id="{cid}-r{i}" data-anim="slide-in" '
                f'data-anim-at="{0.3 + i * 0.14:.2f}" data-anim-duration="0.5" '
                f'data-anim-from="left" data-anim-distance="40">'
                f'<span class="rname">{esc(name)}</span>'
                f'<span class="rval" style="color:{col}">{esc(val)}</span></div>')
            anims.append(("slide", f"#{cid}-r{i}", 0.3 + i * 0.14, 0.5, 40))
        body.append('<div class="rows">' + "".join(rows) + "</div>")

    elif tmpl == "versus":
        body.append(
            f'<div class="vs" id="{cid}-v" data-anim="fade-in" data-anim-at="0.3" '
            f'data-anim-duration="0.5">'
            f'<div class="vhalf"><span class="vlabel">{esc(c["left_label"])}</span>'
            f'<span class="vtext" style="color:{c["left_accent"]}">{esc(c["left_text"])}</span></div>'
            f'<div class="vsep"></div>'
            f'<div class="vhalf"><span class="vlabel">{esc(c["right_label"])}</span>'
            f'<span class="vtext" style="color:{c["right_accent"]}">{esc(c["right_text"])}</span></div>'
            f"</div>")
        anims.append(("fade", f"#{cid}-v", 0.3, 0.5, None))

    css = f"""
    .card[data-card-id="{cid}"] .root {{ width:100%; height:100%; display:flex;
      align-items:{'flex-start' if zone == 'TOP' else 'center'}; justify-content:center;
      padding:{'44px 60px 0' if zone == 'TOP' else '0'}; }}
    .card[data-card-id="{cid}"] .slab {{ background:rgba(23,19,14,.93);
      border-radius:18px; padding:26px 40px 30px; max-width:{1360 if zone == 'TOP' else 820}px;
      box-shadow:0 18px 54px rgba(0,0,0,.34); border-top:5px solid {accent};
      text-align:{'center' if zone in ('TOP', 'CENTER') else 'left'}; }}
    .card[data-card-id="{cid}"] .rule {{ height:5px; background:{accent};
      border-radius:3px; margin:12px auto 14px; width:0;
      {'margin-left:0;' if zone not in ('TOP', 'CENTER') else ''} }}
    """
    frag = (f'<div class="card" data-card-id="{cid}"><style>{css}</style>'
            f'<div class="root"><div class="slab">' + "".join(body) + "</div></div></div>")
    return frag, anims


def main():
    words = load_words()
    cues = make_cues(words)

    # sanity: cards must not overlap
    ordered = sorted(CARDS, key=lambda c: c[0])
    for a, b in zip(ordered, ordered[1:]):
        assert a[0] + a[1] <= b[0] + 1e-6, f"card overlap at {a[0]} -> {b[0]}"

    os.makedirs(f"{HERE}/public/cards", exist_ok=True)

    # ── caption rail markup ──
    wi = 0
    cue_html, wt = [], []
    for ci, cue in enumerate(cues):
        start = q(cue[0]["start"] - 0.08)
        # hold the line a beat past the last word, but never into the next cue
        end = q(min(cue[-1]["end"] + 0.34, DUR))
        if ci + 1 < len(cues):
            end = min(end, q(cues[ci + 1][0]["start"] - 0.08) - 1.0 / FPS)
        end = max(end, start + 1.0 / FPS)
        spans = []
        for w in cue:
            spans.append(f'<span class="w" id="w{wi}">{esc(w["text"])}</span>')
            wt.append((q(w["start"]), q(min(w["end"], DUR))))
            wi += 1
        cue_html.append(
            f'<div class="cue clip" data-start="{start:.4f}" '
            f'data-duration="{max(q(end - start), 1.0 / FPS):.4f}" data-track-index="3">'
            f'<span class="pill">' + " ".join(spans) + "</span></div>")

    # ── cards ──
    hosts, card_js = [], []
    for idx, (st, dur, zone, tmpl, accent, content) in enumerate(ordered, 1):
        cid = f"card-{idx:02d}"
        frag, anims = render_card(cid, zone, tmpl, accent, content)
        open(f"{HERE}/public/cards/{cid}.html", "w").write(frag)
        x, y, cw, ch = ZONES[zone]
        st, dur = q(st), q(dur)
        hosts.append(
            f'<div class="card-host clip" data-card-id="{cid}" data-start="{st:.4f}" '
            f'data-duration="{dur:.4f}" data-track-index="2" '
            f'style="left:{x}px;top:{y}px;width:{cw}px;height:{ch}px;'
            f'visibility:hidden;opacity:0;">{frag}</div>')

        sel = f'.card-host[data-card-id="{cid}"]'
        card_js.append(f'tl.set(\'{sel}\',{{visibility:"visible"}},{st:.4f});')
        card_js.append(f'tl.fromTo(\'{sel}\',{{opacity:0,y:-14}},'
                       f'{{opacity:1,y:0,duration:0.42,ease:"power2.out"}},{st:.4f});')
        for kind, s, at, d, extra in anims:
            t = q(st + at)
            full = f'.card[data-card-id="{cid}"] {s}'
            if kind == "fade":
                card_js.append(f'tl.fromTo(\'{full}\',{{opacity:0}},'
                               f'{{opacity:1,duration:{d},ease:"power2.out"}},{t:.4f});')
            elif kind == "growx":
                card_js.append(f'tl.fromTo(\'{full}\',{{width:0}},'
                               f'{{width:{extra},duration:{d},ease:"power2.out"}},{t:.4f});')
            elif kind == "chars":
                card_js.append(f'tl.from(\'{full} .char\',{{opacity:0,y:10,scale:0.86,'
                               f'duration:{d},ease:"power2.out",stagger:{extra}}},{t:.4f});')
            elif kind == "slide":
                card_js.append(f'tl.fromTo(\'{full}\',{{opacity:0,y:{extra}}},'
                               f'{{opacity:1,y:0,duration:{d},ease:"power2.out"}},{t:.4f});')
            elif kind == "count":
                n, pre = extra
                card_js.append(
                    f'(function(){{var o={{v:0}};tl.to(o,{{v:{n},duration:{d},'
                    f'ease:"power2.out",onUpdate:function(){{var e=document.querySelector('
                    f"'{full}');if(e)e.textContent='{pre}'+__fmt(o.v,',d');}}}},{t:.4f});}})();")
        # the hard kill must land at or after the exit fade completes, or a
        # seek can land past the fade and leave stale visibility state
        end_t = q(st + dur)
        ex = round(end_t - 0.35, 4)
        card_js.append(f'tl.to(\'{sel}\',{{opacity:0,duration:0.35,ease:"power2.in"}},{ex:.4f});')
        card_js.append(f'tl.set(\'{sel}\',{{visibility:"hidden"}},{end_t:.4f});')

    ws_js = "[" + ",".join(str(a) for a, b in wt) + "]"

    doc = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
@font-face {{ font-family:"Inter"; src:url("fonts/Inter-400-latin.woff2") format("woff2");
  font-weight:400; font-display:block; }}
@font-face {{ font-family:"Inter"; src:url("fonts/Inter-700-latin.woff2") format("woff2");
  font-weight:700; font-display:block; }}
:root {{ --bg:{CREAM}; --text:{INK}; --accent-0:{TEAL}; --accent-1:{RUST};
  --accent-2:{OLIVE}; --accent-3:{GOLD}; --accent-4:{INK}; }}
* {{ box-sizing:border-box; }}
html,body {{ margin:0; padding:0; width:100%; height:100%; overflow:hidden; background:#000;
  font-family:"Inter",ui-sans-serif,system-ui,sans-serif; }}
#stage {{ position:relative; width:100%; height:100%; overflow:hidden; }}
.video-wrapper {{ position:absolute; left:0; top:0; width:{W}px; height:{H}px; overflow:hidden; }}
.video-wrapper video {{ width:100%; height:100%; object-fit:cover; }}
.card-host {{ position:absolute; pointer-events:none; overflow:hidden; }}
.card-host .card {{ position:relative; width:100%; height:100%; overflow:hidden; }}
.card-host .char {{ display:inline-block; visibility:visible; }}
.card-host .wgrp {{ display:inline-block; white-space:nowrap; }}

/* ── card typography ── */
.kicker {{ font-size:23px; font-weight:700; letter-spacing:.16em; text-transform:uppercase;
  color:rgba(247,240,222,.66); }}
.value {{ font-size:92px; font-weight:700; letter-spacing:-.022em; color:{CREAM};
  line-height:1.02; }}
.quote {{ font-size:52px; font-weight:700; letter-spacing:-.014em; color:{CREAM};
  line-height:1.2; }}
.sub {{ font-size:27px; font-weight:400; color:rgba(247,240,222,.74); margin-top:14px;
  line-height:1.35; }}
.chips {{ display:flex; flex-wrap:wrap; gap:12px; justify-content:center; }}
.chip, .li {{ font-size:26px; font-weight:700; color:{CREAM}; border:2px solid rgba(247,240,222,.3);
  border-radius:999px; padding:9px 20px; }}
.li {{ font-weight:400; font-size:24px; }}
.rows {{ display:flex; flex-direction:column; gap:12px; }}
.row {{ display:flex; align-items:baseline; justify-content:space-between; gap:44px; }}
.rname {{ font-size:29px; font-weight:700; letter-spacing:.1em; color:rgba(247,240,222,.72); }}
.rval {{ font-size:78px; font-weight:700; letter-spacing:-.02em; }}
.vs {{ display:flex; align-items:stretch; gap:36px; }}
.vhalf {{ display:flex; flex-direction:column; gap:8px; flex:1; }}
.vsep {{ width:2px; background:rgba(247,240,222,.24); }}
.vlabel {{ font-size:23px; font-weight:700; letter-spacing:.16em; color:rgba(247,240,222,.6); }}
.vtext {{ font-size:66px; font-weight:700; letter-spacing:-.02em; }}

/* ── caption rail (overlay, above the source's own progress bar) ── */
#rail {{ position:absolute; left:{RAIL['left']}px; top:{RAIL['top']}px;
  width:{RAIL['width']}px; height:{RAIL['height']}px; pointer-events:none; }}
.cue {{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }}
.pill {{ background:rgba(23,19,14,.9); border-radius:14px; padding:13px 30px;
  box-shadow:0 10px 30px rgba(0,0,0,.3); max-width:100%; }}
.w {{ display:inline-block; font-size:43px; font-weight:700; letter-spacing:-.01em;
  color:{CREAM}; margin:0 6px; transform-origin:50% 70%; }}
</style>
</head>
<body>
<div id="stage" data-composition-id="talking-head-recut" data-start="0"
     data-duration="{DUR}" data-fps="{FPS}" data-width="{W}" data-height="{H}">
  <div class="video-wrapper" id="video-wrap">
    <video id="bg-video" src="input-video.mp4" muted playsinline
           data-start="0" data-duration="{DUR}" data-track-index="1"></video>
  </div>
  <audio id="source-audio" src="input-video.mp4" data-start="0" data-duration="{DUR}"
         data-track-index="10" data-volume="1"></audio>

{os.linesep.join('  ' + h for h in hosts)}

  <div id="rail">
{os.linesep.join('    ' + c for c in cue_html)}
  </div>

  <script src="vendor/gsap.min.js"></script>
  <script>
  (function () {{
    window.__fmt = function (v, fmt) {{
      if (typeof fmt === "string" && /^\\.[0-9]+f$/.test(fmt)) {{
        return Number(v).toFixed(Number(fmt.slice(1, -1)));
      }}
      if (fmt === ",d") return Math.round(v).toLocaleString();
      return String(Math.round(v));
    }};
    var tl = window.gsap.timeline({{ paused: true }});

    // ── caption rail: word-synced highlight ──
    // Two tweens per word (~4.7k) makes timeline construction blow the
    // renderer's 10s navigation budget, so a single driver tween resolves
    // the active word by binary search instead. Deterministic and
    // seek-safe: the active word is a pure function of timeline time.
    var WS = {ws_js};
    var WE = [];
    for (var i = 0; i < WS.length; i++) WE.push(document.getElementById("w" + i));
    var drv = {{ p: 0 }}, prev = -1;
    tl.to(drv, {{
      p: 1, duration: {DUR}, ease: "none",
      onUpdate: function () {{
        var t = drv.p * {DUR};
        var lo = 0, hi = WS.length - 1, k = -1;
        while (lo <= hi) {{
          var mid = (lo + hi) >> 1;
          if (WS[mid] <= t) {{ k = mid; lo = mid + 1; }} else {{ hi = mid - 1; }}
        }}
        if (k === prev) return;
        var e;
        if (prev >= 0 && (e = WE[prev])) {{ e.style.color = "{CREAM}"; e.style.transform = ""; }}
        if (k >= 0 && (e = WE[k])) {{ e.style.color = "{GOLD}"; e.style.transform = "scale(1.07)"; }}
        prev = k;
      }}
    }}, 0);

    // ── graphic cards ──
{os.linesep.join('    ' + j for j in card_js)}

    window.__timelines = window.__timelines || {{}};
    window.__timelines["talking-head-recut"] = tl;
  }})();
  </script>
</div>
</body>
</html>
"""
    open(f"{HERE}/public/index.html", "w").write(doc)

    storyboard = dict(
        schemaVersion=3,
        composition=dict(fps=FPS, width=W, height=H, durationSeconds=DUR,
                         layout="landscape", themeId="craft", seed=42),
        videoTrack=dict(sourcePath="input-video.mp4", startSec=0, endSec=DUR,
                        bounds=dict(x=0, y=0, width=W, height=H)),
        subtitles=dict(enabled=True, style="word-synced rail", cues=len(cues),
                       words=len(wt), bounds=RAIL),
        cards=[dict(id=f"card-{i:02d}", startSec=c[0], endSec=round(c[0] + c[1], 2),
                    zone=c[2], template=c[3], accent=c[4],
                    intent=(c[5].get("kicker") or c[5].get("text", ""))[:90])
               for i, c in enumerate(ordered, 1)],
    )
    json.dump(storyboard, open(f"{HERE}/storyboard.json", "w"), indent=2)

    print(f"words {len(wt)}  cues {len(cues)}  cards {len(ordered)}")
    print(f"timeline entries ~{len(wt) * 2 + len(card_js)}")
    print(f"index.html {os.path.getsize(f'{HERE}/public/index.html') / 1024:.0f} KB")


if __name__ == "__main__":
    main()
