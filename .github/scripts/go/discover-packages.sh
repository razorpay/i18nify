#!/usr/bin/env bash

# Dynamic Package Discovery for i18nify-data Go packages
#
# Discovers valid Go-generatable packages by scanning i18nify-data/ for directories
# that contain a proto/ subdirectory with at least one .proto file.
#
# Modes:
#   --all              List all valid packages (for workflow_dispatch "all")
#   --changed <base>   List only packages whose data files changed vs <base> ref
#   --validate <csv>   Validate a comma-separated list of package names; outputs
#                      only those that are actually valid packages
#
# Output: JSON array of package paths relative to i18nify-data/
#         e.g. ["currency","country/subdivisions","bankcodes"]
#
# A package is considered valid when:
#   i18nify-data/<pkg>/proto/*.proto exists
#
# Usage:
#   ./discover-packages.sh --all
#   ./discover-packages.sh --changed origin/master
#   ./discover-packages.sh --changed HEAD~1
#   ./discover-packages.sh --validate "currency, bankcodes, country/subdivisions"

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
I18NIFY_DATA_DIR="$PROJECT_ROOT/i18nify-data"

# --- Helpers ---

# Returns all valid package paths (relative to i18nify-data/).
# A valid package has at least one .proto file under <pkg>/proto/.
discover_all_packages() {
    local packages=()
    while IFS= read -r proto_file; do
        # proto_file is like: /abs/path/i18nify-data/currency/proto/currency.proto
        # We want: currency
        local proto_dir
        proto_dir="$(dirname "$proto_file")"          # .../currency/proto
        local pkg_abs_dir
        pkg_abs_dir="$(dirname "$proto_dir")"         # .../currency
        local pkg_rel
        pkg_rel="${pkg_abs_dir#"$I18NIFY_DATA_DIR/"}" # currency

        # Deduplicate (multiple .proto files in same dir)
        local already_added=false
        for p in "${packages[@]:-}"; do
            if [ "$p" = "$pkg_rel" ]; then
                already_added=true
                break
            fi
        done
        if [ "$already_added" = false ]; then
            packages+=("$pkg_rel")
        fi
    done < <(find "$I18NIFY_DATA_DIR" -path "*/proto/*.proto" -type f \
                ! -path "$I18NIFY_DATA_DIR/go/*" | sort)

    # Output as JSON array
    to_json_array "${packages[@]:-}"
}

# Given a base ref, output packages whose source data files changed.
discover_changed_packages() {
    local base_ref="$1"
    local all_valid
    all_valid=$(discover_all_packages)

    # Get list of changed files under i18nify-data/ (exclude non-data files)
    local changed_files
    changed_files=$(git diff --name-only "$base_ref" -- \
        "$I18NIFY_DATA_DIR" \
        ':!i18nify-data/go' \
        ':!**/README.md' \
        ':!i18nify-data/contribution-guidelines.md' \
        ':!i18nify-data/versioning-policy.md' \
        ':!i18nify-data/assets' \
        ':!i18nify-data/media' \
        2>/dev/null || true)

    if [ -z "$changed_files" ]; then
        echo "[]"
        return
    fi

    # For each valid package, check if any changed file falls under its path
    local matched=()
    while IFS= read -r pkg; do
        # pkg is e.g. "currency" or "country/subdivisions"
        local pkg_prefix="i18nify-data/${pkg}/"
        if echo "$changed_files" | grep -q "^${pkg_prefix}"; then
            matched+=("$pkg")
        fi
    done < <(echo "$all_valid" | jq -r '.[]')

    to_json_array "${matched[@]:-}"
}

# Validate a comma-separated list of user-provided package names.
# Returns only those that exist as valid packages.
validate_packages() {
    local input="$1"
    local all_valid
    all_valid=$(discover_all_packages)

    local validated=()
    # Split on comma, trim whitespace
    IFS=',' read -ra parts <<< "$input"
    for part in "${parts[@]}"; do
        local pkg
        pkg="$(echo "$part" | xargs)" # trim whitespace
        [ -z "$pkg" ] && continue

        # Check if this is a known valid package
        if echo "$all_valid" | jq -e --arg p "$pkg" 'index($p) != null' >/dev/null 2>&1; then
            validated+=("$pkg")
        else
            echo "WARNING: '$pkg' is not a valid package (no proto found), skipping" >&2
        fi
    done

    to_json_array "${validated[@]:-}"
}

# Convert a bash array to a JSON array string.
to_json_array() {
    if [ $# -eq 0 ] || [ -z "${1:-}" ]; then
        echo "[]"
        return
    fi
    # Use jq to safely produce JSON from arguments
    printf '%s\n' "$@" | jq -R . | jq -s .
}

# --- Main ---
MODE="${1:-}"

case "$MODE" in
    --all)
        discover_all_packages
        ;;
    --changed)
        BASE_REF="${2:-HEAD~1}"
        discover_changed_packages "$BASE_REF"
        ;;
    --validate)
        INPUT="${2:-}"
        if [ -z "$INPUT" ]; then
            echo "[]"
        else
            validate_packages "$INPUT"
        fi
        ;;
    *)
        echo "Usage: $0 {--all|--changed <base-ref>|--validate <csv>}" >&2
        echo "" >&2
        echo "Examples:" >&2
        echo "  $0 --all                          # All valid packages" >&2
        echo "  $0 --changed origin/master         # Packages with changes vs master" >&2
        echo "  $0 --validate 'currency,bankcodes' # Validate user input" >&2
        exit 1
        ;;
esac
