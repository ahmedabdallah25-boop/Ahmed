#!/usr/bin/env python3
"""Fix and promote the channel's only long-form video (see ../longform-fix.md).

Steps, all idempotent — re-running changes nothing that is already correct:

  1. verify the configured series playlist still exists, re-resolving it from the
     channel (by title) and writing it back to longform.json if it ever breaks
  2. repackage the long-form: viewer-first title, description, tags
     (skipped when the config sets "repackage": false — for a video whose copy is
     already written and shouldn't be overwritten)
  3. point every Short's description at the *current* long-form  <- the fix that matters.
     Links to superseded long-forms are rewritten, not stacked, so a Short never
     offers the viewer two competing "full breakdown" links.
  4. retire each superseded long-form: a line at the top sending viewers to the current one
  5. add the long-form to the series playlist
  6. post the seed/engagement comment once
  7. report views against the 7-day decision rule, and flag any uploaded-but-private assets

Needs the channel owner's OAuth credentials (see SETUP.md):
  YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN
"""
import argparse
import json
import re
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
    if not CFG.get("repackage", True):
        print("  repackage disabled in config — leaving title/description/tags alone")
        return
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

def stale_url_pattern(video_id: str) -> re.Pattern:
    """Any watch/short/youtu.be URL for `video_id`, including a []-wrapped one.

    Square brackets around a URL stop YouTube from turning it into a link, so a
    bracketed funnel link is dead on arrival — strip the brackets with the match.
    """
    url = (r"https?://(?:www\.)?(?:youtu\.be/|youtube\.com/(?:watch\?v=|shorts/))"
           + re.escape(video_id) + r"(?:\?[^\s\]]*)?")
    # bracketed form first, so its brackets are consumed rather than left behind;
    # spaces are only eaten inside the brackets, never the ones around the link
    return re.compile(r"\[\s*" + url + r"\s*\]|" + url)


def rewrite_links(desc: str) -> str:
    """Repoint superseded long-form links at the current one, and fix stale copy."""
    current = f"https://youtu.be/{VIDEO_ID}"
    for old_id in CFG.get("supersedes", []):
        desc = stale_url_pattern(old_id).sub(current, desc)
    for old, new in CFG.get("text_replacements", []):
        desc = desc.replace(old, new)
    return desc


def repoint_funnel(yt) -> None:
    """Make every Short point at the current long-form, and only at that one."""
    funnel = CFG["shorts_funnel_line"].strip()
    changed = 0
    for vid in CFG["shorts_video_ids"]:
        snippet = get_snippet(yt, vid)
        if snippet is None:
            print(f"  skip {vid}: not found")
            continue
        desc = rewrite_links(snippet.get("description", ""))
        if VIDEO_ID not in desc:
            desc = f"{funnel}\n\n{desc}"
        if desc == snippet.get("description", ""):
            continue
        snippet["description"] = desc
        put_snippet(yt, vid, snippet)
        changed += 1
        print(f"  funnel -> {vid}")
    print(f"  updated {changed} Short(s)"
          f"{' (all already pointing at the current long-form)' if not changed else ''}")


# --- 3b. retire the superseded long-form ----------------------------------

def retire_superseded(yt) -> None:
    """Send the old long-form's viewers to the current one instead of competing with it."""
    line = CFG.get("retire_line", "").strip()
    if not line:
        return
    for old_id in CFG.get("supersedes", []):
        snippet = get_snippet(yt, old_id)
        if snippet is None:
            print(f"  skip {old_id}: not found")
            continue
        desc = snippet.get("description", "")
        if VIDEO_ID in desc:
            print(f"  {old_id} already retired")
            continue
        snippet["description"] = f"{line}\n\n{desc}"
        put_snippet(yt, old_id, snippet)
        print(f"  retired {old_id} -> {VIDEO_ID}")


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
        verdict = "PASS — funnel works, ship Episode 2 on the Part 8 topic"
    elif views <= rule["dead_views"]:
        verdict = "DEAD — stop long-form until ~1k subs, put the effort back into Shorts"
    else:
        verdict = "GRAY — funnel works, packaging doesn't: retitle + new thumbnail"

    print(f"\n{views} views · {int(stats.get('likeCount', 0))} likes · "
          f"{int(stats.get('commentCount', 0))} comments · {hours:.0f}h old\n"
          f"verdict: {verdict}")
    report_private(yt)


def report_private(yt) -> None:
    """Uploaded but never made public is invisible, not underperforming — say which."""
    assets = CFG.get("private_assets") or {}
    ids = [v for k, v in assets.items() if k != "note"]
    ids = [i for group in ids for i in ([group] if isinstance(group, str) else group)]
    if not ids:
        return
    resp = yt.videos().list(part="status,snippet", id=",".join(ids)).execute()
    hidden = [(i["id"], i["status"]["privacyStatus"], i["snippet"]["title"])
              for i in resp.get("items", []) if i["status"]["privacyStatus"] != "public"]
    if not hidden:
        print("all tracked assets are public")
        return
    print(f"\n{len(hidden)} uploaded asset(s) still not public — no views are possible:")
    for vid, status, title in hidden:
        print(f"  {status:9} {vid}  {title[:60]}")


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
    print("3. funnel");       repoint_funnel(yt)
    print("4. retire old");   retire_superseded(yt)
    print("5. playlist add"); add_to_playlist(yt, pid)
    print("6. comment");      post_comment(yt)
    report(yt)


if __name__ == "__main__":
    main()
