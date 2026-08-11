# Thumbnail Prompts — Part 17, "Is Your Student Loan Halal?"

**Read the format note first. It is the reason this file exists.**

## Format: 16:9, not 9:16

Part 17 runs **226.94s (3:47)**. YouTube's Shorts cap is 180s, so this is **not a
Short** — it publishes as a regular long-form video and its thumbnail is rendered
in **16:9 slots**: home feed, search, suggested, the channel's Videos tab.

A 9:16 plate in a 16:9 slot gets pillarboxed. The image collapses to a narrow
centre strip with dead bars either side, and it loses to every neighbour in the
row. Every previous thumbnail note in this repo (`inflation-thumbnail-prompts.md`
and the "design for the 160px grid" rule) was written for Shorts and **does not
apply here**.

- **Primary asset: 1280×720, 16:9.** Under 2MB, JPG or PNG. This is the one that
  matters.
- Generate at 1920×1080 and downscale — generators compose better at 16:9 than
  they crop to it.
- `automation/part17.json` has no `thumbnail` key. `upload_ep2.py` and
  `preflight.py` both read one; add it once the file exists, not before —
  preflight fails on a key pointing at a missing file.
- Part 17 is already uploaded and scheduled private, so the thumbnail has to be
  set on the existing video (`monitor_ep2.py` does a `thumbnails().set`), not on
  a fresh upload.

---

## Audit — what the comparison set actually does

Two vidIQ calls landed before the free-plan credits ran out on 2026-08-11; the
thumbnail images themselves could not be fetched (the session proxy 403s
`i.ytimg.com`). What follows is read off titles, durations and breakout scores,
plus vidIQ's own published catalogue.

### The vidIQ channel's format (`UCZLFu8bHbwtnIgWLg5UtINw`)

Their top long-form is remarkably uniform, and it is a **four-slot** layout:

1. **A face, cut out, huge** — one unambiguous emotion, occupying a third to a
   half of the frame, pushed to one side and bleeding off the bottom edge.
2. **Two to four words** in the opposite third. Heavy sans, all caps, two colours
   — white for the setup, one saturated accent for the payload word.
3. **One graphic device.** A red arrow, a ring, a strike-through, or a single
   big number. Never two.
4. **A flat saturated background** so the cutout separates cleanly.

The text never overlaps the face, and it never repeats the title — it carries the
half of the promise the title left out. Their highest-breakout uploads all put a
**specific number** in one slot or the other: *The 9-Minute Algorithm Hack*
(20.84), *How to Create a NEW YouTube Channel in 2026* (34.07), *First 100
Subscribers* (26.18). The number is the hook; the face supplies the stakes.

### The student-loan long-form set

The raw breakout leaders are local-news desks — WFMJ at 4240, WFMY at 960, WUSA9
at 101 — winning on a policy news cycle with generic broadcast stills. Nothing
transferable: that is topicality, not packaging.

The two that are transferable:

- **Ramsey Show Highlights**, *"My Wife's Student Loan Debt Is $175,000 (She
  Didn't Finish College)"* — 100K views, 3.1% engagement, the highest in the set.
  A face plus one exact number.
- **Millionaires in Medicine**, *"RAP vs SAVE: New Student Loan Plan Explained"* —
  96 breakout on an 890-subscriber channel. A two-sided comparison frame.

Both agree with vidIQ: **one number, one emotion, one comparison.** No stock
graduation caps, no scattered dollar signs, no calculators.

### Translating that to a faceless channel

Finance % Decoded has no presenter face, but it is not faceless in the vidIQ
sense — the house cast *has* faces (`house-style.md`: dot eyes, curved brows,
simple mouth). **Adam in his WORRIED expression is this channel's face slot.**
Use him, from his character sheet, at close-up scale the in-video framing never
uses. That is the single biggest change from every prior thumbnail on this
channel.

Flat vector is an advantage in a 16:9 row: big flat shapes and hard `#3D2B23`
outlines survive downscaling in a way soft renders don't.

---

## Rules for these three

1. **Two elements maximum.** A face and one device. Not three.
2. **The picture carries the argument; the text only confirms it.**
3. **The text does not repeat the title.** The title already says *Is Your Student
   Loan Halal? (You Never Touched What You Owe)*. The thumbnail's job is the
   number and the direction — the balance going **up** while payments go out.
4. **Text is added in the editor, never in the prompt.** Every generator mangles
   lettering, and `house-style.md`'s negative prompt bans it outright.
5. **Attach Adam's character sheet** as an image reference on any prompt
   containing him (`media/character-sheets/`). Prompt text alone drifts inside
   five generations.

### Text overlay options

| Option | Line 1 (white `#F7EFDD`) | Line 2 (accent) | Accent |
|---|---|---|---|
| 1 | 6 YEARS PAID | BALANCE UP | rust `#B5603F` |
| 2 | HE PAID EVERY MONTH | IT GREW | rust `#B5603F` |
| 3 | THE DEBT | GREW ANYWAY | rust `#B5603F` |

Inter / Montserrat Bold 800, uppercase, ~150px on a 1080-tall frame, tight
leading, heavy soft drop shadow, sitting in the third opposite the subject.
Option 1 is the pick — it is the only one carrying a number.

---

## NEGATIVE PROMPT — all three

Use `house-style.md`'s standard negative prompt verbatim, plus:

```
graduation cap, mortarboard, diploma, scroll, university crest, dollar sign,
currency symbol, calculator, percentage sign, stock chart, candlestick chart,
padlock, chains, ball and chain
```

---

## OPTION A — THE RISING BALANCE *(recommended)*

The vidIQ formula translated exactly: face left, device right, number in the
text. Adam supplies the emotion, the two arrows supply the mechanism, and a
viewer understands "he is paying and it is going up" before reading a word.

```
Flat 2D vector illustration, clean even-weight dark brown #3D2B23 outlines, flat
colour fills with soft minimal shading, warm cream #F7EFDD background. Wide 16:9
composition. On the LEFT third, a close-up head-and-shoulders portrait of a young
man with short brown side-parted hair, clean-shaven, fair skin, wearing a rust
red #B5603F t-shirt, drawn large and cropped so his shoulders run off the bottom
edge of the frame; his expression is worried — brows drawn together and up, small
downturned mouth, solid dot eyes. He is looking to his left, towards the centre
of the frame. In the CENTRE-RIGHT, two bold simple arrows drawn in the same flat
vector language: a SMALL rust red #B5603F arrow pointing down and away, and
beside it a MUCH LARGER charcoal grey #5A5A5A arrow sweeping steeply upward and
off the top-right corner, roughly three times the size of the red one. Stark
size difference between the two arrows, high contrast, bold simple shapes
readable when shrunk to a small tile. No text, no numbers, no symbols. Simple
flat drop shadow offset down-right. Right third kept clean and uncluttered for a
text overlay.
```

## OPTION B — THE CROSSOVER

Scene 19's registered thumbnail frame, recomposed for 16:9 and with Adam added —
the scale alone is a diagram, and a diagram without a face loses the browse row.
Weaker than A small, because the scale's beam is a thin element, so draw it bold.

```
Flat 2D vector illustration, clean even-weight dark brown #3D2B23 outlines, flat
colour fills with soft minimal shading, warm cream #F7EFDD background. Wide 16:9
composition. On the RIGHT third, a close-up head-and-shoulders portrait of a
young man with short brown side-parted hair, clean-shaven, fair skin, wearing a
rust red #B5603F t-shirt, drawn large and cropped so his shoulders run off the
bottom edge, expression worried — brows drawn together and up, small downturned
mouth, solid dot eyes, looking towards the centre of the frame. In the CENTRE and
LEFT, a large simple two-pan balance scale drawn bold with thick beams, standing
on a simple ground line. On its left pan a small neat stack of rust red #B5603F
coin discs of fixed size; on its right pan a single solid charcoal grey #5A5A5A
block clearly larger and heavier, with three small charcoal squares falling onto
it from above. The beam tips down decisively to the right. High contrast, bold
simple shapes. No text, no numbers. Simple flat drop shadow offset down-right.
Upper-left area kept clean for a text overlay.
```

## OPTION C — THE TWO GRADUATES

The comparison frame that carried *RAP vs SAVE*, and the video's sharpest and
least-expected claim: the one who earns less pays longer and pays more. Test it
second — it is the most interesting and the hardest to read at small size.

```
Flat 2D vector illustration, clean even-weight dark brown #3D2B23 outlines, flat
colour fills with soft minimal shading, warm cream #F7EFDD background. Wide 16:9
composition, symmetrical split with a thin vertical dark brown #3D2B23 dividing
line down the exact centre. On the LEFT half, a young man with short brown
side-parted hair, clean-shaven, fair skin, rust red #B5603F t-shirt and camel
#B8823C trousers, standing full-figure beside a SHORT stack of charcoal grey
#5A5A5A blocks that reaches only to his knee; his expression is resolved — calm,
level brows, small straight mouth. On the RIGHT half, a man with short dark hair
and a dark beard with grey speckling, medium-tan skin, teal #2F6B72 t-shirt and
charcoal trousers, standing full-figure beside a TOWERING stack of the same
charcoal grey #5A5A5A blocks rising well above his head and off the top of the
frame; his expression is worried — brows drawn together and up, small downturned
mouth. Both figures drawn at the same scale and standing on the same simple
ground line, both large enough to read clearly at small size. Stark contrast
between the two block stacks. No text, no numbers. Simple flat drop shadows
offset down-right. Clean cream space along the top edge for a text overlay.
```

---

## If you only make one

Make **A** with overlay option 1. It is the only one that fills all four vidIQ
slots — face, two words plus a number, one device, clean separation — and the
only one whose picture states the mechanism without the text. B is the safe
fallback if Adam's close-up won't hold at 16:9. C is the interesting test, not
the launch asset.

## Also worth doing

Ship a **9:16 1080×1920 crop of the same plate** for the channel's Videos tab and
for search on mobile. Same artwork, recomposed — do not letterbox the 16:9.
