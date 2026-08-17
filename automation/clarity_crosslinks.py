#!/usr/bin/env python3
"""Append a WATCH NEXT block to each Clarity in the Quran description.

    python automation/clarity_crosslinks.py --dry-run   preview
    python automation/clarity_crosslinks.py             write them

The audit found zero cross-links across all 13 long-form uploads: no video's
description pointed at any other. Playlists solve this for viewers who use the
sidebar or autoplay; this solves it for the ones who arrive from search, watch,
and would otherwise leave.

Each video links to the other videos in its own playlist, plus the playlist
itself. Grouping comes from clarity/playlists.json, so the two stay consistent —
change a playlist there and re-running rewrites the blocks to match.

Three rules the implementation exists to enforce:

  APPENDED, never prepended. The first lines of a description are the search
  snippet, and these open with real hooks. Gaining a link position by pushing
  the hook down trades the thing that earns the click for the thing that earns
  the second view.

  REPLACEABLE, not accumulating. Everything from the marker to the end is the
  generated block, so a re-run rewrites it. Without that, running twice leaves
  two blocks.

  UNDER THE CAP. YouTube rejects a description over 5,000 characters outright,
  and StCW3ERkWwc already sits at 4,649. Links are dropped one at a time until
  the block fits, and whatever was dropped is reported rather than silently lost.

Playlist ids are resolved live by title rather than stored, so a playlist
recreated by hand does not leave this writing dead links.
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
MARKER = CFG["crosslink_marker"]
LINK_TITLES = CFG["link_titles"]
SECRETS = ("CIQ_CLIENT_ID", "CIQ_CLIENT_SECRET", "CIQ_REFRESH_TOKEN")
API = "https://www.googleapis.com/youtube/v3"

DESC_CAP = 4900          # YouTube's hard limit is 5000; leave room.
ERRORS, OUT = [], []


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
    sys.exit(f"\n{msg}\nRefusing to rewrite descriptions on the wrong channel.")


def playlist_ids(token):
    out, page = {}, None
    while True:
        b = call(token, "GET", "playlists",
                 {"part": "snippet", "mine": "true", "maxResults": 50,
                  **({"pageToken": page} if page else {})})
        for p in b.get("items", []):
            out[p["snippet"]["title"]] = p["id"]
        page = b.get("nextPageToken")
        if not page:
            return out


def strip_block(desc):
    """Everything from the marker onward is ours. Return the human part."""
    i = desc.find(MARKER)
    return desc if i == -1 else desc[:i].rstrip()


def build_block(siblings, playlist_title, playlist_id, budget):
    """Assemble the block, dropping links from the end until it fits `budget`."""
    dropped = []
    links = list(siblings)
    while True:
        lines = [MARKER + f" — {playlist_title}"]
        lines += [f"{LINK_TITLES[v]}: https://youtu.be/{v}" for v in links]
        if playlist_id:
            lines.append(f"▶ Full playlist: https://www.youtube.com/playlist?list={playlist_id}")
        block = "\n\n" + "\n".join(lines)
        if len(block) <= budget or not links:
            return block, dropped
        dropped.append(links.pop())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    token = access_token()
    say("== Channel guard ==")
    assert_channel(token, read_only=args.dry_run)

    pids = playlist_ids(token)
    say(f"\n{len(pids)} playlist(s) resolved live by title.")

    written = 0
    for spec in CFG["playlists"]:
        ptitle = spec["title"]
        pid = pids.get(ptitle)
        if not pid:
            say(f"\n! playlist not found on the channel: {ptitle} — skipping its videos.")
            ERRORS.append(f"playlist missing: {ptitle}")
            continue
        say(f"\n== {ptitle} ==")

        for vid in spec["video_ids"]:
            siblings = [v for v in spec["video_ids"] if v != vid]
            try:
                items = call(token, "GET", "videos",
                             {"part": "snippet", "id": vid}).get("items", [])
            except urllib.error.HTTPError as e:
                say(f"  ERROR {vid}: fetch failed HTTP {e.code}")
                ERRORS.append(f"{vid}: fetch failed")
                continue
            if not items:
                say(f"  SKIP {vid}: not found.")
                ERRORS.append(f"{vid}: not found")
                continue

            snippet = items[0]["snippet"]
            live = snippet.get("description", "")
            human = strip_block(live)
            block, dropped = build_block(siblings, ptitle, pid, DESC_CAP - len(human))
            new = human + block

            if len(new) > DESC_CAP + 100:
                say(f"  SKIP {vid}: even an empty block will not fit ({len(human)} chars of copy).")
                ERRORS.append(f"{vid}: description too long for any block")
                continue
            if new == live:
                say(f"  = {vid} block already current.")
                continue

            had = MARKER in live
            say(f"  {vid} {'refresh' if had else 'append'}: "
                f"{len(live)} -> {len(new)} chars, {len(siblings) - len(dropped)} link(s)"
                + (f", {len(dropped)} DROPPED for the cap" if dropped else ""))
            if dropped:
                say(f"      dropped: {', '.join(dropped)}")
            if args.dry_run:
                say("      [dry-run] not written")
                continue

            snippet["description"] = new
            try:
                call(token, "PUT", "videos", {"part": "snippet"},
                     {"id": vid, "snippet": snippet})
            except urllib.error.HTTPError as e:
                reason = ""
                try:
                    reason = json.loads(e.read().decode())["error"]["errors"][0].get("reason", "")
                except Exception:
                    pass
                say(f"      ERROR writing: HTTP {e.code} {reason}")
                ERRORS.append(f"{vid}: write failed ({reason or e.code})")
                continue
            say("      written")
            written += 1

    say(f"\n{written} description(s) updated.")
    if args.dry_run:
        say("Dry run — nothing was written.")
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
