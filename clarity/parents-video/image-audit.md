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
