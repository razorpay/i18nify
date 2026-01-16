#!/usr/bin/env bash

# Go Package Generator for i18nify-data
# 
# This script generates a Go package from proto files and data.
# It auto-detects configuration from directory structure and proto files.
# The go_package is derived from the package path (not stored in proto).
#
# Usage: ./generate-package.sh <package-path>
# Example: ./generate-package.sh country/subdivisions

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1" >&2; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1" >&2; }

# --- Configuration ---
PACKAGE_PATH="${1:-}"
if [ -z "$PACKAGE_PATH" ]; then
    log_error "Package path required"
    echo "Usage: $0 <package-path>"
    echo "Example: $0 country/subdivisions"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
I18NIFY_DATA_DIR="$PROJECT_ROOT/i18nify-data"
SOURCE_DIR="$I18NIFY_DATA_DIR/$PACKAGE_PATH"
OUTPUT_DIR="$I18NIFY_DATA_DIR/go/$PACKAGE_PATH"

# Fixed module path prefix
MODULE_PATH_PREFIX="github.com/razorpay/i18nify/i18nify-data/go"

# --- Validation ---
if [ ! -d "$SOURCE_DIR" ]; then
    log_error "Source directory not found: $SOURCE_DIR"
    exit 1
fi

# --- Find Proto File ---
PROTO_DIR="$SOURCE_DIR/proto"
if [ ! -d "$PROTO_DIR" ]; then
    log_error "Proto directory not found: $PROTO_DIR"
    exit 1
fi

PROTO_FILE=$(find "$PROTO_DIR" -maxdepth 1 -name "*.proto" -type f | head -1)
if [ -z "$PROTO_FILE" ]; then
    log_error "No proto file found in $PROTO_DIR"
    exit 1
fi
PROTO_FILENAME=$(basename "$PROTO_FILE")

log_info "Found proto file: $PROTO_FILE"

# --- Derive Go Package Info from Path ---
# Module path: github.com/razorpay/i18nify/i18nify-data/go/{package_path}
MODULE_PATH="$MODULE_PATH_PREFIX/$PACKAGE_PATH"

# Go package name: replace / with _ (e.g., country/subdivisions -> country_subdivisions)
GO_PACKAGE_NAME=$(echo "$PACKAGE_PATH" | tr '/' '_')

# Full go_package option for protoc: "module_path;package_name"
GO_PACKAGE_OPTION="${MODULE_PATH};${GO_PACKAGE_NAME}"

log_info "Module path: $MODULE_PATH"
log_info "Go package name: $GO_PACKAGE_NAME"

# --- Detect Data Files ---
# Check for data.json (single file) or *.json (multiple files)
DATA_FILES=()
if [ -f "$SOURCE_DIR/data.json" ]; then
    DATA_FILES=("$SOURCE_DIR/data.json")
    MULTIPLE_FILES="false"
    log_info "Detected single data file: data.json"
else
    # Find all JSON files (exclude any in proto/ directory)
    while IFS= read -r -d '' file; do
        DATA_FILES+=("$file")
    done < <(find "$SOURCE_DIR" -maxdepth 1 -name "*.json" -type f -print0)
    
    if [ ${#DATA_FILES[@]} -eq 0 ]; then
        log_error "No data files found in $SOURCE_DIR"
        exit 1
    fi
    MULTIPLE_FILES="true"
    log_info "Detected ${#DATA_FILES[@]} data files (multiple file mode)"
fi

# --- Create Output Directory ---
mkdir -p "$OUTPUT_DIR/data"

# Clean old generated files but keep the directory
rm -f "$OUTPUT_DIR"/*.go "$OUTPUT_DIR"/*.mod "$OUTPUT_DIR"/*.sum 2>/dev/null || true

# --- Copy Data Files ---
log_info "Copying data files..."
for data_file in "${DATA_FILES[@]}"; do
    cp "$data_file" "$OUTPUT_DIR/data/"
    log_info "  Copied: $(basename "$data_file")"
done

# --- Compile Proto ---
# Pass go_package via --go_opt instead of requiring it in proto file
log_info "Compiling proto file..."
protoc --go_out="$OUTPUT_DIR" \
       --go_opt=paths=source_relative \
       --go_opt="M${PROTO_FILENAME}=${GO_PACKAGE_OPTION}" \
       --proto_path="$PROTO_DIR" \
       "$PROTO_FILENAME"

# Rename generated file if needed
GENERATED_PB=$(find "$OUTPUT_DIR" -maxdepth 1 -name "*.pb.go" | head -1)
EXPECTED_PB="$OUTPUT_DIR/${GO_PACKAGE_NAME}.pb.go"
if [ -n "$GENERATED_PB" ]; then
    if [ "$GENERATED_PB" != "$EXPECTED_PB" ]; then
        mv "$GENERATED_PB" "$EXPECTED_PB"
        log_info "Renamed: $(basename "$GENERATED_PB") -> ${GO_PACKAGE_NAME}.pb.go"
    else
        log_info "Generated: ${GO_PACKAGE_NAME}.pb.go (already correctly named)"
    fi
fi

# --- Generate go.mod ---
log_info "Creating go.mod at $OUTPUT_DIR/go.mod..."
log_info "MODULE_PATH=$MODULE_PATH"

cat > "$OUTPUT_DIR/go.mod" << GOMODEOF
module $MODULE_PATH

go 1.20

require google.golang.org/protobuf v1.31.0
GOMODEOF

log_info "go.mod contents:"
cat "$OUTPUT_DIR/go.mod" || log_error "Failed to read go.mod"

# --- Generate Data Loader ---
log_info "Generating data loader..."

# Extract first message name from proto (the root type)
ROOT_MESSAGE=$(grep -m 1 "^message " "$PROTO_FILE" | sed 's/^message \([A-Za-z0-9_]*\).*/\1/')
log_info "ROOT_MESSAGE=$ROOT_MESSAGE"

if [ -z "$ROOT_MESSAGE" ]; then
    log_error "Failed to extract root message from proto file"
    exit 1
fi

log_info "MULTIPLE_FILES=$MULTIPLE_FILES"
log_info "Creating data_loader.go at $OUTPUT_DIR/data_loader.go..."

if [ "$MULTIPLE_FILES" = "true" ]; then
    # Generate multi-file data loader
    cat > "$OUTPUT_DIR/data_loader.go" << DATALOADEREOF
// Code generated by i18nify go generator. DO NOT EDIT.

package $GO_PACKAGE_NAME

import (
	"embed"
	"encoding/json"
	"fmt"
	"path/filepath"
	"strings"
	"sync"
)

//go:embed data/*.json
var dataFS embed.FS

var (
	cache     = make(map[string]*$ROOT_MESSAGE)
	cacheLock sync.RWMutex
)

// Get$ROOT_MESSAGE retrieves data for a specific country code.
// The country code is case-insensitive and will be converted to uppercase.
func Get$ROOT_MESSAGE(countryCode string) (*$ROOT_MESSAGE, error) {
	code := strings.ToUpper(countryCode)

	// Check cache first
	cacheLock.RLock()
	if data, ok := cache[code]; ok {
		cacheLock.RUnlock()
		return data, nil
	}
	cacheLock.RUnlock()

	// Load from embedded filesystem
	filePath := filepath.Join("data", code+".json")
	content, err := dataFS.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to read data for country %s: %w", code, err)
	}

	var data $ROOT_MESSAGE
	if err := json.Unmarshal(content, &data); err != nil {
		return nil, fmt.Errorf("failed to parse data for country %s: %w", code, err)
	}

	// Store in cache
	cacheLock.Lock()
	cache[code] = &data
	cacheLock.Unlock()

	return &data, nil
}

// GetAvailableCountryCodes returns a list of available country codes.
func GetAvailableCountryCodes() ([]string, error) {
	entries, err := dataFS.ReadDir("data")
	if err != nil {
		return nil, fmt.Errorf("failed to read data directory: %w", err)
	}

	var codes []string
	for _, entry := range entries {
		if !entry.IsDir() && strings.HasSuffix(entry.Name(), ".json") {
			code := strings.TrimSuffix(entry.Name(), ".json")
			codes = append(codes, code)
		}
	}
	return codes, nil
}
DATALOADEREOF
else
    # Generate single-file data loader
    cat > "$OUTPUT_DIR/data_loader.go" << DATALOADEREOF
// Code generated by i18nify go generator. DO NOT EDIT.

package $GO_PACKAGE_NAME

import (
	_ "embed"
	"encoding/json"
	"sync"
)

//go:embed data/data.json
var dataJSON []byte

var (
	data     *$ROOT_MESSAGE
	dataOnce sync.Once
	dataErr  error
)

// Get$ROOT_MESSAGE retrieves the data.
func Get$ROOT_MESSAGE() (*$ROOT_MESSAGE, error) {
	dataOnce.Do(func() {
		data = &$ROOT_MESSAGE{}
		dataErr = json.Unmarshal(dataJSON, data)
	})
	return data, dataErr
}
DATALOADEREOF
fi

log_info "Generated: data_loader.go"

# --- Verify files were created ---
if [ ! -f "$OUTPUT_DIR/go.mod" ]; then
    log_error "Failed to create go.mod"
    exit 1
fi

if [ ! -f "$OUTPUT_DIR/data_loader.go" ]; then
    log_error "Failed to create data_loader.go"
    exit 1
fi

# --- Generate go.sum (run go mod tidy) ---
log_info "Running go mod tidy..."
cd "$OUTPUT_DIR"
go mod tidy || log_warning "go mod tidy had warnings (this is usually okay)"

# --- Final verification ---
log_info "Generated files:"
ls -la "$OUTPUT_DIR"

log_info "✅ Package generated successfully at: $OUTPUT_DIR"
echo "$OUTPUT_DIR"
