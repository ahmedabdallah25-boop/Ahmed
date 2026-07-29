# Long-Form Fix — Episode 1: "Adam vs Sammy" (WJ_UhugwA9U)

**Video:** https://youtu.be/WJ_UhugwA9U · 17:56 · published 2026-07-28 11:00 PT
**Status at 2026-07-29 (23h old):** 3 views, 1 like, 0 comments.
**Channel:** 191 subs · 13 Shorts (~6,000 views) · 2 long-form uploads.

Private analytics (retention, CTR, impressions) are still locked — the Nexlev account
is on the free plan, so `get_my_*` returns ACCESS DENIED. Everything below is from
public metadata and the full transcript, both of which are conclusive on their own.

## Diagnosis — ranked by what each one actually costs

### 1. The title describes a video that does not exist

> "The Market Crashed 35%. His Family Told Him to Quit."

I searched the complete 2,292-word transcript:

| Title claim | Reality in the video |
|---|---|
| "His family told him to quit" | **The word "quit" never appears. Not once.** No family tells anyone anything. |
| "The Market Crashed 35%" | One line at **4:30** — "in year two, the market fell 35%" — a mid-video beat, 25% of the way in |
| Implied genre: personal narrative / documentary | Actual genre: a 30-year savings-vs-investing arithmetic comparison |

The nearest thing to the title is 1:39, "for a man whose family lost money" — and that's
Adam's *parents*, describing why Adam plays it **safe**. The title inverts its own subject.

This is worse than a weak title. A weak title gets no clicks. A **mismatched** title gets
a click and then an instant bounce, and on long-form the first-30-seconds retention signal
is the single strongest input YouTube has. A handful of fast exits on a video with no
watch history tells the system "don't show this to anyone" — and it stops.

The title also has zero search demand. Nobody types "the market crashed 35%".

### 2. Your best headline was in the description, and you threw it away

Line 1 of the current description:

> "Is investing halal — and is 'playing it safe' actually costing you money?"

**"Is investing halal" is the highest-intent search query in this entire niche.** Your
video is a 17-minute, numbers-first, honestly-caveated answer to it — genuinely one of
the better answers on YouTube. It is currently competing for that query with nothing:
not the title, not a caption track. That is the whole opportunity, unclaimed.

### 3. All 13 Shorts point at a dead video

Every Short's description opens with:

> ▶ Full 5-minute breakdown — how the whole machine works: https://youtu.be/**7TWUwpbl83U**

That's the *previous* long-form — 2 views in 7 days, hard-failed its own decision rule.
Part 8 alone (**1,223 views**, the channel's best) has been routing its traffic there
since the last run. The ~6,000 views of Shorts reach, the only real distribution this
channel owns, has been pointed at a dead end for a week. **This is the biggest single
lever on the channel and it was aimed at the wrong target.**

Worse, the old injector only skipped a Short when the *current* video id was already in
the description — so retargeting would have **stacked** a second link and left the dead
one in place. Fixed (see below).

### 4. Still no captions — `hasCaption: false`

Second long-form in a row shipped uncaptioned. 18 minutes of narration, and search gets
nothing to index. The last run recorded this as un-automatable without the video master.
That was wrong: `captions().insert` takes a caption file and a video id — **the master
file is not required.** Now automated.

### 5. The structural ceiling (real, and not your fault)

Long-form on this channel gets **zero** Shorts-feed distribution (`isShortsEligible:
false`). Its only cold-start surfaces are Browse, Suggested and Search. Its subscribers
are Shorts-acquired — the weakest Browse signal YouTube has. A 191-sub channel with one
prior long-form at 2 views gets a browse test measured in dozens of impressions.

3 views at 23 hours is close to the arithmetic expectation. Items 1–4 are why the test
that *did* happen converted nobody, and they are all fixable. This one is fixed by
volume of correct swings, not by one upload.

### 6. Published 11:00 AM PT — again

The Shorts that built this audience go out 3:00–4:30 AM PT, which is when these
subscribers are actually active. Both long-forms went out at 11:00 AM PT, into a quiet
house feed. Not retroactively fixable; it matters for Episode 2.

### Not the problem

The video itself. Pacing is deliberate (~128 wpm), the chapter structure is sound, the
Adam/Sammy/Bilal three-act build is genuinely good, and the honesty beats — stating the
8.5% assumption, showing the 6% case, saying outright "if you need the money in a few
years none of this applies" — are a real differentiator in a niche full of hype.
**The video is not underperforming on craft. It is underperforming on packaging and
routing.** That is the good news, because packaging and routing are the parts you can
change after publishing.

---

## The fix

Applied by `automation/promote_longform.py` + `upload_captions.py` via the
**Promote long-form** workflow (holds the OAuth secrets; also runs daily at 12:00 UTC).
Every step is idempotent.

| # | Action | Fixes |
|---|---|---|
| 1 | Retitle + rewrite description, front-loading the real hook and the search phrase | 1, 2 |
| 2 | Add high-intent tags (`is investing halal`, `is investing haram`, `saving vs investing`, …) | 2 |
| 3 | **Repoint all 13 Shorts at this video, replacing the dead link instead of stacking** | 3 |
| 4 | Upload a real caption track built from the transcript | 4 |
| 5 | Add to the series playlist + post the seed comment | — |
| 6 | Report views daily against the 7-day rule | — |

### New title

> **Your Savings Account Is Costing You $359,000 (Is Investing Halal?)**

Why this shape: it is the exact formula behind every video that has worked on this
channel — second-person money loss up front, Islamic-finance term in a parenthetical
suffix. Same skeleton as "How to Buy a House Without Interest (Halal Mortgage)", the
1,223-view champion. `$359,000` is the video's own number (stated at 10:47 as $359,300;
$469k − $110k). And "Is Investing Halal?" claims the search query the video deserves.

66 characters — the hook survives mobile truncation, and search indexes the whole string.

### A/B swap at 48h if CTR stays flat

> **Is Investing Halal? I Ran 30 Years of Numbers — Twice.**

Leads with the query instead of the loss. Swap one variable, not both, and don't touch
the thumbnail in the same 48 hours or you learn nothing.

---

## Still manual — 15 minutes, and worth more than everything above

The API cannot do these. In descending order of value:

1. **Pin the seed comment** on the long-form, and pin a link comment on the five winning
   Shorts (Parts 8, 3, 9, 10, 4). The API posts comments; it cannot pin them.
2. **End screen** on the five winners → this video. Shorts end screens are the closest
   thing this channel has to a distribution channel it controls.
3. **Thumbnail.** I could not grade the current one — `i.ytimg.com` is blocked by this
   session's egress policy (403 on CONNECT), so no image fetch was possible. Spec it
   against this, which follows from the title:
   - **Two numbers, nothing else**: `$110,000` vs `$469,000`, hard split down the middle.
   - Max **4 words** of text. Readable at 168px wide — check by shrinking it, not by
     zooming in.
   - No face needed. If you use one, one face, right third, reacting to the big number.
   - Do **not** put "Is Investing Halal?" in the thumbnail — the title already carries it.
     Thumbnail and title must say *different* things that combine, never the same thing twice.
4. **Re-cut the first 30 seconds** if you ship a v2. The $110k/$469k payoff currently lands
   at 0:51. On long-form that is survivable; leading with it would be stronger.

## Decision rule — 7 days from the promo push

- **≥ 150 views** → the funnel works. Ship Episode 2 (the car / $8,000 episode teased at 17:35).
- **40–150** → funnel works, packaging doesn't. Take the A/B title, rebuild the thumbnail.
- **< 40** → the Shorts audience will not cross to 18-minute long-form yet. Drop to one
  long-form a month, put the effort back into the Shorts series that is actually growing,
  and revisit past ~1k subs.

## On "make it go viral"

I can't promise virality, and you should distrust anyone who does — it isn't a setting.
What I can do is remove every reason this video is currently being suppressed, and that
is done: the title now matches the content, the highest-intent query in the niche is
claimed, 6,000 views of Shorts traffic is routed here instead of at a dead video, and
search finally has a transcript to index.

The honest read: **Episode 2 is the one with a real shot.** This video now converts the
traffic it gets, but the channel's long-form has no watch history for YouTube to build
on. That gets built by consecutive correct swings, and this is swing one, aimed properly
for the first time. The single highest-value thing you can do is publish Episode 2 at
3:00–4:30 AM PT on the car topic, with the thumbnail spec above, while this funnel runs.
