#!/usr/bin/env python3
"""Fail if the WATCH NEXT marker has drifted between the two places that own it.

    python automation/test_clarity_marker_sync.py

clarity_crosslinks.py reads the marker from clarity/playlists.json. clarity_
packaging.py cannot: it reads a different config file (packaging-fix.json) and
has no reason to load the playlist one, so it carries its own copy as a constant.
That duplication is the whole reason this test exists.

Drift here is silent and destructive rather than noisy. set_packaging splits a
live description at this marker, keeps everything before it as the body, and
carries everything from it onward across untouched. If its copy of the marker
stops matching the one crosslinks actually writes, the split finds nothing, the
whole description reads as body, and the next packaging write replaces the
description INCLUDING the cross-link block — silently deleting links that a
crosslinks run installed, on every video it touches.
"""
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent


def from_playlists():
    return json.loads((ROOT / "clarity" / "playlists.json").read_text())["crosslink_marker"]


def from_packaging():
    src = (HERE / "clarity_packaging.py").read_text()
    m = re.search(r'^CROSSLINK_MARKER\s*=\s*(".*?"|\'.*?\')\s*$', src, re.M)
    if not m:
        sys.exit("FAIL: no CROSSLINK_MARKER constant found in clarity_packaging.py")
    return json.loads(m.group(1).replace("'", '"'))


def main():
    want, got = from_playlists(), from_packaging()
    if want == got:
        print(f"OK: WATCH NEXT marker in sync ({want!r})")
        return 0
    print("FAIL: WATCH NEXT marker has drifted.")
    print(f"  clarity/playlists.json     : {want!r}")
    print(f"  clarity_packaging.py       : {got!r}")
    print("\nA packaging write would not recognise the cross-link block and would")
    print("overwrite it. Make the constant match the config, then re-run.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
