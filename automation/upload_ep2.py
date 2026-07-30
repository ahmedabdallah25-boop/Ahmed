#!/usr/bin/env python3
"""Publish Episode 2 (long-form) with everything the pre-publish checklist wants.

  python upload_ep2.py                    upload + schedule + thumbnail + captions
  python upload_ep2.py --comment VIDEO_ID post the engagement comment (after publish)

One run does the whole set, because each of these is a separate API call and
doing them by hand is where uploads lose captions and thumbnails:

  1. upload the master as private with a publishAt time
  2. set the thumbnail
  3. upload the SRT as an English caption track
  4. add the video to the series playlist (skipped if no playlist_id)

Needs the same OAuth env vars as apply_fix.py (see SETUP.md).
Note: if the Google Cloud project is unverified, YouTube can keep API uploads
private past publish_at — check Studio once the time passes.
"""
import json
import sys
from pathlib import Path

from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

from apply_fix import yt_client

ROOT = Path(__file__).parent.parent
CONFIG = json.loads((Path(__file__).parent / "ep2.json").read_text())


def upload(yt):
    body = {
        "snippet": {
            "title": CONFIG["title"],
            "description": CONFIG["description"],
            "tags": CONFIG["add_tags"],
            "categoryId": CONFIG.get("category_id", "27"),
            "defaultLanguage": "en",
            "defaultAudioLanguage": "en",
        },
        "status": {
            "privacyStatus": "private",
            "publishAt": CONFIG["publish_at"],
            "selfDeclaredMadeForKids": False,
        },
    }
    path = ROOT / CONFIG["file"]
    if not path.exists():
        sys.exit(f"Master not found: {path}")

    media = MediaFileUpload(str(path), chunksize=8 * 1024 * 1024, resumable=True,
                            mimetype="video/mp4")
    req = yt.videos().insert(part="snippet,status", body=body, media_body=media)
    resp = None
    while resp is None:
        status, resp = req.next_chunk()
        if status:
            print(f"  upload {int(status.progress() * 100)}%", flush=True)

    vid = resp["id"]
    print(f"VIDEO_ID={vid}")
    print(f"Scheduled for {CONFIG['publish_at']} — https://youtu.be/{vid}")

    set_thumbnail(yt, vid)
    set_captions(yt, vid)
    add_to_playlist(yt, vid)

    print("\nStill manual (the API cannot do these):")
    print("  · pin the engagement comment after it posts")
    print("  · add end screens on the five winning Shorts pointing here")
    print(f"  · pin a comment on Part 8 linking to https://youtu.be/{vid}")
    return vid


def set_thumbnail(yt, vid):
    thumb = ROOT / CONFIG["thumbnail"]
    if not thumb.exists():
        print(f"! thumbnail missing: {thumb}")
        return
    try:
        yt.thumbnails().set(videoId=vid, media_body=MediaFileUpload(str(thumb))).execute()
        print(f"Thumbnail set: {CONFIG['thumbnail']}")
    except HttpError as e:
        # Custom thumbnails need a verified channel; the upload itself still stands.
        print(f"! thumbnail failed ({e.status_code}) — set it in Studio")


def set_captions(yt, vid):
    srt = ROOT / CONFIG.get("caption_file", "")
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
        print(f"Captions uploaded: {CONFIG['caption_file']}")
    except HttpError as e:
        print(f"! captions failed ({e.status_code}) — upload the SRT in Studio")


def add_to_playlist(yt, vid):
    playlist_id = CONFIG.get("playlist_id", "").strip()
    if not playlist_id:
        print("No playlist_id set — add it to the series playlist by hand.")
        return
    try:
        yt.playlistItems().insert(
            part="snippet",
            body={"snippet": {
                "playlistId": playlist_id,
                "resourceId": {"kind": "youtube#video", "videoId": vid},
            }},
        ).execute()
        print(f"Added to playlist {playlist_id}")
    except HttpError as e:
        print(f"! playlist add failed ({e.status_code})")


def comment(yt, vid):
    yt.commentThreads().insert(
        part="snippet",
        body={"snippet": {
            "videoId": vid,
            "topLevelComment": {"snippet": {"textOriginal": CONFIG["engagement_comment"]}},
        }},
    ).execute()
    print(f"Comment posted on https://youtu.be/{vid}")
    print("Reminder: pin it in Studio (Comments → ⋮ → Pin) — the API cannot pin.")


if __name__ == "__main__":
    yt = yt_client()
    if len(sys.argv) > 2 and sys.argv[1] == "--comment":
        comment(yt, sys.argv[2])
    else:
        upload(yt)
