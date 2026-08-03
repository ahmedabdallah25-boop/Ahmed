#!/usr/bin/env python3
"""Apply the 2026-08-03 packaging reset.

  python reset_packaging.py --dry-run   show every change without writing
  python reset_packaging.py --scheduled only the unpublished Short
  python reset_packaging.py             everything in reset.json

Two jobs, in priority order:

  1. The scheduled Shorts still sitting private are the only videos on this
     channel whose packaging can still be fixed BEFORE the feed decides on them.
     That is where nearly all the value is. Run --inventory to find them; a new
     upload can appear between passes and no public listing tool will show it.
  2. Published Shorts that failed get their titles moved back onto the formula
     that produced every 700+ view video. Expect little from this — measured on
     2026-08-03, P3DxNgGFah0 took exactly zero extra views in the six hours after
     its retitle. It is done because it costs nothing, not because it works.

Refuses to touch any id in reset.json's `protected` list.

Needs the same OAuth env vars as apply_fix.py (see SETUP.md).
"""
import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

from googleapiclient.errors import HttpError

from apply_fix import yt_client

# Any per-video failure lands here. main() exits non-zero if it is non-empty, so
# a partial run shows red in Actions instead of the green "success" that a caught
# HttpError used to produce.
ERRORS = []

HERE = Path(__file__).parent
CFG = json.loads((HERE / "reset.json").read_text())
PROTECTED = set(CFG["protected"]["video_ids"])
HELD = set(CFG.get("hold", {}).get("video_ids", []))
PLAYLIST_URL = CFG.get("playlist_url", "").strip()


def build_description(raw: str) -> str:
    """Substitute the series-playlist line, matching apply_fix.py's convention."""
    line = f"▶ Full series in order: {PLAYLIST_URL}\n" if PLAYLIST_URL else ""
    return raw.replace("{PLAYLIST_LINE}", line)


# YouTube caps the whole tags field at 500 characters and rejects the entire
# update with `invalidTags` if you exceed it — which is exactly what happened on
# P3DxNgGFah0 (20 existing tags + 5 new = over the cap). Budget conservatively:
# a tag containing a space is sent quoted, so it costs two extra characters.
TAG_BUDGET = 450


def tag_cost(tag: str) -> int:
    return len(tag) + (2 if " " in tag else 0) + 1  # +1 for the separator


def fit_tags(existing, additions):
    """Existing tags first (already indexed), then as many additions as fit."""
    kept, used = [], 0
    for tag in list(existing) + [t for t in additions if t not in existing]:
        cost = tag_cost(tag)
        if used + cost > TAG_BUDGET:
            continue
        kept.append(tag)
        used += cost
    return kept


def apply_target(yt, target, dry_run):
    """Push title/description/tags onto one video. Idempotent."""
    vid = target["video_id"]
    if vid in PROTECTED:
        print(f"  REFUSED {vid}: protected winner — not repackaging.")
        return False
    if vid in HELD:
        print(f"  HELD {vid}: published in the last ~36h and still inside its feed test.")
        return False

    try:
        items = yt.videos().list(part="snippet,status", id=vid).execute().get("items", [])
    except HttpError as e:
        print(f"  ERROR {vid}: {e}")
        ERRORS.append(f"{vid}: fetch failed: {e}")
        return False

    if not items:
        print(f"  SKIP {vid}: not found (deleted, or OAuth account is not the owner).")
        ERRORS.append(f"{vid}: not found")
        return False

    snippet = items[0]["snippet"]
    privacy = items[0].get("status", {}).get("privacyStatus", "?")
    old_title = snippet.get("title", "")

    new_title = target["title"]
    new_description = build_description(target["description"])
    old_tags = snippet.get("tags", [])
    new_tags = fit_tags(old_tags, target.get("add_tags", []))
    dropped = len(old_tags) + len([t for t in target.get("add_tags", []) if t not in old_tags]) - len(new_tags)

    unchanged = (
        old_title == new_title
        and snippet.get("description") == new_description
        and set(old_tags) == set(new_tags)
    )
    if unchanged:
        print(f"  = {vid} ({privacy}) already up to date.")
        return False

    print(f"  {vid} ({privacy})")
    print(f"      was: {old_title}")
    print(f"      now: {new_title}")
    print(f"      tags: {len(new_tags)} kept"
          + (f", {dropped} dropped to stay under YouTube's 500-char cap" if dropped > 0 else ""))

    if dry_run:
        print("      [dry-run] not written")
        return False

    # Mutate the fetched snippet so categoryId / defaultLanguage survive the update.
    snippet["title"] = new_title
    snippet["description"] = new_description
    snippet["tags"] = new_tags
    try:
        yt.videos().update(part="snippet", body={"id": vid, "snippet": snippet}).execute()
    except HttpError as e:
        print(f"      ERROR writing: {e}")
        ERRORS.append(f"{vid}: write failed: {e}")
        return False
    print("      written")
    return True


def inventory(yt):
    """List every owned video, flagging the ones no config line covers.

    Step 3 of the channel pass — "find anything not yet feed-tested" — used to be
    inferred from the owned-video count moving, which only says that *something*
    appeared, not what. A private or scheduled upload is the highest-leverage
    object on the channel (its packaging can still be fixed before the feed tests
    it), so it needs naming, not counting. Read-only.
    """
    managed = {t["video_id"] for t in CFG["scheduled"]}
    managed |= {t["video_id"] for t in CFG["repackage"]}
    managed |= PROTECTED | HELD

    ids = owned_video_ids(yt)
    rows, unmanaged, shorts = [], [], []
    for start in range(0, len(ids), 50):
        batch = ids[start:start + 50]
        items = yt.videos().list(
            part="snippet,status,contentDetails", id=",".join(batch)).execute().get("items", [])
        for item in items:
            status = item.get("status", {})
            privacy = status.get("privacyStatus", "?")
            # publishAt is only set on a private video with a scheduled release.
            when = status.get("publishAt") or item["snippet"].get("publishedAt", "")
            rows.append((when, privacy, item["id"], item["snippet"].get("title", "")))
            if iso8601_seconds(item["contentDetails"].get("duration", "")) <= 180:
                shorts.append((when, item["id"]))
            if privacy != "public" and item["id"] not in managed:
                unmanaged.append((when, privacy, item["id"], item["snippet"].get("title", "")))

    print(f"  {len(rows)} owned videos\n")
    for when, privacy, vid, title in sorted(rows, reverse=True):
        mark = " " if vid in managed else "!"
        print(f"  {mark} {when:<26} {privacy:<8} {vid}  {title[:64]}")

    if unmanaged:
        print(f"\n  {len(unmanaged)} NOT-YET-FEED-TESTED and absent from reset.json:")
        for when, privacy, vid, title in sorted(unmanaged, reverse=True):
            print(f"    {vid} ({privacy}, {when}) {title}")
        print("  Package these before they publish — that is the whole window.")
    else:
        print("\n  Every non-public video is covered by reset.json.")

    cadence(shorts)
    return unmanaged


def iso8601_seconds(dur: str) -> int:
    """PT1M40S -> 100. Anything unparseable counts as long-form."""
    m = re.fullmatch(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", dur or "")
    if not m:
        return 10 ** 6
    h, mi, s = (int(g or 0) for g in m.groups())
    return h * 3600 + mi * 60 + s


# The Shorts feed rewards an unbroken daily cadence and withdraws distribution when
# a channel goes dark. Measured on this channel 2026-08-03: every 700+ view Short
# sits inside a run of sub-1.5-day gaps, the first Short after a 9.7-day blackout
# did 39 views, and the recovery upload two days later did 227. Two Shorts inside
# the same 12 hours split one audience test — the second of the 2026-08-02 pair
# took 43 against the first's 227.
MAX_GAP_DAYS = 1.5
MIN_GAP_HOURS = 12
MIN_QUEUE_DAYS = 3


def cadence(shorts):
    """Report Shorts upload rhythm — blackouts behind, and a drying queue ahead."""
    if not shorts:
        return
    seq = sorted(shorts)
    now = datetime.now(timezone.utc)
    print("\n== Shorts cadence ==")

    problems = []
    for (t0, a), (t1, b) in zip(seq, seq[1:]):
        gap = (parse_ts(t1) - parse_ts(t0)).total_seconds()
        if gap / 86400 > MAX_GAP_DAYS:
            problems.append(f"BLACKOUT {gap / 86400:.1f}d before {b} ({t1[:10]})")
        elif gap / 3600 < MIN_GAP_HOURS:
            problems.append(f"DOUBLE {gap / 3600:.1f}h between {a} and {b} ({t1[:10]})")

    for p in problems[-6:]:
        print(f"  {p}")

    published = [t for t, _ in seq if parse_ts(t) <= now]
    queued = [t for t, _ in seq if parse_ts(t) > now]
    if published:
        since = (now - parse_ts(published[-1])).total_seconds() / 86400
        print(f"  last published {since:.1f}d ago")
    if queued:
        runway = (parse_ts(queued[-1]) - now).total_seconds() / 86400
        print(f"  {len(queued)} queued, runway {runway:.1f}d")
        if runway < MIN_QUEUE_DAYS:
            print(f"  ! QUEUE DRIES UP in {runway:.1f}d — the next blackout starts there.")
    else:
        print("  ! NOTHING QUEUED — the channel is dark from now on.")
    return problems


def parse_ts(t: str):
    return datetime.fromisoformat(t.replace("Z", "+00:00"))


def fix_channel_meta(yt, dry_run):
    """Set channel-level keywords. Fetch-then-mutate so other branding survives."""
    cfg = CFG.get("channel")
    if not cfg:
        return 0
    want = " ".join(f'"{k}"' if " " in k else k for k in cfg.get("keywords", []))

    items = yt.channels().list(part="brandingSettings", mine=True).execute().get("items", [])
    if not items:
        ERRORS.append("channel: not found")
        return 0
    branding = items[0]["brandingSettings"]
    have = branding.get("channel", {}).get("keywords", "")
    have_country = branding.get("channel", {}).get("country", "")
    want_country = cfg.get("country", have_country)

    changes = []
    if want and have != want:
        changes.append(f"keywords: {len(have)} chars -> {len(want)} chars")
    if want_country != have_country:
        changes.append(f"country: {have_country or '(unset)'} -> {want_country}")
    if not changes:
        print("  = channel metadata already up to date.")
        return 0

    for c in changes:
        print(f"  channel {c}")
    if dry_run:
        print("      [dry-run] not written")
        return 0
    if want:
        branding.setdefault("channel", {})["keywords"] = want
    branding.setdefault("channel", {})["country"] = want_country
    try:
        yt.channels().update(part="brandingSettings",
                             body={"id": items[0]["id"], "brandingSettings": branding}).execute()
    except HttpError as e:
        print(f"      ERROR writing: {e}")
        ERRORS.append(f"channel keywords: {e}")
        return 0
    print("      written")
    return 1


def owned_video_ids(yt):
    """Every video id on the authenticated channel, via the uploads playlist."""
    chans = yt.channels().list(part="contentDetails", mine=True).execute().get("items", [])
    if not chans:
        return []
    uploads = chans[0]["contentDetails"]["relatedPlaylists"]["uploads"]
    ids, page = [], None
    while True:
        resp = yt.playlistItems().list(
            part="contentDetails", playlistId=uploads, maxResults=50, pageToken=page
        ).execute()
        ids += [i["contentDetails"]["videoId"] for i in resp.get("items", [])]
        page = resp.get("nextPageToken")
        if not page:
            return ids


def fix_links(yt, dry_run):
    """Replace stale video ids wherever they appear in this channel's descriptions."""
    replacements = CFG.get("link_fixes", {}).get("replacements", [])
    if not replacements:
        return 0

    ids = owned_video_ids(yt)
    print(f"  scanning {len(ids)} owned videos")
    written = 0

    for start in range(0, len(ids), 50):
        batch = ids[start:start + 50]
        items = yt.videos().list(part="snippet", id=",".join(batch)).execute().get("items", [])
        for item in items:
            vid, snippet = item["id"], item["snippet"]
            desc = snippet.get("description", "")
            new_desc = desc
            hits = []
            for rep in replacements:
                if rep["from"] in new_desc:
                    hits.append(f"{rep['from']} -> {rep['to']}")
                    new_desc = new_desc.replace(rep["from"], rep["to"])
            if not hits:
                continue

            print(f"  {vid}: {', '.join(hits)}")
            if dry_run:
                print("      [dry-run] not written")
                continue
            snippet["description"] = new_desc
            try:
                yt.videos().update(part="snippet",
                                   body={"id": vid, "snippet": snippet}).execute()
            except HttpError as e:
                print(f"      ERROR writing: {e}")
                ERRORS.append(f"{vid}: link fix failed: {e}")
                continue
            print("      written")
            written += 1

    if not written and not dry_run:
        print("  no stale links found — nothing to do.")
    return written


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="show changes without writing")
    ap.add_argument("--scheduled", action="store_true",
                    help="only fix the unpublished Short")
    ap.add_argument("--inventory", action="store_true",
                    help="list every owned video and flag unmanaged private/scheduled ones")
    args = ap.parse_args()

    yt = yt_client()

    if args.inventory:
        print("\n== Owned video inventory ==")
        inventory(yt)
        return 0

    written = 0

    print("\n== Scheduled Shorts (fix before they publish) ==")
    for target in CFG["scheduled"]:
        written += apply_target(yt, target, args.dry_run)

    if not args.scheduled:
        print("\n== Published Shorts that underperformed ==")
        for target in CFG["repackage"]:
            written += apply_target(yt, target, args.dry_run)

        held = CFG.get("hold", {}).get("video_ids", [])
        if held:
            print(f"\n== Held (too new to judge) ==\n  {', '.join(held)}")

        print("\n== Stale link hygiene ==")
        written += fix_links(yt, args.dry_run)

        print("\n== Channel metadata ==")
        written += fix_channel_meta(yt, args.dry_run)

    print(f"\n{written} video(s) updated.")
    if args.dry_run:
        print("Dry run — nothing was written.")

    if ERRORS:
        print(f"\n{len(ERRORS)} failure(s) — this run is NOT complete:")
        for err in ERRORS:
            print(f"  - {err}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
