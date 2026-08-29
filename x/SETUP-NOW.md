# Setup sheet — do this in one sitting

I can't touch X from here (no connector, x.com is egress-blocked), so this is
paste-ready rather than applied. Every field below is a literal string. Assets are
built and sitting in `assets/`.

---

## Step 1 — Premium, before anything else
Subscribe and verify **first** — verified accounts get ranking priority, and a day-one
checkmark reads as an account where a post-200 one reads as a pivot. (An earlier draft
also said the analytics you need are Premium-only. That was wrong: your own posts'
impressions and public bookmark counts are visible without it.)

## Step 2 — Handle
Settings → Your account → Account information → Username. Take the first free one:

```
moneydecoded
decodedmoney
themoneydecode
financedecoded
moneyundecoded
```

## Step 3 — Profile fields
Profile → Edit profile. Paste exactly.

**Name**
```
Ahmed — Money Decoded
```

**Bio** (120 of 160 chars)
```
I explain money problems in one picture.
Debt, rent, mortgages, inflation — no jargon, no products, nothing to sell.
```

**Location** — this is a free-text headline slot, not a city. **Exactly 30 characters.** I believe the cap is 30 but couldn't verify it (x.com is
blocked from here) — paste it, check nothing truncates, and recount if you change the
timezone.
```
New diagram every day, 9am GMT
```

**Website**
```
your Finance % Decoded channel URL
```

## Step 4 — Profile picture
`assets/pfp-b-step.png` — **use B.**

I rendered both candidates at the sizes X actually shows and ran the 32px test
(`assets/pfp-legibility-test.png`). Result: **A fails.** The coin-with-slot collapses at
32px into what reads as a minus sign or a "no entry" symbol — a negative glyph on a
finance account, which is the opposite of the job. B, the gold step, stays distinctive
and unambiguous at every size and survives the circular crop.

**Reconciling the two files:** `x-launch.md` recommends a real photo first and the mark
as fallback; that ordering still stands and this one doesn't override it. B is the best
*mark*, ready to use today so nothing blocks launch. **If you'll ever go on camera or run
a Space, shoot a real photo instead** and use the spec in `x-launch.md` §3 — a face outperforms a mark for
reply-driven growth, which is your main engine. Note this departs from Finance %
Decoded's faceless rule; make that call knowingly.

## Step 5 — Header
`assets/header.png` (1500×500). `assets/header-safezone-guide.png` shows in red what
the profile picture covers and what mobile crops — check your version against it before
uploading. Never upload the guide.

## Step 5b — If the handle isn't free
The handle is baked into the rendered PNGs. Don't edit them by hand — change `HANDLE`
at the top of `build_assets.py` and re-run it. Same for `CUR` if you're not in £.

## Step 6 — Post template
- `assets/post-template-blank.png` — the locked grid.
- `assets/post-example-01.png` — worked example. Note what it does: kicker, two-line
  headline, the graphic carrying the argument, and **the assumptions printed on the
  image**.

### House rule, non-negotiable
**Every number on a diagram gets computed, and the assumptions get printed on the
image.** The first draft of the example post carried two figures I'd invented; they were
replaced with `£250/mo, 7%, to age 65` computed properly, and that line is now *on* the
picture. On a finance account an unsourced number is how you get quote-tweeted by
someone with a spreadsheet. The footnote is not clutter — it's the credibility.

## Step 7 — Build 14 posts before publishing one
Buffer is the difference between a system and a hobby. Slate below.

## Step 8 — Then publish, and ramp
2 posts + 20 replies/day from day one. An earlier draft laddered this up from 5 replies;
that throttled the single biggest growth lever to avoid a rate-limit risk I'd overstated.
The real constraint is quality: 20 substantive replies grow an account, 20 one-liners
flag it.

---

# Launch slate — 14 posts

Format mix is deliberate: Reframe is the highest-bookmark format and the fastest to wear
out, so it appears twice in fourteen, not weekly-plus.

| # | Format | Caption (the posted text) | What the diagram shows |
|---|---|---|---|
| 1 | Comparison | Five years of waiting. £80,852 gone. | ✅ `post-example-01.png` |
| 2 | Big Number | A 4% fee sounds small. Over 30 years it eats a third of everything. | One huge %-of-pot-lost figure; thin bar showing the slice the fee takes |
| 3 | Comparison | Your salary went up 3%. Here's what actually happened to it. | Two bars: nominal rise vs real change after inflation, one crossing zero |
| 4 | Chain | How a rate rise 8 months ago became this week's grocery bill. | 5 boxes, arrows: base rate → lender cost → business borrowing → shelf price → you |
| 5 | Big Number | Overpaying by £50/month does something absurd to the end date. | Timeline bar cut short, with years-and-months saved as the giant number |
| 6 | Reframe | Inflation isn't prices going up. It's your money going down. | Crossed-out model beside the right one: fixed basket / shrinking coin |
| 7 | Comparison | Rent for 30 years vs buy for 30 years. Neither number is the one you think. | Two stacked totals, with the hidden components labelled in each |
| 8 | Chain | Buy now, pay later isn't credit. It's worse — here's the mechanism. | 4 boxes tracing where the fee actually lands and who pays it |
| 9 | Timeline | Two people, same income, same job. One retires 11 years earlier. | One track, one fork, the two endpoints dated |
| 10 | Big Number | The pension you were auto-enrolled in has a number you've never seen. | The default-fund fee, rendered as lifetime £ rather than % |
| 11 | Comparison | The cheapest loan you'll be offered is still the most expensive thing you'll buy. | Sticker price vs total-paid, side by side, same baseline |
| 12 | Chain | Every mortgage is a bet on one number. Almost nobody knows which. | The rate → the reset date → the payment, as a dependency chain |
| 13 | Reframe | Interest is not a fee for borrowing. It's a fee for time — and time doesn't stop. | Wrong model crossed out; right model as an accumulating area |
| 14 | Big Number | The gap between "I can afford the payment" and "I can afford it". | Two totals, the second dwarfing the first |

**All 14 are built.** See `assets/contact-sheet.png` for the set at a glance.

Every figure is computed in `build_posts.py` — nothing is typed by hand — and each
headline is generated *from* the computed value, so the words cannot drift from the
maths. Change an assumption at the top of the script and the headline changes with it.

Two things to check before you post any of them:
1. **The scenarios are illustrative, and each says so on the image.** Post 3 assumes an
   inflation rate rather than quoting a live one; post 7's rent-vs-buy flips on any input
   you change. That's why the assumption line is mandatory, not decorative.
2. **Currency and jurisdiction.** Everything is in £ with UK framing (post 10 cites the
   auto-enrolment charge cap, post 12 assumes fix-then-revert mortgages). Change `CUR` in
   both build scripts and revisit 10 and 12 if that's wrong.
