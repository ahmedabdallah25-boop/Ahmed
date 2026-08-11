# Thumbnail Prompts — the three remaining long-form videos

Card-format 16:9 plates for every long-form video on the channel that does not
have one. The format, the audit behind it and the shipped worked example are in
`student-loan-thumbnail-prompts.md`; the mandatory rule is in `CLAUDE.md`.

## Read this before generating anything

**A thumbnail cannot fix these videos.** `bvZ3NdPKsus` has 2 views,
`WJ_UhugwA9U` has 10, `7TWUwpbl83U` has 2. At those numbers there are almost no
impressions to convert — a better plate raises click-through on impressions that
are not being served. `channel-reset.md` also measured packaging rewrites to live
videos at **zero, three separate times**, and concludes "no packaging was written
to any live video, and none should be."

These are still worth making, for two reasons that do not depend on CTR. Every
video over 180s is *required* to have a 16:9 plate and two of these have nothing
house-consistent. And the plates are the template for long-form going forward,
where they meet impressions from the start. Treat them as inventory, not rescue.

**`WJ_UhugwA9U` has a bigger problem than packaging — see the last section.**

---

## Audit of the existing long-form thumbnails

Only `bvZ3NdPKsus` has a custom plate. Five candidates were made
(`media/thumbs/ep2-*.png`) and option C shipped. Reviewed here directly.

**All five share a house it does not live in.** Near-black background, and a
green / red / gold palette. The channel's videos are flat vector on warm cream
`#F7EFDD` with rust `#B5603F` and dark brown `#3D2B23`. So the thumbnail and the
video it opens look like two different channels — the tile makes a promise about
the visual experience that the first frame breaks.

**None has a face or an object.** All five are pure type-and-bar data slabs. That
is the single largest gap against the format vidIQ runs.

Individually:

- **C, shipped** — *10 YEARS OF PAYMENTS / PAID £175,377 / STILL OWE £184,811 /
  YOU OWE MORE THAN YOU PAID.* Four stacked text blocks where the format wants
  three elements, and the gold bottom line only restates the two rows above it.
  At a 168px browse width, two long £ figures and four rows turn to mush. It also
  **argues against its own title**: the title promises *How to Buy a House
  Without Ever Paying Interest*, a how-to, and the plate delivers a grievance.
- **B — the strongest of the five, and nobody noticed.** *INTEREST ON A £250,000
  MORTGAGE* small, then a huge `£188,443`, then *THAT'S A SECOND HOUSE*. That is
  label → hero number → payoff, which is vidIQ's card content almost exactly. It
  is missing only the face, the card and the palette. **The channel already found
  half the formula and shipped a different option.**
- **D** — two bars and four figures. Too dense; the densest of the set.
- **E** — *3 WAYS TO BUY WITHOUT INTEREST* with murabaha / ijara / musharaka in
  outlined pills. The pills are the right instinct — they are badges — but three
  of them, all unfamiliar Arabic terms, is three unknowns in the tile.
- **A** — the only one with an illustration (a house split red/green) and a gold
  `0% RIBA` pill. *RIBA* as the largest word is a problem: a browser who does not
  know the term learns nothing, and the repo's own editorial rule already keeps
  *riba* out of titles because the English SERP belongs to the Royal Institute of
  British Architects.

**Carried forward:** B's number and B's payoff line, in the card format, on the
house palette, with a face. That is video 1 below.

---

## The shared template

Identical on all three — the face is brand furniture and does not vary, which is
the point of it. Only the card's three strings and Adam's expression change.

- **LEFT 40%** — Adam, extreme close-up, hard-cropped off the left and bottom
  edges, looking right into the card. Short brown side-parted hair, clean-shaven,
  rust red `#B5603F` t-shirt. Attach `media/character-sheets/adam.png` as an
  image reference if the generator can reach it.
- **RIGHT 55%** — one white rounded card, dark brown `#3D2B23` outline, flat drop
  shadow down-right. Inside: a **small charcoal label**, then a **huge number**
  that is the largest object in the picture. A rust `#B5603F` pill badge clipped
  over the top-right corner.
- Cream `#F7EFDD` ground, flat. `house-style.md`'s standard negative prompt.
- **The card's text never repeats the title.** It carries the half the title left
  out.

Every figure below is the video's own, taken from its script or its published
description. **Do not invent a number for a thumbnail** — if a video has no
figure of its own, the card gets a word, not a fabricated statistic.

---

## 1 — `bvZ3NdPKsus` · "How to Buy a House Without Ever Paying Interest" · 10:18

Card: **INTEREST ALONE** / **£188,443** / **↑ A SECOND HOUSE**
Expression: **WORRIED**

Both the figure and the badge line are lifted from the channel's own option B,
which already had the right content in the wrong container. The title carries the
fix, so the card carries the cost — they complete each other instead of competing.

> **Currency flag.** `next-slate.md` rule 0.5 says default to `$` and reserve `£`
> for genuinely UK-only mechanisms; mortgages are not UK-only. But the video's
> arithmetic is in £ and a thumbnail must not contradict its own video, so £
> stands here. The fix belongs upstream, in the next video's script.

```
A YouTube thumbnail. Flat 2D vector illustration, clean modern editorial style.
Even-weight dark brown #3D2B23 outlines on every shape. Flat colour fills with
only soft minimal shading. No gradients, no glow, no film grain. Warm cream
#F7EFDD background, flat and uncluttered. Wide 16:9 composition, two zones:

LEFT 40%: an extreme close-up head-and-shoulders portrait of a young man, drawn
very large so his head fills most of the left zone and his shoulders run off the
bottom and left edges of the frame. Short brown side-parted hair, clean-shaven,
fair skin, rust red #B5603F t-shirt. His face is simple and flat: solid dark dot
eyes, fine curved eyebrows drawn together and raised in the middle, a small
downturned mouth, a minimal single-line nose. He looks worried, turned looking
right towards the card.

RIGHT 55%: one large clean WHITE rounded-rectangle card, like a printed mortgage
statement, standing upright and filling most of the right side, with a crisp
even-weight dark brown #3D2B23 outline and a simple flat charcoal drop shadow
offset down and right. Stacked and left-aligned inside it with generous margins:
  - a SMALL label at the top reading INTEREST ALONE in charcoal grey #5A5A5A capitals
  - beneath it, in ENORMOUS heavy black-brown #3D2B23 type filling most of the
    card, the figure £188,443 — the single biggest element in the whole picture
  - clipped onto the top-right corner of the card and overlapping its edge, a
    small solid rust red #B5603F rounded pill badge containing a small upward
    arrow and the words A SECOND HOUSE in cream #F7EFDD capitals

All wording perfectly spelled and crisp. The only text in the picture is
INTEREST ALONE, £188,443, and A SECOND HOUSE. The man and the card never overlap.
Bold, simple, high contrast, readable shrunk to a small browse tile.

Avoid entirely: 3D render, photorealistic, photograph, realistic skin texture,
low-poly, depth of field, blurred background, gradient mesh, airbrushed shading,
painterly brush strokes, sketchy lines, variable line weight, film grain, harsh
dramatic lighting, deep cast shadows, extra fingers, distorted hands, cluttered
background, busy detail, neon colours, oversaturated, blurry, low resolution,
misspelled words, garbled lettering, duplicated text, extra paragraphs of small
text, house icons, keys, calculators, stock charts, logos, watermarks.
```

---

## 2 — `WJ_UhugwA9U` · "Your Savings Account Is Costing You $359,000" · 17:56

Card: **INTEREST, 30 YEARS** / **$25,600** / **↓ WORTH LESS**
Expression: **WORRIED**

The title already spends `$359,000`, so the card must not. `$25,600` is the
sharper number anyway and the video states it plainly: that is everything the
savings account paid across three decades, about **$71 a month**. Small enough to
feel like a mistake, which is the click.

The badge is the video's own conclusion — after inflation he ends with *less
buying power than the day he started*. Down-arrow, not up: this is the one plate
in the set where the payload falls.

> A gift here: the saver in the video **is named Adam**. The thumbnail face and
> the character are the same person, so the tile is a still from the argument
> rather than a decoration on it.

```
A YouTube thumbnail. Flat 2D vector illustration, clean modern editorial style.
Even-weight dark brown #3D2B23 outlines on every shape. Flat colour fills with
only soft minimal shading. No gradients, no glow, no film grain. Warm cream
#F7EFDD background, flat and uncluttered. Wide 16:9 composition, two zones:

LEFT 40%: an extreme close-up head-and-shoulders portrait of a young man, drawn
very large so his head fills most of the left zone and his shoulders run off the
bottom and left edges of the frame. Short brown side-parted hair, clean-shaven,
fair skin, rust red #B5603F t-shirt. His face is simple and flat: solid dark dot
eyes, fine curved eyebrows drawn together and raised in the middle, a small
downturned mouth, a minimal single-line nose. He looks worried and deflated,
turned looking right towards the card.

RIGHT 55%: one large clean WHITE rounded-rectangle card, like a printed bank
statement, standing upright and filling most of the right side, with a crisp
even-weight dark brown #3D2B23 outline and a simple flat charcoal drop shadow
offset down and right. Stacked and left-aligned inside it with generous margins:
  - a SMALL label at the top reading INTEREST, 30 YEARS in charcoal grey #5A5A5A capitals
  - beneath it, in ENORMOUS heavy black-brown #3D2B23 type filling most of the
    card, the figure $25,600 — the single biggest element in the whole picture
  - clipped onto the top-right corner of the card and overlapping its edge, a
    small solid rust red #B5603F rounded pill badge containing a small DOWNWARD
    arrow and the words WORTH LESS in cream #F7EFDD capitals

All wording perfectly spelled and crisp. The only text in the picture is
INTEREST, 30 YEARS, $25,600, and WORTH LESS. The man and the card never overlap.
Bold, simple, high contrast, readable shrunk to a small browse tile.

Avoid entirely: 3D render, photorealistic, photograph, realistic skin texture,
low-poly, depth of field, blurred background, gradient mesh, airbrushed shading,
painterly brush strokes, sketchy lines, variable line weight, film grain, harsh
dramatic lighting, deep cast shadows, extra fingers, distorted hands, cluttered
background, busy detail, neon colours, oversaturated, blurry, low resolution,
misspelled words, garbled lettering, duplicated text, extra paragraphs of small
text, piggy banks, coins, calculators, stock charts, logos, watermarks.
```

---

## 3 — `7TWUwpbl83U` · "Your Money Only Exists Because Someone Else Is In Debt" · 5:17

Card: **OF ALL MONEY** / **97%** / **↑ IS DEBT**
Expression: **WORRIED**

The video's own description carries the figure — *"why 97% of it is debt a
central bank openly admitted to"* — and the 2014 Bank of England admission is the
video's spine at 1:18. The title states the mechanism, so the card supplies the
scale, which is the half a viewer cannot guess.

This is the shortest card in the set and the strongest at tile size: two
characters and a percent sign, where the others carry six or seven glyphs.

```
A YouTube thumbnail. Flat 2D vector illustration, clean modern editorial style.
Even-weight dark brown #3D2B23 outlines on every shape. Flat colour fills with
only soft minimal shading. No gradients, no glow, no film grain. Warm cream
#F7EFDD background, flat and uncluttered. Wide 16:9 composition, two zones:

LEFT 40%: an extreme close-up head-and-shoulders portrait of a young man, drawn
very large so his head fills most of the left zone and his shoulders run off the
bottom and left edges of the frame. Short brown side-parted hair, clean-shaven,
fair skin, rust red #B5603F t-shirt. His face is simple and flat: solid dark dot
eyes, fine curved eyebrows drawn together and raised in the middle, a small
downturned mouth, a minimal single-line nose. He looks worried and uneasy, turned
looking right towards the card.

RIGHT 55%: one large clean WHITE rounded-rectangle card standing upright and
filling most of the right side, with a crisp even-weight dark brown #3D2B23
outline and a simple flat charcoal drop shadow offset down and right. Stacked and
left-aligned inside it with generous margins:
  - a SMALL label at the top reading OF ALL MONEY in charcoal grey #5A5A5A capitals
  - beneath it, in ENORMOUS heavy black-brown #3D2B23 type filling almost the
    entire card, the figure 97% — by far the single biggest element in the whole
    picture, drawn as large as the card allows
  - clipped onto the top-right corner of the card and overlapping its edge, a
    small solid rust red #B5603F rounded pill badge containing a small upward
    arrow and the words IS DEBT in cream #F7EFDD capitals

All wording perfectly spelled and crisp. The only text in the picture is
OF ALL MONEY, 97%, and IS DEBT. The man and the card never overlap. Bold, simple,
high contrast, readable shrunk to a small browse tile.

Avoid entirely: 3D render, photorealistic, photograph, realistic skin texture,
low-poly, depth of field, blurred background, gradient mesh, airbrushed shading,
painterly brush strokes, sketchy lines, variable line weight, film grain, harsh
dramatic lighting, deep cast shadows, extra fingers, distorted hands, cluttered
background, busy detail, neon colours, oversaturated, blurry, low resolution,
misspelled words, garbled lettering, duplicated text, extra paragraphs of small
text, banknote stacks, coins, vaults, calculators, logos, watermarks.
```

---

## Setting them, once generated

```
set-thumbnail.yml
  video_id = bvZ3NdPKsus | WJ_UhugwA9U | 7TWUwpbl83U
  url      = <the plate on the generator's CDN>
```

Dispatch from the default branch. Resize and the sub-2MB encode are handled in
`automation/set_thumbnail.py`.

---

## `WJ_UhugwA9U` has about 80 seconds of duplicated audio

Found while pulling the figures above, and it outranks everything else in this
file.

The transcript repeats a block. The Bilal introduction runs once from **12:44**
— *"There was a third man. Bilal. Same age, same 58,000 salary…"* — through the
screening explanation at 13:46. Then at **14:01** it starts again: *"base case.
There was a third man, Bilal. Same age, same 58,000 salary, same 12,000 saved,
same 200 a month…"* and re-runs the same screening explanation through roughly
15:09. The line *"And finished with less buying power than he started with"*
also appears at both 12:30 and 13:51.

So a viewer who reaches minute 13 hears the same ninety seconds twice. The video
holds **7.22% average view percentage** — about 78 seconds of a 17:56 runtime —
which means most viewers quit long before the repeat, and it is not the cause of
that number. But it is a defect in the master, it makes the video unrecoverable
without a re-cut, and it means no packaging work on this video is worth doing
until the file is fixed.

**This is read off the published transcript, not the audio, and the master is not
in the repo** — `media/` has no savings-video file, so it could not be checked
here. A caption-track artefact would produce the same transcript without any
defect in the video. Scrub the published video from 12:40 to 15:10 before acting;
it takes a minute and settles it either way. If the repeat is real, re-cut and
re-upload, and do no packaging work on the current file.
