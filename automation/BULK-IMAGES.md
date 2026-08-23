# Bulk image generation from Claude Code

Three routes exist. Only one of them scales, and it is not Flow.

## Google Flow has no API

[Flow](https://labs.google/flow) is a UI sold with the Google AI Pro/Ultra
subscription. There is no public endpoint, no API key, no CLI. Everything
marketed as a "Flow API" is one of two things:

- **Chrome extensions** (Flow Image Automator, ZAPI FLOW) that click the real UI
  in a real browser. They need a logged-in Google session on a desktop. Nothing
  in this repo can run them — the session has no browser and no Google cookie.
- **Reverse-engineered private endpoints** (useapi.net and similar) that drive
  *your* Flow account by holding *your* credentials. That is an unofficial
  endpoint against Google's ToS, on an account this repo already uses for three
  YouTube channels. Not worth the channel.

What Flow generates images *with* is public. Nano Banana Pro in Flow is
`gemini-3-pro-image` on the Gemini API. Go there directly.

## Route 1 — the Gemini API, for real bulk

`automation/bulk_images.py`. Manifest in, N PNGs out, with concurrency, resume
and receipts.

    export GEMINI_API_KEY=...                     # aistudio.google.com/apikey
    python automation/bulk_images.py --manifest media/clarity/plates/manifest.json
    python automation/bulk_images.py --manifest ... --only S002 --live   # pilot two
    python automation/bulk_images.py --manifest ... --live --workers 4   # the rest

Dry run by default. It prints the count, the estimate, and the first ten targets;
nothing is spent until `--live`.

**Resume is the safety net.** Each entry names its own output file and an entry
whose file exists is skipped. Kill a 180-plate run at plate 140, re-run the same
command, pay for 40. `--force` re-renders anyway.

Manifest shape — `automation/clarity_plate_manifest.py` already emits it:

```json
{"entries": [{
  "id": "S002-line",
  "prompt": "...",
  "negative": "no text, no watermark, ...",
  "aspect_ratio": "16:9",
  "reference": "media/character-sheets/adam.png",
  "out": "media/clarity/plates/S002-line.png"
}]}
```

`negative` and `reference` are optional. `reference` (or `references` for
several) attaches a character sheet as an image reference — the mechanism
`video/scripts/student-loan-stills.md` used for its thirteen character scenes.

Cost at the interactive rate is **$0.134/image**, so the 180-plate Clarity
manifest is ~$24. Vertex AI batch mode halves that to $0.067 for async delivery
above ~500/day; this script does not use it, because 180 plates that arrive now
beat 180 that arrive cheaper tomorrow.

### Two things the API cannot do that the manifest asks for

- **No seed parameter.** `seed_group` cannot be honoured by re-running a seed.
  For a line/wash pair, render the wash first and feed it back as the line pass's
  `reference` — the fallback the manifest itself documents.
- **No negative field.** Imagen has `negativePrompt`; the Gemini image models do
  not. The block is appended to the prompt as prose instead, which is weaker.
  Check plate 61's "no calligraphy" rather than assuming it held.

### The key never lands in this repo

The repo is public. Export `GEMINI_API_KEY` in a shell, or add it as a
**Repository secret** alongside `CIQ_*` and `HBF_*` if this ever runs in Actions.
Never commit it and never print it.

## Route 2 — Higgsfield MCP, for a handful

Already connected in-session, no key to mint, and it hosts the same Google
models: `nano_banana`, `nano_banana_pro`, `nano_banana_2`, `nano_banana_2_lite`.
`generate_image_batch` submits up to **12 jobs per call**, then `jobs_wait`, then
one `show_generation_by_ids`.

Good for a thumbnail set or a pilot. Bad for 180 plates: that is 15 batch calls
plus polling, all of it burning conversation context, with no resume if the
session ends. **Balance as of 2026-08-23 is 0.1 credits** — the path is live but
unfunded, which is exactly why `clarity_plate_manifest.py` wrote a manifest
instead of a loop.

## Route 3 — vidIQ / Nexlev

`vidiq_generate_thumbnail` and `nexlev__generate_thumbnail` are thumbnail tools,
one image at a time, tuned for CTR rather than a house style. Fine for a single
16:9 card. Not a bulk path.

## Choosing

| | plates in a scene pack | a thumbnail set | one image |
|---|---|---|---|
| **Route** | 1 — Gemini API | 2 — Higgsfield batch | 2 or 3 |
| **Why** | resume, concurrency, receipts | no key, already connected | one call |
