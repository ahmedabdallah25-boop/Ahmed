#!/usr/bin/env python3
"""Fail if authorize.html's inlined channel map has drifted from channels.json.

    python automation/test_channels_sync.py

channels.json is the single source of truth, and every Python entry point reads
it. authorize.html cannot: it runs from file://, where fetching a sibling JSON is
blocked by the browser, so it inlines its own copy. That duplication is the whole
reason this test exists.

Drift here is not cosmetic. If the page's map is missing a channel, it refuses to
print a perfectly good token for it ("not a channel this repo manages"). If it
carries the wrong secret names, it tells you to store a token under a name no
workflow reads, and the automation stays silently dead.
"""
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent


def from_registry():
    reg = json.loads((HERE / "channels.json").read_text())["channels"]
    return {c["channel_id"]: (f"{c['name']} ({c['handle']})", list(c["secrets"]))
            for c in reg.values()}


def from_html():
    html = (HERE / "authorize.html").read_text()
    block = re.search(r"const CHANNELS = \{(.*?)\n\};", html, re.S)
    if not block:
        sys.exit("FAIL: could not find the CHANNELS literal in authorize.html")
    out = {}
    for m in re.finditer(
            r'"(UC[\w-]+)":\s*\{\s*name:\s*"([^"]+)",\s*secrets:\s*\[([^\]]+)\]',
            block.group(1)):
        cid, name, secrets = m.groups()
        out[cid] = (name, [s.strip().strip('"') for s in secrets.split(",") if s.strip()])
    return out


def main():
    reg, html = from_registry(), from_html()
    problems = []

    for cid in reg.keys() - html.keys():
        problems.append(f"{cid} ({reg[cid][0]}) is in channels.json but NOT in authorize.html")
    for cid in html.keys() - reg.keys():
        problems.append(f"{cid} ({html[cid][0]}) is in authorize.html but NOT in channels.json")
    for cid in reg.keys() & html.keys():
        if reg[cid][0] != html[cid][0]:
            problems.append(f"{cid} name differs: {reg[cid][0]!r} vs {html[cid][0]!r}")
        if reg[cid][1] != html[cid][1]:
            problems.append(f"{cid} secrets differ: {reg[cid][1]} vs {html[cid][1]}")

    if problems:
        print(f"FAIL: authorize.html has drifted from channels.json ({len(problems)} issue(s)):")
        for p in problems:
            print(f"  - {p}")
        return 1

    print(f"OK: {len(reg)} channel(s) match between channels.json and authorize.html")
    for cid, (name, secrets) in sorted(reg.items(), key=lambda kv: kv[1][0]):
        print(f"  {cid}  {name}")
        print(f"      {', '.join(secrets)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
