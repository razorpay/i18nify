#!/usr/bin/env bash
#
# Dataset plumbing for packages/i18nify-php.
#
# The PHP SDK reads i18nify-data/currency/data.json directly — there is no copy
# of it committed inside the package. Composer installs, however, cannot see the
# monorepo, so the release pipeline materialises the file into the package
# directory just before it is split and tagged. That copy is a build artefact
# and is gitignored.
#
# Usage:
#   scripts/php/sync-data.sh            # verify (dev/CI): canonical file is present and parseable
#   scripts/php/sync-data.sh --deref    # release: copy the canonical file into the package
#   scripts/php/sync-data.sh --clean    # remove the materialised copy
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# canonical (source of truth) : dist location inside the PHP package
declare -a MAPPINGS=(
  "i18nify-data/currency/data.json:packages/i18nify-php/src/Currency/data/currency.json"
)

MODE="verify"
case "${1:-}" in
  --deref) MODE="deref" ;;
  --clean) MODE="clean" ;;
  "")      MODE="verify" ;;
  *)       echo "unknown argument: $1 (expected --deref, --clean, or none)" >&2; exit 2 ;;
esac

for mapping in "${MAPPINGS[@]}"; do
  SRC_REL="${mapping%%:*}"
  DST_REL="${mapping##*:}"
  SRC="$REPO_ROOT/$SRC_REL"
  DST="$REPO_ROOT/$DST_REL"

  case "$MODE" in
    clean)
      rm -f "$DST"
      rmdir "$(dirname "$DST")" 2>/dev/null || true
      echo "✓ removed $DST_REL"
      ;;

    deref)
      if [[ ! -f "$SRC" ]]; then
        echo "✗ canonical dataset missing: $SRC_REL" >&2
        exit 1
      fi

      mkdir -p "$(dirname "$DST")"
      cp -f "$SRC" "$DST"
      chmod 644 "$DST"

      if ! python3 -c "import json,sys; json.load(open(sys.argv[1]))" "$DST" 2>/dev/null; then
        echo "✗ $DST_REL is not valid JSON after copy" >&2
        exit 1
      fi

      echo "✓ materialised $DST_REL from $SRC_REL (build artefact, not committed)"
      ;;

    verify)
      if [[ ! -f "$SRC" ]]; then
        echo "✗ canonical dataset missing: $SRC_REL" >&2
        exit 1
      fi

      if ! python3 -c "import json,sys; json.load(open(sys.argv[1]))['currency_information']" "$SRC" 2>/dev/null; then
        echo "✗ $SRC_REL is not valid currency data" >&2
        exit 1
      fi

      # The package must never carry a committed copy of the dataset.
      if git -C "$REPO_ROOT" ls-files --error-unmatch "$DST_REL" >/dev/null 2>&1; then
        echo "✗ $DST_REL is tracked in git — the PHP package must read $SRC_REL directly." >&2
        echo "  Run: git rm --cached '$DST_REL'" >&2
        exit 1
      fi

      echo "✓ $SRC_REL is the single source; $DST_REL is not committed"
      ;;
  esac
done
