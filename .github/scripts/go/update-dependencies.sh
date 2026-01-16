#!/usr/bin/env bash

# Update i18nify-go dependencies to use generated packages
# This script updates go.mod to reference generated packages by commit SHA or tag
#
# Usage: 
#   ./update-dependencies.sh <package-path> [version]
#   ./update-dependencies.sh country/subdivisions              # Uses current HEAD
#   ./update-dependencies.sh country/subdivisions v1.0.0       # Uses specific tag
#   ./update-dependencies.sh country/subdivisions abc123def    # Uses specific commit

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
VERSION="${2:-}"

if [ -z "$PACKAGE_PATH" ]; then
    log_error "Package path required"
    echo "Usage: $0 <package-path> [version]"
    echo "Examples:"
    echo "  $0 country/subdivisions           # Uses current HEAD commit"
    echo "  $0 country/subdivisions v1.0.0    # Uses specific tag"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
I18NIFY_GO_DIR="$PROJECT_ROOT/packages/i18nify-go"

# Module path for the data package
MODULE_PATH="github.com/razorpay/i18nify/i18nify-data/go/$PACKAGE_PATH"

# --- Determine Version ---
if [ -z "$VERSION" ]; then
    # No version provided, use current HEAD commit
    COMMIT_SHA=$(git rev-parse HEAD)
    SHORT_SHA=$(echo "$COMMIT_SHA" | cut -c1-12)
    TIMESTAMP=$(TZ=UTC git show -s --format=%cd --date=format-local:%Y%m%d%H%M%S "$COMMIT_SHA")
    VERSION="v0.0.0-${TIMESTAMP}-${SHORT_SHA}"
    log_info "Using pseudo-version from HEAD: $VERSION"
elif [[ "$VERSION" == v* ]]; then
    # Version starts with 'v', assume it's a tag
    log_info "Using tag version: $VERSION"
else
    # Assume it's a commit SHA
    SHORT_SHA=$(echo "$VERSION" | cut -c1-12)
    TIMESTAMP=$(TZ=UTC git show -s --format=%cd --date=format-local:%Y%m%d%H%M%S "$VERSION")
    VERSION="v0.0.0-${TIMESTAMP}-${SHORT_SHA}"
    log_info "Using pseudo-version from commit: $VERSION"
fi

# --- Update go.mod ---
cd "$I18NIFY_GO_DIR"

log_info "Updating $MODULE_PATH to $VERSION"

# Remove replace directive if it exists
if grep -q "replace ${MODULE_PATH}" go.mod; then
    log_info "Removing replace directive..."
    go mod edit -dropreplace "${MODULE_PATH}"
fi

# Update or add the require directive
log_info "Setting require directive..."
go mod edit -require "${MODULE_PATH}@${VERSION}"

# Run go mod tidy
log_info "Running go mod tidy..."
go mod tidy 2>/dev/null || log_warning "go mod tidy had warnings"

log_info "✅ Updated $MODULE_PATH to $VERSION"
log_info ""
log_info "Updated go.mod:"
grep "$MODULE_PATH" go.mod || true

echo ""
echo "To verify, run: cd packages/i18nify-go && go build ./..."

