#!/usr/bin/env python3
"""Apply the Deen & Dinar rebrand to the channel via the YouTube Data API.

What it automates (from automation/rebrand.json):
  - channel title, description, keywords, country, default language
  - banner upload (--banner path/to/banner.png)
  - channel trailer (--trailer VIDEO_ID, once the trailer is uploaded)

What the API cannot do (finish in YouTube Studio, ~2 min):
  - handle (@DeenAndDinar) and profile picture (use media/branding/avatar.png)

Auth: same env vars as the other scripts (YT_CLIENT_ID, YT_CLIENT_SECRET,
YT_REFRESH_TOKEN) — but the refresh token MUST be minted while selecting the
Deen @ Heart channel on the Google consent screen (re-run get_refresh_token.py
and pick it). A safety check refuses to touch any other channel.

Idempotent: running twice changes nothing the second time (banner upload excepted).
"""
import argparse
import json
import os
import sys
from pathlib import Path

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

ROOT = Path(__file__).resolve().parent.parent
CFG = json.loads((Path(__file__).parent / "rebrand.json").read_text())
SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"]


def yt_client():
    missing = [v for v in ("YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN")
               if not os.environ.get(v)]
    if missing:
        sys.exit(f"Missing env vars: {', '.join(missing)} — see rebrand-kit.md §Automation.")
    creds = Credentials(
        token=None,
        refresh_token=os.environ["YT_REFRESH_TOKEN"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=os.environ["YT_CLIENT_ID"],
        client_secret=os.environ["YT_CLIENT_SECRET"],
        scopes=SCOPES,
    )
    return build("youtube", "v3", credentials=creds)


def keywords_string():
    out = " ".join(f'"{k}"' if " " in k else k for k in CFG["keywords"])
    if len(out) > 500:
        sys.exit("keywords exceed YouTube's 500-character limit — trim rebrand.json")
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--banner", help="path to banner png to upload (2048x1152 minimum)")
    ap.add_argument("--trailer", default=CFG.get("trailer_video_id", ""),
                    help="video ID to set as the channel trailer for non-subscribers")
    args = ap.parse_args()

    yt = yt_client()
    resp = yt.channels().list(part="id,snippet,brandingSettings", mine=True).execute()
    items = resp.get("items", [])
    if not items:
        sys.exit("No channel found for these credentials.")
    ch = items[0]

    if ch["id"] != CFG["channel_id"]:
        sys.exit(
            f"SAFETY STOP: authenticated channel is '{ch['snippet']['title']}' ({ch['id']}), "
            f"expected {CFG['channel_id']} (Deen @ Heart). Re-run get_refresh_token.py and "
            "select the Deen @ Heart channel on the consent screen. Nothing was changed."
        )

    branding = ch.get("brandingSettings", {})
    channel = dict(branding.get("channel", {}))
    target = {
        "title": CFG["title"],
        "description": CFG["description"],
        "keywords": keywords_string(),
        "country": CFG["country"],
        "defaultLanguage": CFG.get("default_language", "en"),
    }
    if args.trailer:
        target["unsubscribedTrailer"] = args.trailer

    changes = {k: v for k, v in target.items() if channel.get(k) != v}
    channel.update(target)
    body = {"id": ch["id"], "brandingSettings": {"channel": channel}}

    # keep the existing banner unless we are uploading a new one
    image = dict(branding.get("image", {}))
    if args.banner:
        path = (ROOT / args.banner) if not Path(args.banner).is_absolute() else Path(args.banner)
        if not path.exists():
            sys.exit(f"Banner not found: {path} — run generate_branding.py first.")
        uploaded = yt.channelBanners().insert(
            media_body=MediaFileUpload(str(path), mimetype="image/png")).execute()
        image["bannerExternalUrl"] = uploaded["url"]
        changes["banner"] = path.name
    if image.get("bannerExternalUrl"):
        body["brandingSettings"]["image"] = {"bannerExternalUrl": image["bannerExternalUrl"]}

    if not changes:
        print("Already up to date — nothing to do.")
        return

    yt.channels().update(part="brandingSettings", body=body).execute()
    print(f"Rebranded https://www.youtube.com/channel/{ch['id']}")
    for k in changes:
        print(f"  updated: {k}")
    print("\nManual steps left (YouTube Studio → Customization):")
    print("  1. Profile picture → upload media/branding/avatar.png")
    print("  2. Handle → @DeenAndDinar")
    if not args.trailer:
        print("  3. Re-run with --trailer VIDEO_ID once the trailer is uploaded")


if __name__ == "__main__":
    main()
