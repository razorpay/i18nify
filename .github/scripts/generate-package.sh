#!/bin/bash
set -euo pipefail

# Usage: ./generate-package.sh <package-name>
# Example: ./generate-package.sh currency

# --- Configuration & Setup ---
PACKAGE_NAME="${1:-}"
if [ -z "$PACKAGE_NAME" ]; then
    echo "Error: Package name required"
    echo "Usage: $0 <package-name>"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
I18NIFY_DATA_DIR="$PROJECT_ROOT/i18nify-data"
GENERATOR_SCRIPT="$SCRIPT_DIR/generator/generate.sh"

# Create a temporary file and ensure it is deleted on exit (Success or Fail)
TEMP_STDOUT=$(mktemp)
cleanup() {
    rm -f "$TEMP_STDOUT"
}
trap cleanup EXIT

# --- Helper Functions ---
check_dependency() {
    local cmd="$1"
    local install_msg="$2"
    if ! command -v "$cmd" &> /dev/null; then
        echo "Error: '$cmd' is required but not installed."
        echo "$install_msg"
        exit 1
    fi
}

# --- 1. Find Package Directory ---
PACKAGE_DIR=""
DIR_PATTERN=$(echo "$PACKAGE_NAME" | tr '-' '/')

# List of potential paths to check (Ordered by preference)
# 1. Exact match
# 2. Pattern match (country-metadata -> country/metadata)
CANDIDATE_DIRS=(
    "$I18NIFY_DATA_DIR/$PACKAGE_NAME"
    "$I18NIFY_DATA_DIR/$DIR_PATTERN"
)

# Check standard locations
for dir in "${CANDIDATE_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        PACKAGE_DIR="$dir"
        break
    fi
done

# Validation: Package directory must exist
if [ -z "$PACKAGE_DIR" ] || [ ! -d "$PACKAGE_DIR" ]; then
    echo "Error: Package directory not found for: $PACKAGE_NAME"
    echo "Searched in: $I18NIFY_DATA_DIR"
    echo "Tried locations:"
    for dir in "${CANDIDATE_DIRS[@]}"; do
        echo "  - $dir"
    done
    exit 1
fi

# --- 2. Pre-flight Checks ---

if [ ! -f "$GENERATOR_SCRIPT" ]; then
    echo "Error: Generator script missing at $GENERATOR_SCRIPT"
    exit 1
fi

check_dependency "jq" "Please install jq (brew install jq / apt-get install jq)"

# Check Protocol Buffers requirements if 'proto' directory exists
if [ -d "$PACKAGE_DIR/proto" ]; then
    check_dependency "protoc" "Install protobuf: brew install protobuf / apt-get install protobuf-compiler"
    check_dependency "protoc-gen-go" "Install Go plugin: go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.31.0"
fi

# --- 3. Execution ---

echo "[$PACKAGE_NAME] Running generator..."

# Run generator: 
# - Capture stdout (path) to temp file
# - Let stderr (logs) flow to console
set +e # Disable exit-on-error temporarily to capture code
"$GENERATOR_SCRIPT" "$PACKAGE_DIR" > "$TEMP_STDOUT"
GEN_EXIT_CODE=$?
set -e # Re-enable strict mode

# Handle Result
if [ $GEN_EXIT_CODE -ne 0 ]; then
    echo "Error: Generator failed (Exit Code: $GEN_EXIT_CODE)"
    # If the script printed anything to stdout during error, show it
    cat "$TEMP_STDOUT"
    exit 1
fi

OUTPUT_DIR=$(tail -n 1 "$TEMP_STDOUT")

if [ -z "$OUTPUT_DIR" ] || [ ! -d "$OUTPUT_DIR" ]; then
    echo "Error: Generator finished but returned invalid directory: '$OUTPUT_DIR'"
    exit 1
fi

echo "[$PACKAGE_NAME] Success! Output at: $OUTPUT_DIR"
echo "$OUTPUT_DIR"