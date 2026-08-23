# Revelation-order plates — build state

180 plates (90 scenes x line/wash) for the flagship, from
`media/clarity/export/clarity-image-prompts.txt`.

**Status: 3 of 180 generated.** The ElevenLabs workspace hit its free-plan
daily image cap. Everything below is settled and does not need re-deriving.

## The generator

ElevenLabs' creative connector *does* generate images — `creative_generate_image`,
on a flow canvas, across FLUX / Imagen / Seedream / GPT-Image / Recraft.
Flow used for the pilots: `V4OmY5CnwxDEpMnzq6li`.

Two limits shape everything:

- **No model exposes a `seed`.** Checked flux-2-pro, gemini-3-pro-image,
  bytedance-seedream-5-pro — every image model takes only `aspect_ratio` and
  `resolution`, plus an `images` reference port. So the prompt file's primary
  mechanism (same seed across a seed_group) **cannot be used at all**.
- **No model exposes a `negative_prompt`.** The file's NEGATIVE block cannot be
  passed as a negative. FLUX's guide is explicit that negatives are unsupported
  and that you must describe what you want. The block has therefore been folded
  into positive prose as a fixed guard clause (see below).

## The guard clause

Appended to every prompt, replacing the NEGATIVE block:

> The scene is completely unpeopled and unlettered: bare landscape, architecture
> and objects only, every surface blank. The painting is anonymous and unsigned,
> its margins and all four corners left as clean bare parchment, free of any
> signature, monogram, initials, maker's mark, caption or calligraphy.

The second sentence is not optional. **The first pilot without it painted an
artist's monogram into the bottom-right corner** — a generated glyph, which the
file forbids outright and which the channel's public "AI BE AWARE" position
cannot carry. With the clause, the corner came back clean parchment.

## Pass order is INVERTED from the manifest script

`automation/clarity_plate_manifest.py` says: if there is no seed, generate the
wash first and use it as a reference for the line pass. **That is backwards, and
it was tested.** See `media/clarity/plates/revelation-order/`:

- `S002-wash.png` — flux-2-pro. Correct in every respect: style, palette,
  unpeopled, clean corners. This is the standard.
- `S002-line-kontext.jpg` — the line pass derived from that wash via
  flux-1-kontext. Beautiful clean line, but **it does not register**: the cave
  arch, rock placement and foreground are all redrawn, and it returned
  1392x752 against the wash's 1920x1072. Cross-dissolving these is a cut
  between two different drawings.
- `S002-line-derived.png` — the same line pass extracted mechanically from the
  wash instead (divide-blend + threshold). Registers *perfectly* — identical
  dimensions, every contour in place — but recovers the wrong medium: in a
  heavily washed plate the pen line and the dark wash are not separable by
  luminance, so it reads as a woodcut, not a pen drawing.

The conclusion those three force: **generate the line pass first, then add the
wash on top of it.** Stripping colour requires inventing line where there was
only wash; adding wash over an existing line drawing leaves the line where it is.
`plates-generation-ready.json` is ordered that way — `order: 1` is the line pass
(flux-2-pro, the file's own prompt), `order: 2` is the wash (flux-1-kontext,
`connect_from` the scene's line node).

**This inversion is reasoned, not yet tested** — the daily cap hit before the
wash-over-line pilot could run. Run one scene and check registration before
committing to the other 89.

## Cost

At measured pilot rates: 90 line x 272.7 credits + 90 wash x 242.4 credits
= 46,359 credits, about **$4.64** for the full set. Runtime ~27s per plate.

`generations_count` **must be set to 1** on every call — it defaults to 4, which
would quadruple both cost and output.

## Output sizes

flux-2-pro at 1080p returns 1920x1072 (aspect 1.791), not a clean 1920x1080.
Plan on a small crop or scale in the edit. Kontext does not take a resolution
parameter and returned 1392x752, so its output needs upscaling to match.

Generated PNGs run ~4MB each; 180 of them is ~750MB. The repo is already
395MB of git plus 330MB of media, and `media/clarity/frames/` stores JPEGs at
40-140KB. **Convert the plates before committing them** — do not commit 180 PNGs.
