#!/usr/bin/env python3
"""Post the engagement comment on the video (skips if already posted).

Usage: post_comment.py [config-file]   (defaults to config.json; pass
longform.json to comment on the long-form episode)

Needs the same OAuth env vars as apply_fix.py.

Note: the YouTube Data API has no endpoint for pinning a comment — after this
posts, pinning is one click in YouTube Studio (Comments → ⋮ → Pin).
"""
import json
import sys
from pathlib import Path

from apply_fix import yt_client

CONFIG_NAME = sys.argv[1] if len(sys.argv) > 1 else "config.json"
CONFIG = json.loads((Path(__file__).parent / CONFIG_NAME).read_text())


def main():
    yt = yt_client()
    vid = CONFIG["video_id"]
    text = CONFIG["engagement_comment"]

    existing = yt.commentThreads().list(
        part="snippet", videoId=vid, maxResults=100, textFormat="plainText"
    ).execute().get("items", [])
    for item in existing:
        posted = item["snippet"]["topLevelComment"]["snippet"]["textOriginal"]
        if posted.strip() == text.strip():
            print("Comment already posted — nothing to do.")
            return

    yt.commentThreads().insert(
        part="snippet",
        body={"snippet": {
            "videoId": vid,
            "topLevelComment": {"snippet": {"textOriginal": text}},
        }},
    ).execute()
    print(f"Comment posted on {CONFIG.get('watch_url') or f'https://youtube.com/shorts/{vid}'}")
    print("Reminder: pin it in YouTube Studio (Comments → ⋮ → Pin) — the API cannot pin.")


if __name__ == "__main__":
    sys.exit(main())
