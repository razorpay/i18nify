#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check if protoc is installed
if ! command -v protoc &> /dev/null; then
    echo "Error: protoc is not installed."
    echo "Please install it using:"
    echo "  - macOS: brew install protobuf"
    echo "  - Linux: apt-get install protobuf-compiler (or equivalent)"
    echo "  - Or download from: https://grpc.io/docs/protoc-installation/"
    exit 1
fi

# Check if protoc-gen-go is installed
if ! command -v protoc-gen-go &> /dev/null; then
    echo "Error: protoc-gen-go is not installed."
    echo "Please install it using: go install google.golang.org/protobuf/cmd/protoc-gen-go@latest"
    exit 1
fi

echo "[currency] Cleaning dist/"
rm -rf ./dist
mkdir -p ./dist

echo "[currency] Running generator"
pushd generator >/dev/null
go mod tidy || true
go run main.go
popd >/dev/null

echo "[currency] Done. Output at $(pwd)/dist/currency"


