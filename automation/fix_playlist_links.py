#!/usr/bin/env python3
"""Replace the broken series-playlist URL in every video description on the channel.

Fill in playlist_url in config.json first (copy the real URL from the channel's
Playlists tab). Needs the same OAuth env vars as apply_fix.py.

Idempotent: only updates descriptions that still contain the broken URL.
"""
import json
import sys
from pathlib import Path

from apply_fix import yt_client

CONFIG = json.loads((Path(__file__).parent / "config.json").read_text())


def main():
    good = CONFIG["playlist_url"].strip()
    bad = CONFIG["bad_playlist_url"].strip()
    if not good:
        sys.exit("playlist_url in config.json is empty — paste the real playlist URL first "
                 "(channel → Playlists tab → share link).")
    if good == bad:
        sys.exit("playlist_url equals bad_playlist_url — that can't be right.")

    yt = yt_client()
    changed = 0
    for vid in CONFIG["series_video_ids"]:
        items = yt.videos().list(part="snippet", id=vid).execute().get("items", [])
        if not items:
            print(f"  skip {vid}: not found")
            continue
        snippet = items[0]["snippet"]
        desc = snippet.get("description", "")
        if bad not in desc:
            continue
        snippet["description"] = desc.replace(bad, good)
        yt.videos().update(part="snippet", body={"id": vid, "snippet": snippet}).execute()
        print(f"  fixed {vid}")
        changed += 1
    print(f"Done — {changed} description(s) updated.")
    print("Reminder: the channel About description has the same link — that one is a "
          "channel-level setting, fix it once in YouTube Studio → Customization.")


if __name__ == "__main__":
    main()
