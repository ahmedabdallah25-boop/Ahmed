#!/usr/bin/env python3
"""Push Part 14's reach using the channel's own surfaces.

  python promote_part14.py             run everything below
  python promote_part14.py --playlist  only fix/verify the playlist and add Part 14
  python promote_part14.py --comments  only seed comments on the top Shorts
  python promote_part14.py --stats     only report Part 14's current numbers

WHAT THIS DELIBERATELY DOES NOT DO
----------------------------------
It does not touch the Shorts' descriptions. All 13 already carry the Episode 2
funnel line at the top, and promote_ep2.py is right that two stacked links
compete. That slot should stay with the long-form: long-form gets no Shorts-feed
distribution at all, so the internal funnel is its only cold-start source, while
a Short is fed by the algorithm for free. Moving the funnel from the thing that
needs it to the thing that does not would lose more than it gains.

So this uses the surfaces that are currently empty instead:

  1. The series playlist. longform.json's playlist_id is blank and the configured
     PLKLKzR1QgFHE 404s, which means every "full series" link on the channel is
     dead. Re-resolving it by title fixes that channel-wide, and Part 14 gets
     added to it — playlists feed the suggested rail and keep a binge going.
  2. The comment sections of the five 900+ view Shorts. Those videos still take
     impressions daily and their comment threads carry nothing from the channel.
     A creator comment there is a real surface and competes with nothing.

Comments are tailored per video where the topic actually connects — Part 3 is
the earlier inflation Short and Part 4 is the sound-money one, so for those two
the comment is a genuine follow-up rather than a link drop. Idempotent: a video
that already carries the link is skipped, so this is safe to re-run.

Needs the same OAuth env vars as apply_fix.py (see SETUP.md).
"""
import json
import sys
from pathlib import Path

from googleapiclient.errors import HttpError

from apply_fix import yt_client

HERE = Path(__file__).parent
CFG = json.loads((HERE / "part14.json").read_text())
LONGFORM_PATH = HERE / "longform.json"
LF = json.loads(LONGFORM_PATH.read_text())

VIDEO_ID = CFG.get("video_id", "").strip()
URL = f"https://youtube.com/shorts/{VIDEO_ID}"

# The five 900+ view Shorts, largest owned surface on the channel. The first two
# are topically continuous with Part 14, so they get their own copy.
SEED_TARGETS = {
    "a7xkXgTfCXs": (  # Part 3 — Inflation, the tax you never voted for (~1,000)
        "If you want the actual mechanism behind this one: money isn't printed, "
        "it's lent into existence — a bank approves a loan and the money simply "
        f"appears. Full 100-second breakdown here: {URL}"
    ),
    "zY664YZPI6U": (  # Part 4 — Sound money (903)
        "Just posted the other half of this: where the value goes in the first "
        "place, and why you cannot type gold into existence — it has to be dug, "
        f"weighed, earned. {URL}"
    ),
    "riQ7dLSnogo": (  # Part 8 — Halal mortgage (1,214, best performer)
        "Same machine, one level up: the interest on this mortgage is also what "
        f"quietly shrinks every pound you save. How that works: {URL}"
    ),
    "OXIP3EJROQk": (  # Part 10 — Banks drain your savings (949)
        "The other half of why your savings shrink — it isn't only the rate "
        f"they pay you, it's how many new pounds get created alongside yours: {URL}"
    ),
    "J0TCD2u177k": (  # Part 9 — Sukuk / passive income (~1,000)
        "Worth pairing with this one: any yield has to beat the rate your money "
        f"is being diluted at. Here's the mechanism doing the diluting: {URL}"
    ),
}


def _require_video():
    if not VIDEO_ID:
        sys.exit("No video_id in part14.json — set it after the upload, then re-run.")


# ── 1. playlist ──────────────────────────────────────────────────────────────
def resolve_playlist(yt):
    """Find the series playlist; re-resolve by title if the configured id is dead.

    Legacy playlist IDs are only 13 characters (PL + 11), which is valid — never
    judge an ID by its length. Validity is confirmed by an API lookup.
    """
    configured = LF.get("playlist_url", "").strip()
    if configured:
        pid = configured.split("list=")[-1]
        if yt.playlists().list(part="id", id=pid).execute().get("items"):
            print(f"  playlist: {pid} (from config, verified)")
            return pid
        print(f"  ! configured playlist {pid} does not exist — re-resolving")

    match = (LF.get("playlist_title_match") or "").lower()
    req = yt.playlists().list(part="snippet", mine=True, maxResults=50)
    exact, first = None, None
    while req is not None and exact is None:
        resp = req.execute()
        for pl in resp.get("items", []):
            first = first or pl
            if match and match in pl["snippet"]["title"].lower():
                exact = pl
                break
        req = yt.playlists().list_next(req, resp)

    found = exact or first
    if not found:
        print("  ! no playlist on the channel — create the series playlist first")
        return None

    pid = found["id"]
    print(f"  playlist resolved: {found['snippet']['title']} -> {pid}")
    LF["playlist_url"] = f"https://www.youtube.com/playlist?list={pid}"
    LF["playlist_id"] = pid
    LONGFORM_PATH.write_text(json.dumps(LF, indent=2, ensure_ascii=False) + "\n")
    print("  written back to longform.json — every 'full series' link now resolves")
    return pid


def add_to_playlist(yt):
    _require_video()
    pid = resolve_playlist(yt)
    if not pid:
        return

    existing = set()
    req = yt.playlistItems().list(part="contentDetails", playlistId=pid, maxResults=50)
    while req is not None:
        resp = req.execute()
        for it in resp.get("items", []):
            existing.add(it["contentDetails"]["videoId"])
        req = yt.playlistItems().list_next(req, resp)

    if VIDEO_ID in existing:
        print(f"= Part 14 already in the playlist ({len(existing)} videos) — left alone")
        return
    try:
        yt.playlistItems().insert(
            part="snippet",
            body={"snippet": {
                "playlistId": pid,
                "resourceId": {"kind": "youtube#video", "videoId": VIDEO_ID},
            }},
        ).execute()
        print(f"+ Part 14 added to the playlist ({len(existing) + 1} videos)")
    except HttpError as e:
        print(f"! playlist add failed ({e.status_code})")


# ── 2. seed comments on the winners ──────────────────────────────────────────
def already_commented(yt, vid) -> bool:
    """True if a comment on this video already carries the Part 14 link."""
    try:
        resp = yt.commentThreads().list(
            part="snippet", videoId=vid, maxResults=100, textFormat="plainText",
        ).execute()
    except HttpError as e:
        print(f"  ! could not read comments on {vid} ({e.status_code}) — skipping to be safe")
        return True
    for t in resp.get("items", []):
        if VIDEO_ID in t["snippet"]["topLevelComment"]["snippet"]["textOriginal"]:
            return True
    return False


def seed_comments(yt):
    _require_video()
    posted = 0
    for vid, text in SEED_TARGETS.items():
        if already_commented(yt, vid):
            print(f"= {vid} already links Part 14 — left alone")
            continue
        try:
            yt.commentThreads().insert(
                part="snippet",
                body={"snippet": {
                    "videoId": vid,
                    "topLevelComment": {"snippet": {"textOriginal": text}},
                }},
            ).execute()
            posted += 1
            print(f"+ {vid} seeded")
        except HttpError as e:
            print(f"! {vid} comment failed ({e.status_code})")
    print(f"\n{posted} of {len(SEED_TARGETS)} winners seeded.")
    if posted:
        print("Pin each one in Studio (Comments → ⋮ → Pin) — the API cannot pin,")
        print("and an unpinned creator comment sinks as the thread grows.")


# ── 3. stats ─────────────────────────────────────────────────────────────────
def stats(yt):
    _require_video()
    items = yt.videos().list(part="statistics,status", id=VIDEO_ID).execute().get("items", [])
    if not items:
        print("! Part 14 not found")
        return
    s = items[0]["statistics"]
    st = items[0]["status"]
    views = int(s.get("viewCount", 0))
    rule = CFG.get("decision_rule", {})
    print(f"Part 14 — {URL}")
    print(f"  privacy   {st.get('privacyStatus')}")
    print(f"  views     {views}")
    print(f"  likes     {s.get('likeCount', 'hidden')}")
    print(f"  comments  {s.get('commentCount', 0)}")
    if rule:
        print(f"  rule      pass >= {rule.get('pass_views')} / dead <= {rule.get('dead_views')} "
              f"at {rule.get('decision_hours')}h")


if __name__ == "__main__":
    yt = yt_client()
    arg = sys.argv[1] if len(sys.argv) > 1 else ""
    if arg == "--playlist":
        add_to_playlist(yt)
    elif arg == "--comments":
        seed_comments(yt)
    elif arg == "--stats":
        stats(yt)
    else:
        print("── playlist ──")
        add_to_playlist(yt)
        print("\n── seed comments ──")
        seed_comments(yt)
        print("\n── stats ──")
        stats(yt)
