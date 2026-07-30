#!/usr/bin/env python3
"""Point the channel's existing traffic at Episode 2, the moment it goes live.

  python promote_ep2.py            run everything below
  python promote_ep2.py --links    only rewrite the winning Shorts' descriptions
  python promote_ep2.py --comment  only post the seed comment on Episode 2

The channel's five 900+ view Shorts are its largest owned surface — far larger
than the subscriber base. Each one gets a funnel line at the TOP of its
description, where it is visible without tapping "more". The seed comment goes on
the episode itself to open the comment thread on the video's sharpest question.

Idempotent: a Short that already carries the funnel line is left untouched, so
this is safe to re-run.

Needs the same OAuth env vars as apply_fix.py (see SETUP.md).
"""
import json
import sys
from pathlib import Path

from apply_fix import yt_client

CONFIG = json.loads((Path(__file__).parent / "ep2.json").read_text())
VIDEO_ID = CONFIG.get("video_id", "").strip()
URL = f"https://youtu.be/{VIDEO_ID}"

# Every Short on the channel, not just the winners: long-form gets no Shorts-feed
# distribution at all, so the internal funnel is the only cold-start source it
# has. longform-fix.md put this first — "2 views is the expected outcome of
# publishing long-form into a Shorts-only channel with no internal funnel."
SHORTS = json.loads(
    (Path(__file__).parent / "longform.json").read_text()
)["shorts_video_ids"]

# Episode 1's promo already put a funnel line at the top of all of these. Two
# stacked links compete with each other, so the old line is REPLACED, not
# prepended to: Episode 2 is built on Part 8's topic, the channel's best Short at
# 1,214 views, while Episode 1 ran on its worst at 88.
OLD_FUNNEL_MARK = "youtu.be/7TWUwpbl83U"

FUNNEL = (
    "▶ FULL BREAKDOWN — the three halal mortgage structures, and the four "
    f"questions that tell you whether yours is real: {URL}"
)


def strip_old_funnel(desc: str) -> str:
    """Drop Episode 1's funnel line so the two don't compete at the top."""
    kept = [ln for ln in desc.split("\n") if OLD_FUNNEL_MARK not in ln]
    return "\n".join(kept).lstrip("\n")


def add_links(yt):
    if not VIDEO_ID:
        sys.exit("No video_id in ep2.json — set it after the upload, then re-run.")

    # videos().list takes up to 50 ids per call; the channel is well under that.
    items = yt.videos().list(part="snippet", id=",".join(SHORTS)).execute().get("items", [])
    found = {i["id"]: i for i in items}
    changed = 0

    for vid in SHORTS:
        item = found.get(vid)
        if not item:
            print(f"! {vid} not found — skipped")
            continue

        snippet = item["snippet"]
        desc = snippet.get("description", "")
        if URL in desc:
            print(f"= {vid} already links Episode 2 — left alone")
            continue

        snippet["description"] = f"{FUNNEL}\n\n{strip_old_funnel(desc)}".strip()
        yt.videos().update(part="snippet", body={"id": vid, "snippet": snippet}).execute()
        changed += 1
        print(f"+ {vid} now funnels to Episode 2")

    print(f"\n{changed} of {len(SHORTS)} Shorts updated.")
    print("Pin a comment with the same link on Part 8 (riQ7dLSnogo) — the API cannot pin,")
    print("and that video alone carries 1,214 views.")


def seed_comment(yt):
    if not VIDEO_ID:
        sys.exit("No video_id in ep2.json — set it after the upload, then re-run.")
    yt.commentThreads().insert(
        part="snippet",
        body={"snippet": {
            "videoId": VIDEO_ID,
            "topLevelComment": {"snippet": {"textOriginal": CONFIG["engagement_comment"]}},
        }},
    ).execute()
    print(f"Seed comment posted on {URL}")
    print("Pin it in Studio (Comments → ⋮ → Pin) — the API cannot pin.")


if __name__ == "__main__":
    yt = yt_client()
    arg = sys.argv[1] if len(sys.argv) > 1 else ""
    if arg == "--links":
        add_links(yt)
    elif arg == "--comment":
        seed_comment(yt)
    else:
        add_links(yt)
        seed_comment(yt)
