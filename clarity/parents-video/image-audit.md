# Image audit — batch 1 (20 files, IMG_7501–IMG_7520)

Reviewed by eye against the scene pack's shot list, house style and face rule.
Files staged in `images/inbox/`; the six confident matches are filed under their
shot ids in `images/`.

## Filed

| Shot | File | Note |
|---|---|---|
| S02 | IMG_7511 | Exact. Closed book from above, five ribbons, raking light, five long shadows. Best of four candidates (7506, 7510, 7513 are the others). |
| S04 | IMG_7501 | Exact. Arched doorway, light flooding a dark interior. |
| S05 | IMG_7502 | Exact. Two grooves in a lintel merging into one. |
| S08 | IMG_7504 | Exact — but this is the **Track B alternate** (two bowls, one chipped), not the Track A hands. See the track question below. |
| S09 | IMG_7505 | Exact. Two pairs of sandals, large and small, on a lit step. |
| S116 | IMG_7507 | Exact. Open manuscript on a stand, lamp beside it, dark room. |

## Held in inbox — no slot in the 121

- **IMG_7518, IMG_7519, IMG_7520** — study circles, seated figures around a table.
  Nothing in the shot list is a group scene. 7519 and 7520 are near-duplicates of
  each other. Faces are rendered as black voids: inside the letter of the face rule
  ("features simply not rendered") but harsher than the pack's "smooth unmarked
  shape", and they read as ominous rather than deliberate.
- **IMG_7508** (hands fastening a sandal), **IMG_7509** (feet in sandals),
  **IMG_7515** (hands resting on an open book) — the pack's sandal and manuscript
  shots are all unpeopled. S09 is sandals with no feet; S61 is footprint wear with
  "no feet present".
- **IMG_7516** — books, lamp and spectacles together. The spectacles belong to
  S15's Track B alternate, but there they sit alone on folded cloth.
- **IMG_7512** — open spread with a hand-shaped shadow across it. Same plate as
  IMG_7514 with a hand added. 7514 (no shadow) is the usable one; kept as the
  spare for S117, the push into S116's page.
- **IMG_7517** — manuscript on a stand with what reads as a head-and-shoulders
  shadow falling across the pages. A cast human shadow is written into exactly one
  shot in the film, S71, and that one is a doorway threshold, not a book.
- **IMG_7503** — braided dry riverbed from above. Nearest is S54, which asks for
  earth "cracked into plates" rather than channels. Usable if you accept the
  change; not filed as an exact match.
- **IMG_7506, IMG_7510, IMG_7513** — ribbon/cord variants of S02. Kept as spares.

## Two findings that affect the whole film

**1. There are two styles in this batch, not one.** 7501, 7502, 7504, 7505, 7507,
7514 and 7516 are light watercolour on cream with the paper showing — the house
style as written. 7503, 7506, 7510, 7511, 7513, 7517, 7518, 7519 and 7520 are a
darker, denser, more digital ink render with heavy blacks. Cut together they will
read as two different films. Decide which sub-style is the channel's and re-run the
other half; the pack's own instruction is that a style break at minute 19 is more
visible than a weak image.

**2. Eleven of the twenty carry a generator watermark** — a small four-point
sparkle at the bottom right (7506, 7510, 7511, 7512, 7513, 7514, 7515, 7517, 7518,
7519, 7520). It is in the pack's negative prompt for a reason. Crop it out or
regenerate before these go anywhere near the edit; S02 as filed still has it.

## Open question — Track A or Track B

S08 arrived as its figure-free alternate. That is the Track B choice, and if it is
deliberate then 17 more shots need their alternates too. If it is not, S08 needs
the Track A version (two hands on a table, one old, one younger). Either is fine —
but it has to be one of them, and the decision changes what gets generated next.

---

# Image audit — batch 2 (10 files: IMG_7498–7500, seven `20260817_Original.jpeg`)

The seven files share one filename; they are staged as `ORIG_1`…`ORIG_7` in
`images/inbox/` (the mapping is by upload order, and each was identified by eye).

## Filed

| Shot | File | Note |
|---|---|---|
| S01 | IMG_7498 | Manuscript on a low stand, lamp at the right edge. The prompt puts the lamp *just outside* frame; it is inside here, by a little. Best S01 on hand. |
| S02 | IMG_7499 | Replaces IMG_7511. Same shot, light watercolour instead of the dark render — see the style note below. |
| S03 | IMG_7500 | Exact. Two olive canopies from one joined trunk, low sun behind the join. |
| S06 | ORIG_4 | Exact. A page caught mid-turn, light through the parchment, strokes never legible. |
| S08 | ORIG_1 | **Track A** — two hands on a table, one old, one younger, not touching. The Track B bowls also arrived (ORIG_2, IMG_7504), so both versions now exist. |
| S09 | ORIG_7 | Replaces IMG_7505. Same shot, lighter and more on-style. |
| S10 | ORIG_5 | Exact. Two cushions either side of a low table, lamp burning on it, seen from a doorway. |

## ORIG_3 must not be used as generated

Two hands on a table with **وقضى ربك set as calligraphy inside the picture**. The
image model rendered Arabic script. The pack rules this out in section 03, in
terms: the nine Quranic phrases are typeset in the editor, never generated,
because a model produces convincing-looking nonsense and on a channel called
Clarity in the Quran that is the error you do not come back from. The rendering
here happens to look well formed, and it is still not verifiable to a mushaf from
inside a generation. Two clean routes: crop the card out and keep the hands as an
S08 variant, or keep the plate and typeset C1 over it in the edit.

## The style question is now settled by weight of evidence

Batch 2 is entirely the light watercolour family — cream paper showing through,
loose translucent washes, ink line visible. That is the house style as written in
section 01. The dark, dense, heavy-black render (IMG_7503, 7506, 7510, 7511, 7513,
7517, 7518, 7519, 7520) is the outlier, and it is now outnumbered. Filed shots use
the light version wherever both exist; the dark ones stay in `inbox/` as alternates.

## Every delivered still is 1376×768

Measured with `imgsize.py`. Two consequences, and the second one is the expensive one:

1. **Under a 1080p timeline.** 768 lines has to come up to 1080 — a 1.4× upscale on
   every shot. Ink and wash survives that better than most looks, but it softens.
   The aspect is 1.792 rather than 1.778, so a ~1% crop squares it to 16:9.
2. **A re-frame cannot be cut from a 1376px plate.** A push into 40% of frame width
   leaves roughly 550px carrying a 1920px frame. There are 19 re-frame parents —
   S10 S19 S33 S48 S52 S57 S63 S69 S74 S80 S86 S90 S96 S101 S103 S109 S111 S116 S92
   — and two of them, **S10 and S116, are already filed at 1376px**. Either
   regenerate those two large, or drop their pushes and hold the wide.

The Higgsfield plates (S48, S69, S92 and the S01 control) are 2560×1440, which is
why the model choice was made on resolution per credit. Reserving those generations
for re-frame parents, and using the delivered 1376px stills for shots that are never
pushed into, costs nothing and solves most of this.

---

# Image audit — batch 3 (5 files, staged as `B3_*`)

## Filed

| Shot | File | Note |
|---|---|---|
| S04 | B3_af42d234 | **Upgrade over IMG_7501.** Dark interior, empty arched doorway, light falling in a long rectangle across the floor — the prompt exactly. IMG_7501 put trees and a landscape outside the door, which the shot does not ask for. |

## Not filed

- **B3_59c92eae** — the olive trees again, denser ink, sunset band behind. IMG_7500
  keeps S03: it has the low sun sitting in the join and a pale cream sky, which is
  what the prompt asks for.
- **B3_06a4039c** — the ribboned book again, three-quarter view. S02 says *seen from
  above*; IMG_7499 is the one that answers it.
- **B3_e5443cf5** — open book on a stand, lamp left, with **a painted vignette of a
  tree and a house on the page**. A picture inside the picture. The manuscript shots
  want ink strokes suggested and never legible, and nothing else on the paper; this
  reads as a storybook rather than a manuscript, and it would fight the Arabic cards.
- **B3_b203e278** — the lintel, rendered as **a photograph of a sheet of watercolour
  paper**: angled on a dark table, a second sheet visible at the top left, real paper
  grain, artwork bleeding off the edge. Every other still in the film is a flat plate
  seen straight on. Beautiful object, wrong convention — and an off-axis crop cannot
  be squared to 16:9 without losing the lintel. Straight-on or regenerate.

## Coverage is the finding, not the individual files

Three batches in, and thirty-five delivered images:

    CH.01   9/10   #########.     the wax seal, S07, is the only gap
    CH.02   0/8    ........
    CH.03   0/12   ............
    CH.04   0/14   ..............  ← the keystone. The uff sequence.
    CH.05   1/8    #.......
    CH.06   0/8    ........
    CH.07   1/10   #.........
    CH.08   0/9    .........
    CH.09   1/8    #.......
    CH.10   0/6    ......
    CH.11   1/8    #.......

Chapter 01 has now been generated four times over — four S02s, two S03s, three S05s,
two S04s — while chapter 04, which the pack calls the retention spine and says to
spend the budget on first, has nothing at all. The four singles outside chapter 01
are the Higgsfield style lock (S48, S69, S92) and S116.

The pack's generation order exists for this reason: style lock, then chapter 04,
then chapter 09, then S111, then everything else. Chapter 01 is the part of the film
the audience is least likely to leave during.

---

# Mechanical audit of the filed stills

By eye is not an audit. `audit_images.py` counts what section 01 states in
measurable terms: hue distribution against the five-colour palette, aspect,
resolution, and a bright-corner check. Composition, subject and the face rule
still need eyes — this says where to point them.

```
file               size     ar   navy ochre terra  sage  neut   OFF    sat   val corner  flags
S01.jpg     1376x768    1.792   42.8  32.0   7.6   0.0  13.8   3.8   0.43  0.46  0.00%  under-1080p
S02.jpg     1376x768    1.792   51.8  26.8   4.7   0.0  16.4   0.4   0.42  0.42 30.86%  under-1080p
S03.jpg     1376x768    1.792   18.8  32.8   4.9   1.7  41.4   0.4   0.20  0.68 30.95%  under-1080p low-navy
S04.jpg     1376x768    1.792   42.2  22.9  11.6   0.0  19.3   3.9   0.43  0.55  0.00%  under-1080p
S05.jpg     1376x768    1.792   42.2  35.2   4.6   0.0  16.1   1.9   0.36  0.51 34.59%  under-1080p
S06.jpg     1376x768    1.792   29.6  38.2   7.4   1.0  19.2   4.7   0.37  0.58 43.17%  under-1080p
S08.jpg     1376x768    1.792   19.1  60.8   6.5   1.0  11.8   0.9   0.34  0.70  0.00%  under-1080p low-navy
S09.jpg     1376x768    1.792   23.6  28.5   6.6   2.7  36.5   2.0   0.23  0.69  0.00%  under-1080p low-navy
S10.jpg     1376x768    1.792   24.0  55.2   6.0   0.5  11.9   2.4   0.36  0.64  0.00%  under-1080p low-navy
S116.jpg    1376x768    1.792   43.2  29.9   5.2   0.0  20.2   1.5   0.42  0.53 41.43%  under-1080p
```

**Palette holds.** Off-palette pixels run 0.4–4.7% on every filed still, so nothing
has drifted into a hue the pack excludes. Saturation sits at 0.20–0.43, well short
of the "saturated colours, neon" the negative prompt rules out. On this measure the
delivered work is consistent with the house style, both sub-styles included.

**Aspect is 1.792 on all ten, not 1.778.** A ~1% crop squares each to 16:9.

**Resolution fails on all ten.** 1376×768 against a 1080p timeline.

**Four plates are low-navy** — S03 (18.8%), S08 (19.1%), S09 (23.6%), S10 (24.0%) —
against 42–52% on S01, S02, S04, S05, S116. The pack asks for one warm source and
deep navy everywhere it does not reach. S03 is a daylight exterior and S09 a lit
step, so those are expected; **S08 and S10 are interiors that should be lamp-in-
darkness and are reading as generally lit rooms**. They will cut bright against
their neighbours. Not a reject — a grade note, or a regenerate if you want the
chapter to hold together.

**The bright-corner column is a hint, not a verdict.** It reports the share of the
bottom-right corner that is much brighter than its surroundings; the 30–43% readings
are the cream deckled margin, not a mark. The generator sparkle I flagged in batch 1
was found by eye and that remains the reliable check.

## What has been audited, and what has not

| Variable | How it was checked |
|---|---|
| Shot-to-timecode alignment | Mechanically, all 130 events — `build_timeline.py`, 18 checks |
| Prompt integrity | Mechanically — style suffix present once, no block glued onto another |
| Face rule in the prompts | Mechanically — negation-aware scan of all 101 |
| Face rule in the images | By eye, every delivered file |
| Palette, saturation, aspect, resolution | Mechanically — `audit_images.py` |
| Subject matches the shot | By eye, every delivered file |
| Arabic / lettering in frame | By eye — caught ORIG_3 |
| Watermarks | By eye — caught eleven in batch 1 |
| The four Higgsfield plates | **Not checked.** The proxy blocks that CDN, so they cannot be pulled here. They rendered in the widget; the pixel check on S48, S69, S92 and the S01 control is yours |
| The nine Arabic cards | **Not checked and not checkable here.** They need an Arabic-literate human against a mushaf |

---

# Image audit — batch 4 (5 files, staged as `B4_*`) — the keystone starts

## Filed

| Shot | File | Note |
|---|---|---|
| S35 | B4_2ce71f54 | Exact. Chaff turning in a shaft of warm light across a dark room. |
| S36 | B4_6ceef6d5 | Exact. Concentric ripples crossing water in a clay bowl, ochre reflection broken by them. |
| S37 | B4_e49518ba | Exact. Threshold stone worn into a dip at its centre, low and close. |
| S38 | B4_a6b2470f | Exact. Stack of flat stones, a pebble at the summit, one long navy shadow. |

## Held — B4_5f34f71d, the S33 flame

The subject is right: a flame leaning as though a breath had just crossed it. Two
things stop it being S33.

1. **It is cropped at the right edge.** Roughly half the frame is black ground and
   a corner of paper; the flame runs off the side. S33 is a re-frame parent — S34
   (7:56–8:10) holds on this same flame as it returns to vertical. You cannot hold
   on a flame that is half out of frame, and there is no crop that recovers it.
2. **It is the third plate rendered as a photograph of paper** rather than a flat
   plate, after the lintel in batch 3. It also measures **saturation 0.70**, the
   only still in the film past the 0.45 line — the photographic treatment pushes
   the ochres well beyond the palette's range.

This is the film's most important single image. Regenerate it flat, straight on,
flame centred with room above it, and at 2560×1440 so S34's hold has pixels.

## Chapter 04 measured

    S35   navy 39.9  val 0.52
    S36   navy 25.2  val 0.58
    S37   navy 22.7  val 0.70   low-navy
    S38   navy  7.8  val 0.88   low-navy

S38 is the brightest plate in the film so far, and its prompt does ask for a plain
cream ground, so this is not a fault in the generation. It is a sequencing problem:
the uff run is meant to tighten and darken, and as filed it opens at 0.52 and ends
at 0.88 — it gets lighter as it goes. Either grade S38 down in the edit, or place it
where a bright beat helps rather than fighting the sequence.

---

# Image audit — batch 5 (7 files, staged as `B5_*`) — chapter 04 to 11/14

All seven filed: S39, S40, S41, S42, S43, S44, S45. Subjects are right in every
case and the face rule holds — S42's two courtyard figures are small, hooded and
featureless, S40 and S45 are hands only. Three notes, one of which is a real miss.

| Shot | File | Note |
|---|---|---|
| S39 | B5_3ef56578 | Scales, one grain, that pan sunk all the way down. Subject exact. **Ground is wrong** — see below. |
| S40 | B5_afd38c20 | Hand stopped flat on a closed door. Two deviations, below. |
| S41 | B5_d2e3fcc6 | Exact. Lid ajar, one thin line of steam, embers under. The escape is the subject. |
| S42 | B5_43bfdfcf | Exact staging — seated figure lit in the alcove, the other angled toward the door. Off-palette 6.9%, the highest in the film. |
| S43 | B5_b5e82601 | Exact. Hairline crack reading as a thin navy line across an unbroken vessel. |
| S44 | B5_c6547ed4 | Exact. One thread standing proud of the weave, disturbing the pattern around it. |
| S45 | B5_23c5e1a7 | Exact. Bone-white cloth offered on two open palms, cropped at the wrist. |

**S39's ground contradicts its prompt.** The shot asks for "warm ochre rim light,
deep navy ground". What arrived is a pale cream ground — navy 11.7%, value 0.86,
62.6% of the frame effectively neutral paper. That is S28's treatment, the level
scales in chapter 03, and having both scales shots on cream removes the contrast
between them. This is the one filed image whose lighting is not what was asked for.

**S40 shows the whole forearm** where the prompt crops at the wrist, and the door
is a panelled one with a round brass knob. The film's other door, S92, is a heavy
plank door with a drawn bolt. Neither is fatal on its own; together they place this
frame a few centuries and one continent from its neighbours.

**S42 is 6.9% off-palette**, the highest reading in the film — the courtyard wash
runs blue-green rather than the olive-sage the palette allows. Gradeable.

## Chapter 04 is getting brighter as it goes

    S35 0.52 · S36 0.58 · S37 0.70 · S38 0.88 · S39 0.86 · S40 0.65
    S41 0.56 · S42 0.53 · S43 0.66 · S44 0.86 · S45 0.72

Seven of the eleven filed plates sit at or above 0.65. The two darkest — S41, the
pot with its escaping steam, and S42, the two figures at dusk — are the two shots
about withdrawal, which is right. But the chapter as a whole is meant to tighten
and close in, and the run currently opens dark, brightens to 0.88 twice, and never
settles. Worth a grade pass across the chapter before the edit locks.

---

# Image audit — batch 7 (35 files, staged as `B7_*`) — 32 filed, 3 held

The big one. Chapters 05 through 10 largely land in this batch, and chapter 10 is
now complete. **64 of 101 stills are done; 37 pending.**

Filed: S54 S55 S56 S57 S59 S60 S61 S62 S63 S65 S67 S68 S72 S73 S74 S76 S77 S78 S80
S82 S83 S84 S86 S88 S89 S90 S103 S105 S106 S107 S108 S109.

Standouts: S77 (the cell reduced to scattered blocks with the mat half-buried under
stone), S78 (dust in the shaft over the rubble), S88 (the lamp in the room that is
not abandoned), S105 (the wing curved down over the nest), S108 (the covered form,
no head or limb showing — exactly as written).

## Held

- **B7_188e6d54 — S79, the peg rail.** Every peg occupied, one garment on the floor:
  the idea is right. The garments are a **denim jacket, a tote bag and a bobble
  hat**. "Modern clothing in ancient scenes" is in the negative prompt. Regenerate.
- **B7_9aac66d2 — S66, the two manuscript pages.** Both pages carry **drawn
  illustrations** (a tree, a walled town) and rows of pseudo-script. The manuscript
  shots are written as ink strokes only, never legible, nothing else on the paper.
  It is also shot as a photograph of paper on a table with a blurred background.
- **B7_14613e9c — a lit doorway interior.** Handsome, but it is not S71: that shot
  needs the long shadow of a standing figure cast across the threshold with the
  figure outside frame. The shadows here are cast by the door leaves.

## Filed with notes

- **S56** shows the back of the head; the prompt crops at the neck with no head in
  frame. No face is visible, so the rule holds, but it is not the written framing.
- **S63** is a **thatched English cottage with a coach lamp**. Together with S40's
  panelled door and brass knob, S46's handled cup and shade lamp, and S95's panelled
  door, the film has a recurring drift into a Victorian-European domestic register.
  These read fine alone and wrong next to S62's camel at the gate.
- **S82** arrives **matted and framed**, with a white mount border around the plate.
  Crop to the artwork before use.
- **S57, S60, S89** continue the **photograph-of-paper** treatment — artwork bleeding
  off the sheet, blurred table behind. Five plates now use it against fifty-odd flat
  ones. Pick one convention.
- **S89** has a hand setting the cup down; the prompt has no hand in frame.

## The aggregate is now the finding: the film is drifting bright

Across all 61 filed stills:

    navy share   mean 28.2%   ·  30 of 61 under 25%
    value        mean 0.63    ·  16 of 61 over 0.70
    brightest    S57 0.93 · S38 0.88 · S44 0.86 · S39 0.86 · S80 0.85
    darkest      S109 0.38 · S98 0.41 · S65 0.42 · S02 0.42 · S01 0.46

Section 01 says one warm source, deep navy everywhere it does not reach. **Half the
film is not doing that.** Individually each bright plate is defensible — cream ground
is in several prompts. Together they change what the film feels like: it reads as
daylight illustration rather than a lamp in a dark room, and the plates that do hold
the navy (S01, S02, S98, S109) will look like a different film cut against them.

This is a grade, not a regenerate. One pass that lifts navy density and pulls value
down on the 30 low-navy plates would bring the film back to its own stated look, and
it costs nothing but an afternoon in the edit.

Off-palette above 4%: S06 4.7 · S40 4.0 · S41 4.9 · S42 6.9 · S61 4.1 · S65 6.5 ·
S90 4.1. All gradeable, none worth regenerating.

---

# Image audit — batch 8 (10 new, 5 duplicates skipped) — 74/101

Chapters 05 and 10 are complete; chapter 03 opens at 7/12. Five files in this drop
were byte-identical repeats of S54, S55, S56, S57 and S59 and were skipped by the
ingest, not re-filed.

Filed: S26 S27 S28 S29 S30 S31 S32 S50 S51 S52. All ten match their prompts. The
severed rope (S52) and the loaded thread (S29) are the two strongest images in the
film so far — S29 in particular is doing something the prompt only implied, letting
the sag carry the whole weight of *wahnan 'ala wahn*.

## The brightness drift has reversed

    batch 8 alone   navy mean 37.7%   value mean 0.56
    whole film      navy mean 29.5%   value mean 0.62

Batch 7 pulled the film's average toward daylight; this batch pulls it back. S29 is
71.9% navy, S30 54.0%, S32 44.6%, S27 41.7% — the four darkest plates outside the
supplication shots. Only S50 and S51 came in under 25% navy, and both are prompts
that ask for abundance and open earth. Whatever changed between the two runs, keep it.

## Two small notes

- **S32's lamp is burning bright** where the prompt says it is burning low with the
  flame small and the last warm light on the book's fore-edge. It is also a glass-
  chimney lamp — the fourth plate in that Victorian register, with S40, S46 and S63.
- **S28's scales are a European balance**, the same object as S39's. That is at least
  internally consistent between the two scales shots, which matters more than the
  period, since the pair is a deliberate rhyme.

## What is left — 27 shots

    CH.01  S07
    CH.02  S12 S13 S14 S15 S16 S17 S18 S19     ← the whole chapter
    CH.03  S21 S22 S23 S24 S25
    CH.04  S33                                  ← the flame, still needed flat and large
    CH.06  S66     CH.07  S71     CH.08  S79 S85     CH.09  S101
    CH.11  S111 S113 S114 S115 S118 S119 S120    ← the whole closing chapter bar one

Chapter 02 and chapter 11 are the two blocks left. S111 is the one with no acceptable
second version: a road, a mound, a horizon, and no person of any kind.

---

# Image audit — batch 9 (5 files, staged as `B9_*`) — chapter 03 complete, 79/101

Filed: S21 S22 S23 S24 S25. Chapter 03 is now whole.

**S23 is the pick.** The concentric read — mat, swept ring, courtyard wall, track
leaving for open country — is exactly the widening circle the chapter argues for,
and it is legible in one second from directly above. **S25** (the old palm and the
shoot from the same ground) is the other one that needs no defence.

## Notes

- **S21's pages carry cursive script.** The prompt says a single line of ink
  suggested near the top edge, strokes only, never legible. What arrived reads as
  handwriting — one page appears to end in a question mark. It is Latin-ish scribble
  rather than Arabic, so it is not the error section 03 warns about, but it is the
  same species of it: a model writing something that looks like words. At Shorts
  scale nobody reads it; at 1080p on a 30-minute film, someone will try. Also
  off-palette 5.9%, and the light above the pages is a modern fitting.
- **S22's chain reads as more than five links.** The shot is built on the count —
  one larger link and four that follow, for the five verses. Worth counting on the
  full-size file before it is locked; if it is six or seven, the image is making a
  different point from the narration.
- **S24 is a European cobbled lane** with a panelled door and a buckled rucksack.
  Fifth plate in that register, after S40, S46, S63 and S32.
- **S22 is the sixth photograph-of-paper plate** — torn sheet on a dark ground.

## What is left — 22 shots, two blocks and seven singles

    CH.02  S12 S13 S14 S15 S16 S17 S18 S19    the whole chapter, 8 shots
    CH.11  S111 S113 S114 S115 S118 S119 S120 the closing run, 7 shots
    singles  S07 · S33 · S66 · S71 · S79 · S85 · S101

Chapter 02 is the one that has had nothing from the start. It is also the chapter
that establishes who the verse is watching — the empty chair, the cooling tea, the
walking stick, the still hands — so it carries the film's quietest and most
object-led run. Every one of its eight shots is still life; none is hard.

---

# Image audit — batch 10 (5 files, staged as `BA_*`) — 84/101

Filed: S14 S15 S16 S17 S18. Chapter 02 opens at 5/8, missing only S12, S13 and S19.

**S15 is the best hands plate in the film.** Palms up and open in a lap of undyed
cloth, fingers slightly curled, entirely still — the papery dry-brush skin is doing
the work the prompt asked for and nothing else is in the frame competing with it.
S16's two mats, one rolled and tied and one still lived-in, reads instantly.

## Notes

- **S18 has the head in frame.** The prompt crops at the neck with no head in shot;
  here the crown is cut by the top edge instead. No face is visible — the rule holds
  — but it is not the written framing, and the whole point of that crop is that the
  viewer supplies the person.
- **S14's cup has a handle** and the courtyard beyond has potted plants on cobbles.
  The shot is "a single clay cup of tea".
- **S17 is an Italian courtyard** — tiled roofs, arched windows, rendered facades.

## The register split is now the film's largest open question

Counting what has been filed, the film is running two settings at once:

    Ancient Near East, unambiguous     S23 S25 S26 S27 S54 S62 S68 S72 S73 S74
                                       S77 S78 S80 S82 S84 S86 S90 and the
                                       Higgsfield plates S48 S69 S92
    European / Victorian domestic      S14 S17 S18 S24 S28 S32 S39 S40 S46 S63 S95
    Neutral objects, reads either way  most of the rest

That is roughly eleven plates against twenty. The neutral majority is why it has not
broken yet — but S62's loaded camel at a gate and S63's thatched cottage with a coach
lamp are four minutes apart, and S24's cobbled lane sits in the same chapter as S25's
date palm.

The script is deliberately universal — it argues the verse through domestic objects
any viewer recognises — so a timeless-Mediterranean register is a legitimate choice.
What is not legitimate is running both. Two ways to settle it:

1. **Commit to the Near East.** Regenerate the eleven. Costs eleven images and makes
   the film consistent with its subject and with the strongest plates already made.
2. **Commit to timeless-domestic.** Keep the eleven, regenerate the camel and the
   date palm to something less locating, and accept that the film looks like a
   European folk tale about a Quranic verse.

Option 1 is the one the pack implies and the one that protects the film's authority
with the audience most likely to share it. Either way it needs deciding before the
edit, because it is invisible shot by shot and obvious in a cut.

---

# Image audit — batch 11 (5 files, staged as `BB_*`) — 88/101, one hard hold

Filed: S12 S13 S119 S120. Chapter 02 is complete but for S19.

**S12 is the plate chapter 02 was waiting for.** The elderly figure from behind under
a bone-white shawl, back of the covered head to camera, one shaft from a high window
across an otherwise black room — 52.9% navy, value 0.46, and the face rule satisfied
by the framing the prompt actually asked for rather than by a crop. **S13**, the stick
propped by the doorway with the handle darkened by decades of hands, is nearly as good
and sits squarely in the film's Near-Eastern register.

## HOLD — BB_14b442f3, the S07 seal: it carries a pentagram

The bronze seal is pressed into the wax exactly as written, and its face is engraved
with a clear **five-pointed star**. The prompt says the seal's face is "a plain
geometric device with no letters" — a pentagram is technically a geometric device and
is the single worst one available here. On a channel called Clarity in the Quran, a
five-pointed star inside a circle reads as occult to a meaningful part of the audience,
and it will be screenshotted before it is explained.

This is the same class of error as the generated Arabic in ORIG_3: not a craft fault,
a credibility fault, and one that no grade fixes. Regenerate with a plain device — a
circle within a circle, a simple radial fan, a plain boss with no star and no letters.
It also measures 6.2% off-palette, the joint-highest in the film.

## Notes on what was filed

- **S120 does not deliver its idea.** The prompt is a lamp still burning at dawn with
  its flame *gone pale and thin* against growing daylight — the point being that the
  lamp is being outshone. What arrived is a bright modern hurricane lantern dominating
  a lit room, flame strong. It is a good picture of the wrong beat, and it is the
  film's second-to-last image. Worth regenerating when there is budget.
- **S119 sits on an open book page** — seventh plate in the photograph-of-paper
  convention, after S22, S57, S60, S66, S82, S89.
- **S13 is low-navy at 22.0%** but the shot is a lit doorway wall, so it reads.

## 13 left

    S07  S19  S33  S66  S71  S79  S85  S101  S111  S113  S114  S115  S118

Four of those are holds needing a regenerate rather than a first attempt — S07 (the
pentagram), S33 (the flame, cropped), S66 (illustrated pages), S79 (modern clothing).
The genuinely unstarted ones are S19, S71, S85, S101, S111, S113, S114, S115, S118.

---

# Image audit — batch 12 (5 files, staged as `BC_*`) — 92/101

Filed: S111 S113 S114 S115. Chapter 11 is 7/8.

## S111 passes the one rule that had no second version

Checked deliberately and slowly, because the pack says this is the shot to discard
and regenerate if anything at all appears in it. The frame contains **an empty stony
road, a low unmarked mound of earth and stones at its verge, dry tussocks, two low
hills and a wide cream horizon.** No person. No figure. No animal. No structure. No
shadow that could be read as someone standing outside frame. No light-from-the-sky
device. It is a road and a horizon, exactly as written.

It is also 6.4% navy and value 0.81 — the second brightest plate in the film. That is
what its prompt asks for (pale cream sky, warm ochre low light along the ground) and
it is the right instinct for the beat, but it is worth knowing that the film's most
carefully constrained shot is also one of its most open and bright.

**S115** is the counterweight: 45% navy, value 0.48, the lit window carrying the only
warm light in a black wall. Chapter 11 alternates between them well.

## HOLD — BC_2fd64692, the S118 table: chopsticks

Structurally it is exactly right — four settings, three laid with food, one kept clean
and empty, which is precisely what the shot asks for and it reads instantly. But the
settings are laid with **chopsticks on woven mats under a pendant lamp**. The film has
a loaded camel at a gate in chapter 06. This is not a near-miss of period like the
brass doorknob; it relocates the scene to a different continent, and it is the last
domestic image before the closing prayer.

Regenerate with the same composition — the empty place is the whole idea and this
version nails it — and the settings as flatbread, dates and a cup.

## 9 left

    regenerate  S07 (pentagram) · S33 (flame cropped) · S66 (illustrated pages)
                S79 (modern clothing) · S118 (chopsticks)
    unstarted   S19 · S71 · S85 · S101

Nine images from a finished set, and five of them are re-dos of shots that arrived
with one specific thing wrong rather than shots that were never attempted.
