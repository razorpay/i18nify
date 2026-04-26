# Releasing i18nify-php

This document describes how to create releases for the i18nify PHP SDK.

## Prerequisites

- Write access to the repository
- Ability to trigger GitHub Actions workflows

## Release Process

The i18nify PHP SDK uses Git tags and GitHub Releases for version management. Packagist automatically detects new releases and makes them available via Composer.

### 1. GitHub Actions Release (Recommended)

Use the GitHub Actions workflow for streamlined releases:

1. Go to the **Actions** tab in the GitHub repository
2. Select the **(i18nify-php) Release** workflow
3. Click **Run workflow**
4. Enter the version number (e.g., `1.0.0`)
5. Click **Run workflow**

This will:
- Run all tests to ensure quality
- Update the version in `composer.json`
- Create a git tag with format `php-v{version}`
- Generate a changelog from commit history
- Create a GitHub Release
- Notify that Packagist will automatically pick up the release

### 2. Manual Release

If you prefer manual control:

1. **Update the version** in `composer.json`:
   ```json
   {
     "name": "razorpay/i18nify-php",
     "version": "1.0.0",
     ...
   }
   ```

2. **Update CHANGELOG.md** with the new version and changes

3. **Commit the changes**:
   ```bash
   git add packages/i18nify-php/composer.json packages/i18nify-php/CHANGELOG.md
   git commit -m "chore(php): bump version to 1.0.0"
   ```

4. **Create and push the tag**:
   ```bash
   git tag php-v1.0.0
   git push origin php-v1.0.0
   ```

5. **Create GitHub Release**:
   - Go to the GitHub repository
   - Click **Releases** → **Create a new release**
   - Choose the tag `php-v1.0.0`
   - Set title: `i18nify-php v1.0.0`
   - Add release notes
   - Click **Publish release**

## Version Schema

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version (X.0.0): Breaking changes
- **MINOR** version (0.X.0): New features, backwards compatible
- **PATCH** version (0.0.X): Bug fixes, backwards compatible

## Git Tag Format

PHP SDK releases use the format: `php-v{version}`

Examples:
- `php-v1.0.0` - Major release
- `php-v1.1.0` - Minor release  
- `php-v1.0.1` - Patch release

## Packagist Integration

Once a GitHub release is created:

1. **Packagist Auto-Detection**: Packagist automatically detects new releases within a few minutes
2. **Availability**: The new version becomes available via `composer require razorpay/i18nify-php`
3. **Verification**: Check https://packagist.org/packages/razorpay/i18nify-php for the new version

## Pre-Release Checklist

Before creating a release:

- [ ] All tests pass (`composer test`)
- [ ] Static analysis passes (`composer phpstan`)
- [ ] Code style is consistent (`composer phpcs`)
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated with new features/fixes
- [ ] Version number follows semantic versioning
- [ ] No breaking changes in minor/patch releases

## Post-Release Checklist

After creating a release:

- [ ] Verify the GitHub release was created successfully
- [ ] Check that Packagist shows the new version (may take a few minutes)
- [ ] Test installation: `composer require razorpay/i18nify-php:^{version}`
- [ ] Update any dependent projects or documentation

## Rollback Process

If a release needs to be rolled back:

1. **Delete the GitHub release** (if not yet stable)
2. **Delete the git tag**:
   ```bash
   git tag -d php-v1.0.0
   git push origin :refs/tags/php-v1.0.0
   ```
3. **Contact Packagist** if the version was already published

## Troubleshooting

### GitHub Actions Workflow Fails
- Check the Actions tab for error details
- Ensure all tests pass locally first
- Verify the version format is correct

### Packagist Not Updating
- Wait 10-15 minutes for auto-sync
- Check the Packagist webhook is configured
- Manually trigger update on Packagist if needed

### Version Conflicts
- Ensure the version doesn't already exist
- Check that the version follows semantic versioning
- Verify git tags are unique
