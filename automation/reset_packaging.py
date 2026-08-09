#!/usr/bin/env python3
"""Apply the 2026-08-03 packaging reset.

  python reset_packaging.py --dry-run   show every change without writing
  python reset_packaging.py --scheduled only the unpublished Short
  python reset_packaging.py             everything in reset.json

Two jobs, in priority order:

  1. The scheduled Shorts still sitting private are the only videos on this
     channel whose packaging can still be fixed BEFORE the feed decides on them.
     That is where nearly all the value is. Run --inventory to find them; a new
     upload can appear between passes and no public listing tool will show it.
  2. Published Shorts that failed get their titles moved back onto the formula
     that produced every 700+ view video. Expect little from this — measured on
     2026-08-03, P3DxNgGFah0 took exactly zero extra views in the six hours after
     its retitle. It is done because it costs nothing, not because it works.

Refuses to touch any id in reset.json's `protected` list.

Needs the same OAuth env vars as apply_fix.py (see SETUP.md).
"""
import argparse
import difflib
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

from googleapiclient.errors import HttpError

from apply_fix import yt_client

# Any per-video failure lands here. main() exits non-zero if it is non-empty, so
# a partial run shows red in Actions instead of the green "success" that a caught
# HttpError used to produce.
ERRORS = []

HERE = Path(__file__).parent
CFG = json.loads((HERE / "reset.json").read_text())
PROTECTED = set(CFG["protected"]["video_ids"])
HELD = set(CFG.get("hold", {}).get("video_ids", []))
PLAYLIST_URL = CFG.get("playlist_url", "").strip()


def build_description(raw: str) -> str:
    """Substitute the series-playlist line, matching apply_fix.py's convention."""
    line = f"▶ Full series in order: {PLAYLIST_URL}\n" if PLAYLIST_URL else ""
    return raw.replace("{PLAYLIST_LINE}", line)


# YouTube caps the whole tags field at 500 characters and rejects the entire
# update with `invalidTags` if you exceed it — which is exactly what happened on
# P3DxNgGFah0 (20 existing tags + 5 new = over the cap). Budget conservatively:
# a tag containing a space is sent quoted, so it costs two extra characters.
TAG_BUDGET = 450


def tag_cost(tag: str) -> int:
    return len(tag) + (2 if " " in tag else 0) + 1  # +1 for the separator


def fit_tags(existing, additions):
    """Existing tags first (already indexed), then as many additions as fit."""
    kept, used = [], 0
    for tag in list(existing) + [t for t in additions if t not in existing]:
        cost = tag_cost(tag)
        if used + cost > TAG_BUDGET:
            continue
        kept.append(tag)
        used += cost
    return kept


def apply_target(yt, target, dry_run):
    """Push title/description/tags onto one video. Idempotent."""
    vid = target["video_id"]
    if vid in PROTECTED:
        print(f"  REFUSED {vid}: protected winner — not repackaging.")
        return False
    if vid in HELD:
        print(f"  HELD {vid}: published in the last ~36h and still inside its feed test.")
        return False

    try:
        items = yt.videos().list(part="snippet,status", id=vid).execute().get("items", [])
    except HttpError as e:
        print(f"  ERROR {vid}: {e}")
        ERRORS.append(f"{vid}: fetch failed: {e}")
        return False

    if not items:
        print(f"  SKIP {vid}: not found (deleted, or OAuth account is not the owner).")
        ERRORS.append(f"{vid}: not found")
        return False

    snippet = items[0]["snippet"]
    privacy = items[0].get("status", {}).get("privacyStatus", "?")
    old_title = snippet.get("title", "")

    new_title = target["title"]
    new_description = build_description(target["description"])
    old_tags = snippet.get("tags", [])
    new_tags = fit_tags(old_tags, target.get("add_tags", []))
    dropped = len(old_tags) + len([t for t in target.get("add_tags", []) if t not in old_tags]) - len(new_tags)

    unchanged = (
        old_title == new_title
        and snippet.get("description") == new_description
        and set(old_tags) == set(new_tags)
    )
    if unchanged:
        print(f"  = {vid} ({privacy}) already up to date.")
        return False

    print(f"  {vid} ({privacy})")
    print(f"      was: {old_title}")
    print(f"      now: {new_title}")
    print(f"      tags: {len(new_tags)} kept"
          + (f", {dropped} dropped to stay under YouTube's 500-char cap" if dropped > 0 else ""))

    if dry_run:
        print("      [dry-run] not written")
        return False

    # Mutate the fetched snippet so categoryId / defaultLanguage survive the update.
    snippet["title"] = new_title
    snippet["description"] = new_description
    snippet["tags"] = new_tags
    try:
        yt.videos().update(part="snippet", body={"id": vid, "snippet": snippet}).execute()
    except HttpError as e:
        print(f"      ERROR writing: {e}")
        ERRORS.append(f"{vid}: write failed: {e}")
        return False
    print("      written")
    return True


def inventory(yt):
    """List every owned video, flagging the ones no config line covers.

    Step 3 of the channel pass — "find anything not yet feed-tested" — used to be
    inferred from the owned-video count moving, which only says that *something*
    appeared, not what. A private or scheduled upload is the highest-leverage
    object on the channel (its packaging can still be fixed before the feed tests
    it), so it needs naming, not counting. Read-only.
    """
    managed = {t["video_id"] for t in CFG["scheduled"]}
    managed |= {t["video_id"] for t in CFG["repackage"]}
    managed |= {t["video_id"] for t in CFG.get("_published_scheduled_archive", [])}
    managed |= PROTECTED | HELD

    now = datetime.now(timezone.utc)
    ids = owned_video_ids(yt)
    rows, unmanaged, unreviewed, shorts = [], [], [], []
    for start in range(0, len(ids), 50):
        batch = ids[start:start + 50]
        items = yt.videos().list(
            part="snippet,status,contentDetails,statistics",
            id=",".join(batch)).execute().get("items", [])
        for item in items:
            status = item.get("status", {})
            privacy = status.get("privacyStatus", "?")
            # publishAt is only set on a private video with a scheduled release.
            when = status.get("publishAt") or item["snippet"].get("publishedAt", "")
            secs = iso8601_seconds(item["contentDetails"].get("duration", ""))
            stats = item.get("statistics", {})
            views = int(stats.get("viewCount", 0) or 0)
            likes = int(stats.get("likeCount", 0) or 0)
            rows.append((when, privacy, item["id"], item["snippet"].get("title", "")))
            if secs <= 180:
                shorts.append((when, item["id"]))
                if privacy == "public":
                    LENGTHS.append((secs, views, when, item["id"]))
                    ENGAGEMENT.append((secs, views, likes, when, item["id"],
                                       item["snippet"].get("title", "")))
            if privacy != "public" and item["id"] not in managed:
                unmanaged.append((when, privacy, item["id"], item["snippet"].get("title", "")))
            elif privacy == "public" and item["id"] not in managed and when:
                # Published without ever passing through this config. The pre-publish
                # review is the ONLY packaging lever measured to have a non-zero
                # return on this channel, and on 2026-08-05..07 four Shorts reached
                # the feed without it — a gap no previous pass could see, because
                # this check used to look at non-public videos only and a Studio
                # upload is public the moment it exists.
                if (now - parse_ts(when)).total_seconds() / 86400 <= UNREVIEWED_WINDOW_DAYS:
                    unreviewed.append((when, item["id"], item["snippet"].get("title", "")))

    print(f"  {len(rows)} owned videos\n")
    for when, privacy, vid, title in sorted(rows, reverse=True):
        mark = " " if vid in managed else "!"
        print(f"  {mark} {when:<26} {privacy:<8} {vid}  {title[:64]}")

    if unmanaged:
        print(f"\n  {len(unmanaged)} NOT-YET-FEED-TESTED and absent from reset.json:")
        for when, privacy, vid, title in sorted(unmanaged, reverse=True):
            print(f"    {vid} ({privacy}, {when}) {title}")
        print("  Package these before they publish — that is the whole window.")
    else:
        print("\n  Every non-public video is covered by reset.json.")

    if unreviewed:
        print(f"\n  ! {len(unreviewed)} PUBLISHED IN THE LAST {UNREVIEWED_WINDOW_DAYS} DAYS "
              f"WITHOUT PRE-PUBLISH REVIEW:")
        for when, vid, title in sorted(unreviewed, reverse=True):
            print(f"    {vid} ({when}) {title[:60]}")
        print("  These reached the feed with no packaging pass. Their tests cannot be")
        print("  re-run — record them in reset.json so the next upload is caught earlier.")

    cadence(shorts)
    length_vs_views()
    engagement()
    allocation()
    return unmanaged


# Filled by inventory(); (seconds, views, published_at, video_id) per public Short.
LENGTHS = []

# Filled by inventory(); (seconds, views, likes, published_at, video_id, title).
ENGAGEMENT = []


def engagement():
    """Like rate per view, bucketed by length — the public proxy for feed conversion.

    Views measure what YouTube gave you. Likes measure what the audience did with
    it, and that is what decides whether the next video gets a bigger test. On
    2026-08-09 this channel's owner analytics showed the two are almost unrelated
    here: `kOkfpCHeURw` took 257 views and returned 0 likes and 0 subscribers,
    while `V8HYpTHy2aU` took 112 views and returned 11 likes and 3 subscribers.
    Sorting by views alone had called the first a success for six days.
    """
    if not ENGAGEMENT:
        return
    now = datetime.now(timezone.utc)
    rated = [(s, v, l, w, i, t) for s, v, l, w, i, t in ENGAGEMENT
             if v >= 20 and (now - parse_ts(w)).total_seconds() / 86400 >= 3]
    if not rated:
        return

    print("\n== Like rate by length (public, past 72h, >=20 views) ==")
    buckets = {f"<{MIN_SHORT_SECONDS}s": [], f">={MIN_SHORT_SECONDS}s": []}
    for secs, views, likes, _, _, _ in rated:
        buckets[f"<{MIN_SHORT_SECONDS}s" if secs < MIN_SHORT_SECONDS
                else f">={MIN_SHORT_SECONDS}s"].append((views, likes))
    for name, vals in buckets.items():
        if not vals:
            continue
        v = sum(x[0] for x in vals)
        l = sum(x[1] for x in vals)
        print(f"  {name:<8} n={len(vals):<3} {v:5d} views  {l:4d} likes  "
              f"{100 * l / v:5.2f}% like rate")

    cold = [r for r in rated if r[1] and r[2] / r[1] < MIN_LIKE_RATE]
    if cold:
        print(f"\n  ! {len(cold)} public Short(s) under a {100 * MIN_LIKE_RATE:.0f}% like rate — "
              f"these are what the feed reads as a failed test:")
        for secs, views, likes, when, vid, title in sorted(cold, key=lambda r: -r[1]):
            print(f"    {vid}  {secs:>4}s  {views:5d} views  {likes:3d} likes  "
                  f"{100 * likes / views:5.2f}%  {title[:44]}")


def allocation(days=None):
    """What share of the feed's recent distribution went to videos below the length floor.

    The seventh pass (2026-08-09) found the mechanism behind the August collapse, and it is
    not per-video: of the 484 views the channel's own August uploads received, **three
    sub-35-second clips took 317 of them (65.5%) and returned 13.5% of the watch time**. The
    feed sizes the next test from what the last one gave back, so those clips did not merely
    fail their own tests — they set the allocation every later upload was judged inside. The
    two 120s+ uploads that followed hold 90.0 and 84.9 seconds per view, the best on the
    channel, and were tested on 20 and 41 views.

    That is a channel-level failure and no per-video check can see it. This one can, from
    public data: if most of a fortnight's views landed on sub-floor uploads, the next test
    is already shrinking whatever ships next.

    Honest limit: views are public, watch time is not. The share below is of *views*, which
    understates the damage — the sub-floor band takes a far larger share of views than of
    the watch time that actually drives the next allocation. Pull
    `estimatedMinutesWatched` by video from vidiq for the real split.
    """
    if not ENGAGEMENT:
        return
    days = ALLOCATION_WINDOW_DAYS if days is None else days
    now = datetime.now(timezone.utc)
    recent = [(s, v) for s, v, _, w, _, _ in ENGAGEMENT
              if (now - parse_ts(w)).total_seconds() / 86400 <= days]
    total = sum(v for _, v in recent)
    if not recent or not total:
        return

    below = [(s, v) for s, v in recent if s < MIN_SHORT_SECONDS]
    below_views = sum(v for _, v in below)
    share = below_views / total

    # Three bands, matching the seventh-pass table in channel-reset.md §3. The
    # sub-35s band is called out separately because it is the one that has never
    # returned a like or a subscriber on this channel.
    bands = [("<35s", lambda s: s < 35),
             (f"35-{MIN_SHORT_SECONDS}s", lambda s: 35 <= s < MIN_SHORT_SECONDS),
             (f">={MIN_SHORT_SECONDS}s", lambda s: s >= MIN_SHORT_SECONDS)]
    print(f"\n== Distribution share, last {days} days ({len(recent)} public Short(s)) ==")
    for name, pred in bands:
        rows = [(s, v) for s, v in recent if pred(s)]
        views = sum(v for _, v in rows)
        print(f"  {name:<9} n={len(rows):<3} {views:5d} views  "
              f"{100 * views / total:5.1f}% of recent distribution")

    if share > ALLOCATION_ALERT:
        print(f"\n  ! {100 * share:.0f}% of the last {days} days of distribution went to "
              f"uploads under the {MIN_SHORT_SECONDS}s floor.")
        print("  This is the August failure repeating: sub-floor clips absorb the feed's")
        print("  test budget, return almost no watch time, and shrink the test the next")
        print("  upload gets. Ship nothing under the floor until this is back under "
              f"{100 * ALLOCATION_ALERT:.0f}%.")


def length_vs_views():
    """Does Short length predict performance here? Normalise to views/day, since a
    3-day-old Short and a 30-day-old one are not comparable on raw counts."""
    if not LENGTHS:
        return
    now = datetime.now(timezone.utc)
    rated = []
    for secs, views, when, vid in LENGTHS:
        age = max((now - parse_ts(when)).total_seconds() / 86400, 0.5)
        if age < 3:                      # still inside its feed test — not judgeable
            continue
        rated.append((secs, views / age, views, age, vid))
    if not rated:
        return

    print("\n== Short length vs views/day (public, past 72h) ==")
    buckets = {"<=30s": [], "31-60s": [], "61-90s": [], ">90s": []}
    for secs, vpd, views, age, vid in rated:
        key = ("<=30s" if secs <= 30 else "31-60s" if secs <= 60
               else "61-90s" if secs <= 90 else ">90s")
        buckets[key].append(vpd)
    for name, vals in buckets.items():
        if vals:
            vals = sorted(vals)
            median = vals[len(vals) // 2]
            print(f"  {name:<8} n={len(vals):<3} median {median:7.1f} v/day"
                  f"   range {min(vals):.0f}-{max(vals):.0f}")
    print("  ---")
    for secs, vpd, views, age, vid in sorted(rated, key=lambda r: -r[1])[:5]:
        print(f"  BEST  {secs:>4}s  {vpd:7.1f} v/day  ({views} views / {age:.1f}d)  {vid}")
    for secs, vpd, views, age, vid in sorted(rated, key=lambda r: r[1])[:3]:
        print(f"  WORST {secs:>4}s  {vpd:7.1f} v/day  ({views} views / {age:.1f}d)  {vid}")


def iso8601_seconds(dur: str) -> int:
    """PT1M40S -> 100. Anything unparseable counts as long-form."""
    m = re.fullmatch(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", dur or "")
    if not m:
        return 10 ** 6
    h, mi, s = (int(g or 0) for g in m.groups())
    return h * 3600 + mi * 60 + s


# The Shorts feed rewards an unbroken daily cadence and withdraws distribution when
# a channel goes dark. Measured on this channel 2026-08-03: every 700+ view Short
# sits inside a run of sub-1.5-day gaps, the first Short after a 9.7-day blackout
# did 39 views, and the recovery upload two days later did 227. Two Shorts inside
# the same 12 hours split one audience test — the second of the 2026-08-02 pair
# took 43 against the first's 227.
MAX_GAP_DAYS = 1.5
MIN_GAP_HOURS = 12
MIN_QUEUE_DAYS = 3

# How far back inventory() looks for uploads that never passed through reset.json.
UNREVIEWED_WINDOW_DAYS = 7

# Like rate is the one feed-conversion signal that is public, exact, and needs no
# paid plan. Measured on this channel 2026-08-09 against owner analytics: every
# video over 120 s returns ~5% likes and ~2.2% subscribers per view, while the
# three sub-30 s clips took 315 views between them and returned ZERO likes and
# ZERO subscribers. The 44 s `UpCMyfIOftA` is the bridge case — it was handed a
# 1,209-view feed test, returned 0.91% likes and 2 subscribers, and the channel's
# Shorts-feed distribution fell 17x the following day and has not recovered.
MIN_LIKE_RATE = 0.02
MIN_SHORT_SECONDS = 120

# allocation() window, and the share of recent views landing on sub-floor uploads
# that trips the alert. August 2026 ran at 65.5% and the two good uploads either
# side of it were tested on 20 and 41 views; half is already well into the failure.
ALLOCATION_WINDOW_DAYS = 14
ALLOCATION_ALERT = 0.50


def cadence(shorts):
    """Report Shorts upload rhythm — blackouts behind, and a drying queue ahead."""
    if not shorts:
        return
    seq = sorted(shorts)
    now = datetime.now(timezone.utc)
    print("\n== Shorts cadence ==")

    problems = []
    for (t0, a), (t1, b) in zip(seq, seq[1:]):
        gap = (parse_ts(t1) - parse_ts(t0)).total_seconds()
        if gap / 86400 > MAX_GAP_DAYS:
            problems.append(f"BLACKOUT {gap / 86400:.1f}d before {b} ({t1[:10]})")
        elif gap / 3600 < MIN_GAP_HOURS:
            problems.append(f"DOUBLE {gap / 3600:.1f}h between {a} and {b} ({t1[:10]})")

    for p in problems[-6:]:
        print(f"  {p}")

    published = [t for t, _ in seq if parse_ts(t) <= now]
    queued = [t for t, _ in seq if parse_ts(t) > now]
    if published:
        since = (now - parse_ts(published[-1])).total_seconds() / 86400
        print(f"  last published {since:.1f}d ago")
    if queued:
        runway = (parse_ts(queued[-1]) - now).total_seconds() / 86400
        print(f"  {len(queued)} queued, runway {runway:.1f}d")
        if runway < MIN_QUEUE_DAYS:
            print(f"  ! QUEUE DRIES UP in {runway:.1f}d — the next blackout starts there.")
    else:
        print("  ! NOTHING QUEUED — the channel is dark from now on.")
    return problems


def parse_ts(t: str):
    return datetime.fromisoformat(t.replace("Z", "+00:00"))


def assert_channel(yt, read_only):
    """Refuse to write to a channel this config was not written for.

    Every write here resolves its target with `mine=True` — the authenticated
    channel, never an id from the config. fix_channel_meta() in particular does a
    fetch-then-mutate on brandingSettings, so pointing YT_REFRESH_TOKEN at a
    different channel and running this would overwrite THAT channel's keywords
    and country with reset.json's, silently and in one call.

    That is not hypothetical: this repo now runs two channels. HELD BY FAITH
    (UCh0tKIGR5Ns3Wvoai__txdg) has its own packaging config in heldbyfaith/, and
    the day it gets its own refresh token is the day a swapped secret can point
    this script at it.

    Read-only paths (--inventory, --dry-run) warn and continue, because
    discovering which channel a token actually owns is a legitimate diagnostic —
    it is how the 2026-08-04 pass established that new1/new2/new3 still
    authenticate as Finance % Decoded. Writes abort.
    """
    expect = CFG.get("expect_channel_id")
    items = yt.channels().list(part="snippet", mine=True).execute().get("items", [])
    if not items:
        sys.exit("Authenticated, but the token owns no channel. Check YT_REFRESH_TOKEN.")
    got = items[0]["id"]
    title = items[0]["snippet"].get("title", "?")
    print(f"  authenticated as: {title} ({got})")
    if not expect:
        print("  ! reset.json has no expect_channel_id — no guard active.")
        return
    if got == expect:
        return
    msg = (f"CHANNEL MISMATCH: reset.json is written for {expect}, but the token "
           f"authenticates as {title} ({got}).")
    if read_only:
        print(f"  ! {msg}\n  ! Read-only run, continuing. Nothing will be written.")
        return
    sys.exit(f"\n{msg}\nRefusing to write. Every target in reset.json belongs to "
             f"{expect}, and the channel-level branding write would land on the "
             f"wrong channel. Fix YT_REFRESH_TOKEN, or use the config that matches "
             f"this channel.")


def fix_channel_meta(yt, dry_run):
    """Set channel-level keywords, country and description. Fetch-then-mutate so
    other branding survives.

    The description is the channel's most durable indexed surface — unlike a
    Short, it does not go dark after 72 hours, and search was 8.8% of Aug 1-9
    traffic (45 views) against a Shorts feed that had already collapsed. It is
    also the one live-channel text surface where a rewrite is not measured at
    zero, because it was never subject to a feed test in the first place.
    """
    cfg = CFG.get("channel")
    if not cfg:
        return 0
    want = " ".join(f'"{k}"' if " " in k else k for k in cfg.get("keywords", []))
    want_desc = cfg.get("description")

    items = yt.channels().list(part="brandingSettings", mine=True).execute().get("items", [])
    if not items:
        ERRORS.append("channel: not found")
        return 0
    branding = items[0]["brandingSettings"]
    have = branding.get("channel", {}).get("keywords", "")
    have_country = branding.get("channel", {}).get("country", "")
    have_desc = branding.get("channel", {}).get("description", "")
    want_country = cfg.get("country", have_country)

    changes = []
    if want and have != want:
        changes.append(f"keywords: {len(have)} chars -> {len(want)} chars")
    if want_country != have_country:
        changes.append(f"country: {have_country or '(unset)'} -> {want_country}")
    if want_desc and want_desc != have_desc:
        # 1000 chars is the hard API limit; over it the whole update is rejected.
        if len(want_desc) > 1000:
            ERRORS.append(f"channel description: {len(want_desc)} chars exceeds the "
                          f"1000-char limit — the whole branding update would fail")
            return 0
        changes.append(f"description: {len(have_desc)} chars -> {len(want_desc)} chars")
        for line in difflib.unified_diff(have_desc.splitlines(), want_desc.splitlines(),
                                         "live", "reset.json", lineterm="", n=1):
            print(f"      {line}")
    if not changes:
        print("  = channel metadata already up to date.")
        return 0

    for c in changes:
        print(f"  channel {c}")
    if dry_run:
        print("      [dry-run] not written")
        return 0
    if want:
        branding.setdefault("channel", {})["keywords"] = want
    branding.setdefault("channel", {})["country"] = want_country
    if want_desc:
        branding.setdefault("channel", {})["description"] = want_desc
    try:
        yt.channels().update(part="brandingSettings",
                             body={"id": items[0]["id"], "brandingSettings": branding}).execute()
    except HttpError as e:
        print(f"      ERROR writing: {e}")
        ERRORS.append(f"channel keywords: {e}")
        return 0
    print("      written")
    return 1


def owned_video_ids(yt):
    """Every video id on the authenticated channel, via the uploads playlist."""
    chans = yt.channels().list(part="contentDetails", mine=True).execute().get("items", [])
    if not chans:
        return []
    uploads = chans[0]["contentDetails"]["relatedPlaylists"]["uploads"]
    ids, page = [], None
    while True:
        resp = yt.playlistItems().list(
            part="contentDetails", playlistId=uploads, maxResults=50, pageToken=page
        ).execute()
        ids += [i["contentDetails"]["videoId"] for i in resp.get("items", [])]
        page = resp.get("nextPageToken")
        if not page:
            return ids


def fix_links(yt, dry_run):
    """Replace stale video ids wherever they appear in this channel's descriptions."""
    replacements = CFG.get("link_fixes", {}).get("replacements", [])
    if not replacements:
        return 0

    ids = owned_video_ids(yt)
    print(f"  scanning {len(ids)} owned videos")
    written = 0

    for start in range(0, len(ids), 50):
        batch = ids[start:start + 50]
        items = yt.videos().list(part="snippet", id=",".join(batch)).execute().get("items", [])
        for item in items:
            vid, snippet = item["id"], item["snippet"]
            desc = snippet.get("description", "")
            new_desc = desc
            hits = []
            for rep in replacements:
                if rep["from"] in new_desc:
                    hits.append(f"{rep['from']} -> {rep['to']}")
                    new_desc = new_desc.replace(rep["from"], rep["to"])
            if not hits:
                continue

            print(f"  {vid}: {', '.join(hits)}")
            if dry_run:
                print("      [dry-run] not written")
                continue
            snippet["description"] = new_desc
            try:
                yt.videos().update(part="snippet",
                                   body={"id": vid, "snippet": snippet}).execute()
            except HttpError as e:
                print(f"      ERROR writing: {e}")
                ERRORS.append(f"{vid}: link fix failed: {e}")
                continue
            print("      written")
            written += 1

    if not written and not dry_run:
        print("  no stale links found — nothing to do.")
    return written


def playlist_items(yt, playlist_id):
    """Every video id currently in a playlist, in playlist order."""
    ids, page = [], None
    while True:
        resp = yt.playlistItems().list(
            part="contentDetails", playlistId=playlist_id, maxResults=50, pageToken=page
        ).execute()
        ids += [i["contentDetails"]["videoId"] for i in resp.get("items", [])]
        page = resp.get("nextPageToken")
        if not page:
            return ids


def sync_playlists(yt, dry_run):
    """Add every owned video that belongs in a playlist and is not in it yet.

    Purely additive — nothing is removed and nothing is reordered, so this is
    safe to run against a video inside its feed test. Playlist membership is not
    packaging: it does not change the title, description or tags the feed is
    testing, it only adds a Browse and Suggested surface that did not exist.

    That surface is the point. A Short gets its Shorts-feed shot in the first
    72 hours and then goes almost completely dark — Shorts earn very little
    ongoing search or suggested traffic to recover into, which is why retitling
    a failed one is measured at exactly zero. A series playlist is one of the
    few paths that keeps working afterwards, and a Short that was never added
    to one has no such path at all.
    """
    specs = CFG.get("playlists", [])
    if not specs:
        return 0

    ids = owned_video_ids(yt)
    meta = {}
    for start in range(0, len(ids), 50):
        batch = ids[start:start + 50]
        for item in yt.videos().list(
            part="snippet,contentDetails,status", id=",".join(batch)
        ).execute().get("items", []):
            meta[item["id"]] = item
    print(f"  scanning {len(meta)} owned videos")

    written = 0
    for spec in specs:
        pid = spec["playlist_id"]
        lo = spec.get("min_seconds", 0)
        hi = spec.get("max_seconds", 10 ** 9)
        skip = set(spec.get("exclude", []))

        # Private and scheduled uploads are deliberately excluded: adding one
        # publishes nothing but does leak an unlisted entry into a public
        # playlist, and it would land out of order once it goes live.
        want = [
            v for v in meta.values()
            if lo <= iso8601_seconds(v["contentDetails"]["duration"]) <= hi
            and v["id"] not in skip
            and v.get("status", {}).get("privacyStatus") == "public"
        ]
        want.sort(key=lambda v: v["snippet"]["publishedAt"])

        try:
            have = set(playlist_items(yt, pid))
        except HttpError as e:
            print(f"  {pid}: ERROR reading playlist: {e}")
            ERRORS.append(f"{pid}: playlist read failed: {e}")
            continue

        missing = [v for v in want if v["id"] not in have]
        print(f"  {pid} — {spec.get('_name', '')}")
        print(f"      {len(have)} in playlist, {len(want)} eligible, "
              f"{len(missing)} missing")
        if not missing:
            print("      already complete")
            continue

        for v in missing:
            print(f"      + {v['id']}  {v['snippet']['title'][:58]}")
            if dry_run:
                continue
            try:
                yt.playlistItems().insert(part="snippet", body={"snippet": {
                    "playlistId": pid,
                    "resourceId": {"kind": "youtube#video", "videoId": v["id"]},
                }}).execute()
            except HttpError as e:
                print(f"          ERROR adding: {e}")
                ERRORS.append(f"{pid}/{v['id']}: playlist add failed: {e}")
                continue
            written += 1
        if dry_run:
            print("      [dry-run] not written")
    return written


def delete_videos(yt, dry_run):
    """Delete confirmed duplicate uploads. Irreversible — five guards before any call.

    This never runs on an ordinary pass. It needs --confirm-delete, which no
    scheduled or routine invocation passes, because a delete cannot be undone and
    does not return the video id: a mistake here is permanent and unrecoverable.

    The guards, in order:
      1. --confirm-delete was passed explicitly.
      2. The id is not in `protected`.
      3. The id resolves to a video this channel actually owns.
      4. Its LIVE title still matches the title recorded in reset.json. A stale or
         mistyped id would otherwise delete an unrelated video, and the id alone
         gives no signal that it is wrong.
      5. Its `duplicate_of` survivor exists, is public, and is a different id — so
         a duplicate is never removed unless its replacement is confirmed live.

    Any guard failing skips that video and records an error, so a partial run shows
    red rather than a green success that quietly deleted nothing.
    """
    entries = CFG.get("duplicates", {}).get("candidates", [])
    if not entries:
        return 0

    owned = set(owned_video_ids(yt))
    deleted = 0

    for ent in entries:
        vid = ent["video_id"]
        keeper = ent.get("duplicate_of", "")
        want_title = ent.get("title", "")
        print(f"  {vid} — recorded duplicate of {keeper}")

        if vid in PROTECTED:
            print("      REFUSED: protected winner.")
            ERRORS.append(f"{vid}: delete refused, id is protected")
            continue
        if vid not in owned:
            print("      skip: not an owned video (already deleted?).")
            continue
        if not keeper or keeper == vid:
            print("      REFUSED: no distinct survivor recorded.")
            ERRORS.append(f"{vid}: delete refused, no distinct duplicate_of")
            continue

        items = yt.videos().list(part="snippet,status",
                                 id=f"{vid},{keeper}").execute().get("items", [])
        found = {i["id"]: i for i in items}

        live = found.get(vid)
        if not live:
            print("      REFUSED: could not read the video.")
            ERRORS.append(f"{vid}: delete refused, video unreadable")
            continue
        live_title = live["snippet"]["title"]
        if want_title and live_title.strip() != want_title.strip():
            print(f"      REFUSED: title mismatch.\n"
                  f"        config: {want_title}\n"
                  f"        live:   {live_title}")
            ERRORS.append(f"{vid}: delete refused, title mismatch")
            continue

        surv = found.get(keeper)
        if not surv:
            print(f"      REFUSED: survivor {keeper} not found.")
            ERRORS.append(f"{vid}: delete refused, survivor {keeper} missing")
            continue
        if surv.get("status", {}).get("privacyStatus") != "public":
            print(f"      REFUSED: survivor {keeper} is not public.")
            ERRORS.append(f"{vid}: delete refused, survivor not public")
            continue

        print(f"      guards passed — survivor is live: {surv['snippet']['title'][:58]}")
        print(f"      DELETING: {live_title}")
        if dry_run:
            print("      [dry-run] not deleted")
            continue
        try:
            yt.videos().delete(id=vid).execute()
        except HttpError as e:
            print(f"      ERROR deleting: {e}")
            ERRORS.append(f"{vid}: delete failed: {e}")
            continue
        print("      deleted")
        deleted += 1

    return deleted


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="show changes without writing")
    ap.add_argument("--scheduled", action="store_true",
                    help="only fix the unpublished Short")
    ap.add_argument("--inventory", action="store_true",
                    help="list every owned video and flag unmanaged private/scheduled ones")
    ap.add_argument("--confirm-delete", action="store_true",
                    help="IRREVERSIBLE: delete the confirmed duplicates in reset.json. "
                         "Never set by a routine pass; requires a deliberate human choice.")
    args = ap.parse_args()

    yt = yt_client()

    print("\n== Channel guard ==")
    assert_channel(yt, read_only=args.inventory or args.dry_run)

    if args.inventory:
        print("\n== Owned video inventory ==")
        inventory(yt)
        return 0

    written = 0

    print("\n== Scheduled Shorts (fix before they publish) ==")
    for target in CFG["scheduled"]:
        written += apply_target(yt, target, args.dry_run)

    if not args.scheduled:
        print("\n== Published Shorts that underperformed ==")
        for target in CFG["repackage"]:
            written += apply_target(yt, target, args.dry_run)

        held = CFG.get("hold", {}).get("video_ids", [])
        if held:
            print(f"\n== Held (too new to judge) ==\n  {', '.join(held)}")

        print("\n== Stale link hygiene ==")
        written += fix_links(yt, args.dry_run)

        print("\n== Playlists ==")
        written += sync_playlists(yt, args.dry_run)

        print("\n== Channel metadata ==")
        written += fix_channel_meta(yt, args.dry_run)

        # Last, and only when asked for by name. Link fixes above run first so any
        # description pointing at a duplicate is repointed at the survivor BEFORE
        # the id stops resolving — deleting first is how Part 12 left a dead link
        # sitting in live descriptions.
        if args.confirm_delete:
            print("\n== Duplicate removal (IRREVERSIBLE) ==")
            written += delete_videos(yt, args.dry_run)
        elif CFG.get("duplicates", {}).get("candidates"):
            n = len(CFG["duplicates"]["candidates"])
            print(f"\n== Duplicate removal ==\n  {n} candidate(s) recorded; "
                  f"--confirm-delete not passed, so nothing was deleted.")

    print(f"\n{written} video(s) updated.")
    if args.dry_run:
        print("Dry run — nothing was written.")

    if ERRORS:
        print(f"\n{len(ERRORS)} failure(s) — this run is NOT complete:")
        for err in ERRORS:
            print(f"  - {err}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
