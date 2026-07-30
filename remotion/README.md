# Part 15 — Remotion composition

`Your Bank Only Has 3 Cents of Every Dollar You Own` · **1920×1080 landscape** · 30fps · 1560 frames (52s)

```bash
npm install
npm run plates      # regenerate public/plates (deterministic, only needed if you edit the generator)
npm run dev         # Remotion Studio — scrub the timeline
npm run render      # out/part15.mp4
npm run typecheck
```

## Layout

```
src/theme.ts             palette, BEAT boundaries, LAYOUT geometry, HAS_VO flag
src/Root.tsx             the <Composition>
src/Part15.tsx           timeline: one <Sequence> per beat, hard cuts
src/lib/rng.ts           seeded mulberry32 (see "Determinism")
src/lib/Plate.tsx        <Plate> loads a plate; <Camera> wraps a scale/translate move
src/beats/Beat*.tsx      one component per beat, named for its script beat
src/overlays/*.tsx       the four typographic/data overlays
public/plates/           14 layered PNGs + their README (file -> beat -> animation map)
scripts/make-plates.mjs  regenerates the plates via Chromium
```

Beat components are numbered for their **script** beat, so beats 1–2 share
`Beat1Balance.tsx` and there is no `Beat2`. `BEATS` in `theme.ts` is the single source of
truth for every boundary, and `LAYOUT` there mirrors the plate generator's geometry —
move something in one and you must move it in the other, nothing checks them.

## Landscape

The compositions are laid out for a wide frame, not scaled from a vertical original.
Several beats use the width structurally, so the orientation is not a config flip:

| Beat | Portrait was | Landscape is |
|---|---|---|
| 1–2 | counter locked to the phone screen | phone left third, balance figure right two thirds |
| 4 | chain overlaid on the coins behind a scrim | cascade left half, chain right half, no scrim |
| 5 | 5 × 6 screen grid, tally in a top band | 10 × 3 grid, tally in a bottom band, all 30 squares on one row |
| 7 | blueprints in a row below the vault | vault pushed left, blueprints stacked down the right |

When translating a plate off-centre (Beat 7 pushes the vault left), it only still covers
the frame if `scale >= 1 + 2 * |x| / W`. Violating that shows as a black strip at the
frame edge, which is easy to miss on a dark plate.

## Frame numbers are Sequence-local

`useCurrentFrame()` restarts at 0 inside a `<Sequence>`. A storyboard cue at absolute
frame 1110 inside a beat starting at 1080 is **local frame 30**. Every conversion is
commented at its use site. Getting this wrong is silent — the animation just fires at the
wrong time.

## Determinism

Remotion renders frames out of order and in parallel, so anything random must be a pure
function of the frame. Coins, dust and particles are positioned from `frame` plus a
seeded `mulberry32` (`src/lib/rng.ts`) — never `Math.random()`, which would flicker
frame-to-frame. `i * k % n` is also avoided: it bands into visible diagonal stripes.

## Two things are stubbed, on purpose

**The voiceover.** `HAS_VO = false` in `theme.ts`. Remotion *throws* on a missing
`staticFile`, so shipping `<Audio src={staticFile('vo.mp3')}/>` unconditionally would
break the render on a clean checkout. Record `vo-script.txt`, drop the file at
`public/vo.mp3`, flip the flag.

**The HyperFrames overlays.** The four overlays are implemented as native React
components so the composition renders today. When the transparent WebMs land, drop them
in `public/overlays/` and swap the component for the video, e.g. in `Beat1Balance.tsx`:

```tsx
- <ReserveCounter />
+ <Video src={staticFile('overlays/reserve-counter.webm')} />
```

The native versions stay in the tree as the reference for what each overlay does.

## Retiming to the recorded VO

The frame numbers throughout are the **script's** timings, not the recording's. Once
`vo.mp3` exists, read the real beat boundaries off the waveform and update `BEATS` in
`theme.ts`. Cues *inside* a beat (the odometer roll at local 120, the shutter slam at
local 150) are per-component constants at the top of each file.

## Rendering environment

Remotion downloads its own `chrome-headless-shell` on first render. Two things can go
wrong, both handled in `remotion.config.ts`:

- the download host (`remotion.media`) may be blocked by a network policy;
- a full Chrome binary **cannot** substitute — Remotion launches with the old
  `--headless` mode, which current Chrome has removed. It has to be a headless-shell
  build.

The config points at the Chromium headless shell that ships in this image. Override with
`REMOTION_BROWSER=/path/to/headless_shell`.

## Known deviations from the storyboard

- **Beat 6's light leak is baked into `bank-run.png`**, not a separate layer. The
  descending shutter occludes the arch and the blackout kills the surrounding bloom,
  which gets the same result; a separate glow layer would have changed the crowd's rim
  light in the plate.
- **The odometer's dollar wheels snap, only the cents roll continuously.** With all five
  wheels mid-glyph the figure is unreadable for the length of the roll — a bad trade in
  the first 8 seconds. Dollars read as a hard countdown instead.
- **Overlay timings are VO-synced, not as specced.** The reserve counter was specced to
  hold 1.5s then roll; it now rolls at local 120–156 to land on "three cents of *yours*".
- **The odometer wheels carry a gradient mask** so digits fade as they enter and leave
  the window. At the landscape figure's size an unmasked partial digit reads as a stray
  glyph rather than as a drum turning.
