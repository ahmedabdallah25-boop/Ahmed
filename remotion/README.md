# remotion — the long-form editor

Five 7-minute episodes, cut in the commentary-video style described in
`../longform-concepts.md`, rendered from script data rather than assembled by
hand in an NLE.

```bash
npm install
npm run dev        # Remotion Studio — scrub all five episodes
npm run build      # renders Ep01 to out/ep01.mp4
npm run typecheck
```

## How it fits together

```
src/scripts/epNN.ts   the script. beats, durations, word-for-word VO.
                      this is the file you edit.
   ↓ buildTimeline()
src/components/Beat   turns one BeatVisual into pixels
   ↓
src/Episode.tsx       beats end to end + locked VO track + the grade
```

A script is a flat list of beats; `buildTimeline` lays them end to end, so
re-timing a beat never drifts every beat after it. `assertRuntime` runs at
studio-load and throws if a script has slipped more than 6 seconds off 7:00 —
loudly, rather than after a 40-minute render.

## Assets are opt-in

Remotion cannot stat the filesystem, so a missing `staticFile()` is a hard
render failure. Everything optional is therefore declared in `src/lib/assets.ts`
and simply doesn't render when absent:

- **Host takes** — anything not in `TAKES` falls back to
  `public/host/placeholder.mp4`, so all five episodes preview end to end at full
  length before a single real avatar take exists.
- **VO** — `NARRATION[ep] = null` means no voice track yet. Host takes are muted
  either way; the locked VO is the only voice source. See `../clone/README.md`.
- **SFX / music** — empty by default. Drop files in `public/sfx`, `public/music`,
  list them, and every `sfx:` and `music:` already written into the scripts
  starts firing.
- **Evidence stills** — baked from `../hyperframes/evidence.html`. A `cutaway`
  beat whose image isn't there holds on the host instead of cutting to black.

## Fonts

Self-hosted in `public/fonts`, loaded via `@remotion/fonts`. Not pulled from
Google at render time: a headless Chromium behind a proxy fails the fetch and
silently falls back to a system face, which shows up as one wrong-looking title
card in the middle of a finished video.

`display` is Bebas Neue — the same face `../automation/cinematic_captions.py`
already burns onto the Shorts, so a Short clipped out of an episode is visually
continuous with it.

## Render notes

`remotion.config.ts` sets a 120s delayRender timeout and concurrency 1. Each
host beat decodes its take twice (the plate, plus the blurred set extension) and
then blurs a full frame on top; on a small container that blows past the 28s
default and the render dies mid-way with an error that looks like a code bug but
isn't. On a bigger machine, raise concurrency.

Measured: 780 frames (the Ep01 cold open) in 7m18s at concurrency 1 on this
container — 0.56 s/frame, so a full 12,600-frame episode is **~2 hours** here.
Raise concurrency to match your cores and it scales close to linearly; on 8
cores expect 15–25 minutes.
