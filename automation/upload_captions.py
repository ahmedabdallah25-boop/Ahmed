#!/usr/bin/env python3
"""Upload the long-form's SRT caption track to YouTube.

`captions().insert` needs only the video id and a caption file — not the video
master — so this closes the "no captions" gap that both long-form uploads have
shipped with. An owner-uploaded track outranks the ASR one, is indexed by
search, and drives silent-autoplay retention on browse surfaces.

Idempotent: an existing owner-uploaded track for the same language is updated in
place rather than duplicated. YouTube's own ASR track (trackKind "ASR") is left
alone — it cannot be modified and is superseded automatically.

Needs YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN (see SETUP.md).

Usage:
    python upload_captions.py [--dry-run]
"""
import argparse
import json
import sys
from pathlib import Path

from googleapiclient.http import MediaFileUpload

from apply_fix import yt_client

HERE = Path(__file__).parent
CFG = json.loads((HERE / "longform.json").read_text())
LANGUAGE = "en"
TRACK_NAME = "English"


def existing_track(yt, video_id):
    """Return the owner-uploaded track for LANGUAGE, or None. ASR is ignored."""
    resp = yt.captions().list(part="snippet", videoId=video_id).execute()
    for item in resp.get("items", []):
        snip = item["snippet"]
        if snip.get("trackKind") == "ASR":
            continue
        if snip.get("language") == LANGUAGE:
            return item
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="report only, upload nothing")
    args = ap.parse_args()

    video_id = CFG["video_id"]
    srt = (HERE / ".." / CFG["caption_file"]).resolve()
    if not srt.exists():
        sys.exit(f"Caption file missing: {srt}\nRegenerate it with make_captions.py.")

    yt = yt_client()
    track = existing_track(yt, video_id)

    if args.dry_run:
        state = f"update track {track['id']}" if track else "insert a new track"
        print(f"dry-run: would {state} for {video_id} from {srt.name}")
        return

    media = MediaFileUpload(str(srt), mimetype="application/octet-stream", resumable=False)

    if track:
        yt.captions().update(
            part="snippet",
            body={"id": track["id"], "snippet": {"isDraft": False}},
            media_body=media,
        ).execute()
        print(f"  captions updated on {video_id} ({srt.name})")
    else:
        yt.captions().insert(
            part="snippet",
            body={"snippet": {
                "videoId": video_id,
                "language": LANGUAGE,
                "name": TRACK_NAME,
                "isDraft": False,
            }},
            media_body=media,
        ).execute()
        print(f"  captions uploaded to {video_id} ({srt.name})")


if __name__ == "__main__":
    main()
