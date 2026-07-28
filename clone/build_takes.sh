#!/usr/bin/env bash
#
# Normalise generated avatar takes into Remotion-ready host plates.
#
#   ./clone/build_takes.sh clone/raw remotion/public/host
#
# Avatar renderers hand back takes at whatever resolution, framerate and
# loudness they felt like. Dropping those straight into a timeline is how an
# edit ends up with one shot that is subtly brighter, half a stop warmer, and
# running at 24fps against everything else at 30 — which reads to a viewer as
# "fake" long before they can say why.
#
# This conforms every take to: 720x1280, 30fps, de-watermarked, matched grade,
# audio stripped (the locked VO track is the only voice source in the cut).
set -euo pipefail

IN="${1:-clone/raw}"
OUT="${2:-remotion/public/host}"
FF="$(command -v ffmpeg || python3 -c 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())')"

mkdir -p "$OUT"
shopt -s nullglob
FILES=("$IN"/*.mp4)
if [ ${#FILES[@]} -eq 0 ]; then
  echo "No .mp4 takes in $IN — nothing to do."
  exit 0
fi

DELOGO="delogo=x=590:y=1148:w=76:h=76:show=0"

for f in "${FILES[@]}"; do
  name="$(basename "$f")"
  echo "→ $name"
  "$FF" -v error -i "$f" \
    -vf "${DELOGO},scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,fps=30,eq=contrast=1.02:saturation=0.97:gamma_r=1.01" \
    -an -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p \
    "$OUT/$name" -y
done

echo
echo "Now list them in remotion/src/lib/assets.ts so the compositions pick them up:"
echo
echo "export const TAKES: string[] = ["
for f in "${FILES[@]}"; do echo "  '$(basename "$f")',"; done
echo "];"
