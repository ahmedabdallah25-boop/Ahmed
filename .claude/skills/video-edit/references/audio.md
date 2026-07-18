# Audio: music, SFX, mix

The mix is fully deterministic: voice untouched, music sidechain-ducked 12:1 under the
voice, 1.5s fade-out at the end, SFX at −8 dB, final loudnorm to −14 LUFS / −1.5 dBTP
(YouTube target). You never set levels by hand — only pick files and placements.

## Assets

- `assets/music/` — one bed per project. `"music": "auto"` uses the first file.
  Pick 90–110 BPM neutral electronic/lo-fi for talking-head; drop it in before `ve render`.
- `assets/sfx/` — short hits: `whoosh.wav`, `pop.wav`, `rise.wav`.
  `"sfx": "auto"` puts the whoosh on every `impact`/`stat` graphic — usually all you need.
  Manual: `{"line": 5, "name": "pop"}` (name is a filename substring match).

No assets present → music/sfx silently skipped; the edit still passes QC.

## Taste defaults

- Music gain: auto (−15 dB pre-duck). Louder music = `{"file": "...", "gain_db": -12}`.
- Never place SFX on two consecutive lines; hits lose meaning.
- If the user says "feels cheap": first check music (missing bed is the usual cause),
  then add one whoosh on the hook — not more SFX everywhere.
