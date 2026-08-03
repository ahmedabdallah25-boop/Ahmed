# Finance % Decoded — YouTube channel operations

This repo runs one YouTube channel: **Finance % Decoded** (`@Financeundoubtlydecoded`,
channel ID `UCVOoFJkRiOdJsWnewt8HJkw`) — Islamic finance explained through universal money
problems. Faceless, Shorts-first.

## "yala"

When the user says **yala** (also *yalla*, *يلا*), that is the trigger to run the full
channel-management pass: pull live state, diagnose, fix packaging on anything not yet
feed-tested, verify, then counsel.

Invoke the **`yala`** skill and follow it. Run it end to end without checking in
mid-way — the guard rails in `automation/reset.json` are what make that safe.

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
