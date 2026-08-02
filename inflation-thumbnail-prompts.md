# Thumbnail Prompts — Part 14, "Someone Takes Money From You Every Day"

Written to match `inflation-scene-pack.txt`: each prompt is complete and
self-contained, character identity and style already baked in. Same negative
prompt as the scene pack — paste it once and leave it.

**Format:** 1080×1920 (9:16). A Short's custom thumbnail shows in the channel's
Shorts grid, in search and in the subscriptions feed — never in the Shorts feed
itself, which just plays the video. So it is a browse-and-search asset. Design
for the grid: it will be seen at roughly 160px wide.

**Three rules, taken from what works on this channel:**

1. **Two visual elements maximum.** Anything more turns to mush at grid size.
2. **The picture carries the argument, the text only confirms it.** If the image
   needs the words to make sense, the thumbnail has failed.
3. **Leave a clean band for type.** Each prompt below reserves it explicitly —
   generate the plate, add the text afterwards.

**Text to overlay** (add in your editor, not in the prompt — every generator
mangles lettering). Full typography and safe-zone rules are in
[THUMBNAIL SPEC](#thumbnail-spec) at the bottom.

| Option | Line 1 (white) | Line 2 (accent) | Accent |
|---|---|---|---|
| A | More money. | Same bread. | red `#E5484D` |
| B | The tax nobody | voted for | red `#E5484D` |
| C | Money they | cannot print | gold `#E9B949` |
| D *(recommended)* | More money. | Less food. | gold `#E9B949` |
| D alt | You paid this | today. | red `#E5484D` |

Do not set the series title — "The tax nobody voted for" runs seven words and
overflows the frame at usable type size. Shorts already prints the title under
the player; the thumbnail should add a second idea, not repeat the first.

---

## NEGATIVE PROMPT — applies to all four

```
facial features, eyes, mouth, nose, lips, eyebrows, face, portrait, cartoon
outlines, cel shading, flat vector, anime, 2D illustration, text, watermark,
logo, signature, lettering, numbers, distorted hands, extra limbs, extra
fingers, blurry, low resolution, oversaturated, plastic sheen, uncanny,
cryptocurrency, bitcoin, crypto coin, digital currency symbol
```

> The last line matters. The scene pack asked scene 29 for "one gold coin and
> one silver coin" and the generator returned Bitcoin coins, which is why option
> C below bans crypto symbols explicitly. Check the output before you use it.

---

## OPTION A — THE MECHANISM *(the A/B partner for D)*

The purest read at grid size: a tower of notes against one loaf reads
instantly at any scale, and it is the film's hero frame, so the thumbnail and
the video agree.

```
Near-photorealistic symmetrical split composition on a plain pale concrete
surface: on the left, a tall towering stack of banded paper banknotes rising up
and out of the top of the frame; on the right, one single round rustic
sourdough loaf sitting alone. Equal visual weight, stark and deliberate, a
large empty gap of bare concrete between them. Hard directional side light from
the left casting two long parallel real shadows across the concrete to the
right. Muted cool concrete grey against warm banknote and golden crust tones.
Stylized matte cinematic grade, medium depth of field, both subjects sharp.
Shot from a low three-quarter angle. 9:16 vertical composition, both subjects
sitting in the lower two-thirds, upper third left as clean empty concrete and
soft shadow for a text overlay.
```

## OPTION B — THE STAKES

The scene pack's own thumbnail pick and the film's emotional peak. Weakest small
— the figure nearly vanishes in the grid — so push the character larger than the
in-video framing and let the sky do the rest.

```
Near-photorealistic wide low-angle shot of a lone stylized low-poly 3D male
character standing small and centred on a vast empty pale concrete expanse
beneath an enormous saturated blue sky that fills most of the frame. The
character has a COMPLETELY BLANK featureless head with no eyes, no nose, no
mouth, no face at all — a smooth matte tan block. Simplified geometric anatomy,
matte clay-like shading, soft subsurface material. He wears a terracotta #E85F42
t-shirt, cream #E8DCC8 trousers, white sneakers and a cream beanie. Hard midday
sun casting one long dramatic real shadow stretching behind him across the
concrete. Scale and isolation emphasised, slight wide-angle lens. Stylized matte
cinematic grade. 9:16 vertical composition, character positioned in the lower
third and rendered large enough to read clearly at thumbnail size, enormous
clean unbroken sky above for a text overlay.
```

## OPTION C — THE FIX

The only option that leads with the answer instead of the grievance, which is
worth testing: this channel's biggest winners are "how to" framings, not
complaints. **Watch the coins** — see the negative prompt note above.

```
Near-photorealistic still life of one plain gold bullion coin and one plain
silver bullion coin resting together on dark textured cloth, both coins blank
and unmarked with only a finely milled reeded edge and a smooth polished face —
absolutely no symbols, no emblems, no letters, no numbers stamped on either
coin. Hard raking light from the left picking out the milled edges and deep
metallic lustre, rich shadow falling to the right. Warm gold and cool silver
against near-black fabric. Extremely shallow depth of field, background falling
away to darkness. Stylized matte cinematic grade. 9:16 vertical composition,
coins sitting in the upper two-thirds, lower third left as clean near-black
fabric and shadow for a text overlay.
```

## OPTION D — THE WALL *(recommended — approved plate rendered)*

Option A's argument with a human in it. The character supplies the scale the
still life cannot — a wall of cash that runs out of frame only reads as absurd
when there is a body standing next to it — and it keeps AMIR in the grid, so the
thumbnail ties to the film and to every other short in the series.

Generate this **native at 1080×1920**. Do not generate 16:9 and crop; see
[PLATE QC](#plate-qc) for why.

```
Near-photorealistic low-angle hero shot of a stylized low-poly 3D male character
standing large in frame and filling the lower two-thirds from the knees up,
holding one large crumpled light kraft-brown paper grocery bag against his chest
in both hands, the bag clearly near-empty with a single rustic loaf poking out of
its open top, shoulders dropped. COMPLETELY BLANK featureless head with no eyes,
no nose, no mouth, no brow, no nose ridge, no face at all — a perfectly smooth
matte tan block, turned slightly toward camera. Simplified geometric anatomy,
matte clay-like shading, soft subsurface material. He wears a terracotta #E85F42
t-shirt and a cream beanie. His trousers are warm oatmeal cream #E8DCC8, clearly
darker and warmer than his footwear. His sneakers are bright white. Directly
behind him a colossal wall of banded paper banknote bundles rising far out of the
top of the frame and receding to the right, dwarfing him in scale, the individual
bundles clearly reading as stacked banded cash. Bare pale concrete ground, hard
midday sun from the left, his long real shadow thrown across the wall behind him.
Saturated blue #4BA3D3 sky visible at the top left. Strong figure-to-ground
separation, bold simple silhouette, high contrast, subject sharp. Stylized matte
cinematic grade. 9:16 vertical composition, the character's head sitting no
higher than the midpoint of the frame, entire upper third left clean and
uncluttered for a text overlay.
```

Add to the negative prompt for this one: `brow ridge, nose bridge, facial
contour, shaded eye sockets, plain paper stacks, cardboard, plywood`.

### What the first two plates got wrong

Two plates were generated and reviewed; contact sheets are in
`media/thumbs/inflation-D-wall-routes.png` and
`media/thumbs/inflation-D-wall-copy.png`. Neither is shippable untouched:

- **Both came out 1376×768 (16:9).** The pack is 9:16 throughout.
- **Plate 2's wall stopped reading as money** — the bundles rendered as plain
  cream-grey sheets, closer to plywood than cash. That single failure is fatal;
  the concept is gone. Plate 1's banded dollar bundles are unmistakable.
- **Brown shoes on both.** Scene 07 locks white sneakers.
- **A faint nose ridge and brow on both heads,** despite `nose` sitting in the
  negative prompt. This is the character drift the scene pack calls failure
  mode #1.
- **The bag is too small and too dark** — a brown brick at grid size. It carries
  half the concept and currently reads as nothing.

Of the three routes to 9:16 that were tested, the hard centre crop of plate 1
survived the squint test and banding it out to vertical did not: banding shrinks
the character to a speck and gives half the frame to dead colour. Use the crop if
you need something today; regenerate native vertical for the real thing.

### The approved plate

Plate 3 is the one. `media/thumbs/inflation-D-plate.png` — generated native
vertical, and every QC item above clears: blank head, white sneakers, banded
dollar bundles unmistakable at grid size, and a large kraft bag with a baguette
out of the top that finally does its half of the work. Clean blue sky across the
top quarter takes the type without touching the character.

Two finished thumbnails are cut from it:

| File | Text | Accent |
|---|---|---|
| `media/thumbs/inflation-D-MoreMoney.png` | More money. / Less food. | gold `#E9B949` |
| `media/thumbs/inflation-D-YouPaidThis.png` | You paid this / today. | red `#E5484D` |

Both are 1080×1920 with type at 118px Inter ExtraBold. Proof and squint rows:
`media/thumbs/inflation-D-final-sheet.png`.

**One thing still off, worth fixing on the next pass, not a blocker:** the
trousers came back white rather than cream `#E8DCC8`, so they merge with the
white sneakers and the legs read as a single bright column — at 86px the shoes
disappear and that column competes with the type for attention. Cream trousers
are what the Scene 07 lock calls for and they would separate the two. Note the
generator will drift here precisely because "white sneakers" sits next to
"cream trousers" in the prompt; putting the trouser colour in its own sentence,
away from the word *white*, holds it better.

<a id="thumbnail-spec"></a>

---

## THUMBNAIL SPEC

**Canvas.** 1080×1920. Native, not cropped.

**Safe zones.**

| Region | Rule |
|---|---|
| Top 55% (y 0–1050) | all overlay text lives here |
| Bottom 400px | reserved — Shorts prints title, handle and UI over it |
| Middle 60% vertically | keep the subject and the key prop here; some surfaces crop toward centre |

**Type.** Inter ExtraBold (bundled at `video/public/fonts/inter-var.woff2`),
uppercase, two lines maximum and three words per line. Line 1 white `#FFFFFF`;
line 2 in the option's accent. Each line sits on its own solid `#000000` box
sized to the text with tight padding — not a full-width bar — and line 2 is
offset ~30px left of line 1.

Size the type by **width, not height**: the longest line plus its box should fill
85–90% of the 1080 width. Height follows from that, and it lands lower than you
would guess — `MORE MONEY.` fills the frame at 118px Inter, about 86px of cap
height. Setting a cap height of 120px+ first, as an earlier draft of this spec
did, pushes an eleven-character line straight off the edge of the frame.

That box treatment is deliberately the same as the burned-in caption spec in
`inflation-scene-pack.txt`, so the thumbnail and the film read as one product.
The one difference: captions live in the lower third, thumbnail text lives up
top, because the Shorts UI occupies the bottom of a still but not of a playing
frame.

**Never generate text.** Keep `text, watermark, logo, signature, lettering,
numbers` in the negative prompt and composite type in the editor.

<a id="plate-qc"></a>

**Plate QC — check before you overlay anything:**

1. Native 1080×1920. Cropping 9:16 out of a 16:9 plate throws away 69% of the
   width, and it is always the negative space reserved for type that goes.
2. Head fully blank. No nose ridge, no brow, no eye sockets.
3. Wardrobe matches the Scene 07 lock: terracotta tee, cream trousers, **white**
   sneakers, cream beanie.
4. Seed matches the Scene 07 character lock, with Scene 07 fed back as an image
   reference.
5. Money reads as money at 86px — banded bundles, not plain stacked paper.
6. The hero prop reads at 86px.

**Squint test — the only test that decides it.** Export, then view at 160px wide
(search and subscriptions) and again at 86px (the phone Shorts grid). If you
cannot tell what is happening, it fails, however good it looks at full size. Both
contact sheets in `media/thumbs/` carry a squint row for exactly this.

---

## If you only make one

Make D. It is A's argument — a mountain of money against almost no food — with a
body in the frame to give the mountain a scale, and it keeps AMIR in the grid so
the series looks like a series. A stays the one to A/B it against: A is the purer
read at 86px because it is two objects and nothing else, D is the stronger stop
because a human in trouble beats a still life. Both are understood before a word
is read, which is the bar.

B and C stay parked. B's own framing buries the figure, and C leads with the fix
before the grievance has landed — worth testing on a later part, not this one.
