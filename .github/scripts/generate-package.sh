#!/bin/bash
set -euo pipefail

# Usage: ./generate-package.sh <package-name>
# Example: ./generate-package.sh currency

PACKAGE_NAME="${1:-}"
if [ -z "$PACKAGE_NAME" ]; then
    echo "Error: Package name required"
    echo "Usage: $0 <package-name>"
    echo "Example: $0 currency"
    exit 1
fi

# Resolve paths relative to script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
I18NIFY_DATA_DIR="$PROJECT_ROOT/i18nify-data"
PACKAGE_DIR="$I18NIFY_DATA_DIR/$PACKAGE_NAME"
CONFIG_FILE="$PACKAGE_DIR/package-config.json"
GENERATOR_DIR="$SCRIPT_DIR/generator"
GENERATOR_SCRIPT="$GENERATOR_DIR/generate.sh"

# Check if i18nify-data directory exists
if [ ! -d "$I18NIFY_DATA_DIR" ]; then
    echo "Error: i18nify-data directory not found: $I18NIFY_DATA_DIR"
    exit 1
fi

# Check if package directory exists
if [ ! -d "$PACKAGE_DIR" ]; then
    echo "Error: Package directory not found: $PACKAGE_DIR"
    exit 1
fi

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: Package config not found: $CONFIG_FILE"
    echo "Please create package-config.json in $PACKAGE_DIR"
    exit 1
fi

# Check if generator script exists
if [ ! -f "$GENERATOR_SCRIPT" ]; then
    echo "Error: Generator script not found: $GENERATOR_SCRIPT"
    exit 1
fi

# Check if protoc is installed (if proto is used)
if grep -q '"has_proto":\s*true' "$CONFIG_FILE"; then
    if ! command -v protoc &> /dev/null; then
        echo "Error: protoc is not installed."
        echo "Please install it using:"
        echo "  - macOS: brew install protobuf"
        echo "  - Linux: apt-get install protobuf-compiler"
        exit 1
    fi

    if ! command -v protoc-gen-go &> /dev/null; then
        echo "Error: protoc-gen-go is not installed."
        echo "Please install it using: go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.31.0"
        exit 1
    fi
fi

# Check for jq (required by generate.sh)
if ! command -v jq &> /dev/null; then
    echo "Error: jq is not installed but is required by the generator."
    echo "Please install it using:"
    echo "  - macOS: brew install jq"
    echo "  - Linux: apt-get install jq"
    exit 1
fi

echo "[$PACKAGE_NAME] Running generator"
# Capture stdout (last line is the temp directory path), stderr goes to console
OUTPUT_DIR=$("$GENERATOR_SCRIPT" "$CONFIG_FILE" 2>&1 | tail -1)

if [ -z "$OUTPUT_DIR" ] || [ ! -d "$OUTPUT_DIR" ]; then
    echo "Error: Generator did not produce output directory"
    echo "Got: $OUTPUT_DIR"
    exit 1
fi

echo "[$PACKAGE_NAME] Done. Generated files at $OUTPUT_DIR"
echo "$OUTPUT_DIR"  # Output the path for workflow consumption


