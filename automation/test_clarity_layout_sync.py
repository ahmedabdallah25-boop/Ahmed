#!/usr/bin/env python3
"""Fail if clarity/layout.json disagrees with the rest of the channel 3 config.

    python automation/test_clarity_layout_sync.py

Three checks, each guarding a failure that is quiet rather than loud.

  1. Every section names a playlist that clarity/playlists.json actually
     defines. clarity_layout.py resolves playlists by TITLE against the live
     channel, which is right — hard-coded PL ids rot the moment a list is
     rebuilt — but it means a typo or a rename does not raise anything. It logs
     "no live playlist titled ..." and moves on, and the shelf is simply never
     created. Nobody re-reads a green run's log.

  2. Every playlist has a shelf. A list that exists but has no section is
     invisible on the channel home page, which is the entire problem the layout
     work is meant to fix. New playlist, forgotten shelf, no error anywhere.

  3. The trailer is not one of the protected ids... it is ALLOWED to be, and
     currently is. This check instead asserts the trailer is a real id in the
     shape YouTube uses, and that layout.json targets the same channel as
     packaging-fix.json. Two configs naming two different channels is the one
     mistake the runtime guard cannot catch, because each file would pass its
     own check.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LAYOUT = json.loads((ROOT / "clarity" / "layout.json").read_text())
PLAYLISTS = json.loads((ROOT / "clarity" / "playlists.json").read_text())
PACKAGING = json.loads((ROOT / "clarity" / "packaging-fix.json").read_text())

VIDEO_ID = re.compile(r"^[A-Za-z0-9_-]{11}$")


def main():
    fails = []

    defined = {p["title"].strip() for p in PLAYLISTS["playlists"]}
    shelved = [s["playlist_title"].strip() for s in LAYOUT.get("sections", [])]

    unknown = [t for t in shelved if t not in defined]
    if unknown:
        fails.append("layout.json names playlists that playlists.json does not define:\n"
                     + "".join(f"    {t!r}\n" for t in unknown)
                     + "  The shelf would silently never be created.")

    missing = sorted(defined - set(shelved))
    if missing:
        fails.append("playlists with no section shelf:\n"
                     + "".join(f"    {t!r}\n" for t in missing)
                     + "  The list exists but is invisible on the channel home page.")

    dupes = sorted({t for t in shelved if shelved.count(t) > 1})
    if dupes:
        fails.append("the same playlist is shelved twice:\n"
                     + "".join(f"    {t!r}\n" for t in dupes))

    trailer = (LAYOUT.get("unsubscribed_trailer") or {}).get("video_id", "")
    if not VIDEO_ID.match(trailer or ""):
        fails.append(f"unsubscribed_trailer.video_id is not a video id: {trailer!r}")

    if LAYOUT["expect_channel_id"] != PACKAGING["expect_channel_id"]:
        fails.append("expect_channel_id differs between the two channel 3 configs:\n"
                     f"    layout.json        : {LAYOUT['expect_channel_id']}\n"
                     f"    packaging-fix.json : {PACKAGING['expect_channel_id']}\n"
                     "  Each file would pass its own runtime guard.")

    if fails:
        print("FAIL: clarity/layout.json is out of sync.\n")
        for f in fails:
            print("  " + f)
        return 1

    print(f"OK: layout in sync — {len(shelved)} shelf/shelves covering "
          f"{len(defined)} playlist(s), trailer {trailer}")
    for i, t in enumerate(shelved):
        print(f"  {i}. {t}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
