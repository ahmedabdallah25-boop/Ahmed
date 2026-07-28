#!/usr/bin/env python3
"""Post EP01: long-form + thumbnail + Short, scheduled, then the engagement comment.

  python post_ep01.py            uploads both videos (private, scheduled via publish_at)
  python post_ep01.py --comment VIDEO_ID   posts the engagement comment after publish

Needs YT_CLIENT_ID / YT_CLIENT_SECRET / YT_REFRESH_TOKEN (see SETUP.md).
Scheduling uses publishAt — a true Premiere waiting room can only be armed in
Studio; flip the scheduled video to Premiere there if wanted. The API also
cannot pin comments or set a Short's related-video link — both are one-click
in Studio after publish.
"""
import json
import sys
from pathlib import Path

from googleapiclient.http import MediaFileUpload

from apply_fix import yt_client

ROOT = Path(__file__).parent.parent
CONFIG = json.loads((Path(__file__).parent / "ep01.json").read_text())


def upload_one(yt, spec, kind):
    path = ROOT / spec["file"]
    if not path.exists():
        sys.exit(f"missing {path} — the long-form lives only in the render session; "
                 "re-render or restore it before posting")
    body = {
        "snippet": {
            "title": spec["title"],
            "description": spec["description"],
            "tags": spec["tags"],
            "categoryId": "27",
            "defaultLanguage": "en",
        },
        "status": {
            "privacyStatus": "private",
            "publishAt": spec["publish_at"],
            "selfDeclaredMadeForKids": False,
        },
    }
    media = MediaFileUpload(str(path), chunksize=8 * 1024 * 1024, resumable=True,
                            mimetype="video/mp4")
    req = yt.videos().insert(part="snippet,status", body=body, media_body=media)
    resp, last = None, -1
    while resp is None:
        status, resp = req.next_chunk()
        if status:
            pct = int(status.progress() * 100)
            if pct != last:
                print(f"  {kind}: {pct}%", flush=True)
                last = pct
    vid = resp["id"]
    print(f"{kind.upper()}_VIDEO_ID={vid}")
    if spec.get("thumbnail"):
        yt.thumbnails().set(videoId=vid,
                            media_body=str(ROOT / spec["thumbnail"])).execute()
        print(f"  thumbnail set on {vid}")
    print(f"  scheduled for {spec['publish_at']}: https://youtu.be/{vid}")
    return vid


def comment(yt, vid):
    yt.commentThreads().insert(
        part="snippet",
        body={"snippet": {
            "videoId": vid,
            "topLevelComment": {"snippet": {
                "textOriginal": CONFIG["longform"]["engagement_comment"]}},
        }},
    ).execute()
    print(f"Comment posted on https://youtu.be/{vid}")
    print("Pin it in Studio (Comments → ⋮ → Pin) — the API cannot pin.")


if __name__ == "__main__":
    yt = yt_client()
    if len(sys.argv) > 2 and sys.argv[1] == "--comment":
        comment(yt, sys.argv[2])
    else:
        upload_one(yt, CONFIG["longform"], "longform")
        upload_one(yt, CONFIG["short"], "short")
        print("\nManual one-clicks left in Studio: pin the comment after publish, "
              "set the Short's related video, and flip the long-form to Premiere "
              "if you want the waiting room.")
