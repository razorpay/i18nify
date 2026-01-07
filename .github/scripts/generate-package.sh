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
GENERATOR_DIR="$SCRIPT_DIR/generator"
GENERATOR_SCRIPT="$GENERATOR_DIR/generate.sh"

# Find package directory - try multiple strategies
PACKAGE_DIR=""

# Strategy 1: Try to find by package-config.json (legacy)
CONFIG_FILE=$(find "$I18NIFY_DATA_DIR" -name "package-config.json" -type f | xargs grep -lE "\"package_name\":\s*\"$PACKAGE_NAME\"" | head -1)
if [ -n "$CONFIG_FILE" ] && [ -f "$CONFIG_FILE" ]; then
    PACKAGE_DIR=$(dirname "$CONFIG_FILE")
    echo "[$PACKAGE_NAME] Found package-config.json (legacy mode)"
fi

# Strategy 2: Try direct directory match
if [ -z "$PACKAGE_DIR" ] || [ ! -d "$PACKAGE_DIR" ]; then
    # Try exact match
    if [ -d "$I18NIFY_DATA_DIR/$PACKAGE_NAME" ]; then
        PACKAGE_DIR="$I18NIFY_DATA_DIR/$PACKAGE_NAME"
    # Try nested directories (e.g., country/metadata -> country-metadata)
    elif [ -d "$I18NIFY_DATA_DIR/$(echo "$PACKAGE_NAME" | tr '-' '/')" ]; then
        PACKAGE_DIR="$I18NIFY_DATA_DIR/$(echo "$PACKAGE_NAME" | tr '-' '/')"
    fi
fi

# Strategy 3: Search for directory with matching name pattern
if [ -z "$PACKAGE_DIR" ] || [ ! -d "$PACKAGE_DIR" ]; then
    # Convert package name to directory pattern (e.g., "country-metadata" -> "country/metadata")
    DIR_PATTERN=$(echo "$PACKAGE_NAME" | tr '-' '/')
    if [ -d "$I18NIFY_DATA_DIR/$DIR_PATTERN" ]; then
        PACKAGE_DIR="$I18NIFY_DATA_DIR/$DIR_PATTERN"
    fi
fi

# Check if i18nify-data directory exists
if [ ! -d "$I18NIFY_DATA_DIR" ]; then
    echo "Error: i18nify-data directory not found: $I18NIFY_DATA_DIR"
    exit 1
fi

if [ -z "$PACKAGE_DIR" ] || [ ! -d "$PACKAGE_DIR" ]; then
    echo "Error: Package directory not found for: $PACKAGE_NAME"
    echo "Searched in: $I18NIFY_DATA_DIR"
    echo "Tried:"
    echo "  - $I18NIFY_DATA_DIR/$PACKAGE_NAME"
    echo "  - $I18NIFY_DATA_DIR/$(echo "$PACKAGE_NAME" | tr '-' '/')"
    exit 1
fi

# Check if generator script exists
if [ ! -f "$GENERATOR_SCRIPT" ]; then
    echo "Error: Generator script not found: $GENERATOR_SCRIPT"
    exit 1
fi

# Check if protoc is needed (check for proto directory)
if [ -d "$PACKAGE_DIR/proto" ]; then
    if ! command -v protoc &> /dev/null; then
        echo "Error: protoc is not installed but is required for this package."
        echo "Please install it using:"
        echo "  - macOS: brew install protobuf"
        echo "  - Linux: apt-get install protobuf-compiler"
        exit 1
    fi

    if ! command -v protoc-gen-go &> /dev/null; then
        echo "Error: protoc-gen-go is not installed but is required for this package."
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
# Pass package directory to generator (supports both old config file and new directory structure)
OUTPUT_DIR=$("$GENERATOR_SCRIPT" "$PACKAGE_DIR" 2>&1 | tail -1)

if [ -z "$OUTPUT_DIR" ] || [ ! -d "$OUTPUT_DIR" ]; then
    echo "Error: Generator did not produce output directory"
    echo "Got: $OUTPUT_DIR"
    exit 1
fi

echo "[$PACKAGE_NAME] Done. Generated files at $OUTPUT_DIR"
echo "$OUTPUT_DIR"  # Output the path for workflow consumption


