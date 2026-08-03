#!/usr/bin/env python3
"""Validate an upload config before it touches YouTube.

  python preflight.py part16.json

Every check here exists because the thing it checks for actually went wrong, or
would silently degrade an upload that then costs a whole day of cadence to
retry. Exits non-zero on any ERROR so Actions stops before the upload step.
WARN never blocks - it is for judgement calls that are sometimes right.
"""
import json
import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

HERE = Path(__file__).parent
ROOT = HERE.parent

ERRORS, WARNINGS = [], []


def err(msg):
    ERRORS.append(msg)


def warn(msg):
    WARNINGS.append(msg)


def tag_cost(tag):
    return len(tag) + (2 if " " in tag else 0) + 1


def parse_ts(t):
    return datetime.fromisoformat(t.replace("Z", "+00:00"))


def sibling_publish_times(exclude, now):
    """Other configs still queued ahead of the feed.

    Only future publish_at values count. A config whose slot already passed says
    nothing about cadence - part13.json is pinned to 2026-07-18 and comparing
    against it once claimed an 18-day gap for a Short going out tomorrow.
    """
    out = []
    for p in sorted(HERE.glob("part*.json")):
        if p.name == exclude:
            continue
        try:
            d = json.loads(p.read_text())
        except json.JSONDecodeError:
            continue
        if not d.get("publish_at"):
            continue
        try:
            when = parse_ts(d["publish_at"])
        except ValueError:
            continue
        if when > now:
            out.append((when, p.name))
    return out


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: preflight.py <config.json>")
    name = sys.argv[1]
    path = HERE / name
    if not path.exists():
        sys.exit(f"ERROR: {path} does not exist.")
    try:
        cfg = json.loads(path.read_text())
    except json.JSONDecodeError as e:
        sys.exit(f"ERROR: {name} is not valid JSON: {e}")

    print(f"== preflight {name} ==")

    # --- assets: a missing file fails mid-upload or silently drops a thumbnail
    for key, required in (("file", True), ("thumbnail", False), ("caption_file", False)):
        rel = cfg.get(key, "")
        if not rel:
            (err if required else warn)(f"{key} not set")
            continue
        if not (ROOT / rel).exists():
            err(f"{key} points at {rel}, which does not exist")
        else:
            print(f"  ok  {key}: {rel}")

    # --- title: YouTube hard-caps at 100 chars
    title = cfg.get("title", "")
    if not title:
        err("title is empty")
    elif len(title) > 100:
        err(f"title is {len(title)} chars, over YouTube's 100-char cap")
    else:
        print(f"  ok  title: {len(title)} chars")

    # The English SERP for "riba" is contested by the Royal Institute of British
    # Architects; keep it in the description and script, not the title.
    if re.search(r"#?\briba\b", title, re.I):
        warn("title contains 'riba' — the English SERP is contested by the "
             "Royal Institute of British Architects. Use 'interest' or 'haram'.")

    # --- tags: exceeding 500 chars rejects the WHOLE update with invalidTags
    tags = cfg.get("tags") or cfg.get("add_tags") or []
    cost = sum(tag_cost(t) for t in tags)
    if cost > 500:
        err(f"tags total {cost} chars, over YouTube's 500-char cap "
            f"(the whole update is rejected with invalidTags)")
    elif cost > 450:
        warn(f"tags total {cost} chars — close to the 500 cap")
    else:
        print(f"  ok  tags: {len(tags)} tags, {cost} chars")

    # --- description: every winner carries 600-2,300 chars
    desc = cfg.get("description", "")
    if len(desc) < 300:
        warn(f"description is {len(desc)} chars; every 700+ view Short carries 600-2,300")
    else:
        print(f"  ok  description: {len(desc)} chars")

    # --- publish timing: this is the one that actually moved the numbers
    pub = cfg.get("publish_at")
    if not pub:
        warn("no publish_at — this uploads PUBLIC immediately, with no window "
             "to fix packaging before the feed tests it")
        return finish()

    try:
        when = parse_ts(pub)
    except ValueError:
        err(f"publish_at {pub!r} is not a valid RFC3339 timestamp")
        return finish()

    now = datetime.now(timezone.utc)
    if when <= now:
        err(f"publish_at {pub} is in the past — YouTube will not schedule it")
        return finish()
    print(f"  ok  publish_at: {pub} ({(when - now).total_seconds() / 3600:.1f}h out)")

    siblings = sibling_publish_times(name, now)
    for other, fname in siblings:
        gap_h = abs((when - other).total_seconds()) / 3600
        if gap_h < 12:
            err(f"publish_at is {gap_h:.1f}h from {fname} — two Shorts inside 12h "
                f"split one audience test. The 2026-08-02 pair did 227 and 43.")

    earlier = [t for t, _ in siblings if t < when]
    if earlier:
        gap_d = (when - max(earlier)).total_seconds() / 86400
        if gap_d > 1.5:
            warn(f"{gap_d:.1f}d gap after the previous queued Short. Every 700+ view "
                 f"Short sits inside a run of sub-1.5d gaps; the one 9.7d blackout "
                 f"produced 39 views.")
        else:
            print(f"  ok  cadence: {gap_d:.1f}d after the previous queued Short")
    else:
        # Uploads scheduled outside a partNN.json (Ep2 clips, anything queued
        # straight from reset.json) are invisible here, so silence is not proof
        # of a clean run-up. The authoritative view queries YouTube itself.
        print("  --  cadence: no other queued config to compare against; "
              "confirm with reset-packaging.yml (inventory: true)")

    return finish()


def finish():
    for w in WARNINGS:
        print(f"  WARN  {w}")
    if ERRORS:
        print(f"\n{len(ERRORS)} error(s) — not uploading:")
        for e in ERRORS:
            print(f"  - {e}")
        return 1
    print("\npreflight passed." + (f" {len(WARNINGS)} warning(s)." if WARNINGS else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
