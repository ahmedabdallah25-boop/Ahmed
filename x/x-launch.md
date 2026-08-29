# X account: build spec

Status: `@ahmedabdalmai0`, new, effectively zero. This file is the whole setup —
the account to reverse-engineer, the metadata to paste in, and the content system.

Note: x.com is blocked from the agent's network, so nothing here was read off the
live profile. Everything is a build spec, not an audit.

---

## 1. The account to reverse-engineer: @VisualizeValue (Jack Butcher)

Not the most famous account. The most **copyable** one — and the only template that
runs on assets you already own.

**Why it wins**

| Mechanic | What it does |
|---|---|
| One image = the entire post | No thread, no video, no face, no hook-writing skill required. The image is the argument. |
| Fixed visual grammar | Black ground, white line, one idea. You recognise it in the feed *before you read it*. Every post compounds the last. |
| The unit of value is a **reframe** | Something the reader already half-believed, drawn so the logic becomes undeniable. That is the exact thing people bookmark and quote-tweet. |
| Zero marginal production cost | Once the template exists, a post is 20 minutes. Sustainable at 2/day forever. |
| Optimised for the right metric | X's ranking weights **bookmarks and shares** far above likes. Diagrams over-index on both — a diagram is a thing you save, a joke is a thing you scroll. |

**Why it's the right template for you specifically:** `CLAUDE.md` already records the
finding that the reference channel's advantage is *information graphics* — big number,
labelled comparison, chain diagram, timeline — carrying the argument, versus mood
illustration. That is the same asset. Build it once, post it on X, cut it into the video.

**Second reference, for the writing layer only: @SahilBloom.** Steal one thing —
his opening-line shape: *specific number → tension → payoff withheld.* Nothing else.

### The five things to actually copy

1. **One idea per post.** If it needs two sentences of setup, it's two posts.
2. **The image is self-contained.** It must make sense with the text deleted. Assume it gets screenshotted and re-shared with no context — that's the win condition, not a loss.
3. **A locked template.** Same ground colour, same type, same margins, every single time. Consistency *is* the brand; variety destroys it.
4. **Caption is one line, max two.** The caption's job is to make you look at the image. It is not a summary.
5. **Reframe, don't inform.** "Here are 5 types of loan" = ignored. "You don't have a debt problem, you have a *time* problem — here's the difference" = saved.

---

## 2. Niche

**Money, decoded** — universal money problems, answered from an Islamic-finance frame.

The frame is the *answer*, never the hook. Hook on the problem everyone has (rent,
debt, a mortgage, a pension, inflation eating a salary); land on the principle. That
positioning already has 8K+ lifetime views of proof on Finance % Decoded, plus a
script library, a thumbnail system and scene packs sitting in this repo.

Why not generic money-Twitter: it is the single most saturated niche on the platform
and you'd be the ten-thousandth account with the same take. Why this instead: at high
visual quality, this corner is close to empty, and it inherits an audience you have
already validated.

**One rule:** never open with the religious frame. It halves the addressable audience
at the exact moment you need reach. Open universal, resolve specific.

---

## 3. Metadata — paste-ready

### Handle
`@ahmedabdalmai0` has three problems: the trailing digit is the universal signal of a
bot or a throwaway, `abdalmai` reads as a typo of a name, and nobody can spell it from
hearing it. Kill it. Changing a handle costs nothing at zero followers and is
impossible later.

Take the first of these that's free:

```
@moneydecoded   ← first choice
@decodedmoney
@themoneydecode
@financedecoded
@moneyundecoded
```

Take a **brand** handle, not a personal one: a brand handle survives a niche pivot,
can be run by a system, and can be handed to a second person. A personal handle can't.

### Display name
```
Ahmed — Money Decoded
```
Deliberately hybrid. X's fastest cold-start growth lever is replying in other people's
threads, and **people don't reply to logos** — they reply to a human. But the feed
needs a brand to recognise. The name gives you the human, the visual template gives
you the brand. Don't drop either half.

### Bio (160 chars — pick one, don't blend)

```
A. The money advice nobody gave you, drawn one diagram at a time.
   Interest-free by conviction. New post daily, 9am.

B. I explain money problems in one picture.
   Debt, rent, mortgages, inflation — no jargon, no products, nothing to sell.

C. Money is simple once someone draws it.
   Daily diagrams on debt, rent and the cost of waiting. 8,000+ people learning here.
```

Recommend **B**. "Nothing to sell" is the highest-trust line available in the finance
niche and it costs you nothing right now.

### Location field
It's free text and it's unindexed — so it is a second headline slot, sitting directly
under your bio. Don't put a city there.
```
New diagram every day, 9am GMT
```

### Website
Your YouTube channel. Links in *post bodies* get reach-suppressed; the profile link
field does not. This is the only free link you get — spend it on the asset that
already converts.

### Profile picture
400×400. **The only test that matters: does it read at 32 pixels?** Nothing else.

- **Recommended — a real photo of you.** Shoulders-up, face filling ~60% of frame,
  eyes on the lens, single flat background in brand navy `#16203C`, warm key light from
  camera-left, neutral-to-slight expression, no hat, no sunglasses, no busy background.
  Crop so your head sits slightly *above* centre. Take 40 shots on a phone against a wall.
- **Fallback if you will never show your face:** a flat mark — one gold `#E8A33D` glyph
  on navy `#16203C`, filling 70% of the circle. A single symbol, **not** a logo with text
  in it. Text in a 32px circle is a grey smudge.
- **Never:** a photoreal AI human. Your own thumbnail rules already forbid it, and on X
  it is the single fastest way to get read as a scam account in the finance niche.

Decision rule: if you will *ever* go on camera or run a Space, use the face. Otherwise
the mark. Once chosen, never change it — the picture is how people find you in a feed.

### Header
1500×500, but the profile picture covers the bottom-left corner and mobile crops the
edges. **Put everything in the right two-thirds, vertically centred.**

Contents: your one-line promise in gold on navy, in the same type as your post
template. Nothing else. No collage, no "as seen in", no stock photo of a city skyline.

The header's actual job is to prove the diagrams are a *system* and not a fluke —
so it should look like the posts.

### Pinned post
Your highest-leverage single asset: every profile visit lands on it. Make it the best
diagram you have made, with a caption of exactly one line saying what this account is
for. **Replace it the moment any post outperforms it.** Re-check monthly.

Do not pin an introduction thread. Nobody reads them.

---

## 4. The content system

### Five formats, on rotation

1. **The Comparison** — two columns, one number each, one obviously worse. (*"Rent for 30 years vs. buy for 30 years"*)
2. **The Chain** — 4-6 boxes with arrows, showing how a thing you don't control reaches your wallet. (*"How a rate rise becomes your grocery bill"*)
3. **The Big Number** — one enormous figure, one line of labelling. Highest share rate of the five.
4. **The Timeline** — the same decision at 25 / 35 / 45, with the cost of waiting shown as area, not text.
5. **The Reframe** — a wrong mental model crossed out, the right one drawn beside it. Highest bookmark rate. Use it once a week, never more.

### Cadence — first 60 days

- **2 posts/day.** ~9am and ~7pm in your target audience's timezone.
- **20 replies/day**, in the threads of accounts with 10K-200K followers in adjacent
  niches. Not "great post 🔥" — a reply that stands alone as a thought. This, not
  posting, is what breaks a cold-start account. Budget more time here than on posts.
- **Stay in your own replies for 30 minutes after posting.** Early reply velocity is a
  direct ranking input.
- **One re-share of your own best post per week**, 3+ days after the original.

### Fifteen hooks, ready to build

```
1.  The rent you pay in 2026 was decided in 2021.
2.  You don't have a debt problem. You have a compounding problem. They are not the same.
3.  Waiting 5 years to start costs more than being wrong for 15.
4.  A 4% fee sounds small. Over 30 years it eats a third of everything.
5.  Your salary went up 3%. Here's what actually happened to it.
6.  Every mortgage is a bet on one number. Almost nobody knows which.
7.  The cheapest loan you'll ever be offered is still the most expensive thing you'll buy.
8.  Inflation isn't prices going up. It's your money going down. The difference matters.
9.  Two people, same income, same job. One retires 11 years earlier. Here's the fork.
10. Buy now, pay later isn't credit. It's worse, and here's the mechanism.
11. The pension you were auto-enrolled in has a number in it you've never seen.
12. Overpaying your mortgage by £50/month does something absurd to the end date.
13. You can't out-earn a bad structure. Draw it and you'll see why.
14. Interest is not a fee for borrowing. It's a fee for *time*, and time doesn't stop.
15. The gap between "I can afford the payment" and "I can afford it" has ruined more people than any crash.
```

### Judging performance
- **Never judge a post before 48 hours.** X's distribution is slower and lumpier than YouTube's.
- **Track bookmarks ÷ impressions**, not likes. That ratio is the only number that predicts whether the account compounds. Above ~1% is strong.
- Likes measure agreement. Bookmarks measure value. Only one of them grows an account.

### What kills reach — don't do any of it
- Links in the post body (put them in the first reply, or nowhere)
- Follow-for-follow, engagement bait, "comment X and I'll DM you"
- Posting and leaving
- Deleting underperformers — it doesn't help, and it destroys your own data
- Changing the visual template because you got bored. You will get bored ~40 posts before your audience notices the template at all.

---

## 5. Do these six things, in this order

1. Claim the handle (5 min) — free now, impossible later.
2. Set display name, bio B, location line, website (5 min).
3. Shoot and crop the profile picture (30 min).
4. Build the post template once — navy `#16203C`, gold `#E8A33D`, locked margins (2 hrs).
5. Make 14 posts before publishing any of them. Launching with a week of buffer is the difference between a system and a hobby.
6. Publish, then reply 20×/day for 60 days without missing one.
