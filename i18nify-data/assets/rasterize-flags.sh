#!/usr/bin/env bash
# Renders lossless WebP rasters next to the 4x3 flag SVGs:
#   i18nify-data/assets/flags/4x3/<code>.svg -> <code>-60x45.webp, <code>-40x30.webp
# Run from the repo root: yarn rasterize-flags
# Requires rsvg-convert (librsvg) and either cwebp (libwebp) or ImageMagick.
#
# Lossless WebP is pixel-identical to the rendered PNG and, at these sizes,
# smaller in aggregate than AVIF (its container is ~40 B vs ~300 B). Lossy WebP
# only supports 4:2:0 chroma and visibly smears colour edges on striped flags.
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)/flags/4x3"
SIZES=("60x45" "40x30")

encode() { # encode <png> <webp>
  if command -v cwebp >/dev/null; then
    cwebp -quiet -lossless -z 9 -exact "$1" -o "$2"
  else
    magick "$1" -define webp:lossless=true -define webp:method=6 -define webp:exact=true "$2"
  fi
}

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

count=0
for svg in "$DIR"/*.svg; do
  code="$(basename "$svg" .svg)"
  for size in "${SIZES[@]}"; do
    w="${size%x*}"; h="${size#*x}"
    rsvg-convert -w "$w" -h "$h" "$svg" -o "$tmp/$code-$size.png"
    encode "$tmp/$code-$size.png" "$DIR/$code-$size.webp"
    count=$((count + 1))
  done
done
echo "wrote $count webp files to $DIR"
