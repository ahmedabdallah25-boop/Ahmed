---
name: yala
description: Run the full Finance % Decoded YouTube channel-management pass — pull live channel state, diagnose what changed, fix packaging on anything not yet feed-tested, and report back with counsel. Use when the user says "yala", "yalla", "يلا", or asks to run the channel check / channel pass / manage the channel.
---

# yala — the channel management pass

One command, one channel: **Finance % Decoded** — `@Financeundoubtlydecoded`,
channel ID `UCVOoFJkRiOdJsWnewt8HJkw`. Islamic finance explained through universal money
problems. Faceless, Shorts-first.

Run the whole pass end to end, then counsel. Do not stop halfway to ask whether to
continue — the guard rails below are what make that safe. Do stop and ask if something
genuinely new and irreversible comes up (deleting a video, changing the channel name,
anything touching money).

---

## Step 1 — Pull live state

```
mcp__nexlev__youtube_channel_about   username="@Financeundoubtlydecoded"
mcp__nexlev__youtube_channel_shorts  channel_id="UCVOoFJkRiOdJsWnewt8HJkw" sort_by="newest"
mcp__nexlev__youtube_channel_videos  channel_id="UCVOoFJkRiOdJsWnewt8HJkw" sort_by="newest"
```

Compare against the last recorded state in `channel-reset.md` and note the deltas: subs,
video count, total views, and anything new since.

## Step 2 — Build the ledger with ages attached

**This is the step that prevents the worst mistake available here.** The channel listing
returns date-only publish dates that run a day off, so a Short published four hours ago can
look like a dead video. Always convert to **views/day** and mark anything under 72 hours as
*too new to judge*.

Reference velocities: the mid-July winners ran **200–300 views/day** in their first days.
Under ~50/day is genuinely weak. Between is mid-table.

To get exact publish timestamps use `mcp__nexlev__youtube_video_details`, but see the rate
limit in Constraints — budget those ten calls deliberately.

## Step 3 — Find anything not yet feed-tested

Check `automation/*.json` for `publish_at` timestamps in the future, and any video whose
`privacyStatus` is `private`. **A scheduled video is the highest-leverage thing on the
channel** — its packaging can still be fixed before the algorithm decides on it. Everything
else is damage control.

## Step 4 — Diagnose, and do not re-chase the dead ends

Four hypotheses were tested field-by-field on 2026-08-03 against the two 1.2K winners and
**all four were ruled out**. Do not re-litigate them without new evidence:

| Hypothesis | Why it's dead |
|---|---|
| Missing captions | `hasCaption: false` on all nine tested videos, *including both winners* |
| Weak/missing tags | The 1,208-view winner has **zero** tags; a 39-view Short has twenty good ones |
| Publishing outside 03:00–04:30 PT | Three underperformers published *inside* it; the 1,208-view winner published at **noon** |
| Title drifted off formula | A formula-perfect inflation Short did 43 views — worse than a bare-fragment title at 200 |

**What actually explains it: topic exhaustion.** Inflation ran 1K → 925 → 43. Banking ran
112 → 105 → 965 → 39. Each family peaks then collapses on the next entry. Check whether new
uploads are repeating an already-mined subject before blaming packaging.

## Step 5 — Apply fixes

Edit `automation/reset.json`, then run the workflow. **Dry run first, always**:

```
mcp__github__actions_run_trigger  method=run_workflow
  owner=ahmedabdallah25-boop  repo=ahmed
  workflow_id=reset-packaging.yml
  ref=claude/channel-finance-video-performance-zba5rb
  inputs={"dry_run":"true","scheduled_only":"false"}
```

Read the dry-run diff, then re-dispatch with `dry_run:"false"`.

### Guard rails (already enforced in code — keep them)

- `protected` — the seven 700+ view winners. The script refuses to touch them.
- `hold` — anything published under ~36h ago. Changing packaging mid-test destroys the only
  clean read available. Move ids out of `hold` once they're past 72h and judgeable.

## Step 6 — Verify the logs, never just the badge

Fetch the job logs and read them. `conclusion: success` is necessary but confirm each target
says `written` or `already up to date`.

```
mcp__github__actions_list      method=list_workflow_runs  resource_id=reset-packaging.yml  per_page=1
mcp__github__actions_list      method=list_workflow_jobs  resource_id=<run_id>
mcp__github__get_job_logs      job_id=<job_id>  return_content=true  tail_lines=40
```

## Step 7 — Commit, push, counsel

Commit to `claude/youtube-channel-management-6q394e`, push, then fast-forward the default
branch (see Constraints). Update `channel-reset.md` with the new state so the next pass has
a baseline.

Then counsel: what changed, what it means, what to do next. Lead with the finding, not the
process. Say plainly what is uncertain — the analytics that would settle it are paywalled.

---

## Constraints that will bite

**Nexlev is on the FREE plan.**
- All `get_my_*` tools (CTR, retention, traffic sources, demographics) return `ACCESS DENIED`.
  Do not keep trying them. Everything here runs on public data.
- `youtube_video_details` is capped at **10 calls / 24h**. Spend them on videos that matter.
- Public tools that do work: `youtube_channel_about`, `youtube_channel_shorts`,
  `youtube_channel_videos`, `youtube_search`, `youtube_video_comments`.

**Workflows only dispatch from the default branch.** The default is
`claude/channel-finance-video-performance-zba5rb`. A workflow that exists only on the feature
branch returns **404** on dispatch. The user authorised a direct fast-forward push on
2026-08-03:

```
git push origin claude/youtube-channel-management-6q394e:claude/channel-finance-video-performance-zba5rb
```

Keep using that when the change is a clean fast-forward. If it would not fast-forward, stop
and ask rather than forcing.

**Secrets** are `new1` / `new2` / `new3` → `YT_CLIENT_ID` / `YT_CLIENT_SECRET` /
`YT_REFRESH_TOKEN`. There are no YouTube credentials in the session environment — every write
goes through Actions.

**YouTube caps the whole tags field at 500 characters** and rejects the entire update with
`invalidTags` if exceeded. `fit_tags()` handles this; don't bypass it.

---

## Editorial rules for this channel

- **The niche's winning Shorts format is `Is [specific named product] Halal?`** — `Is Forex
  Halal?` did 158K on a 71.8K-sub channel while `What do we really mean by Halal Investing?`
  did 6.4K. Specificity of the noun is the whole game.
- **No `#riba` in titles.** The English SERP is contested by the Royal Institute of British
  Architects. Keep *riba* in the description and script; use "interest" or "haram" in titles.
- **No trailer Shorts.** Every Short ships as a complete idea with its own payoff.
- **No long-form** until the channel passes ~1,000 subs *or* a single Short breaks 5,000
  views. The rule is the user's own, from `longform-fix.md`; three long-form videos have
  7 views between them.
- **One variable per upload**, so the result is readable.
- **Package title-first**: title, frame one, line one and payoff locked before production.
  See `next-slate.md` for the ten queued pitches.

## Files

| File | What it holds |
|---|---|
| `channel-reset.md` | Current diagnosis, what was ruled out, how to read the next two weeks |
| `next-slate.md` | The ten queued uploads, pitched title-first, with the competitive data |
| `automation/reset.json` | Packaging targets, `protected` and `hold` lists |
| `automation/reset_packaging.py` | Applies it; idempotent; exits non-zero on any failure |
