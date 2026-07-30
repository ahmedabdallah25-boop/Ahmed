#!/usr/bin/env python3
"""Give Part 14 every push available before and after it publishes.

  python promote_part14.py            do everything
  python promote_part14.py --dry-run  print what would change, touch nothing

Three levers, in descending order of expected effect:

1. FUNNEL — the six videos on this channel that already earn traffic (919-1,223 views
   each, ~6,300 lifetime views between them) get a link to Part 14 as the first line of
   their description. This is the only lever here that reaches an audience that already
   exists; the Shorts feed decides the rest.
2. PLAYLIST — Part 14 joins the series playlist, so it inherits the binge path.
3. THUMBNAIL — a custom 9:16 thumbnail for the channel grid and search.

Every step is independent and idempotent: a failure in one is reported and the rest
still run, and re-running changes nothing that is already correct.

Needs the same OAuth env vars as apply_fix.py (see SETUP.md).
"""
import json
import sys
from pathlib import Path

from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

from apply_fix import yt_client

ROOT = Path(__file__).parent.parent
CONFIG = json.loads((Path(__file__).parent / "part14.json").read_text())

VIDEO_ID = "P3DxNgGFah0"
PLAYLIST_ID = "PLKLKzR1QgFHE"  # "The Money Machine, Decoded (Full Series)"
THUMB = ROOT / "media" / "part14-thumb.jpg"

SHORT_URL = f"https://youtube.com/shorts/{VIDEO_ID}"
FUNNEL_LINE = f"▶ NEW — Your bank only has 3 cents of every dollar you own: {SHORT_URL}"

# The six videos that actually carry traffic, by lifetime views at time of writing.
FUNNEL_TARGETS = [
    ("riQ7dLSnogo", 1223, "Halal Mortgage (Musharaka)"),
    ("UpCMyfIOftA", 1206, "Why You're Born Into Debt"),
    ("a7xkXgTfCXs", 1000, "Why Everything Costs More"),
    ("J0TCD2u177k", 1000, "Passive Income Without Interest"),
    ("OXIP3EJROQk", 961, "Banks Quietly Trap Your Savings"),
    ("zY664YZPI6U", 919, "Protect Savings From Inflation"),
]

dry = "--dry-run" in sys.argv


def step(label, fn):
    """Run one lever. Report and continue on failure — the others are still worth doing."""
    try:
        fn()
    except HttpError as e:
        print(f"  !! {label} FAILED: {e.status_code} {e.reason}")
    except Exception as e:  # noqa: BLE001 - report and keep going
        print(f"  !! {label} FAILED: {e}")


def set_thumbnail(yt):
    print("THUMBNAIL")
    if not THUMB.exists():
        print(f"  !! {THUMB} missing")
        return
    if dry:
        print(f"  would set {THUMB.name} ({THUMB.stat().st_size:,} bytes) on {VIDEO_ID}")
        return
    yt.thumbnails().set(videoId=VIDEO_ID, media_body=MediaFileUpload(str(THUMB))).execute()
    print(f"  set {THUMB.name} on {VIDEO_ID}")


def add_to_playlist(yt):
    print("PLAYLIST")
    existing = set()
    req = yt.playlistItems().list(part="contentDetails", playlistId=PLAYLIST_ID, maxResults=50)
    while req is not None:
        resp = req.execute()
        existing.update(i["contentDetails"]["videoId"] for i in resp.get("items", []))
        req = yt.playlistItems().list_next(req, resp)

    if VIDEO_ID in existing:
        print(f"  {VIDEO_ID} already in {PLAYLIST_ID} ({len(existing)} items) — nothing to do")
        return
    if dry:
        print(f"  would append {VIDEO_ID} to {PLAYLIST_ID} ({len(existing)} items)")
        return
    yt.playlistItems().insert(
        part="snippet",
        body={"snippet": {
            "playlistId": PLAYLIST_ID,
            "resourceId": {"kind": "youtube#video", "videoId": VIDEO_ID},
        }},
    ).execute()
    print(f"  appended {VIDEO_ID} to {PLAYLIST_ID} (was {len(existing)} items)")


def funnel(yt):
    print("FUNNEL")
    changed = skipped = 0
    for vid, views, name in FUNNEL_TARGETS:
        items = yt.videos().list(part="snippet", id=vid).execute().get("items", [])
        if not items:
            print(f"  !! {vid} ({name}) not found")
            continue
        snippet = items[0]["snippet"]
        desc = snippet.get("description", "")

        if VIDEO_ID in desc:
            print(f"  = {vid} {views:>5} views  {name} — already linked")
            skipped += 1
            continue

        # First line, above the existing long-form funnel: the newest episode is the one
        # with somewhere to send people next.
        snippet["description"] = f"{FUNNEL_LINE}\n\n{desc}".strip()
        if dry:
            print(f"  + {vid} {views:>5} views  {name} — would prepend")
        else:
            yt.videos().update(part="snippet", body={"id": vid, "snippet": snippet}).execute()
            print(f"  + {vid} {views:>5} views  {name} — linked")
        changed += 1

    reach = sum(v for _, v, _ in FUNNEL_TARGETS)
    print(f"  {changed} updated, {skipped} already done — {reach:,} lifetime views now point at Part 14")


def main():
    yt = yt_client()
    print(f"Part 14 = {VIDEO_ID} ({SHORT_URL})")
    print(f"publish_at = {CONFIG['publish_at']}{'  [DRY RUN]' if dry else ''}\n")
    step("thumbnail", lambda: set_thumbnail(yt))
    print()
    step("playlist", lambda: add_to_playlist(yt))
    print()
    step("funnel", lambda: funnel(yt))


if __name__ == "__main__":
    main()
