#!/usr/bin/env python3
"""Upload a Short, then set its thumbnail and captions in the same run.

  python upload_video.py                    upload + thumbnail + captions
  python upload_video.py --comment VIDEO_ID post the engagement comment

Which config it reads is set by UPLOAD_CONFIG, defaulting to part13.json so the
existing Part 13 workflow keeps working untouched:

  UPLOAD_CONFIG=part14.json python automation/upload_video.py

Thumbnail and caption steps are separate API calls from the upload, and doing
them by hand afterwards is where uploads quietly lose both — so one run does the
whole set, the same way upload_ep2.py does for the long-form.

PUBLISH TIMING is driven by the config:
  · "publish_at": "2026-08-03T10:00:00Z"  -> uploaded private, YouTube publishes
                                            at that instant; editable until then
  · no "publish_at" (or null)             -> published public immediately

Needs the same OAuth env vars as apply_fix.py (see SETUP.md).
Note: if the Google Cloud project is unverified, YouTube may keep API uploads
locked private past publish_at — check Studio if the video doesn't go live.
"""
import json
import os
import sys
from pathlib import Path

from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

from apply_fix import yt_client

ROOT = Path(__file__).parent.parent
CONFIG_NAME = os.environ.get("UPLOAD_CONFIG", "part13.json")
CONFIG = json.loads((Path(__file__).parent / CONFIG_NAME).read_text())


def upload(yt):
    publish_at = CONFIG.get("publish_at")
    status = {"selfDeclaredMadeForKids": False}
    if publish_at:
        status["privacyStatus"] = "private"
        status["publishAt"] = publish_at
    else:
        status["privacyStatus"] = "public"

    body = {
        "snippet": {
            "title": CONFIG["title"],
            "description": CONFIG["description"],
            # part13.json calls it "tags"; the ep2-style configs use "add_tags".
            "tags": CONFIG.get("tags") or CONFIG.get("add_tags", []),
            "categoryId": CONFIG.get("category_id", "27"),
            "defaultLanguage": "en",
            "defaultAudioLanguage": "en",
        },
        "status": status,
    }

    path = ROOT / CONFIG["file"]
    if not path.exists():
        sys.exit(f"Video not found: {path}")

    media = MediaFileUpload(str(path), chunksize=8 * 1024 * 1024, resumable=True,
                            mimetype="video/mp4")
    req = yt.videos().insert(part="snippet,status", body=body, media_body=media)
    resp = None
    while resp is None:
        prog, resp = req.next_chunk()
        if prog:
            print(f"  upload {int(prog.progress() * 100)}%", flush=True)

    vid = resp["id"]
    print(f"VIDEO_ID={vid}")
    if publish_at:
        print(f"Uploaded from {CONFIG_NAME}, publishing at {publish_at}: "
              f"https://youtube.com/shorts/{vid}")
    else:
        print(f"Uploaded from {CONFIG_NAME} and published now: "
              f"https://youtube.com/shorts/{vid}")

    set_thumbnail(yt, vid)
    set_captions(yt, vid)
    return vid


def set_thumbnail(yt, vid):
    rel = CONFIG.get("thumbnail", "")
    if not rel:
        print("No thumbnail in config — YouTube will pick a frame.")
        return
    thumb = ROOT / rel
    if not thumb.exists():
        print(f"! thumbnail missing: {thumb} — set it in Studio")
        return
    try:
        yt.thumbnails().set(videoId=vid, media_body=MediaFileUpload(str(thumb))).execute()
        print(f"Thumbnail set: {rel}")
    except HttpError as e:
        # Custom thumbnails need a verified channel; the upload itself still stands.
        print(f"! thumbnail failed ({e.status_code}) — set it in Studio")


def set_captions(yt, vid):
    rel = CONFIG.get("caption_file", "")
    if not rel:
        return
    srt = ROOT / rel
    if not srt.exists():
        print(f"! caption file missing: {srt}")
        return
    try:
        yt.captions().insert(
            part="snippet",
            body={"snippet": {
                "videoId": vid,
                "language": CONFIG.get("caption_language", "en"),
                "name": "English",
                "isDraft": False,
            }},
            media_body=MediaFileUpload(str(srt), mimetype="application/octet-stream"),
        ).execute()
        print(f"Captions uploaded: {rel}")
    except HttpError as e:
        print(f"! captions failed ({e.status_code}) — upload the SRT in Studio")


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
