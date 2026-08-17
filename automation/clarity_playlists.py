#!/usr/bin/env python3
"""Create Clarity in the Quran's playlists from clarity/playlists.json.

    python automation/clarity_playlists.py --dry-run   preview
    python automation/clarity_playlists.py             create them

The channel had zero playlists against 13 long-form uploads. On a long-form
channel that is the largest structural gap available: playlists carry autoplay
from one video into the next, rank in search as their own entity, and cluster a
flat upload feed into topics.

Idempotent by playlist title. Re-running adds only videos that are missing from
a list that already exists, so it will not duplicate a playlist or an item.

Purely additive — it never edits a video's own metadata. Nothing here can change
a title, description or tag.
"""
import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

CFG = json.loads((Path(__file__).resolve().parent.parent
                  / "clarity" / "playlists.json").read_text())
EXPECT = CFG["expect_channel_id"]
SECRETS = ("CIQ_CLIENT_ID", "CIQ_CLIENT_SECRET", "CIQ_REFRESH_TOKEN")
API = "https://www.googleapis.com/youtube/v3"
ERRORS = []
OUT = []


def say(line=""):
    print(line)
    OUT.append(line)


def summarize():
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    if path:
        with open(path, "a") as f:
            f.write("```\n" + "\n".join(OUT) + "\n```\n")


def access_token():
    missing = [k for k in SECRETS if not os.environ.get(k)]
    if missing:
        sys.exit(f"Missing: {', '.join(missing)}.")
    body = urllib.parse.urlencode({
        "client_id": os.environ["CIQ_CLIENT_ID"],
        "client_secret": os.environ["CIQ_CLIENT_SECRET"],
        "refresh_token": os.environ["CIQ_REFRESH_TOKEN"],
        "grant_type": "refresh_token"}).encode()
    try:
        with urllib.request.urlopen("https://oauth2.googleapis.com/token",
                                    data=body, timeout=30) as r:
            return json.load(r)["access_token"]
    except urllib.error.HTTPError as e:
        try:
            err = json.loads(e.read().decode() or "{}").get("error", f"HTTP {e.code}")
        except ValueError:
            err = f"HTTP {e.code}"
        sys.exit(f"Google rejected CIQ_REFRESH_TOKEN: {err}.")


def call(token, method, path, params=None, body=None):
    url = f"{API}/{path}"
    if params:
        url += "?" + urllib.parse.urlencode(params)
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={
        "Authorization": f"Bearer {token}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def assert_channel(token, read_only):
    items = call(token, "GET", "channels", {"part": "snippet", "mine": "true"}).get("items", [])
    if not items:
        sys.exit("Authenticated, but the token owns no channel.")
    got, title = items[0]["id"], items[0]["snippet"].get("title", "?")
    say(f"  authenticated as: {title} ({got})")
    if got == EXPECT:
        return
    msg = f"CHANNEL MISMATCH: expected {EXPECT}, got {title} ({got})."
    if read_only:
        say(f"  ! {msg}\n  ! Dry run, continuing.")
        return
    sys.exit(f"\n{msg}\nRefusing to create playlists on the wrong channel.")


def existing(token):
    out, page = {}, None
    while True:
        b = call(token, "GET", "playlists",
                 {"part": "snippet,contentDetails", "mine": "true", "maxResults": 50,
                  **({"pageToken": page} if page else {})})
        for p in b.get("items", []):
            out[p["snippet"]["title"]] = p["id"]
        page = b.get("nextPageToken")
        if not page:
            return out


def items_in(token, playlist_id):
    """Video ids already in a playlist.

    Returns [] on 404. A playlist id is not immediately queryable after
    playlists.insert — the same read-after-write lag that makes videos.list
    return a pre-write snippet — so a freshly created list 404s here for a few
    seconds. It is empty in that state regardless, which is exactly what []
    means, and treating it as an error would abort a run that is working.
    """
    out, page = [], None
    while True:
        try:
            b = call(token, "GET", "playlistItems",
                     {"part": "contentDetails", "playlistId": playlist_id, "maxResults": 50,
                      **({"pageToken": page} if page else {})})
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return out
            raise
        out += [i["contentDetails"]["videoId"] for i in b.get("items", [])]
        page = b.get("nextPageToken")
        if not page:
            return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    token = access_token()
    say("== Channel guard ==")
    assert_channel(token, read_only=args.dry_run)

    have = existing(token)
    say(f"\n{len(have)} playlist(s) already on the channel.")
    created = added = 0

    for spec in CFG["playlists"]:
        title = spec["title"]
        say(f"\n== {title} ==")
        pid = have.get(title)
        fresh = False

        if pid:
            say(f"  exists ({pid})")
        elif args.dry_run:
            say("  [dry-run] would create (public)")
            say(f"      {len(spec['video_ids'])} video(s): {', '.join(spec['video_ids'])}")
            continue
        else:
            try:
                pid = call(token, "POST", "playlists",
                           {"part": "snippet,status"},
                           {"snippet": {"title": title, "description": spec["description"],
                                        "defaultLanguage": "en"},
                            "status": {"privacyStatus": "public"}})["id"]
            except urllib.error.HTTPError as e:
                say(f"  ERROR creating: HTTP {e.code}")
                ERRORS.append(f"{title}: create failed")
                continue
            say(f"  created ({pid})")
            created += 1
            fresh = True

        present = [] if fresh else items_in(token, pid)
        for vid in spec["video_ids"]:
            if vid in present:
                say(f"  = {vid} already in list")
                continue
            if args.dry_run:
                say(f"  + {vid} [dry-run]")
                continue
            try:
                call(token, "POST", "playlistItems", {"part": "snippet"},
                     {"snippet": {"playlistId": pid,
                                  "resourceId": {"kind": "youtube#video", "videoId": vid}}})
            except urllib.error.HTTPError as e:
                say(f"  ERROR adding {vid}: HTTP {e.code}")
                ERRORS.append(f"{title}/{vid}: add failed")
                continue
            say(f"  + {vid}")
            added += 1

    say(f"\n{created} playlist(s) created, {added} video(s) added.")
    if args.dry_run:
        say("Dry run — nothing was created.")
    if ERRORS:
        say(f"\n{len(ERRORS)} failure(s):")
        for e in ERRORS:
            say(f"  - {e}")
        summarize()
        return 1
    summarize()
    return 0


if __name__ == "__main__":
    sys.exit(main())
