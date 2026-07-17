#!/usr/bin/env python3
"""Check Part 12's view count and apply the 72-hour decision rule.

Uses a plain YouTube Data API key (YT_API_KEY env var) — public data only,
no OAuth needed. Stdlib only, so CI needs no pip install.

Verdicts:
  WAIT  — under 72h since publish; report pace and time remaining
  PASS  — >= pass_views at decision time; the feed picked it up, leave it alone
  DEAD  — <= dead_views at decision time; re-upload with the re-cut hook
          (see last-video-fix.md) and delete the original
  GRAY  — in between; give it another 48h before deciding
"""
import json
import os
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

CONFIG = json.loads((Path(__file__).parent / "config.json").read_text())


def fetch_views(api_key: str, video_id: str) -> int:
    url = ("https://www.googleapis.com/youtube/v3/videos"
           f"?part=statistics&id={video_id}&key={api_key}")
    with urllib.request.urlopen(url, timeout=30) as resp:
        data = json.load(resp)
    items = data.get("items", [])
    if not items:
        sys.exit(f"Video {video_id} not found — was it deleted/re-uploaded? "
                 "Update video_id in config.json.")
    return int(items[0]["statistics"].get("viewCount", 0))


def main():
    api_key = os.environ.get("YT_API_KEY")
    if not api_key:
        sys.exit("Missing env var YT_API_KEY — create a plain API key (SETUP.md step 2).")

    vid = CONFIG["video_id"]
    rule = CONFIG["decision_rule"]
    published = datetime.fromisoformat(CONFIG["published_at"].replace("Z", "+00:00"))
    hours = (datetime.now(timezone.utc) - published).total_seconds() / 3600
    views = fetch_views(api_key, vid)

    if hours < rule["decision_hours"]:
        verdict = "WAIT"
        detail = (f"{hours:.0f}h since publish ({rule['decision_hours'] - hours:.0f}h until "
                  f"decision). Views: {views}. Winners on this channel ran ~200-300 views/day "
                  "once the feed picked them up — a near-zero count before pickup is normal.")
    elif views >= rule["pass_views"]:
        verdict = "PASS"
        detail = (f"{views} views at {hours:.0f}h — the feed picked it up. "
                  "Leave the video alone.")
    elif views <= rule["dead_views"]:
        verdict = "DEAD"
        detail = (f"{views} views at {hours:.0f}h — the feed test failed. Re-upload with the "
                  "re-cut hook from last-video-fix.md, then delete this upload and update "
                  "video_id/published_at in config.json.")
    else:
        verdict = "GRAY"
        detail = (f"{views} views at {hours:.0f}h — between thresholds "
                  f"({rule['dead_views']}-{rule['pass_views']}). The metadata fix may still "
                  "catch; re-check in 48h before re-uploading.")

    line = f"[{verdict}] https://youtube.com/shorts/{vid} — {detail}"
    print(line)

    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_path:
        with open(summary_path, "a") as f:
            f.write(f"### Part 12 monitor\n\n{line}\n")


if __name__ == "__main__":
    main()
