# Part 15 — Remotion composition

`Your Bank Only Has 3 Cents of Every Dollar You Own` · 30fps · 1927 frames (64.3s) · voiced

Two deliverables from one component tree:

| Composition | Size | Output |
|---|---|---|
| `Part15` | 1920×1080 | `out/part15-landscape.mp4` |
| `Part15Vertical` | 1080×1920 | `out/part15-vertical.mp4` |

```bash
npm install
npm run plates      # regenerate public/plates (deterministic, only needed if you edit the generator)
npm run vo          # synthesise the VO and RETIME the composition to it
npm run dev         # Remotion Studio — scrub either composition
npm run render      # 16:9
npm run render:vertical
npm run render:both
npm run typecheck
```

## Layout

```
scripts/layouts.mjs      SOURCE OF TRUTH for geometry, both orientations
scripts/make-plates.mjs  builds both plate sets AND generates src/layouts.ts
scripts/make-vo.mjs      synthesises public/vo.mp3 and generates src/vo-timing.ts
src/layouts.ts           GENERATED — geometry, typed
src/vo-timing.ts         GENERATED — measured beat boundaries and cues
src/theme.ts             palette; useLayout()/useOrientation(); re-exports BEATS/CUES
src/Root.tsx             both <Composition>s
src/Part15.tsx           timeline: one <Sequence> per beat, hard cuts
src/lib/rng.ts           seeded mulberry32 (see "Determinism")
src/lib/Plate.tsx        <Plate> resolves per orientation; <Camera> wraps a transform
src/beats/Beat*.tsx      one component per beat, named for its script beat
src/overlays/*.tsx       the four typographic/data overlays
public/plates/landscape/ 14 layered PNGs at 1920x1080
public/plates/vertical/  14 layered PNGs at 1080x1920
```

Beat components are numbered for their **script** beat, so beats 1–2 share
`Beat1Balance.tsx` and there is no `Beat2`.

## Two orientations, one component tree

Neither cut is the other one cropped — each beat re-composes for its frame:

| Beat | 16:9 | 9:16 |
|---|---|---|
| 1–2 | phone left third, balance figure right two thirds | phone on top, figure beneath it |
| 4 | cascade left half, chain right half, no scrim needed | chain overlays the coins, behind a scrim |
| 5 | 10 × 3 screen grid, tally bottom, 30 squares on one row | 5 × 6 grid, tally top, squares 10 × 3 |
| 7 | vault pushed left, the three things stacked down the right | vault pushed up, the three in a row beneath |

Components never hold geometry as module constants — they call `useLayout()`, which keys
off the frame the component is actually rendering into (`useVideoConfig`). That is why one
tree serves both compositions with no orientation prop to thread or forget.

`scripts/layouts.mjs` is the single source of truth. `npm run plates` draws the plates
from it **and** generates `src/layouts.ts`, so the components animate against exactly the
numbers the plates were drawn with. An earlier version mirrored the two by hand and
nothing checked them.

Two traps worth knowing:

- When translating a plate off-centre (Beat 7 pushes the vault), it only still covers the
  frame if `scale >= 1 + 2 * |offset| / size`. Violating it shows as a black strip at the
  frame edge, easy to miss on a dark plate.
- In 9:16, the bottom ~18% is covered by the Shorts title, CTA and action rail. Nothing
  load-bearing goes there — it is why the vertical counter block ends by ~1560 and the
  blueprint row sits at 1430.

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

## The voiceover drives the timeline

`npm run vo` does three things: synthesises one audio file per script line, measures each
one, and writes `src/vo-timing.ts` with the resulting beat boundaries. `theme.ts` re-exports
those, so **the composition is cut to the recording, not to the script's estimates.** The
script guessed 52s; the read is 64.3s, and every beat absorbed its share.

Voice: Kokoro-82M `am_michael` at 0.96x, via `npx hyperframes tts` — a local model, no
account needed. `pip install kokoro-onnx soundfile` is a prerequisite.

Two cues have to land on a word rather than at a proportion of a beat, so they are measured
too and exported as `VO.cues`:

| Cue | Lands on | Used by |
|---|---|---|
| `rollStart` | the first frame of line 2, "Three cents of **yours**" | `ReserveCounter`, and Beat 1's glow dip |
| `slam` | 4 frames before line 6 ends, on "the same **day**" | `Beat6Run`'s shutter |

**To swap in a human read:** record one file per line, drop them in `public/vo-lines/` as
`01.wav` … `08.wav`, and run `npm run vo -- --from-recordings`. Same measurement, same
retime — no frame numbers to edit by hand. The pauses between lines live in `LINES[].pad`
in the script and are the ones from `vo-script.txt`'s delivery notes.

## One thing is stubbed, on purpose

**The HyperFrames overlays.** The four overlays are implemented as native React
components so the composition renders today. When the transparent WebMs land, drop them
in `public/overlays/` and swap the component for the video, e.g. in `Beat1Balance.tsx`:

```tsx
- <ReserveCounter />
+ <Video src={staticFile('overlays/reserve-counter.webm')} />
```

The native versions stay in the tree as the reference for what each overlay does. The
local HyperFrames authoring skills are installed under `.agents/skills/` (gitignored) via
`npx skills add heygen-com/hyperframes`; `mcp__…__compose` is the hosted alternative and
needs an approval prompt answered.

## Rendering environment

`ffmpeg` and `ffprobe` must be on `PATH` for `npm run vo`. Remotion ships both inside
`node_modules/@remotion/compositor-linux-x64-gnu/`, so symlinking them is enough — no
system install needed.

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

## The vertical cut is 64.3s, and that is worth a decision

Both cuts share one voiceover, so the Short inherits the long-form runtime. The channel's
own data argues against that: the best-performing Short on it is 46s, and the trait the
outliers share is a tight read with the sting in the first three seconds. 64.3s is not
disqualifying — Shorts allows up to three minutes — but it is not what the outliers did.

Cutting it properly means a shorter script, not a faster render: drop beat 4's chain to
two rows and compress beats 6–7. That changes `LINES` in `scripts/make-vo.mjs`, then
`npm run vo` retimes everything automatically.
