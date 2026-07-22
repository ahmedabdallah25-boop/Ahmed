# Breakthrough Pack — Long-form Ep. 1: "How Banks Create Money From Nothing"

**Video:** https://youtu.be/7TWUwpbl83U · 5:17 · published Jul 21, 2026, 11:00 AM PT
**At time of writing (~20h in):** 2 views, 1 like

## Why it's stuck (the honest diagnosis)

Nothing is wrong with the video — the hook is the strongest on the channel and the
script delivers. The problem is **distribution physics**:

- All 191 subscribers and ~6k channel views were earned in the **Shorts feed**. YouTube
  recommends long-form through a *separate* system (browse/suggested) that has **zero
  history** for this channel — so it's giving the video ~no impressions.
- 2 views in 20h is an **impressions problem, not a quality problem**. A long-form video
  on a new-to-long-form channel starts from search + external + own-audience traffic,
  and compounds from there.
- One thing genuinely hurt it: **no captions** (auto-captions have errors, nothing
  uploaded) and **chapter timestamps offset ~30–40s late** vs. the actual audio — both
  weaken search indexing, the main organic entry point for long-form.

So the breakthrough plan attacks the only three levers that actually move a long-form
video at this stage: **search packaging**, **funneling the audience the channel already
wins (Shorts)**, and **external distribution**. No shortcuts exist that don't destroy
the channel; this is the push that compounds.

## What the automation now does (`Actions → "Boost long-form Ep. 1" → Run workflow`)

| Step | What it fixes |
|---|---|
| `apply_fix.py longform.json` | Description upgraded: **corrected chapters** (timed to the real audio → proper "key moments" in search), full 13-part series links, subscribe CTA, X link. Tags extended with the search phrases people actually type: "how banks create money", "where does money come from", "money is debt", "bank of england money creation"… Title unchanged — it already matches the channel's winning formula. |
| `upload_captions.py longform.json` | Uploads `media/longform-ep1-captions.srt` — a clean, corrected caption track ("You were **billed**", "**Riba**", "**financier**"). Replaces the error-ridden auto-captions in the player and gives search exact text to index. |
| `post_comment.py longform.json` | Posts the engagement-question comment from the channel account (pin it after — see one-click list). |
| `ensure_longform_playlist.py longform.json` | Creates a public **"The Money Machine, Decoded — Full Episodes"** playlist with the episode in it, *and* appends the episode to the main series playlist so Shorts bingers roll into it. Prints the new playlist URL — paste it into `playlist_url` in `longform.json` and re-run to add it to the description. |
| 6-hourly monitor (`monitor.py longform.json`) | Applies a **7-day rule** (long-form ramps slower than Shorts): PASS ≥ 300 views · DEAD ≤ 25 → repackage (never delete) · GRAY between. Verdict appears in every monitor run's summary. |

## The one-click items the API cannot do (Studio, ~3 minutes total)

1. **Pin the comment** — Studio → Comments → ⋮ → Pin.
2. **End screen** — Studio → Content → Ep. 1 → Editor → add end screen (last 20s):
   *Subscribe* button + *Best for viewer* video. Long-form viewers who reach the end are
   the exact people the algorithm wants to see more of.
3. **Cards** — add an info card at ~2:53 (inflation section) → Part 3 Short, and one at
   ~3:44 (three rules) → Part 8 Short.
4. **Related video on each funnel Short** (below) — when uploading each Short, set
   *Related video* → Ep. 1. This is THE bridge YouTube built for Shorts→long-form and
   the single highest-value click in this document.

## The Shorts→long-form funnel (this is the actual breakthrough lever)

Your Shorts reach 900–1,200 people; the long-form reached 2. Cut three Shorts **from
the episode's own footage** (it's 16:9 — crop/reframe to 9:16, `cinematic_captions.py`
already burns captions in the house style). Timestamps are from the actual audio track:

| # | Cut | From → To | Standalone hook (line 1) | Close |
|---|---|---|---|---|
| A | "Typed, not printed" | 0:45.5 → 1:41 | "Walk into a bank and borrow $20,000. Nobody's savings move." | "97% of all money was made this way. The other 3 minutes are on the channel — full video linked." |
| B | "The missing $3,000" | 1:41 → 2:37 | "The bank created your 20,000 — but you owe back 23. Nobody created the difference." | "Musical chairs, with your livelihood. Full mechanism in the linked video." |
| C | "You were billed" | 3:15.9 → 3:46 | "In 2008 the machine choked. It didn't apologize — it sent you the bill." | **Cliffhanger:** "There's a 1,400-year-old rule set that makes this impossible. Three rules — in the full video." |

Posting order: **A today, C tomorrow, B day 3** — one per day at the usual ~4 AM PT
slot, each with *Related video* → Ep. 1 and a comment linking Ep. 1. Every one of these
is a fresh 900+ impression test that carries a door into the long-form.

## Ready-to-paste distribution (same playbook that's in traffic-pack.md, retargeted)

**X thread (@financedecode):**

> **1/** Right now, a complete stranger is drowning in debt so that the money in your
> account can exist. Not a metaphor. If every debt on Earth were paid off tonight, your
> savings would vanish with them. 🧵
>
> **2/** Walk into a bank, borrow $20,000. Nobody's savings move. The banker types
> 20,000 into a screen and brand-new money appears. The Bank of England admitted it in
> 2014: "when a bank lends, it creates the deposit." ~97% of money = typed, not minted.
>
> **3/** The catch: the bank created your 20,000 — you owe back 23,000. Nobody created
> the extra 3,000. It can only exist inside someone else's loan. Systemwide, debt >
> money. Always. Musical chairs with your livelihood.
>
> **4/** 2008: the machine choked. It didn't apologize — it sent the public a $700B
> bill. You weren't bailed out. You were billed.
>
> **5/** There's a 1,400-year-old rule set engineered to make this exact trick
> impossible. Three rules. Full 5-minute breakdown: https://youtu.be/7TWUwpbl83U

**Community post (poll — the Posts tab gets pushed to your 191 subs' feeds):**

> If every debt on Earth were paid off tonight, what happens to your savings?
>
> 🔘 Nothing — my money is mine
> 🔘 Some of it disappears
> 🔘 All of it disappears
>
> Answer (with the Bank of England's own paper) in our first full episode →
> https://youtu.be/7TWUwpbl83U

**Reddit (r/IslamicFinance, r/Muslim; value-first, link where rules allow):**

> **Title:** The Bank of England's 2014 paper says banks create deposits when they lend
> — here's the mechanism in plain English, and the 1,400-year-old rule set that forbids it
>
> **Body:** Most people think banks lend out savers' deposits. The BoE's "Money creation
> in the modern economy" paper says otherwise: the loan *creates* the deposit, and ~97%
> of money exists this way. The catch is that the interest owed back was never created,
> which is why aggregate debt always exceeds the money supply. I made a 5-minute
> plain-English breakdown that ends with how the riba prohibition + asset-backing +
> risk-sharing rules address exactly this. Happy to answer questions.

**WhatsApp / Telegram groups:**

> The Bank of England admitted banks create money when they lend — and the interest you
> owe back is never created at all. 5-min breakdown of the whole machine (and the
> 1,400-year-old fix): https://youtu.be/7TWUwpbl83U

## Cadence

| When | Action |
|---|---|
| Now | Run **Boost long-form Ep. 1** workflow → then pin comment, end screen, cards (3 min in Studio) |
| Today | Post Cut A Short (related video → Ep. 1) · Community poll · X thread |
| Tomorrow | Cut C Short · WhatsApp/Telegram drops |
| Day 3 | Cut B Short · Reddit post |
| Daily | Monitor posts the 7-day verdict every 6h in Actions summaries |
| Day 7 | PASS ≥ 300 → leave it alone. DEAD ≤ 25 → repackage (below), **never delete** |

## Day-7 repackage kit (only if the monitor says DEAD)

Long-form is evergreen — a slow first week means repackage, not re-upload:

- **Alternate title:** `Your Savings Only Exist Because a Stranger Is in Debt (How Banks Create Money)`
- **Thumbnail concepts:** big text **"TYPED, NOT PRINTED"** over a banker's keyboard; or
  **"97% of money = someone's debt"** with the BoE paper visible. Use Studio's
  *Test & compare* to A/B against the current one.
- Keep description/captions/playlists — they compound regardless.

## What this pack will never include

Bought views, engagement pods, bot comments, or view-exchange schemes. On a
191-subscriber channel a single purchased-traffic wave gets the video's real
distribution suppressed and puts the channel one strike from termination — it is the
only move that guarantees the video never breaks through. Every lever above feeds the
signals the algorithm actually promotes: real watch time, real session starts, real
subscribers.
