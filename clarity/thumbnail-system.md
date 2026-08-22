# Clarity in the Quran — thumbnail system

Written 2026-08-22, from the first two thumbnails ever reviewed on this channel. Channel 1 has had
a mandatory thumbnail spec in `CLAUDE.md` since August; channel 3 has had none, and the two
thumbnails show exactly what "none" produces.

## The headline finding: there is no system

| | `5Fb1iERyIhs` — Ar-Ra'd 28 | `PUPdFpvEA04` — Honor Your Parents |
|---|---|---|
| Medium | watercolour illustration | **photoreal AI photograph** |
| Ground | dark navy | **cream banner + brown interior** |
| Layout | text left 35%, object right | **full-width top banner, photo below** |
| Type | 3 sizes, left-aligned, mixed case→caps | 2 lines, centred, all caps |
| Arabic | present, gold, signature element | **absent** |
| Citation | `AR-RA'D 28` bottom-left | **absent** |

**Nothing is shared but two colours.** A viewer who watched one and met the other in a sidebar has
no way to know it is the same channel. On a 45-subscriber channel trying to convert one-time
viewers into repeat ones, that is the most expensive defect here — more than any single image flaw,
because it compounds across every upload.

The two colours that *are* shared are the recoverable part: **navy and gold appear in both.** The
channel has a palette already. What it lacks is a layout.

## What is genuinely good, and must be kept

1. **Both execute the reversal in text.** "IT IS NOT 'PEACE' → TO SETTLE" and "IT'S NOT OBEDIENCE
   → SOMETHING ELSE" are the @deepmadesimple outlier formula rendered visually. The strategy is
   already right. It is the execution that loses it at feed scale.
2. **The glass of settling sediment is the best asset on this channel.** A glass of water with the
   silt dropping out of suspension *is* ṭumaʾnīna. That is `video-formula.md` §5 — an image that
   carries the argument rather than decorating it — achieved on a thumbnail. Nothing else on the
   channel is at that level.
3. **Watercolour on navy is distinctive** in a niche saturated with mosque stock photography and
   photoreal AI. It also matches the videos' own stated art direction.

## What is broken

### 1. The payload is illegible at feed size

Both thumbnails put the *setup* of the reversal in the least readable element on the frame.

- **`5Fb1iERyIhs`**: "IT IS NOT 'PEACE'" is mid-grey on navy **with a red line through it**. Grey
  on navy is already a weak contrast pair; the strikethrough then breaks the letterforms. At the
  320px the home feed actually serves, that line is a smudge — and it is the half that makes
  "TO SETTLE" mean anything. The joke's premise is the unreadable part.
- **`PUPdFpvEA04`**: the subtitle runs **52 characters** — "IT'S NOT OBEDIENCE . THE QURAN MEANS
  SOMETHING ELSE." At 320px that is roughly 4px of cap height. It is decoration, not text.

**The test:** view the thumbnail at 320px wide. Whatever you cannot read there does not exist.

### 2. `PUPdFpvEA04`'s headline repeats the title

Video title: *What **"Honor Your Parents"** Actually Means in Arabic*.
Thumbnail: **HONOR YOUR PARENTS**.

The thumbnail spends its largest element restating three words the title already says. Channel 1's
spec has forbidden this since August — *"thumbnail text must not repeat the title — it carries the
half of the promise the title left out"* — and channel 3 never had the rule written down.

### 3. Photoreal AI people are the wrong medium on this channel specifically

This is not an aesthetic preference. `cjtKWsFZbcg` carries a public **"AI BE AWARE"** comment, and
the first diagnosis traced this channel's credibility problem to template artifacts a viewer could
spot. Photoreal AI-generated humans are the single most recognisable signature of low-effort
Islamic content on YouTube right now. A hand-illustrated watercolour reads as someone made this;
an AI photo of five people at a table reads as the thing the commenter already accused you of.

The faces also do no work: four of the five have their heads bowed, and the one visible face is
neutral and unlit. Faces are the strongest CTR element available and this spends them on nothing.

### 4. `5Fb1iERyIhs` wastes its middle third

Text occupies the left ~35%, the glass the right ~30%, and ~35% of the frame between them is empty
navy. At feed scale it reads as a mostly-blank image.

### 5. A 1.90 MB PNG

`5Fb1iERyIhs`'s thumbnail is a PNG at 95% of YouTube's 2 MB ceiling. A watercolour with no hard
edges is a JPEG at roughly 300 KB with no visible loss. Any future edit risks tipping it over and
having the upload rejected.

---

## The system

### Palette — already in use, now fixed

| Role | Colour | Use |
|---|---|---|
| Ground | navy `#16203C` | every thumbnail, full bleed |
| Payload | gold `#E8A33D` | the reveal, and only the reveal |
| Text | off-white `#F2ECDC` | the struck-through wrong reading, and the citation |
| Strike | rust `#C0492B` | the line through the wrong reading, nothing else |

### Layout — fixed, every video

```
┌──────────────────────────┬───────────────────────────┐
│  ARABIC WORD   (gold, sm)│                           │
│                          │                           │
│  WRONG READING (struck)  │   the watercolour object  │
│  ─────────────           │   bleeding off the right  │
│                          │   edge, 3/4 frame height  │
│  RIGHT READING (gold,    │                           │
│  the biggest thing here) │                           │
│                          │                           │
│  SURAH 00      (sm)      │                           │
└──────────────────────────┴───────────────────────────┘
   left 45%                    right 55%, no gap
```

The object bleeds off the right edge. That kills the dead middle third and makes the frame feel
larger than it is.

### The four elements, and no fifth

1. **The Arabic word**, gold, small, top-left. The channel's signature — it appears on every
   thumbnail and nowhere else on YouTube looks like this.
2. **The wrong reading**, struck through. **Off-white, not grey.** Full contrast against the navy,
   with the rust line at 4–5px so it reads as a deletion rather than a scribble. Maximum
   **three words**.
3. **The right reading**, gold, the largest object in the frame. Maximum **three words**.
4. **The citation**, small, bottom-left. `AR-RA'D 28`. Free credibility, and it is the thing a
   scholar-minded viewer looks for.

### The rules

- **Never repeat the title.** The thumbnail carries the half the title left out.
- **Never photoreal humans.** Watercolour illustration only. See §3 above — on this channel this is
  a credibility rule, not a style rule.
- **The 320px test.** Export, view at 320px wide, and delete anything you cannot read.
- **JPEG, quality 90, 1920×1080.** Target under 500 KB, hard ceiling 2 MB.
- **The object must carry the idea**, the way the settling glass does. If the illustration would
  work equally well on a different video, it is decoration and it is wrong.

---

## The two rebuild briefs

### `5Fb1iERyIhs` — closest to right, needs three changes

Keep the glass and the concept exactly. Then:

- `IT IS NOT "PEACE"` → off-white `#F2ECDC`, not grey. Rust strike at 5px.
- Drop `"` quote marks — they cost legibility and add nothing at 320px.
- Scale the glass up ~30% and bleed it off the right edge to kill the empty middle.
- Re-export as JPEG q90.

Everything else stands. This one is close.

### `PUPdFpvEA04` — rebuild

The current image cannot be repaired; the medium is the problem.

- **Drop the photograph entirely.** Replace with a watercolour on navy in the house style.
- **Object:** the word ﴿قَضَىٰ﴾ set large in Arabic calligraphy, with an *older* hand and a younger
  hand resting on the same low table — ink-and-wash, no faces, no photoreal skin.
- **Arabic word (top-left):** إِحْسَانًا
- **Struck:** `NOT OBEDIENCE`
- **Gold:** `A DEBT` — or `DECREED`, from the verb *qaḍā* the video is actually built on. Either
  carries the half the title leaves out; "HONOR YOUR PARENTS" does not.
- **Citation:** `AL-ISRA 23`

Transcript-verified: this video's argument is the five places the command is bolted to tawḥīd, and
the force of *qaḍā* in 17:23. The thumbnail should show that, not a family at dinner.

---

## Open

I can generate both to this spec on request. They can be applied without touching anything else —
`thumbnails.set` is a separate API call from the metadata writes, and `automation/set_thumbnail.py`
already exists for channel 1 and needs only a CIQ-scoped equivalent.

**Do not change the thumbnail on `cjtKWsFZbcg` (849), `GjztcxZGQTI` (226), `_stswAi-79k` (193) or
`r-9UaBtOy98` (189) yet.** They are the channel's only proven results and their thumbnails have not
been reviewed here. Bring the new uploads onto the system first and let the winners settle.
