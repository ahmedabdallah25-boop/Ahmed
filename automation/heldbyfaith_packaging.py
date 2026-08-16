#!/usr/bin/env python3
"""Apply heldbyfaith/packaging-fix.json to HELD BY FAITH (@HeldByFaithJourney).

    python automation/heldbyfaith_packaging.py --dry-run   preview every change
    python automation/heldbyfaith_packaging.py             write them

Channel 2 only. It reads its own config, authenticates with its own secrets
(HBF_CLIENT_ID / HBF_CLIENT_SECRET / HBF_REFRESH_TOKEN) and refuses to write to
anything other than UCh0tKIGR5Ns3Wvoai__txdg.

Why this is a separate script from reset_packaging.py, which does the same job for
Finance % Decoded: that one hardcodes reset.json at import, and its apply_target()
reads target["description"] unconditionally. Every entry here is title-only on
purpose — this channel's descriptions and tags are its strongest asset and the
config's `do_not_touch` contract puts them out of bounds. Bending this change to
fit that script would have meant rewriting descriptions that are already good.

What it does, all of it idempotent:

  1. retitle  — series-suffix repairs only. The channel currently uses three
     different names for one series ("Pancreatic Cancer Journey Ep. 1",
     "Muslim Cancer Story Ch. 3", and one unnumbered), so the numbering has a
     collision and a hole in it. Hooks are never touched.
  2. channel  — sets channel-level keywords and country, which are empty today.
  3. unlist   — gated: only once Ch. 6 is published.

Every hook stays exactly as written. The only title text that moves is the part
after the "|".
"""
import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

CFG_PATH = Path(__file__).resolve().parent.parent / "heldbyfaith" / "packaging-fix.json"
CFG = json.loads(CFG_PATH.read_text())
PROTECTED = set(CFG.get("protected", {}).get("video_ids", []))
EXPECT = CFG["expect_channel_id"]
SECRETS = ("HBF_CLIENT_ID", "HBF_CLIENT_SECRET", "HBF_REFRESH_TOKEN")

API = "https://www.googleapis.com/youtube/v3"
ERRORS = []
OUT = []


def say(line=""):
    print(line)
    OUT.append(line)


def summarize():
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    if not path:
        return
    with open(path, "a") as f:
        f.write("```\n" + "\n".join(OUT) + "\n```\n")


# --- transport -------------------------------------------------------------
# Stdlib only, matching monitor.py: this runs on a checkout with no pip install.

def access_token():
    missing = [k for k in SECRETS if not os.environ.get(k)]
    if missing:
        sys.exit(f"Missing: {', '.join(missing)}. Run the \"HELD BY FAITH - 1. Check setup\" "
                 f"workflow for the exact next step.")
    body = urllib.parse.urlencode({
        "client_id": os.environ["HBF_CLIENT_ID"],
        "client_secret": os.environ["HBF_CLIENT_SECRET"],
        "refresh_token": os.environ["HBF_REFRESH_TOKEN"],
        "grant_type": "refresh_token",
    }).encode()
    try:
        with urllib.request.urlopen("https://oauth2.googleapis.com/token",
                                    data=body, timeout=30) as r:
            return json.load(r)["access_token"]
    except urllib.error.HTTPError as e:
        try:
            err = json.loads(e.read().decode() or "{}").get("error", f"HTTP {e.code}")
        except ValueError:
            err = f"HTTP {e.code}"
        # Never echo the request body — it carries all three secrets.
        sys.exit(f"Google rejected HBF_REFRESH_TOKEN: {err}. Run the "
                 f"\"HELD BY FAITH - 1. Check setup\" workflow for the diagnosis.")


def call(token, method, path, params=None, body=None):
    url = f"{API}/{path}"
    if params:
        url += "?" + urllib.parse.urlencode(params)
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    })
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


# --- guard -----------------------------------------------------------------

def assert_channel(token, read_only):
    """Refuse to write to any channel this config was not written for.

    Not hypothetical. The channel-level branding write below is a
    fetch-then-mutate on brandingSettings: pointed at the wrong channel it would
    overwrite THAT channel's keywords and country in a single call, silently. And
    an HBF_REFRESH_TOKEN minted at Google's chooser without picking HELD BY FAITH
    is a perfectly valid token that authenticates as Finance % Decoded — which is
    exactly what two inventory runs found on 2026-08-04.

    Dry runs warn and continue, because discovering which channel a token actually
    owns is the whole point of a dry run.
    """
    items = call(token, "GET", "channels", {"part": "snippet", "mine": "true"}).get("items", [])
    if not items:
        sys.exit("Authenticated, but the token owns no channel. Check HBF_REFRESH_TOKEN.")
    got, title = items[0]["id"], items[0]["snippet"].get("title", "?")
    say(f"  authenticated as: {title} ({got})")
    if got == EXPECT:
        return
    msg = (f"CHANNEL MISMATCH: packaging-fix.json is written for {EXPECT} "
           f"(HELD BY FAITH), but the token authenticates as {title} ({got}).")
    if read_only:
        say(f"  ! {msg}")
        say("  ! Dry run, continuing. Nothing will be written.")
        return
    sys.exit(f"\n{msg}\nRefusing to write. Every title below belongs to HELD BY FAITH, "
             f"and the channel-level branding write would land on the wrong channel. "
             f"Re-mint HBF_REFRESH_TOKEN with automation/authorize.html and pick the "
             f"right channel at Google's chooser.")


# --- retitle ---------------------------------------------------------------

def retitle(token, target, dry_run):
    """Move one video's series suffix. Title only — nothing else is sent.

    videos.update replaces the whole snippet, so the live snippet is fetched and
    mutated rather than rebuilt: that is what keeps description, tags, categoryId
    and defaultLanguage intact, which the config's do_not_touch contract requires.
    """
    vid = target["video_id"]
    want = target["title"]

    try:
        items = call(token, "GET", "videos", {"part": "snippet,status", "id": vid}).get("items", [])
    except urllib.error.HTTPError as e:
        say(f"  ERROR {vid}: fetch failed: HTTP {e.code}")
        ERRORS.append(f"{vid}: fetch failed")
        return 0
    if not items:
        say(f"  SKIP {vid}: not found (deleted, or this token is not the owner).")
        ERRORS.append(f"{vid}: not found")
        return 0

    snippet = items[0]["snippet"]
    privacy = items[0].get("status", {}).get("privacyStatus", "?")
    live = snippet.get("title", "")

    if live == want:
        say(f"  = {vid} ({privacy}) already retitled.")
        return 0

    # A protected winner still gets its suffix moved — the config asks for exactly
    # that on 1TGtRIpgwt4 — but nothing else about it may change, and this path
    # only ever writes the title. Flagged so it is visible in the log.
    protected_note = "  (protected winner: suffix only)" if vid in PROTECTED else ""

    # If the live title is neither the old one the config recorded nor the new one,
    # something changed outside this repo. Retitling anyway would silently clobber
    # an edit made in Studio, so stop and report instead.
    expected_old = target.get("current_title")
    if expected_old and live != expected_old:
        say(f"  SKIP {vid} ({privacy}): live title does not match the config's record.")
        say(f"      expected: {expected_old}")
        say(f"      live:     {live}")
        say("      Someone edited this in Studio. Update packaging-fix.json, then re-run.")
        ERRORS.append(f"{vid}: live title drifted from current_title")
        return 0

    say(f"  {vid} ({privacy}){protected_note}")
    say(f"      was: {live}")
    say(f"      now: {want}")
    if dry_run:
        say("      [dry-run] not written")
        return 0

    snippet["title"] = want
    try:
        call(token, "PUT", "videos", {"part": "snippet"},
             {"id": vid, "snippet": snippet})
    except urllib.error.HTTPError as e:
        say(f"      ERROR writing: HTTP {e.code}")
        ERRORS.append(f"{vid}: write failed")
        return 0
    say("      written")
    return 1


# --- channel metadata ------------------------------------------------------

def fix_channel_meta(token, dry_run):
    """Set channel-level keywords and country, both empty today.

    A weak ranking signal on its own, but it is one of the few inputs YouTube uses
    to place a channel in a topic cluster, and empty gives it nothing. Costs
    nothing and cannibalises nothing.
    """
    cfg = CFG.get("channel")
    if not cfg:
        return 0
    want_kw = " ".join(f'"{k}"' if " " in k else k for k in cfg.get("keywords", []))

    items = call(token, "GET", "channels",
                 {"part": "brandingSettings", "mine": "true"}).get("items", [])
    if not items:
        ERRORS.append("channel: not found")
        return 0
    branding = items[0]["brandingSettings"]
    have_kw = branding.get("channel", {}).get("keywords", "")
    have_country = branding.get("channel", {}).get("country", "")
    want_country = cfg.get("country", have_country)

    changes = []
    if want_kw and have_kw != want_kw:
        changes.append(f"keywords: {len(have_kw)} chars -> {len(want_kw)} chars "
                       f"({len(cfg.get('keywords', []))} terms)")
    if want_country and want_country != have_country:
        changes.append(f"country: {have_country or '(unset)'} -> {want_country}")
    if not changes:
        say("  = channel metadata already up to date.")
        return 0
    for c in changes:
        say(f"  channel {c}")
    if dry_run:
        say("      [dry-run] not written")
        return 0

    if want_kw:
        branding.setdefault("channel", {})["keywords"] = want_kw
    if want_country:
        branding.setdefault("channel", {})["country"] = want_country
    try:
        call(token, "PUT", "channels", {"part": "brandingSettings"},
             {"id": items[0]["id"], "brandingSettings": branding})
    except urllib.error.HTTPError as e:
        say(f"      ERROR writing: HTTP {e.code}")
        ERRORS.append(f"channel branding: HTTP {e.code}")
        return 0
    say("      written")
    return 1


# --- unlist ----------------------------------------------------------------

def unlist(token, dry_run):
    """Unlist the orphan landscape cut — but only after Ch. 6 is live.

    Never delete: unlisting keeps the footage and the original upload date, and is
    reversible in one click. The gate matters — pulling it before the replacement
    exists removes a beat from the story instead of replacing it.
    """
    targets = CFG.get("unlist", [])
    if not targets:
        return 0
    if not CFG.get("ch6_video_id"):
        ids = ", ".join(t["video_id"] for t in targets)
        say(f"  BLOCKED {ids}: waiting on Ch. 6 to publish.")
        say("      Fill in ch6_video_id in packaging-fix.json once it is live, then re-run.")
        return 0

    written = 0
    for t in targets:
        vid = t["video_id"]
        items = call(token, "GET", "videos", {"part": "status", "id": vid}).get("items", [])
        if not items:
            say(f"  SKIP {vid}: not found.")
            ERRORS.append(f"{vid}: not found")
            continue
        status = items[0]["status"]
        if status.get("privacyStatus") == "unlisted":
            say(f"  = {vid} already unlisted.")
            continue
        say(f"  {vid}: {status.get('privacyStatus')} -> unlisted")
        if dry_run:
            say("      [dry-run] not written")
            continue
        status["privacyStatus"] = "unlisted"
        try:
            call(token, "PUT", "videos", {"part": "status"}, {"id": vid, "status": status})
        except urllib.error.HTTPError as e:
            say(f"      ERROR writing: HTTP {e.code}")
            ERRORS.append(f"{vid}: unlist failed")
            continue
        say("      written")
        written += 1
    return written


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true",
                    help="show every change without writing anything")
    args = ap.parse_args()

    token = access_token()

    say("== Channel guard ==")
    assert_channel(token, read_only=args.dry_run)

    written = 0
    say("\n== Series numbering (titles only) ==")
    for target in CFG.get("retitle", []):
        written += retitle(token, target, args.dry_run)

    say("\n== Channel metadata ==")
    written += fix_channel_meta(token, args.dry_run)

    say("\n== Orphan landscape cut ==")
    written += unlist(token, args.dry_run)

    say(f"\n{written} change(s) written.")
    if args.dry_run:
        say("Dry run — nothing was written. Untick \"dry run\" to apply.")
    if not CFG.get("ch6_video_id"):
        say("\nStill outstanding, by design: descriptions keep their current series block.")
        say("packaging-fix.json's series_block contains a {CH6_URL} placeholder that cannot")
        say("resolve until Ch. 6 is published, and a half-written block is worse than the")
        say("current one. Descriptions and tags are otherwise deliberately untouched.")

    if ERRORS:
        say(f"\n{len(ERRORS)} failure(s) — this run is NOT complete:")
        for err in ERRORS:
            say(f"  - {err}")
        summarize()
        return 1
    summarize()
    return 0


if __name__ == "__main__":
    sys.exit(main())
