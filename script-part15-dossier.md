# Part 15 — documentary cut: "The Loan That Grew"

The Part 15 script, retold in the **3D-mannequin documentary** format
(@Blackfiles-HD and the lane the Jacksons AI walkthrough breaks down): one
anonymous faceless figure, a case file, real dates, real arithmetic, and the
mechanism revealed as the turn.

- Rendered: `video/src/doc/Dossier.tsx` → `media/part15-dossier.mp4`
  (1080×1920 · 30fps · 600 frames · 20.0s)
- Captions/VO timing: `media/part15-dossier.srt`
- Kinetic-typography version of the same script: `script-part15-student-loans.md`

## What the format actually is

From the channel and the walkthrough, the lane has five fixed rules:

1. **Featureless matte 3D mannequins.** No faces, ever. The anonymity is the
   point — the viewer projects themselves onto the figure.
2. **One real story, real numbers, real dates.** The narration is past tense,
   third person, and never editorialises. Documentaries state; they don't sell.
3. **Cinematic grade:** near-black teal shadows, a single warm practical, heavy
   volumetric haze, shallow depth of field.
4. **Slow camera, hard cuts.** Each shot pushes or pulls a few percent; cuts are
   hard, roughly every 2–3 seconds. Nothing dissolves.
5. **Burned-in narration** at the bottom third, plus a monospace case-file slug
   at the top. Suspense is built with gaps in the VO, not with music stabs.

## The read (VO script)

Sixty-two words, ~19s at documentary pace, cut so every line lands on its shot.

| # | In | Out | Narration |
|---|---|---|---|
| 1 | 0.00 | 2.40 | She borrowed thirty thousand dollars. |
| 2 | 2.40 | 5.53 | She paid every month for five years. |
| 3 | 5.53 | 8.53 | The balance was thirty-one thousand, seven hundred and ninety. |
| 4 | 8.53 | 10.33 | Nothing had gone wrong. |
| 5 | 10.33 | 13.73 | The interest billed more than she paid. |
| 6 | 13.73 | 16.20 | The twenty-five dollar difference was added back. |
| 7 | 16.20 | 18.20 | She was never repaying a loan. She was renting money. |
| 8 | 18.20 | 20.00 | There is a contract where a loan earns nothing. Qard hasan. |

Voice direction: female or neutral, low register, unhurried, no upspeak. In
ElevenLabs use v3, generate in ≤40-word chunks, and leave the gaps between lines
1–2 and 6–7 untouched — the silence is what makes line 7 land.

## Shot list (as rendered)

| # | Frames | Sec | Shot |
|---|---|---|---|
| 1 | 0–72 | 2.40 | Seated mannequin at a desk, single lit screen, contract on the desk. Slow push. Slug: `CASE FILE 015 · STUDENT DEBT` |
| 2 | 72–166 | 3.13 | Grid of 60 payment squares filling in one by one; figure watching from the right. Counter runs to $9,000. |
| 3 | 166–256 | 3.00 | The statement, lit from above, push-in. `$31,790` stamps on in red. |
| 4 | 256–310 | 1.80 | Figure alone, cold rim light, camera pulls back. "Nothing had gone wrong." |
| 5 | 310–412 | 3.40 | Data wall: interest billed $175 vs paid $150, figure silhouetted watching. |
| 6 | 412–486 | 2.47 | The $25 gap rising back into the balance; balance ticks 31,765 → 31,790. |
| 7 | 486–546 | 2.00 | Figure before a vault door, rim-lit. "She was renting money." |
| 8 | 546–600 | 1.80 | Card: QARD HASAN — borrow 30,000, repay 30,000. Part 15 tag. |

## The arithmetic (unchanged, still real)

$30,000 at 7% APR against a $150/month income-driven payment: interest bills
$175 in month one, $25 is capitalised every month, and after 60 payments
($9,000 paid) the balance is $31,789.82. `node video/scripts/part15-math.mjs`.

## Prompt pack — generating this with AI footage instead

The rendered file is a complete 20s cut and doubles as the animatic. To produce
the AI-generated version, keep the shot list and timings above and run this pack
through the walkthrough's pipeline (images → image-to-video → assemble to VO).

### Style suffix — append to EVERY prompt

> featureless matte grey 3D mannequin character, no facial features, no eyes, no
> mouth; cinematic 3D render, single hard key light through heavy volumetric
> haze, deep teal-black shadows, one warm amber practical, desaturated film
> grade, shallow depth of field, 35mm lens, subtle film grain, vertical 9:16
> framing, no text, no logos, no watermarks

### Character sheet (generate first, reuse as reference in every clip)

1. **THE BORROWER** — "Full-body character sheet of a featureless matte grey 3D
   mannequin in a plain hooded sweatshirt and jeans, neutral standing pose,
   three-quarter view, seamless dark studio background, soft rim light from
   camera left."
2. **THE LENDER** — "Featureless matte grey 3D mannequin in a dark tailored
   suit, standing behind a desk, hands clasped, seamless dark background, cold
   blue rim light." (Used only if you extend past 20s.)

Generate 4–5 variants, keep one of each, and attach them as references on every
video generation so the figure stays consistent.

### Shot prompts (image-to-video, ~3s each)

1. "A featureless matte grey mannequin sits alone at a desk in a dark room,
   signing a document; the only light is a warm laptop screen throwing amber
   across the desk and its chest. Slow dolly-in. Dust drifts through the beam."
2. "The same mannequin seen small in a vast dark hall, facing a wall of sixty
   glowing amber squares that light up one after another, left to right, like
   months on a calendar. Slow push-in, camera behind the figure."
3. "Extreme close-up of a printed bank statement lying on a dark desk under a
   hard overhead light; the paper is sharp, the room behind is black. Slow
   push-in on the balance line. Handheld micro-drift."
4. "A featureless matte grey mannequin stands motionless in an empty concrete
   room, lit by a single cold blue shaft from a high window; long shadow across
   the floor. Camera pulls slowly back."
5. "A featureless matte grey mannequin stands with its back to camera in front
   of an enormous dark data wall showing two glowing horizontal bars, one red
   and longer, one white and shorter. Volumetric haze, slow push-in."
6. "Close-up of small glowing amber cubes drifting upward through darkness and
   being absorbed into a red glowing number floating above; heavy haze, slow
   rise, camera tilts up."
7. "A featureless matte grey mannequin stands in silhouette before an enormous
   circular steel vault door, warm light escaping around its edge; the figure is
   dwarfed. Slow push-in, backlit rim."
8. "Empty black frame with a single soft shaft of light and slow drifting dust —
   a hold plate for an end card. No characters."

Safety note from the walkthrough: if a video model refuses a prompt, it is
almost always one word. Ask the chatbot to rewrite that chunk "safer for video
generation models" rather than rewriting the shot.

### Music (Suno, instrumental)

> Slow-burn documentary underscore, sparse low piano and sub bass, one sustained
> string pad, quiet ticking pulse, growing tension, no drums until the final
> four seconds, cold and restrained, 20 seconds.

Mix at about −12 dB under the VO, fade in over the first second, fade out on the
end card.

### Thumbnail prompts

1. "Featureless matte grey mannequin sitting on the floor surrounded by printed
   bank statements in a dark room, one warm light overhead, cinematic 3D render,
   9:16, no text."
2. "Close-up of a featureless matte grey mannequin's hand holding a bank
   statement, a red balance figure glowing on the paper, dark room, cinematic."
3. "Featureless matte grey mannequin standing small before a giant glowing red
   number floating in darkness, volumetric haze, cinematic 3D render."

Add the number `$31,790` and a two-word overlay in the editor, not in the
prompt — the models still mangle text.

### Assembly

Import clips, VO chunks and music into the editor; lay the VO to the timings in
the table above, trim each clip to its shot length, keep the gaps, and keep the
last frame of the vault shot held under the end card. Burn in the captions from
`media/part15-dossier.srt`.
