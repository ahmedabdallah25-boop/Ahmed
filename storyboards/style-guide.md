# The Money Machine, Decoded — Long-Form Style Guide & Character Bible

**Reverse-engineered from Episode 1 (`How Banks Create Money From Nothing`, 5:17, video ID `7TWUwpbl83U`) so every future episode matches the same 2D format, character design, and voice.**

Use this file as the single source of truth. Every episode storyboard appends the
**Locked Style Suffix** (below) to every image prompt and pulls characters from the
**Character Bible** verbatim — that is how character consistency is guaranteed.

---

## 1. Format at a glance

| Attribute | Standard |
|---|---|
| Aspect ratio | 16:9 (1920×1080), long-form |
| Target runtime | ~5:00–5:30 (Episode 1 was 5:17) |
| Cadence | Weekly, "Next Friday" |
| Series | *The Money Machine, Decoded* (long-form companion to the daily Shorts) |
| Signature | **"No jargon. Just mechanisms."** — once after the hook (~0:42) and once to close |
| Voice | Single warm, authoritative male narrator (VO-driven, no on-camera host) |
| Sign-off structure | Series recap → **next-Friday tease** → signature |

## 2. Script skeleton (every episode follows this arc)

1. **Cold-open paradox hook (0:00–0:42)** — a second-person, personal-stakes claim that sounds impossible ("the house owns you"). The sting lands in line 1.
2. **Signature + 5-minute promise (0:42–0:52)** — "No jargon, just mechanisms. Give me five minutes…" then tease the payoff.
3. **The setup / what people wrongly assume (~20s)**.
4. **The mechanism, in plain numbers (~60–90s)** — one concrete worked example with a round number the viewer can hold.
5. **A real proof point / gut-punch (~30s)** — an institutional admission or a historical event (Episode 1 used the Bank of England 2014 paper + the 2008 bailout).
6. **The villain framing (~25s)** — name what the machine actually profits from ("heads they win, tails you pay").
7. **The 1,400-year-old fix (~50s)** — the halal mechanism as the *answer*, not the topic. Concrete rules/steps.
8. **The takeaway + "the test" (~20s)** — one question the viewer can ask any contract.
9. **Recap + next-Friday tease + signature (~20s)**.

## 3. Locked art style

> **2D flat vector animation.** Clean, medium-weight black outlines. Flat color fills with
> soft gradient shading for depth. A subtle film-grain texture overlay on everything.
> Minimalist, professional educational motion-graphic look (think a warmer, money-themed
> Kurzgesagt). Cinematic key lighting with a single soft spotlight. Centered compositions,
> generous negative space, slow push-ins and gentle pans, clean cuts and slide transitions.

## 4. Color palette (semantic — colors carry meaning)

| Role | Hex | Used for |
|---|---|---|
| Background (dark) | `#1A2530` | Deep navy — the default backdrop |
| Background (light) | `#F4F7F6` | Off-white — used sparingly for "clean/honest" beats |
| **Gold** (assets) | `#FFD700` | Money, real assets, light, the viewer's own equity, positive growth |
| **Red** (debt) | `#E63946` | Debt, interest, chains, IOUs, warnings, "the machine" |
| **Teal** (the fix) | `#2A9D8F` | The halal mechanism — equity, shared ownership, "rooted capital" |
| Text white | `#FFFFFF` | General on-screen text |

**Rule:** red = the problem, gold = your money, teal = the halal fix. A scene's emotional
turn is signalled by the palette washing from red → teal.

## 5. Typography & on-screen text

- **Font:** bold sans-serif — **Montserrat / Roboto Bold**.
- Big figures (`$300,000`, `~$647,000`, `83%`) are oversized hero text that "pops" or slides in on the beat.
- Color-code the text: gold for assets, red for debt/interest, white for neutral, teal for the fix.
- **No burned-in subtitles** — on-screen text is a designed graphic element, not captions.

## 6. Iconography (recurring visual vocabulary)

| Concept | Visual |
|---|---|
| Money / assets | Stacks of gold bills with a soft glowing aura |
| Debt / interest | Red bills, heavy iron chains, "IOU" slips, a ticking taxi meter |
| The machine | Large interlocking golden gears, an "economic engine" |
| Time / risk | Hourglass, scales of justice, a clock-face gear |
| The halal fix | Handshake, a bonsai / rooted tree ("rooted capital"), a growing teal wedge |
| Connection | Glowing "tether" lines linking assets to people |
| Comparison | Split-screen, balance scales |

Islamic accents are subtle: faint geometric (girih) lattice patterns behind the teal
"fix" moments only — never heavy-handed.

## 7. Character Bible (paste these verbatim into prompts)

Keep the cast small and identical across episodes. Do **not** redesign faces or outfits.

### ADAM — "the Everyman" / the viewer stand-in (primary)
> **ADAM:** a friendly mid-20s man, warm tan skin, short dark-brown hair, clean-shaven with
> light stubble, expressive eyebrows. Wears a **forest-green crew-neck sweater over a grey
> t-shirt, beige chinos, and brown sneakers.** Average build, approachable, relatable.
> His expressions carry the emotion of each scene (hopeful → trapped → relieved).

### THE BANKER — the institutional "villain"
> **THE BANKER:** a middle-aged man, pale skin, slicked-back greying dark hair, clean-shaven,
> sharp **navy-blue pinstripe suit, white shirt, crimson-red tie, gold wristwatch.** A smug,
> confident, unbothered smile. Calm and powerful, never cartoonishly evil.

### THE CROWD — the collective economy
> **THE CROWD:** a diverse group of simple vector figures (mixed ages, skin tones, some in
> hijab, some in work clothes) in the same flat-vector style, used to represent "everyone,"
> the public, or the market.

### Recurring object — THE HOUSE
> A simple two-storey suburban house with a pitched roof and one front window. Its color
> encodes ownership: **red overlay = mortgaged/owned by the bank; gold = paid value;
> teal = co-owned / halal.** Chains and a red "LIEN" padlock attach when the bank controls it.

*(Optional, only if a scene needs a home/family stake — define once, reuse identically:
**LAYLA**, Adam's partner: mid-20s woman, warm tan skin, soft cream-and-teal hijab, earth-tone
cardigan, gentle face. Use sparingly.)*

## 8. THE LOCKED STYLE SUFFIX (append to EVERY image prompt)

```
Style: 2D flat vector illustration, clean medium-weight black outlines, flat colors with soft
gradient shading, subtle film-grain texture, minimalist educational motion-graphic look,
cinematic lighting, single soft spotlight, centered composition, 16:9. Palette: deep navy
#1A2530 background, gold #FFD700 = money/assets, red #E63946 = debt/interest, teal #2A9D8F =
the halal fix, white #FFFFFF text in bold Montserrat. Consistent character design — identical
face, proportions, and outfit across every frame. No photorealism.
```

## 9. ElevenLabs voice direction (v3 audio tags)

- **Model:** ElevenLabs v3 (audio tags in `[square brackets]`).
- **Voice:** one warm, grounded, authoritative male narrator. Documentary-explainer energy —
  calm, never hype-y. Stability "Natural"; keep it consistent across all episodes.
- **Pacing:** measured. Use `…` and `[pause]` for the beats; the hooks breathe.
- **Emphasis:** ALL-CAPS a single word when the script marks it; the narrator hits it harder.
- **Tag legend** (used in the scripts):
  - Core audio tags: `[whispers]`, `[sighs]`, `[curious]`, `[excited]`, `[sarcastic]`, `[pause]`.
  - Delivery-tone cues v3 interprets well: `[serious]`, `[warm]`, `[confident]`, `[emphatic]`,
    `[flat]`, `[cold]`, `[ominous]`, `[reassuring]`.
  - Swap or thin these to taste for your chosen voice — they are direction, not gospel.
