#!/usr/bin/env python3
"""Build a consolidated, copy-paste-ready image-prompt PDF for Deen & Money Ep 1."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph,
                                Spacer, Table, TableStyle, KeepTogether, PageBreak)

OUT = "/home/user/Ahmed/deen-and-money/EP01-image-prompts.pdf"

# ---------------------------------------------------------------- palette
CREAM   = colors.HexColor("#F5EFDC")
INK     = colors.HexColor("#3A2E22")
OLIVE   = colors.HexColor("#6B7B4A")
TEAL    = colors.HexColor("#2F5D62")
RUST    = colors.HexColor("#A6512F")
SAND    = colors.HexColor("#C8A265")
GREY    = colors.HexColor("#8A8378")
HAIRL   = colors.HexColor("#D8CEB8")
BOXBG   = colors.HexColor("#FBF7EC")

# ---------------------------------------------------------------- blocks
STYLE = ("Flat 2D vector illustration, thick uniform dark-brown outlines, flat colour fill with "
         "soft cel shading, no gradients, no photographic texture. Warm cream background (#F5EFDC). "
         "Muted editorial palette: olive green, rust terracotta, deep teal, warm sand, charcoal grey, "
         "brick red accent. Clean modern explainer-video aesthetic. 16:9 horizontal, cinematic "
         "composition with generous negative space in the upper third for on-screen text. Consistent "
         "character design across all frames.")

KAREEM = ("KAREEM: adult man, mid-30s, warm medium skin tone, short black hair brushed back, short "
          "neatly trimmed dark beard, friendly rounded face, average build, olive-green collarless "
          "henley with sleeves rolled to mid-forearm, charcoal-grey trousers, dark brown shoes.")
ADAM = ("ADAM: adult man, late 20s, warm medium skin tone, short dark brown hair with a side part, "
        "clean-shaven, friendly rounded face, average build, rust-terracotta crew-neck t-shirt, warm "
        "tan trousers, dark brown shoes.")
SAMI = ("SAMI: adult man, late 20s, warm medium skin tone, short black hair, close-cropped stubble, "
        "friendly rounded face, average build, deep-teal crew-neck t-shirt, charcoal-grey trousers, "
        "dark brown shoes.")
BILAL = ("BILAL: adult man, early 30s, warm medium skin tone, short dark hair, full short beard, "
         "friendly rounded face, average build, warm sand-coloured button shirt with sleeves rolled, "
         "deep-brown trousers, dark brown shoes.")

SPLIT = ("Wide 16:9 composition on warm cream, divided into two equal halves by a single thin vertical "
         "charcoal line running floor to ceiling. Both halves lit identically, at the same scale and "
         "the same eye level.")
SCORE = ("Full-frame cream card with a thin charcoal border. A heading strip across the top. Below it, "
         "two equal columns divided by a thin vertical rule, each headed with a small circular character "
         "portrait. Each column contains four horizontal line-item rows separated by hairlines, with a "
         "label on the left and a value box on the right. A heavy horizontal rule near the bottom, and "
         "beneath it one large TOTAL figure per column.")
RIBBON = ("Across the bottom edge of frame, a slim horizontal strip containing a thin charcoal baseline "
          "with evenly spaced small tick marks, a filled deep-teal segment running from the left end to "
          "the current position, and a small solid circular marker at that position.")
HIDDEN = ("A small rounded rust-terracotta card with a thin darker border overlapping the lower-left of "
          "frame, containing one label line and one figure, with a brick-red strike-through line across "
          "a larger figure above it and a smaller figure written beneath.")
LEDGER = ("A large flat cream wall covered edge to edge with a faint hand-drawn grid of thin charcoal "
          "lines, a few chalk-style numbers and bar shapes sketched on it, and a plain narrow shelf "
          "running along the bottom.")
COUNTER = ("A plain institutional counter with a simple grille and a small speaking gap, one featureless "
           "grey silhouette figure standing behind it, cream wall, no signage or branding.")

def P(*parts):
    return " ".join(p.strip() for p in parts if p and p.strip())

# ---------------------------------------------------------------- shots
# (no, time, device_label, on_screen_text, full_prompt)
S = []
def add(no, t, dev, ost, prompt):
    S.append((no, t, dev, ost, prompt))

add(1, "0:00", "Split frame", "MEET ADAM AND SAMI", P(SPLIT,
  "Left half: a man standing in a relaxed neutral pose facing the viewer, arms at his sides, "
  "faint half-smile. Right half: a second man in an identical pose and identical framing.", ADAM, SAMI, STYLE))

add(2, "0:08", "Split frame", "SAME AGE / SAME SALARY / SAME SAVINGS", P(SPLIT,
  "Both men hold an identical small stack of banknotes at exactly the same height in front of them, "
  "mirrored posture, perfectly symmetrical composition.", ADAM, SAMI, STYLE))

add(3, "0:20", "Full frame", "NOTHING SEPARATES THEM", P(
  "Full-frame cream card with a thin charcoal border, containing two equal columns divided by a thin "
  "vertical rule. Four horizontal rows span both columns, each row holding a short label line and a "
  "small tick mark in each column, so all four rows tick identically on both sides. No characters in "
  "frame.", STYLE))

add(4, "0:30", "Split frame", "SAFE  /  WORKING", P(SPLIT,
  "Left half: a man clutching a closed metal lockbox tightly against his chest with both arms, "
  "protective posture. Right half: a second man crouched slightly, watching a small seedling in a "
  "terracotta pot on the ground, hands on his knees.", ADAM, SAMI, STYLE))

add(5, "0:42", "Scoreboard", "30 YEARS FROM NOW", P(SCORE,
  "Heading strip reads 30 YEARS FROM NOW. Left column headed with a small circular portrait of a man "
  "in a rust-terracotta t-shirt, right column with a man in a deep-teal t-shirt. All four line-item "
  "value boxes are empty, and both TOTAL figures are replaced by a large question mark.", ADAM, SAMI, STYLE))

add(6, "0:52", "Split frame", "NOT ONE DOLLAR OF DIFFERENCE", P(SPLIT,
  "Both men, mirrored, each dropping an identical single coin into an identical container in front of "
  "them, both coins caught mid-air at the same height with a soft motion arc.", ADAM, SAMI, STYLE))

add(7, "1:02", "Left half only", "1.5%", P(
  "Wide 16:9 composition on warm cream showing only the left-hand side of a split scene, with the thin "
  "vertical charcoal divider visible at the right edge of frame. A man stands at a plain institutional "
  "counter in profile, sliding a small stack of banknotes through the grille to a featureless grey "
  "silhouette figure behind it.", COUNTER, ADAM, RIBBON, STYLE))

add(8, "1:16", "Left half only", "IT ONLY EVER GOES UP", P(
  "Wide 16:9 composition on warm cream, left-hand side of a split scene with the thin vertical charcoal "
  "divider at the right edge. Close three-quarter view of a man holding a smartphone up at chest height; "
  "the phone screen shows a simple ascending staircase line that never dips. His face is turned toward "
  "the screen with a small satisfied smile.", ADAM, RIBBON, STYLE))

add(9, "1:32", "Left half only", "NEVER LOWER THAN YESTERDAY", P(
  "Wide 16:9 on warm cream, left-hand side of a split scene, divider at the right edge. A man stands "
  "beside a single olive-green vertical bar that rises to his shoulder height, one hand resting flat on "
  "top of it, relaxed and content. The bar's outline is smooth with no dips anywhere along its edge.",
  ADAM, RIBBON, STYLE))

add(10, "1:46", "Right half only", "TOTAL MARKET INDEX FUND", P(
  "Wide 16:9 on warm cream, right-hand side of a split scene with the thin vertical charcoal divider at "
  "the left edge. A man is seated at a plain wooden desk in three-quarter view with an open laptop, one "
  "hand on the trackpad, a simple lamp and a mug beside him, calm unhurried expression.", SAMI, RIBBON, STYLE))

add(11, "2:00", "Right half only", "SEVERAL THOUSAND BUSINESSES", P(
  "Wide 16:9 on warm cream, right-hand side of a split scene, divider at the left edge. A dense evenly "
  "spaced grid of many small simple business icons -- factories with chimneys, shopfronts with awnings, "
  "delivery vans, office blocks -- fills the upper two-thirds of the frame. A very small figure of a man "
  "stands at the bottom edge looking up at them.", SAMI, RIBBON, STYLE))

add(12, "2:14", "Right half only", "THEN HE CLOSED THE APP", P(
  "Wide 16:9 on warm cream, right-hand side of a split scene, divider at the left edge. A man is closing "
  "a laptop lid with one hand while already turning to walk out of the right of frame, mid-stride, "
  "completely unbothered expression. The desk is otherwise empty.", SAMI, RIBBON, STYLE))

add(13, "2:30", "Split frame", "CERTAINTY  /  OWNERSHIP", P(SPLIT,
  "Left half: a man holding a closed brass padlock up at chest height in one hand, looking directly at "
  "the viewer. Right half: a second man in an identical pose holding a small potted seedling at the same "
  "height, also looking directly at the viewer.", ADAM, SAMI, STYLE))

add(14, "2:46", "Split frame", "DAY ONE", P(SPLIT,
  "No characters. Left half: a single solid olive-green vertical bar with clean straight edges and a "
  "small label plate at its base. Right half: a vertical bar of similar height drawn only as a wobbling, "
  "irregular dashed outline with no fill.", RIBBON, STYLE))

add(15, "3:00", "Right half only", "-$400. NO REASON.", P(
  "Wide 16:9 on warm cream, right-hand side of a split scene, divider at the left edge. Close view of a "
  "man holding a smartphone; the screen shows a small brick-red figure with a downward arrow beside it. "
  "His expression is completely flat and unbothered, eyebrows neutral.", SAMI, RIBBON, STYLE))

add(16, "3:14", "Split frame", "PEOPLE NOD", P(SPLIT,
  "Left half: a man standing with a small satisfied smile, flanked by three featureless grey silhouette "
  "figures leaning toward him and nodding, one with a thumb raised. Right half: a second man standing "
  "alone in identical framing, with two grey silhouette figures in the background turned away from him "
  "and talking to each other.", ADAM, SAMI, STYLE))

add(17, "3:30", "Split frame", "CONTROL  /  WAITING", P(SPLIT,
  "Left half: a man seen from the front gripping a steering wheel with both hands, seen through a "
  "simplified car window frame, focused expression. Right half: a second man seated on a plain bench in "
  "three-quarter view, hands loose in his lap, doing nothing at all, calm.", ADAM, SAMI, STYLE))

add(18, "3:46", "Scoreboard -- CHECKPOINT 1", "YEAR 3", P(SCORE,
  "Heading strip reads YEAR 3. Left column headed with a small circular portrait of a man in a "
  "rust-terracotta t-shirt and a TOTAL figure box outlined in deep teal. Right column headed with a man "
  "in a deep-teal t-shirt and a TOTAL figure box outlined in brick red. Four filled line-item rows per "
  "column.", ADAM, SAMI, STYLE))

add(19, "4:00", "Left half only", "36 MONTHS. 36 SMALL WINS.", P(
  "Wide 16:9 on warm cream, left-hand side of a split scene, divider at the right edge. No character. A "
  "simple line graph whose olive-green line ascends in thirty-six tiny even steps from lower-left to "
  "upper-right, never once dipping. Thin charcoal axis lines, small tick marks along the base.",
  RIBBON, STYLE))

add(20, "4:14", "Right half only", "BELOW WHAT HE PUT IN", P(
  "Wide 16:9 on warm cream, right-hand side of a split scene, divider at the left edge. No character. A "
  "deep-teal line graph that rises briefly then plunges steeply and stays low, with a long horizontal "
  "dashed charcoal line running across the frame above it marking a reference level. The plunging line "
  "sits clearly beneath the dashed line.", RIBBON, STYLE))

add(21, "4:28", "Hidden cost card", "-$4,600", P(
  "Wide 16:9 on warm cream, right-hand side of a split scene, divider at the left edge, showing the "
  "plunging deep-teal line graph from the previous frame.", HIDDEN,
  "The card overlaps the lower-left of the right-hand half.", RIBBON, STYLE))

add(22, "4:42", "Right half only", "EVERYONE HAS AN OPINION", P(
  "Wide 16:9 on warm cream, right-hand side of a split scene, divider at the left edge. A man is seated "
  "at a plain round kitchen table with three featureless grey silhouette figures leaning in around him, "
  "one of them pointing off toward the left edge of frame. His expression is patient and closed.",
  SAMI, RIBBON, STYLE))

add(23, "4:58", "Right half only", "MOST PEOPLE SELL HERE", P(
  "Wide 16:9 on warm cream, right-hand side of a split scene, divider at the left edge. Very close view "
  "of a man's hand holding a smartphone, his thumb hovering just above a large rounded button on the "
  "screen without touching it. Only his hand and forearm are in frame, sleeve rolled to mid-forearm.",
  SAMI, RIBBON, STYLE))

add(24, "5:14", "Right half only", "HE DIDN'T", P(
  "Wide 16:9 on warm cream, right-hand side of a split scene, divider at the left edge. A man is placing "
  "a smartphone face-down on a plain table surface, hand still resting on top of it, looking away from "
  "it. Calm, deliberate posture.", SAMI, RIBBON, STYLE))

add(25, "5:28", "Right half only", "SAME $200. MORE SHARES.", P(
  "Wide 16:9 on warm cream, right-hand side of a split scene, divider at the left edge. No character. A "
  "single coin on the left with an arrow leading to a simple factory-and-shopfront icon on the right, "
  "from which a large pie-slice wedge is highlighted in deep teal. A small faded ghost outline shows a "
  "noticeably smaller wedge behind it for comparison.", RIBBON, STYLE))

add(26, "5:44", "Right half only", "IT FEELS LIKE A MISTAKE", P(
  "Wide 16:9 on warm cream, right-hand side of a split scene, divider at the left edge. A man is placing "
  "coins one at a time into an open bin marked with a small discount tag. His expression is grim and set, "
  "not triumphant, mouth in a flat line, shoulders low.", SAMI, RIBBON, STYLE))

add(27, "6:02", "Scoreboard -- CHECKPOINT 2", "YEAR 7", P(SCORE,
  "Heading strip reads YEAR 7. Left column headed with a small circular portrait of a man in a "
  "rust-terracotta t-shirt, TOTAL box outlined in brick red. Right column headed with a man in a "
  "deep-teal t-shirt, TOTAL box outlined in deep teal. Four filled line-item rows per column.",
  ADAM, SAMI, STYLE))

add(28, "6:16", "Full frame", "THE LINE CROSSED IN YEAR 5", P(
  "Wide 16:9 on warm cream. No characters. A single simple line graph carrying two lines -- one olive "
  "green rising in small even steps, one deep teal rising more steeply from below -- which intersect at "
  "a point roughly a third of the way along. The intersection is marked with a small thin charcoal "
  "circle and nothing else. Thin axis lines.", RIBBON, STYLE))

add(29, "6:30", "Right half only", "RECOVERY + CHEAP SHARES", P(
  "Wide 16:9 on warm cream, right-hand side of a split scene, divider at the left edge. No character. A "
  "deep-teal line rising back up to meet a horizontal dashed reference line, and above that dashed line "
  "a separate solid shaded block sitting on top of it, with a small bracket beside the block.",
  RIBBON, STYLE))

add(30, "6:46", "Left half only", "NEVER WENT DOWN", P(
  "Wide 16:9 on warm cream, left-hand side of a split scene, divider at the right edge. No character. A "
  "single olive-green vertical bar drawn with a solid outline but a faded, semi-transparent fill, "
  "standing alone with generous empty space around it and a thin baseline beneath.", RIBBON, STYLE))

add(31, "7:00", "Hidden cost card", "$31,000 BUYS $25,200", P(
  "Wide 16:9 on warm cream, left-hand side of a split scene, divider at the right edge, showing the "
  "faded olive-green bar from the previous frame.", HIDDEN,
  "The card overlaps the lower-left of the left-hand half.", RIBBON, STYLE))

add(32, "7:16", "Left half only", "HIS ACCOUNT DIDN'T. HIS MONEY DID.", P(
  "Wide 16:9 on warm cream, left-hand side of a split scene, divider at the right edge. A man stands "
  "between two identical shopping baskets seen from the side; the left basket holds six simple items and "
  "the right basket holds only three. He is looking down at the right-hand basket, brows drawn together.",
  ADAM, RIBBON, STYLE))

add(33, "7:32", "Full frame", "A RISK YOU SEE / A RISK YOU DON'T", P(
  "Wide 16:9 on warm cream. No characters. Two identical plain doors side by side on a flat wall, the "
  "left door carrying a small warning triangle sign at eye height, the right door completely blank. "
  "Thick outlines, soft floor shadows, generous empty space above.", RIBBON, STYLE))

add(34, "7:48", "Left half only", "HE'S NOT A CUSTOMER. HE'S A SUPPLIER.", P(
  "Wide 16:9 on warm cream, left-hand side of a split scene, divider at the right edge. A man hands a "
  "plain sack across to a featureless grey silhouette figure, who is already walking away to the right "
  "carrying a large sealed crate. The man watches them go, arms lowering, neutral expression.",
  ADAM, RIBBON, STYLE))

add(35, "8:02", "Full frame", "1.5% IN / 6-22% OUT", P(
  "Wide 16:9 on warm cream. No characters. A flat side-view diagram: one small coin entering the left "
  "side of a plain grey bank building via a thin arrow, and three much thicker arrows exiting the right "
  "side toward a simple car shape, a simple house shape and a rectangular card shape. The entering arrow "
  "is visibly thinner than any of the exiting arrows.", RIBBON, STYLE))

add(36, "8:17", "Scoreboard -- CHECKPOINT 3", "YEAR 10", P(SCORE,
  "Heading strip reads YEAR 10. Left column headed with a small circular portrait of a man in a "
  "rust-terracotta t-shirt. Right column headed with a man in a deep-teal t-shirt, and its TOTAL figure "
  "is shown struck through with a brick-red line and rewritten smaller directly beneath it. Neither TOTAL "
  "box is outlined.", ADAM, SAMI, STYLE))

add(37, "8:34", "Right half only", "AT THE BOTTOM: $52,000", P(
  "Wide 16:9 on warm cream, right-hand side of a split scene, divider at the left edge. No character. A "
  "deep-teal line graph with a single deep pronounced trough near the right, the area of the drop shaded "
  "with light diagonal hatching, and a small solid marker sitting at the lowest point.", RIBBON, STYLE))

add(38, "8:50", "Scoreboard", "$12,000 APART", P(SCORE,
  "Heading strip is blank. Both TOTAL figure boxes hold values of very similar magnitude, positioned at "
  "almost the same height, and neither box is outlined in any colour. A short horizontal bracket spans "
  "the small vertical difference between them.", ADAM, SAMI, STYLE))

add(39, "9:06", "Right half only", "WOULD YOU STILL BE HOLDING?", P(
  "Wide 16:9 on warm cream, right-hand side of a split scene, divider at the left edge. A man sits alone "
  "in three-quarter view holding a smartphone loosely in one hand, not looking at it, facing slightly "
  "toward the viewer with a completely neutral expression. Deliberately still, sparse composition.",
  SAMI, RIBBON, STYLE))

add(40, "9:24", "Split frame", "CERTAINTY + A SLOW LEAK  /  A BIGGER NUMBER, NO GUARANTEE", P(SPLIT,
  "Left half: a man standing perfectly upright and level on flat even ground, arms relaxed, composed. "
  "Right half: a second man mid-stride across visibly uneven, tilted ground with both arms out for "
  "balance, leaning forward.", ADAM, SAMI, STYLE))

add(41, "9:42", "Full frame", "NEITHER HAS CLEARLY WON", P(
  "Wide 16:9 on warm cream. No characters. A classic two-pan balance scale seen straight on, its beam "
  "almost perfectly level with only the faintest tilt, each pan holding a small stack of coins of nearly "
  "equal height. Thick outlines, generous empty space above.", RIBBON, STYLE))

add(42, "10:00", "Ledger Wall", "THE UNPLEASANTNESS IS THE PRICE", P(LEDGER,
  "A man stands side-on at the wall holding a piece of chalk, mid-motion drawing a heavy underline "
  "beneath a short line of chalk-style handwriting he has just written. Focused, calm expression.",
  KAREEM, RIBBON, STYLE))

add(43, "10:18", "Split frame", "PAID FOR WAITING  /  PAID FOR OWNING", P(SPLIT,
  "Left half: a man seated on a plain bench in three-quarter view, hands folded in his lap, waiting. "
  "Right half: a second man standing upright holding a rolled document with a small seal, chin level.",
  ADAM, SAMI, STYLE))

add(44, "10:34", "Full frame", "TWO POSITIONS. ONE QUESTION.", P(
  "Wide 16:9 on warm cream. No characters. Close view of a plain printed document showing two signature "
  "lines stacked one above the other, each with a small empty box beside it and thin grey ruled text "
  "lines above. The lower signature line carries a brick-red underline.", RIBBON, STYLE))

add(45, "10:52", "Ledger Wall", "LENDER OR OWNER?", P(LEDGER,
  "A man stands side-on at the wall drawing a hand-drawn rectangular box around a short line of "
  "chalk-style handwriting in the centre of the wall, chalk in hand, the rest of the wall left empty.",
  KAREEM, RIBBON, STYLE))

add(46, "11:17", "Scoreboard -- CHECKPOINT 4", "YEAR 30", P(SCORE,
  "Heading strip reads YEAR 30. Left column headed with a small circular portrait of a man in a "
  "rust-terracotta t-shirt, TOTAL box outlined in brick red. Right column headed with a man in a "
  "deep-teal t-shirt, TOTAL box outlined in deep teal and set in noticeably larger type than the left.",
  ADAM, SAMI, STYLE))

add(47, "11:34", "Full frame", "$359,300 APART", P(
  "Wide 16:9 on warm cream. Two vertical bars on a thin baseline: a short olive-green bar on the left and "
  "a deep-teal bar on the right that runs off the top edge of the frame. A very small figure of a man in "
  "an olive-green henley stands at the base of the tall bar, one hand shading his eyes, looking up.",
  KAREEM, RIBBON, STYLE))

add(48, "11:50", "Left half only", "$84,000 IN / $25,600 EARNED", P(
  "Wide 16:9 on warm cream, left-hand side of a split scene, divider at the right edge. No character. A "
  "single olive-green vertical bar divided by a horizontal line into a large lower section and a thin "
  "upper slice filled warm sand, with a small bracket and leader line labelling each part separately.",
  RIBBON, STYLE))

add(49, "12:04", "Left half only", "$71 A MONTH, ACROSS 30 YEARS", P(
  "Wide 16:9 on warm cream, left-hand side of a split scene, divider at the right edge. A man holds a "
  "single banknote up between finger and thumb at eye level, examining it with a completely flat, "
  "unimpressed expression, one eyebrow very slightly raised.", ADAM, RIBBON, STYLE))

add(50, "12:18", "Full frame", "HALF OF IT ARRIVED IN THE LAST 8 YEARS", P(
  "Wide 16:9 on warm cream. No characters. A single curve rising gently from the left and then steeply "
  "toward the right. Only the final right-hand third of the area beneath the curve is filled solid brick "
  "red; the rest is left unfilled. A thin bracket sits beneath the filled section.", RIBBON, STYLE))

add(51, "12:32", "Ledger Wall", '"SAMI GOT LUCKY."', P(LEDGER,
  "A man stands centred in front of the wall facing the viewer directly, arms folded across his chest, "
  "one eyebrow raised, mouth in a flat wry line.", KAREEM, RIBBON, STYLE))

add(52, "12:48", "Full frame", "AT 6%: $268,000", P(
  "Wide 16:9 on warm cream. No characters. The same two-bar composition as before -- a short olive-green "
  "bar and a taller deep-teal bar -- but the teal bar is now noticeably shorter and stays within frame. A "
  "horizontal dashed charcoal line above it marks the height it previously reached.", RIBBON, STYLE))

add(53, "13:04", "Left half only", "NEED IT IN 4 YEARS? ADAM IS RIGHT.", P(
  "Wide 16:9 on warm cream, left-hand side of a split scene, divider at the right edge. A man hands a "
  "small stack of banknotes across a low counter to a featureless grey silhouette figure. A simple wall "
  "clock hangs behind them with its hands near the top of the dial. His expression is settled and sure.",
  ADAM, RIBBON, STYLE))

add(54, "13:18", "Full frame", "ADAM'S DOWNSIDE IS THE BASE CASE", P(
  "Wide 16:9 on warm cream. No characters. Two probability-distribution shapes side by side: on the left "
  "a broad flat block shaded solid brick red across most of its width, on the right a tall narrow shape "
  "with only a very thin sliver at one end shaded brick red. A small label bracket beneath each.",
  RIBBON, STYLE))

add(55, "13:32", "Full frame -- BILAL ENTERS", "THERE WAS A THIRD MAN", P(
  "Wide 16:9 on warm cream. Two men stand together at the left and centre of frame, both turning to look "
  "toward the right. A third man is walking into frame from the right edge, mid-stride, only two-thirds "
  "of his body visible, calm unhurried expression.", ADAM, SAMI, BILAL, STYLE))

add(56, "13:46", "Scoreboard", "BILAL", P(SCORE,
  "The card now carries a third, visibly narrower column sliding in from the right edge, headed with a "
  "small circular portrait of a man in a warm sand-coloured shirt. Its line-item rows and TOTAL box are "
  "still empty. The two existing columns are unchanged.", ADAM, SAMI, BILAL, STYLE))

add(57, "14:00", "Right half only", "SCREENED OUT", P(
  "Wide 16:9 on warm cream, right-hand side of a split scene, divider at the left edge. A man holds a "
  "tall printed list in one hand, marking it with a pen in the other. Beside him a vertical column of six "
  "simple icons -- a bank building, a wine glass, playing cards, a cigarette, a missile, a masked face -- "
  "each struck through with a thin brick-red diagonal line.", BILAL, RIBBON, STYLE))

add(58, "14:14", "Full frame", "DEBT ABOVE 1/3 = EXCLUDED", P(
  "Wide 16:9 on warm cream. No characters. A simple office-block shape with its lower third filled solid "
  "brick red and the remainder left unfilled, a thin horizontal dashed line marking the one-third level, "
  "and a small cross mark beside the building.", RIBBON, STYLE))

add(59, "14:28", "Full frame", "MUDARABAH -- CAPITAL + WORK", P(
  "Wide 16:9 on warm cream. No faces. Overhead flat view of two open hands reaching in from opposite "
  "sides toward a single round bowl divided down the middle by a thin line, one half holding coins and "
  "the other half a small crossed hammer-and-wrench icon.", RIBBON, STYLE))

add(60, "14:38", "Scoreboard", "BILAL: $418,800", P(SCORE,
  "The narrow third column on the right is now fully populated, its line-item rows filled and its TOTAL "
  "figure shown. Its TOTAL box is outlined in warm sand. The centre column's TOTAL remains the largest "
  "figure on the card.", ADAM, SAMI, BILAL, STYLE))

add(61, "14:48", "Hidden cost card", "-$50,100. THE PRICE OF SCREENING.", P(SCORE,
  "The three-column card as before.", HIDDEN,
  "The card overlaps the lower-left corner of the third, sand-outlined column.", ADAM, SAMI, BILAL, STYLE))

add(62, "14:58", "Scoreboard", "+$309,200 AHEAD OF ADAM", P(SCORE,
  "All three TOTAL figures are visible. The third, sand-outlined column and the left-hand rust column are "
  "each additionally ringed with a thin charcoal line and joined by a horizontal bracket running between "
  "them across the front of the card, with a figure written above the bracket.", ADAM, SAMI, BILAL, STYLE))

add(63, "15:06", "Three-shot", "THE REAL CHOICE ISN'T SAMI vs BILAL", P(
  "Wide 16:9 on warm cream with no dividing line at all. Three men stand evenly spaced across the frame, "
  "all facing the viewer directly in relaxed neutral poses, arms at their sides, at the same scale and "
  "eye level, soft elliptical ground shadows beneath each.", ADAM, SAMI, BILAL, STYLE))

add(64, "15:14", "Ledger Wall -- END CARD", "Run the numbers. Then run them halal.", P(LEDGER,
  "The wall is now covered with completed chalk-style workings: bars, curves and numbers forming a "
  "finished calculation. A man stands centred in front of it facing the viewer with a confident open "
  "posture, chin level, arms relaxed at his sides, small closed-mouth smile. Generous empty space on "
  "both sides of him for end-screen cards.", KAREEM, STYLE))

# extras
EXTRAS = [
 ("R", "Cast reference sheet", "GENERATE THIS FIRST",
  P("Character reference sheet on a warm cream background. Four adult men stand side by side in a row in "
    "identical neutral poses, arms relaxed at their sides, front view, at identical scale and eye level, "
    "labelled left to right KAREEM, ADAM, SAMI, BILAL. All four share the same facial structure, head "
    "shape, build and warm medium skin tone, and are differentiated only by hair, facial hair and "
    "clothing colour. Soft elliptical ground shadows.",
    KAREEM, ADAM, SAMI, BILAL,
    "Flat 2D vector illustration, thick uniform dark-brown outlines, flat colour fill with soft cel "
    "shading, no gradients, no photographic texture. Warm cream background (#F5EFDC). Muted editorial "
    "palette: olive green, rust terracotta, deep teal, warm sand, charcoal grey, brick red accent. Clean "
    "modern explainer-video aesthetic. 16:9 horizontal. Consistent character design across all figures.")),
 ("T", "Thumbnail", "SAME $200.",
  P("Wide 16:9 composition on warm cream, split down the centre by a thin vertical charcoal line. Left "
    "half: a man in a rust-terracotta t-shirt shown from mid-thigh up, arms folded, confident, standing "
    "beside a short solid olive-green stack of banknotes reaching only to his knee. Right half: a man in "
    "a deep-teal t-shirt in the same pose and framing, calm, standing beside an enormous deep-teal stack "
    "of banknotes running off the top edge of the frame. A brick-red upward arrow beside the tall stack. "
    "Heavy negative space across the top third for three words of text.",
    ADAM, SAMI, STYLE)),
]

# ---------------------------------------------------------------- styles
def mk(name, **kw):
    base = dict(name=name, fontName="Helvetica", fontSize=9.5, leading=13.5,
                textColor=INK, alignment=TA_LEFT)
    base.update(kw)
    return ParagraphStyle(**base)

st_title   = mk("t", fontName="Helvetica-Bold", fontSize=27, leading=31, textColor=INK)
st_sub     = mk("s", fontSize=12.5, leading=17, textColor=GREY)
st_kicker  = mk("k", fontName="Helvetica-Bold", fontSize=8.5, leading=12, textColor=RUST)
st_h2      = mk("h2", fontName="Helvetica-Bold", fontSize=14, leading=18, textColor=INK)
st_body    = mk("b", fontSize=10, leading=14.5)
st_small   = mk("sm", fontSize=8.6, leading=12, textColor=GREY)
st_shotno  = mk("sn", fontName="Helvetica-Bold", fontSize=15, leading=17, textColor=colors.white)
st_meta    = mk("m", fontName="Helvetica-Bold", fontSize=8.4, leading=11.5, textColor=TEAL)
st_ost     = mk("o", fontName="Helvetica-Bold", fontSize=10.5, leading=14, textColor=INK)
st_prompt  = mk("p", fontName="Helvetica", fontSize=9.1, leading=13.2, textColor=INK)
st_lbl     = mk("l", fontName="Helvetica-Bold", fontSize=7.2, leading=10, textColor=GREY)

PW, PH = A4
M = 17 * mm

def deco(canv, doc):
    canv.saveState()
    canv.setFillColor(CREAM); canv.rect(0, 0, PW, PH, stroke=0, fill=1)
    canv.setFillColor(GREY); canv.setFont("Helvetica", 7.4)
    canv.drawString(M, 11 * mm, "DEEN & MONEY  ·  EPISODE 1  ·  IMAGE PROMPTS")
    canv.drawRightString(PW - M, 11 * mm, str(canv.getPageNumber()))
    canv.setStrokeColor(HAIRL); canv.setLineWidth(0.5)
    canv.line(M, 14.5 * mm, PW - M, 14.5 * mm)
    canv.restoreState()

doc = BaseDocTemplate(OUT, pagesize=A4,
                      leftMargin=M, rightMargin=M, topMargin=M, bottomMargin=20 * mm,
                      title="Deen & Money - Episode 1 Image Prompts",
                      author="Deen & Money")
doc.addPageTemplates([PageTemplate(id="n",
    frames=[Frame(M, 20 * mm, PW - 2 * M, PH - M - 20 * mm, id="f",
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)],
    onPage=deco)])

story = []
W = PW - 2 * M

def card(no, time, dev, ost, prompt, accent=TEAL):
    """One prompt card."""
    numcell = Table([[Paragraph(str(no), st_shotno)]], colWidths=[13 * mm], rowHeights=[13 * mm])
    numcell.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), accent),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ]))
    head_r = [Paragraph(f"{time} &nbsp;&nbsp;|&nbsp;&nbsp; {dev}", st_meta),
              Paragraph(f"ON SCREEN: <font color='#A6512F'>{ost}</font>", st_ost)]
    head_rt = Table([[p] for p in head_r], colWidths=[W - 13 * mm - 3 * mm])
    head_rt.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 3 * mm), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (0, 0), 0.6 * mm), ("BOTTOMPADDING", (0, 0), (0, 0), 1.2 * mm),
        ("TOPPADDING", (0, 1), (0, 1), 0), ("BOTTOMPADDING", (0, 1), (0, 1), 0),
    ]))
    head = Table([[numcell, head_rt]], colWidths=[13 * mm, W - 13 * mm])
    head.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))

    body = Table([[Paragraph("FULL PROMPT &mdash; COPY EVERYTHING BELOW", st_lbl)],
                  [Paragraph(prompt, st_prompt)]], colWidths=[W])
    body.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), BOXBG),
        ("BOX", (0, 0), (-1, -1), 0.6, HAIRL),
        ("LINEBELOW", (0, 0), (0, 0), 0.4, HAIRL),
        ("LEFTPADDING", (0, 0), (-1, -1), 3.5 * mm), ("RIGHTPADDING", (0, 0), (-1, -1), 3.5 * mm),
        ("TOPPADDING", (0, 0), (0, 0), 2 * mm), ("BOTTOMPADDING", (0, 0), (0, 0), 1.4 * mm),
        ("TOPPADDING", (0, 1), (0, 1), 2.4 * mm), ("BOTTOMPADDING", (0, 1), (0, 1), 3 * mm),
    ]))
    return KeepTogether([head, Spacer(1, 2.2 * mm), body, Spacer(1, 6.5 * mm)])

# ---- cover
story += [Spacer(1, 26 * mm),
          Paragraph("DEEN &amp; MONEY", st_kicker),
          Spacer(1, 3 * mm),
          Paragraph("Episode 1 &mdash; Image Prompts", st_title),
          Spacer(1, 2.5 * mm),
          Paragraph("The Saver, the Owner, and the 30-Year Gap", st_sub),
          Spacer(1, 9 * mm)]

intro = ("Every prompt in this document is complete and self-contained. The style block, the character "
         "blocks and the device templates from the series bible have already been written into each one, "
         "so there is nothing to look up and nothing to paste in. Copy a box, generate, move to the next.")
story += [Paragraph(intro, st_body), Spacer(1, 6 * mm)]

rows = [
    ["Shots", "64, plus a cast reference sheet and the thumbnail"],
    ["Runtime", "15:20"],
    ["Aspect", "16:9 horizontal (9:16 for Shorts &mdash; see note below)"],
    ["Geography", "Adam is ALWAYS on the left. Sami is ALWAYS on the right. Never swap."],
    ["Order", "Generate the cast reference sheet first, then shots 1&ndash;64 in order."],
]
t = Table([[Paragraph(f"<b>{a}</b>", st_small), Paragraph(b, st_small)] for a, b in rows],
          colWidths=[28 * mm, W - 28 * mm])
t.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LINEBELOW", (0, 0), (-1, -2), 0.4, HAIRL),
    ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ("TOPPADDING", (0, 0), (-1, -1), 2.2 * mm), ("BOTTOMPADDING", (0, 0), (-1, -1), 2.2 * mm),
]))
story += [t, Spacer(1, 8 * mm)]

story += [Paragraph("Three things before you start", st_h2), Spacer(1, 3 * mm)]
notes = [
    ("Pass the reference sheet as an image reference on every single shot.", "The written character "
     "block alone is not enough &mdash; text-only prompts drift on the beard, the collar and the shirt "
     "colour within about six frames. This is the most common way a series like this falls apart."),
    ("Generate in batches by device, not in story order.", "Do all the scoreboard cards together, then "
     "all the split frames, then all the Ledger Wall shots. Switching device types mid-batch increases "
     "drift."),
    ("For the three Shorts, re-render key frames vertically.", "Replace the phrase &ldquo;16:9 "
     "horizontal, cinematic composition with generous negative space in the upper third&rdquo; with "
     "&ldquo;9:16 vertical, characters centred, generous empty space in the upper third&rdquo;. Nothing "
     "else changes."),
]
for h, b in notes:
    story += [Paragraph(f"<b>{h}</b>", st_body), Spacer(1, 1.2 * mm),
              Paragraph(b, st_small), Spacer(1, 4 * mm)]

story += [PageBreak()]

# ---- extras
story += [Paragraph("BEFORE ANYTHING ELSE", st_kicker), Spacer(1, 2 * mm),
          Paragraph("Cast sheet &amp; thumbnail", st_h2), Spacer(1, 5 * mm)]
for no, dev, ost, pr in EXTRAS:
    story.append(card(no, "&mdash;", dev, ost, pr, accent=RUST))

story += [PageBreak()]
story += [Paragraph("THE EPISODE", st_kicker), Spacer(1, 2 * mm),
          Paragraph("Shots 1&ndash;64", st_h2), Spacer(1, 5 * mm)]

ACCENT = {"Scoreboard": SAND, "Hidden cost card": RUST, "Ledger Wall": OLIVE}
for no, time, dev, ost, pr in S:
    a = TEAL
    for k, v in ACCENT.items():
        if dev.startswith(k):
            a = v
    if "END CARD" in dev or "BILAL ENTERS" in dev:
        a = RUST
    story.append(card(no, time, dev, ost, pr, accent=a))

doc.build(story)
print("OK ->", OUT)
