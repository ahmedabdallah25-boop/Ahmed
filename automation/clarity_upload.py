#!/usr/bin/env python3
"""Publish a long-form video to Clarity in the Quran.

One run does the whole set, because each of these is a separate API call and
doing them by hand is where uploads lose their captions or their thumbnail:

  1. upload the master as private with a publishAt time
  2. set the 1280x720 thumbnail
  3. upload the SRT as an English caption track
  4. add the video to its playlist, creating the playlist if it does not exist

Reads clarity/parents-upload.json (or --config). Uses the CIQ_* secret trio, and
refuses to write unless the authenticated channel is the config's
expect_channel_id: an OAuth client identifies the APPLICATION, not a channel, so
what binds a token to a channel is the choice made at Google's consent screen.
A token minted against the wrong channel must fail loudly rather than quietly
publish a Quran study video to a finance channel.

Prints whether a secret is set, never its value — this repo is public and
Actions logs are world-readable.
"""
import argparse
import json
import os
import sys
from pathlib import Path

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

ROOT = Path(__file__).resolve().parent.parent
SECRETS = ("CIQ_CLIENT_ID", "CIQ_CLIENT_SECRET", "CIQ_REFRESH_TOKEN")
SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl",
          "https://www.googleapis.com/auth/youtube.upload"]


def client():
    missing = [k for k in SECRETS if not os.environ.get(k)]
    if missing:
        sys.exit(f"Missing: {', '.join(missing)}. Run \"CLARITY IN THE QURAN - check setup\" "
                 "for the exact next step.")
    creds = Credentials(
        token=None,
        refresh_token=os.environ["CIQ_REFRESH_TOKEN"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=os.environ["CIQ_CLIENT_ID"],
        client_secret=os.environ["CIQ_CLIENT_SECRET"],
        scopes=SCOPES,
    )
    return build("youtube", "v3", credentials=creds)


def guard(yt, expect):
    mine = yt.channels().list(part="id,snippet", mine=True).execute().get("items", [])
    if not mine:
        sys.exit("The token authenticates no channel. Re-mint it via automation/authorize.html.")
    got, name = mine[0]["id"], mine[0]["snippet"]["title"]
    if got != expect:
        sys.exit(f"REFUSING TO WRITE. Token owns {name} ({got}), config expects {expect}.\n"
                 "The consent screen was answered with the wrong channel. Re-mint it.")
    print(f"authenticated as {name} ({got})")


def upload(yt, cfg):
    path = ROOT / cfg["file"]
    if not path.exists():
        sys.exit(f"Master not found: {path}. Render it first: cd video && npm run render:parents")
    body = {
        "snippet": {
            "title": cfg["title"],
            "description": cfg["description"],
            "tags": cfg["tags"],
            "categoryId": cfg.get("category_id", "27"),
            "defaultLanguage": "en",
            "defaultAudioLanguage": "en",
        },
        "status": {
            "privacyStatus": cfg.get("privacy", "private"),
            "selfDeclaredMadeForKids": False,
        },
    }
    if cfg.get("publish_at"):
        body["status"]["publishAt"] = cfg["publish_at"]
    media = MediaFileUpload(str(path), chunksize=16 * 1024 * 1024, resumable=True,
                            mimetype="video/mp4")
    req = yt.videos().insert(part="snippet,status", body=body, media_body=media)
    resp, last = None, -10
    while resp is None:
        status, resp = req.next_chunk()
        if status and int(status.progress() * 100) >= last + 10:
            last = int(status.progress() * 100)
            print(f"  upload {last}%", flush=True)
    print(f"uploaded https://youtu.be/{resp['id']}")
    return resp["id"]


def thumbnail(yt, cfg, vid):
    rel = cfg.get("thumbnail")
    if not rel:
        return
    path = ROOT / rel
    if not path.exists():
        print(f"  thumbnail missing at {path} — SKIPPED")
        return
    if path.stat().st_size > 2 * 1024 * 1024:
        print(f"  thumbnail is {path.stat().st_size / 1e6:.1f}MB, over YouTube's 2MB — SKIPPED")
        return
    yt.thumbnails().set(videoId=vid, media_body=MediaFileUpload(str(path))).execute()
    print("  thumbnail set")


def captions(yt, cfg, vid):
    rel = cfg.get("captions")
    if not rel:
        return
    path = ROOT / rel
    if not path.exists():
        print(f"  captions missing at {path} — SKIPPED")
        return
    yt.captions().insert(
        part="snippet",
        body={"snippet": {"videoId": vid, "language": "en", "name": "English", "isDraft": False}},
        media_body=MediaFileUpload(str(path), mimetype="application/octet-stream"),
    ).execute()
    print("  captions uploaded")


def playlist(yt, cfg, vid):
    name = cfg.get("playlist")
    if not name:
        return
    found = None
    req = yt.playlists().list(part="id,snippet", mine=True, maxResults=50)
    while req and not found:
        page = req.execute()
        for p in page.get("items", []):
            if p["snippet"]["title"].strip().lower() == name.strip().lower():
                found = p["id"]
                break
        req = yt.playlists().list_next(req, page)
    if not found:
        found = yt.playlists().insert(
            part="snippet,status",
            body={"snippet": {"title": name}, "status": {"privacyStatus": "public"}},
        ).execute()["id"]
        print(f"  created playlist {name}")
    yt.playlistItems().insert(
        part="snippet",
        body={"snippet": {"playlistId": found,
                          "resourceId": {"kind": "youtube#video", "videoId": vid}}},
    ).execute()
    print(f"  added to {name}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", default="clarity/parents-upload.json")
    ap.add_argument("--dry-run", action="store_true",
                    help="check the token, the channel and every input file, upload nothing")
    args = ap.parse_args()

    cfg = json.loads((ROOT / args.config).read_text())
    yt = client()
    guard(yt, cfg["expect_channel_id"])

    if args.dry_run:
        for key in ("file", "captions", "thumbnail"):
            rel = cfg.get(key)
            if not rel:
                continue
            path = ROOT / rel
            size = f"{path.stat().st_size / 1e6:.1f}MB" if path.exists() else "MISSING"
            print(f"  {key:10} {rel}  {size}")
        print(f"  title      {cfg['title']}")
        print(f"  publish_at {cfg.get('publish_at', '(immediate)')}")
        print("dry run — nothing was written")
        return

    vid = upload(yt, cfg)
    for step in (thumbnail, captions, playlist):
        try:
            step(yt, cfg, vid)
        except HttpError as e:
            # A failure here must not read as a failed upload: the video is up.
            print(f"  {step.__name__} FAILED: {e}")
    print(f"\ndone — https://studio.youtube.com/video/{vid}/edit")


if __name__ == "__main__":
    main()
