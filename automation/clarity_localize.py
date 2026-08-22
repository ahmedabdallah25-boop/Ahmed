#!/usr/bin/env python3
"""Add localized titles and descriptions to Clarity in the Quran's back catalogue.

    python automation/clarity_localize.py --dry-run   preview every change
    python automation/clarity_localize.py             write them

Channel 3 only. Reuses clarity_packaging.py's auth, HTTP and channel guard so
there stays exactly one place in this repo that handles the CIQ_* secrets.

WHY

vidIQ keyword research, 2026-08-22:

    "quran explained in english"    5,268 searches/month
    "quran"                     1,398,036 searches/month   US = 6.5%
    "surah"                       283,511 searches/month   BD = 47.7%, PK = 28.4%
    "islamic video"               662,172 searches/month   BD + PK = 90%

@deepmadesimple is US-English Bible study: its audience and its language are the
same thing. Clarity copied that channel's format into a niche where they are not.
Localized metadata is the one lever that applies to the ENTIRE back catalogue in
a single pass, retroactively, and it is a documented Data API feature rather than
anything clever.

THE GOTCHA THIS SCRIPT EXISTS TO GET RIGHT

YouTube ignores a video's localizations unless snippet.defaultLanguage is set.
It is unset on every upload on this channel. Write localizations without it and
the API returns 200, the localizations field comes back populated on read, and
NOTHING IS EVER SERVED TO ANYONE. A silent success is worse than an error, so
this script sets defaultLanguage in the same write and refuses to proceed if it
cannot.

Everything lands in ONE fetch-mutate-write per video, for the reason
set_packaging already documents: videos.list is read-after-write eventually
consistent, so a second write can read back a pre-write snippet and undo the
first.

WHAT IT WILL NOT DO

It never touches the English title, the English description, tags, or the
WATCH NEXT cross-link block. Localizations are strictly additive: a viewer whose
app is in English sees exactly what they saw before this ran.
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

CFG_PATH = Path(__file__).resolve().parent.parent / "clarity" / "localizations.json"
CFG = json.loads(CFG_PATH.read_text())
EXPECT = CFG["expect_channel_id"]
LANGS = CFG.get("languages", [])

# YouTube caps a localized title at 100 characters and a localized description at
# 5,000, same as the English fields, and rejects the WHOLE update past either.
TITLE_MAX = 100
DESC_MAX = 5000


def http_error_detail(e):
    try:
        body = json.loads(e.read().decode() or "{}")
    except (ValueError, OSError):
        return f"HTTP {e.code}"
    err = body.get("error", {})
    reasons = [d.get("reason", "") for d in err.get("errors", []) if d.get("reason")]
    parts = [f"HTTP {e.code}"]
    if reasons:
        parts.append("/".join(reasons))
    if err.get("message"):
        parts.append(err["message"])
    return " — ".join(parts)


def validate():
    """Catch every fixable mistake before a single call is made."""
    problems = []
    seen = set()
    for v in CFG.get("videos", []):
        vid = v.get("id", "?")
        if vid in seen:
            problems.append(f"{vid}: listed twice")
        seen.add(vid)
        for lang in LANGS:
            loc = v.get(lang)
            if not loc:
                problems.append(f"{vid}: no {lang!r} block")
                continue
            t, d = loc.get("title", ""), loc.get("description", "")
            if not t.strip():
                problems.append(f"{vid}/{lang}: empty title")
            if not d.strip():
                problems.append(f"{vid}/{lang}: empty description")
            if len(t) > TITLE_MAX:
                problems.append(f"{vid}/{lang}: title {len(t)} chars, cap {TITLE_MAX}")
            if len(d) > DESC_MAX:
                problems.append(f"{vid}/{lang}: description {len(d)} chars, cap {DESC_MAX}")
    return problems


def localize(token, spec, dry_run):
    vid = spec["id"]
    try:
        items = call(token, "GET", "videos",
                     {"part": "snippet,localizations", "id": vid}).get("items", [])
    except urllib.error.HTTPError as e:
        say(f"  ERROR {vid}: fetch failed: {http_error_detail(e)}")
        ERRORS.append(f"{vid}: fetch failed")
        return 0
    if not items:
        say(f"  ERROR {vid}: not found.")
        ERRORS.append(f"{vid}: not found")
        return 0

    item = items[0]
    snippet = item["snippet"]
    if snippet.get("channelId") != EXPECT:
        say(f"  ERROR {vid}: belongs to another channel.")
        ERRORS.append(f"{vid}: wrong channel")
        return 0

    have = item.get("localizations", {}) or {}
    have_default = snippet.get("defaultLanguage", "")

    changes = []
    if not have_default:
        changes.append("defaultLanguage: (unset) -> en   [without this YouTube serves NO localization]")
    for lang in LANGS:
        want = spec[lang]
        cur = have.get(lang, {})
        if cur.get("title") == want["title"] and cur.get("description") == want["description"]:
            continue
        state = "add" if not cur else "update"
        changes.append(f"{lang} {state}: {want['title']}")

    if not changes:
        say(f"  = {vid} already localized for {', '.join(LANGS)}.")
        return 0

    say(f"  {vid} — {spec.get('_en', '')[:60]}")
    for c in changes:
        say(f"      {c}")
    if dry_run:
        say("      [dry-run] not written")
        return 0

    merged = dict(have)
    for lang in LANGS:
        merged[lang] = {"title": spec[lang]["title"],
                        "description": spec[lang]["description"]}

    # ONE write. snippet must be sent whole — a partial snippet on videos.update
    # blanks the fields left out, which would delete the title and the
    # description including the WATCH NEXT block.
    snippet["defaultLanguage"] = have_default or "en"
    body = {"id": vid, "snippet": snippet, "localizations": merged}
    try:
        call(token, "PUT", "videos", {"part": "snippet,localizations"}, body)
    except urllib.error.HTTPError as e:
        detail = http_error_detail(e)
        say(f"      ERROR writing: {detail}")
        ERRORS.append(f"{vid}: {detail}")
        return 0
    say("      written")
    return 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    problems = validate()
    if problems:
        print("Config is invalid — nothing was sent:")
        for p in problems:
            print(f"  - {p}")
        return 1

    token = access_token()
    say("== Channel guard ==")
    assert_channel(token, args.dry_run)

    say(f"\n== Localizations: {', '.join(LANGS)} across {len(CFG['videos'])} video(s) ==")
    written = 0
    for spec in CFG["videos"]:
        written += localize(token, spec, args.dry_run)

    say(f"\n{written} video(s) written.")
    if args.dry_run:
        say("Dry run — nothing was written. Drop --dry-run to apply.")

    say("\nReminder: localizations are ADDITIVE. English viewers see no change.")
    say("Verify by loading a video with ?hl=ar or ?hl=ur, or re-run --dry-run.")

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
