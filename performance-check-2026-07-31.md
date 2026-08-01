# Channel Performance Check — 2026-07-31

**Finance % Decoded** (@Financeundoubtlydecoded) · 191 subscribers (+19 since Jul 17)
Public inventory: **15 Shorts · 2 long-form**. Data pulled from public YouTube via Nexlev.
(Private analytics — retention, traffic sources, RPM — were not available: the Nexlev
account is on the FREE plan and the `get_my_*` tools are gated behind an upgrade.)

## The headline

| Format | Videos | Views | Share |
|---|---|---|---|
| Shorts | 15 | ~8,100 | 99.94% |
| Long-form | 2 | **5** | 0.06% |

Shorts are healthy. **Long-form is the non-performer**, and it isn't close:

| Video | Published | Length | Views |
|---|---|---|---|
| Your Savings Account Is Costing You $359,000 (Is Investing Halal?) | Jul 28 | 17:56 | **3** |
| Your Money Only Exists Because Someone Else Is In Debt | Jul 21 | 5:17 | **2** |

Two videos, ten days and three days old, five views between them — while the Shorts feed
next door served ~8,100. This is not a content-quality problem. Nothing is reaching the video.

## Shorts — for contrast, this is what working looks like

| Short | Views |
|---|---|
| Why You're Born Into Debt 💸 | **1,206** |
| How to Buy a House Without Interest (Halal Mortgage) | 1.2K |
| Why Everything Costs More (The Tax You Never Voted For) | 1K |
| How to Earn Passive Income Without Interest (Sukuk) | 1K |
| How Banks Quietly Trap Your Savings | 963 |
| How to Protect Your Savings From Inflation (Sound Money) | 924 |
| How to Buy a Car Without Interest (Ijara) | 713 |
| Is Your Insurance Even Halal? (Gharar) | 258 |
| Your Insurance Keeps Every Dollar You Don't Claim (Takaful) | 123 |
| Your Bank Only Has 3 Cents of Every Dollar You Own | 8 (hours old) |

The Jul 17 study's finding still holds: universal money topics win, the insurance arc
(Gharar 258 / Takaful 123) was the dip, and the channel recovered by returning to
universal topics. **Ijara (713) and "Born Into Debt" (1,206) confirm the recovery.**
The newest Short at 8 views is hours old — too early to judge, leave it alone.

## Why long-form gets nothing — four causes, all found in the live data

**1. The funnel points at the wrong video.** Every Short's description — including the
1,206-view "Born Into Debt" — links to `7TWUwpbl83U`, the *old* 5-minute video that the
new 17:56 Episode 1 replaced. The channel's entire Shorts audience is being routed into a
video that has 2 views and has been superseded.

**2. The channel's best-performing link is not clickable.** In "Born Into Debt" the main
call to action reads `▶️ FULL VIDEO: [https://youtu.be/7TWUwpbl83U?si=…]`. Square brackets
stop YouTube from turning a URL into a link. The channel's single biggest piece of funnel
real estate — 1,206 views — has a dead link in it.

**3. Two videos both claim to be Episode 1.** The Jul 21 five-minute video and the Jul 28
seventeen-minute video are both positioned as the series opener. They compete instead of
compounding, and the older one holds all the inbound links.

**4. The new flagship is in no playlist.** "Full Episodes" (`PLFvKaPuEiceY`) still contains
only the old video. The new Episode 1 sits outside every playlist, so it gets no
sessions from series binge traffic.

*(The `PLKLKzR1QgFHE` series-playlist link in the descriptions is fine — verified live,
16 videos. Legacy playlist IDs really are that short.)*

## Separately: a finished episode is sitting invisible

**Episode 2 (Halal Mortgage) — `bvZ3NdPKsus` — is private**, and so are all three of its
funnel Shorts (`kOkfpCHeURw`, `sbor6eyJQKc`, `4gRoTTZNnFE`). The repo records them as
uploaded; YouTube returns 403 for all four. A rendered 10-minute episode plus three cuts
have been finished and never published. That is not underperformance — it is zero
distribution, and it's the cheapest win available.

## What was fixed in this pass

All of it is idempotent and runs through the existing daily `promote-longform` workflow.

- **`automation/longform.json` retargeted** to the current flagship `WJ_UhugwA9U`. This
  matters on its own: the daily cron was re-injecting the *stale* link into every Short
  every 24 hours, so any manual fix would have been reverted the next day.
- **Funnel repoint, not funnel stacking.** `inject_funnel` only ever prepended a line, so
  a Short could end up offering two competing "full breakdown" links. It is now
  `repoint_funnel`, which rewrites superseded long-form URLs in place, strips
  link-breaking square brackets, and fixes stale copy ("full 5-minute breakdown" on a
  17:56 video).
- **Shorts list completed: 13 → 15.** The two newest Shorts were missing from the funnel
  config entirely — including "Born Into Debt", the channel's best performer at 1,206 views.
- **The superseded video is retired, not left to compete**: a line at the top of
  `7TWUwpbl83U` sends its viewers to the new Episode 1.
- **Playlist target corrected** to "Full Episodes" so the flagship is actually filed.
- **Repackaging disabled for this video** (`"repackage": false`) — its title and
  description are already well written and shouldn't be overwritten by config.
- **Private assets are now reported**: every run prints any tracked upload whose privacy
  status isn't public, so a shelved episode can't go unnoticed again.

## What needs you (I did not do these)

1. **Publish Episode 2 and its three Shorts**, or delete them. Making a video public is
   your call, not an automated one — the script reports them, it does not flip them.
2. **Pin the seed comment** on the flagship. The API can post but cannot pin.
3. **Captions**: the 17:56 flagship has none (`hasCaption: false`). `media/` already has an
   SRT pipeline (`cinematic_captions.py`) — a long-form video without captions loses both
   search surface and silent-autoplay viewers.

## The honest read

The 7-day rule fires on **Aug 4** for the flagship. But the rule was written to test
whether long-form *packaging* works, and it can't tell you that yet — the video has had no
traffic to package for. Judge it a week after the funnel repoint has actually been running,
not a week after upload. If it still can't clear ~150 views with every Short pointing at
it, the answer is the one the original study already offered: stay on Shorts until ~1k
subscribers and stop spending days on long-form the feed won't deliver.
