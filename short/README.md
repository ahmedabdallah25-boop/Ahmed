# Episode 1 Short — Remotion rebuild

A ground-up rebuild of the Episode 1 Short. The original clip's **audio is kept
exactly as it was**; everything you see is new. No frame, crop, or export from
the source video appears anywhere in the output — every pixel is drawn from
code at 1080×1920 / 30fps / 60s.

```
npm install
npm run dev      # Remotion Studio
npm run build    # renders out/ep01-short.mp4
```

`npm run build` uses whatever Chromium Remotion finds. On a machine without
network access to Remotion's browser download, point it at a local one:

```
REMOTION_BROWSER=/path/to/headless_shell npm run build
```

## Visual identity — "After Hours"

A dark market terminal at night. The film has its own look, deliberately
unrelated to the source clip's warm editorial styling:

- **Field** — blue-black well, a chart grid that breathes, two slow colour
  blooms, film grain, and a scan line that sweeps once every few seconds.
- **Type** — Archivo Black for captions and headline words, JetBrains Mono for
  every label, readout and figure. Data is always mono; speech is always
  Archivo.
- **Colour** — `loss` red, `gain` mint, `cool` blue, and an electric `live`
  yellow reserved for the word currently being spoken.
- **Chrome** — viewfinder corner ticks, a chapter tag that re-pops on each act,
  a running clock, and a progress rail that takes the current act's accent.

## What's in here

| Path | What it does |
|---|---|
| `src/Ep01Short.tsx` | Composition root: field, six act layers, captions, HUD, audio |
| `src/data/script.ts` | The transcript with per-word frame timings (see below) |
| `src/components/Kinetic.tsx` | The caption engine — each word lands on the frame it is spoken, the live word painted into a solid block |
| `src/components/Field.tsx` | The backdrop |
| `src/components/Hud.tsx` | Corner ticks, chapter tag, clock, progress rail, wordmark |
| `src/components/Ui.tsx` | Shared primitives: `Panel`, `Readout`, `Figure` (count-up), `Bar`, `Slam` |
| `src/scenes/Act*.tsx` | The six data scenes |
| `public/audio.wav` | The original audio (see the sync note) |
| `public/fonts/` | Archivo Black + JetBrains Mono, bundled so renders never need the network |

## The six acts

| Frames | Chapter | Graphics |
|---|---|---|
| 0–405 | The Crash | Book value climbs in mint, plunges in red under a glowing area fill; `−35%` slams in; Sammy vs Adam panels; `BEHIND BY $5,300` |
| 405–776 | The Real Gap | Paid-in vs worth-today bars with a `−$4,600` shortfall, then 36 deposit cells struck through |
| 776–960 | The Moment | The sell/hold fork with a pulsing decision node; arithmetic glyphs struck out |
| 960–1312 | The Noise | Friends / brother-in-law / father cards stacking, each on its own accent |
| 1312–1566 | Adam Is Ahead | Adam's flat cash line over Sammy's ghosted ride; `ZERO` losses; `AHEAD BY $5,300` |
| 1566–1800 | The Sell Button | The whole ride with `MOST PEOPLE SELL HERE` at the trough and the dashed recovery nobody waits for |

## Where the timings come from

The source clip had burnt-in karaoke captions. Rather than guess the script,
the transcript in `src/data/script.ts` was recovered from the clip itself: the
caption pill was located per frame, OCR'd, and the gold highlight was tracked
across the words to pin each word to the frame it is spoken on. Every phrase
boundary in the data file is a measured frame number, not an estimate.

Numbers used in the graphics are the ones the narration states — $14,600 held,
$5,300 behind Adam, $4,600 below the $19,200 deposited over 36 months.

## Audio sync note

Remotion's MP4 muxer emits AAC with 2048 samples (42.67 ms) of encoder priming
and no compensating edit list, which would push the audio 1.3 frames behind the
typography. `public/audio.wav` is therefore the original track with its first
2048 samples of leading silence removed, so the rendered MP4 lands
sample-accurate against the timings in `script.ts`. Nothing audible is lost —
the first word starts 188 ms in.

If you ever re-render to a codec without that priming (WAV, ProRes), add those
2048 samples back to the head of `public/audio.wav`.
