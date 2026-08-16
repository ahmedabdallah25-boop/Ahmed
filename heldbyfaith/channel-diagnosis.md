# HELD BY FAITH — channel diagnosis, 2026-08-04

**Channel:** [@HeldByFaithJourney](https://www.youtube.com/@HeldByFaithJourney) · `UCh0tKIGR5Ns3Wvoai__txdg`
**State:** 3 subscribers · 9 videos · **33 lifetime views** · country AE · joined 2015, publishing since 2026-07-01

This is the repo's **second** channel. It has nothing to do with Finance % Decoded, shares none of
its diagnosis, and needs its own file. Public data only — the Nexlev account is on the free plan,
so CTR, retention and traffic sources are unavailable. Everything below is a view count, a
timestamp, or a metadata field.

> **Automation, added 2026-08-16.** The fix below is no longer copy-paste-only.
> `packaging-fix.json` is now machine-readable and applied by
> `automation/heldbyfaith_packaging.py` through three workflows: **HELD BY FAITH - 1. Check
> setup** (read-only, says what is missing), **2. Fix packaging** (dry-run by default), and
> **monitor** (needs no OAuth — runs on the shared `YT_API_KEY` and re-derives the table below
> live). The write path needs `HBF_REFRESH_TOKEN`, minted via `automation/authorize.html`.
> Descriptions and tags stay untouched, per `do_not_touch`.

---

## The one-paragraph version

The content is working on the people who see it. The best Short has **2 likes on 12 views** — a
17% like rate, which is exceptional and says the story lands. The problem is almost nobody sees
it, and that is structural, not editorial. Three of the nine uploads — including the entire
numbered "Episode" spine the channel description points at — are **landscape videos 2 to 5
minutes long**. That is the one format YouTube has no way to distribute: too short to earn
Browse or Suggested, and `isShortsEligible: false`, so no Shorts feed either. They have **4 views
between them.** Meanwhile the six vertical Shorts have 29. And then the channel went quiet for
three weeks.

---

## The numbers

### Format decides everything here

| Video | Published | Length | Vertical? | Views |
|---|---|---|---|---|
| `GFKRpV_mhWg` I Asked Allah for a Long Life… Ep. 1 | Jul 1 | 1:57 | ❌ `isShortsEligible: false` | **3** |
| `xmCDlKXU694` 10 Hours in Surgery… Ep. 2 | Jul 4 | 4:45 | ❌ | **0** |
| `14mGEhEieZY` The Phone Call That Ended 7 Days of Waiting | Jul 14 | 2:52 | ❌ | **1** |
| `1TGtRIpgwt4` 7 Days Waiting for Cancer Results — Ch. 4 | Jul 9 | 1:35 | ✅ | **12** |
| `9CQZ-uS3nuY` How I Told My Family I Have Cancer | — | — | ✅ | **8** |
| `9hR1vXH5PVE` Why I Felt Nothing When They Said Cancer — Ch. 3 | — | — | ✅ | **5** |
| `aTCemKbZ-7Y` Whatever you're fighting tonight 🤲 | — | — | ✅ | **3** |
| `sDYB-J5Tfrs` My life was never in their hands 🤲 | — | — | ✅ | **1** |
| `EaYwE1mrgcM` I woke up 10 hours later and said Alhamdulillah | — | — | ✅ | **0** |

**Landscape: 3 videos, 4 views. Vertical: 6 videos, 29 views.** Per video that is 1.3 vs 4.8 —
roughly **4x**, and the gap is larger than it looks because the landscape videos are the ones
that got the real production effort and the chapter markers.

`GFKRpV_mhWg` is the proof. It is **117 seconds long and still `isShortsEligible: false`** — so
it is not length that excluded it, it is the 16:9 frame. A two-minute landscape video on a
3-subscriber channel has no surface to be shown on at all. Three views is the expected outcome,
not bad luck.

### The engagement signal, which is the good news

`1TGtRIpgwt4`: **12 views, 2 likes.** A 17% like-to-view ratio is far above normal for any
channel at any size. The people who reach this content respond to it strongly. **Nothing in this
diagnosis is about the writing, the voice, or the story.** Those are the channel's assets and
they are working.

---

## What is actually wrong

### 1. The channel has been dark for 21 days

Last upload **2026-07-14**. Today is **2026-08-04**. The channel description promises *"New
episodes of my journey, every week"* and the newest Short's description ends *"Chapter 5 is
coming."*

A 3-subscriber channel has no stored momentum to coast on. This is the first thing to fix and
nothing else on this list will show a result until it is fixed.

### 2. The flagship format is the one format that cannot be distributed

The numbered "Episodes" are landscape and 2–5 minutes. That is the dead zone:

- Too short and too new-channel to earn Browse or Suggested impressions
- Not vertical, so `isShortsEligible: false` — zero Shorts feed
- Too short to work as real long-form even if it did get shown

Either format works on its own terms. **A 2-minute landscape video works on neither.**

### 3. The series identity is fractured four ways

Across nine uploads there are four different series names and two numbering schemes:

- "Pancreatic Cancer Journey **Ep. 1**" / "**Ep. 2**" — landscape
- "Muslim Cancer Story **Ch. 3**" — vertical
- "Muslim Cancer Journey **Ch. 4**" — vertical
- "Muslim Cancer Journey" — vertical, no number at all
- Three devotional Shorts with no series marker

And the descriptions contradict the titles. `1TGtRIpgwt4`'s description lists:

```
Episode 3 (Feeling Nothing): https://youtu.be/9hR1vXH5PVE   ← titled "Ch. 3"
Episode 4 (The 7-Day Wait):  https://youtu.be/1TGtRIpgwt4   ← titled "Ch. 4"
```

Episodes in the description, Chapters in the titles. A viewer cannot tell what to watch next,
and YouTube cannot cluster the uploads into one body of work.

### 4. There are two videos about the same moment, and the better-produced one is orphaned

`14mGEhEieZY` "The Phone Call That Ended 7 Days of Waiting" (landscape, 2:52, **1 view**) and
`1TGtRIpgwt4` "7 Days Waiting for Cancer Results" (vertical, 1:35, **12 views**) cover the same
beat of the story. The landscape one is **not listed in the series links in any description** —
it is an orphan that splits the story and collects nothing.

### 5. Devotional Shorts underperform the story Shorts by 4x

| Type | Views |
|---|---|
| Story chapters | 12, 8, 5 |
| Devotional / motivational | 3, 1, 0 |

There are hundreds of thousands of faith-motivation Shorts. There is exactly one of **this**
story. The generic ones are not just weaker — they spend upload slots teaching the feed that
this channel is generic.

### 6. Channel keywords are empty

`keywords: []`. It is a weak signal next to per-video metadata, but it is one of the few inputs
YouTube uses to decide which topic cluster a channel belongs to, and an empty field gives it
nothing. Free to fix, cannibalises nothing.

---

## What is NOT wrong — do not spend time here

| Suspicion | Verdict |
|---|---|
| **Tags** | ✗ Not the problem. 14–17 well-chosen, specific tags per video. Genuinely good. |
| **Descriptions** | ✗ Not the problem. Well written, chaptered, series-linked, with a proper disclaimer. Better than most channels at 100x the size. |
| **The writing / the story** | ✗ Not the problem. 17% like rate. This is the asset. |
| **Titles** | ✗ Mostly fine. "7 Days Waiting for Cancer Results" front-loads the hook correctly. The *series suffix* is the inconsistent part, not the hook. |
| **Missing captions** | ~ `hasCaption: false` everywhere. Worth fixing as a production standard — burned-in captions are near-universal in this niche and much of the feed watches muted — but it cannot be called a cause when it does not vary across the winners and losers. |

---

## The decision

**1. Ship Chapter 6 as a vertical Short, this week.** The script and scene pack are written:
[`ch6-scene-pack.txt`](ch6-scene-pack.txt). Breaking 21 days of silence matters more than any
other single action available.

**2. Every story beat ships vertical from now on.** No more 2–5 minute landscape uploads. If a
beat genuinely needs 10 minutes, make it 10 minutes and treat it as real long-form — but not at
3 subscribers, and not before the Shorts have found an audience.

**3. Collapse the series naming to one scheme.** Pick **Chapter** (it already leads the two best
performers) and use it everywhere, in titles and descriptions alike. Renumber so the sequence a
viewer sees is the sequence they can follow.

**4. Stop the devotional Shorts.** Every upload slot goes to a chapter of the story. The
devotional beats belong *inside* chapters, where they are earned by the narrative, not as
standalone posts competing in the most saturated corner of the platform.

**5. Re-cut `14mGEhEieZY` rather than leave it orphaned.** It is the same moment as Chapter 5 and
has 1 view in a format that cannot travel. The footage is already made.

**6. Set channel keywords.** Free.

---

## Ready-to-apply fix pack

**These cannot be applied from this session — verified, not assumed.**

Re-checked 2026-08-04 13:49 UTC after credentials were reported added. A read-only
`reset-packaging.yml` run (`inventory: true`, `dry_run: true`, run `30915672935`) authenticated
with `new1`/`new2`/`new3` and returned:

```
23 owned videos
  JB6Q_7IE9Jo  Is Paper Gold Halal? ...
  4gRoTTZNnFE  How to Tell If Your "Islamic" Mortgage Is Actually Fake
  ... 21 more ...
  V8HYpTHy2aU  How Banks Secretly Profit From Your Savings
```

**All 23 are Finance % Decoded. Not one HELD BY FAITH video appeared.** So those three secrets
still authenticate as the finance channel, and whatever was added for this channel is not
reaching these workflows — most likely it is stored under different secret names, since nothing
outside `new1`/`new2`/`new3` and `YT_API_KEY` is referenced by any workflow in `.github/workflows/`.

Worth knowing for whoever wires this up: a YouTube refresh token is bound to the channel selected
at consent time, so the same Google login still needs a **separate** token per channel. One
account owning both is not enough.

### What was added on 2026-08-04, and what it does not do

An OAuth **client ID** and **client secret** were created and added. A second read-only run at
14:00 UTC (`30916667377`) returned the same 23 Finance % Decoded videos, which confirms two
things: those values went in under *new* secret names, and `new1`/`new2`/`new3` are untouched and
still working. Finance % Decoded automation is intact — relevant because Part 15 publishes
2026-08-05 03:00 PT off those same secrets.

**A client ID and secret identify the application, not the channel. On their own they grant
access to nothing.** The credential that names a channel is the **refresh token**, and it is
bound to whichever channel is chosen at the Google consent screen. That is the missing piece.

Two consequences worth knowing before minting one:

- A refresh token is also bound to the **OAuth client that issued it**. Putting a new client ID
  and secret alongside an old refresh token produces `invalid_grant`, not a wrong-channel write.
- One Google account owning both channels is **not** enough. Each channel needs its own token,
  from its own trip through the consent screen.

### To finish the wiring

1. **Rotate the client secret first.** It was pasted into a chat transcript on 2026-08-04.
   Google Cloud Console → APIs & Services → Credentials → the OAuth client → **Reset secret**.
2. OAuth consent screen → **Test users** → add the Google account that owns HELD BY FAITH.
   Without this the flow refuses before it reaches the picker.
3. On your own machine: `python automation/get_refresh_token.py`, paste the client ID and the
   **rotated** secret. When the browser opens, sign in and — if a channel chooser appears —
   **select HELD BY FAITH**, not Finance % Decoded. That choice is the entire point.
4. Add three GitHub secrets under names that do **not** collide with the finance channel's:

   | Secret | Value |
   |---|---|
   | `HBF_CLIENT_ID` | the client ID |
   | `HBF_CLIENT_SECRET` | the rotated secret |
   | `HBF_REFRESH_TOKEN` | printed by step 3 |

   **Do not reuse `new1`/`new2`/`new3`.** Those drive every upload, monitor and packaging
   workflow for Finance % Decoded. Overwriting them repoints all of it at this channel.

### The code that does not exist yet

An earlier draft of this file claimed `packaging-fix.json` was already in the shape
`reset_packaging.py` consumes, so that wiring it up would be config rather than code. **That was
wrong.** Three gaps, all real:

- `reset_packaging.py` hardcodes `reset.json` at import. It needs a `--config` flag.
- `apply_target()` reads `target["description"]` unconditionally, so it raises `KeyError` on a
  title-only entry. Every change in `packaging-fix.json` is title-only, deliberately — the
  descriptions and tags on this channel are good and must not be rewritten.
- `retitle` and `unlist` are keys this file invented. The script reads `scheduled` and
  `repackage`, and has no unlist path at all.

None of that is built, because it cannot be tested without a token, and untested write code
pointed at a channel carrying someone's cancer diary is not worth the risk of getting it wrong.
It is maybe thirty minutes once `HBF_REFRESH_TOKEN` exists. Until then the fixes above are
copy-paste in Studio, which is also the fastest path for five titles.

**A guard now exists, because the same check exposed a real hazard.** Every write in
`reset_packaging.py` resolves its target with `mine=True`, and `fix_channel_meta()` does a
fetch-then-mutate on `brandingSettings`. Pointing `YT_REFRESH_TOKEN` at this channel and running
without `--dry-run` would have overwritten HELD BY FAITH's keywords and country with the
Islamic-finance list in a single silent call. `reset.json` now declares
`expect_channel_id: UCVOoFJkRiOdJsWnewt8HJkw` and `assert_channel()` aborts any write when the
authenticated channel does not match. Read-only runs warn and continue. **When this channel gets
its own config, give it its own `expect_channel_id` of `UCh0tKIGR5Ns3Wvoai__txdg` before the
first write.**

### Channel keywords (paste into Settings → Channel → Basic info → Keywords)

```
"cancer journey", "muslim cancer story", "pancreatic cancer", "whipple surgery",
"faith through cancer", "tawakkul", "sabr", "trust in Allah", "cancer vlog",
"cancer diagnosis story", "islamic motivation", "held by faith", "cancer support",
"chemotherapy journey", "muslim health journey", "dua for healing", "cancer survivor story"
```

### Title renumbering — one scheme, Chapter, everywhere

| Video | Current title | Change to |
|---|---|---|
| `GFKRpV_mhWg` | I Asked Allah for a Long Life. 4 Days Later, Cancer. \| Pancreatic Cancer Journey Ep. 1 | I Asked Allah for a Long Life. 4 Days Later, Cancer. \| Ch. 1 |
| `xmCDlKXU694` | 10 Hours in Surgery, Awake by Allah's Will \| Pancreatic Cancer Journey Ep. 2 | 10 Hours in Surgery, Awake by Allah's Will \| Ch. 2 |
| `9hR1vXH5PVE` | Why I Felt Nothing When They Said Cancer \| Muslim Cancer Story Ch. 3 | Why I Felt Nothing When They Said Cancer \| Ch. 3 |
| `9CQZ-uS3nuY` | How I Told My Family I Have Cancer \| Muslim Cancer Journey | How I Told My Family I Have Cancer \| Ch. 4 |
| `1TGtRIpgwt4` | 7 Days Waiting for Cancer Results \| Muslim Cancer Journey Ch. 4 | 7 Days Waiting for Cancer Results \| Ch. 5 |

Note the collision this resolves: **two videos are currently both "Ch. 4"** in effect — one
titled Ch. 4 and one unnumbered — and the descriptions call the Ch. 3 video "Episode 3". Fixing
the numbers is worth more than it sounds, because the series links in every description have to
agree with the titles for a viewer to follow the story at all.

With that renumbering, **the new Short in `ch6-scene-pack.txt` becomes Chapter 6.**

### Series block — use this exact block in every description

```
▶ THE STORY IN ORDER:
Ch. 1 — The diagnosis: https://youtu.be/GFKRpV_mhWg
Ch. 2 — The surgery: https://youtu.be/xmCDlKXU694
Ch. 3 — Why I felt nothing: https://youtu.be/9hR1vXH5PVE
Ch. 4 — Telling my family: https://youtu.be/9CQZ-uS3nuY
Ch. 5 — The 7-day wait: https://youtu.be/1TGtRIpgwt4
Ch. 6 — The phone call: [NEW]
▶ Full playlist: https://www.youtube.com/playlist?list=PLczfvNC3NVjo
```

### `14mGEhEieZY` — the orphan

Re-cut vertical and publish as Chapter 6 (that is what the scene pack does). Then **unlist** the
landscape original rather than delete it — it keeps the footage and the upload date, stops the
duplicate splitting the series, and is reversible. Do not delete anything on this channel.

---

## How to read the next three weeks

The honest baseline: this channel has **33 lifetime views**. Any number is going to look like
noise, and percentage swings on single digits mean nothing. Watch these instead:

- **Uploads per week.** The target is one chapter, weekly, as promised in the channel
  description. This is the only metric fully under your control and the only one that matters
  for the next month.
- **Median views per Short across the last five uploads**, not raw counts on any single one.
- **The like rate.** It is currently ~17% on the best performer. If it holds as views grow, the
  content is right and only distribution is missing. If it falls sharply as views rise, the new
  reach is the wrong audience and the packaging needs revisiting.

Do not judge any Short before **72 hours**. Convert to views/day with the age attached, and read
the *marginal* rate between checks rather than the lifetime average — a lesson learned the
expensive way on the other channel in this repo, written up in [`../channel-reset.md`](../channel-reset.md).

**Decision point:** if five consecutive weekly vertical chapters ship and the median is still
under ~25 views each, the bottleneck is discovery rather than format, and the next move is
either one month of private analytics or deliberate seeding into the communities where this
audience already gathers — not another packaging pass.
