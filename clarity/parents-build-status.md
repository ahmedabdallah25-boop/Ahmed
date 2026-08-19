# "The one sound the Quran forbids you to make" — build status

The film is cut to the recorded read, captioned, and renders end to end. One
chapter's narration is missing and twelve stills are not generated; both are
listed below and both are visible in the cut rather than papered over.

| | |
|---|---|
| Composition | `Parents-OneSound` — 1920×1080, 30fps, **31:27** (56,637 frames) |
| Timing | forced alignment of the read; pack timecodes are no longer used |
| Narration | 20 clips, 30:24, complete; assembled + card gaps → `video/public/vo-parents.mp3` |
| Captions | `media/parents-one-sound.srt` — 365 cues, every sentence |
| Stills | **101 of 101** in `video/public/parents/` |
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

The pack designed 29:45. The read came in at 30:24 with the picture unchanged,
so the pack's timecodes could not be used: a shot has to be on screen for the
words it illustrates.

- **Every chapter boundary is measured.** Script blocks and pack chapters are the
  same divisions of the film, so a chapter runs for exactly as long as its
  block's narration does. 361 of the 365 sentences were placed acoustically by
  forced alignment; 4 carry an interpolated boundary.
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

Neither the clip → block mapping nor the reading order is taken from filenames.
`map-clips-to-blocks.py` decodes each clip, matches it against the script, and
orders the clips by the block they read and the first sentence they reach. That
is what caught block 11 being regenerated 22 minutes after the rest of the
session, and it is what placed a clip delivered as plain `Al_Isra_.mp3`, with no
timestamp to sort on, correctly at the head of chapter 10. Run over the 19
timestamped clips it independently reproduces their timestamp order.

## What is still open

**No artwork is outstanding.** The last twelve stills — S07, S19, S33, S48, S66,
S69, S71, S79, S85, S92, S101, S118 — arrived on 2026-08-19, which also unblocked
the seven re-frames hanging off them (S20, S34, S49, S70, S93, S102, S121). All
130 events now draw on a real plate; the slate path in `Parents.tsx` stays for
the next pack rather than for this one.

Two of the twelve are shot differently from the other ninety-nine. S33 (the uff
flame) and S66 (the two manuscript pages) are photographs of paper on a surface —
a sheet at an angle against black, and two sheets on a lit table — where every
other frame is a flat plate on cream. They read as a different kind of object in
sequence, and S33 is the film's centrepiece. Worth a regeneration before publish,
which costs two images and no rebuild beyond dropping the files in.

**No narration is outstanding.** Chapter 10's opening — "Go back to al-Isra"
through the two readings of the wing — arrived on 2026-08-19 as a 1:50 clip and
completed the read. All 365 sentences are spoken and captioned; the chapter now
runs 2:38 against a designed 2:00.

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

**Every still is 1376×768**, the last twelve included, under a 1080p timeline —
so every shot is upscaled ~40% before its push even starts, and the detail
pushes are visibly soft. Nothing in the build can recover that. If any of these
are regenerated, generate at 1920×1080 or larger, and 2560×1440 for a re-frame
parent (S19, S33, S48, S69, S92, S101 among the new ones).

**Runtime is 31:27, so the thumbnail rule applies**: past the 180s Shorts cap, so
this publishes as long-form and needs a 1280×720 16:9 thumbnail with the
`thumbnail` key set in its upload config. Section 05 of the pack specifies the
card. Not built yet.

## The other pack in this folder

`scene-pack-evil-eye.txt` also has a partial read — 11 clips, 5:02, covering
scenes 1–10 and 16–30 of 30, with scenes 11–15 unrecorded and scenes 16–18
recorded twice. `scripts/map-vo-chunks.py` produced that inventory
(`video/scripts/vo-map-evil-eye.json`). That film has no artwork generated at
all, so nothing further was built for it.
