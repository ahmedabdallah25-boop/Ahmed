#!/usr/bin/env python3
"""Apply clarity/packaging-fix.json to Clarity in the Quran (@ClarityInTheQuran).

    python automation/clarity_packaging.py --dry-run   preview every change
    python automation/clarity_packaging.py             write them

Channel 3 only. Reads its own config, authenticates with its own secrets
(CIQ_CLIENT_ID / CIQ_CLIENT_SECRET / CIQ_REFRESH_TOKEN) and refuses to write to
anything other than UC0eBu0ZXcF20pTAG3lUnPXA.

Three operations, matching what this channel actually needs — which is not what
either other channel needed:

  1. set_tags          — 11 uploads have zero tags, including the 846-view best
                         performer. Purely additive: no existing text moves.
  2. description_edits — one strict line deletion, the Christian-register line
                         left in the best video's description. Nothing is added
                         or reworded.
  3. channel           — channel-level keywords and country, both empty today.

  4. set_packaging     — title, description and tags for ONE video in ONE write.
                         Added 2026-08-22 for freshly published uploads, which
                         are the only videos whose packaging is still worth
                         moving.

Titles on SETTLED videos are still never touched. Retitling a settled video
measured +0 views over 21.7 hours on channel 1, and that finding is about how
YouTube treats settled videos rather than about any channel's subject, so it
carries over. What it does not cover is a video published hours ago that has not
been shown to anyone yet: there is no settled state to disturb, and a defect
shipped in its metadata is pure loss. set_packaging exists for exactly that
window and refuses every id in `protected`.

set_packaging applies all three fields in a SINGLE fetch-mutate-write, and that
is not a tidiness preference. videos.list is read-after-write eventually
consistent (see the caveat below), so writing a title, then re-fetching to write
tags, can read back the PRE-title snippet and write the old title straight over
the new one. One write per video per run is the only safe shape. A video listed
in both set_packaging and set_tags is refused for the same reason.

One caveat that looks alarming and is not: **YouTube strips leading and trailing
whitespace from the title on any snippet update**, even when this script never
assigns to it. On the 2026-08-17 run two titles came back changed for exactly
that reason — 'The Kind of woman the Quran Warns Men about ' and 'Allah Already
Told You How to Be Rich — You Just Didn't Follow the Steps ' each lost a trailing
space they already carried. Both are identical after .strip(). A verification
pass should compare stripped titles, or it will report a diff that is server-side
normalisation rather than an edit.

Second caveat, same class: **videos.list is read-after-write eventually
consistent.** Reading a video back immediately after a successful update returns
the PRE-write snippet — measured at roughly 10 seconds' lag on 2026-08-17, where
an instant read showed 28 tags and a re-read moments later showed the written 30.
A verification step must poll until the change appears rather than read once, or
it will report a successful write as a silent failure.
"""
import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

CFG_PATH = Path(__file__).resolve().parent.parent / "clarity" / "packaging-fix.json"
CFG = json.loads(CFG_PATH.read_text())
EXPECT = CFG["expect_channel_id"]
PROTECTED = set(CFG.get("protected", {}).get("video_ids", []))
SECRETS = ("CIQ_CLIENT_ID", "CIQ_CLIENT_SECRET", "CIQ_REFRESH_TOKEN")

API = "https://www.googleapis.com/youtube/v3"
# YouTube rejects the whole update with `invalidTags` past 500 characters, and a
# tag containing a space is sent quoted. Budget under it and drop the overflow.
TAG_BUDGET = 460
# clarity_crosslinks.py owns everything from this marker to the end of a
# description. Kept in sync with crosslink_marker in clarity/playlists.json;
# test_clarity_marker_sync.py fails if the two ever disagree.
CROSSLINK_MARKER = "\u25b6 WATCH NEXT"
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


def access_token():
    missing = [k for k in SECRETS if not os.environ.get(k)]
    if missing:
        sys.exit(f"Missing: {', '.join(missing)}. Run \"CLARITY IN THE QURAN - check setup\" "
                 f"for the exact next step.")
    body = urllib.parse.urlencode({
        "client_id": os.environ["CIQ_CLIENT_ID"],
        "client_secret": os.environ["CIQ_CLIENT_SECRET"],
        "refresh_token": os.environ["CIQ_REFRESH_TOKEN"],
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
    """Refuse to write to a channel this config was not written for.

    The channel-level branding write is a fetch-then-mutate, so pointed at the
    wrong channel it would overwrite THAT channel's keywords and country in one
    silent call. Three channels now share this repo and one OAuth client can mint
    a token for any of them — the binding happens at Google's consent screen, not
    in the credentials, so this check is the only thing that catches a wrong pick.
    """
    items = call(token, "GET", "channels", {"part": "snippet", "mine": "true"}).get("items", [])
    if not items:
        sys.exit("Authenticated, but the token owns no channel. Check CIQ_REFRESH_TOKEN.")
    got, title = items[0]["id"], items[0]["snippet"].get("title", "?")
    say(f"  authenticated as: {title} ({got})")
    if got == EXPECT:
        return
    msg = (f"CHANNEL MISMATCH: packaging-fix.json is written for {EXPECT} "
           f"(Clarity in the Quran), but the token authenticates as {title} ({got}).")
    if read_only:
        say(f"  ! {msg}\n  ! Dry run, continuing. Nothing will be written.")
        return
    sys.exit(f"\n{msg}\nRefusing to write. Re-mint CIQ_REFRESH_TOKEN and pick the right "
             f"channel at Google's chooser.")


def fit(tags):
    kept, used = [], 0
    for t in tags:
        cost = len(t) + (2 if " " in t else 0) + 1
        if used + cost > TAG_BUDGET:
            continue
        kept.append(t)
        used += cost
    return kept, used


def fetch(token, vid):
    try:
        items = call(token, "GET", "videos",
                     {"part": "snippet,status", "id": vid}).get("items", [])
    except urllib.error.HTTPError as e:
        say(f"  ERROR {vid}: fetch failed: HTTP {e.code}")
        ERRORS.append(f"{vid}: fetch failed")
        return None
    if not items:
        say(f"  SKIP {vid}: not found (deleted, or this token is not the owner).")
        ERRORS.append(f"{vid}: not found")
        return None
    return items[0]


def write_snippet(token, vid, snippet, label):
    try:
        call(token, "PUT", "videos", {"part": "snippet"}, {"id": vid, "snippet": snippet})
    except urllib.error.HTTPError as e:
        detail = ""
        try:
            detail = json.loads(e.read().decode())["error"]["errors"][0].get("reason", "")
        except Exception:
            pass
        say(f"      ERROR writing {label}: HTTP {e.code} {detail}")
        ERRORS.append(f"{vid}: {label} write failed ({detail or e.code})")
        return 0
    say(f"      written ({label})")
    return 1


def set_tags(token, target, dry_run):
    """Add tags to a video. Purely additive — existing tags are kept first.

    videos.update replaces the whole snippet, so the live snippet is fetched and
    mutated: that is what leaves title, description and categoryId untouched,
    which matters here because four of these are protected winners.
    """
    vid = target["video_id"]
    item = fetch(token, vid)
    if not item:
        return 0
    snippet = item["snippet"]
    privacy = item.get("status", {}).get("privacyStatus", "?")
    old = snippet.get("tags", [])

    merged = list(old) + [t for t in target["tags"] if t.lower() not in {o.lower() for o in old}]
    new, used = fit(merged)
    dropped = len(merged) - len(new)

    if {t.lower() for t in new} == {t.lower() for t in old}:
        say(f"  = {vid} ({privacy}) tags already up to date.")
        return 0

    flag = "  (protected winner: tags are additive, no text moves)" if vid in PROTECTED else ""
    say(f"  {vid} ({privacy}){flag}")
    say(f"      tags: {len(old)} -> {len(new)}  ({used}/{TAG_BUDGET} chars"
        + (f", {dropped} dropped to stay under YouTube's 500-char cap" if dropped else "") + ")")
    say(f"      + {', '.join(t for t in new if t not in old)[:150]}")
    if dry_run:
        say("      [dry-run] not written")
        return 0
    snippet["tags"] = new
    return write_snippet(token, vid, snippet, "tags")


def edit_description(token, target, dry_run):
    """Delete one exact line from a description. Strictly a deletion.

    Matching is on the exact recorded line. If it is not present the video is
    reported as already clean rather than guessed at — a fuzzy match here would
    risk cutting a line that merely resembles it.
    """
    vid = target["video_id"]
    line = target["remove_line"]
    item = fetch(token, vid)
    if not item:
        return 0
    snippet = item["snippet"]
    desc = snippet.get("description", "")

    if line not in desc:
        say(f"  = {vid} description already clean (line not present).")
        return 0

    kept = [l for l in desc.split("\n") if l != line]
    new_desc = "\n".join(kept)
    say(f"  {vid} removing 1 line ({len(desc)} -> {len(new_desc)} chars)")
    say(f"      - {line.strip()[:110]}")
    if dry_run:
        say("      [dry-run] not written")
        return 0
    snippet["description"] = new_desc
    return write_snippet(token, vid, snippet, "description")


def set_packaging(token, target, dry_run):
    """Set title, description and/or tags on ONE unsettled video, in ONE write.

    Guarded four ways, because a title is the most visible thing on a video and a
    description rewrite is not recoverable from this repo:

      1. Every id in `protected` is refused outright.
      2. `expect_current_title` must match the live title after .strip(). If a
         human retitled since this config was written, the write is skipped
         rather than clobbering their edit.
      3. `expect_description_contains` must still be present in the live
         description. Same idea: if the body has already been rewritten, the
         sentinel is gone and this skips.
      4. Any WATCH NEXT block is carried across untouched. clarity_crosslinks.py
         owns everything from that marker to the end; preserving it means a
         packaging run never silently drops cross-links a crosslinks run
         installed.

    .strip() on both sides of the title compare is required, not defensive:
    YouTube strips leading and trailing whitespace from a title on ANY snippet
    update, so a raw compare reports server-side normalisation as a mismatch.
    """
    vid = target["video_id"]
    if vid in PROTECTED:
        say(f"  SKIP {vid}: protected winner — set_packaging refuses these.")
        ERRORS.append(f"{vid}: set_packaging refused (protected)")
        return 0

    item = fetch(token, vid)
    if not item:
        return 0
    snippet = item["snippet"]
    privacy = item.get("status", {}).get("privacyStatus", "?")
    changes, planned = [], {}

    # --- title -------------------------------------------------------------
    want_title = target.get("title")
    if want_title:
        live = snippet.get("title", "")
        expect = target.get("expect_current_title", "")
        if live.strip() == want_title.strip():
            changes.append("title already up to date")
        elif expect and live.strip() != expect.strip():
            say(f"  SKIP {vid}: title drifted since this config was written.")
            say(f"      expected: {expect.strip()[:88]}")
            say(f"      live:     {live.strip()[:88]}")
            ERRORS.append(f"{vid}: title drifted, not overwritten")
            return 0
        else:
            planned["title"] = want_title
            changes.append(f"title {len(live.strip())} -> {len(want_title)} chars")

    # --- description -------------------------------------------------------
    want_desc = target.get("description")
    if want_desc:
        live = snippet.get("description", "")
        i = live.find(CROSSLINK_MARKER)
        body, tail = (live, "") if i == -1 else (live[:i].rstrip(), "\n\n" + live[i:])
        want_desc = want_desc.rstrip()
        expect = target.get("expect_description_contains", "")
        if body == want_desc:
            changes.append("description already up to date")
        elif expect and expect not in live:
            say(f"  SKIP {vid}: description drifted — sentinel not present.")
            say(f"      looked for: {expect[:88]}")
            ERRORS.append(f"{vid}: description drifted, not overwritten")
            return 0
        else:
            planned["description"] = want_desc + tail
            changes.append(f"description {len(body)} -> {len(want_desc)} chars"
                           + (" (WATCH NEXT block preserved)" if tail else ""))

    # --- tags --------------------------------------------------------------
    want_tags = target.get("tags")
    if want_tags:
        old = snippet.get("tags", [])
        merged = list(old) + [t for t in want_tags
                              if t.lower() not in {o.lower() for o in old}]
        new, used = fit(merged)
        dropped = len(merged) - len(new)
        if {t.lower() for t in new} == {t.lower() for t in old}:
            changes.append(f"tags already up to date ({len(old)})")
        else:
            planned["tags"] = new
            changes.append(f"tags {len(old)} -> {len(new)} ({used}/{TAG_BUDGET} chars"
                           + (f", {dropped} dropped under YouTube's 500-char cap"
                              if dropped else "") + ")")

    if not planned:
        say(f"  = {vid} ({privacy}) already up to date.")
        return 0

    say(f"  {vid} ({privacy}) — {target.get('_why', '')}")
    for c in changes:
        say(f"      {c}")
    if "title" in planned:
        say(f"      - {snippet.get('title', '').strip()[:108]}")
        say(f"      + {planned['title'][:108]}")
    for note in target.get("_changes", []):
        say(f"      . {note}")
    if dry_run:
        say("      [dry-run] not written")
        return 0

    snippet.update(planned)
    return write_snippet(token, vid, snippet, "+".join(planned))


def fix_channel_meta(token, dry_run):
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


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true",
                    help="show every change without writing anything")
    args = ap.parse_args()

    # A video listed in both set_packaging and set_tags would be written twice in
    # one run, and videos.list is read-after-write eventually consistent: the
    # second fetch can return the PRE-write snippet and put the old title and
    # description straight back. Catch it before authenticating — this is a
    # config error, and it costs nothing to fail on it early.
    both = ({t["video_id"] for t in CFG.get("set_packaging", [])}
            & {t["video_id"] for t in CFG.get("set_tags", [])})
    if both:
        sys.exit(f"Config error: {', '.join(sorted(both))} listed in BOTH "
                 f"set_packaging and set_tags. One write per video per run — "
                 f"move the tags into the set_packaging entry.")

    token = access_token()
    say("== Channel guard ==")
    assert_channel(token, read_only=args.dry_run)

    written = 0
    say("\n== Packaging (unsettled uploads: title+description+tags, one write) ==")
    for t in CFG.get("set_packaging", []):
        written += set_packaging(token, t, args.dry_run)

    say("\n== Tags (additive; no title or description text moves) ==")
    for t in CFG.get("set_tags", []):
        written += set_tags(token, t, args.dry_run)

    say("\n== Description repair (strict line deletion) ==")
    for t in CFG.get("description_edits", []):
        written += edit_description(token, t, args.dry_run)

    say("\n== Channel metadata ==")
    written += fix_channel_meta(token, args.dry_run)

    say(f"\n{written} change(s) written.")
    if args.dry_run:
        say("Dry run — nothing was written. Drop --dry-run to apply.")

    deferred = CFG.get("deferred", {}).get("items", [])
    if deferred:
        say(f"\nNot done by this script, by design ({len(deferred)}):")
        for d in deferred:
            say(f"  - {d}")

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
