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

# 4 washer-extractors — NORTH wall (right as you enter). Plumbed side.
WD = 1.02
WASHERS = [("W4", 1.00, RD-WD, 1.05, WD), ("W3", 2.15, RD-WD, 1.05, WD),
           ("W2", 3.30, RD-WD, 1.05, WD), ("W1", 4.45, RD-WD, 1.05, WD)]
# 3 tumble dryers — SOUTH wall (left as you enter). Ducted side.
DRYERS  = [("D3", 0.70, 0.00, 1.05, 1.15), ("D2", 1.85, 0.00, 1.05, 1.15),
           ("D1", 3.00, 0.00, 1.05, 1.15)]

SOIL_BAYS  = [(5.80, 3.22, 1.05, 0.95), (6.92, 3.22, 1.05, 0.95)]
CLEAN_BAYS = [(7.45, 0.14, 1.15, 0.95)]

DOOR = (RW, 1.55, 0.12, 1.25)          # single entrance, east wall
WALKWAY = (0.25, 1.15, 8.45, 2.11)     # 2.11 m true clear between machine fronts
TANK = (8.05, 3.25, 0.75, 0.98)        # tank rack, 0.75 m measured, NE corner


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
    c.drawString(M, PH - 78, "Dryers left, washers right · 2.11 m walkway · nothing moves")
    c.setStrokeColor(INK); c.setLineWidth(1.4); c.line(M, PH - 88, PW - M, PH - 88)
    c.setFillColor(INK_SOFT); c.setFont(SERIF, 9.4)
    c.drawString(M, PH - 103,
                 "8.96 × 4.28 m. Washers 1.05 × 1.02, dryers 1.05 wide. Everything in colour is paint, signage or a bin — no machine, pipe or duct is relocated.")

    # ---- floor + zones
    rect_m(c, 0, 0, RW, RD, fill=SURFACE)
    rect_m(c, 5.70, 3.10, 3.10, 1.13, fill=tint(SOILED, 0.16))      # soiled receiving, NE
    rect_m(c, 4.30, 0.06, 4.50, 1.12, fill=tint(CLEAN, 0.18))       # clean staging + folding, SE
    rect_m(c, *WALKWAY, fill=tint(WALK, 0.26))

    hatch_m(c, 8.20, 1.25, 0.55, 1.90, ALERT)                       # keep clear inside door
    hatch_m(c, 0.22, 2.45, 0.80, 0.80, ALERT)                       # keep clear at board

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
    for mid, x, y, w, h in WASHERS:                       # north wall, doors face south
        rect_m(c, x, y, w, h, fill=WASH, stroke=WASH_D, lw=1.0)
        txt_m(c, mid, x + w / 2, y + h / 2, font=MONO_B, size=10, color=WHITE, dy=-3)
        p = m2p(x + w / 2, y - 0.05)
        c.setStrokeColor(WASH_D); c.setLineWidth(0.6); c.setDash(1.5, 1.5)
        c.circle(p[0], p[1], 0.17 * S, stroke=1, fill=0); c.setDash()
    for mid, x, y, w, h in DRYERS:                        # south wall, doors face north
        rect_m(c, x, y, w, h, fill=DRY, stroke=DRY_D, lw=1.0)
        txt_m(c, mid, x + w / 2, y + h / 2, font=MONO_B, size=10, color=WHITE, dy=-3)
        p = m2p(x + w / 2, y + h + 0.05)
        c.setStrokeColor(DRY_D); c.setLineWidth(0.6); c.setDash(1.5, 1.5)
        c.circle(p[0], p[1], 0.17 * S, stroke=1, fill=0); c.setDash()
        pd = m2p(x + w / 2, y + 0.02)                     # duct drop, at the south wall
        c.setStrokeColor(ACCENT); c.setLineWidth(2.0)
        c.line(pd[0], pd[1], pd[0], pd[1] - 6)
    txt_m(c, "existing rigid header duct — only the 3 flexible drops change", 2.40, 0.0,
          font=SERIF_I, size=6.4, color=ACCENT, dy=-16)

    # ---- lint bins between the dryers (dryers are the lint source)
    for gx in (1.78, 2.93, 4.08):
        rect_m(c, gx, 0.20, 0.14, 0.38, fill=INK)
    txt_m(c, "3 lidded lint bins — one per dryer", 1.95, 1.24, font=SERIF_I, size=6.6,
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
    rect_m(c, 4.45, 0.14, 2.70, 0.55, fill=SUNK, stroke=RULE_STRONG, lw=0.9)
    txt_m(c, "clean linen shelving / folding", 5.80, 0.36, font=SERIF, size=6.6, color=INK_SOFT)

    # ---- overhead tank
    rect_m(c, *TANK, stroke=INK_FAINT, lw=1.0, dash=(3, 2.5))
    txt_m(c, "TANK", 8.42, 3.80, font=MONO_B, size=5.8, color=INK_FAINT)
    txt_m(c, "0.75 m", 8.42, 3.80, font=MONO_B, size=5.8, color=INK_FAINT, dy=-8)
    txt_m(c, "tank rack 0.75 m — verify contents and containment", 8.80, RD,
          font=SERIF_I, size=6.2, color=INK_FAINT, anchor="r", dy=9)

    # ---- board
    rect_m(c, -0.10, 2.45, 0.14, 0.80, fill=ALERT)
    c.saveState(); p = m2p(-0.30, 2.85); c.translate(p[0], p[1]); c.rotate(90)
    c.setFillColor(ALERT); c.setFont(MONO_B, 6.2); c.drawCentredString(0, 0, "BOARD"); c.restoreState()

    # ---- flow: anticlockwise U
    # north lane = soiled / in-progress ; south lane = clean returning
    # north lane = soiled in and wet transfer ; south lane = clean returning
    arrow(c, 8.35, 2.92, 6.35, 2.92, SOILED)              # in at the door, along the north lane
    arrow(c, 5.10, 2.98, 5.10, 3.22, SOILED)              # up into the washers
    arrow(c, 4.20, 2.52, 1.75, 2.52, INK)                 # transfer west
    arrow(c, 1.30, 2.20, 1.30, 1.26, INK)                 # down into the dryers
    arrow(c, 2.30, 1.62, 6.95, 1.62, CLEAN)               # clean back east, south lane
    arrow(c, 7.75, 1.46, 7.75, 1.20, CLEAN)               # down into clean staging
    txt_m(c, "SOILED IN", 7.45, 2.92, font=MONO_B, size=7, color=SOILED, dy=10)
    txt_m(c, "WASH", 5.30, 3.02, font=MONO_B, size=6.4, color=SOILED, anchor="l")
    txt_m(c, "TRANSFER", 2.95, 2.52, font=MONO_B, size=6.6, color=INK, dy=9)
    txt_m(c, "DRY", 1.52, 1.62, font=MONO_B, size=6.4, color=INK, anchor="l")
    txt_m(c, "CLEAN OUT", 4.55, 1.62, font=MONO_B, size=7, color=CLEAN, dy=9)

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
    txt_m(c, "2.11 m clear between machine fronts", 6.55, 2.20, font=SERIF_I, size=6.4, color=INK_FAINT)

    # ---- legend
    ly = 150
    c.setStrokeColor(RULE_STRONG); c.setLineWidth(0.7); c.line(M, ly + 18, PW - M, ly + 18)
    label(c, "Legend — everything below is paint, signage or a bin", M, ly + 4, size=6.6)
    swatch(c, M, ly - 18, tint(SOILED, 0.16), "Soiled side", "receiving north-east, feeds the washers", alpha=1.0)
    swatch(c, M, ly - 42, tint(CLEAN, 0.18), "Clean side", "staging + folding south-east, off the dryers", alpha=1.0)
    swatch(c, M + 205, ly - 18, tint(WALK, 0.26), "Walkway", "2.11 m clear, also the escape route", alpha=1.0)
    swatch(c, M + 205, ly - 42, tint(ALERT, 0.22), "Keep clear", "board and inside the door", alpha=1.0)
    swatch(c, M + 410, ly - 18, WASH, "Washer W1–W4", "north wall — RIGHT as you enter", alpha=1.0)
    swatch(c, M + 410, ly - 42, DRY, "Dryer D1–D3", "south wall — LEFT as you enter", alpha=1.0)
    c.setStrokeColor(INK_FAINT); c.setLineWidth(1.6); c.setDash(4, 3)
    c.line(M + 410, ly - 60, M + 423, ly - 60); c.setDash()
    c.setFillColor(INK); c.setFont(SERIF, 8.2); c.drawString(M + 430, ly - 63, "LED batten")
    c.setFillColor(INK_FAINT); c.setFont(SERIF, 7.4); c.drawString(M + 430, ly - 72, "10 fittings, two rows of five")

    c.setFillColor(INK); c.setFont(SERIF_B, 8.6)
    c.drawString(M + 610, ly - 10, "One door, and it works")
    c.setFillColor(INK_SOFT); c.setFont(SERIF, 7.8)
    c.drawString(M + 610, ly - 23, "Washers right, dryers left puts soiled and")
    c.drawString(M + 610, ly - 34, "clean on opposite sides with no crossing")
    c.drawString(M + 610, ly - 45, "except the wash-to-dry transfer at the far end.")
    c.setFillColor(ALERT); c.setFont(SERIF_I, 7.6)
    c.drawString(M + 610, ly - 58, "The doorway must never be blocked.")

    # ---- caveat
    c.setFillColor(SUNK); c.rect(M, 44, PW - 2 * M, 42, stroke=0, fill=1)
    c.setFillColor(ACCENT); c.rect(M, 44, 2.4, 42, stroke=0, fill=1)
    c.setFillColor(INK); c.setFont(SERIF_B, 8.4)
    c.drawString(M + 12, 72, "Sides corrected: dryers on the left as you enter, washers on the right — which removes a crossing.")
    para(c, "With the washers on the right and the dryers on the left, soiled feeds straight into the washers and clean "
            "comes straight off the dryers — the two never cross except once, at the far end, and that crossing is washed "
            "linen. Machines occupy 2.17 m of the 4.28 m width, leaving 2.11 m clear against the 1.20 m an escape route "
            "needs. Machine sizes are measured; positions along each wall are scaled from the top view, so mark the floor "
            "from the machines. One tape photo was duplicated, so one dryer dimension is still outstanding.",
         M + 12, 61, PW - 2 * M - 24, size=7.9, lead=9.6)

    footer(c, pageno, total, "Proposed layout — measured")
    c.showPage()
