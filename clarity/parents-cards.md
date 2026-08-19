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

No ASR was available, so cards are aligned by proportional distribution: the read
follows the script verbatim, so script words are spread across the master's **speech**
intervals (silences from `ffmpeg silencedetect`, dumped to `parents-silence.txt`) in
proportion to duration, then each card start is snapped to the nearest real pause
within 2.5s. Measured drift on ten probe phrases before snapping: within ±2.1s.

**Do one scrub pass before rendering.** Anything late by a beat, change the anchor
phrase in the build script rather than the timestamp — a rebuild keeps it.

## Verse manifest — VERIFY EVERY LINE

| At | Ref | Arabic on card |
|---|---|---|
| 0:18 | 5 places | `وَبِٱلْوَٰلِدَيْنِ إِحْسَـٰنًا` |
| 1:18 | 17:23 | `قَضَىٰ` (term card) |
| 2:22 | 17:23 | `إِمَّا يَبْلُغَنَّ عِندَكَ ٱلْكِبَرَ أَحَدُهُمَآ أَوْ كِلَاهُمَا` |
| 5:39 | 31:14 | `أَنِ ٱشْكُرْ لِى وَلِوَٰلِدَيْكَ` |
| 6:33 | 31:14 | `وَهْنًا عَلَىٰ وَهْنٍ` |
| 6:51 | 17:23 | `فَلَا تَقُل لَّهُمَآ أُفٍّ` |
| 10:13 | 17:23 | `قَوْلًا كَرِيمًا` |
| 20:06 | 31:15 | `فَلَا تُطِعْهُمَا وَصَاحِبْهُمَا فِى ٱلدُّنْيَا مَعْرُوفًا` |
| 26:18 | 17:24 | `وَٱخْفِضْ لَهُمَا جَنَاحَ ٱلذُّلِّ مِنَ ٱلرَّحْمَةِ` |
| 27:50, 30:50 | 17:24 | `رَّبِّ ٱرْحَمْهُمَا كَمَا رَبَّيَانِى صَغِيرًا` |

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
