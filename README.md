# Finance % Decoded — Channel Study & Video Fix Packs

Analysis of the YouTube channel **Finance % Decoded** (@Financeundoubtlydecoded, "Deen & Dinar")
and the automation that applies the fixes to the live channel.

Latest pass: **2026-07-29**, on long-form Episode 1 (`WJ_UhugwA9U`). Public YouTube data via
Nexlev — the connected-channel analytics tools (retention, CTR, traffic sources) are locked on
the free plan.

| File | Contents |
|---|---|
| [`longform-fix.md`](longform-fix.md) | **Current.** Why Episode 1 ("Adam vs Sammy", 17:56) sat at 3 views, and the fix: title/content mismatch, the funnel pointed at a dead video, no captions, and the structural ceiling |
| [`channel-study.md`](channel-study.md) | Full channel performance study: what the five 900+ view winners share, why the insurance arc slumped |
| [`last-video-fix.md`](last-video-fix.md) | Earlier fix pack for the Part 12 Short (Takaful) |
| [`automation/`](automation/) | **The pipeline that applies all of it automatically** — scripts + GitHub Actions. One-time key setup in [`automation/SETUP.md`](automation/SETUP.md) (~10 min) |

## TL;DR — the long-form problem

- The channel's Shorts formula works: universal money topic + personal-stakes paradox in the
  first 3 seconds + "How to X Without Y" title → **900–1,200 views** (Parts 8, 3, 9, 10, 4).
- Long-form has not worked yet. Episode 1 is at 3 views (23h); the retired 5:17 attempt died at
  2 views in 7 days.
- The causes were **packaging and routing, not craft**:
  1. The title ("The Market Crashed 35%. His Family Told Him to Quit.") describes a video that
     doesn't exist — the word "quit" appears **nowhere** in the 2,292-word transcript.
  2. The description's opening line — *"Is investing halal"*, the highest-intent query in the
     niche — was never in the title and had no caption track backing it.
  3. All 13 Shorts (~6,000 views, including the 1,223-view Part 8) were funnelling traffic to
     the **dead** previous long-form.
  4. `hasCaption: false` on both long-forms.
- All four are fixed and automated. Retitled to
  **"Your Savings Account Is Costing You $359,000 (Is Investing Halal?)"** — the channel's own
  proven title shape, using the video's own number.

## Running it

```bash
# one-time: see automation/SETUP.md for YT_CLIENT_ID / YT_CLIENT_SECRET / YT_REFRESH_TOKEN
python automation/promote_longform.py --dry-run   # report what would change
python automation/promote_longform.py             # retitle, repoint all Shorts, seed comment
python automation/upload_captions.py              # push the SRT caption track
```

Or run the **Promote long-form** workflow (it holds the secrets and also fires daily at
12:00 UTC, re-healing links and printing the 7-day verdict).

Captions are rebuilt from a timestamped transcript with
`python automation/make_captions.py <transcript.json> media/<video_id>.srt`.
