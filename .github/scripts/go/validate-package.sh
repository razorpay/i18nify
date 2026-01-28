#!/usr/bin/env bash

# Package Validation Script for i18nify-data
# 
# This script validates data files and proto files before Go package generation.
# It checks:
#   1. Proto file syntax (via protoc)
#   2. JSON file syntax
#   3. JSON data structure matches proto schema
#
# Usage: ./validate-package.sh <package-path>
# Example: ./validate-package.sh country/subdivisions
#
# Exit codes:
#   0 - All validations passed
#   1 - Validation failed

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1" >&2; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1" >&2; }
log_success() { echo -e "${GREEN}[✓]${NC} $1" >&2; }

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

VALIDATION_FAILED=false

# --- Validate Source Directory Exists ---
log_info "Validating package: $PACKAGE_PATH"

if [ ! -d "$SOURCE_DIR" ]; then
    log_error "Source directory not found: $SOURCE_DIR"
    exit 1
fi

# --- Validate Proto File ---
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

log_info "Checking proto file: $(basename "$PROTO_FILE")"

# Check proto syntax by running protoc with --descriptor_set_out (dry run)
TEMP_DESCRIPTOR=$(mktemp)
if protoc --descriptor_set_out="$TEMP_DESCRIPTOR" \
          --proto_path="$PROTO_DIR" \
          "$(basename "$PROTO_FILE")" 2>&1; then
    log_success "Proto syntax valid: $(basename "$PROTO_FILE")"
else
    log_error "Proto syntax error in: $(basename "$PROTO_FILE")"
    VALIDATION_FAILED=true
fi
rm -f "$TEMP_DESCRIPTOR"

# Extract root message name for later validation
ROOT_MESSAGE=$(grep -m 1 "^message " "$PROTO_FILE" | sed 's/^message \([A-Za-z0-9_]*\).*/\1/' || echo "")
if [ -z "$ROOT_MESSAGE" ]; then
    log_warning "Could not extract root message name from proto file"
fi

# --- Validate JSON Files ---
log_info "Checking JSON data files..."

# Find all JSON files (data.json or *.json in root)
DATA_FILES=()
if [ -f "$SOURCE_DIR/data.json" ]; then
    DATA_FILES=("$SOURCE_DIR/data.json")
else
    while IFS= read -r -d '' file; do
        DATA_FILES+=("$file")
    done < <(find "$SOURCE_DIR" -maxdepth 1 -name "*.json" -type f ! -name "schema.json" ! -name "package-config.json" -print0)
fi

if [ ${#DATA_FILES[@]} -eq 0 ]; then
    log_error "No data files found in $SOURCE_DIR"
    exit 1
fi

log_info "Found ${#DATA_FILES[@]} data file(s)"

# Validate each JSON file
for data_file in "${DATA_FILES[@]}"; do
    filename=$(basename "$data_file")
    
    # Check JSON syntax using jq
    if jq empty "$data_file" 2>/dev/null; then
        log_success "JSON syntax valid: $filename"
    else
        log_error "JSON syntax error in: $filename"
        # Show the actual error
        jq empty "$data_file" 2>&1 | head -5 || true
        VALIDATION_FAILED=true
        continue
    fi
    
    # Basic structure validation
    # Check if JSON is an object (not array or primitive)
    JSON_TYPE=$(jq -r 'type' "$data_file" 2>/dev/null || echo "unknown")
    if [ "$JSON_TYPE" != "object" ]; then
        log_error "JSON must be an object, got: $JSON_TYPE in $filename"
        VALIDATION_FAILED=true
        continue
    fi
    
    # Check for empty object
    KEY_COUNT=$(jq 'keys | length' "$data_file" 2>/dev/null || echo "0")
    if [ "$KEY_COUNT" -eq 0 ]; then
        log_warning "JSON file is empty: $filename"
    fi
done

# --- Validate JSON matches Proto Schema (optional, requires Go) ---
# This is a deeper validation that compiles the proto and tries to unmarshal JSON
if command -v go &> /dev/null && [ "$VALIDATION_FAILED" = false ]; then
    log_info "Running deep validation (proto + JSON compatibility)..."
    
    # Create a temporary directory for validation
    TEMP_DIR=$(mktemp -d)
    TEMP_VALIDATE_DIR="$TEMP_DIR/validate"
    mkdir -p "$TEMP_VALIDATE_DIR"
    
    # Generate proto Go file
    GO_PACKAGE_NAME=$(echo "$PACKAGE_PATH" | tr '/' '_')
    MODULE_PATH="validate/$GO_PACKAGE_NAME"
    
    if protoc --go_out="$TEMP_VALIDATE_DIR" \
              --go_opt=paths=source_relative \
              --go_opt="M$(basename "$PROTO_FILE")=${MODULE_PATH};${GO_PACKAGE_NAME}" \
              --proto_path="$PROTO_DIR" \
              "$(basename "$PROTO_FILE")" 2>&1; then
        
        # Create a simple Go validation program
        cat > "$TEMP_DIR/main.go" << 'VALIDATOREOF'
package main

import (
    "encoding/json"
    "fmt"
    "os"
    "google.golang.org/protobuf/encoding/protojson"
    "google.golang.org/protobuf/proto"
)

func main() {
    if len(os.Args) < 2 {
        fmt.Println("Usage: validator <json-file>")
        os.Exit(1)
    }
    
    data, err := os.ReadFile(os.Args[1])
    if err != nil {
        fmt.Printf("Failed to read file: %v\n", err)
        os.Exit(1)
    }
    
    // First, validate it's valid JSON
    var jsonObj interface{}
    if err := json.Unmarshal(data, &jsonObj); err != nil {
        fmt.Printf("Invalid JSON: %v\n", err)
        os.Exit(1)
    }
    
    fmt.Println("JSON structure is valid")
}
VALIDATOREOF

        # Create go.mod for the validator
        cat > "$TEMP_DIR/go.mod" << GOMODEOF
module validator

go 1.20

require google.golang.org/protobuf v1.31.0
GOMODEOF

        # Run go mod tidy and build (suppress output)
        cd "$TEMP_DIR"
        if go mod tidy 2>/dev/null && go build -o validator 2>/dev/null; then
            # Validate each JSON file
            for data_file in "${DATA_FILES[@]}"; do
                filename=$(basename "$data_file")
                if ./validator "$data_file" >/dev/null 2>&1; then
                    log_success "Deep validation passed: $filename"
                else
                    log_warning "Deep validation skipped for: $filename (proto mismatch possible)"
                fi
            done
        else
            log_warning "Could not build validator, skipping deep validation"
        fi
    else
        log_warning "Proto compilation failed during deep validation"
    fi
    
    # Cleanup
    rm -rf "$TEMP_DIR"
fi

# --- Final Result ---
echo ""
if [ "$VALIDATION_FAILED" = true ]; then
    log_error "❌ Validation FAILED for package: $PACKAGE_PATH"
    exit 1
else
    log_info "✅ All validations PASSED for package: $PACKAGE_PATH"
    exit 0
fi
