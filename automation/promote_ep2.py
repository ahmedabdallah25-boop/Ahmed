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

# The five Shorts that broke 900 views — the study's proven surfaces.
WINNERS = {
    "riQ7dLSnogo": "Part 8 — How to buy a house without interest (1,214 views)",
    "a7xkXgTfCXs": "Part 3 — Inflation, the tax you never voted for (~1,000)",
    "J0TCD2u177k": "Part 9 — Passive income without interest (~1,000)",
    "OXIP3EJROQk": "Part 10 — How banks quietly trap your savings (949)",
    "zY664YZPI6U": "Part 4 — Protect your savings from inflation (903)",
}

FUNNEL = (
    "▶ FULL BREAKDOWN — the three halal mortgage structures, and the four "
    f"questions that tell you whether yours is real: {URL}"
)


def add_links(yt):
    if not VIDEO_ID:
        sys.exit("No video_id in ep2.json — set it after the upload, then re-run.")

    ids = list(WINNERS)
    items = yt.videos().list(part="snippet", id=",".join(ids)).execute().get("items", [])
    found = {i["id"]: i for i in items}

    for vid, label in WINNERS.items():
        item = found.get(vid)
        if not item:
            print(f"! {vid} not found ({label}) — skipped")
            continue

        snippet = item["snippet"]
        desc = snippet.get("description", "")
        if URL in desc:
            print(f"= {vid} already links Episode 2 — left alone")
            continue

        snippet["description"] = f"{FUNNEL}\n\n{desc}".strip()
        yt.videos().update(part="snippet", body={"id": vid, "snippet": snippet}).execute()
        print(f"+ {vid} now funnels to Episode 2 ({label})")


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
