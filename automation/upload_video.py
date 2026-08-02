#!/usr/bin/env python3
"""Upload a Short with a scheduled publish time, or post its engagement comment.

  python upload_video.py                    uploads the config's file, schedules publish
  python upload_video.py --comment VIDEO_ID posts the engagement comment (after publish)

Which config it reads is set by UPLOAD_CONFIG, defaulting to part13.json so the
existing Part 13 workflow keeps working untouched:

  UPLOAD_CONFIG=part14.json python automation/upload_video.py

Needs the same OAuth env vars as apply_fix.py (see SETUP.md).
Note: if the Google Cloud project is unverified, YouTube may keep API uploads
locked private past publish_at — check Studio if the video doesn't go live.
"""
import json
import os
import sys
from pathlib import Path

from googleapiclient.http import MediaFileUpload

from apply_fix import yt_client

CONFIG_NAME = os.environ.get("UPLOAD_CONFIG", "part13.json")
CONFIG = json.loads((Path(__file__).parent / CONFIG_NAME).read_text())


def upload(yt):
    body = {
        "snippet": {
            "title": CONFIG["title"],
            "description": CONFIG["description"],
            "tags": CONFIG["tags"],
            "categoryId": "27",
            "defaultLanguage": "en",
        },
        "status": {
            "privacyStatus": "private",
            "publishAt": CONFIG["publish_at"],
            "selfDeclaredMadeForKids": False,
        },
    }
    path = Path(__file__).parent.parent / CONFIG["file"]
    media = MediaFileUpload(str(path), chunksize=-1, resumable=True, mimetype="video/mp4")
    req = yt.videos().insert(part="snippet,status", body=body, media_body=media)
    resp = None
    while resp is None:
        _, resp = req.next_chunk()
    print(f"VIDEO_ID={resp['id']}")
    print(f"Uploaded from {CONFIG_NAME}, publishing at {CONFIG['publish_at']}: "
          f"https://youtube.com/shorts/{resp['id']}")


def comment(yt, vid):
    yt.commentThreads().insert(
        part="snippet",
        body={"snippet": {
            "videoId": vid,
            "topLevelComment": {"snippet": {"textOriginal": CONFIG["engagement_comment"]}},
        }},
    ).execute()
    print(f"Comment posted on https://youtube.com/shorts/{vid}")
    print("Reminder: pin it in YouTube Studio (Comments → ⋮ → Pin) — the API cannot pin.")


if __name__ == "__main__":
    yt = yt_client()
    if len(sys.argv) > 2 and sys.argv[1] == "--comment":
        comment(yt, sys.argv[2])
    else:
        upload(yt)
