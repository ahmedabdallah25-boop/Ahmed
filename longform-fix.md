# Long-Form Fix — "How Banks Create Money From Nothing" (7TWUwpbl83U)

**Video:** https://youtu.be/7TWUwpbl83U · 5:17 · published 2026-07-21 11:00 PT
**Status at 2026-07-24:** 2 views, 1 like, 0 comments. Channel: 191 subs, 13 Shorts, this
is the only long-form upload.

## Diagnosis — why it's at 2 views

Ranked by how much each one actually costs you. Public data only (Nexlev analytics tools
are locked on the free plan), so 1 and 3–5 are verified facts about the
upload; 2 is the structural read. Applied 2026-07-24 by the *Promote long-form* workflow.

**1. The channel's entire audience is a Shorts audience, and nothing points them here.**
Thirteen Shorts have pulled ~6,000 views. Not one of them mentions this video. Long-form
gets zero Shorts-feed distribution (`isShortsEligible: false`), so its only cold-start
sources are Browse (subscriber home feed) and Suggested — and Shorts-acquired subscribers
are the weakest possible Browse signal YouTube has. A 191-sub Shorts channel gets a
browse test measured in dozens of impressions, not thousands. **2 views is the expected
outcome of publishing long-form into a Shorts-only channel with no internal funnel.**
This is the whole ballgame; everything below is secondary.

**2. The topic is the channel's own worst-performing Short, scaled up 3x.**
Part 2, "How Banks Create Money Out of Thin Air," got **88 views** — the floor of the
whole series. The five 900+ view winners were all *your money, your problem* framings
(mortgage, savings, inflation, passive income). Episode 1 of the long-form series
launched on the one topic the audience already declined, in the most saturated
explainer category on YouTube (fractional reserve / money creation), where a 191-sub
channel has no chance of ranking against the incumbents.

**3. The title abandons the formula that produced every win.** Winners were viewer-first
and second person: "How to Buy a House Without Interest," "How Banks Quietly Trap *Your*
Savings." This one is institution-first and generic; "(And Why You Stay Poor)" is the
only viewer-facing beat and it's in the parenthetical.

**4. No captions.** `hasCaption: false`. A 5-minute talking-explainer with no caption
track loses silent-autoplay retention and gives search nothing to index — and search is
one of only two discovery surfaces this video can currently reach.

**5. Published outside the channel's proven window.** Shorts go out 3:00–4:30 AM PT and
that's when the subscriber base is active; this went out 11:00 AM PT Tuesday. The
description also promises the next episode "next Friday," which doesn't match a Tuesday
cadence.

**Not the problem:** the metadata quality. Chapters, keyword set, and description body
are genuinely good. The video isn't failing on craft — it's failing on distribution.

## The fix

Automated in `automation/promote_longform.py` (run via the *Promote long-form* workflow).
Every step is idempotent — re-running changes nothing that's already correct.

| # | Action | Fixes |
|---|---|---|
| 1 | Verify the series playlist resolves and the video is in it; re-resolve by title if it ever breaks | — |
| 2 | Retitle to the proven viewer-first formula + rewrite the description with the funnel line first | 4 |
| 3 | **Inject `▶ Full 5-minute breakdown: <link>` into all 13 Shorts descriptions** | 1 |
| 4 | Post the engagement/seed comment on the long-form | — |
| 5 | Report views daily against a 7-day decision rule | — |

New title:

> **Your Money Only Exists Because Someone Else Is In Debt**

Second person, paradox in the first four words, no institution subject — the exact shape
of the five hooks that broke 900 views.

### Still manual (can't be done through the Data API)

- **Pin** the comment from step 4, and pin the long-form link comment on your top Shorts
  (Parts 8, 3, 9, 10, 4). API can post comments; it cannot pin them. Two minutes of work,
  and it's the highest-leverage two minutes available.
- **End screens / Shorts "related video" link** on the five winners → this video.
- **Captions:** upload an SRT (or enable auto-captions and correct them). The script
  cannot generate a caption track without the source video file; `media/` only holds
  `part13.mp4`. Drop the long-form master into `media/` and this becomes automatable.
- **Thumbnail review.** A custom thumbnail is set (`maxresdefault` exists) but the proxy
  in this environment blocked image fetch, so it was not evaluated. Check that the text
  is ≤4 words and readable at 168px.

## Decision rule (7 days from the promo push)

Long-form does not behave like Shorts — no 72-hour verdict. After the funnel is live:

- **≥ 150 views** → the funnel works. Ship Episode 2 on a *winner* topic (the halal
  mortgage, Part 8's subject — 1,214 views as a Short).
- **40–150** → funnel works, packaging doesn't. Retitle/re-thumbnail, keep the video.
- **< 40 views with the funnel live for a week** → the Shorts audience won't cross over
  to long-form yet. Stop making long-form until the channel is past ~1k subs, and put the
  effort back into the Shorts series that is actually growing.

**Next episode should not be another money-creation explainer.** Take the Part 8 topic
(buying a house without interest) — it is the single most proven subject the channel
owns — and make that the flagship long-form.
