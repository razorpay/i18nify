#!/usr/bin/env bash

# Version Manager for i18nify Go Packages
# Handles versioning for beta (PR/development) and release (merged) scenarios

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[VERSION]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Get current version from git tags for a specific package
get_current_version() {
    local package_name="$1"
    local tag_prefix="${package_name}/v"
    
    # Get the latest tag for this package (e.g., currency/v1.2.3)
    local latest_tag=$(git tag -l "${tag_prefix}*" --sort=-version:refname | head -n 1 || echo "")
    
    if [ -z "$latest_tag" ]; then
        echo "0.0.0"
        return
    fi
    
    # Extract version from tag (e.g., currency/v1.2.3 -> 1.2.3)
    echo "$latest_tag" | sed "s|${tag_prefix}||"
}

# Increment version based on change type
increment_version() {
    local version="$1"
    local change_type="${2:-patch}"  # major, minor, patch
    
    IFS='.' read -r major minor patch <<< "$version"
    
    case "$change_type" in
        major)
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        minor)
            minor=$((minor + 1))
            patch=0
            ;;
        patch)
            patch=$((patch + 1))
            ;;
        *)
            log_error "Invalid change type: $change_type"
            exit 1
            ;;
    esac
    
    echo "${major}.${minor}.${patch}"
}

# Detect change type from commit messages or PR labels
detect_change_type() {
    local package_dir="$1"
    local base_ref="${2:-HEAD~1}"
    
    # Look for version hints in commit messages
    local commits=$(git log "${base_ref}..HEAD" --oneline -- "$package_dir" || echo "")
    
    if echo "$commits" | grep -iq "BREAKING CHANGE:\|^feat!:\|^fix!:"; then
        echo "major"
    elif echo "$commits" | grep -iq "^feat:\|^feature:"; then
        echo "minor"
    else
        echo "patch"
    fi
}

# Generate beta version
generate_beta_version() {
    local base_version="$1"
    local context="$2"  # pr, branch, commit
    local identifier="$3"  # PR number, branch name, or commit SHA
    
    # Increment patch for next beta
    local next_version=$(increment_version "$base_version" "patch")
    
    case "$context" in
        pr)
            echo "${next_version}-beta.pr${identifier}"
            ;;
        branch)
            # Sanitize branch name for version
            local safe_branch=$(echo "$identifier" | sed 's/[^a-zA-Z0-9.-]/-/g' | cut -c1-20)
            echo "${next_version}-beta.${safe_branch}"
            ;;
        commit)
            local short_sha=$(echo "$identifier" | cut -c1-7)
            echo "${next_version}-beta.${short_sha}"
            ;;
        *)
            echo "${next_version}-beta"
            ;;
    esac
}

# Generate release version
generate_release_version() {
    local current_version="$1"
    local change_type="$2"
    
    increment_version "$current_version" "$change_type"
}

# Main function
main() {
    local command="${1:-help}"
    
    case "$command" in
        get-current)
            # Get current version for a package
            # Usage: ./version-manager.sh get-current currency
            local package_name="${2:-}"
            if [ -z "$package_name" ]; then
                log_error "Package name required"
                exit 1
            fi
            get_current_version "$package_name"
            ;;
            
        generate-beta)
            # Generate beta version
            # Usage: ./version-manager.sh generate-beta currency pr 123
            local package_name="${2:-}"
            local context="${3:-commit}"
            local identifier="${4:-$(git rev-parse --short HEAD)}"
            
            if [ -z "$package_name" ]; then
                log_error "Package name required"
                exit 1
            fi
            
            local current=$(get_current_version "$package_name")
            local beta=$(generate_beta_version "$current" "$context" "$identifier")
            
            log_info "Current version: v${current}" >&2
            log_info "Beta version: v${beta}" >&2
            echo "$beta"
            ;;
            
        generate-release)
            # Generate release version
            # Usage: ./version-manager.sh generate-release currency [major|minor|patch]
            local package_name="${2:-}"
            local change_type="${3:-}"
            
            if [ -z "$package_name" ]; then
                log_error "Package name required"
                exit 1
            fi
            
            local current=$(get_current_version "$package_name")
            
            # Auto-detect change type if not provided
            if [ -z "$change_type" ]; then
                local package_dir="i18nify-data/$package_name"
                change_type=$(detect_change_type "$package_dir")
                log_info "Auto-detected change type: $change_type" >&2
            fi
            
            local release=$(generate_release_version "$current" "$change_type")
            
            log_info "Current version: v${current}" >&2
            log_info "Release version: v${release}" >&2
            echo "$release"
            ;;
            
        create-tag)
            # Create git tag for a package version
            # Usage: ./version-manager.sh create-tag currency 1.2.3
            local package_name="${2:-}"
            local version="${3:-}"
            
            if [ -z "$package_name" ] || [ -z "$version" ]; then
                log_error "Package name and version required"
                exit 1
            fi
            
            local tag="${package_name}/v${version}"
            
            if git rev-parse "$tag" >/dev/null 2>&1; then
                log_warning "Tag $tag already exists" >&2
                exit 0
            fi
            
            git tag -a "$tag" -m "Release ${package_name} v${version}"
            log_info "Created tag: $tag" >&2
            echo "$tag"
            ;;
            
        help|*)
            cat <<EOF
${BLUE}i18nify Version Manager${NC}

${GREEN}Usage:${NC}
  ./version-manager.sh <command> [arguments]

${GREEN}Commands:${NC}
  get-current <package>              Get current version from git tags
  generate-beta <package> [context] [id]  Generate beta version
  generate-release <package> [type]  Generate release version
  create-tag <package> <version>     Create git tag
  help                               Show this help message

${GREEN}Examples:${NC}
  # Get current version
  ./version-manager.sh get-current currency

  # Generate beta version for PR
  ./version-manager.sh generate-beta currency pr 123

  # Generate release version (auto-detect change type)
  ./version-manager.sh generate-release currency

  # Generate release version (explicit change type)
  ./version-manager.sh generate-release currency minor

  # Create git tag
  ./version-manager.sh create-tag currency 1.2.3

${GREEN}Contexts for Beta:${NC}
  pr <number>     - Beta for pull request (e.g., v1.2.3-beta.pr123)
  branch <name>   - Beta for branch (e.g., v1.2.3-beta.feature-x)
  commit <sha>    - Beta for commit (e.g., v1.2.3-beta.abc1234)

${GREEN}Change Types for Release:${NC}
  major  - Breaking changes (v1.0.0 -> v2.0.0)
  minor  - New features (v1.0.0 -> v1.1.0)
  patch  - Bug fixes (v1.0.0 -> v1.0.1)

${GREEN}Version Format:${NC}
  Release: v1.2.3
  Beta:    v1.2.3-beta.pr123

${GREEN}Tag Format:${NC}
  <package>/v<version>
  Example: currency/v1.2.3
EOF
            ;;
    esac
}

# Run main function
main "$@"

