#!/usr/bin/env bash
# Downloads the 46 generated student-loan stills named for their scene, ready
# for `npm run ingest:studentloan -- <dir> studentloan`.
#
# Run this on a machine that can reach the Higgsfield CDN. The session that
# generated them could not: the container's network policy answers 403 to
# CONNECT for d8j0ntlcm91z4.cloudfront.net, which is why the URLs are recorded
# in a manifest instead of the files being committed.
#
#   ./scripts/fetch-stills.sh ~/student-loan-stills
#
# Names are IMG_0001.jpeg .. IMG_0046.jpeg because ingest-scenes.mjs orders by
# the IMG_#### number and renumbers from scratch — so the scene order survives
# even though the ingest never sees this manifest.
#
# Converted to JPEG q92 to match the pension pack's format. The sources are
# 1-2MB PNGs; 46 of them add ~90MB for no visible gain at 1080x1920. Needs
# ImageMagick's `convert` (or swap in `ffmpeg -i in.png -q:v 2 out.jpeg`).
set -euo pipefail

OUT="${1:-}"
if [ -z "$OUT" ]; then
  echo "usage: $0 <output-dir>" >&2
  exit 1
fi

MANIFEST="$(dirname "$0")/student-loan-stills.json"
mkdir -p "$OUT"

missing=0
for n in $(seq 1 46); do
  url=$(node -e '
    const m = require(process.argv[1]);
    process.stdout.write(m[process.argv[2]] || "");
  ' "$MANIFEST" "$n")

  if [ -z "$url" ]; then
    echo "scene $n: NOT IN MANIFEST" >&2
    missing=$((missing + 1))
    continue
  fi

  dest=$(printf '%s/IMG_%04d.jpeg' "$OUT" "$n")
  if [ -s "$dest" ]; then
    echo "scene $n: already have $(basename "$dest")"
    continue
  fi

  echo "scene $n -> $(basename "$dest")"
  curl -fsS --retry 3 --retry-delay 2 -o "$dest.png" "$url"
  convert "$dest.png" -quality 92 "$dest"
  rm -f "$dest.png"
done

echo
echo "$(find "$OUT" -name 'IMG_*.jpeg' -size +0 | wc -l | tr -d ' ') of 46 stills in $OUT"
if [ "$missing" -gt 0 ]; then
  echo "$missing scene(s) missing from the manifest — regenerate those before ingesting." >&2
  exit 1
fi

cat <<EOF

Next:
  cd video
  npm run ingest:studentloan -- "$OUT" studentloan
  npm run headroom:studentloan
  npm run timeline:studentloan
  npm run srt:studentloan
  npm run render:studentloan
EOF
