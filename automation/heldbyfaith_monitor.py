#!/usr/bin/env python3
"""Report the live state of HELD BY FAITH (@HeldByFaithJourney).

    python automation/heldbyfaith_monitor.py

Read-only, public data, stdlib only. Needs just YT_API_KEY — the shared key that
already drives the Finance % Decoded monitor. It deliberately does NOT need
HBF_REFRESH_TOKEN, so channel 2 reporting works before the write path is
authorized.

Two things this fixes about eyeballing the channel by hand:

  - It uses videos.list publishedAt, a full RFC-3339 timestamp. The channel
    listing tools return date-only publish dates that run a day off, which is how
    a four-hour-old upload ends up looking like a dead video. Age is printed in
    hours until 72h, and views/day always carries the age.
  - It never renders a verdict inside 72 hours. On a channel this size a single
    view is noise; the 72-hour rule is not optional here.

Format is the channel's live problem, so the report splits vertical from
landscape: three 16:9 uploads carry 4 views between them against 29 for six
vertical Shorts. See heldbyfaith/channel-diagnosis.md.
"""
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

CFG = json.loads((Path(__file__).resolve().parent.parent
                  / "heldbyfaith" / "packaging-fix.json").read_text())
CHANNEL_ID = CFG["channel_id"]
LANDSCAPE = set(CFG.get("landscape_video_ids", []))
API = "https://www.googleapis.com/youtube/v3"

# YouTube's Shorts cap. Over this an upload is long-form no matter its aspect
# ratio, and CLAUDE.md then requires a custom 16:9 thumbnail.
SHORTS_CAP_SECONDS = 180
DECISION_HOURS = 72

OUT = []


def say(line=""):
    print(line)
    OUT.append(line)


def get(path, **params):
    key = os.environ.get("YT_API_KEY")
    if not key:
        sys.exit("Need YT_API_KEY (shared, public read-only data — SETUP.md step 2).")
    params["key"] = key
    url = f"{API}/{path}?" + urllib.parse.urlencode(params)
    try:
        with urllib.request.urlopen(url, timeout=30) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        try:
            msg = json.loads(e.read().decode() or "{}")["error"]["message"]
        except Exception:
            msg = f"HTTP {e.code}"
        sys.exit(f"YouTube API error on {path}: {msg}")


def iso_seconds(dur: str) -> int:
    m = re.match(r"P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", dur or "")
    if not m:
        return 0
    d, h, mi, s = (int(x) if x else 0 for x in m.groups())
    return ((d * 24 + h) * 60 + mi) * 60 + s


def clock(seconds: int) -> str:
    return f"{seconds // 60}:{seconds % 60:02d}"


def main():
    chans = get("channels", part="snippet,statistics,contentDetails", id=CHANNEL_ID)
    items = chans.get("items", [])
    if not items:
        sys.exit(f"Channel {CHANNEL_ID} not found.")
    ch = items[0]
    stats = ch["statistics"]
    uploads = ch["contentDetails"]["relatedPlaylists"]["uploads"]

    say(f"== HELD BY FAITH ({CFG['handle']}) ==")
    say(f"   {stats.get('subscriberCount', '?')} subscribers · "
        f"{stats.get('videoCount', '?')} videos · "
        f"{stats.get('viewCount', '?')} lifetime views")
    say()

    # Walk the uploads playlist rather than search.list: search is eventually
    # consistent and drops very recent uploads, which is the one case that matters.
    ids, page = [], None
    while True:
        batch = get("playlistItems", part="contentDetails", playlistId=uploads,
                    maxResults=50, **({"pageToken": page} if page else {}))
        ids += [i["contentDetails"]["videoId"] for i in batch.get("items", [])]
        page = batch.get("nextPageToken")
        if not page:
            break

    vids = []
    for i in range(0, len(ids), 50):
        chunk = get("videos", part="snippet,statistics,contentDetails",
                    id=",".join(ids[i:i + 50]))
        vids += chunk.get("items", [])

    now = datetime.now(timezone.utc)
    rows = []
    for v in vids:
        published = datetime.fromisoformat(v["snippet"]["publishedAt"].replace("Z", "+00:00"))
        hours = (now - published).total_seconds() / 3600
        secs = iso_seconds(v["contentDetails"]["duration"])
        views = int(v["statistics"].get("viewCount", 0))
        rows.append({
            "id": v["id"],
            "title": v["snippet"]["title"],
            "hours": hours,
            "secs": secs,
            "views": views,
            "likes": int(v["statistics"].get("likeCount", 0)),
            "per_day": views / max(hours / 24, 1 / 24),
            "landscape": v["id"] in LANDSCAPE,
        })
    rows.sort(key=lambda r: r["hours"])

    say("   age        len   views  likes  views/day  video")
    for r in rows:
        age = f"{r['hours']:.0f}h" if r["hours"] < DECISION_HOURS else f"{r['hours'] / 24:.0f}d"
        flag = " [16:9]" if r["landscape"] else ""
        if r["secs"] > SHORTS_CAP_SECONDS:
            flag += " [long-form]"
        say(f"   {age:<9} {clock(r['secs']):>5} {r['views']:>7} {r['likes']:>6} "
            f"{r['per_day']:>10.1f}  {r['title'][:48]}{flag}")
    say()

    fresh = [r for r in rows if r["hours"] < DECISION_HOURS]
    for r in fresh:
        say(f"   [WAIT] {r['title'][:44]} — {r['hours']:.0f}h old, "
            f"{DECISION_HOURS - r['hours']:.0f}h until it can be judged. "
            f"{r['views']} views so far; too early to mean anything.")
    if fresh:
        say()

    settled = [r for r in rows if r["hours"] >= DECISION_HOURS]
    land = [r for r in settled if r["landscape"]]
    vert = [r for r in settled if not r["landscape"]]
    if land and vert:
        lv = sum(r["views"] for r in land)
        vv = sum(r["views"] for r in vert)
        say(f"   Format split: landscape {len(land)} videos / {lv} views "
            f"({lv / len(land):.1f} each) · vertical {len(vert)} videos / {vv} views "
            f"({vv / len(vert):.1f} each)")
        if vert and land and vv / len(vert) > lv / len(land):
            say(f"   Vertical is still outperforming landscape "
                f"{(vv / len(vert)) / max(lv / len(land), 0.01):.1f}x per video. "
                f"Publish vertical.")
        say()

    long_form = [r for r in rows if r["secs"] > SHORTS_CAP_SECONDS]
    if long_form:
        say(f"   {len(long_form)} upload(s) over {SHORTS_CAP_SECONDS}s publish as long-form, "
            f"so their thumbnails render in 16:9 slots:")
        for r in long_form:
            say(f"     - {r['id']} {clock(r['secs'])} {r['title'][:44]}")
        say("   Each needs a custom 1280x720 thumbnail — see the mandatory section in CLAUDE.md.")
        say()

    best = max(rows, key=lambda r: r["views"]) if rows else None
    if best and best["views"]:
        rate = best["likes"] / best["views"] * 100
        say(f"   Best performer: {best['id']} — {best['views']} views, {best['likes']} likes "
            f"({rate:.0f}% like rate).")
        say("   Protected in packaging-fix.json: nothing repackages it but its series suffix.")

    path = os.environ.get("GITHUB_STEP_SUMMARY")
    if path:
        with open(path, "a") as f:
            f.write("```\n" + "\n".join(OUT) + "\n```\n")


if __name__ == "__main__":
    main()
