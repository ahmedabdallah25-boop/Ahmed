"""Proposed layout plan — drawn to scale, no machine moved."""
from reportlab.lib.colors import HexColor

GROUND=HexColor("#F2F3F1"); SURFACE=HexColor("#FBFBFA"); SUNK=HexColor("#E9EBE7")
INK=HexColor("#1B1F1D"); INK_SOFT=HexColor("#5A615B"); INK_FAINT=HexColor("#888F88")
RULE=HexColor("#D6D9D3"); RULE_STRONG=HexColor("#AEB3AC")
ACCENT=HexColor("#B8890B"); ACCENT_BR=HexColor("#E3AE18"); ALERT=HexColor("#A63A2C")
SOILED=HexColor("#C0392B"); CLEAN=HexColor("#2C6E52"); WALK=HexColor("#E3AE18")
MACH=HexColor("#9AA29A"); MACH_D=HexColor("#6F776F"); WHITE=HexColor("#FFFFFF")

SERIF="Times-Roman"; SERIF_B="Times-Bold"; SERIF_I="Times-Italic"
MONO="Courier"; MONO_B="Courier-Bold"

S = 48.0          # points per metre
OX, OY = 128, 214 # plan origin on page

# ---- geometry, metres -------------------------------------------------
RW, RD = 11.0, 3.2                 # main room: length x depth
ALC = (3.2, 3.2, 2.2, 1.8)         # alcove x,y,w,h  (off north wall)

MACHINES = [                       # south wall run
    ("M1", 2.40, 0.00, 0.95, 0.90),
    ("M2", 3.50, 0.00, 0.95, 0.90),
    ("M3", 4.60, 0.00, 0.95, 0.90),
    ("M4", 5.70, 0.00, 0.95, 0.90),
]
NORTH_MACH = [                     # north wall, far half — facing the south run
    ("M5", 6.55, 2.30, 0.95, 0.90),
    ("M6", 7.65, 2.30, 0.95, 0.90),
]
STACKED = [
    ("M7", 0.60, 2.45, 0.72, 0.75),
]
BAYS  = [(8.95, 2.30, 0.85, 0.90), (9.95, 2.30, 0.85, 0.90)]
SOIL_BAYS = [(0.30, 0.15, 0.85, 0.90), (1.30, 0.15, 0.85, 0.90)]


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
    px, py = m2p(x, y)
    py += dy
    c.setFillColor(color); c.setFont(font, size)
    if anchor == "c":
        c.drawCentredString(px, py, s)
    elif anchor == "l":
        c.drawString(px, py, s)
    else:
        c.drawRightString(px, py, s)


def hatch_m(c, x, y, w, h, color, step=0.16):
    """Diagonal hatch inside a metre-rect."""
    c.saveState()
    px, py = m2p(x, y)
    p = c.beginPath(); p.rect(px, py, w * S, h * S); c.clipPath(p, stroke=0)
    c.setStrokeColor(color); c.setLineWidth(0.7); c.setFillAlpha(1)
    i = -h
    while i < w + h:
        a = m2p(x + i, y); b = m2p(x + i + h, y + h)
        c.line(a[0], a[1], b[0], b[1])
        i += step
    c.restoreState()


def swatch(c, x, y, col, label, sub=None, w=13, h=9, alpha=0.30, hatched=False):
    c.saveState(); c.setFillAlpha(alpha); c.setFillColor(col)
    c.rect(x, y, w, h, stroke=0, fill=1); c.restoreState()
    c.setStrokeColor(col); c.setLineWidth(0.8)
    c.rect(x, y, w, h, stroke=1, fill=0)
    c.setFillColor(INK); c.setFont(SERIF, 8.2)
    c.drawString(x + w + 7, y + 2.5, label)
    if sub:
        c.setFillColor(INK_FAINT); c.setFont(SERIF, 7.4)
        c.drawString(x + w + 7, y - 7, sub)


def draw_layout(c, PW, PH, M, footer, label, wrap, para, page_bg, pageno, total):
    page_bg(c)

    # ---------------- header
    label(c, "Proposed layout", M, PH - 52)
    c.setFillColor(INK); c.setFont(SERIF_B, 22)
    c.drawString(M, PH - 78, "Same room, same seven machines, new flow")
    c.setStrokeColor(INK); c.setLineWidth(1.4)
    c.line(M, PH - 88, PW - M, PH - 88)
    c.setFillColor(INK_SOFT); c.setFont(SERIF, 9.6)
    c.drawString(M, PH - 104,
                 "Not one machine moves. Everything drawn in colour is paint, signage or a bin — the plan is zoning, not building work.")

    # ---------------- floor zones (drawn first, under everything)
    rect_m(c, 0, 0, RW, RD, fill=SURFACE)                      # floor
    rect_m(c, *ALC, fill=SURFACE)                              # alcove floor

    # soiled zone (west end)
    rect_m(c, 0.15, 0.10, 2.15, 3.00, fill=SOILED, alpha=0.10)
    # clean zone (east end)
    rect_m(c, 8.85, 0.10, 2.00, 3.00, fill=CLEAN, alpha=0.10)
    # walkway
    rect_m(c, 0.15, 1.15, 10.70, 0.95, fill=WALK, alpha=0.20)

    # keep-clear at boards
    hatch_m(c, 2.25, 2.30, 0.80, 0.85, ALERT)
    hatch_m(c, 0.05, 2.25, 0.85, 0.85, ALERT)
    # keep-clear at exits
    hatch_m(c, 0.05, 1.15, 0.55, 0.95, ALERT)
    hatch_m(c, 10.40, 1.15, 0.55, 0.95, ALERT)

    # ---------------- walls
    c.setStrokeColor(INK); c.setLineWidth(2.2)
    ax, ay, aw, ah = ALC
    x0, y0 = m2p(0, 0); x1, y1 = m2p(RW, RD)
    c.line(x0, y0, x1, y0)                                     # south wall
    c.line(x0, y0, x0, y1)                                     # west wall
    c.line(x1, y0, x1, y1)                                     # east wall
    # north wall, broken by the alcove
    nx0, ny = m2p(0, RD); nx1, _ = m2p(ax, RD)
    c.line(nx0, ny, nx1, ny)
    nx2, _ = m2p(ax + aw, RD); nx3, _ = m2p(RW, RD)
    c.line(nx2, ny, nx3, ny)
    # alcove walls
    p1 = m2p(ax, RD); p2 = m2p(ax, ay + ah); p3 = m2p(ax + aw, ay + ah); p4 = m2p(ax + aw, RD)
    c.line(*p1, *p2); c.line(*p2, *p3); c.line(*p3, *p4)

    # ---------------- doors
    def door(c, x, y, w, h, txt, col=CLEAN):
        rect_m(c, x, y, w, h, fill=WHITE, stroke=col, lw=1.6)
        px, py = m2p(x + w / 2, y + h / 2)
        c.setFillColor(col); c.setFont(MONO_B, 6.2)
        c.saveState(); c.translate(px, py); c.rotate(90)
        c.drawCentredString(0, -2, txt); c.restoreState()
    door(c, -0.11, 1.15, 0.11, 0.95, "EXIT")
    door(c, RW, 1.15, 0.11, 0.95, "EXIT")

    # ---------------- machines
    for mid, x, y, w, h in MACHINES:
        rect_m(c, x, y, w, h, fill=MACH, stroke=MACH_D, lw=1.0)
        txt_m(c, mid, x + w / 2, y + h / 2, font=MONO_B, size=9, color=WHITE, dy=-3)
        # door swing / loading side toward the walkway
        px, py = m2p(x + w / 2, y + h + 0.06)
        c.setStrokeColor(MACH_D); c.setLineWidth(0.6); c.setDash(1.5, 1.5)
        c.circle(px, py, 0.16 * S, stroke=1, fill=0); c.setDash()
    for mid, x, y, w, h in NORTH_MACH:
        rect_m(c, x, y, w, h, fill=MACH, stroke=MACH_D, lw=1.0)
        txt_m(c, mid, x + w / 2, y + h / 2, font=MONO_B, size=9, color=WHITE, dy=-3)
        px, py = m2p(x + w / 2, y - 0.06)
        c.setStrokeColor(MACH_D); c.setLineWidth(0.6); c.setDash(1.5, 1.5)
        c.circle(px, py, 0.16 * S, stroke=1, fill=0); c.setDash()
    for mid, x, y, w, h in STACKED:
        rect_m(c, x, y, w, h, fill=MACH, stroke=MACH_D, lw=1.0)
        txt_m(c, mid, x + w / 2, y + h / 2, font=MONO_B, size=8, color=WHITE, dy=-3)

    # lint bins in the gaps between machines
    for gx in (3.36, 4.46, 5.56, 6.66):
        rect_m(c, gx, 0.12, 0.13, 0.34, fill=INK, stroke=None)
    # bin key dot
    txt_m(c, "lint bins, wall-mounted between machines", 5.0, 0.0, font=SERIF_I, size=6.6, color=INK_FAINT, dy=-13)

    # ---------------- trolley bays
    for i, (x, y, w, h) in enumerate(BAYS):
        rect_m(c, x, y, w, h, fill=SURFACE, alpha=0.85)
        rect_m(c, x, y, w, h, stroke=CLEAN, lw=1.4, dash=(2.5, 2))
        txt_m(c, "CLEAN", x + w / 2, y + h / 2, font=MONO_B, size=5.6, color=CLEAN, dy=-2.5)
    for x, y, w, h in SOIL_BAYS:
        rect_m(c, x, y, w, h, fill=SURFACE, alpha=0.85)
        rect_m(c, x, y, w, h, stroke=SOILED, lw=1.4, dash=(2.5, 2))
        txt_m(c, "SOILED", x + w / 2, y + h / 2, font=MONO_B, size=5.4, color=SOILED, dy=-2.5)

    # clean shelving, east
    rect_m(c, 8.95, 0.15, 1.85, 0.55, fill=SUNK, stroke=RULE_STRONG, lw=0.9)
    txt_m(c, "clean linen shelving", 9.88, 0.36, font=SERIF, size=6.4, color=INK_SOFT)
    txt_m(c, "Staging bays are sized for whatever container you adopt — there are no linen trolleys in the room today.",
          5.50, 0.0, font=SERIF_I, size=6.8, color=ALERT, dy=-24)

    # the compromise the existing positions force
    txt_m(c, "M7 sits in the soiled end — designate it for", 4.30, 2.86, font=SERIF_I,
          size=6.6, color=ALERT)
    txt_m(c, "staff / rewash only, off the main linen flow", 4.30, 2.86, font=SERIF_I,
          size=6.6, color=ALERT, dy=-9)

    # ---------------- boards + alcove fit-out
    rect_m(c, 2.25, 3.15, 0.80, 0.14, fill=ALERT, stroke=None)
    txt_m(c, "DB1", 2.65, 3.36, font=MONO_B, size=6.4, color=ALERT)
    rect_m(c, -0.09, 2.25, 0.14, 0.85, fill=ALERT, stroke=None)
    c.saveState()
    px, py = m2p(-0.30, 2.68); c.translate(px, py); c.rotate(90)
    c.setFillColor(ALERT); c.setFont(MONO_B, 6.4); c.drawCentredString(0, 0, "DB2"); c.restoreState()

    # alcove contents
    rect_m(c, ax + 0.10, ay + ah - 0.16, aw - 0.20, 0.14, fill=ACCENT, stroke=None)
    txt_m(c, "shadow board · PPE · chemical shelf · daily checks",
          ax + aw / 2, ay + ah - 0.42, font=SERIF, size=6.2, color=INK_SOFT)
    txt_m(c, "STORE", ax + aw / 2, ay + 0.66, font=MONO_B, size=8.5, color=ACCENT)
    txt_m(c, "one LED batten", ax + aw / 2, ay + 0.42, font=SERIF_I, size=6.4, color=INK_FAINT)
    px, py = m2p(ax + aw / 2, ay + 0.20)
    c.setStrokeColor(RULE_STRONG); c.setLineWidth(0.8)
    c.circle(px, py, 0.09 * S, stroke=1, fill=0)      # floor gully

    # overhead tank (dashed = above head height)
    rect_m(c, 10.05, 1.20, 0.78, 0.85, stroke=INK_FAINT, lw=1.0, dash=(3, 2.5))
    txt_m(c, "TANK", 10.44, 1.66, font=MONO_B, size=5.8, color=INK_FAINT)
    txt_m(c, "OVER", 10.44, 1.66, font=MONO_B, size=5.8, color=INK_FAINT, dy=-8)
    txt_m(c, "verify contents", 10.44, 1.66, font=SERIF_I, size=5.8, color=INK_FAINT, dy=-17)

    # ---------------- flow arrows
    c.setStrokeColor(INK); c.setLineWidth(1.3)
    for xa, xb in ((2.45, 3.95), (4.45, 5.95), (6.45, 7.95), (8.30, 9.00)):
        a = m2p(xa, 1.62); b = m2p(xb, 1.62)
        c.line(a[0], a[1], b[0], b[1])
        c.setFillColor(INK)
        p = c.beginPath(); p.moveTo(b[0], b[1]); p.lineTo(b[0] - 6, b[1] + 3.2)
        p.lineTo(b[0] - 6, b[1] - 3.2); p.close(); c.drawPath(p, stroke=0, fill=1)
    txt_m(c, "SOILED IN", 1.22, 1.60, font=MONO_B, size=7.2, color=SOILED)
    txt_m(c, "CLEAN OUT", 9.50, 1.60, font=MONO_B, size=7.2, color=CLEAN)

    # ---------------- lighting
    c.setStrokeColor(INK_FAINT); c.setLineWidth(1.6)
    c.saveState(); c.setStrokeAlpha(0.60); c.setDash(4, 3)
    for row_y in (0.62, 2.62):
        for i in range(6):
            xa = 0.55 + i * 1.75
            a = m2p(xa, row_y); b = m2p(xa + 1.15, row_y)
            c.line(a[0], a[1], b[0], b[1])
    c.setDash(); c.restoreState()

    # ---------------- dimensions
    c.setStrokeColor(INK_FAINT); c.setLineWidth(0.6)
    c.setFillColor(INK_FAINT); c.setFont(MONO, 7)
    c.drawCentredString((m2p(0, 0)[0] + m2p(RW, 0)[0]) / 2, m2p(0, 0)[1] - 44,
                        "≈ 11.0 m  (ESTIMATED)")
    dx = m2p(RW, 0)[0] + 40
    c.line(dx, m2p(0, 0)[1], dx, m2p(0, RD)[1])
    c.saveState(); c.translate(dx + 9, (m2p(0, 0)[1] + m2p(0, RD)[1]) / 2)
    c.rotate(90); c.drawCentredString(0, 0, "≈ 3.2 m"); c.restoreState()

    # ---------------- legend
    ly = 160
    c.setStrokeColor(RULE_STRONG); c.setLineWidth(0.7)
    c.line(M, ly + 18, PW - M, ly + 18)
    label(c, "Legend — everything below is paint, signage or a bin", M, ly + 4, size=6.6)

    col = M
    swatch(c, col, ly - 18, SOILED, "Soiled zone", "receiving, west end", alpha=0.16)
    swatch(c, col, ly - 42, CLEAN, "Clean zone", "staging + shelving, east end", alpha=0.16)
    swatch(c, col + 190, ly - 18, WALK, "Walkway", "painted line, 0.95 m clear", alpha=0.26)
    swatch(c, col + 190, ly - 42, ALERT, "Keep clear", "boards and exits, hatched", alpha=0.16)
    swatch(c, col + 380, ly - 18, MACH, "Existing machine", "M1–M7, none relocated", alpha=1.0)
    swatch(c, col + 380, ly - 42, ACCENT, "New fit-out", "alcove store, one LED batten", alpha=0.9)
    c.setStrokeColor(INK_FAINT); c.setLineWidth(1.6); c.setDash(4, 3)
    c.line(col + 380, ly - 60, col + 393, ly - 60); c.setDash()
    c.setFillColor(INK); c.setFont(SERIF, 8.2)
    c.drawString(col + 400, ly - 63, "LED batten")
    c.setFillColor(INK_FAINT); c.setFont(SERIF, 7.4)
    c.drawString(col + 400, ly - 72, "12 fittings, two rows")

    c.setFillColor(INK); c.setFont(SERIF_B, 8.6)
    c.drawString(col + 570, ly - 10, "Machine schedule")
    c.setFillColor(INK_SOFT); c.setFont(SERIF, 7.8)
    c.drawString(col + 570, ly - 23, "M1–M4 south wall · M5–M6 north wall")
    c.drawString(col + 570, ly - 34, "M7  stacked column, west end")
    c.setFillColor(ALERT); c.setFont(SERIF_I, 7.6)
    c.drawString(col + 570, ly - 47, "Confirm the split and which are dryers.")

    # caveat strip
    c.setFillColor(SUNK)
    c.rect(M, 44, PW - 2 * M, 42, stroke=0, fill=1)
    c.setFillColor(ACCENT); c.rect(M, 44, 2.4, 42, stroke=0, fill=1)
    c.setFillColor(INK); c.setFont(SERIF_B, 8.4)
    c.drawString(M + 12, 72, "This is a zoning plan, not a measured drawing.")
    para(c, "Dimensions are scaled from the walkthrough footage and are estimates. Give me three numbers — room length, "
            "room width, and the alcove opening — and the bay counts and walkway clearance can be firmed up exactly. "
            "Machine positions follow what the video shows; nothing here requires moving one.",
         M + 12, 61, PW - 2 * M - 24, size=7.9, lead=9.6)

    footer(c, pageno, total, "Proposed layout")
    c.showPage()
