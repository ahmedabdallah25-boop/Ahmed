# House style — Finance % Decoded

**This file is the source of truth for how videos on this channel look.** Read it before
writing any scene pack. It exists because the pension pack was written on 2026-08-08 for a
3D faceless low-poly style that the channel had already moved away from — its negative
prompt excluded `facial features, eyes, mouth, nose, cartoon outlines, flat vector, 2D
illustration`, every one of which the house cast requires. The pack had to be rewritten
end to end. That was avoidable and this file is the fix.

> **If a scene pack and this file disagree, this file wins.**
> **If this file and the character sheets disagree, the sheets win.**

---

## Render style

**Flat 2D vector illustration.** Not 3D. Not photoreal. Not low-poly.

- Clean, **even-weight** dark brown `#3D2B23` outlines on every shape. The line never
  thickens, tapers, or goes sketchy.
- Flat colour fills with only soft, minimal shading. No gradients, no glow, no airbrush.
- Warm cream background `#F7EFDD`, kept plain and uncluttered.
- Figures sit on a soft pale elliptical ground shadow. Props get a simple flat drop shadow
  offset down-right. Nothing more.
- Faces are simple: solid dot eyes, fine curved eyebrows, a small simple mouth, a minimal
  nose line. Beards are flat shapes, not rendered hair.
- Rounded, friendly proportions. Characters read at roughly 6–7 heads tall.
- Props and environments are drawn in the **same** flat vector language as the characters.
- 9:16 vertical, subject in the lower two-thirds, clean headroom above for captions.

**No film grain.** It suited the old 3D look and actively fights this one — on flat colour
it reads as compression artefact.

### Palette

| Role | Hex |
|---|---|
| Background cream | `#F7EFDD` |
| Outline dark brown | `#3D2B23` |
| Sage green (Kareem) | `#7C8A5F` |
| Rust red (Adam) | `#B5603F` |
| Teal (Sami) | `#2F6B72` |
| Sand (Bilal) | `#D9C08D` |
| Camel | `#B8823C` |
| Charcoal grey | `#5A5A5A` |
| Espresso | `#4A342A` |
| Institution grey | `#8A8A8A` |

### Standard negative prompt

```
3D render, 3D model, photorealistic, photograph, realistic skin texture, clay render,
low-poly, depth of field, bokeh, blurred background, gradient mesh, airbrushed shading,
painterly brush strokes, watercolour, sketchy lines, variable line weight, hatching,
film grain, gritty texture, harsh dramatic lighting, deep cast shadows, text, lettering,
watermark, logo, signature, brand marks, extra fingers, distorted hands, extra limbs,
cluttered background, busy detail, neon colours, oversaturated, blurry, low resolution
```

---

## The cast

Four named characters plus an institution device set. **They have character sheets — attach
the relevant sheet as an image reference on every scene containing that character.** Prompt
text alone drifts within about five generations; the beard shape and eye spacing go first.

### KAREEM — the host
Dark near-black tousled hair, full dark beard with grey speckling, fair skin. Sage green
`#7C8A5F` henley with a three-button placket, sleeves rolled. Charcoal trousers, dark brown
shoes.
**Sheet:** front / 3-4 / side + NEUTRAL, WARM, SERIOUS, QUESTIONING.
**Use him for direct address only** — the hook, the reveal setup, the turn, the close. Keep
him out of the mechanism scenes. Standing outside the diagram is what makes him read as the
person explaining it rather than a character inside it.

### ADAM — the everyman *(sheet titles him "the cardholder")*
Short brown side-parted hair, clean-shaven, fair skin. Rust red `#B5603F` t-shirt, camel
`#B8823C` trousers, dark brown shoes.
**Sheet:** front / 3-4 / side + NEUTRAL, PLEASED, WORRIED, RESOLVED.
**The viewer's stand-in.** His four expressions map cleanly onto a standard arc — neutral at
the open, worried through the reveal, resolved at the fix — which is why he carries the
emotional through-line in most packs.

### SAMI — the colleague
Short dark hair, dark beard with grey speckling, medium-tan skin. Teal `#2F6B72` t-shirt,
charcoal trousers.
**Crowd and comparison beats.** No expression sheet yet.

### BILAL — the older colleague
Dark brown hair, full dark brown beard (fullest of the four), medium-tan skin. Sand
`#D9C08D` button-up with rolled sleeves, espresso trousers.
**Reads as the eldest.** Use him wherever age or "later in life" is the point. No expression
sheet yet.

### THE INSTITUTION — device set
- **THE CLERK** — a plain mid-grey `#8A8A8A` featureless humanoid silhouette. No face, no
  clothing detail, no colour.
- **THE COUNTER** — teller window: dark vertical bars, rust red ledge, olive lower panel.
- **THE PAPER** — blank cards and blank open documents, flat, from above.

**This is the strongest device the channel owns and it should be used deliberately.** The
grammar is already doing the argument's work: *named people have faces and colour, the
institution has neither.* Every video on this channel is ultimately about a decision made
for someone by something they never met. Let the grey silhouette carry that, rather than a
line of voiceover. Never give the institution a named face; never let Kareem or Adam stand
in for it.

---

## Open gaps

- **Sami and Bilal have no expression sheets.** Fine while they stay in crowd and mid-shot
  beats. Any pack that needs either of them in close-up on an emotional beat should generate
  a 4-expression sheet first, matching Kareem's and Adam's layout.
- **No female characters in the cast.** Worth noting plainly: the audience for this channel
  is not all men, and every subject it covers — pensions, mortgages, cards, savings — applies
  regardless. This is a real gap in the roster, not a stylistic choice, and it is the most
  obvious next addition to the cast.

---

## Scene-pack conventions

Every pack in this repo follows the same layout, and new packs should match it:

1. Header — title, render style, aspect, runtime, scene count, target publish
2. **WHY THIS ONE, AND WHY NOW** — the evidence for the subject and the format
3. **WHAT MOVES, AND WHAT IS HELD CONSTANT** — name the single variable under test
4. Negative prompt, style lock, brand-safety note
5. Cast and consistency workflow
6. Full VO script as one copyable block with ElevenLabs v3 tags
7. Numbered scenes — timecode, VO, two caption lines, self-contained image prompt
8. Character appearance map
9. Caption burn-in spec, edit and assembly notes, retention checkpoints
10. **Accuracy notes** — every claim that must hold, and every one deliberately weakened
11. Upload metadata — title, description, tags, ready to paste into `automation/reset.json`

Existing packs to match: `klarna-scene-pack.txt`, `pension-scene-pack.txt`,
`inflation-scene-pack.txt`.

## Editorial rules that outrank style

- **Name no product.** Terms and availability change; a video that names one is out of date
  the month it does. Teach the test instead — that is also what makes a pack a template.
- **No `#riba` in titles.** The English SERP is contested by the Royal Institute of British
  Architects. Keep *riba* in the description, script and tags.
- **Every Short is self-contained.** A "next" tease is fine; homework is not.
- **Custom thumbnail on every upload.** Flat vector is an advantage here — big flat shapes
  survive being shrunk to a phone tile in a way soft 3D renders do not.
- **Do not cut for length.** 133–180s produced four of the channel's five best videos. See
  `next-slate.md` rule 5.
