# i18nify CI/CD Scripts

This directory contains scripts used in GitHub Actions workflows for automating Go package generation, versioning, and dependency management.

## Scripts Overview

### 1. `version-manager.sh`

Manages versioning for i18nify Go packages. Handles both beta (PR/development) and release versions.

**Features:**
- Get current version from git tags
- Generate beta versions for PRs and branches
- Generate release versions with semantic versioning
- Create and manage git tags
- Auto-detect change types (major/minor/patch) from commit messages

**Usage:**

```bash
# Get current version
./version-manager.sh get-current currency

# Generate beta version for PR
./version-manager.sh generate-beta currency pr 123

# Generate release version (auto-detect change type)
./version-manager.sh generate-release currency

# Create git tag
./version-manager.sh create-tag currency 1.2.3
```

**Tag Format:** `go-<package>-v<version>` (e.g., `go-currency-v1.2.3`)

**Version Formats:**
- Release: `v1.2.3`
- Beta: `v1.2.3-beta.pr123`, `v1.2.3-beta.feature-x`

### 2. `generate-package.sh`

Generates Go packages from i18nify-data source files. Handles protobuf compilation and data file copying.

**Features:**
- Validates package configuration
- Compiles protocol buffers if needed
- Generates Go code and data files
- Creates package structure in dist directory

**Usage:**

```bash
./generate-package.sh currency
```

**Requirements:**
- `jq` for JSON processing
- `protoc` and `protoc-gen-go` for packages with protobuf files
- Package must have `package-config.json` in `i18nify-data/<package>/`

### 3. `update-i18nify-go-dependencies.sh` ⚡ NEW

Updates the `packages/i18nify-go` package to use the latest versions of i18nify-data Go packages.

**Features:**
- Gets latest tagged versions of data packages
- Updates dependency versions in go.mod
- Runs go mod tidy to update go.sum
- Runs tests to verify changes
- Can update specific package or all packages

**Usage:**

```bash
# Update all dependencies
./update-i18nify-go-dependencies.sh

# Update only currency dependency
./update-i18nify-go-dependencies.sh currency
```

**What it does:**
1. Gets the latest tagged version of the specified package(s)
2. Updates the dependency version in `packages/i18nify-go/go.mod`
3. Runs `go mod tidy` to update `go.sum`
4. Runs tests to ensure everything works
5. Reports the changes made

**Manual Usage:**

When you want to manually update dependencies:

```bash
cd .github/scripts
./update-i18nify-go-dependencies.sh currency
cd ../../packages/i18nify-go
git add go.mod go.sum
git commit -m "chore: update currency dependency to vX.Y.Z"
git push
```

## Workflow Integration

### Auto-Generate Go Packages Workflow

The main workflow (`.github/workflows/auto-generate-go-packages.yml`) uses these scripts to:

1. **Detect Changes:** Identify which data packages have been modified
2. **Generate Packages:** Run `generate-package.sh` for each changed package
3. **Version Management:** Use `version-manager.sh` to create appropriate versions
4. **Update Dependencies:** Run `update-i18nify-go-dependencies.sh` to sync versions

### Workflow Jobs:

#### 1. `detect-changes`
Detects which packages in `i18nify-data/` have changed.

#### 2. `generate-packages`
Generates Go packages for changed data packages:
- Runs on PRs (beta versions) and master (release versions)
- Creates versions based on context (PR number, branch name, or release)
- Commits generated code and creates git tags for releases

#### 3. `update-i18nify-go-dependencies` ⚡ NEW
Automatically updates `i18nify-go` package dependencies:
- **Trigger:** Runs when currency package is updated on master branch
- **Actions:**
  - Gets latest currency version from git tags
  - Updates `packages/i18nify-go/go.mod` with new version
  - Runs tests to verify compatibility
  - Commits and pushes changes to master
- **Condition:** Only runs for release versions on master branch

### Dependency Update Flow

When a currency data change is pushed to master:

```
1. i18nify-data/currency/ modified
   ↓
2. detect-changes job detects currency changes
   ↓
3. generate-packages job:
   - Generates new currency Go package
   - Creates version (e.g., v1.2.3)
   - Commits to i18nify-data/go/currency/
   - Creates tag: go-currency-v1.2.3
   ↓
4. update-i18nify-go-dependencies job:
   - Detects currency was updated
   - Gets latest version (v1.2.3)
   - Updates packages/i18nify-go/go.mod
   - Runs tests
   - Commits and pushes changes
```

## Versioning Strategy

### Semantic Versioning

Versions follow [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

**Auto-detection from commit messages:**
- `BREAKING CHANGE:` or `feat!:` → Major version bump
- `feat:` or `feature:` → Minor version bump
- Everything else → Patch version bump

### Beta Versions

For PRs and development branches:
- Format: `v1.2.3-beta.pr123` or `v1.2.3-beta.feature-x`
- Helps test changes before release
- Not tagged in git

### Release Versions

For master branch merges:
- Format: `v1.2.3`
- Creates git tag: `go-<package>-v1.2.3`
- Triggers dependency updates

## Testing

### Local Testing

Test the scripts locally before pushing:

```bash
# Test version manager
.github/scripts/version-manager.sh get-current currency

# Test package generation
.github/scripts/generate-package.sh currency

# Test dependency update (dry-run by reviewing changes before commit)
.github/scripts/update-i18nify-go-dependencies.sh currency
```

### CI Testing

The workflow automatically:
1. Runs on PRs to validate generated code
2. Runs on master to create releases
3. Runs tests after dependency updates

## Requirements

### System Dependencies

- **Go 1.20+**: For Go module operations
- **jq**: JSON processing
- **protoc**: Protocol buffer compiler (for packages with .proto files)
- **protoc-gen-go**: Go protobuf plugin

### Installation

**macOS:**
```bash
brew install go jq protobuf
go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.31.0
```

**Linux (Ubuntu):**
```bash
sudo apt-get update
sudo apt-get install -y golang jq protobuf-compiler
go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.31.0
```

## Troubleshooting

### Common Issues

**1. "No version found" error**

The package doesn't have any tags yet. First release will be `v0.0.1`.

**2. Tests fail after dependency update**

The new version may have breaking changes. Review the changes and update consuming code.

**3. Script permission denied**

Make scripts executable:
```bash
chmod +x .github/scripts/*.sh
```

**4. go mod tidy fails**

Ensure you're in the correct directory and Go is properly installed:
```bash
cd packages/i18nify-go
go version
go mod tidy
```

## Adding New Data Packages

To add a new data package to the automated flow:

1. Create package in `i18nify-data/<package-name>/`
2. Add `package-config.json` with package configuration
3. Update `detect-changes` job in workflow to include new package path
4. Add package to the list in `update-i18nify-go-dependencies.sh` if it's a dependency
5. Test locally with `generate-package.sh <package-name>`

## Contributing

When modifying these scripts:

1. Test locally first
2. Update this README with any changes
3. Ensure backward compatibility
4. Add comments for complex logic
5. Follow the existing code style

## Support

For issues or questions:
- Check the GitHub Actions logs for detailed error messages
- Review this README for usage examples
- Test scripts locally to debug issues
- Open an issue in the repository

---

**Last Updated:** November 2025

