# Thumbnail Prompts — Part 15, "Hold What Cannot Be Diluted"

Written to match `sound-money-scene-pack.txt`: each prompt is complete and
self-contained, character identity and style already baked in. Same negative
prompt as the scene pack — paste it once and leave it.

**Format:** 1080×1920 (9:16). A Short's custom thumbnail shows in the channel's
Shorts grid, in search and in the subscriptions feed — never in the Shorts feed
itself. Design for the grid: it will be seen at roughly 160px wide.

**Three rules, taken from what works on this channel:**

1. **Two visual elements maximum.** Anything more turns to mush at grid size.
2. **The picture carries the argument, the text only confirms it.** If the image
   needs the words to make sense, the thumbnail has failed.
3. **Leave a clean band for type.** Each prompt below reserves it explicitly —
   generate the plate, add the text afterwards.

**Text to overlay** (add in your editor, not in the prompt — every generator
mangles lettering):

| Option | Line 1 (white) | Line 2 (accent) | Accent |
|---|---|---|---|
| A | Money they | cannot print | gold `#E9B949` |
| B | Saved 10 years. | Poorer anyway. | red `#E5484D` |
| C | Hold what | can't be diluted | gold `#E9B949` |

Set in Inter / Montserrat Bold 800, uppercase, ~130px on a 1920-tall frame,
tight leading, heavy soft drop shadow.

Part 14's thumbnail already used "Money they cannot print" as option C but shipped
option B. A is therefore still unused on the channel and is the strongest pick here,
because it states the payoff Part 14 promised.

---

## NEGATIVE PROMPT — applies to all three

```
facial features, eyes, mouth, nose, lips, eyebrows, face, portrait, cartoon
outlines, cel shading, flat vector, anime, 2D illustration, text, watermark,
logo, signature, lettering, numbers, distorted hands, extra limbs, extra
fingers, blurry, low resolution, oversaturated, plastic sheen, uncanny,
cryptocurrency, bitcoin, crypto coin, digital currency symbol, letter B on coin
```

> The last two entries matter. Part 14's scene 29 asked for "one gold coin and one
> silver coin" and the generator returned Bitcoin coins, which shipped. Check every
> coin render for a stamped B before approving.

---

## OPTION A — "Money they cannot print"

Near-photorealistic close-up of an open palm, stylized low-poly geometry with
matte clay-like shading, terracotta `#E85F42` sleeve cuff at the frame edge,
holding two thick plain gold coins with milled edges and blank classical faces —
no stamped symbols of any kind. Hard warm key light from the right, deep real
shadow beneath the hand, strong warm `#F2B01E` metallic highlights. Dark neutral
background falling to black, very shallow depth of field. 9:16 vertical
composition, hand and coins filling the lower two-thirds, clean unbroken dark
band across the top third reserved for type.

## OPTION B — "Saving harder won't save you"

Near-photorealistic macro of a glass savings jar packed with folded banknotes,
the notes visibly shrunken and curled inward as if drying out, on a scarred dark
wooden table. Hard raking side light from the right, deep real shadow falling
left, dust motes in the beam. Muted desaturated palette so the paper reads grey
and lifeless. Stylized matte cinematic grade, extremely shallow depth of field.
9:16 vertical, jar in the lower two-thirds, clean dark band across the top third
reserved for type.

## OPTION C — "Hold what can't be diluted"

Near-photorealistic still life of a small brass balance scale resting perfectly
level, a plain gold coin in one pan and a folded banknote in the other, the gold
side visibly steady. Hard warm directional side light from the right, deep real
shadows falling left, warm `#F2B01E` metallic highlights against a dark neutral
background falling to black. Symmetrical, calm, resolved. Stylized matte
cinematic grade, shallow depth of field. 9:16 vertical, scale in the lower
two-thirds, clean dark space across the top third reserved for type.

---

Export the chosen plate, add the type, save as `media/thumbs/sound-money-final.jpg`
(under 2MB, JPEG). `automation/part15.json` points at that exact path.
