# YouTube channel operations

This repo runs **two** YouTube channels. They share nothing — not the audience, not the
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

**There are no credentials for channel 2 in this session.** Secrets `new1`/`new2`/`new3` are an
OAuth refresh token scoped to Finance % Decoded — they will not write to HELD BY FAITH. Every
fix for channel 2 is copy-paste until it has its own token.

Do not port channel 1's conclusions onto channel 2. The finance channel's problem is topic
exhaustion on a channel with 8K+ lifetime views; HELD BY FAITH has 33 lifetime views and a
format problem. Different failures, different fixes.

## "yala"

When the user says **yala** (also *yalla*, *يلا*), that is the trigger to run the full
channel-management pass: pull live state, diagnose, fix packaging on anything not yet
feed-tested, verify, then counsel.

**`yala` means channel 1, Finance % Decoded** — the skill hardcodes that channel ID and its
write path. It does not cover HELD BY FAITH. For channel 2, work from
`heldbyfaith/channel-diagnosis.md` instead.

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
3. The **four-slot layout**, audited off vidIQ's own channel and the student-loan long-form
   winners: one face at close-up scale bleeding off an edge; two-to-four words in the
   opposite third, white plus one accent; one graphic device; clean separation. One of the
   slots carries a **specific number**.
4. Thumbnail text **must not repeat the title** — it carries the half of the promise the
   title left out.
5. This channel's face slot is **Adam WORRIED** from his character sheet, at a close-up
   scale the in-video framing never uses. Faceless does not mean no face.

Check runtime *before* writing the thumbnail brief. The Shorts-grid advice in
`inflation-thumbnail-prompts.md` ("design for 160px") applies to ≤180s uploads only.
Worked example for a >3min upload: `student-loan-thumbnail-prompts.md`.

## Things that will waste your time if you don't know them

- **Nexlev is on the FREE plan.** Every `get_my_*` analytics tool (CTR, retention, traffic
  sources) returns `ACCESS DENIED`. `youtube_video_details` is capped at 10 calls/24h.
  Public channel/shorts/video listing tools work fine.
- **There are no YouTube credentials in the session.** All writes go through GitHub Actions
  using secrets `new1`/`new2`/`new3`.
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
