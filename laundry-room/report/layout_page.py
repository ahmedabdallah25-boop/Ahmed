"""Proposed layout plan — measured 8.96 x 4.28 m, 4 washers + 3 dryers, nothing moved."""
from reportlab.lib.colors import HexColor, Color


def tint(c0, f):
    """Blend a colour with white at opacity f — deterministic, no alpha."""
    return Color(1-(1-c0.red)*f, 1-(1-c0.green)*f, 1-(1-c0.blue)*f)

GROUND=HexColor("#F2F3F1"); SURFACE=HexColor("#FBFBFA"); SUNK=HexColor("#E9EBE7")
INK=HexColor("#1B1F1D"); INK_SOFT=HexColor("#5A615B"); INK_FAINT=HexColor("#888F88")
RULE=HexColor("#D6D9D3"); RULE_STRONG=HexColor("#AEB3AC")
ACCENT=HexColor("#B8890B"); ACCENT_BR=HexColor("#E3AE18"); ALERT=HexColor("#A63A2C")
SOILED=HexColor("#C0392B"); CLEAN=HexColor("#2C6E52"); WALK=HexColor("#E3AE18")
WASH=HexColor("#8C96A2"); WASH_D=HexColor("#5E6773")
DRY=HexColor("#9AA29A");  DRY_D=HexColor("#6F776F")
WHITE=HexColor("#FFFFFF")

SERIF="Times-Roman"; SERIF_B="Times-Bold"; SERIF_I="Times-Italic"
MONO="Courier"; MONO_B="Courier-Bold"

S = 62.0           # points per metre
OX, OY = 116, 196  # plan origin

# ---- measured geometry, metres ----------------------------------------
RW, RD = 8.96, 4.28

# 4 washer-extractors, south wall (the plumbed wall)
WASHERS = [("W4", 2.90, 0.00, 0.95, 1.05), ("W3", 4.05, 0.00, 0.95, 1.05),
           ("W2", 5.20, 0.00, 0.95, 1.05), ("W1", 6.35, 0.00, 0.95, 1.05)]
# 3 tumble dryers, north wall (the ducted wall)
DRYERS  = [("D1", 0.60, 3.13, 0.95, 1.15), ("D2", 1.75, 3.13, 0.95, 1.15),
           ("D3", 2.90, 3.13, 0.95, 1.15)]

SOIL_BAYS  = [(4.75, 3.20, 0.95, 1.00), (5.90, 3.20, 0.95, 1.00)]
CLEAN_BAYS = [(7.60, 0.15, 0.95, 1.00)]

DOOR = (RW, 1.60, 0.12, 1.20)          # single entrance, east wall
WALKWAY = (0.25, 1.22, 8.45, 1.72)     # walkway rectangle
TANK = (7.30, 3.25, 1.40, 0.95)        # bulk tank, overhead


def m2p(x, y):
    return OX + x * S, OY + y * S


def rect_m(c, x, y, w, h, fill=None, stroke=None, lw=0.8, alpha=None, dash=None):
    px, py = m2p(x, y)
    if alpha is not None:
        c.saveState(); c.setFillAlpha(alpha)
    if fill is not None:
        c.setFillColor(fill)
    if stroke is not None:
        c.setStrokeColor(stroke); c.setLineWidth(lw)
    if dash:
        c.setDash(*dash)
    c.rect(px, py, w * S, h * S, stroke=1 if stroke is not None else 0,
           fill=1 if fill is not None else 0)
    if dash:
        c.setDash()
    if alpha is not None:
        c.restoreState()


def txt_m(c, s, x, y, font=SERIF, size=7.5, color=INK, anchor="c", dy=0.0):
    px, py = m2p(x, y); py += dy
    c.setFillColor(color); c.setFont(font, size)
    (c.drawCentredString if anchor == "c" else
     c.drawString if anchor == "l" else c.drawRightString)(px, py, s)


def hatch_m(c, x, y, w, h, color, step=0.16):
    c.saveState()
    px, py = m2p(x, y)
    p = c.beginPath(); p.rect(px, py, w * S, h * S); c.clipPath(p, stroke=0)
    c.setStrokeColor(color); c.setLineWidth(0.7)
    i = -h
    while i < w + h:
        a = m2p(x + i, y); b = m2p(x + i + h, y + h)
        c.line(a[0], a[1], b[0], b[1]); i += step
    c.restoreState()


def swatch(c, x, y, col, label, sub=None, w=13, h=9, alpha=0.30):
    c.saveState(); c.setFillAlpha(alpha); c.setFillColor(col)
    c.rect(x, y, w, h, stroke=0, fill=1); c.restoreState()
    c.setStrokeColor(col); c.setLineWidth(0.8); c.rect(x, y, w, h, stroke=1, fill=0)
    c.setFillColor(INK); c.setFont(SERIF, 8.2); c.drawString(x + w + 7, y + 2.5, label)
    if sub:
        c.setFillColor(INK_FAINT); c.setFont(SERIF, 7.4); c.drawString(x + w + 7, y - 7, sub)


def arrow(c, x1, y1, x2, y2, color=INK, lw=1.3):
    a = m2p(x1, y1); b = m2p(x2, y2)
    c.setStrokeColor(color); c.setLineWidth(lw); c.line(a[0], a[1], b[0], b[1])
    import math
    ang = math.atan2(b[1] - a[1], b[0] - a[0])
    c.setFillColor(color); p = c.beginPath(); p.moveTo(b[0], b[1])
    for d in (2.6, -2.6):
        p.lineTo(b[0] - 7 * math.cos(ang - d * 0.12) * 1.0,
                 b[1] - 7 * math.sin(ang - d * 0.12) * 1.0)
    p.close(); c.drawPath(p, stroke=0, fill=1)


def draw_layout(c, PW, PH, M, footer, label, wrap, para, page_bg, pageno, total):
    page_bg(c)

    label(c, "Proposed layout — measured", M, PH - 52)
    c.setFillColor(INK); c.setFont(SERIF_B, 21)
    c.drawString(M, PH - 78, "8.96 × 4.28 m · 4 washers, 3 dryers · nothing moves")
    c.setStrokeColor(INK); c.setLineWidth(1.4); c.line(M, PH - 88, PW - M, PH - 88)
    c.setFillColor(INK_SOFT); c.setFont(SERIF, 9.4)
    c.drawString(M, PH - 103,
                 "Drawn to the dimensions supplied. Everything in colour is paint, signage or a bin — no machine, pipe or duct is relocated.")

    # ---- floor + zones
    rect_m(c, 0, 0, RW, RD, fill=SURFACE)
    rect_m(c, 4.55, 3.05, 4.25, 1.15, fill=tint(SOILED, 0.16))      # soiled receiving, NE
    rect_m(c, 7.40, 0.10, 1.40, 1.05, fill=tint(CLEAN, 0.18))       # clean staging, SE
    rect_m(c, 0.20, 0.10, 2.55, 1.05, fill=tint(CLEAN, 0.18))       # clean folding, SW
    rect_m(c, *WALKWAY, fill=tint(WALK, 0.26))

    hatch_m(c, 8.20, 1.22, 0.55, 1.72, ALERT)                       # keep clear inside door
    hatch_m(c, 0.20, 2.00, 0.55, 0.95, ALERT)                       # keep clear at board

    # ---- walls
    c.setStrokeColor(INK); c.setLineWidth(2.4)
    x0, y0 = m2p(0, 0); x1, y1 = m2p(RW, RD)
    c.line(x0, y0, x1, y0); c.line(x0, y0, x0, y1)
    c.line(x0, y1, x1, y1)
    dx, dy_, dw, dh = DOOR
    e0 = m2p(RW, 0); e1 = m2p(RW, dy_); e2 = m2p(RW, dy_ + dh); e3 = m2p(RW, RD)
    c.line(e0[0], e0[1], e1[0], e1[1]); c.line(e2[0], e2[1], e3[0], e3[1])

    # ---- single door
    rect_m(c, dx, dy_, dw, dh, fill=WHITE, stroke=CLEAN, lw=1.8)
    px, py = m2p(dx + dw / 2, dy_ + dh / 2)
    c.saveState(); c.translate(px + 13, py); c.rotate(90)
    c.setFillColor(CLEAN); c.setFont(MONO_B, 6.6)
    c.drawCentredString(0, 0, "ENTRANCE / FIRE EXIT"); c.restoreState()

    # ---- machines
    for mid, x, y, w, h in WASHERS:
        rect_m(c, x, y, w, h, fill=WASH, stroke=WASH_D, lw=1.0)
        txt_m(c, mid, x + w / 2, y + h / 2, font=MONO_B, size=10, color=WHITE, dy=-3)
        p = m2p(x + w / 2, y + h + 0.05)
        c.setStrokeColor(WASH_D); c.setLineWidth(0.6); c.setDash(1.5, 1.5)
        c.circle(p[0], p[1], 0.17 * S, stroke=1, fill=0); c.setDash()
    for mid, x, y, w, h in DRYERS:
        rect_m(c, x, y, w, h, fill=DRY, stroke=DRY_D, lw=1.0)
        txt_m(c, mid, x + w / 2, y + h / 2, font=MONO_B, size=10, color=WHITE, dy=-3)
        p = m2p(x + w / 2, y - 0.05)
        c.setStrokeColor(DRY_D); c.setLineWidth(0.6); c.setDash(1.5, 1.5)
        c.circle(p[0], p[1], 0.17 * S, stroke=1, fill=0); c.setDash()
        # duct drop symbol
        pd = m2p(x + w / 2, y + h - 0.02)
        c.setStrokeColor(ACCENT); c.setLineWidth(2.0)
        c.line(pd[0], pd[1], pd[0], pd[1] + 6)
    txt_m(c, "existing rigid header duct above — only the 3 flexible drops change", 2.35, RD,
          font=SERIF_I, size=6.4, color=ACCENT, dy=9)

    # ---- lint bins between the dryers (dryers are the lint source)
    for gx in (1.58, 2.73, 3.88):
        rect_m(c, gx, 3.30, 0.14, 0.38, fill=INK)
    txt_m(c, "3 lidded lint bins — one per dryer", 0.60, 3.00, font=SERIF_I, size=6.6,
          color=INK_FAINT, anchor="l")

    # ---- bays
    for x, y, w, h in SOIL_BAYS:
        rect_m(c, x, y, w, h, fill=SURFACE)
        rect_m(c, x, y, w, h, stroke=SOILED, lw=1.5, dash=(2.5, 2))
        txt_m(c, "SOILED", x + w / 2, y + h / 2, font=MONO_B, size=6, color=SOILED, dy=-2.5)
    for x, y, w, h in CLEAN_BAYS:
        rect_m(c, x, y, w, h, fill=SURFACE)
        rect_m(c, x, y, w, h, stroke=CLEAN, lw=1.5, dash=(2.5, 2))
        txt_m(c, "CLEAN", x + w / 2, y + h / 2, font=MONO_B, size=6, color=CLEAN, dy=-2.5)
    rect_m(c, 0.25, 0.18, 2.45, 0.55, fill=SUNK, stroke=RULE_STRONG, lw=0.9)
    txt_m(c, "clean linen shelving / folding", 1.47, 0.40, font=SERIF, size=6.6, color=INK_SOFT)

    # ---- overhead tank
    rect_m(c, *TANK, stroke=INK_FAINT, lw=1.0, dash=(3, 2.5))
    txt_m(c, "BULK TANK OVER", 8.00, 3.80, font=MONO_B, size=6, color=INK_FAINT)
    txt_m(c, "verify contents + containment", 8.00, 3.80, font=SERIF_I, size=6.2,
          color=INK_FAINT, dy=-9)

    # ---- board
    rect_m(c, -0.10, 2.00, 0.14, 0.95, fill=ALERT)
    c.saveState(); p = m2p(-0.28, 2.48); c.translate(p[0], p[1]); c.rotate(90)
    c.setFillColor(ALERT); c.setFont(MONO_B, 6.4); c.drawCentredString(0, 0, "BOARD"); c.restoreState()

    # ---- flow: anticlockwise U
    # north lane = soiled / in-progress ; south lane = clean returning
    arrow(c, 8.40, 3.72, 7.05, 3.72, SOILED)              # in at the door, into receiving
    arrow(c, 6.30, 2.62, 6.30, 1.32, SOILED)              # down across to the washers
    arrow(c, 5.60, 2.62, 2.10, 2.62, INK)                 # transfer west
    arrow(c, 1.25, 2.62, 1.25, 3.06, INK)                 # up into the dryers
    arrow(c, 1.90, 1.52, 7.10, 1.52, CLEAN)               # clean back east, south lane
    arrow(c, 7.90, 1.35, 7.90, 1.20, CLEAN)               # down into clean staging
    txt_m(c, "SOILED IN", 7.05, 3.72, font=MONO_B, size=7, color=SOILED, dy=11, anchor="r")
    txt_m(c, "WASH", 6.30, 2.00, font=MONO_B, size=6.4, color=SOILED, anchor="l", dy=0)
    txt_m(c, "TRANSFER", 3.85, 2.62, font=MONO_B, size=6.6, color=INK, dy=8)
    txt_m(c, "DRY", 1.40, 2.98, font=MONO_B, size=6.4, color=INK, anchor="l")
    txt_m(c, "CLEAN OUT", 4.50, 1.52, font=MONO_B, size=7, color=CLEAN, dy=8)

    # ---- lighting: 2 rows of 5
    c.saveState(); c.setStrokeColor(INK_FAINT); c.setLineWidth(1.6)
    c.setStrokeAlpha(0.55); c.setDash(4, 3)
    for row_y in (1.45, 2.75):
        for i in range(5):
            xa = 0.50 + i * 1.72
            a = m2p(xa, row_y); b = m2p(xa + 1.05, row_y)
            c.line(a[0], a[1], b[0], b[1])
    c.setDash(); c.restoreState()

    # ---- dimensions
    c.setFillColor(INK_FAINT); c.setFont(MONO, 7.4)
    c.drawCentredString((m2p(0, 0)[0] + m2p(RW, 0)[0]) / 2, m2p(0, 0)[1] - 19, "8.96 m")
    c.saveState(); c.translate(m2p(0, 0)[0] - 26, (m2p(0, 0)[1] + m2p(0, RD)[1]) / 2)
    c.rotate(90); c.drawCentredString(0, 0, "4.28 m"); c.restoreState()
    txt_m(c, "walkway 1.72 m clear — soiled runs the north lane, clean returns the south", 4.48, 2.08, font=SERIF_I, size=6.4, color=INK_FAINT, dy=-3)

    # ---- legend
    ly = 150
    c.setStrokeColor(RULE_STRONG); c.setLineWidth(0.7); c.line(M, ly + 18, PW - M, ly + 18)
    label(c, "Legend — everything below is paint, signage or a bin", M, ly + 4, size=6.6)
    swatch(c, M, ly - 18, tint(SOILED, 0.16), "Soiled side", "receiving north-east, by the door", alpha=1.0)
    swatch(c, M, ly - 42, tint(CLEAN, 0.18), "Clean side", "staging south-east + folding south-west", alpha=1.0)
    swatch(c, M + 205, ly - 18, tint(WALK, 0.26), "Walkway", "1.72 m clear, also the escape route", alpha=1.0)
    swatch(c, M + 205, ly - 42, tint(ALERT, 0.22), "Keep clear", "board and inside the door", alpha=1.0)
    swatch(c, M + 410, ly - 18, WASH, "Washer W1–W4", "south wall, plumbed", alpha=1.0)
    swatch(c, M + 410, ly - 42, DRY, "Dryer D1–D3", "north wall, ducted", alpha=1.0)
    c.setStrokeColor(INK_FAINT); c.setLineWidth(1.6); c.setDash(4, 3)
    c.line(M + 410, ly - 60, M + 423, ly - 60); c.setDash()
    c.setFillColor(INK); c.setFont(SERIF, 8.2); c.drawString(M + 430, ly - 63, "LED batten")
    c.setFillColor(INK_FAINT); c.setFont(SERIF, 7.4); c.drawString(M + 430, ly - 72, "10 fittings, two rows of five")

    c.setFillColor(INK); c.setFont(SERIF_B, 8.6)
    c.drawString(M + 610, ly - 10, "One door")
    c.setFillColor(INK_SOFT); c.setFont(SERIF, 7.8)
    c.drawString(M + 610, ly - 23, "Soiled in and clean out share it,")
    c.drawString(M + 610, ly - 34, "separated by side, not by direction.")
    c.setFillColor(ALERT); c.setFont(SERIF_I, 7.6)
    c.drawString(M + 610, ly - 47, "So the doorway must never be blocked.")

    # ---- caveat
    c.setFillColor(SUNK); c.rect(M, 44, PW - 2 * M, 42, stroke=0, fill=1)
    c.setFillColor(ACCENT); c.rect(M, 44, 2.4, 42, stroke=0, fill=1)
    c.setFillColor(INK); c.setFont(SERIF_B, 8.4)
    c.drawString(M + 12, 72, "Overall dimensions are yours; machine positions are read from the photographs.")
    para(c, "The 8.96 × 4.28 m envelope and the 4 / 3 machine split are as supplied. Where each machine sits along its "
            "wall is scaled from the top-view photograph and may be out by a few hundred millimetres — mark the floor "
            "from the machines themselves, not from this drawing. The alcove store is not shown: it sits outside this "
            "envelope and needs its own dimension.",
         M + 12, 61, PW - 2 * M - 24, size=7.9, lead=9.6)

    footer(c, pageno, total, "Proposed layout — measured")
    c.showPage()
