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

# Third pass — 2026-08-04, 11:04 UTC (04:04 PT)

15.7 hours after the second pass. Same public-data-only constraint. One conclusion from
yesterday does not survive the extra day.

## The ledger

| Video | Published (PT) | Age | Views | Δ since 19:20Z | Marginal v/day |
|---|---|---|---|---|---|
| `4gRoTTZNnFE` Fake Islamic mortgage | Aug 4, 03:00 | **1.1 h** | 4 | *published* | *unjudgeable* |
| `sbor6eyJQKc` 10 years of payments | Aug 3, 03:00 | 1.04 d | 23 | +5 | **~22** |
| `OHVnm5R0o5E` Banks take your money | Aug 2, 07:02 | 1.88 d | 49 | +6 | ~9 |
| `kOkfpCHeURw` £1,461 a month | Aug 2, 03:00 | 2.04 d | 253 | +26 | **~40** |
| `P3DxNgGFah0` Everyone asks at once | Jul 31, 04:00 | 4.00 d | 39 | **+0** | **0** |

Long-form 9 → 12 views (`WJ_UhugwA9U` 6 → 9). Subscribers flat at 191, third pass running.

## 1. The mortgage family did not hold. Yesterday's exception was a measurement artifact.

The second pass read mortgage as "the strongest family on the channel, four entries deep
without collapsing," on the strength of `kOkfpCHeURw` at ~164/day and `sbor6eyJQKc` at 18 views
and 0.39 days old. Both of those numbers have now moved, and both moved down:

| Family | Views, in publish order | Verdict |
|---|---|---|
| Inflation | 1K → 925 → 43 *(0/day)* | collapsed on 3 |
| Banks & deposits | 112 → 105 → 965 → 39 *(0/day)* | collapsed on 4 |
| Insurance | 260 → 124 | collapsed on 2 |
| Mortgage / housing | 106 → 1,225 → 253 *(~40/day)* → 23 *(~22/day)* | **collapsed on 3–4** |

`kOkfpCHeURw`'s **lifetime average of ~124/day hides a 4x decay in its marginal rate** — 145/day,
then 164/day, now ~40/day. Lifetime average is a lagging statistic on a video still inside its
test; it will keep reporting a healthy number long after the feed has stopped serving the video.
**Read the marginal rate between passes, not the lifetime average.** That is a correction to how
the previous two passes computed views/day.

`sbor6eyJQKc` has now cleared 24 hours at ~22/day. Yesterday it was 0.39 days old, which is
precisely the age this document warns against judging — and the caution was right, but it cut the
other way from the one assumed: the video did not improve with age, it resolved downward.

So all four topic families now collapse by entry 3 or 4, with no exception. The second pass's
refinement — *"a fourth entry in a family is fine when the claim is new"* — was built entirely on
mortgage being the outlier. Mortgage is not an outlier. **Retire that refinement.** The simpler
statement fits every family on the channel: repeat the subject and the next entry falls hard.

## 2. Retitling a dead Short is now measured at zero, twice

`P3DxNgGFah0`: 39 views at the retitle, 39 at +6 h, 39 at +21.7 h. **Zero additional views across
nearly a full day.** The second pass called this at six hours; a day of further data says the same
thing with no ambiguity left. This is now a production rule, not an observation:

> **Never spend a pass retitling a Short that has already failed its feed test.** The only
> packaging lever with a real expected return is the pre-publish one.

## 3. Cadence has been daily for four days and has not recovered anything

Worth stating plainly, because it is the hypothesis most likely to be over-trusted next. Uploads
ran Aug 2, Aug 2, Aug 3, Aug 4, and Aug 5 is queued — that is daily cadence restored. The results
across those four days are 253 *(decaying)*, 49, 23, 4. Restoring cadence has not, by itself,
restored anything within four days.

That does not falsify the cadence thesis — the Jul 21 → Jul 31 Shorts blackout is still the single
largest structural event on the channel, and momentum plausibly takes longer than four days to
rebuild. It does mean **cadence is a precondition, not a cure**, and nobody should read a recovery
into the next few days if one appears. Keep shipping daily; do not credit cadence alone for it.

## 4. The actual open risk: the queue is empty after Aug 5

`JB6Q_7IE9Jo` publishes Aug 5 03:00 PT. **Nothing exists behind it.** The slate in
`next-slate.md` is ten pitches on paper with no assets produced against any of them.

A second Shorts blackout is the one failure this channel has already run once, and it is what the
last two weeks were spent recovering from. Producing the next Short is a higher-value action right
now than any further analysis of the existing ones — every one of which is either inside a feed
test that must not be touched, or measured dead.

## What was changed

| # | Change | Where |
|---|---|---|
| 1 | `4gRoTTZNnFE` moved `scheduled` → `hold`. It published this morning; leaving it under `scheduled` would let a later pass rewrite the packaging of a **live** video mid-test | `automation/reset.json` |
| 2 | `hold._why` rewritten with per-video test-expiry dates and marginal rates | same |
| 3 | `P3DxNgGFah0` annotated as applied-and-measured-dead so no future pass re-opens it | same |
| 4 | Next Short produced end to end — script, 46 scenes, image prompts, upload metadata | `klarna-scene-pack.txt` |

No live packaging was touched this pass. All three recent Shorts are inside their feed tests and
`P3DxNgGFah0` is measured unrecoverable, so there was nothing left that a packaging write could
legitimately improve.

## What to watch

- **Aug 5, 03:00 PT** — `kOkfpCHeURw` clears 72 h. Expect it to land near 280–300 lifetime. Move
  it out of `hold`, but do **not** repackage it; rule 2 above applies.
- **Aug 5** — `JB6Q_7IE9Jo` is the channel's first ever `Is [X] Halal?` title. This is the format
  test. Read it at Aug 8, as marginal v/day.
- **Aug 6** — Klarna ships. New format *and* a subject family the channel has never entered.
- The decision rule from the first pass still stands: **still under ~50 v/day after five
  new-subject uploads → buy one month of private analytics.** Public view counts have now produced
  three passes of increasingly fine-grained inference and cannot separate topic from cadence from
  retention. That separation costs one month of a paid plan and an afternoon.

---

# Fourth pass — 2026-08-05, 03:10 UTC (Aug 4, 20:10 PT)

16.1 hours after the third pass. Same public-data-only constraint. No packaging writes were
needed or made this pass — verification and ledger only.

## The ledger

| Video | Age | Views | Δ since 11:04Z | Marginal v/day |
|---|---|---|---|---|
| `4gRoTTZNnFE` Fake Islamic mortgage | 0.7 d | 11 | +7 | ~10 *(in test)* |
| `sbor6eyJQKc` 10 years of payments | 1.7 d | 32 | +9 | ~13 |
| `OHVnm5R0o5E` Banks take your money | 2.5 d | 50 | +1 | ~1.5 — dead |
| `kOkfpCHeURw` £1,461 a month | 2.7 d | 257 | +4 | **~6** (164 → 40 → 6) |
| `P3DxNgGFah0` Everyone asks at once | 4.7 d | 39 | +0 | 0 — dead, third zero |

Long-form 12 → 13. Subscribers flat at 191 across four passes. Channel lifetime 8,614.

**Every post-blackout upload is resolving into the same 6–22 v/day band**, regardless of
family, claim novelty, or title shape. `kOkfpCHeURw` — the one recent bright spot — decayed
164 → 40 → 6 and clears its 72 h test today at 10:00 UTC finishing near ~260, under the
280–300 the third pass projected. This is progressively less consistent with per-family topic
exhaustion alone and more consistent with the feed having cooled on the channel generally —
which is precisely the branch the first pass's decision rule was written for. The rule has not
fired yet: the five new-subject/new-format uploads it counts have only just begun (Aug 5 is
entry one). Do not fire it early; do not forget it either.

## Verified this pass

1. **Part 15's format-test packaging is confirmed live on the platform.** The Aug 4 14:00Z
   inventory run shows `JB6Q_7IE9Jo` (private, publishes 2026-08-05 10:00Z) already titled
   `Is Paper Gold Halal? (Most People Own a Promise)` on YouTube itself — not just in config.
   The channel's first `Is [X] Halal?` test goes to the feed correctly packaged. Read it
   **Aug 8, as marginal v/day**, against `4gRoTTZNnFE` (Aug 4, curiosity-gap) as the contrast.
2. **A fresh dry-run pass at 03:11Z confirmed the whole platform state matches config**:
   `JB6Q_7IE9Jo already up to date`, `P3DxNgGFah0 already up to date`, channel metadata up to
   date, 23 owned videos — no unmanaged upload appeared since yesterday's 14:00Z inventory,
   which is how the second pass caught Part 15. `0 video(s) updated` — nothing needed writing.

## The single open risk, unchanged and now due

**The queue is empty after today's 10:00 UTC publish.** The Aug 4 inventory said it plainly:
`QUEUE DRIES UP in 0.8d — the next blackout starts there.` The Klarna Short exists only as
`klarna-scene-pack.txt` — script, 46 scenes, prompts, upload metadata — with no video produced
against it. The Jul 21 → Jul 31 blackout is the single largest structural event on the channel
and the thing the whole reset has been recovering from. **Producing and scheduling Klarna for
Aug 6 outranks every other action on this channel, including analysis.**

---

# Fifth pass — 2026-08-08, 07:18 UTC (00:18 PT)

3.17 days after the fourth pass. Same public-data-only constraint. **Four Shorts published in
that window that no previous pass planned, scheduled or reviewed**, and the pass found a
duplicate upload and an unattended playlist. Both are new failure modes for this document.

## The ledger

| Video | Published (PT) | Age | Views | Lifetime v/day | Marginal v/day |
|---|---|---|---|---|---|
| `BllkNdhDu-k` 3 Questions / credit card | Aug 7, 11:00 | 0.55 d | 19 | 34.3 | *far too new* |
| `RpFWP1a7Huk` Bank Doesn't Want You Debt-Free | Aug 7, 02:29 | 0.91 d | 37 | **40.7** | *in test* |
| `x2hdNP6fzAo` Deadbeat — **DUPLICATE** | Aug 6, 17:20 | 1.29 d | 6 | 4.7 | *in test* |
| `ebPfkBjTbSA` You've Already Paid Klarna | Aug 5, 13:08 | 2.46 d | 18 | 7.3 | *in test* |
| `JB6Q_7IE9Jo` Is Paper Gold Halal? | Aug 5, 03:00 | 2.89 d | 40 | **13.9** | *clears 10:00Z today* |
| `4gRoTTZNnFE` Fake Islamic mortgage | Aug 4, 03:00 | 3.89 d | 24 | 6.2 | 4.1 |
| `sbor6eyJQKc` 10 years of payments | Aug 3, 03:00 | 4.89 d | 35 | 7.2 | 0.9 — dead |
| `OHVnm5R0o5E` Banks take your money | Aug 2, 07:02 | 5.72 d | 53 | 9.3 | 0.9 — dead |
| `kOkfpCHeURw` £1,461 a month | Aug 2, 03:00 | 5.89 d | 261 | 44.3 | 1.3 — dead |
| `P3DxNgGFah0` Everyone asks at once | Jul 31, 04:00 | 7.85 d | 39 | 5.0 | **0 — fourth zero** |

Subscribers 191 → **193**. Channel lifetime 8,614 → **8,748**. Long-form **13 → 13: +0 views
across all three videos in 3.17 days.** The long-form programme is not decaying, it is inert.

## 1. The format test resolved. It won its head-to-head and it did not matter.

`JB6Q_7IE9Jo` — the channel's first ever `Is [X] Halal?`, the largest untested variable
available, read today at 2.89 days as planned — did **40 views, ~13.9/day**.

Against its designed contrast `4gRoTTZNnFE` (Aug 4, curiosity-gap title) at ~6.2/day, the
niche's dominant format is **~2.2x better**. That is a real directional result and it is the
first time any packaging variable on this channel has produced a readable difference.

It is also nowhere near mattering. The first pass set the bar at **~150 v/day within five
new-subject uploads**; 13.9 is inside the same 6–22 band every post-blackout upload has landed
in regardless of family, claim, or title shape. **The format is the better of two losing
options.** Ship `Is [X] Halal?` because it wins on the margin, not because it is the lever.

## 2. The Klarna experiment was contaminated before it ran

`next-slate.md` locked the title `Is Klarna Halal? (Somebody Pays That 0%)`, explicitly
parallel to Part 15 so the Aug 5 → Aug 6 pair would move **exactly one variable: the subject**.
That was the most carefully designed test on this channel.

What shipped was **`You've Already Paid Klarna.`** — a different format entirely. Subject *and*
format both moved, so the pair is unreadable and the designed comparison is gone. 18 views,
~7.3/day.

This is the second time an upload has spent a designed experiment: the Part 14 launch moved
publish time, production style, title style and cross-posting at once. The cost is not the 18
views, it is that the slate's central question — *does the format travel?* — still has exactly
one data point when it should have two.

## 3. A duplicate is live, and it is splitting a test

`x2hdNP6fzAo` and `RpFWP1a7Huk` are **the same video**. Same 59s/58s credit-card script,
published **9 h 09 m apart**, both covering deadbeats/revolvers, the FCA transactor split, the
unrequested limit rise, ~1% cashback against a mid-20s APR, and the same *"a real sale takes
its profit once"* close.

`RpFWP1a7Huk` is the better of the two — fuller description, hashtag block, explicit *"Part 2 of
3"* — and has **37 views to the other's 6**.

This is the exact failure already recorded in `link_fixes` for Part 12 (`EQT91HgOH78` vs
`ebIU6OHJ-jg`): a re-upload shipped without the original being taken down. It is now recorded
under `duplicates` in `reset.json` and **excluded from the series playlist**, but not deleted —
deleting a video is irreversible and is the user's call.

## 4. Every cadence rule was broken inside 48 hours

Rule 0 is the only production rule in `next-slate.md` with real evidence behind it. All of it
was violated:

- **Never two Shorts inside 12 hours.** Three went out inside **17.7 hours**: `x2hdNP6fzAo`
  (Aug 7 00:20Z) → `RpFWP1a7Huk` (+9 h 09 m) → `BllkNdhDu-k` (+8 h 31 m). The channel already
  measured this cost once — the second of the Aug 2 pair took 43 against the first's 227.
- **Hold publish at 03:00–04:30 PT.** All four published outside it: 13:08, 17:20, 02:29,
  11:00 PT. The window is not proven superior; holding it constant is what made the topic
  variable readable. It is no longer constant.
- **New subject per upload.** Credit cards got **three entries in 42 hours** (`x2hdNP6fzAo`,
  `RpFWP1a7Huk`, `BllkNdhDu-k`), with Klarna/BNPL adjacent immediately before. That is the
  topic-exhaustion pattern every previous pass documented, compressed into two days.

`RpFWP1a7Huk` at ~40.7 v/day is the best first-day rate since `kOkfpCHeURw` and is the one
genuinely encouraging number in this ledger — but it is 0.91 days old, it is the exact age this
document repeatedly warns against reading, and its own test is being split by the two uploads
either side of it. **Do not judge it before Aug 10 09:29Z.**

## 5. The playlist was the unattended surface — now fixed

`youtube_channel_playlists` had never been part of a pass. It showed the real gap:

- **`PLKLKzR1QgFHE` (Full Series)** — the playlist linked from the channel description *and*
  the footer of every video description — held **17 of 24 public Shorts**. Eight were missing,
  including **`UpCMyfIOftA`, the 1,208-view winner**. Every Short published since the reset had
  no Browse or Suggested path at all once its 72-hour feed test ended.
- **`PLFvKaPuEiceY` (Full Episodes)** held 2 of 3 long-form.

This matters more than it looks. A Short gets its feed shot in ~72 hours and then goes almost
completely dark — that is *why* retitling a failed Short is measured at zero. A series playlist
is one of the few surfaces that keeps working afterwards, and eight videos had none.

## What was changed

| # | Change | Where |
|---|---|---|
| 1 | **`sync_playlists()`** — purely additive playlist sync, never removes or reorders, skips private/scheduled uploads. Ran live: **9 writes, 0 errors**. `PLKLKzR1QgFHE` 17 → **25**, `PLFvKaPuEiceY` 2 → **3**, both confirmed on the platform | `reset_packaging.py`, `reset.json` |
| 2 | `scheduled` emptied and `JB6Q_7IE9Jo` archived — it published Aug 5, and leaving a live video under `scheduled` lets a later pass rewrite its packaging mid-test | `reset.json` |
| 3 | `hold` refreshed to the five uploads from Aug 5–7 with per-video test-expiry timestamps; the three cleared entries removed, all resolved dead | `reset.json` |
| 4 | `x2hdNP6fzAo` recorded under a new `duplicates` block and excluded from the playlist sync | `reset.json` |

**No packaging was written to any live video.** All five recent uploads are inside their feed
tests, and the three that cleared are measured dead — the rule from the third pass holds:
*never spend a pass retitling a Short that has already failed its feed test.*

## 6. The queue is empty, and this time it was confirmed

The link scan and playlist scan both report **27 owned videos** against 27 public ones. There is
no private or scheduled upload behind the feed — the surface where the second pass caught Part
15 with 2 h 20 m to spare. `scheduled` is `[]`.

Production has clearly not stopped — four Shorts shipped in three days. But it is running
*outside* this repo's config, which is why three of them broke rule 0 and one of them shipped
as a duplicate. **The gap is no longer production capacity. It is that nothing reviews an
upload before it reaches the feed.** That review is the only packaging lever with a measured
non-zero return, and it was bypassed on all four.

## What to watch

- **Aug 10, 09:29Z** — `RpFWP1a7Huk` clears 72 h. It is the one upload with a promising first
  day (~40.7 v/day). Read it as marginal v/day, and read it knowing its test was split.
- **Aug 10, 18:00Z** — `BllkNdhDu-k` clears.
- **The five-upload decision rule has now effectively run.** Counting new-subject/new-format
  uploads from Aug 5: Paper Gold, Klarna, Deadbeat, Debt-Free, 3 Questions — that is five, and
  the median sits near **13 v/day against a ~50 v/day floor**. The first pass wrote the branch
  plainly: *still under ~50 v/day after five → the feed has cooled on the channel generally,
  topic is not the lever, buy one month of private analytics.*

  Four passes of increasingly fine-grained inference from public view counts cannot separate
  topic from cadence from retention, and the last two passes each had to retract a conclusion
  the previous one drew from lifetime averages. **That separation costs one month of a paid
  plan and an afternoon. It is now the highest-value action available on this channel.**

## Addendum — duplicate deleted, 2026-08-08 07:38 UTC

`x2hdNP6fzAo` ("They Call You a Deadbeat for Paying in Full", 6 views) was deleted on the
user's instruction. `RpFWP1a7Huk` — the same script, 37 views, better description — survives.

Verified on the platform the same minute: channel Shorts **24 → 23**, `x2hdNP6fzAo` absent,
`RpFWP1a7Huk` live at 37 views, all seven protected winners intact.

**Two things were built to make this safe, and both should stay.**

`delete_videos()` runs only under `--confirm-delete`, which no routine or scheduled pass sets.
Five guards run before the API call: the flag is explicit, the id is not `protected`, the id is
owned, **its live title still matches the title recorded in `reset.json`**, and the
`duplicate_of` survivor exists, is public, and is a different id. Guard 4 is the one that
earns its keep — a stale or mistyped id gives no signal that it is wrong, and a delete is
permanent and does not return the id.

Ordering matters as much as the guards. A `x2hdNP6fzAo → RpFWP1a7Huk` replacement was added to
`link_fixes` **before** the delete, and `fix_links()` runs ahead of `delete_videos()` in
`main()`, so any description referencing the duplicate was repointed at the survivor while the
id still resolved. Deleting first is exactly how Part 12 left a dead link sitting in live
descriptions — the defect this repo has been carrying a `link_fixes` entry for since the first
pass. It was not repeated.

**What this does not fix.** Removing the duplicate recovers nothing — 6 views is 6 views, and
the credit-card family still took three entries in 42 hours. The value is that the channel no
longer competes with itself on the same query, and that the failure is now recorded rather than
rediscovered. The upstream cause is unchanged and is stated in section 6 above: uploads are
reaching the feed without any pre-publish review, which is the only packaging lever on this
channel with a measured non-zero return.

---

# Sixth pass — 2026-08-09, 17:23 UTC (10:23 PT)

1.42 days after the fifth pass. **This pass is different from the five before it: the private
analytics arrived.** The channel is connected to a vidiq account
(`ahmed.buyenga@gmail.com`), which authenticates as the channel owner and returns the
YouTube Analytics reports this document has been asking for since 2026-08-03 — traffic
sources, per-video watch time, subscribers gained per video, and the subscribed/unsubscribed
split. Nexlev remains on the free plan and still returns `ACCESS DENIED` for every `get_my_*`
tool; that is unchanged and is not the route.

**Three conclusions in this file are now wrong and are corrected below.** They were the best
available reading of public view counts. They did not survive contact with the real numbers.

## The one-paragraph version

The channel does not have a topic problem, a title problem, or a cadence problem. It has one
event. Between **July 11 and July 21** the Shorts feed handed this channel **6,881 views**;
between **August 1 and August 9** it handed it **394**. That is the whole story, and the
reason it happened is visible in the exact like and subscriber counts: the videos that earned
that run were **130–180 seconds** and returned **~5% likes and ~2.2% subscribers per view**,
and the channel then spent its next four upload slots on **44-, 16-, 24- and 27-second clips
that returned 0.9%, 0.0%, 0.0% and 0.0%**. The feed tested the short clips, got nothing back,
and stopped testing. Craft was never the problem and is not the fix. Length and payoff are.

---

## 1. The distribution collapse, measured

`insightTrafficSourceType`, owner analytics, same report both windows:

| Window | Shorts-feed views | Minutes watched | Seconds watched **per view** |
|---|---|---|---|
| Jul 11 – Jul 22 | **6,881** | 5,263 | **45.9 s** |
| Aug 1 – Aug 9 | **394** | 125 | **19.0 s** |

**17.5x fewer views, and each one held for 2.4x less time.**

A caution that matters for anyone re-reading these reports: for Shorts, the API's
`averageViewDuration` and `averageViewPercentage` columns **do not reconcile** with
`estimatedMinutesWatched` — the Shorts feed measures view duration on a different basis, and
taking those columns at face value produces figures above 100% and a flatly wrong conclusion
that retention improved. Only `views`, `estimatedMinutesWatched`, `likes` and
`subscribersGained` are exact. Every number in this pass uses those four.

## 2. The channel's entire audience is one ten-day event

Daily views, owner analytics:

```
Jul 3-10    18   20  120   52  116    4    2          <- baseline before the run
Jul 11-14  171 1199 1935 1951                         <- the run
Jul 15-21  121  304   53  477  370   42 1179
Jul 22-31   25   20    2    4    8    5    4   5  16  13   <- baseline again
Aug 1-6     35  249  102   40   58   32
```

The run is bounded on both sides by the same 2–120 views/day band. **July 11–21 was an
anomaly, not a plateau that was subsequently lost.** Roughly 8,000 of the channel's 8,816
lifetime views come from those eleven days.

This retires the framing of the first five passes. There was no "cooling". There was one
breakout — `riQ7dLSnogo` on Jul 11 — that pulled the catalogue behind it for ten days.

## 3. What actually separates a winner from a loser here

Exact counts, all public Shorts, Jul 1 – Aug 9. Length derived from the owner-analytics
duration/percentage ratio, which is internally consistent and matches the durations already
recorded in this repo.

| Length band | n | Views | Likes | Like rate | Subs | Sub rate |
|---|---|---|---|---|---|---|
| under 35 s | 3 | 315 | **0** | **0.00%** | **0** | **0.00%** |
| 35–60 s | 1 | 1,209 | 11 | 0.91% | 2 | 0.17% |
| 60–120 s | 8 | 1,093 | 56 | 5.12% | 10 | 0.91% |
| **120 s +** | 9 | 6,112 | 303 | **4.96%** | 134 | **2.19%** |

**The three sub-35-second clips took 315 views between them and produced zero likes and zero
subscribers.** Not a low rate — zero, across all three. `kOkfpCHeURw` alone took **257 views
and returned 0 likes and 0 subscribers**, and four passes of this document called it the best
recent performer because it was sorted by view count.

Meanwhile `V8HYpTHy2aU` took 112 views and returned 11 likes and 3 subscribers.

**Views measure what YouTube gave you. Likes and subscribers measure what the audience did
with it, and that is what decides the size of the next test.** This document has been reading
the first and inferring the second.

## 4. `UpCMyfIOftA` is the hinge, and it was misread as the best video on the channel

| | `riQ7dLSnogo` | `UpCMyfIOftA` |
|---|---|---|
| Published | Jul 11 | **Jul 21** |
| Length | 179 s | **44 s** |
| Views | 1,230 | 1,209 |
| Likes | 64 — **5.20%** | 11 — **0.91%** |
| Subscribers | **36 — 2.93%** | **2 — 0.17%** |

The feed gave these two videos the same size of audience. One returned 36 subscribers, the
other returned 2.

`UpCMyfIOftA` published **Jul 21 19:00Z**. Daily views ran **1,179 on Jul 21 and 25 on Jul
22**, and the channel has not had a comparable allocation in the nineteen days since.

Stated honestly: this is one event and the causal direction cannot be proven from it. But it
is the only video in the catalogue whose conversion is wildly out of line with its
distribution, the collapse is same-day, and the length band it belongs to has since returned
literal zeroes three more times. It is the best-supported account available, and unlike
topic exhaustion it makes a prediction that can be tested with the next upload.

`length_vs_views()` has been ranking this video **first on the channel** at 63.9 views/day
across every pass. On the metric that governs distribution it is the worst video the channel
has ever published.

## 5. Corrections to earlier passes

| Claim | Where | Status |
|---|---|---|
| "Topic exhaustion is the best-supported explanation left" | first pass | **Retired.** Inflation ran 1K → 925 → 43 because entries two and three sat on either side of the collapse. `JB6Q_7IE9Jo` — a never-covered subject in the niche's proven format — finished at 40 views and **0 likes**. Subject is not the variable. |
| "Cadence is the signal" — rule 0, `next-slate.md` | first pass, restated in all five | **Falsified on this channel's own data.** The supporting claim was that "every 700+ view Short sits inside a run of sub-1.5-day gaps". The two biggest videos do not: `riQ7dLSnogo` (1,230) followed a **3.26-day** gap and `UpCMyfIOftA` (1,209) followed a **3.36-day** gap with a 9.7-day gap after it. Grouped by the gap that preceded them, Shorts published inside rule 0's window median **9.8 v/day**; Shorts published after a >1.5-day gap median **20.5 v/day**. |
| "The format test won its head-to-head" | fifth pass | **Resolved at zero.** `JB6Q_7IE9Jo` took **+0 views in the 34 hours** to this pass and holds 0 likes on 41 views. The ~2.2x margin over `4gRoTTZNnFE` was two low numbers next to each other. |
| "Buy one month of private analytics — the highest-value action available" | fourth and fifth passes | **Done, and it was right.** Every finding in this pass required data no public tool exposes. It cost nothing in the end: the vidiq connection already existed. |

Long-form is also now settled rather than argued: `WJ_UhugwA9U` has **10 views at 7.22%
average view percentage**, `bvZ3NdPKsus` has **1 view**. The pause stands.

## 6. What was changed this pass

| # | Change | Where |
|---|---|---|
| 1 | **`inventory()` now flags public uploads that never passed through the config.** The old check looked at non-public videos only — and a Studio upload is public the moment it exists, so the four unreviewed Shorts of Aug 5–7 were invisible to it and had to be found by hand. This is the detector for the upstream cause the fifth pass named. | `reset_packaging.py` |
| 2 | **`engagement()` added** — like rate bucketed by length, plus a named list of every public Short under a 2% like rate. Like counts are public and exact, so the metric that actually governs distribution is now readable on every pass without a paid plan. | `reset_packaging.py` |
| 3 | `hold` cleared of `JB6Q_7IE9Jo` and `ebPfkBjTbSA`, both past 72 h and both dead; `RpFWP1a7Huk` and `BllkNdhDu-k` still held to Aug 10 | `reset.json` |
| 4 | Rule 0 rewritten around the measured finding; the 120-second floor added as rule 0 | `next-slate.md` |

**No packaging was written to any live video, and none should be.** The lever this document
has spent five passes refining — retitling published Shorts — has now been measured at zero
three separate times, and this pass explains why: the feed is not re-reading titles, it is
reading what the audience did.

## 7. The open risk, unchanged and now worse

**The channel is dark and the queue is empty.** Last upload `BllkNdhDu-k`, Aug 7 18:00Z —
**2.0 days ago**. `--inventory` reports `NOTHING QUEUED`, 26 owned videos, nothing private or
scheduled behind the feed. The channel description promises *"A new mechanism decoded every
day."*

`Is Your Pension Halal? (You Never Picked What It Buys)` was slated in `next-slate.md` for
**Aug 9 03:00 PT — this morning** — and did not ship. The script, 46 scenes, image prompts and
upload metadata are written in `pension-scene-pack.txt`; no video has been rendered against
them. At ~165 seconds it sits in the 120s+ band, which is the correct band.

Cadence is no longer the headline — section 5 retires that — but shipping nothing is still
shipping nothing, and there is a produced-and-packaged asset one render away.

## How to read the next five uploads

Stop reading views. Read **likes per 100 views**, and read it at 72 hours.

- **Above ~4%** — the upload converted like the July winners did. That is the input the feed
  escalates on, and it is the only number that has ever preceded a run on this channel.
- **Under ~2%** — the test failed regardless of how many views it collected. Do not retitle
  it; that is measured at zero. Ship the next one longer and with a harder payoff.
- **Zero likes at 20+ views** — the format is wrong, not the subject. Every sub-35-second clip
  this channel has published sits here.

**The single change with evidence behind it: nothing under 120 seconds.** Nine videos over
120 s returned 134 subscribers. Twelve videos under 120 s returned 12, and the four shortest
returned none at all.

## Verified on the platform, 18:53 UTC

Run `31330168702` on `615d1c2`, read-only, `conclusion: success`. Both new detectors ran
against the live channel and reproduce the finding **from public data alone**:

```
== Like rate by length (public, past 72h, >=20 views) ==
  <120s    n=12   2619 views    67 likes   2.56% like rate
  >=120s   n=9    6127 views   305 likes   4.98% like rate

  ! 6 public Short(s) under a 2% like rate:
    UpCMyfIOftA    46s   1209 views   11 likes   0.91%
    kOkfpCHeURw    17s    257 views    0 likes   0.00%
    JB6Q_7IE9Jo   141s     40 views    0 likes   0.00%
    P3DxNgGFah0    65s     39 views    0 likes   0.00%
    sbor6eyJQKc    25s     35 views    0 likes   0.00%
    4gRoTTZNnFE    28s     24 views    0 likes   0.00%
```

**One honest qualification, visible in that list.** `JB6Q_7IE9Jo` is **141 seconds** and also
took zero likes, so length is not sufficient on its own. The difference is sample size, and it
matters: at the channel's normal ~5% rate, 315 views should have produced about **15 likes**,
and the sub-35s clips produced **none** — that is a real signal. 40 views should have produced
about **2**, so `JB6Q_7IE9Jo`'s zero is inside the noise and cannot carry weight on its own.

So the rule is *nothing under 120 seconds*, held as a floor rather than a guarantee. Going
long is what the winners did and what the zeroes did not; it is not a promise that a long
video converts. The next five uploads are the test, and the metric is likes per 100 views at
72 hours — not views.

## Where the private analytics come from, and what is still unpulled

**The route is vidiq, not Nexlev.** Nexlev is on the free plan and every `get_my_*` tool
returns `ACCESS DENIED` — re-confirmed 2026-08-09 on `get_my_subscriber_status` for both
windows. The vidiq connector authenticates as `ahmed.buyenga@gmail.com`, `vidiq_user_channels`
returns `UCVOoFJkRiOdJsWnewt8HJkw`, and that is owner-level YouTube Analytics access. Every
number in this pass came from it. **It costs nothing extra — the connection already existed
while four passes of this document were recommending buying a paid plan.**

The connector dropped mid-session on 2026-08-09 and did not re-register, so three queries
remain unpulled. They are listed here so the next pass runs them first rather than
rediscovering the need:

| Query | Why | Status |
|---|---|---|
| `dimensions=["subscribedStatus"]`, both windows | **The one unverified number in this pass.** The Aug 1–9 pull returned SUBSCRIBED 64 views / 253% and UNSUBSCRIBED 447 / 27.98%, which does not reconcile: 447 × 34 s implies 253 minutes against 172 logged channel-wide. Do not cite it until the July control is pulled alongside it. | **blocked** |
| `dimensions=["day"]` for Aug 7–9 | Missing from the Aug 1–6 pull to reporting lag. Closes out `RpFWP1a7Huk` and `BllkNdhDu-k`, which clear 72 h on Aug 10 at 09:29Z and 18:00Z. | **blocked** |
| `dimensions=["video"]` with `estimatedMinutesWatched` | The per-video pull used `averageViewDuration`/`averageViewPercentage`, which are unreliable for Shorts (see §1). Re-pull on minutes watched to get per-video hold time that can actually be trusted. | **blocked** |

**Reading these does not change the decision.** The finding rests on views, likes and
subscribers gained — all exact — and `engagement()` reproduces the length/like-rate split from
public data alone. What the three queries above would add is precision on *where* in a video
cold viewers leave, which sharpens the next script rather than the current diagnosis.

---

# Seventh pass — 2026-08-09, 19:30 UTC (12:30 PT)

2.1 hours after the sixth pass. The vidiq connector came back, so **the three queries the sixth
pass left blocked have all been run**, plus the two retention curves nobody had ever pulled. The
sixth pass's headline finding survives. Its explanation of *why* does not, and the correction
matters because it changes what the next script has to do.

Nexlev was also pulled for the first time as a competitive check rather than an owner-analytics
route. It is still on the free plan and every `get_my_*` tool still returns `ACCESS DENIED` —
but its public faceless-outlier database answers a question owner analytics cannot, and it
answers it in the channel's favour. Section 5.

## The one-paragraph version

The sixth pass said: nothing under 120 seconds. That rule is right and the new data strengthens
it, but the reason given was wrong. Length is not what the feed reads — **hold time is**, and
length is only its proxy. The proof is that the channel's two most recent 120s+ Shorts have the
**best hold time it has ever recorded** — 90.0 and 84.9 seconds per view against the July
winner's 69.5 — and they were given 20- and 41-view tests. Meanwhile the subscribed/unsubscribed
split, finally pulled with its July control, shows the channel's existing audience behaving
**identically to July** (69.5 s → 73.2 s per view) while the cold feed audience collapsed from
45.1 s to 12.6 s. Nothing is wrong with the channel's audience, its subjects, or its titles. The
cold feed is bouncing in the first fifteen seconds, and the reason it is being handed so few
chances to bounce is that **65% of August's distribution was spent on three clips that returned
three to seven seconds each**.

---

## 1. The subscribed/unsubscribed split — the query the sixth pass could not cite

It was listed as **blocked**: the August pull returned figures that did not reconcile, and the
sixth pass correctly refused to use it without the July control. Both windows are now pulled, and
computed from `estimatedMinutesWatched` — exact — rather than the `averageViewDuration` column
that is unreliable for Shorts. They reconcile cleanly.

| | Jul 11–22 | Aug 1–9 | Change |
|---|---|---|---|
| **UNSUBSCRIBED** views | 7,378 | 509 | −93% |
| UNSUBSCRIBED seconds/view | **45.1 s** | **12.6 s** | **−3.6x** |
| UNSUBSCRIBED like rate | 4.23% | 0.98% | −4.3x |
| **SUBSCRIBED** views | 449 | 77 | −83% |
| SUBSCRIBED seconds/view | **69.5 s** | **73.2 s** | **+5%** |

**The subscribed line is the finding.** The people who already know this channel hold for slightly
*longer* now than they did during the best run in its history. Whatever changed in August did not
change them.

Everything that collapsed, collapsed on the cold side. An unsubscribed viewer in July stayed 45
seconds; in August, 12.6. That is not a topic problem — a viewer who dislikes the subject leaves
at three seconds, not forty-five — and it is not a title problem, because the title's work is
already done by the time the clip is playing.

*Caveat kept explicit:* the August SUBSCRIBED cell is 77 views and 3 likes. The hold time (94
minutes over 77 views) is robust; the 3.90% like rate is three likes and should not be read as a
trend.

## 2. Per-video hold time, on the metric that can be trusted — and it inverts the ranking again

The sixth pass flagged that the per-video pull had used `averageViewDuration`, which is unreliable
for Shorts, and asked for a re-pull on `estimatedMinutesWatched`. Done. Seconds watched per view,
every Short, Jul 1 – Aug 9:

| Video | Length | Views | s/view | Likes | Subs |
|---|---|---|---|---|---|
| `ebPfkBjTbSA` You've Already Paid Klarna | ~150s | 20 | **90.0** | 2 | 0 |
| `JB6Q_7IE9Jo` Is Paper Gold Halal? | 141s | 41 | **84.9** | 0 | 1 |
| `ElD5gg-Q1wY` Ijara | — | 715 | 70.4 | 30 | 13 |
| `riQ7dLSnogo` Halal Mortgage | 179s | 1,231 | **69.5** | 64 | **36** |
| `J0TCD2u177k` Sukuk | 144s | 1,049 | 54.6 | 62 | 23 |
| `ebIU6OHJ-jg` Takaful | — | 125 | 47.5 | 8 | 3 |
| `a7xkXgTfCXs` Inflation | 133s | 1,042 | 46.8 | 58 | 17 |
| `V8HYpTHy2aU` Savings | — | 113 | 46.7 | 11 | 3 |
| `OXIP3EJROQk` Savings trap | 140s | 970 | 41.4 | 40 | 22 |
| `zY664YZPI6U` Sound money | — | 930 | 39.5 | 40 | 19 |
| `P3DxNgGFah0` Everyone asks at once | 65s | 39 | 40.0 | 0 | 0 |
| `RpFWP1a7Huk` Debt-Free | 58s | 37 | 19.5 | 1 | 0 |
| `BllkNdhDu-k` 3 Questions | 59s | 19 | 12.6 | 1 | 0 |
| `UpCMyfIOftA` Born Into Debt | 46s | **1,209** | **10.5** | 11 | 2 |
| `4gRoTTZNnFE` Fake mortgage | 28s | 24 | **7.5** | 0 | 0 |
| `sbor6eyJQKc` 10 years of payments | 25s | 36 | **5.0** | 0 | 0 |
| `kOkfpCHeURw` £1,461 a month | 17s | 257 | **3.3** | 0 | 0 |

**The two most recent long Shorts sit first and second on the channel.** `ebPfkBjTbSA` and
`JB6Q_7IE9Jo` hold 90.0 and 84.9 seconds per view — better than `riQ7dLSnogo`, the 1,231-view
video that carried the entire July run. They were tested on 20 and 41 views.

This is the single most important correction in this pass. The sixth pass read those two as
failures ("resolved at zero", "0 likes on 41 views") because it was reading views and likes. On
the metric the Shorts feed actually optimises, they are the best work the channel has ever
published. **The 120s rule did not fail. It was applied twice and it worked twice, and nobody
could see it because the tests were too small to produce a like.**

## 3. Why the tests were that small: the allocation was already spent

Of the **484 views** August's own uploads received, split by length band:

| Band | Videos | Views | Share of views | Minutes watched | Share of watch time |
|---|---|---|---|---|---|
| under 35 s | 3 | **317** | **65.5%** | 20 | 13.5% |
| 35–120 s | 3 | 106 | 21.9% | 40 | 27.0% |
| **120 s +** | 2 | 61 | 12.6% | **88** | **59.5%** |

Two-thirds of everything the feed handed this channel in August went to three clips that returned
three to seven seconds each. The two videos that returned 85–90 seconds per view got an eighth of
the distribution between them.

The feed sizes the next test from what the last one returned. August opened with a 17-second clip
that took 257 views and gave back fourteen minutes, and the channel spent the rest of the month
being tested at 20–40 views a video. **The sub-35s clips did not just fail their own tests — they
set the allocation the good videos were then judged inside.**

*Stated as the correlation it is:* these are lifetime per-video figures for videos published
Aug 2–7, read against an Aug 1–9 window, so they are near-identical but not strictly the same
quantity. And "the feed sizes the next test from the last" is the standard account of Shorts
ranking, not something this dataset proves on its own. What the dataset does show is the
sequence, and the sequence is unambiguous.

## 4. The retention curves — the mechanism, and the correction to rule 0

Never pulled before. Two videos, both of which the feed gave ~1,200 views, and which returned
36 subscribers and 2 subscribers respectively.

| Elapsed | `riQ7dLSnogo` 179s | `UpCMyfIOftA` 46s |
|---|---|---|
| 1% | 1.495 | 1.271 |
| 10% | 0.971 | **1.145** |
| 20% | 0.829 | 0.747 |
| 40% | **0.740** | 0.580 |
| 60% | 0.700 | 0.445 |
| 80% | 0.619 | 0.357 |
| 100% | **0.495** | **0.282** |
| **peak relative retention** | **0.932** (42%) | **0.499** (50%) |

`relativeRetentionPerformance` is YouTube's own normalisation against comparable videos.
`riQ7dLSnogo` sits at the **93rd percentile**. `UpCMyfIOftA` sits at the **50th** — dead average,
on a video this document called the best on the channel for three weeks.

**Both hooked.** Both open above 1.0; `UpCMyfIOftA` is actually *still* above 1.0 at 10% where the
winner has already dipped below. The hook was never the problem, and every pass that speculated
about frame one and line one was chasing the wrong three seconds.

What separates them is what happens next. The winner **plateaus** — 0.83 → 0.74 → 0.70 across the
whole middle of the video, a 40-percentage-point stretch where it barely sheds anyone — and
finishes with half the audience still there. The loser falls off a cliff at 11% and never
recovers, finishing at 0.28.

So rule 0 needs restating. **Length is the proxy. The plateau is the thing.** A 46-second clip
that front-loads its payoff has nothing to hold with after second five, which is why the sub-35s
band returns literal zeroes — not because 35 seconds is a magic number, but because no format that
short on this channel has ever had a middle. The rule stays *nothing under 120 seconds*, because
runtime is the precondition for having a middle at all. But a 200-second video that front-loads
its payoff will fail exactly the same way, and the slate can no longer treat length as sufficient.

## 5. What nexlev adds that owner analytics cannot: the short lane is structurally closed

Two searches, both public-tier:

- **vidiq outliers** — `islamic finance halal money`, Shorts, last three months, under 200K subs.
  Returns devotional and reminder content (`Halal vs Haram | Islamic Reminder`, 9 s;
  `Yes last one is halal!!`, 41 s) at title-relevance scores of **0.04–0.05**. There are no
  breakout Islamic-finance *mechanism* Shorts in the window.
- **nexlev faceless outliers** — semantic query on Islamic finance / halal investing / riba,
  Shorts, outlier score ≥ 2. Average similarity 0.57, and the actual results are soccer
  highlights, Reddit stories, House of the Dragon lore and 4chan explainers. **The curated
  faceless-outlier database contains no halal-money Shorts at all.**

That reconfirms `next-slate.md` finding 3 — the faceless × halal-money intersection is unoccupied
— three weeks later and from a different query. But the more useful result is what the 24
outliers look like sorted by length:

| Length | What wins there |
|---|---|
| 8–33 s | Soccer goals, a litchi timelapse, underwater welding footage, a fruit-sugar comparison |
| 100–172 s | Reddit stories, GoT lore, cooking-history skits, Dave Ramsey podcast clips |

**Every sub-35-second outlier is visual spectacle. Every 100s+ outlier is narrative.** Finance %
Decoded is flat-vector explainer animation — it has no spectacle to sell, and its only retention
mechanism is narrative tension, which needs runtime to exist.

This is the first independent confirmation of rule 0 from data that has nothing to do with this
channel. The sub-35s lane is not underperforming for Finance % Decoded; it is **structurally
closed to it**, and the three zero-like clips were competing in a format the channel cannot make.

### The size comparison worth keeping, and the one worth not over-reading

**ClipJar** (`@ClipJars`) is the closest natural comparison available: **190 subscribers, 23
Shorts** — against this channel's 193 and 23 — in personal finance. Its lifetime views are
**1.56M against 8,816**, and its best Short is **1M views at 129 seconds**.

What that establishes is narrow but real: **a 190-subscriber, 23-video personal-finance Shorts
channel can take 1M views on one upload.** The ceiling is not the subscriber count, and it is not
three weeks of catalogue.

What it does **not** establish is a title change, and the temptation is worth naming because this
document has fallen for it before. ClipJar's titles are all human stakes and a number — *MAN MAKES
200K BUT CANT AFFORD BILLS*, *HIS BOSS HASNT PAID HIM IN OVER 20 WEEKS* — against this channel's
mechanism-and-parenthetical house style. But it clips someone else's podcast, so its raw material
is conflict between real people, which this channel does not have and should not fake. And this
channel's own numbers contradict the inference directly: the mechanism-and-parenthetical titles
are on its **best-converting** videos — `riQ7dLSnogo` 2.92% subscribers, `V8HYpTHy2aU` 2.65%,
`ebIU6OHJ-jg` 2.40%, `OXIP3EJROQk` 2.27%. The title formula is not the defect. Leave it alone.

## 6. Where the August traffic actually came from

`insightTrafficSourceType`, Aug 1–9:

| Source | Views | Seconds/view |
|---|---|---|
| SHORTS feed | 394 | 19.0 |
| YT_SEARCH | **45** | 18.7 |
| YT_CHANNEL | 28 | 32.1 |
| EXT_URL | 17 | 28.2 |
| YT_OTHER_PAGE | 17 | 3.5 |
| RELATED_VIDEO | 4 | 90.0 |
| SUBSCRIBER feed | **3** | — |
| NOTIFICATION | 3 | 60.0 |

Two things worth noting. **Search is 8.8% of August traffic** — 45 views the channel did not have
to be served to get, on a catalogue of 23 Shorts, which is a small but genuine standing asset and
the only surface that does not decay after 72 hours. And the **SUBSCRIBER feed delivered 3 views
against 193 subscribers**, which looks alarming until it is read against §1: subscribers took 77
views in the window, they just took them *through the Shorts feed* rather than the subscriptions
tab. The subscriber base is not dead. It is simply not a distribution channel.

*(Traffic-source rows total 511 against the 586 in the subscribedStatus pull — the two queries ran
minutes apart against a window that is still reporting. Treat both as accurate to ±15% at the
window edge, and neither conclusion depends on the difference.)*

## 7. Corrections to the sixth pass

| Claim | Status |
|---|---|
| "Nothing under 120 seconds" — length is the variable | **Refined, not retired.** Length is the proxy; the plateau is the causal thing. The rule stands as a floor because runtime is the precondition for a middle, but it is now insufficient on its own — see rule 0 in `next-slate.md`. |
| `JB6Q_7IE9Jo` "resolved at zero", the format test failed | **Wrong.** It holds 84.9 s/view, second-best on the channel. It was read on views and likes at a 41-view test, where the channel's ~5% like rate predicts two likes and zero is inside the noise — as the sixth pass itself noted, then concluded against anyway. |
| The Aug 1–9 subscribedStatus pull "does not reconcile" | **Resolved.** It reconciles on `estimatedMinutesWatched`; the July control confirms it. The unreliable columns were `averageViewDuration`/`averageViewPercentage`, exactly as suspected. |
| "The feed has cooled on the channel generally" (fourth/fifth pass, carried into the sixth) | **Retired.** The subscribed cohort's hold time is unchanged. What cooled is the size of the cold test, and §3 shows what spent it. |

## 8. The unshipped asset, audited against the winner's curve

`pension-scene-pack.txt` is written, unrendered, and was slated for **Aug 9 03:00 PT — this
morning**. It did not ship. The channel's last upload was Aug 7 18:00Z, **2.1 days ago**, and
`--inventory` reports nothing queued.

Two things the new retention data says about it, which could not have been said before today:

1. **It runs 3:16 (196 s), not the ~165 s recorded in `next-slate.md`.** Well inside the 120s+
   band and longer than `riQ7dLSnogo`; the discrepancy is in the slate note, not the pack.
2. **Its strongest moment is in the wrong place.** The slate names the glide-path reveal
   (scene 34) as "the strongest asset in the pack". It sits at **2:10–2:16 — 66% through**. On
   `riQ7dLSnogo`'s curve, 66% is where audience retention has fallen to 0.68 and relative
   retention has been declining for twenty-four percentage points; the winner's relative
   retention **peaks at 42%**. The pension pack's 42% mark is scene 17–18 (1:00–1:10), currently
   a thumbnail candidate and a restatement.

   The recommendation is to **seed the glide path at ~1:20 and pay it off at 2:10**, rather than
   introducing it at 2:10 — the reveal keeps its weight, but the audience is given the reason to
   still be there at the point where the winner's curve says they are deciding.

   This is one positive-control curve and should be held that lightly. It is also the only
   positive control the channel has, and the structural point stands without it: do not put the
   best thing in the video two-thirds of the way in.

## What to watch, and what to do

**Do:** render and ship the pension pack. It is the only produced asset, it is in the right length
band, and the channel is dark. Everything in §2 says the last two long Shorts were the best work
here on the metric that matters — the thing they lacked was a test large enough to register.

**Watch — and change what you watch it on.** Views and likes both failed this pass: views ranked a
3.3 s/view clip first, and likes called an 84.9 s/view video a zero at a 41-view test. At the test
sizes this channel is currently getting, neither is readable.

- **Read `estimatedMinutesWatched ÷ views` at 72 hours.** Above ~45 s/view is winner territory
  (`riQ7dLSnogo`, 69.5). Under ~15 s/view is a failed test regardless of view count.
- **Read `relativeRetentionPerformance` at 40%.** Above ~0.85 is the plateau the winner has.
  Under ~0.55 is the cliff `UpCMyfIOftA` has, and no title will fix it.
- Both require the vidiq connector, which is owner-level and free. `engagement()` remains the
  public-data fallback and still works, but it cannot see either of these.

**The five-upload decision rule from the first pass is now spent and should be closed out.** It
said: five new-subject uploads under ~50 v/day → buy private analytics. The uploads happened, the
rule fired, the analytics were bought — and they were free. It has done its job and there is no
version of it left to run. What replaces it is the two thresholds above.
