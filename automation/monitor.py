#!/usr/bin/env python3
"""Check a tracked video's view count and apply its decision rule.

Usage: monitor.py [config-file]
  config-file defaults to config.json (the current Short, 72h rule). Pass
  longform.json for the long-form episode (7-day rule — long-form ramps via
  search/suggested over days, and is repackaged rather than deleted).

Uses a plain YouTube Data API key (YT_API_KEY env var) — public data only,
no OAuth needed. Stdlib only, so CI needs no pip install.

Verdicts:
  WAIT  — under decision_hours since publish; report pace and time remaining
  PASS  — >= pass_views at decision time; distribution picked it up, leave it alone
  DEAD  — <= dead_views at decision time; Shorts: re-upload with the re-cut hook
          and delete the original. Long-form: repackage (thumbnail/title), never delete
  GRAY  — in between; give it another 48h before deciding
"""
import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

CONFIG_NAME = sys.argv[1] if len(sys.argv) > 1 else "config.json"
CONFIG = json.loads((Path(__file__).parent / CONFIG_NAME).read_text())


def oauth_access_token() -> str:
    body = urllib.parse.urlencode({
        "client_id": os.environ["YT_CLIENT_ID"],
        "client_secret": os.environ["YT_CLIENT_SECRET"],
        "refresh_token": os.environ["YT_REFRESH_TOKEN"],
        "grant_type": "refresh_token",
    }).encode()
    with urllib.request.urlopen("https://oauth2.googleapis.com/token",
                                data=body, timeout=30) as r:
        return json.load(r)["access_token"]


def fetch_views(video_id: str) -> int:
    url = f"https://www.googleapis.com/youtube/v3/videos?part=statistics&id={video_id}"
    headers = {}
    api_key = os.environ.get("YT_API_KEY")
    if api_key:
        url += f"&key={api_key}"
    elif all(os.environ.get(v) for v in
             ("YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN")):
        headers["Authorization"] = f"Bearer {oauth_access_token()}"
    else:
        sys.exit("Need YT_API_KEY, or the YT_CLIENT_ID/YT_CLIENT_SECRET/YT_REFRESH_TOKEN "
                 "trio (see SETUP.md).")
    with urllib.request.urlopen(urllib.request.Request(url, headers=headers),
                                timeout=30) as resp:
        data = json.load(resp)
    items = data.get("items", [])
    if not items:
        sys.exit(f"Video {video_id} not found — was it deleted/re-uploaded? "
                 "Update video_id in config.json.")
    return int(items[0]["statistics"].get("viewCount", 0))


def main():
    vid = CONFIG["video_id"]
    rule = CONFIG["decision_rule"]
    longform = CONFIG.get("mode") == "longform"
    url = CONFIG.get("watch_url") or f"https://youtube.com/shorts/{vid}"
    label = CONFIG.get("label", "Part 12")
    published = datetime.fromisoformat(CONFIG["published_at"].replace("Z", "+00:00"))
    hours = (datetime.now(timezone.utc) - published).total_seconds() / 3600
    views = fetch_views(vid)

    if hours < rule["decision_hours"]:
        verdict = "WAIT"
        if longform:
            detail = (f"{hours:.0f}h since publish ({rule['decision_hours'] - hours:.0f}h until "
                      f"the day-{rule['decision_hours'] // 24} decision). Views: {views}. "
                      "Long-form on a Shorts-built channel ramps through search + suggested "
                      "over days, not hours — near-zero early is normal. Keep the funnel "
                      "Shorts posting daily (see longform-fix.md).")
        else:
            detail = (f"{hours:.0f}h since publish ({rule['decision_hours'] - hours:.0f}h until "
                      f"decision). Views: {views}. Winners on this channel ran ~200-300 views/day "
                      "once the feed picked them up — a near-zero count before pickup is normal.")
    elif views >= rule["pass_views"]:
        verdict = "PASS"
        if longform:
            detail = (f"{views} views at {hours:.0f}h — search/suggested picked it up. Leave the "
                      "packaging alone and keep the funnel Shorts running.")
        else:
            detail = (f"{views} views at {hours:.0f}h — the feed picked it up. "
                      "Leave the video alone.")
    elif views <= rule["dead_views"]:
        verdict = "DEAD"
        if longform:
            detail = (f"{views} views at {hours:.0f}h — impressions never arrived. Do NOT delete: "
                      "long-form accrues search views for years. Repackage instead — swap the "
                      "thumbnail, apply the alternate title from longform-fix.md, and keep the "
                      "daily funnel Shorts going.")
        else:
            detail = (f"{views} views at {hours:.0f}h — the feed test failed. Re-upload with the "
                      "re-cut hook from last-video-fix.md, then delete this upload and update "
                      "video_id/published_at in config.json.")
    else:
        verdict = "GRAY"
        if longform:
            detail = (f"{views} views at {hours:.0f}h — between thresholds "
                      f"({rule['dead_views']}-{rule['pass_views']}). Search-driven growth is a "
                      "slow burn; keep the funnel cadence and re-check in 48h.")
        else:
            detail = (f"{views} views at {hours:.0f}h — between thresholds "
                      f"({rule['dead_views']}-{rule['pass_views']}). The metadata fix may still "
                      "catch; re-check in 48h before re-uploading.")

    line = f"[{verdict}] {url} — {detail}"
    print(line)

    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_path:
        with open(summary_path, "a") as f:
            f.write(f"### {label} monitor\n\n{line}\n")


if __name__ == "__main__":
    main()
