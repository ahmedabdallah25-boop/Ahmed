# video/ — motion-graphics builds

Remotion project for the channel's motion-graphics videos, plus a HyperFrames
port of the vertical Short.

| Composition | Format | Source of truth | Output |
|---|---|---|---|
| `Inflation-Short` | 1080×1920 · 24fps · 1:40 | `public/inflation.mp4` (supplied footage) + `../inflation-scene-pack.txt` | `../media/inflation-edited.mp4` |
| `Ep2-HalalMortgage` | 1920×1080 · 30fps · 10:17 | `../storyboard-ep2-halal-mortgage.md` + `public/vo-ep2.mp3` | `../media/ep2-halal-mortgage.mp4` |
| `Ep2-Thumbnail` | 1280×720 still | same storyboard | `../media/ep2-thumbnail.png` |
| `Part14-RaiseTrap` | 1080×1920 · 30fps · 36s | kinetic-typography Short | `../media/part14-kinetic.mp4` |
| `Pension-DefaultFund` | 1080×1920 · 30fps · 2:15 | 46 supplied stills + `public/vo-pension.mp3` + `../pension-scene-pack.txt` | `../media/pension-default-fund.mp4` |

## Pension short — how it's built

The picture is 46 supplied flat-vector stills, one per scene, cut to the
recorded voiceover. Build it in three steps:

```bash
npm run ingest:pension -- <uploads-dir>   # stills -> public/scenes/01..47.jpeg
npm run align:pension -- vo.wav lines.json scripts/aligned.json
npm run timeline:pension                  # pack + alignment -> src/pension/timeline.ts
npm run render:pension
```

### The pack's timings are not usable, and silence detection cannot replace them

`../pension-scene-pack.txt` gives every scene a designed range (`SCENE 03 |
0:08-0:10`), but those ranges total **196s against a 135.4s recording**. Using
them would run the picture 60s past the end of the voice.

Silence detection is not the fix either. The pauses *inside* a line ("Pension.
Four-oh-one-k. Workplace plan.") are the same length as the pauses *between*
lines, so no threshold splits this read into exactly 46 pieces — the sweep in
`scripts/align-vo.mjs` gets 47 at best and 43 at the next step down.

- **`scripts/force-align.py`** is what actually times the video. The script is
  known exactly, so it is aligned acoustically with pocketsphinx rather than
  guessed at. Two things make it work: aligning all 135s as one grammar
  overruns the search, so it walks a short window of a few lines at a time; and
  forced alignment must consume its whole window, so the **last** word in a
  window absorbs any trailing audio and its end time is worthless. Only interior
  word *starts* are trusted — each line's boundary is read off the start of the
  **next** line's first word, then the window re-anchors, so drift cannot
  accumulate. 43 of 46 lines land acoustically; the rest are shared out between
  their acoustic neighbours by character count.
- **Verification**: all 45 boundaries fall within 150ms of a silence found by
  the independent envelope detector. Two unrelated methods agreeing is the
  check — not the deviation figure from either one alone.
- **`public/scenes/15.jpeg` belongs to no scene.** It is a second take of scene
  13's basket, carrying a herringbone weave where the prompt asks for
  cross-hatch. `scripts/make-timeline.mjs` skips it, so scenes 15-46 read one
  file later than their scene number.

### Type sits above the subject, and the art decides where that is

Every one of the 45 picture prompts places its subject "in the lower two-thirds"
with "clean headroom above", so captions go above the subject on all of them.
The prompts do not settle *how far* above, though — the delivered stills vary
too much for one fixed band, which is why this composition still needs a
measured equivalent of `inflation/placement.ts`. Here it is derived rather than
hand-authored: see `scripts/measure-headroom.py` below.

Captions are the pack's own `CAPTION 1` / `CAPTION 2`, styled after a reference
Short the channel wanted matched: one phrase on screen at a time, set very large
and all-lowercase in the heaviest weight available, naked over the picture with
no stroke, shadow or pill, easing in on opacity and leaving by blurring out.
`CAPTION 1` holds the first half of the spoken line and `CAPTION 2` takes over
for the second, so a block changes roughly every 1.5s — the reference's cadence.

Two things in that reference could not be copied, and were not faked:

- Its type is **white in an Overlay blend** over dark footage. On this video's
  cream ground that is invisible, so the fill is the ink the artwork already
  draws its own outlines in.
- Its type sits at the **vertical centre**, which works because it is masked
  behind the subject. No segmentation model is reachable from this environment
  (the same constraint `inflation/placement.ts` records), so type stays above
  the subject instead.

Staying above the subject is not a fixed band. The prompts all claim clean
headroom, but the stills do not deliver it equally — `scripts/measure-headroom.py`
finds the real top of the subject in every image and the answers run from 330px
to 1424px. That measurement sets each scene's caption band and its type-size
budget, which is why the same phrase is set large on an empty still and smaller
on a full-body figure. The font is Inter 900; the reference uses a geometric
(Poppins/Montserrat class) and Inter is a grotesque, but Google's font CDN is
not reachable at render time and `src/fonts.ts` records why nothing here may
depend on a network fetch mid-render.

The three-step checklist track is driven by the script numbering the steps out
loud ("One." / "Two." / "Three."), not by a hand-picked frame range.

## Inflation short — how it's built

Unlike everything else here, this composition does not *generate* its picture —
it overlays supplied footage. The footage arrived as a finished 1:40 run of 36
AI-generated 3–5s scenes with its own hard cuts, and the overlay's whole job is
to land *with* those cuts rather than across them. Nothing re-times, re-cuts,
dissolves or pushes in on the source.

Build it in four steps:

```bash
npm run prep:inflation      # HEVC -> H.264 (Chromium cannot decode H.265)
npm run cuts:inflation      # find the footage's own cuts -> src/inflation/cuts.ts
npm run captions:inflation  # scene pack -> captions.ts + ../media/inflation.srt
npm run render:inflation
```

- **`scripts/prep-source.mjs`** — the supplied `.MOV` is HEVC, which neither
  Chromium nor Remotion's preview can decode, so it is transcoded once to H.264
  at CRF 17. No scaling: the source is 1072×1920 against a 1080×1920 canvas, so
  the composition covers with `objectFit: cover` rather than stretching it 0.75%
  wide. The AAC voiceover is stream-copied in, so `<OffthreadVideo>` carries it.
- **`scripts/detect-cuts.mjs`** — Remotion's bundled ffmpeg is built with
  `--disable-filters` and no `select`, `showinfo` or `rawvideo` muxer, so
  ffmpeg's own scene detector is unavailable. Instead the video is decoded once
  to a 64×114 greyscale stream through `image2pipe` and the frame-to-frame luma
  delta is computed directly. Run it without `--write` to see the whole
  difference curve and every scene's length before committing to a threshold.
- **`scripts/analyse-frames.py`** — builds a labelled contact sheet, one still
  per scene with the candidate caption bands drawn on, plus a busy-ness score
  per band. It produces a *draft* placement; the scores cannot tell a face from
  a texture, so the sheet is what you actually judge from.
- **`src/inflation/placement.ts`** — hand-authored from that sheet: which third
  of the frame each scene's caption may occupy, with a comment naming what is in
  the shot. This is what keeps type off the subject. Note that captions cannot
  sit genuinely *behind* a subject — that needs a matte, and no segmentation
  model is reachable from this environment — so they go where the frame is empty
  instead, under a soft scrim.
- **`src/inflation/beats.ts`** — which graphic fires on which cut, and where it
  sits. Every beat is anchored to a scene index, never a raw frame, and is
  positioned clear of that scene's caption zone.
- **`src/inflation/graphics.tsx`** — the shape language: glass cards, tag pills,
  power bars, draw-on callouts. Callouts are anchored by their *dot*, so you
  position the thing being pointed at and express the label as an offset.

### Captions come from the scene pack, and the timing is exact

`../inflation-scene-pack.txt` writes `CAPTION 1` and `CAPTION 2` for every
scene, and the footage cuts between those same scenes. So
`scripts/make-inflation-captions.mjs` does not estimate anything: each cue's
start and end **is** a cut frame. That is what the pack's own spec asks for —
"the caption change and the picture cut land together" — and it means no speech
recognition is needed (none is reachable here anyway).

**The scene offset.** The pack describes 37 scenes; the delivered footage has
36. Pack scene 35, the brass balance scale, was never generated. Its voiceover
is still in the recording, so its caption rides the house-frontage shot that
follows the vault — which the pack marks as a silent beat with no caption of its
own, so nothing is displaced. Pack scenes 1–34 map one to one; see
`PACK_TO_CUT` in the generator.

### Two departures from the pack's burn-in spec

Both settled with the author rather than assumed:

1. **Position.** The spec says "lower third". All 37 image prompts say "subject
   in the lower two-thirds, clean headroom above for captions" — the footage was
   generated from the prompts, so the subject really is low and the room really
   is up top. Lower-third captions would sit on the character in most shots.
   Captions go where the pictures left room; exceptions are in `placement.ts`.
2. **Treatment.** The spec asks for solid black boxes and no animation. This
   uses the project's own language instead — a centred block on a soft scrim
   with a short pop. The pack's two-line hierarchy is kept exactly, including
   line 2's gold italic; its 20px left offset is dropped, because that belongs
   to a left-aligned layout and reads as a mistake on a centred one.

### What a graphic beat is allowed to say

Captions carry every line of the voiceover, so a graphic that restates the line
beneath it is the same sentence twice in two type sizes. `beats.ts` therefore
splits the work: **tags** name the film's four movements (the symptom, the
mechanism, the cost, the fix) and never quote the narration; **cards, bars and
callouts** carry a figure or a mechanic the narration does not state outright.
A beat that can only repeat its caption is cut — which is why the hero frame
(pack 20) and the empty vault (pack 16) deliberately carry no graphic at all.

## Episode 2 — how it's built

- **`src/longform/timing.ts`** — the 13 scene cuts, in seconds against the VO.
  This is the only file to touch when re-timing.
- **`src/longform/scenes.tsx`** — one component per storyboard scene. Every
  internal beat is a *fraction* of the scene's own length (`b(dur, 0.42)`), so
  changing a cut in `timing.ts` re-times that scene's contents automatically.
- **`src/longform/charts.tsx`** — the reusable assets from the storyboard's asset
  list: the 25-year amortisation sweep, paid-vs-owed bars, the party/flow
  diagram, the Ijara ownership bar, the Musharaka shrinking-share bar.
- **`src/longform/amort.ts`** — the £250,000 / 5% / 25-year schedule, plus
  `CANON`, the figures the VO says out loud. Where the schedule's own rounding
  disagrees with the script, `CANON` wins so the screen never contradicts the
  narration.
- **`src/longform/ui.tsx`** — type scale, colour language (bank grey, you green,
  riba red), staged-reveal helpers.

### How the scene cuts were derived

Word-level ASR was not available on the build machine (the whisper model
download is blocked by the network policy), so cuts were placed by:

1. counting each scene's VO words in the storyboard,
2. mapping those proportions onto the VO's **speech** time — total runtime minus
   every silence ≥ 0.45s, measured with `ffmpeg silencedetect`,
3. snapping each resulting cut to the nearest real pause within 6s, so no cut
   lands mid-sentence.

If a scene drifts against the narration, adjust its number in `timing.ts` and
re-render — nothing else needs to change.

## Commands

```bash
npm run preview                      # Remotion Studio
npm run render                       # Episode 2 → ../media/ep2-halal-mortgage.mp4
npx remotion render src/index.ts Part14-RaiseTrap ../media/part14-kinetic.mp4
npx remotion still src/index.ts Ep2-Thumbnail ../media/ep2-thumbnail.png
```

On a machine without a system Chrome, pass
`--browser-executable=<path to chrome headless shell>`.

**Keep `typescript` pinned to 5.x.** TypeScript 7 removed the `ts.sys` API that
Remotion's esbuild loader calls, and the bundle fails to build with it installed.

Type is Inter (variable), inlined as a data URI in `src/fonts-data.ts` and
declared in `src/fonts.ts`, so renders never fetch a font over the network and
never block on one. Regenerate after replacing `public/fonts/inter-var.woff2`:

```bash
node scripts/inline-fonts.mjs
```

## hyperframes/

A HyperFrames (HTML + GSAP) port of the vertical Short — one seekable timeline,
`data-*` scene timing, vendored GSAP. `npx hyperframes check` passes; use
`npx hyperframes preview` to edit it on a timeline, or render it in the cloud.
`ledger.json` is the seam vector ledger: the film runs one current (left), and
spends the reserved Z vector only on the problem → fix chapter boundary.

`inflation-ledger.json` applies the same doctrine to the Inflation short, with
one difference worth stating: the footage there is not ours to re-cut, so the
ledger governs the **graphics layer only**. The picture cuts hard on its own 36
cuts; the overlay flows left across them, and the reserved Z vector is spent
once, on the cut to the gold coins where the film turns from problem to fix.
