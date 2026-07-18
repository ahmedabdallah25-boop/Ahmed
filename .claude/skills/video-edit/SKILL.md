---
name: video-edit
description: Full agentic video editing pipeline (Loop-Studio style, but deterministic). Cuts raw talking-head footage only in word gaps, adds custom motion graphics, captions, music + SFX with ducking, runs a QC gate, and a review-room feedback loop with persistent taste memory. Use when asked to edit, cut, caption, or polish a video clip, or to process review feedback on one.
---

# video-edit — deterministic agentic editor

One rule makes this work on ANY model with zero quality loss: **the model never touches
pixels, timestamps, or ffmpeg. Scripts own quality; the model only writes a tiny JSON plan.**
All commands print ≤15-line summaries. Never read `words.json`, `segmap.json`, media files,
or raw ffmpeg output — the printed summaries contain everything you need.

Entry point: `python3 .claude/skills/video-edit/scripts/ve.py <cmd> ...`
(alias below: `ve`). Run `ve doctor` first on a new machine.

## The six pillars (what the scripts enforce for you)

1. **Planning** — `ve words` gives beat-level lines with retake detection.
2. **Cuts** — boundaries auto-snap into silence gaps between words; words are never clipped; micro audio fades kill clicks.
3. **Contrast** — automatic alternating punch-ins (100% / 106%) between cuts.
4. **Motion** — graphics are data (`gfx` specs) rendered by fixed, brand-safe templates.
5. **Music** — auto bed, sidechain-ducked under the voice, faded out at the end.
6. **Sound** — SFX aligned to graphic hits; final mix loudness-normalized to −14 LUFS.

## Pipeline (each step is cached; re-run is cheap)

```bash
ve init RAW.mp4                # creates <stem>_edit/ project, prints project dir
ve words                       # transcribe + line/retake summary  ← plan from THIS
ve plan --auto                 # writes edit.json: drops retakes/fillers/dead air
# (edit edit.json: tweak keep_lines, add gfx/sfx — see spec below)
ve cut                        # snap boundaries, render cut.mp4 (cached across feedback rounds)
ve render                     # captions + gfx + music + sfx + loudnorm → versions/vN.mp4 + auto-QC
ve review                     # review room (run in background Bash), notes → notes.json
ve taste                      # archive notes into taste.md inbox
```

All commands after `init` take `-p <projectdir>` (or run them with cwd = project dir).

## Workflow rules (follow exactly)

1. **Before planning anything, read the project's `taste.md`.** Every rule in it is binding.
2. `ve plan --auto` already produces a correct cut (last take wins, fillers dropped).
   Only adjust `keep_lines` when the transcript summary shows a reason.
3. Add `gfx` for the 3–8 strongest moments — hook, numbers, names, the CTA. Load
   `references/graphics.md` for the spec vocabulary. Don't decorate every line.
4. A version is DONE only when `ve render` ends with `QC: PASS`. On FAIL, fix and re-render —
   never hand the user a failing version.
5. Feedback round: user says feedback is done → `ve taste` → read printed notes →
   apply smallest change (usually only `edit.json` + `ve render`; re-`cut` only if
   keep_lines changed) → distill each note into a permanent rule under `## Rules` in
   `taste.md` → render new version → tell user the new version number.

## edit.json (the only file the model writes)

```json
{
  "keep_lines": [1, 2, 5, 6],          // line ids from `ve words`
  "zoom": "auto",                      // or [] to disable punch-ins
  "captions": true,
  "music": "auto",                     // or {"file": "assets/music/x.mp3", "gain_db": -15}
  "sfx": "auto",                       // or [{"line": 5, "name": "whoosh"}]
  "gfx": [
    {"line": 1, "type": "impact",  "text": "AI EDITED THIS"},
    {"line": 5, "type": "stat",    "text": "$2,000", "label": "per month", "d": 2.5},
    {"line": 6, "type": "keyword", "text": "Claude Code", "pos": "top"}
  ]
}
```

`line` anchors to the line's start (use `"t": <seconds>` in source time for mid-line).
Types: `impact keyword stat lower_third image broll` — details in `references/graphics.md`.
Music/SFX assets: drop files in `<project>/assets/music/` and `assets/sfx/`; `"auto"` picks
sensibly and silently skips whatever's missing (never fails). Audio detail: `references/audio.md`.
Review room details: `references/review.md`.

## Branding

`<project>/config.json`: `accent` (hex), `font_file` (path to a .ttf/.otf, e.g. Bebas Neue),
`caption_words` (default 3). Set once per client; every template obeys it.
