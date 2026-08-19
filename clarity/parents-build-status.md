# "The one sound the Quran forbids you to make" — build status

The scene pack, the two prompt packs, `timeline.csv` and 89 stills are in the
repo, the timeline is built and checked, and the film renders. What it does not
have yet is a voice.

| | |
|---|---|
| Composition | `Parents-OneSound` — 1920×1080, 30fps, 29:45 (53,550 frames) |
| Timeline | `video/src/parents/timeline.ts`, generated from `clarity/parents-timeline.csv` |
| Stills | 89 of 101 in `video/public/parents/` |
| Re-frames | 20, set as camera moves on their parent still — no generation |
| Arabic cards | 9, typeset in Amiri (naskh), never generated |
| Voiceover | **none supplied** |
| Captions / SRT | **blocked** — see below |

Build and render:

```bash
cd video
npm run timeline:parents    # parse + check the pack, then write timeline.ts
npm run render:parents      # -> media/parents-one-sound.mp4
```

`npm run timeline:parents` re-runs the pack's own audit mechanically on every
build and fails rather than warns: shot ids sequential S01–S121, all 130 events
continuous with no gap or overlap, every stated duration equal to its own span,
runtime resolving to exactly 29:45, every re-frame naming a real still, and
every timecode in the CSV agreeing with the same shot's timecode in section 04
of the scene pack. All of those pass today.

## What is blocked, and on what

**Captions cannot be built.** They need two things this session does not have:

1. **The voiceover recording.** No audio file was supplied. Nothing in the repo
   or the uploads carries a read.
2. **The script.** The pack is the visual build; it says the script "lives in
   `parents-video-reverse-engineer.txt`, section 05", and that file is not in
   the repo and was not uploaded. `timeline.csv` carries prompts, not spoken
   lines. There is therefore no text to caption, independent of the audio.

Supply both and the caption path is the one the Shorts already use: cut the
lines per shot, force-align them against the read with `scripts/force-align.py`,
regenerate the timeline off the alignment instead of the pack's designed
timecodes, and write the SRT from the same boundaries as the cuts. Nothing
downstream assumes the pack's numbers are final — they are simply the best
timing available until a read exists.

**12 stills are not generated.** S07, S19, S33, S48, S66, S69, S71, S79, S85,
S92, S101, S118. Seven re-frames hang off them (S20, S34, S49, S70, S93, S102,
S121), so 19 of the 130 events have no artwork. Those events render as a labelled
slate for their full duration, which keeps the cut whole and every later timecode
true, and makes the holes visible rather than silent. Ready-to-paste prompts for
exactly those twelve, with the re-frame parentage and the resolution each needs,
are in `parents-prompts-outstanding.txt`.

Four of the twelve are the pack's own style-lock and keystone shots: S33 is the
uff flame the whole keystone chapter turns on, S48 is the open plain that also
closes the film as S121, S69 opens the Jurayj chapter and S92 opens chapter 09.
Generate those four first.

## Two things the build cannot decide for you

**Track A or Track B.** Everything here is Track A — 101 stills as written. The
pack's Track B swaps 18 of them for figure-free alternates. That is a channel
position, not a build setting, and it is cheaper to settle now than after the
remaining generations are paid for.

**The nine Arabic cards need a human proof.** They are typeset rather than
generated, which removes the worst failure, and the Arabic in `timeline.ts` is
carried through from the CSV rather than retyped anywhere in the build. It still
has to be checked against a mushaf by someone Arabic-literate, vowel marks
included, before publish. The pack calls this the highest-risk item in the
production and this build does not discharge it.

## Two things worth knowing about the artwork

**The stills are 1376×768.** That is under a 1080p timeline, so every shot is
being upscaled ~40% before its push even starts. It is visibly soft on the
detail pushes. The pending-prompt pack already flags this; re-generate at
1920×1080 or larger going forward, and 2560×1440 for anything a re-frame pushes
into.

**Runtime is 29:45, so the thumbnail rule applies.** Well past the 180s Shorts
cap, so this publishes as long-form and needs a 1280×720 16:9 thumbnail with the
`thumbnail` key set in its upload config. Section 05 of the pack specifies the
card: title in the upper third on bare cream, illustration band below with torn
deckled edges, line 1 navy, line 2 ochre. Not built yet.
