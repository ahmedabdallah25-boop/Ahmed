# B-roll image prompts — Episode 2 (Halal Mortgage)

Twelve stills. The episode is pure motion graphics right now, so b-roll's job is
to break up the longest talking stretches — not to carry information. Nothing in
these frames says anything the VO doesn't.

## House style (append to every prompt)

> Cinematic still, single soft key light from the left, deep near-black
> background (#06080B), muted desaturated palette with one warm amber accent,
> shallow depth of field, 50mm, subtle film grain, cool neutral grade, editorial
> product-photography feel, 16:9, 1920×1080.

**Negative prompt (all frames):**

> text, lettering, logos, watermarks, brand names, faces, people looking at
> camera, hands with distorted fingers, currency symbols, stock-photo smiles,
> HDR glow, oversaturation, clutter, tilted horizon, cartoon, illustration

**Why these constraints:** the channel is faceless, so no identifiable faces; the
overlays are gold-on-near-black, so anything bright or busy kills the type; and
readable text inside an image fights the on-screen text and dates the frame.

## Treatment in the edit

- Hold each still **2.5–3.5s** with a slow 4–6% push in or a 40px drift. Any
  longer reads as a stall.
- Under type: drop the image to **35–45% opacity** over the dark bed, or lay a
  `#06080B` scrim at 55%. Full-frame only in the gaps between text beats.
- Never cut away during the amortisation chart (2:18–3:10) — the storyboard is
  right that the chart is the whole scene.

## Placement

| # | Timecode | Scene | Prompt |
|---|---|---|---|
| 1 | 0:05–0:09 | Open, after the brand card | A single house key resting on a folded mortgage offer letter, blurred paperwork behind, one amber highlight along the key's edge |
| 2 | 1:26–1:32 | What a mortgage actually is | A bank cheque book and a fountain pen on a dark desk beside a set of house keys, the keys slightly out of focus and further away |
| 3 | 1:40–1:46 | The charge, not ownership | Close macro of an official land-title register page under raking light, a red wax-style seal at the edge, most of the page falling into shadow |
| 4 | 1:55–2:01 | The risk stays with you | A cracked ceiling corner with a water stain, rain visible through a window behind it, cold blue light, no people |
| 5 | 3:12–3:18 | The principle (restrained) | An antique brass balance scale in perfect equilibrium on a dark surface, two empty pans, one amber rim light, nothing else in frame |
| 6 | 4:05–4:11 | Murabaha — the bank buys | A merchant's hardbound ledger open to a blank column of ruled lines, a small brass price tag lying on the page |
| 7 | 4:30–4:36 | Murabaha — sold on to you | Two hands mid-exchange of a single key over a signed contract, cropped at the wrists, warm amber key light, dark background |
| 8 | 5:00–5:06 | Ijara — the bank holds title | A tenancy agreement in a document wallet on a windowsill, a bunch of keys sitting on top, rain-blurred window behind |
| 9 | 5:45–5:51 | Ijara — the owner carries the loss | A boiler access panel open with a spanner resting against it in a dim utility cupboard, dust in the light beam |
| 10 | 6:20–6:26 | Musharaka — co-ownership | Two identical sets of house keys side by side on a dark slate surface, equal light on both, one amber accent between them |
| 11 | 8:00–8:06 | The four questions | A fountain pen hovering over a signature line on a thick contract, the page shot at a low angle so most of it is dark |
| 12 | 10:02–10:08 | Close & next | Row of modest British terraced houses at blue hour, lit windows, damp pavement reflecting amber street light, shot from across the road |

## If you want more coverage

The two longest stretches are Ijara (4:53–6:17, 84s) and the four questions
(7:52–9:23, 91s). Both can take a second still each — an empty stairwell of a
new-build for Ijara, and a franked envelope on a doormat (the late-payment
letter) for question four — but past that, more b-roll starts competing with the
diagrams instead of resting the eye.

## Wiring them in

Drop the files in `video/public/broll/` as `01.jpg … 12.jpg`, and I can add a
`BRoll` layer to the Remotion project: one array of `{file, at, dur, opacity}`
rows, timed in seconds like `timing.ts`, sitting under the type with the scrim
and push already applied.
