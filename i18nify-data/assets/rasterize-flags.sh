#!/usr/bin/env bash
# Renders AVIF rasters next to the 4x3 flag SVGs:
#   i18nify-data/assets/flags/4x3/<code>.svg -> <code>-60x45.avif, <code>-40x30.avif
# Run from the repo root: yarn rasterize-flags
# Requires rsvg-convert (librsvg) and avifenc (libavif) on PATH.
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)/flags/4x3"
SIZES=("60x45" "40x30")
# q75 + 4:4:4 chroma: visually identical to lossless at these sizes, and 4:4:4
# keeps colour edges sharp on striped flags. Speed 4 is plenty for 60 px.
AVIF_ARGS=(-q 75 -s 4 -y 444)

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

count=0
for svg in "$DIR"/*.svg; do
  code="$(basename "$svg" .svg)"
  for size in "${SIZES[@]}"; do
    w="${size%x*}"; h="${size#*x}"
    rsvg-convert -w "$w" -h "$h" "$svg" -o "$tmp/$code-$size.png"
    avifenc "${AVIF_ARGS[@]}" "$tmp/$code-$size.png" "$DIR/$code-$size.avif" >/dev/null
    count=$((count + 1))
  done
done
echo "wrote $count avif files to $DIR"
