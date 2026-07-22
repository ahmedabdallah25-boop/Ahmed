# Finance % Decoded — Channel Study & Last-Video Fix

Analysis of the YouTube channel **Finance % Decoded** (@Financeundoubtlydecoded, "Deen & Dinar")
and a fix pack for the underperforming latest Short.

Data pulled 2026-07-17 from public YouTube data via Nexlev.

| File | Contents |
|---|---|
| [`channel-study.md`](channel-study.md) | Full channel performance study: what the winners share, why the insurance arc is slumping |
| [`last-video-fix.md`](last-video-fix.md) | Copy-paste fix pack for the latest Short (Part 12 — Takaful): new title, description, tags, pinned comment, re-cut hook script, and a 72-hour decision rule |
| [`longform-fix.md`](longform-fix.md) | **Breakthrough pack for long-form Ep. 1** ("How Banks Create Money From Nothing", stuck at 2 views): why it has no impressions, the automated fix (chapters/tags/captions/comment/playlists via *Apply video fix pack* with `config: longform.json`), the Shorts→long-form funnel cut sheet, distribution copy, and a 7-day repackage-don't-delete rule |
| [`automation/`](automation/) | **The pipeline that applies all of it automatically** — scripts + GitHub Actions. One-time key setup in [`automation/SETUP.md`](automation/SETUP.md) (~10 min), then: metadata fix, comment posting, playlist-link repair across all 12 videos, corrected-caption upload + playlist injection for the long-form, and a 6-hourly monitor that applies the 72-hour (Shorts) and 7-day (long-form) decision rules |

## TL;DR

- The channel found a working formula mid-July: universal money topics (savings, mortgage,
  inflation, passive income) + a personal-stakes paradox hook in the first 3 seconds +
  "How to X Without Y / How Banks X Your Y" titles → **~200–300 views/day** (Parts 8, 9, 10, and
  the re-posted 3 and 4 all hit 900–1,200 views).
- The insurance arc broke that formula: Part 11 (Gharar) halved velocity to ~118 views/day,
  and Part 12 (Takaful, published this morning) opened at 5 views.
- Part 12 is only hours old — **do not delete it**. Fix its packaging now (title, description,
  hashtags, pinned comment), and only re-upload with a re-cut hook if it's still dead after 72 hours.
- Next upload should return to a proven universal-money topic to restore feed momentum.
- **Long-form Ep. 1 (Jul 21) opened at 2 views — that's an impressions problem, not a
  quality problem**: the channel's audience was built entirely in the Shorts feed, and
  YouTube's long-form recommender has no history for it yet. The fix is search packaging
  (chapters/tags/captions — automated) plus funneling the Shorts audience into it
  (3 funnel Shorts with related-video links). See `longform-fix.md`.
