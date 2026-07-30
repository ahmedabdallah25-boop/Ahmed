#!/usr/bin/env python3
"""Upload the three Episode 2 Shorts, each scheduled and each linking down.

  python upload_ep2_shorts.py           upload every cut not yet uploaded
  python upload_ep2_shorts.py 2         upload only cut 2 (1-indexed)

Reads funnel_shorts[] from ep2.json. Each entry carries its own file, title,
description (which contains the long-form link the on-screen end card points at)
and publish_at. Uploads are private with a publishAt time, exactly like the
episode.

The video_id of each upload is written back into ep2.json so re-running does not
double-post, and so the ids are available for the pin-comment step.

Needs the same OAuth env vars as apply_fix.py (see SETUP.md).
"""
import json
import sys
from pathlib import Path

from googleapiclient.http import MediaFileUpload

from apply_fix import yt_client

ROOT = Path(__file__).parent.parent
CONFIG_PATH = Path(__file__).parent / "ep2.json"


def load():
    return json.loads(CONFIG_PATH.read_text())


def save(cfg):
    CONFIG_PATH.write_text(json.dumps(cfg, indent=2, ensure_ascii=False) + "\n")


def upload_one(yt, cfg, i):
    shot = cfg["funnel_shorts"][i]
    if shot.get("video_id"):
        print(f"= cut {i + 1} already uploaded: https://youtu.be/{shot['video_id']}")
        return

    path = ROOT / shot["file"]
    if not path.exists():
        print(f"! cut {i + 1} missing: {path}")
        return

    body = {
        "snippet": {
            "title": shot["title"],
            "description": shot["description"],
            "tags": cfg["add_tags"],
            "categoryId": cfg.get("category_id", "27"),
            "defaultLanguage": "en",
            "defaultAudioLanguage": "en",
        },
        "status": {
            "privacyStatus": "private",
            "publishAt": shot["publish_at"],
            "selfDeclaredMadeForKids": False,
        },
    }
    media = MediaFileUpload(str(path), chunksize=-1, resumable=True, mimetype="video/mp4")
    req = yt.videos().insert(part="snippet,status", body=body, media_body=media)
    resp = None
    while resp is None:
        _, resp = req.next_chunk()

    vid = resp["id"]
    shot["video_id"] = vid
    save(cfg)
    print(f"+ cut {i + 1} → https://youtube.com/shorts/{vid}")
    print(f"  scheduled {shot['publish_at']}")
    print(f"  pin after publish: {shot['pin_comment']}")


if __name__ == "__main__":
    yt = yt_client()
    cfg = load()
    total = len(cfg["funnel_shorts"])

    if len(sys.argv) > 1:
        n = int(sys.argv[1])
        if not 1 <= n <= total:
            sys.exit(f"cut must be 1..{total}")
        upload_one(yt, cfg, n - 1)
    else:
        for i in range(total):
            upload_one(yt, cfg, i)

    print("\nEach cut ends on 'link in the description' — that link is already in "
          "each description above. Pin the same line as a comment once each goes "
          "live; the API cannot pin.")
