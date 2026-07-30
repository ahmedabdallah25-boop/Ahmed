#!/usr/bin/env python3
"""Apply Episode 2's 7-day decision rule, and act on it rather than report it.

  python monitor_ep2.py           check and act
  python monitor_ep2.py --dry     check and print, change nothing

Verdicts, from ep2.json's decision_rule:
  WAIT       — before day 7; print pace and what the funnel is doing
  PASS       — >= 150 views; the funnel works, ship Episode 3
  REPACKAGE  — 40-149; the funnel works, the packaging doesn't. Swaps the
               thumbnail and title to the alternates in ep2.json and records
               that it did, so it only ever fires once
  PAUSE      — < 40; the Shorts audience is not crossing over yet, so packaging
               is not the problem and the swap is withheld

Also prints each funnel Short's views, because the diagnosis differs completely
depending on whether the Shorts are pulling: Shorts flat means the top of the
funnel is empty; Shorts healthy and the episode flat means the handoff is broken.

Needs the same OAuth env vars as apply_fix.py (see SETUP.md).
"""
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

from googleapiclient.http import MediaFileUpload

from apply_fix import yt_client

ROOT = Path(__file__).parent.parent
CONFIG_PATH = Path(__file__).parent / "ep2.json"
DRY = "--dry" in sys.argv


def views_for(yt, ids):
    if not ids:
        return {}
    items = yt.videos().list(part="statistics,snippet", id=",".join(ids)).execute()
    return {i["id"]: i for i in items.get("items", [])}


def repackage(yt, cfg, vid):
    plan = cfg.get("repackage", {})
    if not plan:
        print("! no repackage block in ep2.json — nothing to swap")
        return
    if cfg.get("repackaged_at"):
        print(f"= already repackaged on {cfg['repackaged_at']} — leaving it alone")
        return
    if DRY:
        print(f"~ would retitle to: {plan['title']}")
        print(f"~ would set thumbnail: {plan['thumbnail']}")
        return

    item = yt.videos().list(part="snippet", id=vid).execute()["items"][0]
    snippet = item["snippet"]
    snippet["title"] = plan["title"]
    yt.videos().update(part="snippet", body={"id": vid, "snippet": snippet}).execute()
    print(f"+ retitled: {plan['title']}")

    thumb = ROOT / plan["thumbnail"]
    if thumb.exists():
        yt.thumbnails().set(videoId=vid, media_body=MediaFileUpload(str(thumb))).execute()
        print(f"+ thumbnail swapped to {plan['thumbnail']}")
    else:
        print(f"! thumbnail missing: {thumb}")

    cfg["repackaged_at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
    CONFIG_PATH.write_text(json.dumps(cfg, indent=2, ensure_ascii=False) + "\n")


def main():
    cfg = json.loads(CONFIG_PATH.read_text())
    vid = cfg["video_id"]
    rule = cfg["decision_rule"]
    published = datetime.fromisoformat(cfg["publish_at"].replace("Z", "+00:00"))
    now = datetime.now(timezone.utc)
    days = (now - published).total_seconds() / 86400

    yt = yt_client()
    shorts = [s["video_id"] for s in cfg.get("funnel_shorts", []) if s.get("video_id")]
    data = views_for(yt, [vid] + shorts)

    if vid not in data:
        sys.exit(f"Episode {vid} not visible to the API yet — still private or processing.")

    ep_views = int(data[vid]["statistics"].get("viewCount", 0))

    print(f"Episode 2 — {ep_views} views, {days:.1f} days since publish")
    print(f"  {data[vid]['snippet']['title']}")
    for s in cfg.get("funnel_shorts", []):
        sid = s.get("video_id")
        if sid and sid in data:
            print(f"  Short {sid}: {int(data[sid]['statistics'].get('viewCount', 0))} views")

    if days < 0:
        print("\nWAIT — not published yet.")
        return
    if days < rule["window_days"]:
        pace = ep_views / max(days, 0.25)
        print(f"\nWAIT — day {days:.1f} of {rule['window_days']}, {pace:.0f} views/day. "
              f"Needs {rule['ship_next_at_views']} by day {rule['window_days']}.")
        return

    if ep_views >= rule["ship_next_at_views"]:
        print(f"\nPASS — {ep_views} views. The funnel works; ship Episode 3.")
    elif ep_views >= rule["pause_longform_below"]:
        print(f"\nREPACKAGE — {ep_views} views. The funnel moved people but the "
              f"packaging did not convert. Swapping thumbnail and title.")
        repackage(yt, cfg, vid)
    else:
        print(f"\nPAUSE — {ep_views} views, below {rule['pause_longform_below']}. "
              f"The Shorts audience is not crossing over yet; repackaging a video "
              f"nobody reached would not tell you anything. Hold long-form until "
              f"the channel is nearer 1K subs.")


if __name__ == "__main__":
    main()
