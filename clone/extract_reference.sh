#!/usr/bin/env bash
#
# Pull clean cloning references out of an existing presenter clip.
#
#   ./clone/extract_reference.sh media/clone-source.mp4 [outdir]
#
# Produces, in clone/reference/:
#   face.png        de-watermarked, full-res still — the identity reference
#   face-crop.png   head-and-shoulders crop, the framing most avatar tools want
#   voice.wav       48k mono, de-noised, loudness-normalised voice reference
#   grade.txt       the measured look of the source, for matching new takes
#
# Everything here is lossless-ish and non-destructive; the source is never touched.
set -euo pipefail

SRC="${1:?usage: extract_reference.sh <source.mp4> [outdir]}"
OUT="${2:-clone/reference}"

# The repo's automation already depends on ffmpeg; imageio-ffmpeg is the
# fallback so this runs in a container without a system package.
FF="$(command -v ffmpeg || python3 -c 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())')"

mkdir -p "$OUT"

# Gemini/Veo renders carry a sparkle watermark in the lower right. Measured on a
# 720x1280 plate; delogo interpolates from the box edge, which on flat desk
# wood is invisible. Re-measure if the source resolution changes.
DELOGO="delogo=x=590:y=1148:w=76:h=76:show=0"

echo "→ identity still"
# -ss 1 skips the first second: avatar renders and phone cameras alike spend it
# settling exposure, and a still from frame 0 is the one that looks uncanny.
"$FF" -v error -ss 1 -i "$SRC" -vf "$DELOGO" -frames:v 1 "$OUT/face.png" -y
"$FF" -v error -ss 1 -i "$SRC" -vf "$DELOGO,crop=in_w:in_w*1.25:0:in_h*0.06,scale=1024:-1" \
  -frames:v 1 "$OUT/face-crop.png" -y

echo "→ voice reference"
# afftdn strips the room tone an avatar renderer bakes in; loudnorm to -16 LUFS
# is the level every voice-cloning service expects and almost nobody supplies.
"$FF" -v error -i "$SRC" -vn -af "highpass=f=80,afftdn=nf=-28,loudnorm=I=-16:TP=-1.5:LRA=11" \
  -ar 48000 -ac 1 -c:a pcm_s16le "$OUT/voice.wav" -y

echo "→ measuring grade"
{
  echo "source: $SRC"
  "$FF" -hide_banner -i "$SRC" 2>&1 | grep -E "Duration|Stream #" || true
  echo
  echo "loudness of extracted voice reference:"
  "$FF" -v error -i "$OUT/voice.wav" -af ebur128=peak=true -f null - 2>&1 | tail -12
} > "$OUT/grade.txt"

DUR=$("$FF" -v error -i "$SRC" -f null - 2>&1 | tail -1 || true)
echo
echo "Wrote $OUT/{face.png,face-crop.png,voice.wav,grade.txt}"
echo
echo "Voice-clone quality is bounded by how much reference audio you gave it."
echo "Under ~60s of speech gets you an instant clone that sounds close but"
echo "flattens on long sentences — exactly where a 7-minute script lives."
echo "Record 3-5 minutes of clean read-aloud before cloning for real."
