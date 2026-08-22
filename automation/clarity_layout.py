#!/usr/bin/env python3
"""Set the channel layout on Clarity in the Quran (@ClarityInTheQuran).

    python automation/clarity_layout.py --dry-run   preview every change
    python automation/clarity_layout.py             write them

Channel 3 only. Reuses clarity_packaging.py's auth, HTTP and channel guard so
there is exactly one place in this repo that handles the CIQ_* secrets.

WHY THIS EXISTS, AND WHAT IT CORRECTS

The 2026-08-22 diagnosis recorded the missing Home tab as "Studio-only, channel
sections have no public API". The first half of that was an overstatement. The
layout is three separate things and they do not share a fate:

  1. Channel trailer for UNSUBSCRIBED viewers — brandingSettings.channel.
     unsubscribedTrailer. Plainly settable through channels.update, which
     clarity_packaging.py has been calling for keywords and country all along.
     This is the piece that matters most: it is what a first-time visitor sees.

  2. Section shelves — the channelSections resource. Whether insert still works
     for a given channel is not something to assert from memory, so this script
     ATTEMPTS it and reports the API's actual response, including the error body
     on refusal. A run that cannot create sections is not a failed run; it is a
     measurement, and it prints the Studio path to finish by hand.

  3. Featured video for RETURNING subscribers — genuinely has no Data API field.
     Stays manual. Named in the output so it is not silently forgotten.

Both writes are fetch-then-mutate against the live object, never a blind PUT.
The branding write in particular reads the whole brandingSettings block and
changes one key, because assigning a fresh object would drop the 258 characters
of keywords set on 17 August.
"""
import argparse
import json
import sys
import urllib.error
from pathlib import Path

from clarity_packaging import (
    ERRORS,
    access_token,
    assert_channel,
    call,
    say,
    summarize,
)

CFG_PATH = Path(__file__).resolve().parent.parent / "clarity" / "layout.json"
CFG = json.loads(CFG_PATH.read_text())
EXPECT = CFG["expect_channel_id"]


def http_error_detail(e):
    """Return the API's own reason for a refusal, not just the status code.

    The whole point of the channelSections attempt is to learn what YouTube
    actually says. 'HTTP 403' alone would leave the question open; the reason
    string distinguishes 'not supported' from a quota or scope problem.
    """
    try:
        body = json.loads(e.read().decode() or "{}")
    except (ValueError, OSError):
        return f"HTTP {e.code}"
    err = body.get("error", {})
    reasons = [d.get("reason", "") for d in err.get("errors", []) if d.get("reason")]
    msg = err.get("message", "")
    parts = [f"HTTP {e.code}"]
    if reasons:
        parts.append("/".join(reasons))
    if msg:
        parts.append(msg)
    return " — ".join(parts)


def set_trailer(token, dry_run):
    cfg = CFG.get("unsubscribed_trailer")
    if not cfg:
        return 0
    want = cfg.get("video_id")
    if not want:
        return 0

    items = call(token, "GET", "channels",
                 {"part": "brandingSettings", "mine": "true"}).get("items", [])
    if not items:
        ERRORS.append("trailer: channel not found")
        return 0
    branding = items[0]["brandingSettings"]
    have = branding.get("channel", {}).get("unsubscribedTrailer", "")

    if have == want:
        say(f"  = trailer already set to {want}.")
        return 0

    # A trailer pointing at a video the channel does not own, or a private one,
    # is accepted by the API and then renders as nothing. Check before writing.
    vids = call(token, "GET", "videos",
                {"part": "snippet,status", "id": want}).get("items", [])
    if not vids:
        say(f"  ERROR trailer: {want} does not resolve to a video.")
        ERRORS.append(f"trailer: {want} not found")
        return 0
    v = vids[0]
    if v["snippet"].get("channelId") != EXPECT:
        say(f"  ERROR trailer: {want} belongs to another channel.")
        ERRORS.append(f"trailer: {want} not owned by {EXPECT}")
        return 0
    privacy = v.get("status", {}).get("privacyStatus")
    if privacy not in ("public", "unlisted"):
        say(f"  ERROR trailer: {want} is {privacy}; a trailer must be public or unlisted.")
        ERRORS.append(f"trailer: {want} is {privacy}")
        return 0

    say(f"  trailer: {have or '(none)'} -> {want}")
    say(f"      {v['snippet'].get('title', '?')}")
    if dry_run:
        say("      [dry-run] not written")
        return 0

    branding.setdefault("channel", {})["unsubscribedTrailer"] = want
    try:
        call(token, "PUT", "channels", {"part": "brandingSettings"},
             {"id": items[0]["id"], "brandingSettings": branding})
    except urllib.error.HTTPError as e:
        detail = http_error_detail(e)
        say(f"      ERROR writing trailer: {detail}")
        ERRORS.append(f"trailer: {detail}")
        return 0
    say("      written")
    return 1


def live_playlists(token):
    out, page = {}, None
    while True:
        params = {"part": "snippet", "mine": "true", "maxResults": 50}
        if page:
            params["pageToken"] = page
        r = call(token, "GET", "playlists", params)
        for it in r.get("items", []):
            out[it["snippet"]["title"].strip()] = it["id"]
        page = r.get("nextPageToken")
        if not page:
            return out


def existing_sections(token):
    try:
        r = call(token, "GET", "channelSections",
                 {"part": "snippet,contentDetails", "mine": "true"})
    except urllib.error.HTTPError as e:
        return None, http_error_detail(e)
    return r.get("items", []), None


def sync_sections(token, dry_run):
    wanted = CFG.get("sections", [])
    if not wanted:
        return 0

    have, err = existing_sections(token)
    if have is None:
        say(f"  channelSections.list refused: {err}")
        say("  Cannot read the current shelves, so nothing will be created.")
        ERRORS.append(f"sections: list refused ({err})")
        return 0

    say(f"  {len(have)} section(s) currently on the channel.")
    claimed = set()
    for s in have:
        for pid in (s.get("contentDetails", {}) or {}).get("playlists", []) or []:
            claimed.add(pid)

    pls = live_playlists(token)
    say(f"  {len(pls)} playlist(s) resolved live by title.")

    written = 0
    position = len(have)
    for spec in wanted:
        title = spec["playlist_title"]
        pid = pls.get(title)
        if not pid:
            say(f"  ! no live playlist titled {title!r} — skipped.")
            ERRORS.append(f"sections: playlist {title!r} not found")
            continue
        if pid in claimed:
            say(f"  = {title} already has a shelf.")
            continue

        say(f"  + {title} ({pid}) at position {position}")
        if dry_run:
            say("      [dry-run] not written")
            position += 1
            continue

        body = {
            "snippet": {
                "type": "singlePlaylist",
                "style": "horizontalRow",
                "position": position,
            },
            "contentDetails": {"playlists": [pid]},
        }
        try:
            call(token, "POST", "channelSections",
                 {"part": "snippet,contentDetails"}, body)
        except urllib.error.HTTPError as e:
            detail = http_error_detail(e)
            say(f"      REFUSED: {detail}")
            ERRORS.append(f"sections: {title!r} refused ({detail})")
            # One refusal means the rest will refuse identically. Stop rather
            # than printing the same error four times.
            say("      Remaining sections skipped — the API is refusing this "
                "operation, not this playlist.")
            break
        say("      written")
        written += 1
        position += 1
    return written


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    token = access_token()
    say("== Channel guard ==")
    assert_channel(token, args.dry_run)

    say("\n== Channel trailer (unsubscribed viewers) ==")
    written = set_trailer(token, args.dry_run)

    say("\n== Section shelves ==")
    written += sync_sections(token, args.dry_run)

    say(f"\n{written} change(s) written.")
    if args.dry_run:
        say("Dry run — nothing was written. Drop --dry-run to apply.")

    say("\nNot doable through the API, by design (1):")
    say("  - featured video for RETURNING subscribers. No brandingSettings or")
    say("    channelSections field exposes it. YouTube Studio -> Customisation")
    say("    -> Layout -> Featured sections.")

    if ERRORS:
        say(f"\n{len(ERRORS)} failure(s) — this run is NOT complete:")
        for e in ERRORS:
            say(f"  - {e}")
        summarize()
        return 1
    summarize()
    return 0


if __name__ == "__main__":
    sys.exit(main())
