#!/usr/bin/env python3
"""Build the VO-ready scripts PDF for the Money Mechanics week-1 slate.

Reads the same shot data as the scene-pack workbook so the two deliverables
cannot drift apart.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph,
                                Spacer, Table, TableStyle, PageBreak, KeepTogether)

from build_scene_packs import VIDEOS, WPS

INK = colors.HexColor("#1F2A37")
MUTED = colors.HexColor("#5A6572")
RULE = colors.HexColor("#D7DEE6")
AMBER = colors.HexColor("#B45309")
AMBER_BG = colors.HexColor("#FFF7E6")
BLUE_BG = colors.HexColor("#EEF4FB")
GREEN_BG = colors.HexColor("#EDF6EE")
PANEL = colors.HexColor("#F5F7FA")

S = {
    "h1": ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=25, leading=29,
                         textColor=INK, spaceAfter=4),
    "sub": ParagraphStyle("sub", fontName="Helvetica", fontSize=10.5, leading=15,
                          textColor=MUTED),
    "day": ParagraphStyle("day", fontName="Helvetica-Bold", fontSize=8.5, leading=11,
                          textColor=AMBER, spaceAfter=3),
    "title": ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=17, leading=21,
                            textColor=INK, spaceAfter=2),
    "meta": ParagraphStyle("meta", fontName="Helvetica", fontSize=8.5, leading=12,
                           textColor=MUTED),
    "beat": ParagraphStyle("beat", fontName="Helvetica-Bold", fontSize=7, leading=9,
                           textColor=MUTED),
    "vo": ParagraphStyle("vo", fontName="Helvetica", fontSize=12.5, leading=18.5,
                         textColor=INK),
    "vo_pay": ParagraphStyle("vo_pay", fontName="Helvetica-Bold", fontSize=13.5, leading=19,
                             textColor=AMBER),
    "ost": ParagraphStyle("ost", fontName="Helvetica-Bold", fontSize=8, leading=11,
                          textColor=INK),
    "note": ParagraphStyle("note", fontName="Helvetica-Oblique", fontSize=8.5, leading=12.5,
                           textColor=MUTED),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=10, leading=15,
                           textColor=INK, spaceAfter=5),
    "bodyb": ParagraphStyle("bodyb", fontName="Helvetica-Bold", fontSize=10.5, leading=15,
                            textColor=INK, spaceBefore=9, spaceAfter=4),
    "kicker": ParagraphStyle("kicker", fontName="Helvetica-Bold", fontSize=8,
                             leading=11, textColor=AMBER, spaceAfter=8),
}

VERIFIED = {
    6: "Gutierrez v. Wells Fargo, Judge Alsup 2010. High-to-low reordering multiplied overdraft "
       "fees; an internal memo projected +$40M/year; $203M ordered returned, final on appeal "
       "April 2016.",
    1: "Forbes: $62.5B of Tesla stock pledged against $12.5B in margin loans. Tesla's board "
       "later capped pledged borrowing at the lesser of $3.5B or 25% of value. Roughly 236M of "
       "his 715M shares remain pledged.",
    3: "United MileagePlus valued at ~$20B (2019) against a ~$17B market cap. United raised $5B "
       "against the programme in 2020, which is how the figures became public.",
    2: "'Deadbeat' and 'revolver' are both genuine credit-card industry terms, used exactly this "
       "way: deadbeats pay in full and generate little interest revenue; revolvers carry "
       "balances and are the profitable segment.",
    4: "Deferred interest applies retroactively to 100% of the original balance, not the "
       "remaining balance. CFPB-flagged as a consumer-harm risk. The $1,200 figure assumes "
       "29.99% APR over 24 months on $2,000 - state that assumption if you put the number "
       "on screen.",
    5: "Buffett's own term. Insurers can run an underwriting loss and still profit by investing "
       "the premium held between payment and claim.",
    7: "Acquisition closed 21 July 2005 (KKR, Bain Capital, Vornado) at $6.6B, over $5.3B of it "
       "debt-financed. ~$400M/year debt service disclosed at the September 2017 Chapter 11 "
       "filing; ~33,000 jobs lost; $464M in fees and interest collected by the three firms. "
       "FAIRNESS: a Columbia Law analysis argues retail disruption was the primary cause. The "
       "script's narrower claim - that debt consumed the money needed to compete - is the "
       "defensible one.",
}

BEAT_SHORT = {
    "HOOK": "HOOK", "SETUP": "SETUP", "TURN": "TURN",
    "MECH": "MECHANISM", "PAYOFF": "NAME IT", "LOOP": "LOOP",
}


def runtime(v):
    return round(sum(len(s[1].split()) for s in v["shots"]) / WPS)


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.5)
    canvas.line(18 * mm, 15 * mm, A4[0] - 18 * mm, 15 * mm)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 10.5 * mm, "Money Mechanics - Week 1 scripts")
    canvas.drawRightString(A4[0] - 18 * mm, 10.5 * mm, f"{doc.page}")
    canvas.restoreState()


def cover():
    f = []
    f.append(Paragraph("WEEK 1 SLATE", S["kicker"]))
    f.append(Paragraph("Money Mechanics", S["h1"]))
    f.append(Paragraph(
        "Seven faceless YouTube Shorts, voiceover-ready. Every runtime is 28-36 seconds, "
        "every factual claim is verified, and every hook is anchored on a name the viewer "
        "already knows.", S["sub"]))
    f.append(Spacer(1, 9 * mm))

    f.append(Paragraph("The six-beat structure", S["bodyb"]))
    beats = [
        ["1", "Hook", "First three words carry a name everyone knows. Zero setup cost."],
        ["2", "Setup", "Concrete, fast, specific."],
        ["3", "Turn", "The assumption breaks."],
        ["4", "Mechanism", "The money machinery, stated plainly."],
        ["5", "Name it", "Isolated line, 2-4 words. The highest-value beat."],
        ["6", "Loop", "Re-frames the opening on rewatch. Drives completion over 100%."],
    ]
    t = Table([[Paragraph(f"<b>{a}</b>", S["body"]),
                Paragraph(f"<b>{b}</b>", S["body"]),
                Paragraph(c, S["body"])] for a, b, c in beats],
              colWidths=[8 * mm, 26 * mm, 140 * mm])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LINEBELOW", (0, 0), (-1, -2), 0.4, RULE),
    ]))
    f.append(t)

    f.append(Paragraph("Delivery", S["bodyb"]))
    f.append(Paragraph(
        "Read at about <b>3 words per second</b>. That is a measured rate, not a guess: the "
        "9.8M-view <i>Survivorship Bias</i> short runs 62 words in 18 seconds. It is faster "
        "than conversational speech and it is meant to be.", S["body"]))

    f.append(Paragraph("House rules", S["bodyb"]))
    for r in [
        "Cold open. No greeting, no channel name, no 'in this video'.",
        "No call to action, no outro. End on the loop line and cut.",
        "Never answer the title in the title.",
        "Hold one beat of silence after the 'Name it' line.",
        "Use generic brand-styled graphics, never real logos or real-looking documents.",
    ]:
        f.append(Paragraph(f"&bull;&nbsp;&nbsp;{r}", S["body"]))

    f.append(Paragraph("Posting order", S["bodyb"]))
    rows = [[Paragraph("<b>Day</b>", S["meta"]), Paragraph("<b>Script</b>", S["meta"]),
             Paragraph("<b>Runtime</b>", S["meta"]), Paragraph("<b>Why here</b>", S["meta"])]]
    why = {
        6: "Strongest hook, hardest numbers. Lead with your best.",
        1: "Biggest pre-loaded name on the slate.",
        3: "Hard number in the first six words.",
        2: "Personal - everyone watching owns a card.",
        4: "Rolls into weekend retail mindset.",
        5: "Named person carries a quieter concept.",
        7: "Strongest emotional close of the week.",
    }
    for v in VIDEOS:
        rows.append([
            Paragraph(f"<b>{v['day']}</b>", S["meta"]),
            Paragraph(v["title"], S["meta"]),
            Paragraph(f"~{runtime(v)}s", S["meta"]),
            Paragraph(why[v["n"]], S["meta"]),
        ])
    t = Table(rows, colWidths=[12 * mm, 74 * mm, 16 * mm, 72 * mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LINEBELOW", (0, 0), (-1, 0), 0.8, INK),
        ("LINEBELOW", (0, 1), (-1, -2), 0.4, RULE),
        ("BACKGROUND", (0, 1), (-1, 1), AMBER_BG),
    ]))
    f.append(t)
    f.append(PageBreak())
    return f


def script_page(v):
    f = []
    f.append(Paragraph(f"{v['day'].upper()}&nbsp;&nbsp;&middot;&nbsp;&nbsp;SCRIPT {v['n']}", S["day"]))
    f.append(Paragraph(v["title"], S["title"]))
    f.append(Paragraph(
        f"~{runtime(v)}s&nbsp;&nbsp;&middot;&nbsp;&nbsp;{len(v['shots'])} shots"
        f"&nbsp;&nbsp;&middot;&nbsp;&nbsp;Anchor: {v['anchor']}"
        f"&nbsp;&nbsp;&middot;&nbsp;&nbsp;Concept: {v['concept']}", S["meta"]))
    f.append(Spacer(1, 5 * mm))

    rows, styles = [], [
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (0, -1), 0),
        ("LEFTPADDING", (1, 0), (1, -1), 6),
        ("RIGHTPADDING", (1, 0), (1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]
    for i, (beat, vo, ost, _visual, _prod) in enumerate(v["shots"]):
        st = S["vo_pay"] if beat == "PAYOFF" else S["vo"]
        cell = [Paragraph(vo, st)]
        if ost:
            cell.append(Spacer(1, 1.6 * mm))
            cell.append(Paragraph(
                f'<font color="#5A6572">ON SCREEN&nbsp;&nbsp;</font>{ost}', S["ost"]))
        rows.append([Paragraph(BEAT_SHORT[beat], S["beat"]), cell])
        if beat == "PAYOFF":
            styles.append(("BACKGROUND", (0, i), (-1, i), AMBER_BG))
        elif beat == "HOOK":
            styles.append(("BACKGROUND", (0, i), (-1, i), BLUE_BG))
        elif beat == "LOOP":
            styles.append(("BACKGROUND", (0, i), (-1, i), GREEN_BG))
        if i < len(v["shots"]) - 1:
            styles.append(("LINEBELOW", (0, i), (-1, i), 0.4, RULE))

    t = Table(rows, colWidths=[22 * mm, 152 * mm])
    t.setStyle(TableStyle(styles))
    f.append(t)

    f.append(Spacer(1, 6 * mm))
    box = Table([[Paragraph(f"<b>VERIFIED.</b> {VERIFIED[v['n']]}", S["note"])]],
                colWidths=[174 * mm])
    box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PANEL),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("LINEBEFORE", (0, 0), (0, -1), 2.2, AMBER),
    ]))
    f.append(box)
    f.append(PageBreak())
    return f


def build():
    out = "/home/user/Ahmed/deliverables/money-mechanics-week1-scripts.pdf"
    doc = BaseDocTemplate(out, pagesize=A4,
                          leftMargin=18 * mm, rightMargin=18 * mm,
                          topMargin=18 * mm, bottomMargin=22 * mm,
                          title="Money Mechanics - Week 1 scripts",
                          author="Finance % Decoded")
    frame = Frame(doc.leftMargin, doc.bottomMargin,
                  doc.width, doc.height, id="f")
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=footer)])

    story = cover()
    for v in VIDEOS:
        story += script_page(v)
    if isinstance(story[-1], PageBreak):
        story.pop()
    doc.build(story)
    print("saved", out)


if __name__ == "__main__":
    build()
