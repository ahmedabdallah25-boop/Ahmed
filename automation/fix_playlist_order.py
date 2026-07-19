#!/usr/bin/env python3
"""Keep the series playlist in chronological order (Part 1 → latest).

Finds the owner's playlist containing the series videos, compares its order
against series_video_ids in config.json, and repositions items to match.
Non-series videos keep their relative order after the series. Idempotent:
does nothing when the playlist is already in order.

Needs the OAuth trio (playlist writes can't use a plain API key). Stdlib
only, so CI needs no pip install.
"""
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

CONFIG = json.loads((Path(__file__).parent / "config.json").read_text())
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


def find_series_playlist(token: str, series: list) -> tuple[str, str, list]:
    """Return (playlist_id, title, items) for the owner playlist holding the series."""
    best = None
    for pl in list_all("playlists", {"part": "snippet", "mine": "true"}, token):
        items = list_all("playlistItems", {"part": "snippet",
                                           "playlistId": pl["id"]}, token)
        hits = sum(1 for it in items
                   if it["snippet"]["resourceId"].get("videoId") in series)
        if hits >= 3 and (best is None or hits > best[3]):
            best = (pl["id"], pl["snippet"]["title"], items, hits)
    if best is None:
        sys.exit("No owned playlist contains 3+ series videos — create the series "
                 "playlist (or add the videos) first.")
    return best[0], best[1], best[2]


def main():
    series = CONFIG["series_video_ids"]
    token = oauth_access_token()
    playlist_id, title, items = find_series_playlist(token, series)

    items.sort(key=lambda it: it["snippet"]["position"])
    current = [it["snippet"]["resourceId"]["videoId"] for it in items]
    in_series = [v for v in series if v in current]
    extras = [v for v in current if v not in series]
    desired = in_series + extras

    def label(vid):
        return f"Part {series.index(vid) + 1}" if vid in series else vid

    print(f'Playlist "{title}" ({playlist_id}): {len(current)} items')
    print("  current:", " → ".join(label(v) for v in current))
    missing = [label(v) for v in series if v not in current]
    if missing:
        print("  not in playlist yet:", ", ".join(missing))

    if current == desired:
        print("Already in order — nothing to do.")
        return

    by_video = {it["snippet"]["resourceId"]["videoId"]: it for it in items}
    for pos, vid in enumerate(desired):
        item = by_video[vid]
        api_call("PUT", "playlistItems", {"part": "snippet"}, token, body={
            "id": item["id"],
            "snippet": {
                "playlistId": playlist_id,
                "position": pos,
                "resourceId": item["snippet"]["resourceId"],
            },
        })
    print("  reordered:", " → ".join(label(v) for v in desired))

    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_path:
        with open(summary_path, "a") as f:
            f.write(f'### Playlist order\n\nReordered "{title}" to: '
                    + " → ".join(label(v) for v in desired) + "\n")


if __name__ == "__main__":
    main()
