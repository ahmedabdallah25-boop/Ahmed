#!/usr/bin/env python3
"""Set custom thumbnails on Clarity in the Quran from media/clarity/.

    python automation/clarity_thumbnail.py --dry-run   preview
    python automation/clarity_thumbnail.py             upload

Channel 3 only. Reuses clarity_packaging.py's auth and channel guard so there
stays exactly one place in this repo that handles the CIQ_* secrets.

Deliberately NOT like channel 1's set_thumbnail.py, which fetches a plate from a
URL and normalises it with Pillow. Here the images are rendered by
automation/clarity_thumbnails.js and committed, already exactly 1920x1080 JPEG
under 2MB. There is nothing to fetch and nothing to normalise, so this script
does neither — it validates and uploads. Rendering in CI would mean installing
Chromium on a runner to redraw a file that has not changed, and worse, a
thumbnail could change without ever appearing in a diff.

thumbnails.set is a media upload, not a JSON call: it posts raw bytes to the
/upload/ host with the image's own Content-Type. It is also the one write on this
channel with a hard prerequisite — custom thumbnails require a verified channel,
and the failure is a 403 that says nothing useful unless you know that.
"""
import argparse
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from clarity_packaging import (
    ERRORS,
    EXPECT,
    access_token,
    assert_channel,
    call,
    say,
    summarize,
)

ROOT = Path(__file__).resolve().parent.parent
MEDIA = ROOT / "media" / "clarity"
UPLOAD = "https://www.googleapis.com/upload/youtube/v3/thumbnails/set"
MAX_BYTES = 2 * 1024 * 1024

# Rendered by clarity_thumbnails.js to clarity/thumbnail-system.md.
THUMBS = [
    {
        "id": "5Fb1iERyIhs",
        "file": "thumb-5Fb1iERyIhs.jpg",
        "_note": "Keeps the channel's own settling-glass watercolour. The old "
                 "baked-in text is excluded by the crop window, not painted over.",
    },
    {
        "id": "PUPdFpvEA04",
        "file": "thumb-PUPdFpvEA04.jpg",
        "_note": "Replaces the photoreal AI photograph. No photoreal humans on "
                 "this channel — see thumbnail-system.md section 3.",
    },
]

# The four proven winners. Their thumbnails have never been reviewed and their
# results are the only ones this channel has; bringing new uploads onto the
# system first is the whole point. Refused outright, like packaging-fix.json's
# protected list.
PROTECTED = {"cjtKWsFZbcg", "GjztcxZGQTI", "_stswAi-79k", "r-9UaBtOy98"}


def jpeg_size(raw):
    """Width and height straight out of the SOF marker — no Pillow needed."""
    i = 2
    while i < len(raw) - 9:
        if raw[i] != 0xFF:
            i += 1
            continue
        m = raw[i + 1]
        if m in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7,
                 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
            h = int.from_bytes(raw[i + 5:i + 7], "big")
            w = int.from_bytes(raw[i + 7:i + 9], "big")
            return w, h
        if m == 0xD8 or 0xD0 <= m <= 0xD7:
            i += 2
            continue
        i += 2 + int.from_bytes(raw[i + 2:i + 4], "big")
    return None


def check(spec):
    p = MEDIA / spec["file"]
    if spec["id"] in PROTECTED:
        return None, f"{spec['id']} is protected — a proven winner, refused"
    if not p.exists():
        return None, f"{p.relative_to(ROOT)} does not exist — run clarity_thumbnails.js"
    raw = p.read_bytes()
    if len(raw) > MAX_BYTES:
        return None, f"{len(raw)/1024/1024:.2f} MB exceeds YouTube's 2 MB cap"
    dims = jpeg_size(raw)
    if not dims:
        return None, "not a readable JPEG"
    w, h = dims
    if abs(w / h - 16 / 9) > 0.01:
        return None, f"{w}x{h} is not 16:9 — YouTube would pad or crop it"
    if w < 1280:
        return None, f"{w}px wide, under YouTube's 1280 minimum"
    return raw, f"{w}x{h}, {len(raw)/1024:.0f} KB"


def upload(token, vid, raw):
    url = f"{UPLOAD}?{urllib.parse.urlencode({'videoId': vid, 'uploadType': 'media'})}"
    req = urllib.request.Request(url, data=raw, method="POST", headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "image/jpeg",
        "Content-Length": str(len(raw)),
    })
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    token = access_token()
    say("== Channel guard ==")
    assert_channel(token, args.dry_run)

    say(f"\n== Thumbnails: {len(THUMBS)} video(s) ==")
    written = 0
    for spec in THUMBS:
        raw, note = check(spec)
        if raw is None:
            say(f"  ! {spec['id']}: {note}")
            ERRORS.append(f"{spec['id']}: {note}")
            continue
        say(f"  {spec['id']} <- {spec['file']} ({note})")
        if args.dry_run:
            say("      [dry-run] not uploaded")
            continue
        try:
            upload(token, spec["id"], raw)
        except urllib.error.HTTPError as e:
            body = ""
            try:
                body = json.loads(e.read().decode() or "{}").get("error", {}).get("message", "")
            except (ValueError, OSError):
                pass
            if e.code == 403:
                say("      ERROR 403 — custom thumbnails need a VERIFIED channel.")
                say("      Verify at youtube.com/verify, then re-run. Nothing else is wrong.")
                ERRORS.append(f"{spec['id']}: 403, channel not verified?")
            else:
                say(f"      ERROR HTTP {e.code} {body}")
                ERRORS.append(f"{spec['id']}: HTTP {e.code}")
            continue
        say("      uploaded")
        written += 1

    say(f"\n{written} thumbnail(s) uploaded.")
    if args.dry_run:
        say("Dry run — nothing was uploaded. Drop --dry-run to apply.")
    say("\nProtected and never touched by this script:")
    say("  " + ", ".join(sorted(PROTECTED)) + " — the four proven winners.")

    if ERRORS:
        say(f"\n{len(ERRORS)} failure(s) — this run is NOT complete:")
        for e in ERRORS:
            say(f"  - {e}")
        summarize()
        return 1
    summarize()
    return 0


if __name__ == "__main__":
    sys.exit(main())
