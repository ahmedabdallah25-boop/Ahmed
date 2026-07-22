#!/usr/bin/env python3
"""Make the long-form episode discoverable from playlists.

1. Ensures a dedicated full-episodes playlist exists (creates it, public, if
   missing) and that the episode is in it.
2. Optionally also appends the episode to the main series playlist — the one
   the Shorts series lives in — so binge viewers coming off the Shorts land on
   the long-form. fix_playlist_order.py keeps the numbered parts first and
   leaves extras like this after them, so the two scripts don't fight.

Usage: ensure_longform_playlist.py [config-file]   (defaults to longform.json)

Needs the OAuth trio (playlist writes can't use a plain API key). Stdlib only,
so CI needs no pip install. Idempotent.
"""
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

CONFIG_NAME = sys.argv[1] if len(sys.argv) > 1 else "longform.json"
CONFIG = json.loads((Path(__file__).parent / CONFIG_NAME).read_text())
API = "https://www.googleapis.com/youtube/v3"


def oauth_access_token() -> str:
    body = urllib.parse.urlencode({
        "client_id": os.environ["YT_CLIENT_ID"],
        "client_secret": os.environ["YT_CLIENT_SECRET"],
        "refresh_token": os.environ["YT_REFRESH_TOKEN"],
        "grant_type": "refresh_token",
    }).encode()
    with urllib.request.urlopen("https://oauth2.googleapis.com/token",
                                data=body, timeout=30) as r:
        return json.load(r)["access_token"]


def api_call(method: str, endpoint: str, params: dict, token: str,
             body: dict | None = None) -> dict:
    url = f"{API}/{endpoint}?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": f"Bearer {token}",
                 "Content-Type": "application/json"},
        method=method,
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def list_all(endpoint: str, params: dict, token: str) -> list:
    items, page_token = [], None
    while True:
        page = dict(params, maxResults=50)
        if page_token:
            page["pageToken"] = page_token
        data = api_call("GET", endpoint, page, token)
        items.extend(data.get("items", []))
        page_token = data.get("nextPageToken")
        if not page_token:
            return items


def ensure_in_playlist(playlist_id: str, playlist_label: str, vid: str,
                       token: str, report: list, assume_empty: bool = False):
    # A just-created playlist can 404 for a few seconds while it propagates —
    # skip the membership check for those (they can't contain the video yet)
    # and retry the insert on 404.
    if not assume_empty:
        items = list_all("playlistItems", {"part": "snippet",
                                           "playlistId": playlist_id}, token)
        if any(it["snippet"]["resourceId"].get("videoId") == vid for it in items):
            report.append(f'already in {playlist_label}')
            return
    body = {
        "snippet": {
            "playlistId": playlist_id,
            "resourceId": {"kind": "youtube#video", "videoId": vid},
        },
    }
    for attempt in range(5):
        try:
            api_call("POST", "playlistItems", {"part": "snippet"}, token, body=body)
            break
        except urllib.error.HTTPError as e:
            if e.code == 404 and attempt < 4:
                time.sleep(5 * (attempt + 1))
                continue
            raise
    report.append(f'added to {playlist_label}')


def main():
    cfg = CONFIG["longform_playlist"]
    vid = CONFIG["video_id"]
    token = oauth_access_token()
    playlists = list_all("playlists", {"part": "snippet", "mine": "true"}, token)
    report = []

    # 1. Dedicated full-episodes playlist (create if missing).
    wanted = cfg["title"].strip().lower()
    target = next((p for p in playlists
                   if p["snippet"]["title"].strip().lower() == wanted), None)
    created = target is None
    if created:
        target = api_call("POST", "playlists", {"part": "snippet,status"}, token, body={
            "snippet": {"title": cfg["title"],
                        "description": cfg.get("description", "")},
            "status": {"privacyStatus": "public"},
        })
        report.append(f'created playlist "{cfg["title"]}"')
    ensure_in_playlist(target["id"], f'"{cfg["title"]}"', vid, token, report,
                       assume_empty=created)
    playlist_url = f"https://www.youtube.com/playlist?list={target['id']}"
    report.append(f"full-episodes playlist: {playlist_url}")

    # 2. Also drop the episode into the main series playlist for binge traffic.
    if cfg.get("also_add_to_series_playlist"):
        series = CONFIG["series_video_ids"]
        best = None
        for pl in playlists:
            items = list_all("playlistItems", {"part": "snippet",
                                               "playlistId": pl["id"]}, token)
            hits = sum(1 for it in items
                       if it["snippet"]["resourceId"].get("videoId") in series)
            if hits >= 3 and (best is None or hits > best[1]):
                best = (pl, hits)
        if best is None:
            report.append("series playlist not found (no owned playlist holds 3+ "
                          "series videos) — skipped")
        else:
            ensure_in_playlist(best[0]["id"],
                               f'series playlist "{best[0]["snippet"]["title"]}"',
                               vid, token, report)

    lines = "\n".join(f"  - {r}" for r in report)
    print(f"Playlists for {vid}:\n{lines}")

    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_path:
        with open(summary_path, "a") as f:
            f.write(f"### Long-form playlists\n\n{lines}\n")


if __name__ == "__main__":
    main()
