#!/usr/bin/env python3
"""Upload (or refresh) the corrected English caption track for a video.

YouTube's auto-captions for the long-form episode contain transcription errors
("You were build" for "You were billed", "reeba" for "Riba"). Uploading a clean
track replaces auto-captions in the player, fixes accessibility, and gives
YouTube/Google search the exact text to index — one of the few free ranking
levers for long-form.

Usage: upload_captions.py [config-file]   (defaults to longform.json — the
config must carry a "captions" object: {file, language, name})

Needs the OAuth trio (see SETUP.md) and the pip deps in requirements.txt.
Idempotent: replaces the existing uploaded track of the same language/name.
"""
import json
import sys
from pathlib import Path

from googleapiclient.http import MediaFileUpload

from apply_fix import yt_client

CONFIG_NAME = sys.argv[1] if len(sys.argv) > 1 else "longform.json"
CONFIG = json.loads((Path(__file__).parent / CONFIG_NAME).read_text())


def main():
    cap = CONFIG.get("captions")
    if not cap:
        print(f"No 'captions' entry in {CONFIG_NAME} — nothing to do.")
        return
    srt = (Path(__file__).parent.parent / cap["file"]).resolve()
    if not srt.exists():
        sys.exit(f"Caption file missing: {srt}")

    yt = yt_client()
    vid = CONFIG["video_id"]
    media = MediaFileUpload(str(srt), mimetype="application/octet-stream")

    existing = yt.captions().list(part="snippet", videoId=vid).execute().get("items", [])
    mine = [c for c in existing
            if c["snippet"]["language"] == cap["language"]
            and c["snippet"].get("name", "") == cap.get("name", "")
            and c["snippet"]["trackKind"] != "asr"]  # never touch auto-generated tracks

    if mine:
        yt.captions().update(part="snippet", body={"id": mine[0]["id"]},
                             media_body=media).execute()
        print(f"Replaced caption track ({cap['language']}) on {vid}")
    else:
        yt.captions().insert(part="snippet", body={"snippet": {
            "videoId": vid,
            "language": cap["language"],
            "name": cap.get("name", ""),
            "isDraft": False,
        }}, media_body=media).execute()
        print(f"Uploaded caption track ({cap['language']}) to {vid}")


if __name__ == "__main__":
    main()
