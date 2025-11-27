#!/usr/bin/env bash

# Script to generate Go micro-packages from configuration
# This is a bash refactor of the original main.go generator

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check dependencies
check_dependencies() {
    local missing_deps=()
    
    if ! command -v jq &> /dev/null; then
        missing_deps+=("jq")
    fi
    
    if ! command -v go &> /dev/null; then
        missing_deps+=("go")
    fi
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        log_error "Missing required dependencies: ${missing_deps[*]}"
        log_error "Please install them before running this script"
        exit 1
    fi
}

# Load and parse configuration
load_config() {
    local config_path="$1"
    
    if [ ! -f "$config_path" ]; then
        log_error "Configuration file not found: $config_path"
        exit 1
    fi
    
    # Parse JSON configuration using jq
    PACKAGE_NAME=$(jq -r '.package_name' "$config_path")
    STRUCT_NAME=$(jq -r '.struct_name' "$config_path")
    ROOT_JSON_KEY=$(jq -r '.root_json_key' "$config_path")
    ROOT_FIELD_NAME=$(jq -r '.root_field_name' "$config_path")
    DATA_CONTEXT=$(jq -r '.data_context' "$config_path")
    MODULE_PATH=$(jq -r '.module_path' "$config_path")
    HAS_PROTO=$(jq -r '.has_proto' "$config_path")
    PROTO_FILE=$(jq -r '.proto_file // ""' "$config_path")
    
    # Validate required fields
    if [ "$PACKAGE_NAME" == "null" ] || [ -z "$PACKAGE_NAME" ]; then
        log_error "Missing required field: package_name"
        exit 1
    fi
    
    if [ "$STRUCT_NAME" == "null" ] || [ -z "$STRUCT_NAME" ]; then
        log_error "Missing required field: struct_name"
        exit 1
    fi
    
    if [ "$MODULE_PATH" == "null" ] || [ -z "$MODULE_PATH" ]; then
        log_error "Missing required field: module_path"
        exit 1
    fi
}

# Run protoc to generate Go code from proto files
run_protoc() {
    local proto_dir="$1"
    local dist_dir="$2"
    local proto_file="$3"
    
    log_info "Running protoc..."
    
    if ! command -v protoc &> /dev/null; then
        log_error "protoc is not installed but is required for this package"
        exit 1
    fi
    
    protoc --go_out="$dist_dir" \
           -I="$proto_dir" \
           "$proto_dir/$proto_file"
    
    # Check for generated files in subdirectories and move to distDir root
    # protoc creates subdirs based on go_package option (e.g., "./currency" creates currency/ subdir)
    for entry in "$dist_dir"/*; do
        if [ -d "$entry" ] && [ "$(basename "$entry")" != "data" ]; then
            for file in "$entry"/*.go; do
                if [ -f "$file" ]; then
                    mv "$file" "$dist_dir/" || log_warning "Failed to move $file to $dist_dir/"
                fi
            done
            # Remove empty subdirectory
            rmdir "$entry" 2>/dev/null || true
        fi
    done
}

# Generate data_loader.go from template
generate_data_loader() {
    local dist_dir="$1"
    local data_file="$2"
    local template_file="$3"
    
    log_info "Generating data_loader.go..."
    
    # Create data subdirectory and copy JSON file
    local data_dir="$dist_dir/data"
    mkdir -p "$data_dir"
    cp "$data_file" "$data_dir/data.json"
    
    # Generate Go file from template by replacing template variables
    local output_file="$dist_dir/data_loader.go"
    
    sed -e "s/{{\.PackageName}}/$PACKAGE_NAME/g" \
        -e "s/{{\.StructName}}/$STRUCT_NAME/g" \
        -e "s/{{\.RootJSONKey}}/$ROOT_JSON_KEY/g" \
        -e "s/{{\.RootFieldName}}/$ROOT_FIELD_NAME/g" \
        -e "s/{{\.DataContext}}/$DATA_CONTEXT/g" \
        "$template_file" > "$output_file"
}

# Generate data_loader_test.go from template
generate_data_loader_test() {
    local dist_dir="$1"
    local test_template_file="$2"
    
    log_info "Generating data_loader_test.go..."
    
    local output_file="$dist_dir/data_loader_test.go"
    
    sed -e "s/{{\.PackageName}}/$PACKAGE_NAME/g" \
        -e "s/{{\.StructName}}/$STRUCT_NAME/g" \
        -e "s/{{\.RootJSONKey}}/$ROOT_JSON_KEY/g" \
        -e "s/{{\.RootFieldName}}/$ROOT_FIELD_NAME/g" \
        -e "s/{{\.DataContext}}/$DATA_CONTEXT/g" \
        "$test_template_file" > "$output_file"
}

# Initialize Go module
init_go_module() {
    local dist_dir="$1"
    
    log_info "Initializing go module $MODULE_PATH..."
    
    (
        cd "$dist_dir"
        go mod init "$MODULE_PATH"
        go mod edit -go=1.20
        
        # Pin protobuf version if proto is used
        if [ "$HAS_PROTO" == "true" ]; then
            go mod edit -require=google.golang.org/protobuf@v1.31.0
        fi
        
        go mod tidy
    )
}

# Run serialization/deserialization test
run_serialization_test() {
    local dist_dir="$1"
    
    log_info "Running MANDATORY serialization/deserialization test..."
    log_info "This test ensures data integrity before package generation completes."
    
    (
        cd "$dist_dir"
        if ! go test -v -run TestGetData_SerializationDeserialization ./...; then
            log_error "CRITICAL: Serialization/deserialization test failed. Package generation aborted."
            exit 1
        fi
    )
    
    log_info "✓ Serialization/deserialization test passed. Data integrity verified."
}

# Main function
main() {
    if [ $# -lt 1 ]; then
        log_error "Usage: $0 <package-config.json>"
        exit 1
    fi
    
    local config_path="$1"
    
    # Check dependencies
    check_dependencies
    
    # Load configuration
    load_config "$config_path"
    
    # Determine paths
    local base_dir
    base_dir=$(dirname "$config_path")
    local package_name
    package_name=$(basename "$base_dir")
    
    log_info "Generating $package_name micro-package..."
    
    # Load templates from generator's templates directory
    local generator_dir
    generator_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local template_dir="$generator_dir/templates"
    local go_template="$template_dir/go.template"
    local test_template="$template_dir/data_loader_test.template"
    
    if [ ! -f "$go_template" ]; then
        log_error "Template file not found: $go_template"
        exit 1
    fi
    
    if [ ! -f "$test_template" ]; then
        log_error "Template file not found: $test_template"
        exit 1
    fi
    
    # Set up directories and files
    # Use /tmp for temporary generation to avoid cluttering source tree
    local dist_dir="/tmp/i18nify-gen-$PACKAGE_NAME-$$"
    local data_file="$base_dir/data.json"
    local proto_dir="$base_dir/proto"
    
    if [ ! -f "$data_file" ]; then
        log_error "Data file not found: $data_file"
        exit 1
    fi
    
    # Create temporary directory for generation
    mkdir -p "$dist_dir"
    echo "$dist_dir" # Output the temp directory path for workflow consumption
    
    # Run protoc FIRST if needed (before generating data loader that references the struct)
    if [ "$HAS_PROTO" == "true" ]; then
        if [ -z "$PROTO_FILE" ] || [ "$PROTO_FILE" == "null" ]; then
            log_error "has_proto is true but proto_file is not specified"
            exit 1
        fi
        run_protoc "$proto_dir" "$dist_dir" "$PROTO_FILE"
    fi
    
    # Generate data loader (after proto is generated)
    generate_data_loader "$dist_dir" "$data_file" "$go_template"
    
    # Generate test
    generate_data_loader_test "$dist_dir" "$test_template"
    
    # Initialize Go module
    init_go_module "$dist_dir"
    
    # Mandatory: Run serialization/deserialization test
    run_serialization_test "$dist_dir"
    
    log_info "$package_name micro-package generated successfully at $dist_dir"
}

# Run main function with all arguments
main "$@"

