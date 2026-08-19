# Overlay cards — "The One Sound the Quran Forbids You to Make"

27 cards across the 31:28 master. Track: `clarity/parents-cards.ass` (1920×1080).
Generator: `clarity/parents-cards.build.py` — **edit the card table there, then regenerate.**
Hand-editing the `.ass` is fine for nudges, but a rebuild overwrites it.

## The rule this file cannot break

Every Arabic line below is written from knowledge, not from an open mushaf.
**Check each one against a mushaf before you burn it in.** This channel's whole
proposition is that the text on screen is right; you only get caught once.
The English on the cards is the script's own wording, so it needs no separate check.

## Card design

Four card types, all on the same slab so they read as one system:

| Type | Slab | Position | Contents |
|---|---|---|---|
| **Verse** | 1360×250–300 | centre (y 540) | gold reference kicker · Arabic 76px · gold hairline · English · gold hook line |
| **Term** | 1120×210 | lower band (y 828) | Arabic 72px · transliteration in gold caps · one-line gloss |
| **Hadith** | 1260×200 | lower band | source badge · hairline · quote |
| **Hook** | 1180×168 | lower band | one line, 54px bold, key word in gold |

- Slab `#120C08` at ~85% opacity, 3px gold `#D9A441` border at ~70%, no shadow.
- In: 240ms fade + a 92→102→100 scale pop on the text, staggered 100–250ms per line
  so the card assembles rather than appearing. Out: 220ms fade.
- Every hook line carries **the half of the point the narration doesn't say twice** —
  never a transcript of the sentence under it. That is what makes a card screenshot-able.
- Hero verse cards sit centre-frame; everything else stays in the lower band so the
  illustration keeps the top two-thirds.

## Timing

`parents-align.py` aligns the verbatim script to the audio without ASR (every model
host — huggingface.co, openaipublic, download.pytorch.org, alphacephei — is blocked by
this environment's egress policy, so Whisper/Vosk/torchaudio aligners are unavailable).

The method is a Viterbi alignment over sentence boundaries: each sentence end should
land in one of the master's 418 detected silences, and a sentence's spoken duration
should track its word count. The DP picks the monotone assignment minimising total
|actual speech time − expected time|, letting one span carry several sentences where
the reader ran them together. Result: 367 sentences → ~290 spans, median span 4.2s,
median fit residual 0.39s (p90 1.55s). Card entries are then nudged up to 1.2s onto a
real pause.

**Accuracy, honestly.** There is no ground truth available in this environment, so the
residual above measures fit, not error. Two independent checks against the artwork do
hold: at 26:56 the frame is a wing ("lower to them the wing") and at 29:29 it is a
desert road with a grave mound ("she died, on a road, far from home"). Both land where
the alignment says they should.

> An earlier version of this track timed cards by spreading words evenly across the
> whole 31 minutes. That drifted up to ~40s (it put the wing card at 26:18, where the
> artwork is still oil lamps). If you have a copy of that build, discard it.

**Still do one scrub pass before rendering.** Anything late by a beat, change the anchor
phrase in the build script rather than the timestamp — a rebuild keeps it.

## Verse manifest — VERIFY EVERY LINE

Timecodes are in `parents-cards.ass`; regenerate rather than transcribing them here.

Term cards (`بِرّ`, `عُقُوق`, `عِندَكَ` folded into the 17:23 card) are single words —
check the vowelling. The two hadith attribution badges also need checking: the
gravest-sins ordering and "let your struggle be with them" are given as Bukhari &
Muslim; the "Paradise at her feet" card states the dispute on its face, which is the
honest way to put it on screen and matches what the narration says.

## Rendering

The Arabic style is set to **Amiri** — install it (`fonts-hosted-amiri` / Google Fonts)
before burning in. Without it libass substitutes a font with no Arabic shaping and the
letters come out disconnected.

```
ffmpeg -i master.mp4 -vf "ass=clarity/parents-cards.ass" -c:a copy out.mp4
```

Your ffmpeg must be built with libass. Check one frame at 6:51 (the uff card) before
committing to a full render — it proves shaping, RTL order and the font at once:

```
ffmpeg -ss 415 -copyts -i master.mp4 -vf "ass=clarity/parents-cards.ass" -frames:v 1 uff.png
```

**`-copyts` matters.** Without it, seeking with `-ss` before `-i` resets output
timestamps to zero and the ass filter draws whatever card sits at 0:00 — which looks
exactly like "the cards aren't rendering."

## Verified

Rendered and checked in-session against the 640×360 preview master, upscaled to 1080p:
Arabic shapes and joins correctly, runs right-to-left, and the slabs sit clear of the
paper border in the artwork. `clarity/parents-cards-preview.mp4` is that burn-in.
It is built from the **preview** file, so it is for checking timing and layout only —
re-render from the full-resolution master for publish.
