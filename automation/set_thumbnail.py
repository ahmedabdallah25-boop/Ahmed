#!/usr/bin/env python3
"""Set a custom thumbnail on a video that is already uploaded.

  python set_thumbnail.py VIDEO_ID --url  https://.../plate.png
  python set_thumbnail.py VIDEO_ID --file media/student-loan-thumb.jpg

Why this exists as its own script. `upload_ep2.py` sets the thumbnail as step 2
of an upload, which is no help once the video is already on the channel — and
anything over 180s needs a 16:9 thumbnail it very likely shipped without,
because the Shorts packaging habit is to ship none. See the mandatory rule in
CLAUDE.md.

Why it takes a URL. The generated plate usually lives on an image host, and the
session that generated it often cannot reach that host — the sandbox network
policy blocks most CDNs. A GitHub runner has open outbound, so fetching happens
here rather than upstream.

Both paths normalise before upload, which is the part that is easy to skip and
expensive to get wrong:

  - resize to exactly 1280x720, YouTube's 16:9 slot. Generators return 16:9-ish
    (2752x1536 is 1.79:1, not 1.778:1), and a few stray pixels of aspect are
    absorbed by a centre crop rather than by letterboxing. Bars would defeat the
    entire point of shipping a 16:9 asset.
  - flatten to RGB JPEG and step quality down until it fits under 2MB, which is
    YouTube's hard cap. A 4K PNG breaks it comfortably.
"""
import argparse
import io
import sys
import urllib.request
from pathlib import Path

from googleapiclient.errors import HttpError
from googleapiclient.http import MediaIoBaseUpload

from apply_fix import yt_client

ROOT = Path(__file__).parent.parent
TARGET = (1280, 720)
MAX_BYTES = 2 * 1024 * 1024


def load(args):
    if args.url:
        print(f"Fetching {args.url}")
        req = urllib.request.Request(args.url, headers={"User-Agent": "curl/8"})
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.read()
    path = ROOT / args.file
    if not path.exists():
        sys.exit(f"Thumbnail not found: {path}")
    return path.read_bytes()


def normalise(raw):
    """1280x720 RGB JPEG under 2MB, centre-cropped rather than letterboxed."""
    from PIL import Image

    im = Image.open(io.BytesIO(raw))
    print(f"Source: {im.size[0]}x{im.size[1]} {im.mode}")

    if im.mode != "RGB":
        im = im.convert("RGB")

    # Centre-crop to exactly 16:9 first, so the resize cannot squash the art.
    w, h = im.size
    want = TARGET[0] / TARGET[1]
    if abs(w / h - want) > 0.001:
        if w / h > want:
            new_w = round(h * want)
            left = (w - new_w) // 2
            im = im.crop((left, 0, left + new_w, h))
        else:
            new_h = round(w / want)
            top = (h - new_h) // 2
            im = im.crop((0, top, w, top + new_h))
        print(f"Centre-cropped to {im.size[0]}x{im.size[1]}")

    im = im.resize(TARGET, Image.LANCZOS)

    for quality in (92, 88, 84, 78, 70, 60):
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=quality, optimize=True, progressive=True)
        if buf.tell() <= MAX_BYTES:
            print(f"Encoded {TARGET[0]}x{TARGET[1]} JPEG q{quality}, {buf.tell()/1024:.0f}KB")
            buf.seek(0)
            return buf
    sys.exit("Could not get the thumbnail under 2MB — check the source image.")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video_id")
    src = ap.add_mutually_exclusive_group(required=True)
    src.add_argument("--url", help="Fetch the plate from a URL")
    src.add_argument("--file", help="Repo-relative path to an image")
    ap.add_argument("--dry-run", action="store_true",
                    help="Normalise and report, without touching YouTube")
    args = ap.parse_args()

    buf = normalise(load(args))

    if args.dry_run:
        out = ROOT / "thumbnail-preview.jpg"
        out.write_bytes(buf.getvalue())
        print(f"~ dry run: would set on {args.video_id}. Wrote {out}")
        return

    yt = yt_client()
    try:
        yt.thumbnails().set(
            videoId=args.video_id,
            media_body=MediaIoBaseUpload(buf, mimetype="image/jpeg"),
        ).execute()
    except HttpError as e:
        # Custom thumbnails need a verified channel. Say so plainly rather than
        # dumping a 403 that reads like an auth failure.
        sys.exit(f"! thumbnail rejected: {e}")
    print(f"Thumbnail set on https://youtu.be/{args.video_id}")


if __name__ == "__main__":
    main()
