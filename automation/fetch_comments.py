#!/usr/bin/env python3
"""Fetch all comment threads (with replies) for the recent series videos.

Read-only: lists commentThreads so unreplied viewer comments can be spotted
from the workflow log. Auth works like monitor.py — YT_API_KEY if set,
otherwise the OAuth trio. Stdlib only, so CI needs no pip install.

Threads whose top-level author isn't the channel owner and that have no
reply from the owner are flagged UNREPLIED.
"""
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

VIDEOS = {
    "Part 10 (Savings drain)": "OXIP3EJROQk",
    "Part 11 (Gharar)": "BMSmgBJ82JU",
    "Part 12 (Takaful)": "ebIU6OHJ-jg",
    "Part 13 (Ijara)": "ElD5gg-Q1wY",
    "Long-form Ep. 1 (Money Creation)": "7TWUwpbl83U",
}


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


def api_get(endpoint: str, params: dict) -> dict:
    url = f"https://www.googleapis.com/youtube/v3/{endpoint}?" + urllib.parse.urlencode(params)
    headers = {}
    api_key = os.environ.get("YT_API_KEY")
    if api_key:
        url += f"&key={api_key}"
    elif all(os.environ.get(v) for v in
             ("YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN")):
        headers["Authorization"] = f"Bearer {oauth_access_token()}"
    else:
        sys.exit("Need YT_API_KEY, or the YT_CLIENT_ID/YT_CLIENT_SECRET/YT_REFRESH_TOKEN "
                 "trio (see SETUP.md).")
    with urllib.request.urlopen(urllib.request.Request(url, headers=headers),
                                timeout=30) as resp:
        return json.load(resp)


def comment_line(snippet: dict, owner_channel_id: str, indent: str = "") -> str:
    author = snippet.get("authorDisplayName", "?")
    author_id = (snippet.get("authorChannelId") or {}).get("value", "")
    owner = " [OWNER]" if author_id == owner_channel_id else ""
    return (f"{indent}{author}{owner} ({snippet.get('publishedAt', '?')}, "
            f"{snippet.get('likeCount', 0)} likes): {snippet.get('textOriginal', '')!r}")


def main():
    lines = []
    for label, vid in VIDEOS.items():
        lines.append(f"\n=== {label} — https://youtu.be/{vid} ===")
        try:
            data = api_get("commentThreads", {
                "part": "snippet,replies", "videoId": vid,
                "maxResults": 100, "order": "time", "textFormat": "plainText",
            })
        except urllib.error.HTTPError as e:
            lines.append(f"  ERROR {e.code}: {e.read().decode(errors='replace')[:300]}")
            continue
        threads = data.get("items", [])
        if not threads:
            lines.append("  (no comments)")
            continue
        for t in threads:
            owner_channel_id = t["snippet"]["channelId"]
            top = t["snippet"]["topLevelComment"]["snippet"]
            replies = (t.get("replies") or {}).get("comments", [])
            top_author_id = (top.get("authorChannelId") or {}).get("value", "")
            owner_replied = any(
                (r["snippet"].get("authorChannelId") or {}).get("value", "") == owner_channel_id
                for r in replies
            )
            flag = ""
            if top_author_id != owner_channel_id and not owner_replied:
                flag = "  <-- UNREPLIED"
            lines.append(comment_line(top, owner_channel_id) + flag)
            for r in replies:
                lines.append(comment_line(r["snippet"], owner_channel_id, indent="    ↳ "))

    report = "\n".join(lines)
    print(report)

    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_path:
        with open(summary_path, "a") as f:
            f.write(f"### Comment threads\n\n```\n{report}\n```\n")


if __name__ == "__main__":
    main()
