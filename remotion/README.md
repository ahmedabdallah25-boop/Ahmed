# Remotion compositions

Programmatic 1080×1920 Shorts rendering for **Finance % Decoded**, as a
React-side companion to `automation/cinematic_captions.py` (Whisper → ASS → FFmpeg).

## Install

```bash
cd remotion && npm install
```

TypeScript is pinned to `^5` — Remotion's bundler uses the classic `typescript`
JS API, which TypeScript 7 does not expose.

## Studio

```bash
npm run dev
```

## Render

```bash
npx remotion render Short out/short.mp4 \
  --props='{"source":"part13.mp4","cards":[{"text":"Your bank","from":0,"to":0.8,"band":0.35}]}'
```

Source clips go in `public/` and are referenced by filename via `staticFile()`.

### Headless browsers

Remotion wants `chrome-headless-shell`; the Chrome binary's old headless mode is
gone, so plain Chromium fails to launch. On a machine that already has Playwright
browsers, point Remotion at the shell:

```bash
export REMOTION_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

Otherwise run `npx remotion browser ensure` once to download it.

## Composition

`Short` (30 fps, 1080×1920) draws an optional background video plus a list of
caption cards. Cards mirror the burned-in caption style: 1–3 ALL-CAPS words,
Bebas Neue, hard cuts (a 2-frame punch-in, never a fade), soft drop shadow, and a
`band` value placing the card at a fraction of frame height — the same five-band
placement `cinematic_captions.py` picks between.
