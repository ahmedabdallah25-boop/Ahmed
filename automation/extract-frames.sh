#!/usr/bin/env bash
# Download a YouTube Short and extract an evenly-spaced frame grid for visual analysis.
#
# Requires the environment's egress policy to allow:
#   www.youtube.com, youtube.com, i.ytimg.com, *.googlevideo.com
# See docs/network-allowlist.md. Without *.googlevideo.com, yt-dlp resolves
# metadata but cannot fetch the media stream.
#
# Deps (both install from pypi, which is allowlisted by default):
#   pip install yt-dlp imageio-ffmpeg
#
# Usage: ./extract-frames.sh <video_id> [fps]
#   fps defaults to 1 (one frame per second — ~60-90 frames for these Shorts,
#   enough to resolve a 1.5-2.0s cut rhythm).

set -euo pipefail

VIDEO_ID="${1:?usage: extract-frames.sh <video_id> [fps]}"
FPS="${2:-1}"
OUTDIR="${OUTDIR:-/tmp/frames/$VIDEO_ID}"

FFMPEG="$(python3 -c 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())')"

mkdir -p "$OUTDIR"
echo "==> downloading $VIDEO_ID"
yt-dlp -f 'bv*[height<=1920]+ba/b' \
       --merge-output-format mp4 \
       -o "$OUTDIR/source.%(ext)s" \
       "https://youtube.com/shorts/$VIDEO_ID"

SRC="$(find "$OUTDIR" -maxdepth 1 -name 'source.*' -print -quit)"
echo "==> extracting frames at ${FPS}fps from $SRC"
"$FFMPEG" -loglevel error -i "$SRC" -vf "fps=$FPS,scale=540:-1" "$OUTDIR/f_%03d.jpg"

# Contact sheet: 5 columns, useful for reading cut rhythm and palette at a glance.
"$FFMPEG" -loglevel error -i "$SRC" \
    -vf "fps=$FPS,scale=216:-1,tile=5x12" "$OUTDIR/contact_%02d.jpg" 2>/dev/null || true

echo "==> done: $(find "$OUTDIR" -name 'f_*.jpg' | wc -l) frames in $OUTDIR"
ls "$OUTDIR"/contact_*.jpg 2>/dev/null && echo "    (contact sheets above are the fastest thing to read first)"
