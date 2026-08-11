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

Read off three of their thumbnails directly (screenshots, 2026-08-11). They run
**two distinct templates**, not one.

**Template 1 — face + card.** The one to copy.

1. **The face is always LEFT**, hard-cropped at the left edge, occupying ~40%,
   lit, looking into frame. Same person, same hand-on-chin quizzical pose every
   time — it is brand furniture, not an expression choice.
2. **A white rounded card with a soft drop shadow floats on the right**, holding
   *all* of the text. It is styled as a real interface object — a stats panel, a
   verified tweet. **This is the signature device.** It is what makes the claim
   read as evidence. Text loose on the background does not do this.
3. **Inside the card: a small label above a huge number.** "Views" small, "499K"
   enormous — the number is the single biggest object in the picture.
4. **One pill badge clipped to the card's edge**, saturated: a green "27x", a red
   STOP octagon. Small, and never more than two.
5. **The background is dark and blurred**, so the white card and the lit face
   both pop off it.

**Template 2 — no face.** A full-width condensed black caps headline across the
top (*YOUR VIDEO ISN'T DEAD*, four words), one wrecked hero object dead centre (a
shattered YouTube play button, debris falling), and faint pale bar charts behind
labelled "-48h" and "Now". The payload word carries a hand-drawn red double
underline and a hand-drawn black arrow. Near-white background.

Their highest-breakout uploads all put a **specific number** somewhere: *The
9-Minute Algorithm Hack* (20.84 breakout), *NEW Channel in 2026* (34.07), *First
100 Subscribers* (26.18). The number is the hook; the face supplies the stakes;
the card supplies the proof.

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

**The background is cream `#F7EFDD`, so white type is invisible.** Line 1 is dark
brown; the payload line is knocked out of a solid rust block, which is what
survives being shrunk to a browse tile.

| Option | Line 1 (dark brown `#3D2B23`) | Line 2 (cream on rust `#B5603F` block) |
|---|---|---|
| 1 | PAID 6 YEARS | IT GREW |
| 2 | 6 YEARS PAID | BALANCE UP |
| 3 | THE DEBT | GREW ANYWAY |

Inter / Montserrat Bold 800, uppercase, ~150px on a 1080-tall frame, tight
leading, sitting in the third opposite the subject. Option 1 is the pick — it
carries the number, it is the shortest, and "IT GREW" points at the rising arrow
so the type and the picture say the same thing.

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

---

## GENERATED — 2026-08-11, Higgsfield `nano_banana_pro`

Option A, rendered 16:9 at 2752×1536. Two passes: a clean plate with the text
zone left empty, and a finished version with the overlay set by the model. The
composition was corrected from the draft above — the draft put the arrows *and*
the text both on the right, which collides. Shipped split is **face left half /
arrows lower-right / type upper-right**.

| # | Job ID | Text | URL |
|---|---|---|---|
| 1 | `033130d8-ccd6-42a6-a423-5a299d4c31ff` | PAID 6 YEARS / IT GREW | `hf_20260811_071306_033130d8-…png` |
| 2 | `223539c5-bef4-4526-94f3-ea16adaba357` | PAID 6 YEARS / IT GREW | second variant |
| 3 | `48c402de-9d06-4d16-aa87-f97abdc0d278` | clean plate, no text | `hf_20260811_071126_48c402de-…png` |
| 4 | `b8190c2d-af0b-4d6a-9383-10d90325357c` | clean plate, no text | `hf_20260811_071126_b8190c2d-…png` |

### Second pass — the card layout *(this is the one to ship)*

The first four were designed against an **inferred** reading of vidIQ's format,
before their thumbnails had actually been looked at. Seeing them corrected three
things: the text belongs **inside a white card**, not loose on the background;
the **number is the hero object**, not a word inside a headline; and the face
belongs on the **left**, looking into the card.

Regenerated to match. Adam left 40%, hard-cropped, worried, looking right into a
large white statement card with a `#3D2B23` outline and a flat drop shadow. Inside
the card: the label **PAID** small in charcoal, the number **6 YEARS** enormous,
and a rust `#B5603F` pill badge reading **↑ IT GREW** clipped to the top-right
corner. Reading order is *paid / six years / it grew* — the whole video in three
beats.

| # | Job ID | URL |
|---|---|---|
| 5 | `ad711907-da3a-4002-b4e4-d28c3e0f756c` | `hf_20260811_071907_ad711907-…png` |
| 6 | `1d4dd58b-aecd-4557-a91b-52fae2669119` | `hf_20260811_071907_1d4dd58b-…png` |

All at `https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/`.

### Which of the two, and why

**Variant 5 (`ad711907`) ships.** Both rendered the wording cleanly — `PAID`,
`6 YEARS` and the `↗ IT GREW` badge are all correctly spelled and correctly
placed, badge clipped over the card's top-right corner as specified — but they
are not equal:

| | 5 `ad711907` | 6 `1d4dd58b` |
|---|---|---|
| Hair | **brown, side-parted — Adam** | black — not Adam |
| Grain | none | visible noise over the flat colour |
| Face crop | hard against the left edge | inset, dead cream down the left |
| Face scale | larger, brow reads at tile size | smaller |

The hair decides it on its own. `house-style.md` gives Adam *short brown
side-parted hair*; variant 6 rendered him black-haired, which is Sami's and
Kareem's colouring and breaks the cast on a channel whose whole visual grammar
is that named people are consistent. The grain is the second disqualifier — the
style guide bans it outright ("on flat colour it reads as compression
artefact"), and variant 6 has it.

**What is imperfect in the shipping plate, and worth fixing on the next pass:**

- The outlines vary in weight in places; the house rule is even-weight
  throughout.
- The background carries a soft vignette rather than flat `#F7EFDD`.
- There is idle cream between Adam's shoulder and the card. vidIQ leaves no such
  gap — either the face or the card should grow into it.
- `PAID` will disappear at browse size. Acceptable, since `6 YEARS` and the rust
  badge are the payload and both hold, but it means the label is decoration.

None of these are worth a reroll against a scheduled publish. They are the note
for the next thumbnail.

**One deliberate departure from vidIQ:** they run the face template on a *dark
blurred* background so the white card and the lit face pop. This channel's ground
is cream `#F7EFDD` and that is brand furniture worth more than the extra pop, so
separation is carried by the card's brown outline and flat drop shadow instead.
If the card turns out to disappear into the cream at browse size, darkening the
background behind the card is the first thing to try.

**Two constraints hit while generating, both environmental, both worth knowing
before the next run:**

- **Adam's character sheet could not be attached.** `media/character-sheets/adam.png`
  had to be described in prompt text instead — this session's network policy
  blocks `upload.higgsfield.ai`, so the reference upload 403s at the proxy.
  Identity therefore comes from the written description (short brown side-parted
  hair, clean-shaven, rust red `#B5603F` t-shirt, dot eyes, brows drawn together
  and raised). Check the render against the sheet before shipping. For a single
  frame this is acceptable; for a multi-scene pack it is not.
- **The results could not be pulled back into the repo.** The Higgsfield CDN is
  blocked by the same policy, which is also why the text had to be baked in by
  the model rather than composited locally with exact typography.

### To ship it

1. Download the chosen variant from the Higgsfield gallery.
2. **Downscale to 1280×720** and save under 2MB. The render is 2752×1536 (1.79:1,
   marginally wide of 16:9) — resize to 1280×720 rather than letterboxing, the
   ~1% crop is invisible.
3. Save as `media/student-loan-thumb.jpg`.
4. Add `"thumbnail": "media/student-loan-thumb.jpg"` to `automation/part17.json`
   — **only after the file exists**, or preflight fails on the dangling path.
5. Part 17 is already uploaded and scheduled, so set it on the live video with
   `monitor_ep2.py`'s `thumbnails().set` rather than re-uploading.

## If you only make one

Make **A** with overlay option 1. It is the only one that fills all four vidIQ
slots — face, two words plus a number, one device, clean separation — and the
only one whose picture states the mechanism without the text. B is the safe
fallback if Adam's close-up won't hold at 16:9. C is the interesting test, not
the launch asset.

## Also worth doing

Ship a **9:16 1080×1920 crop of the same plate** for the channel's Videos tab and
for search on mobile. Same artwork, recomposed — do not letterbox the 16:9.
