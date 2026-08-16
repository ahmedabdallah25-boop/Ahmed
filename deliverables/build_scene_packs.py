#!/usr/bin/env python3
"""Build the Money Mechanics week-1 scene-pack workbook.

Shot timings are derived from the VO word count at 3.0 words/second - the
verified delivery rate of the 9.8M-view "Survivorship Bias" short (62 words
in 18 seconds). Timings are computed, not hardcoded, so editing a VO line
and re-running keeps the sheet honest.
"""

from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

WPS = 3.0  # words per second - verified delivery rate

ARIAL = "Arial"
HDR_FILL = PatternFill("solid", fgColor="1F2A37")
HDR_FONT = Font(name=ARIAL, size=10, bold=True, color="FFFFFF")
BODY = Font(name=ARIAL, size=10)
BODY_B = Font(name=ARIAL, size=10, bold=True)
TITLE_FONT = Font(name=ARIAL, size=14, bold=True, color="1F2A37")
NOTE_FONT = Font(name=ARIAL, size=9, italic=True, color="5A6572")
PAYOFF_FILL = PatternFill("solid", fgColor="FFF3C4")   # the "name it" beat
HOOK_FILL = PatternFill("solid", fgColor="DDEBF7")     # the first-3-words beat
LOOP_FILL = PatternFill("solid", fgColor="E2EFDA")     # the rewatch loop beat
ALT_FILL = PatternFill("solid", fgColor="F5F7FA")
THIN = Side(style="thin", color="C9D1D9")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
WRAP = Alignment(wrap_text=True, vertical="top")
CENTER = Alignment(horizontal="center", vertical="top")

# beat codes: HOOK / SETUP / TURN / MECH / PAYOFF / LOOP
VIDEOS = [
    {
        "day": "Mon", "n": 6,
        "title": "Wells Fargo took your biggest payment first, on purpose",
        "concept": "High-to-low reordering",
        "anchor": "Wells Fargo",
        "shots": [
            ("HOOK",  "Wells Fargo took your biggest payment first. On purpose.",
             "WELLS FARGO", "Bank logo-style card slams in, then four pending transactions stack up.",
             "Motion graphic. No real logo - use a generic navy bank mark to stay clear of trademark use."),
            ("SETUP", "Say you have a hundred dollars and four transactions - three small ones, and your rent.",
             "BALANCE: $100", "Four labelled tiles: $4 coffee, $6 lunch, $9 petrol, $95 rent.",
             "Simple flat icons. Keep the rent tile visually heavier than the other three."),
            ("SETUP", "In the order they actually happened, you overdraft once.",
             "1 overdraft = $35", "Tiles animate left to right in time order; one red flag appears at the end.",
             "Red flag = single overdraft fee stamp."),
            ("TURN",  "Wells Fargo reordered them highest-first, so rent drained the account and all three small purchases bounced behind it.",
             "REORDERED: HIGH -> LOW", "Rent tile jumps to the front; three red flags cascade behind it.",
             "The reorder animation is the whole video - give it the most motion."),
            ("MECH",  "One overdraft became four. Thirty-five dollars each.",
             "$35 -> $140", "Four red flags in a row; running total counts up to $140.",
             "Counter animation, fast ease-out."),
            ("MECH",  "A judge found an internal memo predicting the change would earn them forty million dollars a year.",
             "INTERNAL MEMO: +$40M / YEAR", "Redacted document, one line highlighted in yellow.",
             "Generic redacted-doc graphic. Do not fabricate a document that looks like a real exhibit."),
            ("MECH",  "The court ordered two hundred and three million returned.",
             "$203,000,000 RETURNED", "Gavel hit; figure stamps on screen.",
             "Gutierrez v. Wells Fargo, Judge Alsup 2010. Final on appeal April 2016."),
            ("PAYOFF", "They called it high-to-low reordering.",
             "HIGH-TO-LOW REORDERING", "Term lands centre-frame, everything else clears.",
             "Hold one full beat of silence after this line."),
            ("LOOP",  "It wasn't a glitch. It was the product.",
             "NOT A GLITCH - THE PRODUCT", "Hard cut to black on the last word.",
             "Loop line: re-frames 'on purpose' in the opening."),
        ],
    },
    {
        "day": "Tue", "n": 1,
        "title": "Elon Musk borrowed $12.5 billion instead of selling one share",
        "concept": "Buy. Borrow. Die.",
        "anchor": "Elon Musk / Tesla",
        "shots": [
            ("HOOK",  "Elon Musk pledged sixty-two billion dollars of Tesla stock - to borrow twelve and a half.",
             "$62.5B PLEDGED -> $12.5B BORROWED", "Huge number counts up, then a second smaller number lands beside it.",
             "Forbes: $62.5B pledged against $12.5B in margin loans."),
            ("SETUP", "He could have just sold shares. But selling triggers capital gains tax - a bite that never grows back.",
             "SELL = TAXED", "Share bar with a chunk bitten out; the bitten piece greys and falls away.",
             "The 'bite' should visibly never return - that is the point."),
            ("TURN",  "A loan doesn't. Nobody is taxed on borrowed money.",
             "BORROW = NOT TAXED", "Identical bar, fully intact; a loan arrow slides in underneath it.",
             "Arrow must never touch the bar. Visual grammar for the whole video."),
            ("MECH",  "So the stock stays. It keeps compounding. The debt sits underneath it.",
             "", "Stock line climbs; debt bar tracks along beneath, never intersecting.",
             "Longest continuous motion in the video - let it breathe."),
            ("MECH",  "And when he dies, his heirs inherit at the new price, and the original gain is wiped clean.",
             "ORIGINAL GAIN -> ERASED", "The taxable-gain segment dissolves out of the bar.",
             "Dissolve, not a cut - 'wiped clean' should look effortless."),
            ("PAYOFF", "Bankers have a name for it. Buy. Borrow. Die.",
             "BUY. BORROW. DIE.", "Three words punch in on separate beats, centre-frame.",
             "One word per beat. Do not animate them together."),
            ("LOOP",  "Tesla's board eventually had to cap how much he could borrow. That's how well it works.",
             "BOARD CAPPED IT", "A hard cap line draws across the chart.",
             "Loop line: the cap is the proof. Tesla capped pledged borrowing at the lesser of $3.5B or 25%."),
        ],
    },
    {
        "day": "Wed", "n": 3,
        "title": "United's loyalty programme was worth more than United",
        "concept": "The planes are the marketing",
        "anchor": "United Airlines",
        "shots": [
            ("HOOK",  "United's frequent flyer programme was worth more than United.",
             "", "Two bars rise together; the miles bar overtakes the airline bar and keeps going.",
             "The overtake happens inside the first 3 seconds. That is the hook."),
            ("SETUP", "Around twenty billion dollars. The airline itself was priced near seventeen.",
             "$20B PROGRAMME  /  $17B AIRLINE", "Both bars label themselves.",
             "MileagePlus ~$20B (2019 estimate) vs ~$17B market cap."),
            ("MECH",  "Because miles cost nothing to make. United invents them,",
             "COST TO MINT: $0", "Mile tokens stamp out of empty space.",
             "Mint animation - tokens appearing from nothing sells 'costs nothing'."),
            ("MECH",  "sells them in bulk to banks, and the banks hand them to you as credit card rewards.",
             "AIRLINE -> BANK -> YOU", "Three-node flow diagram, tokens travelling along it.",
             "Keep nodes on screen for the next shot's reverse flow."),
            ("TURN",  "Real money in, for a currency they printed themselves.",
             "REAL $ IN  <-  PRINTED $ OUT", "Cash flows back along the same path in the opposite direction.",
             "Reverse the flow on the existing diagram - do not rebuild it."),
            ("MECH",  "We only know the numbers because in 2020 United was desperate and borrowed five billion against it.",
             "2020: $5B LOAN", "Year stamp; loan document slides under the miles bar as collateral.",
             "This is the disclosure that made the valuation public."),
            ("PAYOFF", "The planes are the marketing.",
             "THE PLANES ARE THE MARKETING", "Plane desaturates to grey; miles bar stays full colour.",
             "Colour does the argument here."),
            ("LOOP",  "You're not flying with an airline. You're flying with a bank that owns planes.",
             "A BANK THAT OWNS PLANES", "Bank building with a tail fin on the roof.",
             "Loop line: re-frames the opening comparison."),
        ],
    },
    {
        "day": "Thu", "n": 2,
        "title": "Banks have a word for people who pay on time",
        "concept": "Deadbeat / revolver",
        "anchor": "The card industry",
        "shots": [
            ("HOOK",  "There is a word banks use for customers who pay their credit card off every month.",
             "", "Card being paid in full; green tick lands.",
             "Play it straight for 3 seconds so the next shot inverts it."),
            ("PAYOFF", "Deadbeat.",
             "DEADBEAT", "The word stamps hard over the green tick.",
             "Early payoff by design - the shock is the hook, and the real payoff comes at the end."),
            ("SETUP", "You borrowed their money for thirty days, paid zero interest, and kept the cashback.",
             "30 DAYS FREE  +  CASHBACK", "30-day calendar fills; 0% badge; coins drop in.",
             "Make this look like winning - it is."),
            ("MECH",  "To them, you are a rounding error.",
             "PROFIT TO BANK: ~$0", "Profit bar barely lifts off the baseline.",
             "Comedy beat. Bar should be almost invisible."),
            ("TURN",  "The customer they want carries three thousand dollars at twenty-four percent, forever.",
             "$3,000 @ 24% APR", "Second card appears; its balance never drops.",
             "Loop the balance animation so it visibly never resolves."),
            ("MECH",  "The industry calls that one a revolver. Revolvers are the business. Everyone else is overhead.",
             "REVOLVER", "Second profit bar towers over the first.",
             "Both bars in frame together - the contrast is the point."),
            ("PAYOFF", "Your rewards are the recruiting budget.",
             "REWARDS = RECRUITING BUDGET", "Cashback coins visibly flow out of the revolver's profit bar.",
             "The coins must come from the other customer, not from the bank."),
            ("LOOP",  "Somebody is funding those points. Work out which one of you it is.",
             "WHO FUNDS YOUR POINTS?", "Two cards side by side; one pulses.",
             "Loop line and deliberate comment bait. Do not answer it."),
        ],
    },
    {
        "day": "Fri", "n": 4,
        "title": "The 0% offer that ends in a $1,200 bill",
        "concept": "Deferred interest",
        "anchor": "Store card / big-ticket retail",
        "shots": [
            ("HOOK",  "You owe fifty dollars. The bill says twelve hundred.",
             "OWED $50  ->  BILLED $1,200", "Both figures slam in on separate beats.",
             "$1,200 assumes 29.99% APR x 24 months on the original $2,000. Show the assumption if you show the number."),
            ("SETUP", "Zero percent for twenty-four months, on a two-thousand-dollar sofa.",
             "0% FOR 24 MONTHS", "Sofa with a promotional banner across it.",
             "Generic retail styling - do not imply a specific named retailer."),
            ("SETUP", "You paid it almost all the way down, then missed the final payment.",
             "$2,000 -> $50", "Balance bar drains steadily to a sliver.",
             "Steady, satisfying drain - sets up the reversal."),
            ("MECH",  "A normal loan charges interest as you go.",
             "NORMAL LOAN", "Small interest ticks accrue visibly alongside the balance.",
             "Establish the honest version first."),
            ("TURN",  "This one was charging the entire time, invisibly - and only forgives it if you clear every cent before the deadline.",
             "SHADOW INTEREST, ACCRUING", "A ghost bar grows behind the visible balance the whole time.",
             "The ghost bar should have been faintly visible from shot 3 in hindsight."),
            ("MECH",  "Miss by a dollar, and two years of interest lands at once - calculated on the full two thousand. Not on the fifty you still owed.",
             "CHARGED ON $2,000, NOT $50", "Ghost bar drops and solidifies into the $1,200 figure.",
             "CFPB-flagged: deferred interest applies to 100% of the original balance."),
            ("PAYOFF", "It was never zero percent.",
             "IT WAS NEVER 0%", "The promotional banner tears in half.",
             "Hold on the torn banner."),
            ("LOOP",  "You weren't offered a discount. You were offered a deadline.",
             "NOT A DISCOUNT - A DEADLINE", "A clock replaces the % sign.",
             "Loop line: re-frames the '0% for 24 months' banner."),
        ],
    },
    {
        "day": "Sat", "n": 5,
        "title": "Warren Buffett didn't buy insurance companies for the insurance",
        "concept": "The float",
        "anchor": "Warren Buffett / Berkshire Hathaway",
        "shots": [
            ("HOOK",  "Warren Buffett didn't buy insurance companies for the insurance.",
             "", "An insurance policy icon sits centre-frame, then greys out.",
             "Name in the first three words does the work. No portrait needed."),
            ("SETUP", "Insurers routinely pay out more in claims than they take in premiums - many lose money on the actual business, deliberately, year after year.",
             "PREMIUMS IN  <  CLAIMS OUT", "Two bars; the claims bar is visibly taller.",
             "Counterintuitive beat - hold long enough to land."),
            ("TURN",  "Because the premium was never the product.",
             "", "Policy icon fully desaturates and slides out of frame.",
             "Short beat. Silence around it."),
            ("MECH",  "You pay today. The claim arrives in ten years, or never.",
             "PAY NOW  ->  CLAIM IN 10 YEARS", "Long horizontal timeline; money enters at year zero.",
             "Exaggerate the length of the timeline."),
            ("MECH",  "In between, they are sitting on a mountain of your money, investing it.",
             "THE GAP = INVESTED", "Money pool grows along the pipe between the two ends.",
             "The pool is the hero object of this video."),
            ("MECH",  "They'll owe most of it back eventually. Every dollar it earns until then is theirs.",
             "RETURNS -> THEIRS", "Returns siphon off the pool mid-pipe into a separate stack.",
             "Two distinct destinations: the pool returns to the customer, the yield does not."),
            ("PAYOFF", "Berkshire Hathaway was built on exactly this. He called it the float.",
             "THE FLOAT", "The word lands directly on the pool.",
             "Buffett's own term."),
            ("LOOP",  "He wasn't selling you insurance. He was borrowing from you at less than zero.",
             "BORROWING BELOW 0%", "An interest-rate dial swings down through zero into negative.",
             "Loop line: re-frames 'didn't buy it for the insurance'."),
        ],
    },
    {
        "day": "Sun", "n": 7,
        "title": "Toys R Us was profitable when it died",
        "concept": "Leveraged buyout",
        "anchor": "Toys R Us / KKR / Bain / Vornado",
        "shots": [
            ("HOOK",  "Toys R Us was profitable when it died.",
             "PROFITABLE  ->  DEAD", "Storefront lit and busy, then every light cuts out.",
             "Nostalgia does the emotional work. Generic toy-store styling, no real logo."),
            ("SETUP", "In 2005, three investment firms bought it for six point six billion.",
             "2005  -  $6.6 BILLION", "Three blocks converge on the storefront.",
             "Closed 21 July 2005. KKR, Bain Capital, Vornado Realty Trust."),
            ("TURN",  "They put in one point three of their own.",
             "THEIR OWN MONEY: $1.3B", "A surprisingly small stack lands beside the $6.6B figure.",
             "The size gap between the two figures is the reveal."),
            ("MECH",  "The rest was borrowed - and the debt went onto Toys R Us, not them.",
             "BORROWED $5.3B  ->  ONTO THE STORE", "A heavy debt block drops onto the storefront, not onto the three firms.",
             "This single motion is the entire mechanism. Give it real weight."),
            ("MECH",  "So the company owed four hundred million a year in interest alone.",
             "$400M / YEAR IN INTEREST", "An annual drain meter empties on a loop.",
             "~$400M/year debt service disclosed at the 2017 filing."),
            ("MECH",  "Money it couldn't spend on stores, staff, or fighting Amazon.",
             "NOT SPENT: STORES - STAFF - COMPETING", "Three icons grey out one by one.",
             "Careful wording: the debt consumed the money it needed to compete. Avoid claiming debt alone killed it."),
            ("MECH",  "It filed for bankruptcy in 2017. Thirty-three thousand jobs gone.",
             "2017  -  33,000 JOBS", "Closing-down sign; a counter runs to 33,000.",
             "Let the counter finish before cutting."),
            ("TURN",  "The firms had already taken four hundred and sixty-four million in fees.",
             "FEES TAKEN: $464M", "Money leaves the store and reaches the three blocks before the collapse.",
             "Fees and interest collected by the three firms over the holding period."),
            ("PAYOFF", "That's a leveraged buyout.",
             "LEVERAGED BUYOUT", "Term lands centre-frame over the dark storefront.",
             "Hold one beat of silence."),
            ("LOOP",  "They didn't buy it with their money. They bought it with its money.",
             "BOUGHT IT WITH ITS OWN MONEY", "An arrow loops from the store back to the store.",
             "Loop line: re-frames the $6.6B price in the opening."),
        ],
    },
]

BEAT_LABEL = {
    "HOOK": "1 - Hook (first 3 words)",
    "SETUP": "2 - Setup",
    "TURN": "3 - Turn",
    "MECH": "4 - Mechanism",
    "PAYOFF": "5 - Name it",
    "LOOP": "6 - Loop (rewatch)",
}


def style_header(ws, row, ncols):
    for c in range(1, ncols + 1):
        cell = ws.cell(row=row, column=c)
        cell.fill = HDR_FILL
        cell.font = HDR_FONT
        cell.alignment = Alignment(wrap_text=True, vertical="center")
        cell.border = BORDER
    ws.row_dimensions[row].height = 28


def build():
    wb = Workbook()

    # ---------- READ ME ----------
    ws = wb.active
    ws.title = "READ ME"
    ws.sheet_view.showGridLines = False
    rows = [
        ("Money Mechanics - Week 1 Scene Packs", TITLE_FONT),
        ("", None),
        ("Seven faceless YouTube Shorts. Shot-by-shot production grid.", BODY_B),
        ("", None),
        ("HOW TIMINGS WORK", BODY_B),
        ("Every shot's duration is calculated from its voiceover word count at 3.0 words per second.", BODY),
        ("That rate is measured, not guessed: the 9.8M-view 'Survivorship Bias' short runs 62 words in 18 seconds.", BODY),
        ("Timings are computed values, so they display correctly in every viewer. To change them, edit the VO", BODY),
        ("line in build_scene_packs.py and re-run it - the whole grid regenerates.", BODY),
        ("", None),
        ("THE SIX-BEAT STRUCTURE", BODY_B),
        ("1 - Hook       First three words carry a name everyone knows. Zero setup cost.", BODY),
        ("2 - Setup      Concrete, fast, specific.", BODY),
        ("3 - Turn       The assumption breaks.", BODY),
        ("4 - Mechanism  The money machinery, stated plainly.", BODY),
        ("5 - Name it    Isolated line, 2-4 words. The highest-value beat.", BODY),
        ("6 - Loop       Re-frames the opening line on rewatch. Drives completion over 100%.", BODY),
        ("", None),
        ("COLOUR KEY", BODY_B),
        ("Blue row    = Hook beat", BODY),
        ("Yellow row  = 'Name it' payoff beat", BODY),
        ("Green row   = Loop beat", BODY),
        ("", None),
        ("HOUSE RULES", BODY_B),
        ("Cold open. No greeting, no channel name, no 'in this video'.", BODY),
        ("No call to action. No outro. End on the loop line and cut.", BODY),
        ("Never answer the title in the title.", BODY),
        ("One trailing emoji in the title, or none. Never mid-title.", BODY),
        ("", None),
        ("BEFORE YOU PUBLISH", BODY_B),
        ("All factual claims are verified - sources are in shorts-market-research-2026-08.md.", BODY),
        ("Use generic brand-styled graphics, not real logos or real-looking documents.", BODY),
        ("Every video is 28-36s, so none exceed the 180s Shorts cap and none need a 16:9 thumbnail.", BODY),
        ("Do not judge performance before 72 hours. Convert to views/day with the age attached.", BODY),
    ]
    for i, (text, font) in enumerate(rows, start=1):
        c = ws.cell(row=i, column=1, value=text)
        if font:
            c.font = font
    ws.column_dimensions["A"].width = 118

    # ---------- WEEK PLAN ----------
    ws = wb.create_sheet("Week Plan")
    ws.sheet_view.showGridLines = False
    headers = ["Day", "Script #", "Title", "Brand anchor", "Concept named",
               "Shots", "Runtime (s)", "VO words", "Script written",
               "VO recorded", "Edited", "Published"]
    for j, h in enumerate(headers, start=1):
        ws.cell(row=1, column=j, value=h)
    style_header(ws, 1, len(headers))

    for i, v in enumerate(VIDEOS, start=2):
        words = sum(len(s[1].split()) for s in v["shots"])
        ws.cell(row=i, column=1, value=v["day"]).font = BODY_B
        ws.cell(row=i, column=2, value=f"Script {v['n']}").font = BODY
        ws.cell(row=i, column=3, value=v["title"]).font = BODY
        ws.cell(row=i, column=4, value=v["anchor"]).font = BODY
        ws.cell(row=i, column=5, value=v["concept"]).font = BODY
        ws.cell(row=i, column=6, value=len(v["shots"])).font = BODY
        ws.cell(row=i, column=7, value=round(words / WPS)).font = BODY
        ws.cell(row=i, column=8, value=words).font = BODY
        for j in (9, 10, 11, 12):
            cell = ws.cell(row=i, column=j, value="")
            cell.fill = PatternFill("solid", fgColor="FFFF00")
            cell.border = BORDER
        for j in range(1, len(headers) + 1):
            ws.cell(row=i, column=j).border = BORDER
            ws.cell(row=i, column=j).alignment = WRAP
        ws.row_dimensions[i].height = 30

    tot = len(VIDEOS) + 2
    ws.cell(row=tot, column=3, value="WEEK TOTAL").font = BODY_B
    ws.cell(row=tot, column=6, value=sum(len(v["shots"]) for v in VIDEOS)).font = BODY_B
    ws.cell(row=tot, column=7, value=sum(round(sum(len(s2[1].split()) for s2 in v["shots"]) / WPS) for v in VIDEOS)).font = BODY_B
    ws.cell(row=tot, column=8, value=sum(sum(len(s2[1].split()) for s2 in v["shots"]) for v in VIDEOS)).font = BODY_B

    note = ws.cell(row=tot + 2, column=1,
                   value="Yellow cells are for you to fill in. Runtime is a formula: VO words / 3.0 words per second.")
    note.font = NOTE_FONT

    widths = [6, 10, 46, 24, 22, 8, 12, 10, 14, 13, 9, 11]
    for j, w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(j)].width = w
    ws.freeze_panes = "A2"

    # ---------- SCENE PACKS ----------
    ws = wb.create_sheet("Scene Packs")
    ws.sheet_view.showGridLines = False
    headers = ["Day", "Script", "Shot", "Beat", "Start (s)", "End (s)", "Dur (s)",
               "Voiceover line", "On-screen text", "Visual / action", "Production note", "Words"]
    for j, h in enumerate(headers, start=1):
        ws.cell(row=1, column=j, value=h)
    style_header(ws, 1, len(headers))

    r = 2
    for v in VIDEOS:
        block_start = r
        clock = 0.0
        for k, (beat, vo, ost, visual, prod) in enumerate(v["shots"], start=1):
            words = len(vo.split())
            dur = round(words / WPS, 1)
            start_s, end_s = round(clock, 1), round(clock + dur, 1)
            clock = end_s
            ws.cell(row=r, column=1, value=v["day"])
            ws.cell(row=r, column=2, value=f"#{v['n']} {v['title']}")
            ws.cell(row=r, column=3, value=k)
            ws.cell(row=r, column=4, value=BEAT_LABEL[beat])
            # start = previous end within this block; first shot starts at 0
            ws.cell(row=r, column=5, value=start_s)
            ws.cell(row=r, column=6, value=end_s)
            ws.cell(row=r, column=7, value=dur)
            ws.cell(row=r, column=8, value=vo)
            ws.cell(row=r, column=9, value=ost)
            ws.cell(row=r, column=10, value=visual)
            ws.cell(row=r, column=11, value=prod)
            ws.cell(row=r, column=12, value=words)

            fill = None
            if beat == "HOOK":
                fill = HOOK_FILL
            elif beat == "PAYOFF":
                fill = PAYOFF_FILL
            elif beat == "LOOP":
                fill = LOOP_FILL

            for j in range(1, len(headers) + 1):
                cell = ws.cell(row=r, column=j)
                cell.font = BODY_B if j == 9 else BODY
                cell.alignment = CENTER if j in (3, 5, 6, 7, 12) else WRAP
                cell.border = BORDER
                if fill:
                    cell.fill = fill
                elif (r - block_start) % 2 == 1:
                    cell.fill = ALT_FILL
                if j in (5, 6, 7):
                    cell.number_format = "0.0"
            ws.row_dimensions[r].height = 46
            r += 1

        # per-video total row
        ws.cell(row=r, column=4, value="TOTAL").font = BODY_B
        ws.cell(row=r, column=7, value=round(clock, 1)).font = BODY_B
        ws.cell(row=r, column=12, value=sum(len(s2[1].split()) for s2 in v["shots"])).font = BODY_B
        ws.cell(row=r, column=8, value=f"Runtime check - target 28-36s").font = NOTE_FONT
        for j in range(1, len(headers) + 1):
            ws.cell(row=r, column=j).border = BORDER
            if j in (7,):
                ws.cell(row=r, column=j).number_format = "0.0"
        r += 2

    widths = [6, 34, 7, 20, 10, 10, 9, 60, 30, 46, 46, 8]
    for j, w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(j)].width = w
    ws.freeze_panes = "A2"

    out = "/home/user/Ahmed/deliverables/money-mechanics-week1-scene-packs.xlsx"
    wb.save(out)
    print("saved", out)


if __name__ == "__main__":
    build()
