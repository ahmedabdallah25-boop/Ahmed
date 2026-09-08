#!/usr/bin/env python3
"""Re-space HELD BY FAITH's scheduled (private + publishAt) uploads.

The queue was built one-per-day. This walks it in schedule order, leaves the
NEXT one exactly where it is, and moves every later one to a fixed gap after
its predecessor (default 7 hours).

  python heldbyfaith_reschedule.py --dry-run        preview
  python heldbyfaith_reschedule.py                  write
  python heldbyfaith_reschedule.py --gap-hours 7 --anchor 2026-09-09T18:00:00Z

Channel 2 only: HBF_CLIENT_ID / HBF_CLIENT_SECRET / HBF_REFRESH_TOKEN, and it
aborts before any write unless the token owns UCh0tKIGR5Ns3Wvoai__txdg.
"""
import argparse
import datetime as dt
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

EXPECT = "UCh0tKIGR5Ns3Wvoai__txdg"
SECRETS = ("HBF_CLIENT_ID", "HBF_CLIENT_SECRET", "HBF_REFRESH_TOKEN")
API = "https://www.googleapis.com/youtube/v3"
OUT = []


def say(line=""):
    print(line)
    OUT.append(line)


def summarize():
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    if path:
        with open(path, "a") as f:
            f.write("```\n" + "\n".join(OUT) + "\n```\n")


def access_token():
    missing = [k for k in SECRETS if not os.environ.get(k)]
    if missing:
        sys.exit(f"Missing: {', '.join(missing)}. Run \"HELD BY FAITH - 1. Check setup\".")
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
        sys.exit(f"Google rejected HBF_REFRESH_TOKEN: {err}. "
                 f"Run \"HELD BY FAITH - 1. Check setup\".")


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


def assert_channel(token, read_only):
    items = call(token, "GET", "channels",
                 {"part": "snippet,contentDetails", "mine": "true"}).get("items", [])
    if not items:
        sys.exit("Authenticated, but the token owns no channel. Check HBF_REFRESH_TOKEN.")
    ch = items[0]
    say(f"  authenticated as: {ch['snippet'].get('title', '?')} ({ch['id']})")
    if ch["id"] != EXPECT:
        msg = (f"CHANNEL MISMATCH: this script only reschedules {EXPECT} "
               f"(HELD BY FAITH), token owns {ch['id']}.")
        if read_only:
            say(f"  ! {msg}\n  ! Dry run, continuing. Nothing will be written.")
        else:
            sys.exit(f"\n{msg}\nRefusing to write. Re-mint HBF_REFRESH_TOKEN with "
                     f"automation/authorize.html and pick the right channel.")
    return ch["contentDetails"]["relatedPlaylists"]["uploads"]


def iso(t):
    return t.strftime("%Y-%m-%dT%H:%M:%SZ")


def parse(s):
    return dt.datetime.strptime(s.replace(".000Z", "Z"), "%Y-%m-%dT%H:%M:%SZ").replace(
        tzinfo=dt.timezone.utc)


def dur_secs(s):
    m = re.fullmatch(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", s or "")
    if not m:
        return 0
    h, mi, se = (int(x) if x else 0 for x in m.groups())
    return h * 3600 + mi * 60 + se


def scheduled(token, uploads):
    """Every owned upload still private with a future publishAt, in queue order."""
    ids, page = [], None
    while True:
        r = call(token, "GET", "playlistItems", {
            "part": "contentDetails", "playlistId": uploads,
            "maxResults": 50, **({"pageToken": page} if page else {})})
        ids += [i["contentDetails"]["videoId"] for i in r.get("items", [])]
        page = r.get("nextPageToken")
        if not page:
            break
    now = dt.datetime.now(dt.timezone.utc)
    out = []
    for i in range(0, len(ids), 50):
        for v in call(token, "GET", "videos", {
                "part": "snippet,status,contentDetails",
                "id": ",".join(ids[i:i + 50])}).get("items", []):
            st = v["status"]
            if st.get("privacyStatus") != "private" or not st.get("publishAt"):
                continue
            when = parse(st["publishAt"])
            if when <= now:
                continue
            out.append({"id": v["id"], "title": v["snippet"]["title"], "at": when,
                        "status": st,
                        "secs": dur_secs(v["contentDetails"].get("duration"))})
    out.sort(key=lambda v: v["at"])
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="preview, write nothing")
    ap.add_argument("--gap-hours", type=float, default=7.0,
                    help="hours between consecutive releases (default 7)")
    ap.add_argument("--anchor",
                    help="ISO time (…Z) for the FIRST upcoming video; "
                         "default is to leave it exactly where it is")
    args = ap.parse_args()

    say("HELD BY FAITH — reschedule queue"
        f" ({'DRY RUN' if args.dry_run else 'WRITING'}, gap {args.gap_hours}h)")
    token = access_token()
    uploads = assert_channel(token, args.dry_run)
    q = scheduled(token, uploads)
    if not q:
        say("  no upcoming scheduled uploads — nothing to do.")
        return summarize()

    base = parse(args.anchor) if args.anchor else q[0]["at"]
    gap = dt.timedelta(hours=args.gap_hours)
    say(f"  {len(q)} scheduled upload(s); anchor {iso(base)}")
    changed = 0
    for n, v in enumerate(q):
        want = base + n * gap
        tag = "SHORT" if v["secs"] <= 180 else f"LONG {v['secs']}s"
        if want == v["at"]:
            say(f"  = {v['id']} [{tag}] {iso(v['at'])}  {v['title'][:52]}")
            continue
        say(f"  ~ {v['id']} [{tag}] {iso(v['at'])} -> {iso(want)}  {v['title'][:52]}")
        changed += 1
        if args.dry_run:
            continue
        st = dict(v["status"])
        st["publishAt"] = iso(want)
        call(token, "PUT", "videos", {"part": "status"},
             {"id": v["id"], "status": {k: st[k] for k in (
                 "privacyStatus", "publishAt", "license", "embeddable",
                 "publicStatsViewable", "selfDeclaredMadeForKids") if k in st}})
    say(f"  {changed} moved, {len(q) - changed} already correct."
        + ("  Re-run without --dry-run to apply." if args.dry_run and changed else ""))
    summarize()


if __name__ == "__main__":
    main()
