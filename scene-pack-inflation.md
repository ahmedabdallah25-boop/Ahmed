# Scene Prompt Pack — "The Tax Nobody Voted For" (Inflation)

**Render style:** 3D — faceless low-poly (per the Nuzul Dzikri reference template).
**Target length:** 60s · 32 scenes · ~1.9s average shot.
**Aspect:** 9:16, 1080×1920.

Style reference: [`visual-style-spec.md`](visual-style-spec.md).

---

## 1. Style suffix — paste on EVERY prompt

Append verbatim to each scene prompt. This is what holds the look together across 32 generations.

```
stylized low-poly 3D render, matte clay-like shading, soft subsurface material,
characters have COMPLETELY BLANK featureless heads — no eyes, no nose, no mouth, no face at all,
simplified geometric anatomy, composited into a near-photorealistic environment,
hard natural sunlight, physically accurate cast shadows, shallow cinematic depth of field,
9:16 vertical composition, subject in lower two-thirds, clean headroom for captions
```

**Negative prompt:**

```
facial features, eyes, mouth, nose, face, text, watermark, logo, cartoon outlines,
cel shading, flat vector, anime, low resolution, distorted hands, extra limbs
```

**Consistency:** lock one seed for the whole pack and reuse it. Generate Scene 3 first, then feed it
back as an image reference for every subsequent character shot. Character drift between scenes is
the single most common failure of this format.

---

## 2. Character bible

| Name | Role | Wardrobe (never change) |
|---|---|---|
| **AMIR** | Protagonist, the viewer's stand-in | Terracotta `#E85F42` t-shirt, cream `#E8DCC8` trousers, white sneakers, cream beanie |
| **THE CASHIER** | Neutral background human | Sand `#C9A97E` polo, dark apron |
| **THE BANKER** | The system, never villainised | Deep navy `#1E3A5F` suit, no tie, navy bucket hat |

Environments: Indonesian/Malaysian suburban — tiled rooftops, warm concrete, wet asphalt, night
petrol stations with bokeh streetlights. Big open skies `#4BA3D3`.

---

## 3. Caption burn-in spec

Two stacked lines, lower third, above the YouTube UI band (keep clear of the bottom 250px):

- **Line 1:** English, **white**, Montserrat/Inter 700, on a solid `#000000` box, tight padding, box sized to text.
- **Line 2:** Arabic finance term or plain-language gloss, **gold `#F5D76E`**, *italic*, own black box, offset ~20px left.
- **Static per phrase.** No karaoke, no word-by-word pop, no colour highlight. Emphasis via *italics* only.
- Swap on the speaker's natural clause break — matches the cut.

Enable a **multi-language audio track** on upload (this is what produces YouTube's "Auto-dubbed" chip). Free reach.

---

## 4. The 32 scenes

| # | Time | Voiceover | Image prompt (+ style suffix) |
|---|---|---|---|
| 1 | 0:00 | *"Your salary went up this year."* | AMIR standing in a supermarket aisle holding a payslip, bright fluorescent light, shelves stacked behind him |
| 2 | 0:02 | *"So why do you feel poorer?"* | Close on AMIR's hands holding a long grocery receipt that unspools toward the floor |
| 3 | 0:04 | *"This isn't in your head."* | AMIR at a checkout counter, THE CASHIER scanning, warm afternoon light through a shopfront window |
| 4 | 0:06 | *"And it isn't bad budgeting."* | AMIR at a kitchen table at night, bills fanned out, single warm pendant lamp overhead |
| 5 | 0:08 | *"Ten years ago, this bought a full cart."* | A single crisp banknote on a worn wooden table, hard side light, deep shadow |
| 6 | 0:10 | *"Today it buys half a bag."* | Same banknote beside one small paper grocery bag on the same table, same light |
| 7 | 0:12 | *"The note didn't change."* | Extreme close-up on the banknote's texture, shallow focus, dust motes in a sunbeam |
| 8 | 0:14 | *"What changed is how many exist."* | Wide shot: an endless grid of identical banknotes tiling a concrete floor to the horizon |
| 9 | 0:16 | *"Money isn't printed. It's lent into existence."* | THE BANKER at a desk sliding a document across polished wood, tall window light behind |
| 10 | 0:18 | *"A bank approves a loan —"* | Over-shoulder of THE BANKER's hand signing, pen tip touching paper, macro |
| 11 | 0:20 | *"— and the money appears."* | A stack of banknotes materialising on the desk, faint dust displacement, same light |
| 12 | 0:22 | *"It wasn't taken from a vault."* | An open bank vault door, interior completely empty, cold overhead light |
| 13 | 0:24 | *"It was typed into a screen."* | A monitor on the banker's desk showing a rising number, screen glow on matte surfaces |
| 14 | 0:26 | *"Every loan adds new money."* | Aerial: a suburban street where identical houses multiply into the distance |
| 15 | 0:28 | *"But the world's goods didn't multiply."* | A single delivery truck on an empty road, two figures unloading one cardboard box |
| 16 | 0:30 | *"More money. Same bread."* | Split composition: a towering stack of notes on the left, one loaf of bread on the right |
| 17 | 0:32 | *"So the price of bread rises."* | AMIR reaching for bread on a shelf, a price tag in sharp focus in the foreground |
| 18 | 0:34 | *"Nobody voted for this."* | AMIR alone at a night bus stop, empty road, streetlight bokeh, hands in pockets |
| 19 | 0:36 | *"Nobody sent you a bill."* | An empty letterbox on a suburban gate, hard morning shadow across it |
| 20 | 0:38 | *"But you paid it."* | AMIR at a petrol station at night, refuelling a terracotta car, wet reflective forecourt |
| 21 | 0:40 | *"This is the tax nobody voted for."* | Wide low angle: AMIR small in frame beneath a vast blue sky, long shadow behind him |
| 22 | 0:42 | *"And the engine driving it is interest."* | Slow orbit around THE BANKER's desk, the signed document centre frame |
| 23 | 0:44 | *"Debt creates money. Money loses value."* | A circular arrangement of banknotes on concrete, shot top-down |
| 24 | 0:46 | *"Value the saver never agreed to lose."* | AMIR sitting on his front step holding a small savings tin, early morning light |
| 25 | 0:48 | *"Which is why sound money mattered."* | A pair of gold and silver coins on dark cloth, hard raking light, deep shadow |
| 26 | 0:50 | *"You cannot type gold into existence."* | Macro on one gold coin's milled edge, extreme shallow focus |
| 27 | 0:52 | *"It has to be dug, weighed, earned."* | Two figures lifting a heavy crate together, effortful posture, warm dusk light |
| 28 | 0:54 | *"So hold what can't be diluted."* | AMIR placing a coin into a small wooden box on a shelf, warm domestic interior |
| 29 | 0:56 | *"Real assets. Real ownership."* | AMIR standing at his own front gate, hand on the latch, golden hour |
| 30 | 0:57 | *"Not promises that quietly shrink."* | The empty vault door slowly closing, cold light narrowing to a line |
| 31 | 0:58 | *"Your money should hold its weight."* | The gold coin resting on a balance scale, perfectly level, hard side light |
| 32 | 0:59 | *"Follow for the rest of the series."* | End card: centred channel logo over the blurred golden-hour gate shot from Scene 29 |

---

## 5. Production order

1. Record VO first — the cut follows speech cadence, so scene timings shift to match delivery.
2. Generate Scene 3 → approve the AMIR design → lock seed → generate the remaining 31 with it as reference.
3. Assemble on **hard cuts only**. No dissolves, no whips, no zoom transitions.
4. Slow push-in or lateral drift on every scene — nothing fully static.
5. Film grain overlay on the master.
6. Burn in captions per §3.
7. Link the source long-form in the description.

**Retention checkpoints:** Scenes 1–2 must land the paradox inside 3 seconds. Scene 16 is the
mechanism payoff — if a viewer only sees one frame, make it that one. Scene 21 is the emotional
peak and the best thumbnail candidate.
