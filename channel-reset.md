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
