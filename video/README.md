# video/ — motion-graphics builds

Remotion project for the channel's motion-graphics videos, plus a HyperFrames
port of the vertical Short.

| Composition | Format | Source of truth | Output |
|---|---|---|---|
| `Ep2-HalalMortgage` | 1920×1080 · 30fps · 10:17 | `../storyboard-ep2-halal-mortgage.md` + `public/vo-ep2.mp3` | `../media/ep2-halal-mortgage.mp4` |
| `Ep2-Thumbnail` | 1280×720 still | same storyboard | `../media/ep2-thumbnail.png` |
| `Part14-RaiseTrap` | 1080×1920 · 30fps · 36s | kinetic-typography Short | `../media/part14-kinetic.mp4` |
| `Part15-StudentLoans` | 1080×1920 · 30fps · 20s | `../script-part15-student-loans.md` | `../media/part15-student-loans.mp4` |
| `Part15-Dossier` | 1080×1920 · 30fps · 20s | `../script-part15-dossier.md` | `../media/part15-dossier.mp4` |

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
npx remotion render src/index.ts Part15-StudentLoans ../media/part15-student-loans.mp4
npx remotion render src/index.ts Part15-Dossier ../media/part15-dossier.mp4
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

## src/doc/ — the 3D-mannequin documentary lane

`Part15-Dossier` is the same Part 15 script told in the faceless-mannequin
documentary format (see `../script-part15-dossier.md` for the read, the shot
list and the AI prompt pack).

- **`src/doc/scene-kit.tsx`** — the look: `Figure` (a featureless matte
  mannequin, three poses), `Shaft` (hard key through haze), `Dust`, `Sheet`,
  `Grade` (teal shadows, amber bloom, vignette, grain, letterbox), `Cam` (slow
  push plus handheld drift), and the type furniture — `Slug`, `Caption`,
  `Readout`.
- **`src/doc/Dossier.tsx`** — eight shots, each a *pair*: the footage layer
  renders under `Grade`, the narration layer over it, so the grade never
  crushes the type. Shot lengths live in the `SHOTS` table and sum to 600
  frames; retime by editing that table alone.

Nothing here loads an asset or a model — every frame is drawn procedurally, so
the render is reproducible offline. Swapping in AI-generated clips means
replacing each `SceneN` with a `<Video>` and leaving the text layer as is.

## hyperframes/

A HyperFrames (HTML + GSAP) port of the vertical Short — one seekable timeline,
`data-*` scene timing, vendored GSAP. `npx hyperframes check` passes; use
`npx hyperframes preview` to edit it on a timeline, or render it in the cloud.
`ledger.json` is the seam vector ledger: the film runs one current (left), and
spends the reserved Z vector only on the problem → fix chapter boundary.
