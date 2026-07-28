# The viral-reel workflow, applied to Episode 01

Method borrowed from MoSidd's *"I Made This Viral Reel Using ONLY Remotion &
Claude Code"* (`youtu.be/xOhh274Ayac`). His build starts from a blank page —
voice lines, then an asset sheet, then scenes. Ours starts from an **already
rendered Short**, so step 1 is recovering the storyboard out of the render
instead of writing it. Everything after that is his sequence, unchanged.

## What was wrong with the original

Measured, not guessed — per-row temporal variance across all 60 seconds
(`std` of each pixel row over 60 sampled frames):

| Rows | Content | Moves? |
|---|---|---|
| 0–393 | empty beige | never |
| 394–566 | headline "The Moment Most People Quit" | never |
| 567–655 | empty beige | never |
| **656–1263** | **the chart** | **yes** |
| 1264–1462 | empty beige | never |
| 1463–1504 | "Would YOU still be holding?" | never |
| 1505–1569 | empty beige | never |
| 1570–1588 | "Full story — Deen & Dinar · Episode 1" | never |

**68% of the frame never changed.** The story lived in a 607px letterbox, the
narration was burned in at ~24px (unreadable at phone size), and the first three
seconds opened on a static page — nothing moved, so there was nothing to stop a
scroll.

## The steps

### 1. Storyboard — recovered, not written

MoSidd's rule: no more than five or six voice lines, ~5s each, and the
storyboard rides entirely on the voiceover. That storyboard already existed
inside the render as the burned caption track, so it was extracted rather than
rewritten:

- crop rows 1140–1290 at 10fps → 600 strips
- within one spoken line the glyph mask never changes, only the amber highlight
  moves — so hashing the binarised mask segments the strips into ~30 distinct
  lines using no OCR at all
- OCR once per line, upscaled 3x (RapidOCR, models bundled in the wheel —
  HuggingFace is blocked on this network, so Whisper was not an option)
- the amber run marks the spoken word, which pins each line's **start and end
  frame** to the original audio

`tools/build_beats.py` does all three passes. Its line text is then
**hand-corrected** in `src/beats.ts` against the pill crops: 24px type OCRs at
maybe 90% word accuracy, and at 112px a dropped word is more damaging than no
caption. Line boundaries are used as measured; within a line, words are spread
by length, which tracks speech closely enough for the highlight to land.

### 2. Scene choreography

Seven scenes, one per story beat, each with its own push, origin and drift
direction. Alternating pan direction matters — every scene pushing the same way
reads as a slideshow.

Layout is built around the platform safe areas: the bottom ~250px stays clear
because TikTok, Reels and Shorts all put their own UI there, which is why the
caption block ends around y=1550 rather than filling to the edge.

### 3. Asset sheet

Nothing to collect. The chart *is* the asset; the treatment layers (grain,
scanlines, vignette) are generated, not sourced.

### 4. Remotion project

> Set up a Remotion project for a vertical documentary reel, 1080x1920 at 30fps,
> with motion helpers: posterize time, boil, and a ping-pong entrance.

`src/theme.ts` — `posterize()`, `boil()`, `gateWeave()`, `easeOutExpo()`.

### 5. Film treatment

> Build a film treatment look: 1.6px black scanlines at 16%, a texture sandwich
> of two grain passes at different brightness and contrast, a vignette colour
> grade, and a gate weave.

`src/FilmTreatment.tsx`, plus `gateWeave()` applied to the whole frame in
`src/Short.tsx` so nothing ever sits perfectly still.

### 6. Scene by scene, referencing frame numbers

His most useful practical tip: **address time by frame number, not by
seconds or by "right after the thing happens."** Every beat in `src/beats.ts` is
a frame range read off the Remotion Studio timeline, which is why the captions
land on the syllable.

Also his: build scene by scene and merge at the end, never one big scene —
otherwise fixing scene 1 breaks scene 6.

### 7. What makes it feel alive

The parts that separate "all right" from "well done":

- **boil** — sub-pixel wander on the panel, stepped at 10fps, not smooth
- **parallax** — the shadow plate moves at 35% of the panel's scale
- **overshoot** — each cut opens 4.5% large and settles over 10 frames
- **hard cuts on captions** — no fades; fades read as slow
- **amber on the spoken word** — carried over from the original caption track

### 8. Sound

Untouched. The original VO, SFX and music bed are kept in place — the
composition is exactly 1800 frames so the existing mix stays in sync.

## Render

```bash
cd remotion
npm install
npm run render
```

Chromium ships with this image; `remotion.config.ts` points the renderer at it
because `remotion.media` is outside the network allowlist. Override with
`REMOTION_BROWSER=/path/to/chrome` anywhere else.
