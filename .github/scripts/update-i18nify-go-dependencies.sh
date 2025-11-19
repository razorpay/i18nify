#!/usr/bin/env bash

# Update i18nify-go dependencies to latest versions
# This script updates the dependency versions in packages/i18nify-go/go.mod
# to use the latest tagged versions of i18nify-data Go packages

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[UPDATE]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
VERSION_MANAGER="$SCRIPT_DIR/version-manager.sh"
I18NIFY_GO_DIR="$PROJECT_ROOT/packages/i18nify-go"

# Check if version-manager.sh exists
if [ ! -f "$VERSION_MANAGER" ]; then
    log_error "version-manager.sh not found at $VERSION_MANAGER"
    exit 1
fi

# Check if i18nify-go directory exists
if [ ! -d "$I18NIFY_GO_DIR" ]; then
    log_error "i18nify-go directory not found at $I18NIFY_GO_DIR"
    exit 1
fi

# Function to update a specific dependency
update_dependency() {
    local package_name="$1"
    local module_path="github.com/razorpay/i18nify/i18nify-data/go/${package_name}"
    
    log_info "Checking ${package_name} package..."
    
    # Get the version (use FORCE_VERSION if provided, otherwise query git tags)
    local version
    if [ -n "${FORCE_VERSION:-}" ]; then
        version="$FORCE_VERSION"
        log_info "Using provided version: v${version}"
    else
        version=$("$VERSION_MANAGER" get-current "$package_name")
        log_info "Latest ${package_name} version from git tags: v${version}"
    fi
    
    if [ "$version" = "0.0.0" ]; then
        log_warning "No version found for ${package_name}, skipping"
        return 0
    fi
    
    # Update the dependency in go.mod
    cd "$I18NIFY_GO_DIR"
    
    # Check if dependency exists in go.mod
    if grep -q "$module_path" go.mod; then
        log_info "Updating ${package_name} to v${version}..."
        
        # Remove replace directive if it exists
        if grep -q "replace ${module_path} =>" go.mod; then
            log_info "Removing local replace directive for ${package_name}..."
            go mod edit -dropreplace "${module_path}"
        fi
        
        # Update to the tagged version
        go mod edit -require "${module_path}@v${version}"
        
        log_info "✅ Updated ${package_name} to use git tag v${version}"
    else
        log_warning "${package_name} not found in go.mod, skipping"
        return 0
    fi
}

# Main function
main() {
    local package_name="${1:-}"
    
    cd "$I18NIFY_GO_DIR"
    
    log_info "Updating i18nify-go dependencies..."
    
    if [ -n "$package_name" ]; then
        # Update specific package
        update_dependency "$package_name"
    else
        # Update all known packages
        log_info "Updating all dependencies..."
        
        # List of known data packages
        local packages=("currency")
        
        for pkg in "${packages[@]}"; do
            update_dependency "$pkg"
        done
    fi
    
    # Run go mod tidy to clean up
    log_info "Running go mod tidy..."
    go mod tidy
    
    log_info "Running tests..."
    if go test ./... -v; then
        log_info "✅ All tests passed!"
    else
        log_error "Tests failed. Please review the changes."
        exit 1
    fi
    
    log_info "✅ Dependencies updated successfully!"
    log_info ""
    log_info "Changes made to:"
    log_info "  - packages/i18nify-go/go.mod"
    log_info "  - packages/i18nify-go/go.sum"
    log_info ""
    log_info "Review the changes and commit them if everything looks good."
}

# Help message
show_help() {
    cat <<EOF
${BLUE}Update i18nify-go Dependencies${NC}

${GREEN}Usage:${NC}
  ./update-i18nify-go-dependencies.sh [package-name]

${GREEN}Arguments:${NC}
  package-name    (Optional) Specific package to update (e.g., currency)
                  If not provided, updates all dependencies

${GREEN}Examples:${NC}
  # Update all dependencies
  ./update-i18nify-go-dependencies.sh

  # Update only currency dependency
  ./update-i18nify-go-dependencies.sh currency

${GREEN}What this script does:${NC}
  1. Gets the latest tagged version of the specified package(s)
  2. Updates the dependency version in packages/i18nify-go/go.mod
  3. Runs go mod tidy to update go.sum
  4. Runs tests to ensure everything works
  5. Reports the changes made

${GREEN}Notes:${NC}
  - This script requires Go to be installed
  - Changes are not committed automatically
  - Review the changes before committing
EOF
}

# Parse arguments
if [ $# -eq 0 ]; then
    main
elif [ "$1" = "help" ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
else
    main "$1"
fi

