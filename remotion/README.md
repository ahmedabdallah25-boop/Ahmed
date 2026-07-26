# Remotion — programmatic Shorts

[Remotion](https://www.remotion.dev) renders video from React components, so a Short's hook
cards can be written as text and re-rendered instead of re-edited by hand.

Installed here: `remotion` + `@remotion/cli` + `@remotion/player` + `@remotion/fonts` (v4.0.499),
React 19, TypeScript.

## Use it

```bash
cd remotion
npm install          # first time only
npm run studio       # visual editor at http://localhost:3000 — edit props live
npm run render       # writes out/short.mp4 (1080x1920, 30fps)
npm run still        # writes out/cover.png — thumbnail / cover frame
npm run typecheck
```

`npm run studio` is the fast loop: change the `cards` array in the right-hand props panel,
see the timing immediately, then render.

## What's in the composition

`src/Short.tsx` is one composition, `Short`, sized 1080x1920 at 30fps — the format every
video on the channel uses. Its props:

| Prop | Meaning |
|---|---|
| `cards` | `{text, seconds}[]` — one ALL-CAPS caption card each, hard-cut in sequence. 1–3 words per card reads best on a phone. |
| `brand` | Small label above the Shorts UI. Defaults to `Finance % Decoded`. |
| `accent` | Hex color for the brand label and progress bar. |

Composition length is derived from the cards (`calculateMetadata`), so adding a card extends
the video — there is no duration to keep in sync by hand.

To render a specific script without editing the file:

```bash
npx remotion render Short out/hook.mp4 --props='{"cards":[{"text":"Banks profit","seconds":1.2},{"text":"from your patience","seconds":1.6}]}'
```

## Fonts

Bebas Neue is committed at `public/fonts/BebasNeue-Regular.woff2` and loaded with
`@remotion/fonts`, so renders never depend on Google Fonts being reachable — CI boxes and
sandboxes commonly can't reach `fonts.gstatic.com`. It's the same face
`automation/cinematic_captions.py` burns into recorded footage, so titles match captions.

## Rendering where Chrome can't be downloaded

Remotion downloads its own Chrome Headless Shell on first render. If your network blocks
`remotion.media` (this repo's cloud sandbox does), point it at a Chrome you already have:

```bash
npx remotion render Short out/short.mp4 --browser-executable=/path/to/chrome
```

## Relationship to `automation/`

The Python pipeline in `automation/` handles the *published* video — metadata, comments,
playlists, monitoring — and burns captions into footage you recorded. Remotion covers the
other end: generating footage (hook cards, title stings, cover frames) from a script. They
share no state; `out/*.mp4` is gitignored, so upload a render via
`automation/upload_video.py` after copying it into `media/`.
