# Remotion compositions

Programmatic 1080×1920 rendering for **Finance % Decoded**, alongside
`automation/cinematic_captions.py` (Whisper → ASS → FFmpeg burn-in). Same caption
language in both: 1–3 ALL-CAPS words, Bebas Neue, hard cuts, five-band placement.

## Install

```bash
cd remotion && npm install
```

TypeScript is pinned to `^5` — Remotion's bundler uses the classic `typescript`
JS API, which TypeScript 7 does not expose.

### Headless browser

Remotion needs `chrome-headless-shell`; Chrome's old headless mode is gone, so
plain Chromium fails to launch. Either let Remotion download it once
(`npx remotion browser ensure`) or reuse an existing one:

```bash
export CHROME_HEADLESS_SHELL=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

`remotion.config.ts` picks that variable up automatically.

## `Voiceover` — animate a voiceover track

Drop the recording anywhere, then:

```bash
cd automation
python voiceover_timings.py ~/Downloads/part14-vo.mp3      # needs: pip install openai-whisper
```

That transcribes with word-level timestamps, groups the words into caption cards,
copies the audio into `remotion/public/`, and writes
`remotion/public/<name>.timings.json`. Then:

```bash
cd remotion
npx remotion render Voiceover out/part14.mp4 --props='{"audio":"part14-vo.mp3"}'
```

Clip length comes from the audio file itself (`calculateMetadata`), so a re-recorded
take needs no code change — re-run the two commands.

What it draws:

- **Captions** cut hard on the spoken word, with a 3-frame settle. Cards containing a
  number, `%`, or a currency symbol render in the accent colour, since the figure is
  the payload of a finance line.
- **Backdrop** — a drifting emerald/gold glow over near-black that breathes with the
  voiceover's low-band amplitude (`visualizeAudio`), plus grain and a vignette. Pass
  `broll` to put a muted clip from `public/` behind the captions instead.
- **Progress bar** and channel handle.

Props: `audio` (required), `cards` (overrides the timings JSON), `broll`, `accent`,
`handle`. Everything is editable live in the Studio (`npm run dev`).

Tune the captions with the same flags the burn-in script uses:

```bash
python voiceover_timings.py vo.mp3 --model medium --words 2 --band 0.35
```

## `Short`

Background clip from `public/` plus hand-written caption cards — use it when the
timings come from somewhere other than Whisper.

```bash
npx remotion render Short out/short.mp4 \
  --props='{"source":"part13.mp4","cards":[{"text":"Your bank","from":0,"to":0.8,"band":0.35}]}'
```

## Assets

`public/BebasNeue.woff2` (latin subset, SIL OFL 1.1) is committed so renders never
depend on Google Fonts being reachable. `public/` is otherwise gitignored — media
files stay out of the repo.
