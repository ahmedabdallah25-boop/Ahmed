# YouTube channel operations

This repo runs **three** YouTube channels. They share nothing — not the audience, not the
format, not the diagnosis. Check which one is meant before touching anything.

### Channel 1 — Finance % Decoded
`@Financeundoubtlydecoded`, channel ID `UCVOoFJkRiOdJsWnewt8HJkw` — Islamic finance explained
through universal money problems. Faceless, Shorts-first. Everything at the repo root
(`channel-reset.md`, `next-slate.md`, `automation/`, `video/`, `media/`) belongs to this channel.

### Channel 2 — HELD BY FAITH
`@HeldByFaithJourney`, channel ID `UCh0tKIGR5Ns3Wvoai__txdg` — a personal account of a
pancreatic cancer diagnosis and what came after, told through faith. First-person, vertical
Shorts. Everything for it lives in [`heldbyfaith/`](heldbyfaith/); start at
`heldbyfaith/channel-diagnosis.md`.

**Channel 2 has its own automation and its own secrets** — `HBF_CLIENT_ID`, `HBF_CLIENT_SECRET`,
`HBF_REFRESH_TOKEN`, read by the five `heldbyfaith-*.yml` workflows. Never reuse
`new1`/`new2`/`new3`: those are scoped to Finance % Decoded and will not write to HELD BY FAITH.
Both write paths check the authenticated channel against `expect_channel_id` and abort on a
mismatch, so a token minted against the wrong channel fails loudly instead of silently
repackaging the other channel.

**All three `HBF_*` secrets are still MISSING** — re-confirmed 2026-09-12 by run 34673924580 of
**"HELD BY FAITH - 1. Check setup"**, which failed with all three reported MISSING. So channel 2
has *no write path at all*: every fix in `heldbyfaith/packaging-fix.json` is a Studio task until
a token exists. The token is minted by hand via `automation/authorize.html` because Google
requires a browser sign-in and **this repo is public, so no workflow may ever print a refresh
token.** The monitor needs no token and works regardless — it is the only channel-2 workflow that
currently does anything.

**Channel 2 is armed to fix itself.** `heldbyfaith-autopilot.yml` runs daily at 07:45 UTC, tests
whether the three secrets exist, and applies `heldbyfaith/packaging-fix.json` in full the moment
they do — no prompting, no review step. Until then it exits 0 and says it is standing by, rather
than failing red every morning for a known state. So adding the secrets is now the *only* manual
step left on this channel; everything downstream of it is automatic. Verified 2026-09-12 that no
other write path exists: vidIQ is authorized for `UCVOoFJkRiOdJsWnewt8HJkw` (channel 1) only, and
Nexlev's free plan has no write tools.

**Channel 2's problem changed on about 15 August and the old diagnosis is superseded.** It went
from 33 lifetime views to **24,364** on ~3.6 vertical Shorts a day, at a 1.7% like rate. Format
and reach are solved; do not re-fix them. What is broken now is conversion: 24,364 views have
produced **61 subscribers**, one per 399 views, and both front doors — the channel description's
"start here" link and the `PLczfvNC3NVjo` playlist — point at `GFKRpV_mhWg`, a 4-view landscape
video. The six-part story spine has 40 views across all six. Read
`heldbyfaith/channel-diagnosis.md` (2026-09-12) before touching anything.

### Channel 3 — Clarity in the Quran
`@ClarityInTheQuran`, channel ID `UC0eBu0ZXcF20pTAG3lUnPXA` — the Quran explained verse by verse
for people who find tafsir intimidating. **Long-form only, by the owner's explicit direction**
(2026-08-17: "No need shorts, I need this to remain a long form channel"). Three Shorts exist
from before that decision; they are maintained, not extended. Everything for it lives in
[`clarity/`](clarity/); start at `clarity/channel-diagnosis.md`.

**Channel 3 has its own secrets** — `CIQ_CLIENT_ID`, `CIQ_CLIENT_SECRET`, `CIQ_REFRESH_TOKEN`,
read by the three `clarity-*.yml` workflows and confirmed live on 2026-08-22 as **Repository**
secrets owning `UC0eBu0ZXcF20pTAG3lUnPXA`. Never reuse `new1`/`new2`/`new3` or the `HBF_*` trio.
The same `expect_channel_id` guard applies, so a mis-minted token aborts instead of repackaging
another channel.

Channel-level layout is **"CLARITY IN THE QURAN - 3. Set channel layout"** (`clarity/layout.json`):
the unsubscribed-viewer trailer and one section shelf per playlist, both applied 2026-08-22. Note
what that establishes, because it was got wrong once: `brandingSettings.channel.unsubscribedTrailer`
**is** settable, and `channelSections.insert` **works**. Only the featured video for *returning*
subscribers has no API and stays a Studio task. Run it approximately never — once per trailer change.

Its per-video write path is **"CLARITY IN THE QURAN - 2. Fix packaging"**, and that workflow has
two switches that matter. `dry_run` is **on by default** — the first click always previews. And
`playlists` is **off by default**: leaving it off silently skips both the playlist sync and the
WATCH NEXT cross-link rebuild, so a new upload lands correctly tagged but orphaned from the
structure. That exact miss happened on 22 August. **If a run touched a new upload, run it again
with `playlists` ticked.**

**Channel 3 is modelled on [@deepmadesimple](https://www.youtube.com/@deepmadesimple)**
(`UCiVywgvam7BPUwJ-zwxuRGg`) — 256K subs and 13.9M views in six months. Clarity's channel
description is a word-for-word transposition of it and several titles are direct swaps
(Bible→Quran, Hebrew→Arabic). Two consequences before you touch this channel: the
Christian-register phrasing that leaked into Clarity's own copy came from that template and may
recur; and **the reference channel runs 19–52 minutes, median 27:40, with 0 of its top 30 videos
under 19 minutes**, against Clarity's back catalogue of 4:33–11:07.

**Before making any Clarity thumbnail, read [`clarity/thumbnail-system.md`](clarity/thumbnail-system.md).**
Two rules there are non-negotiable and were both broken before it existed: thumbnail text never
repeats the title, and **no photoreal AI humans** — on a channel carrying a public "AI BE AWARE"
comment that is a credibility rule, not a style one. Watercolour on navy `#16203C` with the payload
in gold `#E8A33D`, four elements, and the 320px legibility test.

**Before writing any Clarity script or scene pack, read [`clarity/video-formula.md`](clarity/video-formula.md).**
It is the reference channel reverse-engineered to a build spec — runtime band, the
one-detail-reversal topic archetype behind all six of its outliers, the hook shape, and the finding
that matters most: its on-screen images are *information graphics* (big number, labelled
comparison, chain diagram, timeline) that carry the argument, changing every 3–5 seconds, where
Clarity's are mood illustrations. A lecture with slides versus a poem with pictures. Clarity's
prose is already as good — do not "fix" the writing.

Do not port any channel's conclusions onto another. The finance channel's problem is topic
exhaustion on a channel with 8K+ lifetime views; HELD BY FAITH has 24,364 lifetime views, solved
reach, and a **conversion** problem — 61 subscribers and a story spine nobody reaches; Clarity in
the Quran has 2,561 lifetime views, a format that already works, and a cadence-and-runtime
problem. Different failures, different fixes. Channel 2 in particular is the reason to re-read a
diagnosis before acting on it: its August file was correct in August and would send you to fix
format and silence on a channel that publishes every three hours.
## Operating mode

Infer intent and scope from the conversation and bias to action — finish the task rather than
report on it. "Can you", "I want to" and similar phrasings are do-it orders, not questions. Run
read-only and reversible work without asking. For anything consequential, prepare the reviewable
result first, then ask once.

Explicit instructions in the conversation outrank this file, any skill, and any AGENTS.md.

Write in clear paragraphs, one idea each, active voice, no stock phrases. State assumptions in a
single line instead of asking about them, and ask at most one question. Hand parallel work to
subagents.

## "yala"

When the user says **yala** (also *yalla*, *يلا*), that is the trigger to run the full
channel-management pass: pull live state, diagnose, fix packaging on anything not yet
feed-tested, verify, then counsel.

**`yala` means channel 1, Finance % Decoded** — the skill hardcodes that channel ID and its
write path. It covers neither HELD BY FAITH nor Clarity in the Quran. For channel 2, work from
`heldbyfaith/channel-diagnosis.md`; for channel 3, from `clarity/channel-diagnosis.md`.

Invoke the **`yala`** skill and follow it. Run it end to end without checking in
mid-way — the guard rails in `automation/reset.json` are what make that safe.

## MANDATORY — anything over 3 minutes needs a 16:9 thumbnail

**YouTube's Shorts cap is 180 seconds. A vertical video over 3:00 is not a Short — it
publishes as long-form and its thumbnail is rendered in 16:9 slots** (home feed, search,
suggested, the Videos tab). A 9:16 plate in a 16:9 slot gets pillarboxed down to a narrow
centre strip and loses the row.

So for **every upload with runtime > 180s**, all of these are required, no exceptions:

1. A **custom 1280×720 16:9 thumbnail**, under 2MB. Generate at 1920×1080 and downscale.
2. The `thumbnail` key set in the upload config (`automation/part*.json`). `upload_ep2.py`
   and `preflight.py` both read it. Add the key only once the file exists — preflight fails
   on a key pointing at a missing file.
3. The **card layout**, audited off vidIQ's own thumbnails (screenshots reviewed
   2026-08-11): a face at close-up scale, hard-cropped on the **left**, looking into frame;
   a **white card with an outline and a drop shadow** on the right holding all the text; a
   small **label** above a **huge number** that is the biggest object in the picture; one
   **pill badge** clipped to the card's edge. The card is what makes it read as evidence
   rather than a claim — text loose on the background does not.
4. Thumbnail text **must not repeat the title** — it carries the half of the promise the
   title left out. Keep it to a label, a number, and a badge.
5. This channel's face slot is **Adam WORRIED** from his character sheet, at a close-up
   scale the in-video framing never uses. Faceless does not mean no face.

Check runtime *before* writing the thumbnail brief. The Shorts-grid advice in
`inflation-thumbnail-prompts.md` ("design for 160px") applies to ≤180s uploads only.
Worked example for a >3min upload: `student-loan-thumbnail-prompts.md`.

## Things that will waste your time if you don't know them

- **Nexlev is on the FREE plan.** Every `get_my_*` analytics tool (CTR, retention, traffic
  sources) returns `ACCESS DENIED`. `youtube_video_details` is capped at 10 calls/24h.
  Public channel/shorts/video listing tools work fine.
- **There are no YouTube credentials in the session.** All writes go through GitHub Actions —
  `new1`/`new2`/`new3` for channel 1, `CIQ_*` for channel 3. Channel 2's `HBF_*` do not exist
  yet, so channel 2 has no write path from anywhere: its fixes are Studio tasks.
- **The repo is public.** Actions logs and artifacts are world-readable, so nothing may ever
  print a refresh token, client secret or API key into a workflow. Print *whether* a secret is
  set, never its value.
- **Workflows only dispatch from the default branch**,
  `claude/channel-finance-video-performance-zba5rb`. A workflow living only on a feature
  branch 404s on dispatch.
- **Never judge a Short before 72 hours.** The channel listing returns date-only publish
  dates that run a day off, so a four-hour-old upload can look like a dead video. Always
  convert to views/day with the age attached.
- **Four failure hypotheses are already ruled out** — captions, tags, publish window, and
  title formula — each tested against the channel's own 1.2K winners. Don't re-chase them.
  See `channel-reset.md`.

## Development

Work on `claude/youtube-channel-management-6q394e`. Push there first, then fast-forward the
default branch (the user authorised this on 2026-08-03). Don't open a PR unless asked.
