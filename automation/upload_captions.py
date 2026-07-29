#!/usr/bin/env python3
"""Upload the long-form's SRT caption track to YouTube.

`captions().insert` needs only the video id and a caption file — not the video
master — so this closes the "no captions" gap that both long-form uploads have
shipped with. An owner-uploaded track outranks the ASR one, is indexed by
search, and drives silent-autoplay retention on browse surfaces.

Idempotent: the track this script created is updated in place rather than
duplicated. It is identified by TRACK_NAME, not just by language, because
`captions.update` returns 403 for any track the calling API client did not
create — including YouTube's own ASR track and anything added through Studio.
Those are left alone; a separate named track is inserted alongside them and
takes precedence for viewers and for search.

Needs YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN (see SETUP.md).

Usage:
    python upload_captions.py [--dry-run]
"""
import argparse
import json
import sys
from pathlib import Path

from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

from apply_fix import yt_client

HERE = Path(__file__).parent
CFG = json.loads((HERE / "longform.json").read_text())
LANGUAGE = "en"
TRACK_NAME = "English (Finance Decoded)"   # our marker — see module docstring


def own_track(yt, video_id):
    """Return the track this script previously created, or None.

    Matched on name as well as language: a track with the right language but a
    different name belongs to Studio or to ASR, and updating it 403s.
    """
    resp = yt.captions().list(part="snippet", videoId=video_id).execute()
    items = resp.get("items", [])
    print(f"  {len(items)} existing track(s) on {video_id}:")
    for item in items:
        snip = item["snippet"]
        print(f"    - {snip.get('language')} / {snip.get('name')!r} "
              f"kind={snip.get('trackKind')} draft={snip.get('isDraft')}")

    for item in items:
        snip = item["snippet"]
        # trackKind comes back lowercase ("asr"), not "ASR" as the docs imply —
        # the case-sensitive check is what made the first run try to overwrite
        # YouTube's own auto-caption track, which 403s.
        if (snip.get("trackKind", "").upper() != "ASR"
                and snip.get("language") == LANGUAGE
                and snip.get("name") == TRACK_NAME):
            return item
    return None


def insert(yt, video_id, srt):
    yt.captions().insert(
        part="snippet",
        body={"snippet": {
            "videoId": video_id,
            "language": LANGUAGE,
            "name": TRACK_NAME,
            "isDraft": False,
        }},
        media_body=MediaFileUpload(str(srt), mimetype="application/octet-stream",
                                   resumable=False),
    ).execute()
    print(f"  captions uploaded to {video_id} ({srt.name})")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="report only, upload nothing")
    args = ap.parse_args()

    video_id = CFG["video_id"]
    srt = (HERE / ".." / CFG["caption_file"]).resolve()
    if not srt.exists():
        sys.exit(f"Caption file missing: {srt}\nRegenerate it with make_captions.py.")

    yt = yt_client()
    track = own_track(yt, video_id)

    if args.dry_run:
        state = f"update our track {track['id']}" if track else "insert a new track"
        print(f"dry-run: would {state} for {video_id} from {srt.name}")
        return

    if not track:
        insert(yt, video_id, srt)
        return

    try:
        yt.captions().update(
            part="snippet",
            body={"id": track["id"], "snippet": {"isDraft": False}},
            media_body=MediaFileUpload(str(srt), mimetype="application/octet-stream",
                                       resumable=False),
        ).execute()
        print(f"  captions updated on {video_id} ({srt.name})")
    except HttpError as err:
        # 403 here means the track is no longer ours to edit (re-created in
        # Studio, or a different API project). Insert a fresh one instead.
        if err.resp.status != 403:
            raise
        print(f"  ! cannot update track {track['id']} (403) — inserting a new one")
        insert(yt, video_id, srt)


if __name__ == "__main__":
    main()
