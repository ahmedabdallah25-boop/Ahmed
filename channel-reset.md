# Channel Reset — Finance % Decoded, 2026-08-03

**Channel:** @Financeundoubtlydecoded · 191 subscribers · 21 public videos (+2 scheduled) · 8,212 lifetime views
**Since the last study (2026-07-17):** +19 subs, +8 videos, +2,223 views.

> **Second pass, 19:20 UTC.** The morning pass is below and still stands. What the
> afternoon added is at the end, under *Second pass*: two Shorts stopped accruing views
> entirely, and Part 15 was found sitting unmanaged behind the feed.

Public data only, pulled 2026-08-03. The Nexlev account is still on the free plan, so CTR,
retention curves and traffic sources remain unavailable. Every number below is a view count, a
timestamp or a metadata field. That is enough to establish the main finding and enough to *rule
out* several tempting ones — but not enough to measure the mechanism precisely. Where that
matters it is said out loud.

---

## The one-paragraph version

Three long-form videos — 33 minutes of well-made, well-researched film — have **7 views between
them**. That is where the last two weeks of production capacity went. The Shorts engine, the only
thing on this channel that has ever reached a cold audience, has meanwhile slowed from roughly
200–300 views/day per upload to somewhere between 11 and 145. The craft is not the problem; it is
the best it has ever been. The channel is making things YouTube has no way to deliver, and
under-feeding the one thing it does deliver.

---

## The numbers

### Long-form: 33 minutes of video, 7 views

| Published (PT) | Title | Length | Views |
|---|---|---|---|
| Jul 21, 11:00 | Your Money Only Exists Because Someone Else Is In Debt | 5:16 | **2** |
| Jul 28, 11:00 | Your Savings Account Is Costing You $359,000 (Is Investing Halal?) | 17:56 | **4** |
| Aug 1, 09:00 | How to Buy a House Without Ever Paying Interest | 10:17 | **1** |

A video at 1 view has not been shown to anyone. Long-form is `isShortsEligible: false`, so it gets
no Shorts-feed distribution at all; on a 191-sub Shorts-acquired channel its only cold-start
surfaces are Browse and Suggested, and Shorts subscribers are the weakest Browse signal YouTube
has. Seven views is the expected outcome, not bad luck.

### Shorts: slower, but read this with the ages attached

| Published (PT) | Title | Age | Views | ≈views/day |
|---|---|---|---|---|
| Aug 3, 03:00 | 10 years of payments. You still owe more than you paid. | **~10 h** | 8 | *too new to judge* |
| Aug 2, 07:02 | How Banks Take Your Money Without Touching It (Inflation) | ~1.3 d | 43 | ~33 |
| Aug 2, 03:00 | £1,461 a month. Only £420 buys your house. | ~1.4 d | 200 | ~145 |
| Jul 31, 04:00 | Your Bank Only Has 3 Cents of Every Dollar You Own | ~3.4 d | 39 | ~11 |
| Jul 21, 12:00 | Why You're Born Into Debt 💸 | 13 d | **1,208** | — |
| ~Jul 19 | How to Buy a Car Without Interest (Ijara Explained) | ~15 d | **713** | — |

The mid-July winners ran at **200–300 views/day** in their first days. So the honest read is a
2x–20x slowdown depending on the video — real, but not the cliff a raw view-count column
suggests. **The newest upload is hours old and its 8 views mean nothing yet**; the £1,461 clip at
~145/day is mid-table, not a failure. The genuinely weak ones are the 3-cents Short (~11/day) and
the inflation Short (~33/day).

---

## What was tested and ruled out

Before blaming the obvious things, all nine relevant videos were pulled and compared field by
field against the two 1.2K winners. Four popular explanations do not survive:

| Hypothesis | Verdict | The evidence that kills it |
|---|---|---|
| **Missing captions** | ✗ ruled out | `hasCaption: false` on *all nine* videos — including both 1.2K winners. It cannot explain a difference it does not vary with. |
| **Missing/weak tags** | ✗ ruled out | "Why You're Born Into Debt" has **zero tags** and did 1,208 views. The 3-cents Short has 20 well-chosen tags and did 39. |
| **Publishing outside the 03:00–04:30 PT window** | ✗ ruled out | Three of the four recent Shorts published *inside* the window (03:00, 03:00, 04:00) and still underperformed. The 1,208-view winner published at **12:00 PM PT**, outside it. |
| **Titles drifted off the winning formula** | ✗ insufficient on its own | "How Banks Take Your Money Without Touching It (Inflation Explained)" matches the winning formula exactly — and did 43 views, *worse* than the bare-fragment "£1,461 a month" title at 200. |

That last row matters most, because retitling is the cheap fix everyone reaches for first. On this
channel, right now, the data says title shape alone does not decide the outcome.

Two real defects the audit did establish:

- **The two mortgage funnel clips (16 s and 24 s) ship with no custom thumbnail** — they are the
  only videos served from YouTube's auto-frame path — and carry a **byte-identical 197-character
  boilerplate description**, versus 600–2,300 characters on every winner.
- **The funnel is one-way.** Every Short links to its long-form. **No long-form links back to the
  Short that feeds it** — `bvZ3NdPKsus` lists five older Shorts in "START HERE" but omits both
  clips cut from that very episode.
- **A stale link is live in descriptions.** Part 12 is referenced as both `ebIU6OHJ-jg` (live on
  the Shorts tab now, 124 views, correct title) and `EQT91HgOH78` (the pre-re-upload original,
  whose own fix-pack fallback was "re-upload, then delete the original"). At least one of those is
  almost certainly a dead link sitting in published descriptions.

---

## What is left standing: topic exhaustion

Sort the Shorts by topic, in publish order:

| Topic | Views, in order published |
|---|---|
| Inflation | **1K** → **925** → 43 *(~33/day)* |
| Banks & deposits | 112 → 105 → **965** → 39 *(~11/day)* |
| Insurance | 260 → 124 |
| Mortgage / housing | 106 → **1,225** → 200 *(~145/day)* → 8 *(too new)* |

Three of the four families peak and then fall hard on the next entry. Mortgage is genuinely
unresolved — its two most recent entries are 1.4 days and 10 hours old, and one of them is the
best recent performer.

This is the best-supported explanation left, and it is consistent with the one fact that broke the
title hypothesis: the inflation Short followed the winning formula perfectly and still did 43
views — because it was **the channel's third inflation video**. Formula could not save a subject
the audience had already been served twice.

**Stated honestly:** this is correlational. Topic is confounded with recency, and with the fact
that the newer uploads were also produced as funnel clips. Private analytics — impressions and
swipe-away rate on the first frame — would separate these in an afternoon. Until then, "new
subject" is the variable most worth changing, and it is cheap to test.

### The case against the funnel clips is *not* that they lose views

One of them is the best recent performer (200 views in 1.4 days). The argument against them is
different and it is about opportunity cost: they spend the daily upload slot — the channel's
scarcest resource — advertising videos that have 1 and 4 views, and they give a cold viewer
nothing self-contained to remember the channel for. A 16-second clip that ends by pointing at a
10-minute video no one watches converts nothing.

---

## The decision

`longform-fix.md`, written from this channel's own analysis on 2026-07-24, set the rule:

> **< 40 views with the funnel live for a week** → the Shorts audience won't cross over to
> long-form yet. Stop making long-form until the channel is past ~1k subs, and put the effort back
> into the Shorts series that is actually growing.

Episode 1 had the funnel live for 10 days and finished on **2 views**. The rule fired. Two more
long-form videos shipped anyway — one of them 18 minutes.

**1. Stop the long-form programme.** Not because the videos are bad — Ep2's halal-mortgage script
is the best asset on the channel — but because that rule was right and was written before there
was anything to feel defensive about. Resume when *either*: the channel passes **~1,000 subs**, or
a single Short breaks **5,000 views**.

**2. Stop making funnel/trailer Shorts.** Every Short ships as a complete idea with its own payoff.

**3. Keep all three long-form videos up.** They cost nothing to host, they are genuinely good, and
they become valuable the moment there is an audience to show them to. They are early, not wrong.

**4. Next five uploads: five subjects the channel has never covered.** One new variable per
upload, so the result is readable.

---

## What was changed today

| # | Change | Where |
|---|---|---|
| 1 | **Aug 4 Short repackaged before it publishes** — retitled from the trailer line *"Four questions that tell you if your Islamic mortgage is real"* to **"How to Tell If Your 'Islamic' Mortgage Is Actually Fake"**, and the description rewritten to deliver all four questions inline instead of pointing at a 1-view video | `automation/reset.json` |
| 2 | 3-cents Short (~11/day, 3.4 days old) retitled to open a curiosity gap instead of stating its own answer | same |
| 3 | Stale `EQT91HgOH78` → `ebIU6OHJ-jg` replaced across **every** owned description, by scanning the uploads playlist | `reset_packaging.py` |
| 4 | Two guard rails: the seven 700+ view winners are `protected` and cannot be touched; the two uploads under ~36 h old are `hold` and are skipped so their feed test stays clean | `reset_packaging.py` |
| 5 | Next 10 uploads pitched title-first | `next-slate.md` |

Item 1 is where nearly all the value is — it is the only video on the channel whose packaging can
still be fixed *before* the feed decides on it. Item 2 should be expected to do very little: a
Short that has already been tested rarely re-qualifies, because Shorts get almost no ongoing
search or suggested traffic to recover into. It is done because it is free, not because it is
likely to work.

### Run it

Workflow **Reset packaging** → `dry_run: true` first to see every diff, then `dry_run: false`.
`scheduled_only: true` applies just the Aug 4 Short. Idempotent; safe to re-run.

---

## How to read the next two weeks

Watch **median views/day per Short across a rolling five uploads**, not raw view counts — raw
counts on a 1-day-old Short are noise, which is exactly how a video published this morning ends up
looking like a catastrophe.

- **Back above ~150 views/day within five new-subject uploads** → topic exhaustion was the driver
  and the reset worked.
- **Still under ~50 views/day after five** → the feed has cooled on the channel generally, and
  topic is not the lever. At that point buy one month of private analytics. Guessing from public
  view counts stops being good enough, and CTR plus the retention curve would settle it in an
  afternoon. That is the cheapest remaining source of truth.

**Change one variable per upload.** The Part 14 launch moved publish time, production style, title
style and cross-posting all at once — which is why its 43 views tell us nothing about any of them.
That is the expensive kind of mistake: it costs a whole upload's worth of information.

---

# Second pass — 2026-08-03, 19:20 UTC (12:20 PT)

Six hours after the morning pass. Same public-data-only constraint.

## The ledger, ages attached

| Video | Published (PT) | Age | Views | ≈views/day | Added in the last 6 h |
|---|---|---|---|---|---|
| `sbor6eyJQKc` 10 years of payments | Aug 3, 03:00 | 0.39 d | 18 | *too new* | +10 |
| `OHVnm5R0o5E` Banks take your money (inflation) | Aug 2, 07:02 | 1.22 d | 43 | ~35 | **+0** |
| `kOkfpCHeURw` £1,461 a month | Aug 2, 03:00 | 1.39 d | 227 | ~164 | **+27** |
| `P3DxNgGFah0` Everyone asks at once | Jul 31, 04:00 | 3.35 d | 39 | ~12 | **+0** |

Long-form moved from 7 views to 9 (`WJ_UhugwA9U` 4 → 6). Subscribers flat at 191. The
channel-level 8,212 total is a lagging aggregate and has not moved; ignore it.

## Two things the six hours settled

**1. Retitling a Short that already failed does nothing — now measured, not predicted.**
`P3DxNgGFah0` was retitled at 13:19 UTC and took **exactly zero** additional views in the six
hours after. The morning pass predicted this ("done because it is free, not because it is likely
to work"). It is now evidence. *Stop spending passes retitling dead Shorts.* The only packaging
lever with a real expected return is the pre-publish one.

**2. Topic exhaustion is about the repeated claim, not the topic label.**
The morning pass read mortgage as "genuinely unresolved". Six more hours say it is the strongest
family on the channel, and it is now four entries deep without collapsing:

| Family | Views, in publish order | 4th entry? |
|---|---|---|
| Inflation | 1K → 925 → 43 *(+0/6 h — dead)* | — |
| Banks & deposits | 112 → 105 → 965 → 39 *(+0/6 h — dead)* | collapsed |
| Mortgage / housing | 106 → 1,225 → 227 *(~164/day)* → 18 *(too new)* | **holding** |

Inflation and banking each *restated* an earlier entry's claim. The four mortgage entries each
make a different one — how to avoid interest, the two-houses total, the payment split,
amortisation front-loading. That distinction predicts the data better than the topic label does,
and it is the refinement that matters for the slate: a fourth entry in a family is fine when the
claim is new.

Still correlational, and still unresolvable on public data — impressions and swipe-away rate
would settle it in an afternoon.

## What the pass found that no listing tool shows

The stale-link scan reported **23 owned videos, up from 22** six hours earlier. That number was
the only visible trace of a new upload, and it names nothing. Private videos appear in no public
listing tool, which is the entire surface the free Nexlev plan leaves.

Adding a read-only `--inventory` mode to `reset_packaging.py` identified it:

> `JB6Q_7IE9Jo` (private, publishes **2026-08-05 03:00 PT**) — *Part 15, Paper Gold*
> Uploaded 2026-08-03 15:39 UTC — **2 h 20 m after the morning pass finished**, which is why
> that pass never saw it.

It was absent from `reset.json` entirely: produced, scheduled, and outside the guard rails.
This is the failure mode the pass exists to prevent — a video reaching the feed without its
packaging reviewed — and it was one upload away from happening silently.

## What was changed

| # | Change | Where |
|---|---|---|
| 1 | **Part 15 retitled before it publishes** — `Your Gold Isn't Yours (Paper Gold Explained)` → **`Is Paper Gold Halal? (Most People Own a Promise)`**. Description and tags copied byte-identical from the upload, so title is the only variable moving | `automation/reset.json` |
| 2 | `--inventory`: lists every owned video with privacy status and scheduled `publishAt`, flags any non-public one no config line covers | `reset_packaging.py`, `reset-packaging.yml` |
| 3 | `scheduled` became a list — two videos are now queued behind the feed at once | `automation/reset.json` |

### Why Part 15's title was overridden

`part15.json` had already drafted `Is Paper Gold Halal?` as its `niche_search_format` and
rejected it, arguing for the original from the shape of *Why You're Born Into Debt* (1,208 views).

That reasoning is the exact kind this document ruled out one section above: within-channel title
analogy, where a formula-perfect inflation Short did 43 views against a bare-fragment title at
200. The cross-channel comparison is cleaner because it holds channel size constant — on a single
71.8K-sub channel, `Is Forex Halal?` did **158K** and `What do we really mean by Halal Investing?`
did **6.4K**.

**This channel has never once shipped the niche's dominant format.** That makes it the largest
untested variable available, and Part 15 is the last upload where testing it is free.

## What to watch

`kOkfpCHeURw` clears 72 h on **Aug 5, 03:00 PT** and `sbor6eyJQKc` on **Aug 6, 03:00 PT** — move
both out of `hold` then, and read them as views/day, not raw counts.

The two scheduled Shorts are a clean back-to-back test if nothing else moves:

- **Aug 4** — `4gRoTTZNnFE`, mortgage, curiosity-gap title. Fifth entry in the strongest family.
- **Aug 5** — `JB6Q_7IE9Jo`, paper gold, `Is [X] Halal?` format. New claim, proven format.

If Aug 5 clears ~150 views/day and Aug 4 does not, the format is the lever and the slate should
go all-in on `Is [named product] Halal?` — `next-slate.md` is already ordered that way. If both
land under ~50, topic and format are both exhausted as explanations and the honest next step is
one month of private analytics rather than another guess from view counts.

---

## Length, measured — and a rule that was backwards

Length was the one production variable nobody had tested against this channel's own numbers.
Rule 5 of `next-slate.md` asked for 30–60s Shorts, citing a single 16s-vs-100s comparison and
the niche's 30–45s norm. Measured across every public Short past its 72-hour test, normalised
to views/day:

| Bucket | n | Median v/day | Range |
|---|---|---|---|
| 31–60s | 1 | 92.5 | — |
| 61–90s | 3 | **6.9** | 4–11 |
| >90s | 11 | **43.4** | 3–52 |

**Four of the five best videos on the channel run 133–180 seconds.** `riQ7dLSnogo` is 180s and
did 1,225. The 31–60s bucket's 92.5 is a single video (`UpCMyfIOftA`, 46s) — one data point, not
a pattern.

Acting on the old rule would have meant cutting Part 15 from 140s to 60s. **140s is squarely
inside the band that produced four of the five best videos.** That cut would have destroyed the
format, and it was about to be made on the strength of a rule nobody had checked.

The honest limit: the >90s bucket spans 3 to 52 v/day and contains two of the three *worst*
videos as well. Length does not discriminate inside it. What the winners share is the July 11–14
daily-cadence streak. **Length is noise; cadence is the signal.**

### Part 15 needs no re-cut

Reviewing the burned-in caption track end to end: the hook (0.0–14.5s) is the strongest asset —
*"your money loses value while you sleep / so you buy gold / but most people who buy gold never
own any / they own a promise."* Complete and self-contained.

The closing card `PART THREE: WHAT YOU OWE` (130.8–140.3s) reads as a trailer ending, but slate
rule 1 permits it explicitly — *"a 'next' tease is fine; homework is not."* It is a tease, not
homework. No violation, and no defect worth a delete-and-re-upload, which would mint a new video
id and put the Aug 5 slot at risk for no measured gain.

**Ship it as it is.** The remaining open question on it is the recap block at 14.6–32.3s
(*"quick recap if you're new here"*), which spends 18 seconds re-explaining a video that did 43
views. That is a reasonable hypothesis about a retention cost and nothing more — the retention
curve that would settle it is behind the paywall, and no public number touches it. Not worth
acting on blind.

---

# Third pass — 2026-08-04, 06:08 UTC (Aug 3, 23:08 PT)

Ten hours and forty-eight minutes after the second pass, and **3 h 52 m before
`4gRoTTZNnFE` publishes**. Public data only, same free-plan constraint.

## The ledger, ages attached

| Video | Published (PT) | Age | Views | ≈v/day (avg) | Δ over 10.8 h | marginal v/day |
|---|---|---|---|---|---|---|
| `sbor6eyJQKc` 10 years of payments | Aug 3, 03:00 | 0.84 d | 23 | ~27 | +5 | **~11** |
| `OHVnm5R0o5E` Banks take your money (inflation) | Aug 2, 07:02 | 1.67 d | 46 | ~28 | +3 | ~7 |
| `kOkfpCHeURw` £1,461 a month | Aug 2, 03:00 | 1.84 d | 251 | ~136 | +24 | **~53** |
| `P3DxNgGFah0` Everyone asks at once | Jul 31, 04:00 | 3.80 d | 39 | ~10 | **+0** | **0** |

Long-form flat at **9 views** across 33 minutes (`bvZ3NdPKsus` 1, `WJ_UhugwA9U` 6,
`7TWUwpbl83U` 2). Subscribers flat at **191**. Channel aggregate reads 8,576 — it moved,
but it is still a lagging number and still not worth reading.

**The marginal column is the one that matters.** Average views/day flatters a video whose
feed test has already closed; the last-10.8-hour rate says what is happening now.

## Three things this pass settles

**1. The retitle result is now hard.** `P3DxNgGFah0` has taken **+0 views in the 16.8 hours
since it was retitled** — the second pass measured +0 over six hours and called it evidence.
Two independent windows, both zero. Retitling a Short whose feed test has closed returns
nothing on this channel. Stop spending passes on it; the only packaging lever with expected
value is the pre-publish one.

**2. The fourth mortgage entry is not holding — the second pass called this too early.**
`sbor6eyJQKc` went 18 → 23 views in 10.8 hours: **~11 views/day marginal**, against
`kOkfpCHeURw`'s ~53/day at a comparable point. It is still inside its 72-hour window and stays
in `hold` until Aug 6, so this is a leading indicator and not yet a verdict. But it is not
tracking like a video that is holding, and the second pass's "mortgage is holding at four
entries deep" now rests on `kOkfpCHeURw` alone.

The refinement the second pass drew from it — *a fourth entry is fine when the claim is new* —
is the thing under pressure. `sbor6eyJQKc` does make a new claim (amortisation front-loading)
and is dying anyway. If it lands under 50 v/day on Aug 6, claim-novelty does not rescue a
fifth-deep family, and topic exhaustion is the plainer read after all.

**3. `kOkfpCHeURw` is decaying, not compounding.** 164 v/day average at the second pass, ~136
now, with a ~53/day marginal rate. It will settle mid-table — a good result for this channel,
not a winner. Do not treat it as the mortgage family's proof of life on Aug 6 without noting
the decay curve.

## What was changed

**Nothing.** No packaging fix was due, and this is the correct outcome rather than an empty one:

- Both scheduled videos already have their packaging applied and verified `already up to date`
  on runs 3 and 4 — the pre-publish lever is pulled on both.
- Both `hold` entries are still inside 72 h. `kOkfpCHeURw` clears Aug 5 03:00 PT,
  `sbor6eyJQKc` Aug 6 03:00 PT. Moving them now would destroy the only clean read available.
- The `repackage` entry is now measured as worthless twice. Left in place because the script is
  idempotent and reports `already up to date`; it costs nothing and reverting would mint churn.

A read-only `--inventory` run was dispatched instead — the check that caught `JB6Q_7IE9Jo`
sitting outside the guard rails last pass, run again because there are under four hours until a
publish and no public tool can see a private upload.

## What the inventory run returned

Run `30883075618`, read-only, logs read in full rather than trusting the badge.

**1. Guard rails intact.** `Every non-public video is covered by reset.json.` No repeat of last
pass's near-miss — nothing is reaching the feed unreviewed in the next four hours.

**2. The queue dries up in 1.2 days. This is the finding of the pass.**

```
last published 0.8d ago
2 queued, runway 1.2d
! QUEUE DRIES UP in 1.2d — the next blackout starts there.
```

After `JB6Q_7IE9Jo` publishes Aug 5 03:00 PT there is **nothing behind it**. The channel's own
diagnosis is that *length is noise and cadence is the signal* — and the blackout ledger backs it:

```
BLACKOUT 3.3d before riQ7dLSnogo (2026-07-11)
BLACKOUT 2.4d before ebIU6OHJ-jg (2026-07-17)
BLACKOUT 3.4d before UpCMyfIOftA (2026-07-21)
BLACKOUT 9.7d before P3DxNgGFah0 (2026-07-31)
BLACKOUT 2.0d before kOkfpCHeURw (2026-08-02)
DOUBLE  4.0h between kOkfpCHeURw and OHVnm5R0o5E (2026-08-02)
```

The 9.7-day blackout precedes `P3DxNgGFah0`, which never recovered and is the video sitting at
0 v/day marginal today. **Producing the next Short matters more than any packaging decision
available this pass**, and there is no packaging decision available this pass.

That `DOUBLE` line also earns `OHVnm5R0o5E` a caveat: it went out four hours behind
`kOkfpCHeURw` on the same day and was competing with it for the same feed slot. Its ~28 v/day
is not clean evidence of inflation-topic exhaustion — it is confounded. Do not stack it on the
inflation column without saying so.

**3. Length, re-measured on fresh numbers.**

| Bucket | n | Median v/day | Range |
|---|---|---|---|
| 31–60s | 1 | 89.8 | — |
| 61–90s | 3 | **6.9** | 4–10 |
| >90s | 11 | 42.4 | 3–52 |

Best five: `UpCMyfIOftA` 46s / 89.8 · `riQ7dLSnogo` 180s / 51.5 · `J0TCD2u177k` 144s / 46.7 ·
`a7xkXgTfCXs` 133s / 45.5 · `OXIP3EJROQk` 140s / 45.1. Worst three: 94s, 119s, 79s — all
between 3.4 and 3.8 v/day.

The second pass's conclusion holds — length does not discriminate inside the >90s bucket, and
the 31–60s cell is one video. But **61–90s is the channel's dead zone**: three videos, median
6.9 v/day, no exceptions. That is the one length statement the data actually supports, and it
is a hard constraint on anything currently in production.

## The Klarna asset, checked against this state

`klarna-image-prompts.txt` — 16 stills covering the full 55.37s script — was written this pass.
Validated against the channel, not just against itself:

| Check | Result |
|---|---|
| Title format | `Is Klarna Halal?` is the niche's dominant format — the variable Part 15 tests on Aug 5. Consistent. |
| `riba` in title | Absent. Kept to description and script per the RIBA/architects SERP collision. |
| Length 55.4s | **Safe, and the margin is thin.** 55.4s clears the 61–90s dead zone by 4.6 seconds. |
| Slate length rule | The pack cites "slate rule: 30–60s". That rule was retired last pass as unevidenced. The length is fine; the justification is stale — do not re-derive anything from it. |
| Faceless / no faces | Every prompt specifies a completely blank featureless head; the negative prompt bans facial features. Consistent. |
| Trailer rule | Closes on `Follow — the fix is next.` — a tease, not homework. Permitted. |

**Hard constraint on the edit: this Short must not cross 60 seconds.** At 55.37s of VO plus
captions there is under five seconds of headroom before it lands in the only length bucket on
this channel with no survivors. No end card, no extended hook, no breathing room at the tail.

Its real value is the cadence one. The queue empties Aug 5; **Klarna is the Aug 6 upload**, and
it is the first slate item that tests the proven format on a subject the channel has never
touched — against a 5.7M-view mainstream demand pool whose best Islamic-framed answer is
8,111 views and two years old.

## What to watch, unchanged from the second pass plus one

- `kOkfpCHeURw` clears 72 h **Aug 5 03:00 PT**; `sbor6eyJQKc` **Aug 6 03:00 PT**. Move both out
  of `hold` then and read them as views/day.
- `4gRoTTZNnFE` publishes **Aug 4 03:00 PT** (mortgage, curiosity-gap title, fifth in family).
- `JB6Q_7IE9Jo` publishes **Aug 5 03:00 PT** (paper gold, `Is [X] Halal?`, proven format).
- **New: the Aug 6 slot is empty.** Filling it is now the highest-leverage action on the
  channel, ahead of anything in `reset.json`.
