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

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_DIR="$SCRIPT_DIR/$PACKAGE_NAME"
CONFIG_FILE="$PACKAGE_DIR/package-config.json"
GENERATOR_DIR="$SCRIPT_DIR/generator"

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

echo "[$PACKAGE_NAME] Cleaning dist/"
rm -rf "$PACKAGE_DIR/dist"
mkdir -p "$PACKAGE_DIR/dist"

echo "[$PACKAGE_NAME] Running generator"
cd "$GENERATOR_DIR"
go mod tidy || true
go run main.go "$CONFIG_FILE"

echo "[$PACKAGE_NAME] Done. Output at $PACKAGE_DIR/dist/$PACKAGE_NAME"

