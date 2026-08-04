# Part 16 — "Is Klarna Halal?" · Consolidated script

**Series:** The Money Machine, Decoded · **Runtime:** ~2:08 · **Publish:** 2026-08-06, 03:00 PT

This is the single source of truth for the *script* — voiceover, timing, captions and packaging.
`klarna-scene-pack.txt` remains the companion for the **image prompts** and is generated from the
same lines, so the two cannot disagree. If a line changes, change it here and in the pack.

---

## 1 · The voiceover, one continuous block

Paste this whole thing into ElevenLabs v3 in one go — do not generate line by line, the pauses
between lines are what give it cadence. Every line carries exactly one emotion tag.


**— HOOK —**

> [serious] Klarna is interest-free.
> [whispers] That's the most expensive word in finance.
> [curious] You pay zero percent... and somebody still gets paid.

**— RECAP —**

> [serious] In the last episode, we said that your money shrinks while you sleep.
> [whispers] And that the gold you "owned" was only a promise on a screen.
> [dramatic] Same machine. New checkout.

**— ACT 1 — the pitch, stated fairly —**

> [calm] Ninety dollars. Four payments of twenty-two fifty.
> [deadpan] Nothing extra. Nothing hidden. That's the pitch.
> [curious] So follow the money.

**— ACT 2a — the merchant fee —**

> [serious] Klarna doesn't charge you. It charges the shop.
> [emphatic] Around six percent of every sale... plus a fee on top.
> [calm] A card costs the shop two.
> [serious] No shop absorbs that.
> [whispers] It goes into the sticker price.
> [dramatic] Which means the price went up... for everyone.
> [emphatic] Even the man paying cash.
> [sad] He never opened the app. He's still paying for it.

**— ACT 2b — the late fee —**

> [nervously] Then there's the part they don't advertise.
> [serious] Miss a payment... and ninety becomes ninety-seven.
> [dramatic] The price grew because time passed.
> [emphatic] That is the oldest definition of interest there is.

**— ACT 2c — the basket uplift —**

> [whispers] And the last piece is the quietest.
> [curious] Split into four, the number stops feeling like money.
> [serious] Baskets get bigger. That's not a side effect.
> [emphatic] That IS the product.
> [rushed] Four apps. Twelve payment dates. One salary.
> [sad] Nobody calls that debt. It behaves exactly like debt.

**— ACT 3 — the honest version —**

> [calm] So what does the honest version look like?
> [warmly] A sale has one price. Agreed once. Written down.
> [calm] Pay in six months? Fine — but the number is fixed today.
> [emphatic] Late, early, never — the price cannot move.
> [warmly] That's murabaha. A sale, not a loan.
> [calm] The markup is allowed because the risk is real...
> [serious] ...and because it stops the moment the deal is signed.

**— THE VERDICT —**

> [serious] If a number can grow because you were late...
> [dramatic] ...it was never a price. It was a loan wearing a receipt.

**— CLOSE —**

> [warmly] Zero percent isn't free. It's just quiet.
> [warmly] Follow — next, the card you pay off every month.


### Delivery settings

| Setting | Value | Why |
|---|---|---|
| Model | Eleven v3 | earlier models ignore the tags entirely |
| Stability | **Creative** | on Robust the tags are largely ignored, which wastes the whole arc |
| Speed | default | the ellipses already carry the timing |

**Test scenes 01–03 before generating the rest.** If a tag is spoken aloud instead of performed,
the voice or the stability setting is wrong — fix it there, not by stripping tags from 38 lines.

**Fallbacks if a tag misfires:** `[deadpan]` → `[calm]` · `[rushed]` → `[nervously]` ·
`[dramatic]` → `[emphatic]` · `[nervously]` → `[whispers]`.

### The emotional arc the tags are drawing

`curiosity → suspicion → indictment → grief → calm → resolution`

Scenes 01–09 pull the viewer in. 10–21 tighten and accuse. 22–27 drop into sadness — that is the
retention floor and it has to feel heavy. 28–38 lift back into warmth so the payoff lands as
relief rather than a lecture.

---

## 2 · The timeline

Every scene, every line, every caption in one table. Captions are `line 1 / *line 2 italic*`.

| # | Time | Voiceover | Burned-in caption |
|---|---|---|---|
| | | **HOOK** | |
| 01 ★ | 0:00-0:03 | [serious] Klarna is interest-free. | "Interest-free" / *the most expensive word in finance* |
| 02 | 0:03-0:05 | [whispers] That's the most expensive word in finance. | Free is the expensive word / *it always is* |
| 03 | 0:05-0:09 | [curious] You pay zero percent... and somebody still gets paid. | You pay 0% / *somebody still gets paid* |
| | | **RECAP** | |
| 04 ★ | 0:09-0:12 | [serious] In the last episode, we said that your money shrinks while you sleep. | Last episode: your money shrinks / *while you sleep* |
| 05 ★ | 0:12-0:16 | [whispers] And that the gold you "owned" was only a promise on a screen. | And the gold wasn't gold / *just a promise on a screen* |
| 06 ★ | 0:16-0:18 | [dramatic] Same machine. New checkout. | Same machine / *new checkout* |
| | | **ACT 1 — the pitch, stated fairly** | |
| 07 | 0:18-0:22 | [calm] Ninety dollars. Four payments of twenty-two fifty. | $90. Four payments. / *$22.50 each* |
| 08 | 0:22-0:26 | [deadpan] Nothing extra. Nothing hidden. That's the pitch. | Nothing extra, nothing hidden / *that's the pitch* |
| 09 ★ | 0:26-0:28 | [curious] So follow the money. | So follow the money |
| | | **ACT 2a — the merchant fee** | |
| 10 ★ | 0:28-0:32 | [serious] Klarna doesn't charge you. It charges the shop. | It doesn't charge you / *it charges the shop* |
| 11 | 0:32-0:36 | [emphatic] Around six percent of every sale... plus a fee on top. | ~6% of every sale / *plus a flat fee* |
| 12 | 0:36-0:39 | [calm] A card costs the shop two. | A card costs the shop 2% / *this costs three times more* |
| 13 | 0:39-0:41 | [serious] No shop absorbs that. | No shop absorbs that |
| 14 | 0:41-0:44 | [whispers] It goes into the sticker price. | It goes into the sticker price / *quietly* |
| 15 | 0:44-0:47 | [dramatic] Which means the price went up... for everyone. | So the price went up / *for everyone in the shop* |
| 16 ★ | 0:47-0:50 | [emphatic] Even the man paying cash. | Even the man paying cash |
| 17 ★ | 0:50-0:54 | [sad] He never opened the app. He's still paying for it. | He never opened the app / *he's still paying for it* |
| | | **ACT 2b — the late fee** | |
| 18 ★ | 0:54-0:57 | [nervously] Then there's the part they don't advertise. | Then the part they don't advertise |
| 19 | 0:57-1:01 | [serious] Miss a payment... and ninety becomes ninety-seven. | Miss one payment / *$90 becomes $97* |
| 20 ★ | 1:01-1:04 | [dramatic] The price grew because time passed. | The price grew / *because time passed* |
| 21 | 1:04-1:08 | [emphatic] That is the oldest definition of interest there is. | That is interest / *the oldest definition there is* |
| | | **ACT 2c — the basket uplift** | |
| 22 | 1:08-1:11 | [whispers] And the last piece is the quietest. | And the last piece / *is the quietest* |
| 23 | 1:11-1:15 | [curious] Split into four, the number stops feeling like money. | Split into four / *it stops feeling like money* |
| 24 | 1:15-1:18 | [serious] Baskets get bigger. That's not a side effect. | So baskets get bigger / *that's not a side effect* |
| 25 | 1:18-1:20 | [emphatic] That IS the product. | That IS the product |
| 26 | 1:20-1:24 | [rushed] Four apps. Twelve payment dates. One salary. | Four apps. Twelve dates. / *One salary.* |
| 27 ★ | 1:24-1:29 | [sad] Nobody calls that debt. It behaves exactly like debt. | Nobody calls it debt / *it behaves exactly like debt* |
| | | **ACT 3 — the honest version** | |
| 28 ★ | 1:29-1:32 | [calm] So what does the honest version look like? | So what's the honest version? |
| 29 | 1:32-1:36 | [warmly] A sale has one price. Agreed once. Written down. | A sale has ONE price / *agreed once, written down* |
| 30 | 1:36-1:40 | [calm] Pay in six months? Fine — but the number is fixed today. | Pay in six months? Fine. / *The number is fixed today.* |
| 31 | 1:40-1:44 | [emphatic] Late, early, never — the price cannot move. | Late, early, never / *the price cannot move* |
| 32 | 1:44-1:47 | [warmly] That's murabaha. A sale, not a loan. | That's murabaha / *a sale, not a loan* |
| 33 | 1:47-1:50 | [calm] The markup is allowed because the risk is real... | The markup is allowed / *because the risk is real* |
| 34 | 1:50-1:54 | [serious] ...and because it stops the moment the deal is signed. | and it stops / *the moment the deal is signed* |
| | | **THE VERDICT** | |
| 35 ★ | 1:54-1:57 | [serious] If a number can grow because you were late... | If a number can grow / *because you were late...* |
| 36 ★ | 1:57-2:01 | [dramatic] ...it was never a price. It was a loan wearing a receipt. | It was never a price / *it was a loan wearing a receipt* |
| | | **CLOSE** | |
| 37 | 2:01-2:05 | [warmly] Zero percent isn't free. It's just quiet. | 0% isn't free / *it's just quiet* |
| 38 ★ | 2:05-2:08 | [warmly] Follow — next, the card you pay off every month. | Next: the card you pay off in full / *follow so you don't miss it* |

★ = a scene with a job beyond its line. In order: **09** generate first and lock AMIR's seed ·
**16** lock the second character (the cash buyer) · **17** the frame that makes this shareable ·
**20** the mechanism payoff · **27** emotional peak and thumbnail candidate · **36** the line
people quote in the comments.
---

## 3 · Why this subject, now

- Mainstream BNPL explainers pull **5,716,409** views. The best Islamic-framed video on the
  subject is **8,111 views and two years old**; YouTube estimates ~828 results for the whole
  query. Enormous demand, essentially no supply. This is slate item #1.
- It runs the proven niche format — `Is [specific named product] Halal?` — on a noun nobody in
  the niche has claimed. `Is Forex Halal?` did 158K on the channel where the vaguer *"What do we
  really mean by Halal Investing?"* did 6.4K. **The specificity of the noun is the whole game.**
- Part 15 publishes 2026-08-05, this lands 08-06 — the gap stays under a day, which is rule 0 and
  the only production rule with real evidence behind it.

**Currency:** all figures in `$` per rule 0.5. The slate pitched `£22.50`; a US viewer meeting `£`
at t=0 has no felt reference for the number, and t=0 is the entire swipe decision.

**Where the recap sits, and why.** It opens on the callback — *"In the last episode, we said
that…"* — but it plays at 0:09, after the hook, because `channel-study.md` logged that exact
failure mode: *"the hook flows straight into series bookkeeping."* It costs nothing to place it
there, because the recap **states its own content** rather than pointing at it: a cold viewer
hears two usable facts and never feels sent elsewhere. It resolves on `Same machine. New
checkout.`, which turns the callback into a promise about *this* video. No part numbers in the
spoken line — "the last episode" does work that "in part fifteen" cannot, because nobody knows
what part fifteen was.

**Why the payoff is a test, not a ruling.** *"If a number can grow because you were late, it was
never a price"* is something the viewer can apply to any product they own. That is the channel's
character: mechanisms, not fatwas.

---

## 4 · Packaging

**Title:** `Is Klarna Halal?` — product-first, not mechanism-first. `#riba` stays out of the
title; the English SERP is polluted by the Royal Institute of British Architects. *Riba* appears
in the spoken script and the description only, where the context is unambiguous.

**Thumbnail (rule 2 — never ship on an auto-frame):** the checkout screen, `4 × $22.50` and
`0% interest` visible, `0%` circled in gold. Overlay text: `0% ISN'T FREE`.

**Description** (paste as-is, 1,180 characters):

```
Klarna says 0% interest. You pay exactly what the label says. So where is the money coming from?

It isn't coming from you at the checkout. It's coming from the shop — around 6% of every sale plus a flat fee, against roughly 2% for a card. No retailer absorbs a number like that. It goes into the sticker price, which means the price rose for everyone in the shop, including the man paying cash who never opened the app.

Then the late fee: miss a payment and $90 becomes $97. The amount owed grew because time passed. That is riba in its oldest and plainest form — an increase on a debt for delay.

And the quiet part: split into four, the number stops feeling like money. Basket sizes rise. That isn't a side effect of the model, it's the reason the model exists.

The honest version already exists. A sale has one price, agreed once, fixed at the moment of sale — murabaha. Deferred payment is allowed. A price that grows because you were late is not.

If a number can grow because time passed, it was never a price. It was a loan wearing a receipt.

Part 16 of The Money Machine, Decoded.

Next: the credit card you pay off in full every month. Same question, different answer.
```

**Tags** (312 characters, under the 500 hard limit that silently rejects the whole update):

```
klarna, buy now pay later, is klarna halal, bnpl, klarna explained, afterpay, klarna interest, halal shopping, islamic finance, halal money, muslim money, riba explained, murabaha, personal finance, debt free, money explained, financial literacy, credit, spending habits, faceless finance
```

**Pinned first comment:**

> If Klarna is 0%, who's paying for it? Answer's at 0:28 👇

---

## 5 · Number overlays — added in post, never generated inside an image

| Time | Scene | Overlay |
|---|---|---|
| 0:00 | 01 | `$90.00` / `4 payments of $22.50` / `0% interest`, 0% ringed in gold |
| 0:18 | 07 | `$90` splitting into four `$22.50` chips |
| 0:32 | 11 | `6% + fee` rising off the stack |
| 0:36 | 12 | `2%` on the short stack, `6%` on the tall one |
| 0:41 | 14 | price on the swing-tag ticking upward |
| 0:57 | 19 | `$90 → $97` beside the crossed date |
| 1:20 | 26 | four staggered due-date chips, one per phone |

Gold `#F2B01E` for the number being exposed, white for neutral figures. **One overlay on screen at
a time** — two competing numbers is how a viewer stops reading both.

---

## 6 · Caption burn-in

- **Line 1:** white `#FFFFFF`, Montserrat/Inter Bold 700, sentence case, solid `#000000` box sized
  to the text (not full width)
- **Line 2:** soft gold `#F5D76E`, *italic*, its own black box, offset ~20px left of line 1
- **Position:** lower third, clear of the bottom 250px of a 1920px frame
- **Behaviour:** static per phrase. No karaoke, no word-by-word pop, no colour highlighting, no
  bouncing. Emphasis is italics only.
- **Timing:** swap on the natural clause break — caption change and picture cut land together

---

## 7 · Build order

1. Record the **VO first**. The cut follows speech cadence; every timecode above is a guide.
2. Generate **Scene 09**, approve AMIR, **lock the seed**. Then **Scene 16** for the cash buyer.
   Then the other 36, feeding both approved frames back as image references. Character drift is
   the #1 failure mode of this format.
3. Hard cuts only. No dissolves, whips, zooms or glitch.
4. Slow push-in or lateral drift on every scene — nothing fully static.
5. Film grain across the master.
6. Burn captions per §6, composite overlays per §5.
7. Custom thumbnail. Multi-language audio track on (free "Auto-dubbed" reach). Add to the series
   playlist. Comment on Part 15 pointing here — it ended on a promise.

**One variable moved this upload:** topic family only — a product-named question instead of a
mechanism title. Production style, runtime band and publish window all hold from Part 15. That is
what makes the result readable.

**Do not judge it before 72 hours.** Pass at 150 views, dead at 50, read as views/day with the age
attached — the channel listing's date-only publish dates run a day off, and that is exactly how a
four-hour-old Short got written off as a corpse once already.
