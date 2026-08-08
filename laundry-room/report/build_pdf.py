#!/usr/bin/env python3
"""Zone-by-zone laundry enhancement report."""
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
import os
import layout_page as LP

SC = "/tmp/claude-0/-home-user-Ahmed/08523f79-6f2c-5892-b60a-e777b9ae91bb/scratchpad"
OUT = SC + "/Laundry-Room-Zone-Report.pdf"
PW, PH = landscape(A4)          # 841.9 x 595.3

GROUND      = HexColor("#F2F3F1")
SURFACE     = HexColor("#FBFBFA")
SUNK        = HexColor("#E9EBE7")
INK         = HexColor("#1B1F1D")
INK_SOFT    = HexColor("#5A615B")
INK_FAINT   = HexColor("#888F88")
RULE        = HexColor("#D6D9D3")
RULE_STRONG = HexColor("#AEB3AC")
ACCENT      = HexColor("#B8890B")
ACCENT_BR   = HexColor("#E3AE18")
ALERT       = HexColor("#A63A2C")
HATCH_DARK  = HexColor("#24261F")
WHITE       = HexColor("#FFFFFF")

SERIF   = "Times-Roman";  SERIF_B = "Times-Bold";  SERIF_I = "Times-Italic"
SANS    = "Helvetica";    SANS_B  = "Helvetica-Bold"
MONO    = "Courier";      MONO_B  = "Courier-Bold"

M = 38  # page margin


# ---------------------------------------------------------------- helpers
def wrap(c, text, font, size, maxw):
    c.setFont(font, size)
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if c.stringWidth(t, font, size) <= maxw:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def para(c, text, x, y, maxw, font=SERIF, size=9.5, lead=12.6, color=INK_SOFT):
    c.setFillColor(color)
    for ln in wrap(c, text, font, size, maxw):
        c.setFont(font, size)
        c.drawString(x, y, ln)
        y -= lead
    return y


def bullets(c, items, x, y, maxw, size=9.5, lead=12.4, gap=4.6,
            color=INK_SOFT, marker_color=ACCENT):
    for it in items:
        c.setFillColor(marker_color)
        c.setFont(SANS_B, size - 1.2)
        c.drawString(x, y, "–")
        yy = y
        for i, ln in enumerate(wrap(c, it, SERIF, size, maxw - 13)):
            c.setFillColor(color)
            c.setFont(SERIF, size)
            c.drawString(x + 13, yy, ln)
            yy -= lead
        y = yy - gap
    return y


def label(c, text, x, y, size=7.2, color=INK_FAINT, font=MONO):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawString(x, y, " ".join(text.upper()))


def chip(c, text, x, y, bg, fg=WHITE, pad=5.5, size=7.0, h=13):
    c.setFont(MONO_B, size)
    w = c.stringWidth(text.upper(), MONO_B, size) + pad * 2
    c.setFillColor(bg)
    c.rect(x, y, w, h, stroke=0, fill=1)
    c.setFillColor(fg)
    c.drawString(x + pad, y + 4, text.upper())
    return w


def hazard_band(c, x, y, w, h=5.5):
    c.saveState()
    p = c.beginPath()
    p.rect(x, y, w, h)
    c.clipPath(p, stroke=0)
    c.setFillColor(ACCENT_BR)
    c.rect(x, y, w, h, stroke=0, fill=1)
    c.setFillColor(HATCH_DARK)
    step = 9
    i = -h
    while i < w + h:
        pp = c.beginPath()
        pp.moveTo(x + i, y)
        pp.lineTo(x + i + h, y + h)
        pp.lineTo(x + i + h + step / 2, y + h)
        pp.lineTo(x + i + step / 2, y)
        pp.close()
        c.drawPath(pp, stroke=0, fill=1)
        i += step
    c.restoreState()


def page_bg(c):
    c.setFillColor(GROUND)
    c.rect(0, 0, PW, PH, stroke=0, fill=1)


def footer(c, n, total, txt):
    c.setStrokeColor(RULE)
    c.setLineWidth(0.6)
    c.line(M, 30, PW - M, 30)
    c.setFillColor(INK_FAINT)
    c.setFont(MONO, 7)
    c.drawString(M, 20, txt.upper())
    c.drawRightString(PW - M, 20, f"{n} / {total}")


def fit_image(path, box_w, box_h):
    img = ImageReader(path)
    iw, ih = img.getSize()
    s = min(box_w / iw, box_h / ih)
    return img, iw * s, ih * s


# ---------------------------------------------------------------- content
RENDERS = {
    1: ("Render 1", "Hero — the whole room upgraded",
        "Twelve LED battens down the full length, high-level trays cleaned and painted "
        "one grey, rigid straight ducting, painted floor zones, lidded bins, clear fire exit.",
        "hf_20260808_160100_1543a39e-4b78-460a-9cc0-f8fab6f64674"),
    2: ("Render 2", "Machine line detail",
        "Aluminium coved trim at the machine bases, wall-mounted lidded lint bin with its "
        "sign, W1/W2 machine ID plates, painted yellow walkway line one metre out.",
        "hf_20260808_160100_a9f95453-1fc6-4897-88ee-55b5fdfa4892"),
    3: ("Render 3", "Trolley bays and linen staging",
        "Matching trolleys parked inside painted bays, SOILED / CLEAN / RETURN signage "
        "colour-coded red and green, folded stock on stainless shelving.",
        "hf_20260808_160100_b831b395-bb37-4260-861c-f3609fc75236"),
    4: ("Render 4", "The lit store alcove",
        "One LED batten, then a shadow board, PPE station, bunded chemical shelf and a "
        "framed DAILY CHECKS board — all in the alcove you already own.",
        "hf_20260808_160100_354a8998-70b7-4b24-b76c-12d1ea341dc1"),
    5: ("Render 5", "Signage and standards kit",
        "The printed kit: KEEP CLEAR — ELECTRICAL PANEL, FIRE EXIT — KEEP CLEAR, "
        "lint-trap and segregation signs, machine ID plates, floor-marking legend.",
        "hf_20260808_160100_5e948227-7d15-4316-a300-7c1b59b06905"),
}
RENDER_FILES = {1: "IMG_6774", 2: "IMG_6775", 3: "IMG_6773", 4: "IMG_6772", 5: "IMG_6776"}
BONUS = "IMG_6777"
RD = SC + "/rend/"

ZONES = [
    dict(why='Paper against a live board is the cheapest fire risk in the room to remove — and the first thing an auditor photographs.', n="01", key="z1", title="Electrical board and the document wall",
         where="Entry wall, 0:00–0:02 in the walkthrough",
         sev="SAFETY", render=5, cost="Tier 0 + signage", aed="— / 700",
         now=[
             "A distribution board with heavy cabling entering, and roughly fifteen A4 sheets taped to the tile directly beside it.",
             "Open lint trays, a woven sack and a plastic storage box on the floor beneath the board.",
             "No keep-clear zone marked or maintained in front of the board.",
         ],
         to=[
             "Strip the paper wall entirely. Combustible material does not belong against a live board.",
             "Clear the floor beneath and in front of it, then paint a keep-clear zone on the resin.",
             "Replace the paper with the printed kit: one KEEP CLEAR — ELECTRICAL PANEL sign at a fixed height.",
             "Documents move to the framed DAILY CHECKS board in the alcove (Zone 03).",
         ]),
    dict(why='Nothing on this page costs money, and it is the highest-consequence zone in the report.', n="02", key="z2", title="Fire door, exit route and second board",
         where="Corner by the fire-rated door, 0:03",
         sev="SAFETY", render=1, cost="Tier 0", aed="0",
         now=[
             "A green running-man exit sign over a fire-rated door — this room is on an escape route.",
             "A second distribution board, Caution — Electrical Hazard, with cabling entering below.",
             "Small safety notices taped at inconsistent heights beside the board.",
         ],
         to=[
             "Treat the whole floor as an escape route: nothing stored on it that is not on wheels.",
             "Mark a keep-clear zone at this board as well as the first.",
             "Replace taped notices with the same printed signs at one consistent height throughout.",
             "This zone costs nothing and is the most likely single inspection failure in the room.",
         ]),
    dict(why='One fitting. It is the only line in this brief that makes another entire zone usable.', n="03", key="z3", title="The dark store alcove — the free room",
         where="Side alcove, 0:05–0:07. Shown unedited: this is how dark it is.",
         sev="BEST VALUE", render=4, cost="Tier 1", aed="60",
         now=[
             "Mop, squeegee, bucket and a floor gully already live here — the space is in use.",
             "No light fitting at all, so nothing else can be stored or found in it.",
             "Because it is unusable, the cleaning kit and paperwork spill into the main room.",
         ],
         to=[
             "Fit one LED batten. That single fitting is what unlocks the whole zone.",
             "Then mount, in one aligned run: shadow board, PPE station, bunded chemical shelf, framed DAILY CHECKS board.",
             "Everything currently cluttering the main room and the board wall has a home here.",
             "One fitting at about AED 60 — the best value line in the entire brief.",
         ]),
    dict(why='Light is what makes a clean room read as clean. Two battens in a four-metre room cannot do it.', n="04", key="z4", title="Main machine line",
         where="Main run, 0:10–0:12",
         sev="", render=2, cost="Tier 1 + Tier 2", aed="1,200+",
         now=[
             "Two fluorescent battens for the full length of a room roughly four metres tall; the far end is genuinely dark.",
             "High-level cable trays and mesh carrying a heavy layer of settled lint and dust.",
             "No floor zoning, no walkway, no machine identification. A blue drum parked loose against the wall.",
         ],
         to=[
             "Twelve IP65 LED battens at 4000K, evenly spaced — no dark corners, no dark far end.",
             "Deep clean the high-level steelwork, then paint every service one uniform matt light grey.",
             "Paint a yellow walkway line one metre out from the machine faces; add W1/W2 ID plates.",
             "Aluminium coved trim at the machine bases so lint has nowhere to lodge.",
         ]),
    dict(why='There is no staging zone here today. Render 3 is not an upgrade of this wall — it is the zone this wall does not yet have.', n="05", key="z5", title="Staging side — clutter where the linen zone should be",
         where="Opposite the machine line, from the site photographs",
         sev="", render=3, cost="Tier 0 + Tier 3", aed="0 + liners",
         now=[
             "A large grey panel and a wire frame stored upright against the wall, with open lint trays along the base.",
             "No marked bays, no staging zone, and no visible clean/soiled separation anywhere on this side.",
             "The wall carries services and a tiled dado but no signage system at all.",
         ],
         to=[
             "Remove the stored panel and frame from the room — they are the largest single obstruction in it.",
             "This wall is where the linen staging zone goes: painted bays on the resin floor, one trolley per bay.",
             "SOILED / CLEAN / RETURN signage colour-coded above each bay, so segregation is visible rather than assumed.",
             "Replace trolley liners rather than frames, and retire anything torn.",
         ]),
    dict(why='Everything else in Tier 3 waits on this. Do not order the chemical shelf until the tank is identified.', n="06", key="z6", title="Far end and the overhead bulk tank",
         where="Far end of the run, 0:23",
         sev="VERIFY FIRST", render=1, cost="Establish before Tier 3", aed="TBC",
         now=[
             "A large white bulk tank on a raised steel frame, above head height, over the working area.",
             "A second green exit sign sits directly below and beside it — tank over an escape route.",
             "Contents, secondary containment, fixing and fill method all unverified from the footage.",
         ],
         to=[
             "Establish what the tank holds before committing to anything in Tier 3.",
             "If chemical: it needs secondary containment and a check on what sits beneath it.",
             "If water: it needs a check on frame loading and fixing.",
             "Either outcome, keep the route beneath it clear and lit — the hero render shows the target condition.",
         ]),
    dict(why='Different space, different standard. Pricing it inside the main-room budget would understate both.', n="07", key="z7", title="Stacked machines and rear corner",
         where="Rear area, 0:15–0:20",
         sev="OUT OF SCOPE", render=None, cost="Not priced", aed="—",
         now=[
             "Stacked washer/dryer columns against large-format grey tile — a different space at a different finish standard.",
             "A staff locker unit, a cardboard box on the floor, and a blue drum in the corner.",
             "Loose black cable draped down the wall and lying across the floor beneath an isolator.",
         ],
         to=[
             "Not covered by this brief, which prices the main machine room only.",
             "Two items apply regardless: lift the draped cable onto P-clips, and get the box off the floor.",
             "Say the word and this area gets surveyed and priced separately.",
         ]),
]


# ---------------------------------------------------------------- pages
def cover(c):
    page_bg(c)
    c.setFillColor(SURFACE)
    c.rect(M, M + 18, PW - 2 * M, PH - 2 * M - 36, stroke=0, fill=1)
    c.setStrokeColor(RULE)
    c.setLineWidth(0.7)
    c.rect(M, M + 18, PW - 2 * M, PH - 2 * M - 36, stroke=1, fill=0)

    x = M + 42
    label(c, "Back-of-house facilities brief", x, PH - 108)
    c.setFillColor(INK)
    c.setFont(SERIF_B, 34)
    c.drawString(x, PH - 152, "Laundry room — zone by zone")
    c.setFont(SERIF, 17)
    c.setFillColor(INK_SOFT)
    c.drawString(x, PH - 180, "Current condition matched to the proposed enhancement, area by area")

    hazard_band(c, x, PH - 200, 250)

    y = PH - 228
    y = para(c, "Seven zones identified from the walkthrough video and the site photographs. Each "
                "is paired with the concept render that shows its target condition, the specific "
                "interventions that apply to it, and where it sits in the four-tier budget.",
             x, y, 470, size=10.5, lead=14.5)

    # zone thumbnail strip
    sx, sy, tw_, th_ = x, 178, 90, 118
    label(c, "The seven zones", sx, sy + th_ + 14, size=6.4)
    for i in range(1, 8):
        tx = sx + (i - 1) * (tw_ + 7)
        img = ImageReader(f"{SC}/zones/t{i}.jpg")
        c.drawImage(img, tx, sy, tw_, th_)
        c.setStrokeColor(RULE_STRONG); c.setLineWidth(0.5)
        c.rect(tx, sy, tw_, th_, stroke=1, fill=0)
        c.setFillColor(INK_FAINT); c.setFont(MONO, 6.4)
        c.drawString(tx, sy - 10, "ZONE 0%d" % i)

    ty = 96
    tiles = [("Zones", "7"), ("Machines", "7 — all retained"), ("Tier 0 — free", "AED 0"),
             ("Full build", "AED 11,910")]
    tw = (PW - 2 * M - 84) / 4
    for i, (k, v) in enumerate(tiles):
        tx = x + i * tw
        c.setFillColor(SUNK)
        c.rect(tx, ty, tw - 14, 56, stroke=0, fill=1)
        label(c, k, tx + 12, ty + 38, size=6.4)
        c.setFillColor(ACCENT if i >= 2 else INK)
        c.setFont(MONO_B, 15)
        c.drawString(tx + 12, ty + 15, v)

    c.setFillColor(INK_FAINT)
    c.setFont(MONO, 7.2)
    c.drawString(x, 74, "8 AUGUST 2026   ·   COSTS AED, ESTIMATED   ·   MAIN MACHINE ROOM")
    footer(c, 1, 12, "Laundry room zone report")
    c.showPage()


def index_page(c):
    page_bg(c)
    label(c, "Contents", M, PH - 52)
    c.setFillColor(INK)
    c.setFont(SERIF_B, 22)
    c.drawString(M, PH - 78, "Zone map")
    c.setStrokeColor(INK)
    c.setLineWidth(1.4)
    c.line(M, PH - 88, PW - M, PH - 88)

    y = PH - 112
    cols = [M + 4, M + 44, M + 330, M + 470, M + 580, M + 690]
    hdr = ["#", "Zone", "Matched render", "Priority", "Tier", "AED"]
    c.setFillColor(SUNK)
    c.rect(M, y - 6, PW - 2 * M, 20, stroke=0, fill=1)
    for cx, h in zip(cols, hdr):
        label(c, h, cx, y, size=6.4)
    y -= 24

    for z in ZONES:
        c.setStrokeColor(RULE)
        c.setLineWidth(0.5)
        c.line(M, y + 15, PW - M, y + 15)
        c.setFillColor(INK_FAINT)
        c.setFont(MONO, 9)
        c.drawString(cols[0], y, z["n"])
        c.setFillColor(INK)
        c.setFont(SERIF_B, 10)
        for ln in wrap(c, z["title"], SERIF_B, 10, 275)[:1]:
            c.drawString(cols[1], y, ln)
        r = z["render"]
        c.setFillColor(INK_SOFT)
        c.setFont(SERIF, 9.5)
        c.drawString(cols[2], y, RENDERS[r][1] if r else "— none —")
        if z["sev"]:
            col = ALERT if z["sev"] in ("SAFETY", "VERIFY FIRST") else (
                INK_FAINT if z["sev"] == "OUT OF SCOPE" else ACCENT)
            chip(c, z["sev"], cols[3], y - 3, col)
        else:
            c.setFillColor(INK_FAINT)
            c.setFont(SERIF, 9.5)
            c.drawString(cols[3], y, "standard")
        c.setFillColor(INK_SOFT)
        c.setFont(SERIF, 9.5)
        c.drawString(cols[4], y, z["cost"].replace("Establish before ", "before "))
        c.setFillColor(INK)
        c.setFont(MONO, 9)
        c.drawRightString(PW - M - 4, y, z["aed"])
        y -= 30

    c.setStrokeColor(RULE_STRONG)
    c.setLineWidth(0.8)
    c.line(M, y + 15, PW - M, y + 15)

    y -= 6
    c.setFillColor(SUNK)
    c.rect(M, y - 52, PW - 2 * M, 62, stroke=0, fill=1)
    c.setFillColor(INK)
    c.setFont(SERIF_B, 10)
    c.drawString(M + 14, y - 6, "How to read a zone page")
    para(c, "Left is the room as it is now, straight from the walkthrough or the site photographs — "
            "no retouching. Right is what changes in that specific area, and which concept render "
            "shows the target condition. The render panel carries the file reference; the images "
            "themselves are supplied alongside this report.",
         M + 14, y - 22, PW - 2 * M - 28, size=9, lead=11.5)

    footer(c, 2, 12, "Zone map")
    c.showPage()


def zone_page(c, z, pageno, total):
    page_bg(c)

    # header
    c.setFillColor(INK_FAINT); c.setFont(MONO_B, 9)
    c.drawString(M, PH - 52, "ZONE " + z["n"])
    c.setFillColor(INK); c.setFont(SERIF_B, 19)
    c.drawString(M + 62, PH - 52, z["title"])
    if z["sev"]:
        col = ALERT if z["sev"] in ("SAFETY", "VERIFY FIRST") else (
            INK_FAINT if z["sev"] == "OUT OF SCOPE" else ACCENT)
        w = c.stringWidth(z["title"], SERIF_B, 19)
        chip(c, z["sev"], M + 72 + w, PH - 51, col)
    c.setStrokeColor(INK); c.setLineWidth(1.4)
    c.line(M, PH - 62, PW - M, PH - 62)
    c.setFillColor(INK_FAINT); c.setFont(SERIF_I, 9)
    c.drawString(M, PH - 76, z["where"])

    # ---------- image band ----------
    band_top, band_h = PH - 96, 272
    band_y = band_top - band_h
    cur_x, cur_w = M, 148
    pro_x, pro_w = M + 162, 402
    sid_x, sid_w = M + 578, 188

    label(c, "Current", cur_x, band_top + 6, size=6.6)
    img, w, h = fit_image(f"{SC}/zones/{z['key']}.jpg", cur_w, band_h)
    c.drawImage(img, cur_x, band_y, w, h)
    c.setStrokeColor(RULE_STRONG); c.setLineWidth(0.7)
    c.rect(cur_x, band_y, w, h, stroke=1, fill=0)

    r = z["render"]
    label(c, "Proposed" if r else "Not in scope", pro_x, band_top + 6, size=6.6,
          color=ACCENT if r else INK_FAINT)
    if r:
        img2, w2, h2 = fit_image(RD + RENDER_FILES[r] + ".png", pro_w, band_h)
        iy2 = band_y + (band_h - h2) / 2
        c.drawImage(img2, pro_x, iy2, w2, h2)
        c.setStrokeColor(ACCENT); c.setLineWidth(1.0)
        c.rect(pro_x, iy2, w2, h2, stroke=1, fill=0)
        name, subtitle, desc, fileref = RENDERS[r]
        c.setFillColor(INK); c.setFont(SERIF_B, 9.5)
        c.drawString(pro_x, iy2 - 13, f"{name} · {subtitle}")
    else:
        c.setFillColor(SURFACE)
        c.rect(pro_x, band_y, pro_w, band_h, stroke=0, fill=1)
        c.setStrokeColor(RULE_STRONG); c.setLineWidth(0.9)
        c.setDash(3, 2); c.rect(pro_x, band_y, pro_w, band_h, stroke=1, fill=0); c.setDash()
        c.setFillColor(INK_SOFT); c.setFont(SERIF_I, 11)
        c.drawCentredString(pro_x + pro_w / 2, band_y + band_h / 2 + 6,
                            "This area was not surveyed or priced.")
        c.drawCentredString(pro_x + pro_w / 2, band_y + band_h / 2 - 12,
                            "Ask and it gets its own brief.")

    # ---------- sidebar ----------
    sy = band_top
    c.setFillColor(SUNK)
    c.rect(sid_x, sy - 74, sid_w, 74, stroke=0, fill=1)
    label(c, "Budget", sid_x + 12, sy - 16, size=6.4)
    c.setFillColor(INK); c.setFont(SERIF_B, 10.5)
    c.drawString(sid_x + 12, sy - 34, z["cost"])
    c.setFillColor(ACCENT); c.setFont(MONO_B, 15)
    c.drawString(sid_x + 12, sy - 60, "AED " + z["aed"])

    wy = sy - 92
    c.setFillColor(ACCENT)
    c.rect(sid_x, wy - 96, 2.4, 96, stroke=0, fill=1)
    label(c, "Why it matters", sid_x + 12, wy - 8, size=6.4)
    para(c, z["why"], sid_x + 12, wy - 24, sid_w - 20, font=SERIF_I, size=9.4,
         lead=11.8, color=INK)

    # ---------- text columns ----------
    ty = band_y - 26
    ca_x, ca_w = M, 352
    cb_x, cb_w = M + 382, 384

    label(c, "What is there now", ca_x, ty, size=6.8)
    c.setStrokeColor(RULE); c.setLineWidth(0.6)
    c.line(ca_x, ty - 7, ca_x + ca_w, ty - 7)
    bullets(c, z["now"], ca_x, ty - 21, ca_w)

    label(c, "What changes here", cb_x, ty, size=6.8, color=ACCENT)
    c.setStrokeColor(RULE); c.setLineWidth(0.6)
    c.line(cb_x, ty - 7, cb_x + cb_w, ty - 7)
    bullets(c, z["to"], cb_x, ty - 21, cb_w)

    footer(c, pageno, total, "Zone " + z["n"] + " · " + z["title"])
    c.showPage()


def target_page(c, total):
    page_bg(c)
    label(c, "Reference", M, PH - 52)
    c.setFillColor(INK); c.setFont(SERIF_B, 22)
    c.drawString(M, PH - 78, "The target condition")
    c.setStrokeColor(INK); c.setLineWidth(1.4)
    c.line(M, PH - 88, PW - M, PH - 88)
    c.setFillColor(INK_SOFT); c.setFont(SERIF, 10)
    c.drawString(M, PH - 104,
                 "Concept renders, not photographs of this room. Each zone page carries the one that applies to it.")

    items = [(1, "Zones 02 · 06"), (3, "Zone 05"), (2, "Zone 04"),
             (4, "Zone 03"), (5, "Zone 01"), (None, "Zone 03 — detail")]
    cols, cw_, ch_ = 3, 240, 150
    gx, gy = 22, 44
    x0, y0 = M, PH - 300
    for i, (rn, zref) in enumerate(items):
        cx = x0 + (i % cols) * (cw_ + gx)
        cy = y0 - (i // cols) * (ch_ + gy)
        f = RD + (RENDER_FILES[rn] if rn else BONUS) + ".png"
        img, w, h = fit_image(f, cw_, ch_)
        c.drawImage(img, cx, cy, w, h)
        c.setStrokeColor(RULE_STRONG); c.setLineWidth(0.6)
        c.rect(cx, cy, w, h, stroke=1, fill=0)
        ttl = RENDERS[rn][1] if rn else "Wall station — close detail"
        c.setFillColor(INK); c.setFont(SERIF_B, 9.5)
        for ln in wrap(c, (f"Render {rn} · " if rn else "Supporting · ") + ttl,
                       SERIF_B, 9.5, cw_)[:1]:
            c.drawString(cx, cy - 13, ln)
        c.setFillColor(ACCENT); c.setFont(MONO, 6.6)
        c.drawString(cx, cy - 25, zref.upper())

    footer(c, 4, total, "The target condition")
    c.showPage()


def closing(c):
    page_bg(c)
    label(c, "Summary", M, PH - 52)
    c.setFillColor(INK)
    c.setFont(SERIF_B, 22)
    c.drawString(M, PH - 78, "Budget and order of work")
    c.setStrokeColor(INK)
    c.setLineWidth(1.4)
    c.line(M, PH - 88, PW - M, PH - 88)

    # tier table
    y = PH - 116
    label(c, "Tier", M, y, size=6.4)
    label(c, "Spend", M + 150, y, size=6.4)
    label(c, "Cumulative", M + 230, y, size=6.4)
    label(c, "What you get", M + 330, y, size=6.4)
    y -= 8
    c.setStrokeColor(RULE_STRONG)
    c.setLineWidth(0.7)
    c.line(M, y, PW / 2 + 260, y)
    y -= 16
    rows = [("0 — Housekeeping", "0", "0", "About 60% of the visual gain"),
            ("1 — High leverage", "3,310", "3,310", "Reads as a well-run room"),
            ("2 — Ceiling", "3,600", "6,910", "Duct fire risk removed"),
            ("3 — Finishing", "5,000", "11,910", "Audit-ready back-of-house")]
    for t, s, cum, w in rows:
        c.setFillColor(INK)
        c.setFont(SERIF, 10)
        c.drawString(M, y, t)
        c.setFont(MONO, 9.5)
        c.drawRightString(M + 205, y, s)
        c.drawRightString(M + 305, y, cum)
        c.setFillColor(INK_SOFT)
        c.setFont(SERIF, 10)
        c.drawString(M + 330, y, w)
        c.setStrokeColor(RULE)
        c.setLineWidth(0.4)
        c.line(M, y - 7, PW / 2 + 260, y - 7)
        y -= 23

    # order of work
    y -= 14
    hazard_band(c, M, y + 6, PW - 2 * M)
    y -= 14
    label(c, "Do these three first — they cost nothing", M, y, size=6.8, color=ALERT)
    y -= 16
    y = bullets(c, [
        "Zone 02 — clear the escape route. Green exit signage means the floor is not storage.",
        "Zone 01 — strip the paper wall off the distribution board and mark keep-clear zones at both boards.",
        "Zone 06 — establish what the overhead bulk tank contains before committing to Tier 3.",
    ], M, y, PW - 2 * M, size=10, lead=12.8, marker_color=ALERT)

    y -= 6
    c.setFillColor(SUNK)
    c.rect(M, y - 66, PW - 2 * M, 72, stroke=0, fill=1)
    c.setFillColor(INK)
    c.setFont(SERIF_B, 10.5)
    c.drawString(M + 14, y - 12, "About the renders")
    para(c, "The renders on each zone page are idealised concepts, not photographs of this room — "
            "use them to show intent, and read them against the current photograph beside them. They "
            "were supplied at 640px, which is fine on screen but soft if this report is printed "
            "large. For evidence of what one shift of cleaning actually buys before any money is "
            "committed, render the upright site photographs through the image-to-image prompts "
            "supplied with this brief: that produces a before and after of this room, not a concept.",
         M + 14, y - 28, PW - 2 * M - 28, size=9, lead=11.4)

    # ---- four-week sequence
    ys = y - 96
    c.setStrokeColor(INK); c.setLineWidth(1.0)
    c.line(M, ys + 26, PW - M, ys + 26)
    label(c, "Four-week sequence", M, ys + 8, size=6.8)
    ys -= 14
    seq = [
        ("Week 1", "Zones 01, 02, 06", "Escape route cleared, board zones marked, paper wall stripped, tank identified. Then the rest of Tier 0, including the high-level lint strip. Order Tier 1."),
        ("Week 2", "Zones 03, 04", "Alcove batten in first — it gives the cleaning kit somewhere to live. Then the twelve battens, upper-wall paint, dado clean, floor deep clean."),
        ("Week 3", "Zones 01, 04, 05", "Floor line painting, after wall painting and never before. Signage installed at one common height. Lidded bins and trolley bays sited and marked."),
        ("Week 4", "Zone 04", "Access equipment on site: high-level clean, then ceiling services painted grey. Ducting contractor."),
        ("Ongoing", "All", "Daily check sheet on the alcove board, signed. Without it the room reverts within six weeks."),
    ]
    for wk, zn, txt in seq:
        c.setFillColor(INK); c.setFont(SERIF_B, 9.5)
        c.drawString(M, ys, wk)
        c.setFillColor(ACCENT); c.setFont(MONO, 7.4)
        c.drawString(M + 62, ys, zn.upper())
        yy = ys
        for ln in wrap(c, txt, SERIF, 9.3, PW - 2 * M - 176):
            c.setFillColor(INK_SOFT); c.setFont(SERIF, 9.3)
            c.drawString(M + 176, yy, ln)
            yy -= 11.6
        c.setStrokeColor(RULE); c.setLineWidth(0.4)
        c.line(M, min(yy, ys - 11.6) + 5, PW - M, min(yy, ys - 11.6) + 5)
        ys = min(yy, ys - 11.6) - 6

    footer(c, 12, 12, "Budget and order of work")
    c.showPage()


def main():
    c = canvas.Canvas(OUT, pagesize=landscape(A4))
    c.setTitle("Laundry Room — Zone by Zone Enhancement Report")
    c.setAuthor("Back-of-house facilities brief")
    c.setSubject("Current condition matched to proposed enhancement, zone by zone")
    TOT = 12
    cover(c)
    index_page(c)
    LP.draw_layout(c, PW, PH, M, footer, label, wrap, para, page_bg, 3, TOT)
    target_page(c, TOT)
    for i, z in enumerate(ZONES):
        zone_page(c, z, i + 5, TOT)
    closing(c)
    c.save()
    print("wrote", OUT, os.path.getsize(OUT), "bytes")


if __name__ == "__main__":
    main()
