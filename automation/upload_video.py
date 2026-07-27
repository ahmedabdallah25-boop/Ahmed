#!/usr/bin/env python3
"""Upload a series part with a scheduled publish time, or post its engagement comment.

  python upload_video.py                              uploads media/part13.mp4, schedules publish
  python upload_video.py --config automation/part14.json   uploads that part instead
  python upload_video.py --comment VIDEO_ID           posts the engagement comment (after publish)

Needs the same OAuth env vars as apply_fix.py (see SETUP.md).
Note: if the Google Cloud project is unverified, YouTube may keep API uploads
locked private past publish_at — check Studio if the video doesn't go live.
"""
import json
import sys
from pathlib import Path

from googleapiclient.http import MediaFileUpload

from apply_fix import yt_client

def _config_path(argv):
    """--config PATH selects the part manifest; defaults to part13.json."""
    if "--config" in argv:
        return Path(argv[argv.index("--config") + 1])
    return Path(__file__).parent / "part13.json"


CONFIG = json.loads(_config_path(sys.argv).read_text())


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
    print(f"Uploaded, publishing at {CONFIG['publish_at']}: https://youtube.com/shorts/{resp['id']}")


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
    if "--comment" in sys.argv:
        comment(yt, sys.argv[sys.argv.index("--comment") + 1])
    else:
        upload(yt)
