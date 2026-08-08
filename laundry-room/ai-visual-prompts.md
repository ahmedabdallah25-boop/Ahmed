# AI prompts — laundry room "after" visuals

Copy-paste prompts for **Google Flow / Whisk / ImageFX / Gemini**, and any Nano Banana or
Seedream-class model.

---

## Before you generate anything

**Use the upright copies.** The three originals carry EXIF orientation 6, and many tools ignore
it — feed them in raw and you get a sideways "after" render, which is useless for showing
anyone. Corrected copies were supplied in chat as `A-upright.jpg`, `B-upright.jpg` and
`C-upright.jpg`. Use those.

**Room facts these prompts assume** (corrected against the upright images): the floor is
**poured grey epoxy resin**, not tile — there is no grout. The walls carry an **existing tiled
dado** to roughly 1.3 m, so the splashback is already there. The dark shapes at floor level are
**open lint collection trays**, not plinths. Ceiling is roughly **4 m**, with heavy exposed
services. Getting these wrong is what makes a render unusable as evidence.

**Then pick your route:**

| Route | Tool | Use when |
|---|---|---|
| **1. Retouch your own photo** ⭐ | Gemini / Whisk / Nano Banana — upload photo + prompt | You want a true before/after of *your actual room*. Far more persuasive than any concept render. Start here. |
| **2. Text-to-image concept** | ImageFX / Whisk / Flow's image step | You want a clean target to aim at, or a mood reference for a contractor |
| **3. Video walkthrough** | Google Flow (Veo) | You want to present the upgrade to an owner or GM |

Route 1 is the one that wins arguments about budget. Do that one.

---

## Universal style suffix

Append to any prompt below. It's what keeps the result *credible* rather than a glossy
showroom fantasy nobody believes you can build for AED 3,000.

```
Realistic architectural interior photography, natural available lighting, 24mm lens,
no fisheye distortion, true-to-life materials, clean industrial hospitality standard.
Restrained and functional, NOT a luxury showroom. No people. No decorative plants,
no feature walls, no colour accents, no marble, no wood. Keep the existing machines,
existing room proportions, the existing tiled wall dado and the existing grey epoxy
resin floor.
```

---

## Route 1 — Retouch your own photo (image-to-image)

Upload your rotated photo, then use these. **Run them in order** — each is a bigger ask than
the last. Stop at whichever level matches your real budget, so the picture you show people is
a picture you can actually deliver.

### 1A — Tier 0 only (costs AED 0 to achieve)

> Keep this photograph exactly as it is — same room, same machines, same walls, same ceiling,
> same lighting, same camera angle. Change only the housekeeping. Remove all lint, fluff and
> debris from the floor, the floor edges, behind the machines and from the high-level cable
> trays and mesh overhead. Empty the open black lint trays and line them up neatly in one
> consistent position against the wall. Remove the large grey panel and the wire frame leaning
> against the wall. Remove the loose papers and bagged items from the floor. Remove all items
> from the tops of the machines. Reduce the wall of taped A4 sheets to a small tidy block
> aligned to a common top edge. Clean the grey epoxy resin floor and the tiled wall dado. Do
> not repaint, do not replace any equipment, do not change the lighting. Photorealistic, same
> exposure and colour as the original.

*This is your most important render. It proves how much of the gap is free.*

### 1B — Tier 1 (lighting, paint, floor marking, signage)

> Photorealistic renovation of this exact laundry room, same camera angle, same machines, same
> room proportions, same grey epoxy resin floor. Apply these changes only: replace the two
> fluorescent battens with twelve modern surface-mounted LED batten fittings at 4000K neutral
> white, evenly spaced down the full length, bright and even with no dark corners and no dark
> far end; repaint the upper walls above the existing tiled dado brilliant white in a washable
> semi-gloss finish; keep the tiled dado but show it clean with fresh pale grout; add crisp
> painted yellow floor lines defining a central walkway and blue-outlined equipment bays on the
> resin floor; replace the open black lint trays with closed lidded bins standing in marked
> positions; replace all the taped paper notices with a uniform set of small white printed
> acrylic signs, all the same size, hung at one consistent height; remove every trace of lint
> and every loose item from the floor. Keep the existing ceiling services and existing ducting
> unchanged. [+ universal style suffix]

### 1C — Tier 2 (the ceiling)

> Same as above, and additionally: deep clean the high-level cable trays, mesh and steelwork so
> no settled dust or lint remains and no dark staining shows on the soffit; then paint every
> exposed ceiling service — ducting, conduit, brackets, pipes, hangers and cable trays — one
> uniform matt light grey so the whole upper volume reads as a single clean plane; replace the
> sagging foil-wrapped flexible corrugated ducting with straight rigid galvanised spiral duct on
> evenly spaced threaded-rod hangers; add a neat aluminium coved trim along the base of the
> machines where they meet the resin floor. Keep the existing tiled dado — do not replace it
> with cladding. [+ universal style suffix]

### 1D — Full build (all tiers)

> Same as above, and additionally: add a white shadow board with printed tool silhouettes, a
> wall-mounted PPE station with clear bins, a stainless chemical shelf with a spill bund tray,
> and a brushed aluminium framed noticeboard — all mounted in one aligned run on the wall. Add
> matching clean white liners to every linen trolley. Add painted red-and-white hazard hatching
> on the resin floor in front of the electrical panel and fire extinguisher.
> [+ universal style suffix]

### 1E — Side-by-side comparison

> Create a single side-by-side before-and-after image. Left half: this photograph exactly as
> provided, unchanged. Right half: the same room from the identical camera angle, fully
> upgraded — bright even 4000K LED lighting down the full length, brilliant white washable upper
> walls above a clean tiled dado, uniform ceiling services and cable trays painted light grey,
> rigid straight ducting, painted yellow and blue floor zones on the grey resin floor, lidded
> lint bins in marked positions, matching printed signage at one height, zero lint, nothing
> loose on the floor. Thin white divider between the halves. Label the left half
> BEFORE and the right half AFTER in small clean sans-serif type.

---

## Route 2 — Text-to-image concepts

These are the exact prompts that produced the current render set in
[`renders/LINKS.md`](renders/LINKS.md), verbatim. They assume the corrected room facts and
carry the walkthrough-video findings. Reusable as-is.

### 2A — Hero: the whole room

```
Photorealistic wide-angle interior photograph of an upgraded hotel back-of-house commercial laundry room, five-star operational standard achieved on a low budget. A TALL narrow room, roughly 4 metres floor to soffit and about 3 metres wide, viewed down its length. RIGHT SIDE: a neat row of light-grey and stainless steel commercial washer-extractors, spotlessly clean, with a neat aluminium coved trim where the machine bases meet the floor; zero lint or debris anywhere. Behind them a clean white tiled dado to 1.3 m with fresh pale grout, brilliant white washable painted wall above. CEILING ZONE: the exposed high-level services — galvanised cable trays, mesh, conduit, brackets, pipework and hangers — all deep cleaned with no settled lint and all painted one uniform matt light grey so the upper volume reads as a single clean plane; rigid galvanised spiral ducting running dead straight on evenly spaced threaded-rod hangers, no sagging foil flexible hose. LIGHTING: twelve surface-mounted linear LED batten fittings at 4000K neutral white, evenly spaced down the full length, bright and even, no dark corners and no dark far end. FLOOR: clean poured grey epoxy resin with a coved skirting, crisp painted yellow and blue lines defining a central walkway and labelled equipment bays. LEFT SIDE: closed lidded lint bins standing in marked positions, matching wire linen trolleys with clean white liners parked inside marked bays, and a uniform row of printed acrylic signs at one consistent height. A green running-man fire exit sign over a clear, completely unobstructed doorway. Nothing loose on the floor anywhere. Realistic architectural interior photography, natural available lighting, 24mm lens, no fisheye distortion, true-to-life materials, clean industrial hospitality standard. Restrained and functional, NOT a luxury showroom. No people. No decorative plants, no feature walls, no colour accents, no marble, no wood.
```

### 2B — Machine line detail

```
Photorealistic close detail of the machine line in an upgraded commercial hotel laundry. Two light-grey industrial washer-extractors with blue LCD control panels and red emergency-stop mushroom buttons on yellow backplates, immaculate stainless fascias and stainless tops. Aluminium coved trim where the machine bases meet a poured grey epoxy resin floor, sealed so no lint can collect underneath. Clean white tiled dado behind to 1.3 m with fresh pale grout, brilliant white painted wall above. Mounted on the wall between the machines: a slim stainless lidded lint bin with a printed acrylic sign reading LINT TRAP - CLEAN EVERY CYCLE, and machine identification plates reading W1 and W2 in bold black on white. Painted yellow floor lines running parallel to the machine line one metre out, defining a walkway. Even bright 4000K neutral white LED lighting. Utterly spotless, zero fluff or lint. Realistic architectural detail photography, 35mm lens, true-to-life materials, clean industrial hospitality standard, restrained and functional, NOT a luxury showroom. No people, no plants, no marble, no wood.
```

### 2C — Trolley bays and linen staging

```
Photorealistic interior view of the linen staging and trolley parking zone in an upgraded hotel back-of-house laundry. Matching wire mesh linen trolleys with clean white canvas liners, all the same model and height, parked precisely inside floor bays outlined in crisp painted lines on a poured grey epoxy resin floor with a coved skirting. Each bay has a bold printed floor label and a matching wall sign above it reading SOILED, CLEAN or RETURN in clear black type on colour-coded panels, red for soiled and green for clean. Brilliant white painted walls above a clean white tiled dado. Closed lidded lint bins standing in marked positions. Stainless shelving at the far end holding neatly folded white towels in uniform stacks. High-level cable trays and ceiling services deep cleaned and painted uniform matt light grey, straight rigid galvanised ducting on evenly spaced hangers. Bright even 4000K neutral white LED batten lighting throughout, no dark end. Everything squared up, labelled and orderly, nothing loose on the floor. Realistic architectural interior photography, 24mm lens, no fisheye distortion, true-to-life materials, clean industrial hospitality standard, restrained and functional, NOT a luxury showroom. No people, no plants, no marble, no wood.
```

### 2D — The lit store alcove

Note this is now set **inside the dark alcove**, because that is where the station should
actually go once it has a light — not on the main-room wall.

```
Photorealistic detail of a small back-of-house store alcove in a hotel laundry, newly fitted with a single bright LED batten fitting on the soffit so the space is properly lit for the first time. Brilliant white painted walls, poured grey epoxy resin floor with a coved skirting and a small floor gully. Mounted in one aligned run on the wall: a white shadow board with black tool silhouettes and printed labels holding a broom, dustpan, squeegee and lint brush each in its marked place; a stainless PPE station with clear acrylic bins of folded gloves, aprons and eye protection under a printed sign reading PPE STATION; below it a stainless shelf with a raised spill-containment bund tray holding four uniform labelled white chemical containers with colour-coded caps, under a sign reading CHEMICAL STORE - NO DECANTING; and a brushed aluminium framed noticeboard with laminated A4 sheets in a neat grid titled DAILY CHECKS. A mop bucket parked in a marked floor position. Even bright 4000K neutral white light, no dark corners. Everything aligned, labelled and spotless. Realistic architectural detail photography, 35mm lens, true-to-life materials, restrained and functional, NOT a luxury showroom. No people, no plants, no marble, no wood.
```

### 2E — Signage and standards kit (flat lay)

```
Clean flat-lay graphic design presentation board on a soft neutral light grey background, showing a signage and visual-standards kit for a hotel back-of-house laundry room. Arranged in a neat aligned grid: a colour-coded linen flow key with three swatches labelled SOILED in red, CLEAN in green and WALKWAY in yellow; four rectangular printed acrylic wall signs reading LINT TRAP - CLEAN EVERY CYCLE, CLEAN LINEN ONLY - NO SOILED, KEEP CLEAR - ELECTRICAL PANEL, and FIRE EXIT - KEEP CLEAR AT ALL TIMES; two square machine identification plates reading W1 and D1 in bold black on white; a portrait checklist card titled LAUNDRY DAILY CHECKS with neat ruled tick-box rows; and a floor-marking legend strip showing painted yellow walkway lines, painted blue equipment bay outlines and red hatched keep-clear marking. Modern clean sans-serif typography, generous white space, strict alignment, restrained palette of white, charcoal, red, green and yellow. Professional brand-standards presentation board, crisp legible text, sharp studio lighting, top-down flat lay, high detail.
```

*Take 2E to an Al Quoz print shop as your artwork brief. Models render text imperfectly — treat
it as a layout reference, and have the shop set the actual type.*

---

## Route 3 — Google Flow video walkthrough

Flow works best **image-to-video**: generate or retouch a still first, then animate it. Feed it
your 1B/1C render as the start frame.

### 3A — Slow reveal down the room

> Slow steady dolly forward down the centre of a spotless commercial hotel laundry room,
> gliding between the machine line on the right and the parked linen trolleys on the left.
> Camera at chest height, perfectly level, smooth gimbal movement, no shake. Bright even
> neutral-white lighting. Calm, clinical, controlled. No people. Documentary facility
> cinematography, natural lighting, 24mm lens.

### 3B — Before/after transition

> Static locked-off camera in a commercial laundry room. The scene transitions smoothly from
> cluttered and dim — lint on the floor, sagging ducting, warm patchy fluorescent light — to
> spotless and bright, with even neutral-white LED lighting, clean marked floor zones and
> uniform signage. Camera does not move at all. Slow smooth dissolve.

### 3C — Detail pans for a presentation

> Slow horizontal pan across a clean machine base and aluminium coved floor trim in a commercial
> laundry, then settling on a printed wall sign. Shallow depth of field, even neutral-white
> light, no people, no camera shake. Calm documentary pacing.

---

## Guard clauses — add these when a render goes wrong

| Problem | Add to prompt |
|---|---|
| Renders a domestic laundry room | `Commercial industrial laundry, large front-loading washer-extractors in a row, tall ceiling with exposed services, NOT a domestic or residential laundry room.` |
| Adds luxury materials | `No marble, no wood, no decorative tile, no feature wall, no plants. Painted plaster, tile and stainless only.` |
| Loses your room's shape | `Preserve the original room proportions, ceiling height, window and door positions exactly.` |
| Ceiling still messy | `The ceiling must read as one single uniform plane, every pipe, duct, conduit and bracket painted the same matt light grey.` |
| Too dark, or yellow cast | `Neutral white 4000K lighting, evenly distributed, no warm yellow cast, no dark corners, no pools of shadow.` |
| Text on signs is garbled | Nothing will fully fix this. Generate the sign layouts separately at large size, or set the type properly and treat the render as placement reference only. |
| Adds people | `No people, no hands, no staff, empty room.` |

---

## The one thing worth remembering

Generate **1A first**. A photorealistic render of your own room, cleaned and tidied with
nothing else changed, is the most useful image in this document — it shows what a single shift
of labour buys before anyone signs off a dirham of budget.
