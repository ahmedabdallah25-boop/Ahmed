#!/usr/bin/env bash
# Land supplied gap frames into the filenames build-klarna.mjs adopts.
#
#   scripts/land-gap.sh 01 /path/IMG_6337.webp 08 /path/IMG_6338.webp ...
#
# Takes pairs of <gap number> <source image>, converts each to
# public/broll/klarna/gap-NN.jpg at the composition's 1080x1920, cropping rather
# than stretching so nothing in frame changes shape. Any source format ffmpeg
# reads works — the gallery hands out .webp, the pipeline wants .jpg.
set -euo pipefail
FF=$(python3 -c 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())')
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/broll/klarna"
mkdir -p "$OUT"
while [ "$#" -gt 0 ]; do
  n=$1; src=$2; shift 2
  "$FF" -hide_banner -loglevel error -i "$src" \
    -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" \
    -q:v 2 "$OUT/gap-$n.jpg" -y
  echo "  gap-$n  <-  $(basename "$src")"
done
echo "on disk: $(ls "$OUT"/gap-*.jpg 2>/dev/null | wc -l)/31"
