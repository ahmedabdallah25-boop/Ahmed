#!/usr/bin/env python3
"""Apply a fix pack (title / description / tags) to the live video.

Usage: apply_fix.py [config-file]
  config-file defaults to config.json (the current Short). Pass longform.json
  to apply the long-form episode's fix pack instead.

Needs the channel owner's OAuth credentials in env vars (one-time setup, see SETUP.md):
  YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN

Idempotent: running twice changes nothing the second time.
"""
import json
import os
import sys
from pathlib import Path

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

CONFIG_NAME = sys.argv[1] if len(sys.argv) > 1 else "config.json"
CONFIG = json.loads((Path(__file__).parent / CONFIG_NAME).read_text())
SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"]


def yt_client():
    missing = [v for v in ("YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN")
               if not os.environ.get(v)]
    if missing:
        sys.exit(f"Missing env vars: {', '.join(missing)} — complete SETUP.md first.")
    creds = Credentials(
        token=None,
        refresh_token=os.environ["YT_REFRESH_TOKEN"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=os.environ["YT_CLIENT_ID"],
        client_secret=os.environ["YT_CLIENT_SECRET"],
        scopes=SCOPES,
    )
    return build("youtube", "v3", credentials=creds)


def build_description():
    playlist_url = CONFIG["playlist_url"].strip()
    line = f"▶ Full series in order: {playlist_url}\n" if playlist_url else ""
    return CONFIG["new_description"].replace("{PLAYLIST_LINE}", line)


def main():
    yt = yt_client()
    vid = CONFIG["video_id"]
    items = yt.videos().list(part="snippet", id=vid).execute().get("items", [])
    if not items:
        sys.exit(f"Video {vid} not found — deleted, or the OAuth account is not the channel owner.")

    snippet = items[0]["snippet"]
    new_tags = sorted(set(snippet.get("tags", [])) | set(CONFIG["add_tags"]))
    target_title = CONFIG["new_title"]
    target_description = build_description()

    if (snippet.get("title") == target_title
            and snippet.get("description") == target_description
            and set(snippet.get("tags", [])) == set(new_tags)):
        print("Already up to date — nothing to do.")
        return

    snippet["title"] = target_title
    snippet["description"] = target_description
    snippet["tags"] = new_tags
    yt.videos().update(part="snippet", body={"id": vid, "snippet": snippet}).execute()
    print(f"Updated {CONFIG.get('watch_url') or f'https://youtube.com/shorts/{vid}'}")
    print(f"  title: {target_title}")
    if not CONFIG["playlist_url"].strip():
        print("  note: playlist_url is empty in config.json — the series-playlist line was "
              "omitted. Fill it in and re-run to add it.")


if __name__ == "__main__":
    main()
