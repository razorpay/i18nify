#!/usr/bin/env bash
# Renders lossless WebP rasters next to the flag SVGs:
#   i18nify-data/assets/flags/4x3/<code>.svg -> <code>-60x45.webp, <code>-40x30.webp
#   i18nify-data/assets/flags/1x1/<code>.svg -> <code>-60x60.webp, <code>-40x40.webp
# Run from the repo root: yarn rasterize-flags
# Requires rsvg-convert (librsvg) and either cwebp (libwebp) or ImageMagick.
#
# Lossless WebP is pixel-identical to the rendered PNG and, at these sizes,
# smaller in aggregate than AVIF (its container is ~40 B vs ~300 B). Lossy WebP
# only supports 4:2:0 chroma and visibly smears colour edges on striped flags.
set -euo pipefail

FLAGS="$(cd "$(dirname "$0")" && pwd)/flags"
# folder:size,size
SETS=("4x3:60x45,40x30" "1x1:60x60,40x40")

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
for set in "${SETS[@]}"; do
  dir="$FLAGS/${set%%:*}"
  IFS=',' read -r -a sizes <<< "${set#*:}"
  for svg in "$dir"/*.svg; do
    code="$(basename "$svg" .svg)"
    for size in "${sizes[@]}"; do
      w="${size%x*}"; h="${size#*x}"
      rsvg-convert -w "$w" -h "$h" "$svg" -o "$tmp/$code-$size.png"
      encode "$tmp/$code-$size.png" "$dir/$code-$size.webp"
      count=$((count + 1))
    done
  done
done
echo "wrote $count webp files under $FLAGS"
