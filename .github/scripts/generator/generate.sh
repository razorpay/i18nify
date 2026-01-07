#!/usr/bin/env bash

# Script to generate Go micro-packages from proto files and data
# 
# This is a Go-specific generator. All Go-specific logic (module paths, output paths, etc.)
# is contained in this script. The proto files are language-agnostic and can be used
# by other generators (JS, Python, etc.) as well.
#
# Go-specific configuration:
# - Module path: github.com/razorpay/i18nify/i18nify-data/go/{package_name}
# - Output path: i18nify-data/go/{package_name}
# - Go package naming conventions
# - Go module initialization

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1" >&2
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" >&2
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

# Convert string to PascalCase (e.g., "currency-info" -> "CurrencyInfo")
to_pascal_case() {
    local str="$1"
    echo "$str" | sed 's/-\([a-z]\)/\U\1/g' | sed 's/^\([a-z]\)/\U\1/'
}

# Convert string to snake_case (e.g., "CurrencyInfo" -> "currency_info")
to_snake_case() {
    local str="$1"
    echo "$str" | sed 's/\([A-Z]\)/_\L\1/g' | sed 's/^_//'
}

# Extract struct name from proto file
extract_struct_name_from_proto() {
    local proto_file="$1"
    if [ -f "$proto_file" ]; then
        # Find the first message definition
        local struct_name=$(grep -m 1 "^message " "$proto_file" | sed 's/^message \([A-Za-z0-9_]*\).*/\1/' | head -1)
        if [ -n "$struct_name" ]; then
            echo "$struct_name"
            return 0
        fi
    fi
    return 1
}

# Extract package name from proto file
extract_package_name_from_proto() {
    local proto_file="$1"
    if [ -f "$proto_file" ]; then
        # First try to find custom package_name option (language-agnostic)
        # Supports: // option package_name = "value";
        local package_name=$(grep -m 1 "//.*option package_name" "$proto_file" | sed -E 's|.*option package_name\s*=\s*"([^"]*)".*|\1|' | head -1)
        if [ -n "$package_name" ] && [ "$package_name" != "option package_name" ]; then
            echo "$package_name"
            return 0
        fi
        # Fallback to package declaration
        package_name=$(grep -m 1 "^package " "$proto_file" | sed 's/^package \([A-Za-z0-9_]*\).*/\1/' | head -1)
        if [ -n "$package_name" ]; then
            echo "$package_name"
            return 0
        fi
    fi
    return 1
}

# Extract metadata from proto file comments
# Supports format: // i18nify:key=value
extract_proto_metadata() {
    local proto_file="$1"
    local key="$2"
    if [ -f "$proto_file" ]; then
        # Look for i18nify:key=value pattern
        local value=$(grep -m 1 "^//.*i18nify:${key}=" "$proto_file" | sed "s|.*i18nify:${key}=\([^ ]*\).*|\1|" | head -1)
        if [ -n "$value" ]; then
            echo "$value"
            return 0
        fi
    fi
    return 1
}

# Extract data file path from proto metadata
extract_data_file_from_proto() {
    local proto_file="$1"
    if [ -f "$proto_file" ]; then
        local data_file=$(extract_proto_metadata "$proto_file" "data_file")
        if [ -n "$data_file" ]; then
            echo "$data_file"
            return 0
        fi
    fi
    return 1
}

# Extract multiple_data_files flag from proto metadata
extract_multiple_data_files_from_proto() {
    local proto_file="$1"
    if [ -f "$proto_file" ]; then
        local flag=$(extract_proto_metadata "$proto_file" "multiple_data_files")
        if [ -n "$flag" ] && [ "$flag" = "true" ]; then
            echo "true"
            return 0
        fi
    fi
    return 1
}

# Extract root JSON key from schema.json
extract_root_json_key_from_schema() {
    local schema_file="$1"
    if [ -f "$schema_file" ]; then
        # Try to get first required key
        local root_key=$(jq -r '.required[0] // empty' "$schema_file" 2>/dev/null)
        if [ -n "$root_key" ] && [ "$root_key" != "null" ]; then
            echo "$root_key"
            return 0
        fi
        # Fallback: get first property key
        root_key=$(jq -r '.properties | keys[0] // empty' "$schema_file" 2>/dev/null)
        if [ -n "$root_key" ] && [ "$root_key" != "null" ]; then
            echo "$root_key"
            return 0
        fi
    fi
    return 1
}

# Auto-detect configuration from directory structure
auto_detect_config() {
    local base_dir="$1"
    
    # 1. Get relative path from i18nify-data (preserves nested structure)
    local rel_path=$(echo "$base_dir" | sed "s|.*i18nify-data/||")
    
    # 2. Package name for identification (use basename for flat, or convert nested to kebab-case)
    PACKAGE_NAME=$(basename "$base_dir")
    if [[ "$rel_path" == *"/"* ]]; then
        # For nested directories, use kebab-case for package name identifier
        PACKAGE_NAME=$(echo "$rel_path" | tr '/' '-')
    fi
    GO_PACKAGE_NAME=$(echo "$PACKAGE_NAME" | tr '-' '_')
    
    # 3. Go-specific: Module path - preserve directory structure (country/metadata -> country/metadata)
    # This is Go-specific and would be different for other languages (e.g., JS: @razorpay/i18nify-{package})
    MODULE_PATH="github.com/razorpay/i18nify/i18nify-data/go/$rel_path"
    
    # 3. Check for proto files
    local proto_dir="$base_dir/proto"
    local proto_path=""
    if [ -d "$proto_dir" ]; then
        HAS_PROTO="true"
        # Find first .proto file
        PROTO_FILE=$(find "$proto_dir" -maxdepth 1 -name "*.proto" -type f | head -1 | xargs basename 2>/dev/null || echo "")
        
        if [ -n "$PROTO_FILE" ]; then
            proto_path="$proto_dir/$PROTO_FILE"
            
            # Extract package-level metadata from proto file (preferred source)
            # Note: proto package name is used for Go package name, but directory name is used for module path
            local proto_package=$(extract_package_name_from_proto "$proto_path")
            if [ -n "$proto_package" ]; then
                # Use proto package name for Go package (converts underscores)
                GO_PACKAGE_NAME="$proto_package"
            fi
            
            # Extract struct name from proto file
            STRUCT_NAME=$(extract_struct_name_from_proto "$proto_path")
            
            # Extract root JSON key from proto metadata
            local proto_root_key=$(extract_proto_metadata "$proto_path" "root_json_key")
            if [ -n "$proto_root_key" ]; then
                ROOT_JSON_KEY="$proto_root_key"
            fi
            
            # Extract data context from proto metadata
            local proto_data_context=$(extract_proto_metadata "$proto_path" "data_context")
            if [ -n "$proto_data_context" ]; then
                DATA_CONTEXT="$proto_data_context"
            fi
            
            # Extract data file from proto metadata
            local proto_data_file=$(extract_data_file_from_proto "$proto_path" 2>/dev/null || echo "")
            # Check if data_file was explicitly set (even if empty)
            if grep -q "i18nify:data_file=" "$proto_path"; then
                # If empty string, it means use all files (multiple_data_files=true)
                if [ -z "$proto_data_file" ] || [ "$proto_data_file" = "" ]; then
                    MULTIPLE_DATA_FILES="true"
                    DATA_FILE=""
                else
                    DATA_FILE="$proto_data_file"
                fi
            fi
            
            # Extract multiple_data_files flag from proto metadata (overrides data_file logic)
            local proto_multiple=$(extract_multiple_data_files_from_proto "$proto_path")
            if [ -n "$proto_multiple" ]; then
                MULTIPLE_DATA_FILES="$proto_multiple"
            fi
        fi
    else
        HAS_PROTO="false"
        PROTO_FILE=""
    fi
    
    # 4. If struct name not found, derive from package name
    if [ -z "$STRUCT_NAME" ]; then
        STRUCT_NAME=$(to_pascal_case "$PACKAGE_NAME")
        # Add "Info" suffix if not present (e.g., Currency -> CurrencyInfo)
        if [[ ! "$STRUCT_NAME" =~ Info$ ]]; then
            STRUCT_NAME="${STRUCT_NAME}Info"
        fi
    fi
    
    # 5. Root field name - same as struct name
    ROOT_FIELD_NAME="$STRUCT_NAME"
    
    # 6. Extract root JSON key from schema.json (if not found in proto)
    if [ -z "$ROOT_JSON_KEY" ]; then
        local schema_file="$base_dir/schema.json"
        if [ -f "$schema_file" ]; then
            ROOT_JSON_KEY=$(extract_root_json_key_from_schema "$schema_file")
        fi
    fi
    
    # If still not found, derive from struct name
    if [ -z "$ROOT_JSON_KEY" ]; then
        ROOT_JSON_KEY=$(to_snake_case "$STRUCT_NAME")
    fi
    
    # 7. Data context - default to package name (if not found in proto)
    if [ -z "$DATA_CONTEXT" ]; then
        DATA_CONTEXT="$PACKAGE_NAME"
    fi
    
    # 8. Check for data directory (new structure) or root level files (old structure)
    local data_dir="$base_dir/data"
    if [ -d "$data_dir" ]; then
        # New structure: data files in data/ directory
        local json_count=$(find "$data_dir" -maxdepth 1 -name "*.json" -type f | wc -l | tr -d ' ')
        if [ "$json_count" -gt 1 ]; then
            MULTIPLE_DATA_FILES="true"
            DATA_FILE=""
        else
            MULTIPLE_DATA_FILES="false"
            # Find the data file
            DATA_FILE=$(find "$data_dir" -maxdepth 1 -name "*.json" -type f | head -1)
            if [ -n "$DATA_FILE" ]; then
                DATA_FILE=$(basename "$DATA_FILE")
            else
                DATA_FILE="data.json"
            fi
        fi
    else
        # Old structure: data files in root
        local json_count=$(find "$base_dir" -maxdepth 1 -name "*.json" ! -name "schema.json" ! -name "package-config.json" -type f | wc -l | tr -d ' ')
        if [ "$json_count" -gt 1 ]; then
            MULTIPLE_DATA_FILES="true"
            DATA_FILE=""
        else
            MULTIPLE_DATA_FILES="false"
            DATA_FILE=$(find "$base_dir" -maxdepth 1 -name "*.json" ! -name "schema.json" ! -name "package-config.json" -type f | head -1 | xargs basename 2>/dev/null || echo "data.json")
        fi
    fi
    
    # 9. Go-specific: Check for custom templates in templates/go/ directory (new structure)
    # For other languages, this would be templates/js/, templates/python/, etc.
    local templates_dir="$base_dir/templates/go"
    local generator_dir
    generator_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local generator_template_dir="$generator_dir/templates"
    
    if [ -d "$templates_dir" ]; then
        # Look for custom templates in package directory
        if [ -f "$templates_dir/data_loader.template" ]; then
            CUSTOM_TEMPLATE="$templates_dir/data_loader.template"
        elif [ -f "$templates_dir/go.template" ]; then
            CUSTOM_TEMPLATE="$templates_dir/go.template"
        else
            CUSTOM_TEMPLATE=""
        fi
        
        if [ -f "$templates_dir/data_loader_test.template" ]; then
            CUSTOM_TEST_TEMPLATE="$templates_dir/data_loader_test.template"
        else
            CUSTOM_TEST_TEMPLATE=""
        fi
    else
        # Check for templates in generator directory by naming convention
        # e.g., go_bankcodes.template for bankcodes package
        local template_name="go_${GO_PACKAGE_NAME}.template"
        local test_template_name="data_loader_test_${GO_PACKAGE_NAME}.template"
        
        if [ -f "$generator_template_dir/$template_name" ]; then
            CUSTOM_TEMPLATE="$template_name"
        else
            CUSTOM_TEMPLATE=""
        fi
        
        if [ -f "$generator_template_dir/$test_template_name" ]; then
            CUSTOM_TEST_TEMPLATE="$test_template_name"
        else
            CUSTOM_TEST_TEMPLATE=""
        fi
    fi
}

# Load configuration - supports both old (package-config.json) and new (auto-detect) approaches
load_config() {
    local config_path_or_dir="$1"
    
    # Check if it's a file (old approach) or directory (new approach)
    if [ -f "$config_path_or_dir" ]; then
        # Old approach: package-config.json exists
        log_info "Using package-config.json (legacy mode)"
        local config_path="$config_path_or_dir"
        local base_dir=$(dirname "$config_path")
    
    # Parse JSON configuration using jq
    PACKAGE_NAME=$(jq -r '.package_name' "$config_path")
    GO_PACKAGE_NAME=$(echo "$PACKAGE_NAME" | tr '-' '_')
    STRUCT_NAME=$(jq -r '.struct_name' "$config_path")
    ROOT_JSON_KEY=$(jq -r '.root_json_key' "$config_path")
    ROOT_FIELD_NAME=$(jq -r '.root_field_name' "$config_path")
    DATA_CONTEXT=$(jq -r '.data_context' "$config_path")
    MODULE_PATH=$(jq -r '.module_path' "$config_path")
    HAS_PROTO=$(jq -r '.has_proto' "$config_path")
    PROTO_FILE=$(jq -r '.proto_file // ""' "$config_path")
    DATA_FILE=$(jq -r '.data_file // "data.json"' "$config_path")
    MULTIPLE_DATA_FILES=$(jq -r '.multiple_data_files // false' "$config_path")
    CUSTOM_TEMPLATE=$(jq -r '.custom_template // ""' "$config_path")
    CUSTOM_TEST_TEMPLATE=$(jq -r '.custom_test_template // ""' "$config_path")
    
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
        
        BASE_DIR="$base_dir"
    elif [ -d "$config_path_or_dir" ]; then
        # New approach: auto-detect from directory
        log_info "Auto-detecting configuration from directory structure"
        BASE_DIR="$config_path_or_dir"
        auto_detect_config "$BASE_DIR"
    else
        log_error "Path not found: $config_path_or_dir (must be a file or directory)"
        exit 1
    fi
}

# Go-specific: Run protoc to generate Go code from proto files
# This function injects Go-specific go_package option into proto file temporarily
# The original proto file remains language-agnostic
run_protoc() {
    local proto_dir="$1"
    local dist_dir="$2"
    local proto_file="$3"
    local go_package_name="$4"
    local module_path="$5"
    
    log_info "Running protoc (Go-specific code generation)..."
    
    if ! command -v protoc &> /dev/null; then
        log_error "protoc is not installed but is required for this package"
        exit 1
    fi
    
    local proto_path="$proto_dir/$proto_file"
    local temp_proto_path="$proto_dir/${proto_file}.tmp"
    
    # Go-specific: Create temporary proto file with go_package option injected
    # This keeps the original proto file language-agnostic
    # We convert package_name (or package declaration) to go_package for protoc
    # For other languages, this would inject language-specific options (e.g., js_package for JS)
    if grep -q "option go_package" "$proto_path"; then
        # If go_package already exists, use the file as-is (backward compatibility)
        cp "$proto_path" "$temp_proto_path"
    else
        # Inject go_package option after package declaration
        # Format: option go_package = "import/path";
        # The package name in generated Go code will match the proto package declaration or package_name option
        sed -e "/^package /a\\
option go_package = \"${module_path}\";
" "$proto_path" > "$temp_proto_path"
    fi
    
    # Run protoc with the temporary proto file
    protoc --go_out="$dist_dir" \
           --go_opt=paths=source_relative \
           -I="$proto_dir" \
           "$temp_proto_path"
    
    # Clean up temporary file
    rm -f "$temp_proto_path"
    
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
    local template_file="$2"
    local base_dir="$3"
    
    log_info "Generating data_loader.go..."
    
    # Create data subdirectory
    local data_dir="$dist_dir/data"
    mkdir -p "$data_dir"
    
    # Copy data files based on configuration
    local source_data_dir="$base_dir/data"
    if [ -d "$source_data_dir" ]; then
        # New structure: data files in data/ directory
        if [ "$MULTIPLE_DATA_FILES" == "true" ]; then
            log_info "Copying all JSON files from data/ directory..."
            find "$source_data_dir" -maxdepth 1 -name "*.json" -type f -exec cp {} "$data_dir/" \;
        else
            # Copy single JSON file as data.json
            if [ -n "$DATA_FILE" ] && [ -f "$source_data_dir/$DATA_FILE" ]; then
                cp "$source_data_dir/$DATA_FILE" "$data_dir/data.json"
            else
                # Find first JSON file
                local first_json=$(find "$source_data_dir" -maxdepth 1 -name "*.json" -type f | head -1)
                if [ -n "$first_json" ]; then
                    cp "$first_json" "$data_dir/data.json"
                else
                    log_error "No data files found in $source_data_dir"
                    exit 1
                fi
            fi
        fi
    else
        # Old structure: data files in root
    if [ "$MULTIPLE_DATA_FILES" == "true" ]; then
        log_info "Copying all JSON files (multiple_data_files=true)..."
        # Copy all JSON files except schema.json and package-config.json
        find "$base_dir" -maxdepth 1 -name "*.json" ! -name "schema.json" ! -name "package-config.json" -exec cp {} "$data_dir/" \;
    else
        # Copy single JSON file
            if [ -n "$DATA_FILE" ] && [ "$DATA_FILE" != "data.json" ] && [ -f "$base_dir/$DATA_FILE" ]; then
                cp "$base_dir/$DATA_FILE" "$data_dir/data.json"
            else
                # Find first JSON file (excluding schema and config)
                local first_json=$(find "$base_dir" -maxdepth 1 -name "*.json" ! -name "schema.json" ! -name "package-config.json" -type f | head -1)
                if [ -n "$first_json" ]; then
                    cp "$first_json" "$data_dir/data.json"
                else
                    log_error "No data files found in $base_dir"
                    exit 1
                fi
            fi
        fi
    fi
    
    # Generate Go file from template by replacing template variables
    local output_file="$dist_dir/data_loader.go"
    
    sed -e "s/{{\.PackageName}}/$GO_PACKAGE_NAME/g" \
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
    
    sed -e "s/{{\.PackageName}}/$GO_PACKAGE_NAME/g" \
        -e "s/{{\.StructName}}/$STRUCT_NAME/g" \
        -e "s/{{\.RootJSONKey}}/$ROOT_JSON_KEY/g" \
        -e "s/{{\.RootFieldName}}/$ROOT_FIELD_NAME/g" \
        -e "s/{{\.DataContext}}/$DATA_CONTEXT/g" \
        "$test_template_file" > "$output_file"
}

# Go-specific: Initialize Go module
# This is Go-specific - other languages would have different module/package initialization
init_go_module() {
    local dist_dir="$1"
    
    log_info "Initializing Go module $MODULE_PATH..."
    
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

# Go-specific: Run serialization/deserialization test using Go test framework
# Other languages would use their own test frameworks (e.g., Jest for JS, pytest for Python)
run_serialization_test() {
    local dist_dir="$1"
    
    log_info "Running MANDATORY serialization/deserialization test (Go-specific)..."
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
        log_error "Usage: $0 <package-directory-or-config-file>"
        log_error "  New: $0 i18nify-data/currency"
        log_error "  Old: $0 i18nify-data/currency/package-config.json"
        exit 1
    fi
    
    local config_path_or_dir="$1"
    
    # Check dependencies
    check_dependencies
    
    # Load configuration (supports both old and new approaches)
    load_config "$config_path_or_dir"
    
    log_info "Generating $PACKAGE_NAME micro-package..."
    log_info "  Struct: $STRUCT_NAME"
    log_info "  Root JSON Key: $ROOT_JSON_KEY"
    log_info "  Module: $MODULE_PATH"
    log_info "  Has Proto: $HAS_PROTO"
    
    # Load templates - check package-specific templates first, then fallback to generator templates
    local generator_dir
    generator_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local template_dir="$generator_dir/templates"
    
    # Determine template files
    local go_template=""
    local test_template=""
    
    # Check for custom templates in package directory (new structure)
    if [ -n "$CUSTOM_TEMPLATE" ] && [ -f "$CUSTOM_TEMPLATE" ]; then
        # Absolute path provided
        go_template="$CUSTOM_TEMPLATE"
    elif [ -n "$CUSTOM_TEMPLATE" ] && [ "$CUSTOM_TEMPLATE" != "null" ] && [ -f "$BASE_DIR/templates/go/$CUSTOM_TEMPLATE" ]; then
        # Relative path in package templates directory
        go_template="$BASE_DIR/templates/go/$CUSTOM_TEMPLATE"
    elif [ -f "$BASE_DIR/templates/go/data_loader.template" ]; then
        # Default template in package directory
        go_template="$BASE_DIR/templates/go/data_loader.template"
    elif [ -f "$BASE_DIR/templates/go/go.template" ]; then
        # Alternative name in package directory
        go_template="$BASE_DIR/templates/go/go.template"
    elif [ -n "$CUSTOM_TEMPLATE" ] && [ "$CUSTOM_TEMPLATE" != "null" ] && [ -f "$template_dir/$CUSTOM_TEMPLATE" ]; then
        # Legacy: template in generator templates directory
        go_template="$template_dir/$CUSTOM_TEMPLATE"
    else
        # Default template
        go_template="$template_dir/go.template"
    fi
    
    # Check for custom test templates
    if [ -n "$CUSTOM_TEST_TEMPLATE" ] && [ -f "$CUSTOM_TEST_TEMPLATE" ]; then
        # Absolute path provided
        test_template="$CUSTOM_TEST_TEMPLATE"
    elif [ -n "$CUSTOM_TEST_TEMPLATE" ] && [ "$CUSTOM_TEST_TEMPLATE" != "null" ] && [ -f "$BASE_DIR/templates/go/$CUSTOM_TEST_TEMPLATE" ]; then
        # Relative path in package templates directory
        test_template="$BASE_DIR/templates/go/$CUSTOM_TEST_TEMPLATE"
    elif [ -f "$BASE_DIR/templates/go/data_loader_test.template" ]; then
        # Default test template in package directory
        test_template="$BASE_DIR/templates/go/data_loader_test.template"
    elif [ -n "$CUSTOM_TEST_TEMPLATE" ] && [ "$CUSTOM_TEST_TEMPLATE" != "null" ] && [ -f "$template_dir/$CUSTOM_TEST_TEMPLATE" ]; then
        # Legacy: template in generator templates directory
        test_template="$template_dir/$CUSTOM_TEST_TEMPLATE"
    else
        # Default test template
        test_template="$template_dir/data_loader_test.template"
    fi
    
    if [ ! -f "$go_template" ]; then
        log_error "Template file not found: $go_template"
        exit 1
    fi
    
    if [ ! -f "$test_template" ]; then
        log_error "Test template file not found: $test_template"
        exit 1
    fi
    
    # Set up directories and files
    # Use /tmp for temporary generation to avoid cluttering source tree
    local dist_dir="/tmp/i18nify-gen-$PACKAGE_NAME-$$"
    local proto_dir="$BASE_DIR/proto"
    
    # Create temporary directory for generation
    mkdir -p "$dist_dir"
    
    # Run protoc FIRST if needed (before generating data loader that references the struct)
    if [ "$HAS_PROTO" == "true" ]; then
        if [ -z "$PROTO_FILE" ] || [ "$PROTO_FILE" == "null" ]; then
            log_error "has_proto is true but proto_file is not specified or found"
            exit 1
        fi
        run_protoc "$proto_dir" "$dist_dir" "$PROTO_FILE" "$GO_PACKAGE_NAME" "$MODULE_PATH"
    fi
    
    # Generate data loader (after proto is generated)
    generate_data_loader "$dist_dir" "$go_template" "$BASE_DIR"
    
    # Generate test
    generate_data_loader_test "$dist_dir" "$test_template"
    
    # Initialize Go module
    init_go_module "$dist_dir"
    
    # Mandatory: Run serialization/deserialization test
    # Use custom test function if custom test template is used, otherwise use default
    if [ -n "$CUSTOM_TEST_TEMPLATE" ] && [ "$CUSTOM_TEST_TEMPLATE" != "null" ] && [ "$CUSTOM_TEST_TEMPLATE" != "" ]; then
        log_info "Running custom serialization test..."
        (
            cd "$dist_dir"
            # Try to find the test function name by grepping the test file
            TEST_FUNC=$(grep -h "^func Test" data_loader_test.go | head -1 | sed 's/func //' | sed 's/(.*//' | tr -d ' ')
            if [ -n "$TEST_FUNC" ]; then
                if ! go test -v -run "$TEST_FUNC" ./...; then
                    log_error "CRITICAL: Serialization/deserialization test failed. Package generation aborted."
                    exit 1
                fi
            else
                log_error "CRITICAL: Could not find test function in custom test template. Package generation aborted."
                exit 1
            fi
        )
        log_info "✓ Serialization/deserialization test passed. Data integrity verified."
    else
        run_serialization_test "$dist_dir"
    fi
    
    log_info "$PACKAGE_NAME micro-package generated successfully at $dist_dir"
    
    # Output the temp directory path to stdout (for workflow consumption)
    echo "$dist_dir"
}

# Run main function with all arguments
main "$@"