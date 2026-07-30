# Part 15 — Remotion composition

`Your Bank Only Has 3 Cents of Every Dollar You Own` · 30fps · voiced

Three deliverables from one component tree:

| Composition | Size | Read | Length | Output |
|---|---|---|---|---|
| `Part15` | 1920×1080 | `full` | 64.3s | `out/part15-landscape.mp4` |
| `Part15Vertical` | 1080×1920 | `full` | 64.3s | `out/part15-vertical.mp4` |
| `Part15Short` | 1080×1920 | `short` | **46.7s** | `out/part15-short.mp4` |

Two independent axes: **orientation** comes from each composition's own dimensions
(`useLayout`), **read** comes from its `cut` prop (`useBeats` / `useCues`). Neither is a
global, which is why the same seven beats serve 16:9 long-form and a 46.7s Short.

```bash
npm install
npm run plates      # regenerate public/plates (deterministic, only needed if you edit the generator)
npm run vo          # synthesise the VO and RETIME the composition to it
npm run dev         # Remotion Studio — scrub either composition
npm run render      # 16:9 long-form
npm run render:vertical
npm run render:short
npm run render:all
npm run typecheck
```

## Layout

```
scripts/layouts.mjs      SOURCE OF TRUTH for geometry, both orientations
scripts/make-plates.mjs  builds both plate sets AND generates src/layouts.ts
scripts/vo-cuts.mjs      SOURCE OF TRUTH for both reads — lines, pauses, speed
scripts/make-vo.mjs      synthesises both vo-*.mp3 and generates src/vo-timing.ts
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

`npm run vo` synthesises one audio file per line **per cut**, measures each, and writes
`src/vo-timing.ts` with the resulting beat boundaries. Components read those through
`useBeats()`, so **each composition is cut to its own recording, not to the script's
estimates.** The script guessed 52s; the full read is 64.3s and the Shorts read 46.7s, and
in both cases every beat absorbed its share.

Voice: Kokoro-82M `am_michael` via `npx hyperframes tts` — a local model, no account
needed. `pip install kokoro-onnx soundfile` is a prerequisite. The full read runs at 0.96x
so the hook lands unhurried; the Shorts read runs at 1.0x.

### The two reads

`scripts/vo-cuts.mjs` holds both. The short one is cut against the channel's own outlier
profile — its best Short is 46s, and the shared trait is a tight read with the sting inside
three seconds:

- the **hook is untouched** (lines 1–2), because it is the whole video;
- every line after it loses its second clause;
- the lending chain drops to **two rows** — "kept three, lent ninety-seven, lent it again"
  is the mechanism, rows 3–5 were reinforcement (`chainRows` in the cut, read by
  `MultiplierChain`);
- pauses tighten, except the one after "yours", which is doing work.

### Word-locked vs proportional cues

Two cues must land on a *word*, so they are measured per cut and exported as `VO.cues`:

| Cue | Lands on | Used by |
|---|---|---|
| `rollStart` | the first frame of line 2, "Three cents of **yours**" | `ReserveCounter`, and Beat 1's glow dip |
| `slam` | 4 frames before line 6 ends, on "the same **day**" | `Beat6Run`'s shutter |

Everything else that used to be a literal frame number now goes through `at(fraction,
beatLength)` — the blueprint fills, the kicker wipe, the owner-grid blur, the wordmark
spring. **This is not tidiness.** The short read compresses beat 7 from 335 frames to 209;
a hardcoded "fires at 240" silently stops firing, which is exactly how three moves broke
the first time this timeline was retimed.

**To swap in a human read:** record one file per line into `public/vo-lines/<cut>/` as
`01.wav` … `08.wav` and run `npm run vo -- --from-recordings`. Same measurement, same
retime — no frame numbers to edit by hand.

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

## Which vertical file to post

`Part15Short` (46.7s) is the one to post as a Short — it matches the channel's own
outlier profile. `Part15Vertical` (64.3s) is the full read in a tall frame, useful if you
want the complete argument vertically without recutting; it is not the Shorts-optimised
deliverable.
