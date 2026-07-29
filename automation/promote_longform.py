#!/usr/bin/env python3
"""Fix and promote the channel's only long-form video (see ../longform-fix.md).

Steps, all idempotent — re-running changes nothing that is already correct:

  1. verify the configured series playlist still exists, re-resolving it from the
     channel (by title) and writing it back to longform.json if it ever breaks
  2. repackage the long-form: viewer-first title, description, tags
  3. inject the long-form funnel link into every Short's description  <- the fix that matters
  4. add the long-form to the series playlist
  5. post the seed/engagement comment once
  6. report views against the 7-day decision rule

Needs the channel owner's OAuth credentials (see SETUP.md):
  YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN
"""
import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

from apply_fix import yt_client

HERE = Path(__file__).parent
LONGFORM_PATH = HERE / "longform.json"
CFG = json.loads(LONGFORM_PATH.read_text())
VIDEO_ID = CFG["video_id"]
DRY = False


def save(path: Path, data: dict) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")


def get_snippet(yt, video_id: str):
    items = yt.videos().list(part="snippet", id=video_id).execute().get("items", [])
    return items[0]["snippet"] if items else None


def put_snippet(yt, video_id: str, snippet: dict) -> None:
    if DRY:
        return
    yt.videos().update(part="snippet", body={"id": video_id, "snippet": snippet}).execute()


# --- 1. playlist self-heal -------------------------------------------------

def resolve_playlist(yt):
    """Find the series playlist on the channel; return (playlist_id, url).

    Note: legacy playlist IDs are only 13 characters (PL + 11), which is valid —
    never judge an ID by its length. Validity is confirmed by an API lookup.
    """
    configured = CFG.get("playlist_url", "").strip()
    if configured:
        pid = configured.split("list=")[-1]
        if yt.playlists().list(part="id", id=pid).execute().get("items"):
            print(f"  playlist: {pid} (from config, verified)")
            return pid, configured
        print(f"  ! configured playlist {pid} does not exist — re-resolving")

    match = CFG.get("playlist_title_match", "").lower()
    req = yt.playlists().list(part="snippet", mine=True, maxResults=50)
    exact, first = None, None
    while req is not None and exact is None:
        resp = req.execute()
        for pl in resp.get("items", []):
            first = first or pl  # fall back to the channel's first playlist
            if match and match in pl["snippet"]["title"].lower():
                exact = pl
                break
        req = yt.playlists().list_next(req, resp)

    found = exact or first
    if not found:
        print("  ! no playlist on the channel — create the series playlist first")
        return None, ""

    pid = found["id"]
    url = f"https://www.youtube.com/playlist?list={pid}"
    print(f"  playlist: {found['snippet']['title']} -> {url}")

    CFG["playlist_url"] = url
    if not DRY:
        save(LONGFORM_PATH, CFG)
    return pid, url


# --- 2. repackage the long-form -------------------------------------------

TAG_BUDGET = 480  # YouTube rejects a snippet whose tags total over ~500 chars


def fit_tags(new: list, existing: list) -> list:
    """New tags first, then as many existing ones as the 500-char budget allows.

    Quoted multi-word tags cost 2 extra characters each, plus a separator.
    """
    out, used = [], 0
    for tag in list(new) + [t for t in existing if t not in new]:
        cost = len(tag) + (2 if " " in tag else 0) + (1 if out else 0)
        if used + cost > TAG_BUDGET:
            continue
        out.append(tag)
        used += cost
    return out


def repackage(yt, playlist_url: str) -> None:
    snippet = get_snippet(yt, VIDEO_ID)
    if snippet is None:
        sys.exit(f"Video {VIDEO_ID} not found — deleted, or the OAuth account isn't the owner.")

    line = f"▶ Full series in order: {playlist_url}\n" if playlist_url else ""
    description = CFG["new_description"].replace("{PLAYLIST_LINE}", line)
    tags = fit_tags(CFG["add_tags"], snippet.get("tags", []))

    if (snippet.get("title") == CFG["new_title"]
            and snippet.get("description") == description
            and set(snippet.get("tags", [])) == set(tags)):
        print("  long-form already repackaged")
        return

    snippet["title"] = CFG["new_title"]
    snippet["description"] = description
    snippet["tags"] = tags
    put_snippet(yt, VIDEO_ID, snippet)
    print(f"  repackaged: {CFG['new_title']}")


# --- 3. the funnel --------------------------------------------------------

def is_funnel_line(line: str) -> bool:
    """A funnel line is a ▶ bullet pointing at a youtu.be video.

    Deliberately narrow, so the two other ▶ bullets survive: the playlist line
    links youtube.com/playlist, and the X/social line links no video at all. The
    numbered "Part N - ...: https://youtu.be/..." series links don't start with ▶.
    """
    stripped = line.strip()
    return stripped.startswith("▶") and "youtu.be/" in stripped


def inject_funnel(yt) -> None:
    """Point every Short's description at the *current* long-form.

    Retargeting to a new long-form must REPLACE the previous funnel line, not
    stack on top of it — otherwise each Short accumulates links and keeps sending
    its traffic to a retired video.
    """
    funnel = CFG["shorts_funnel_line"].strip()
    changed = 0
    for vid in CFG["shorts_video_ids"]:
        snippet = get_snippet(yt, vid)
        if snippet is None:
            print(f"  skip {vid}: not found")
            continue

        desc = snippet.get("description", "")
        kept = [ln for ln in desc.splitlines() if not is_funnel_line(ln)]
        stale = len(desc.splitlines()) - len(kept)
        rebuilt = f"{funnel}\n\n{chr(10).join(kept).lstrip()}"

        if rebuilt == desc:
            continue
        snippet["description"] = rebuilt
        put_snippet(yt, vid, snippet)
        changed += 1
        print(f"  funnel -> {vid}" + (f" (replaced {stale} stale line(s))" if stale else ""))
    print(f"  funnel line current on {len(CFG['shorts_video_ids'])} Short(s); "
          f"{changed} updated this run")


# --- 4. playlist membership -----------------------------------------------

def add_to_playlist(yt, playlist_id: str) -> None:
    if not playlist_id:
        return
    req = yt.playlistItems().list(part="contentDetails", playlistId=playlist_id, maxResults=50)
    while req is not None:
        resp = req.execute()
        for item in resp.get("items", []):
            if item["contentDetails"]["videoId"] == VIDEO_ID:
                print("  already in the series playlist")
                return
        req = yt.playlistItems().list_next(req, resp)
    if not DRY:
        yt.playlistItems().insert(part="snippet", body={"snippet": {
            "playlistId": playlist_id,
            "resourceId": {"kind": "youtube#video", "videoId": VIDEO_ID},
        }}).execute()
    print("  added to the series playlist")


# --- 5. seed comment ------------------------------------------------------

def post_comment(yt) -> None:
    text = CFG["engagement_comment"].strip()
    existing = yt.commentThreads().list(
        part="snippet", videoId=VIDEO_ID, maxResults=100, textFormat="plainText"
    ).execute().get("items", [])
    for thread in existing:
        if thread["snippet"]["topLevelComment"]["snippet"]["textDisplay"].strip() == text:
            print("  seed comment already posted")
            return
    if not DRY:
        yt.commentThreads().insert(part="snippet", body={"snippet": {
            "videoId": VIDEO_ID,
            "topLevelComment": {"snippet": {"textOriginal": text}},
        }}).execute()
    print("  seed comment posted — pin it in YouTube Studio (the API cannot pin)")


# --- 6. report ------------------------------------------------------------

def report(yt) -> None:
    items = yt.videos().list(part="statistics", id=VIDEO_ID).execute().get("items", [])
    if not items:
        return
    stats = items[0]["statistics"]
    views = int(stats.get("viewCount", 0))
    published = datetime.fromisoformat(CFG["published_at"].replace("Z", "+00:00"))
    hours = (datetime.now(timezone.utc) - published).total_seconds() / 3600
    rule = CFG["decision_rule"]

    if hours < rule["decision_hours"]:
        verdict = f"WAIT ({rule['decision_hours'] - hours:.0f}h to the call)"
    elif views >= rule["pass_views"]:
        verdict = "PASS — funnel works, ship Episode 2 (the car / $8,000 episode)"
    elif views <= rule["dead_views"]:
        verdict = ("DEAD — the Shorts audience will not cross over yet. Keep long-form to one "
                   "episode a month and put the effort back into the Shorts series")
    else:
        verdict = "GRAY — funnel works, packaging doesn't: swap to the A/B title + new thumbnail"

    print(f"\n{views} views · {int(stats.get('likeCount', 0))} likes · "
          f"{int(stats.get('commentCount', 0))} comments · {hours:.0f}h old\n"
          f"verdict: {verdict}")


def main() -> None:
    global DRY
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="report only, write nothing")
    ap.add_argument("--report-only", action="store_true", help="just the stats + verdict")
    args = ap.parse_args()
    DRY = args.dry_run

    yt = yt_client()
    if args.report_only:
        report(yt)
        return

    print("1. playlist");     pid, url = resolve_playlist(yt)
    print("2. repackage");    repackage(yt, url)
    print("3. funnel");       inject_funnel(yt)
    print("4. playlist add"); add_to_playlist(yt, pid)
    print("5. comment");      post_comment(yt)
    report(yt)


if __name__ == "__main__":
    main()
