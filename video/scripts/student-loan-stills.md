# Student-loan stills — how each scene was generated

Two models, on purpose.

**33 object scenes — `z_image`, text prompt only, 0.15 credits each.**
Blocks, bars, staircases, the balance scale, the ledger panel, the machine box.
No character appears in them, so there is nothing for a sheet to hold steady and
the cheap model is the right one.

**13 character scenes — `nano_banana_pro`, with the character sheet attached as
an image reference, 2 credits each.**

| Scenes | Reference |
|---|---|
| 4, 17, 25, 34, 45 | `media/character-sheets/kareem.png` |
| 12, 24, 28, 38 | `media/character-sheets/adam.png` |
| 5, 31 | `media/character-sheets/institution.png` |
| 27, 30 | `media/character-sheets/cast-lineup.png` |

These thirteen were generated **twice**. The first pass used `z_image` from the
pack's prompt text alone, which is exactly what the pack warns against: "Prompt
text alone drifts within about five generations; the beard shape goes first."
There was no sheet in the repo to attach at the time. Once the sheets arrived
they were re-run against them, and the manifest points at the second pass.

`z_image` cannot take a reference at all — it is text-only — which is why the
character scenes moved model rather than just gaining an input.

## Sami and Bilal have no expression sheet

Only the four-hand lineup shows them, so both are drawn from it. That is why
scene 27 is mid-shot and scene 30 is strictly from behind: the pack's rule, and
it holds until someone generates them a 4-expression sheet matching Kareem's
layout.

## Getting the files

The container that generated these cannot reach the Higgsfield CDN — the network
policy answers 403 to CONNECT — so only URLs are recorded:

    ./scripts/fetch-stills.sh ~/student-loan-stills
    npm run ingest:studentloan -- ~/student-loan-stills studentloan

## Still unverified

Nothing in this session has seen any of these frames. Worth an eye on:

- **scene 19** — the thumbnail, and the 40% reveal.
- **scenes 22 and 23** — the descending and ascending staircases must rhyme:
  identical framing, block width and camera distance, direction the only change.
  The pack is explicit that if they don't, the reveal doesn't land.
- **scene 30** — Bilal's face must not be visible from any angle.
- **scene 5 and 31** — the clerk must have no face.
