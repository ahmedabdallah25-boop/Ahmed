# "The one sound the Quran forbids you to make" — build status

The film is cut to the recorded read, captioned, and renders end to end. One
chapter's narration is missing and twelve stills are not generated; both are
listed below and both are visible in the cut rather than papered over.

| | |
|---|---|
| Composition | `Parents-OneSound` — 1920×1080, 30fps, **29:38** (53,349 frames) |
| Timing | forced alignment of the read; pack timecodes are no longer used |
| Narration | 19 clips, 28:35, assembled + card gaps → `video/public/vo-parents.mp3` |
| Captions | `media/parents-one-sound.srt` — 344 cues |
| Stills | 89 of 101 in `video/public/parents/` |
| Re-frames | 20, camera moves on their parent still — no generation |
| Arabic cards | 9, typeset in Amiri (naskh), never generated |

## How it is built

```bash
cd video
npm run map:parents   -- <clips-dir> scripts/parents-units.json scripts/parents-clip-map.json
npm run align:parents -- <clips-dir> scripts/parents-units.json scripts/parents-clip-map.json \
                         scripts/lexicon-clarity.dict scripts/parents-aligned.json
npm run timeline:parents          # pack + alignment -> src/parents/timeline.ts
npm run vo:parents    -- <clips-dir>   # read + card gaps -> public/vo-parents.mp3
npm run srt:parents               # -> media/parents-one-sound.srt
npm run render:parents            # -> media/parents-one-sound.mp4
```

`scripts/parse-script.py` turns the tagged script into the 365 caption units the
alignment measures; re-run it if the script changes.

## Why the timing is what it is

The pack designed 29:45. The read came in at 28:35 with the picture unchanged,
so the pack's timecodes could not be used: a shot has to be on screen for the
words it illustrates.

- **Every chapter boundary is measured.** Script blocks and pack chapters are the
  same divisions of the film, so a chapter runs for exactly as long as its
  block's narration does. 337 of the 344 recorded sentences were placed
  acoustically by forced alignment; 7 carry an interpolated boundary.
- **Shots inside a chapter keep the pack's proportions** across that measured
  span. That is a claim about pacing, not about content — no shot boundary was
  ever measured against a word.
- **The nine cards cut a gap into the read.** The pack wants silence under them
  and the delivered read is continuous, so `build-vo-parents.mjs` cuts
  1.5s + 4s + 1.5s in at each one. Each card lands on a sentence end (the audio
  cannot be cut mid-word) that is also a shot boundary (the picture cannot be
  interrupted mid-shot), which puts every card within a few seconds of its
  designed position.

Two independent checks that the alignment is real, not plausible: the line
"Do not say to them: uff" lands at **7:41** against a designed 7:40, and the
centrepiece card C5 lands at **7:56** against a designed 7:52.

The clip → block mapping is not assumed from filenames. `map-clips-to-blocks.py`
decodes each clip and matches it against the script, which is what caught that
block 11 was regenerated 22 minutes after the rest of the session.

## What is missing

**Chapter 10's narration, from "Go back to al-Isra" to "It does not leave you to
find the words"** — 19 sentences, the whole first two-thirds of the "lower the
wing" chapter. Only its closing 42 seconds were recorded (block 10's clip is
41.6s against ~2 minutes of script). The chapter therefore runs 49s instead of
2:00 and the wing imagery has almost no room. This is the one thing standing
between this cut and a finished film: record block 10 from the top, drop the
clip in with the others, and re-run the four commands above.

**12 stills are not generated**, and 7 re-frames hang off them — 19 of the 130
events: S07, S19, S20, S33, S34, S48, S49, S66, S69, S70, S71, S79, S85, S92,
S93, S101, S102, S118, S121. They render as a labelled slate for their full
duration, so the cut stays whole and every later timecode stays true. Prompts
for exactly those twelve are in `parents-prompts-outstanding.txt`. Four are the
pack's keystones: S33 is the uff flame, S48 is the plain that also closes the
film as S121, S69 opens the Jurayj chapter, S92 opens chapter 09.

Two sentences the decode never found — "Surah al-Baqarah, verse 83." at the head
of block 03, and "The Prophet, peace be upon him, visited his mother's grave."
at the head of block 11 — get no caption cue. Both sit at the very start of a
clip, where a free decode is least reliable, so they are more likely under-read
than unrecorded. Worth checking by ear before publish.

## Two things the build cannot decide for you

**The nine Arabic cards need a human proof.** They are typeset rather than
generated, which removes the worst failure, and the Arabic is carried through
from the CSV rather than retyped anywhere in the build. It still has to be
checked against a mushaf by someone Arabic-literate, vowel marks included. The
pack calls this the highest-risk item in the production and this build does not
discharge it.

**Track A or Track B.** Everything here is Track A — 101 stills as written. Track
B swaps 18 for figure-free alternates. Settle it before paying for the remaining
generations.

## Two things worth knowing about the artwork

**The stills are 1376×768**, under a 1080p timeline, so every shot is upscaled
~40% before its push starts. Generate the remaining twelve at 1920×1080 or
larger, and 2560×1440 for anything a re-frame pushes into.

**Runtime is 29:38, so the thumbnail rule applies**: past the 180s Shorts cap, so
this publishes as long-form and needs a 1280×720 16:9 thumbnail with the
`thumbnail` key set in its upload config. Section 05 of the pack specifies the
card. Not built yet.

## The other pack in this folder

`scene-pack-evil-eye.txt` also has a partial read — 11 clips, 5:02, covering
scenes 1–10 and 16–30 of 30, with scenes 11–15 unrecorded and scenes 16–18
recorded twice. `scripts/map-vo-chunks.py` produced that inventory
(`video/scripts/vo-map-evil-eye.json`). That film has no artwork generated at
all, so nothing further was built for it.
