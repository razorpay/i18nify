#!/usr/bin/env bash
# split-branches.sh — run from repo root
# Fetches base from origin/master, pushes branches to fork (upendra-kushwaha/i18nify).
set -euo pipefail

SOURCE="feat/business-entity-names-modules"
FETCH_REMOTE="origin"   # read-only: razorpay/i18nify
PUSH_REMOTE="fork"      # write: upendra-kushwaha/i18nify

# ── Preflight ──────────────────────────────────────────────────────────────
if ! git rev-parse --is-inside-work-tree &>/dev/null; then
  echo "ERROR: not inside a git repo." >&2; exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "ERROR: working tree is not clean. Commit or stash your changes first." >&2
  exit 1
fi

# ── Helper ─────────────────────────────────────────────────────────────────
# create_branch <branch-name> <commit-msg> <file1> [file2 ...]
create_branch() {
  local branch="$1" commit_msg="$2"; shift 2
  local files=("$@")

  echo ""
  echo "══════════════════════════════════════════════════"
  echo "  Branch : $branch  (${#files[@]} files)"
  echo "══════════════════════════════════════════════════"

  git fetch "$FETCH_REMOTE" master

  # Idempotent: delete local branch if it already exists
  git rev-parse --verify "$branch" &>/dev/null && git branch -D "$branch" || true

  # Branch directly from remote master — never touches local master
  git checkout -b "$branch" "$FETCH_REMOTE/master"

  # Cherry-pick only the target files from the source branch
  git checkout "$SOURCE" -- "${files[@]}"
  git add "${files[@]}"
  git commit -m "$commit_msg"
  git push -u "$PUSH_REMOTE" "$branch"

  echo "  ✓  $branch pushed to $PUSH_REMOTE"

  # Return to source branch for next iteration
  git checkout "$SOURCE"
}

# ══════════════════════════════════════════════════════════════════════════════
# PR 2 — Utility: business_entity  (17 files)
# ══════════════════════════════════════════════════════════════════════════════
create_branch "feat/business-entity" \
"feat(business_entity): add business_entity utility for data, Go, and JavaScript

- Add canonical i18nify-data/business_entity/data.json
- Add standalone Go data-loader module (i18nify-data/go/business_entity/)
- Add packages/i18nify-go business_entity module with tests
- Add packages/i18nify-js businessEntity module (getBusinessCategories,
  getBusinessSubCategories, getBusinessEntityType) with types and tests" \
  "i18nify-data/business_entity/data.json" \
  "i18nify-data/go/business_entity/business_entity.go" \
  "i18nify-data/go/business_entity/data/data.json" \
  "i18nify-data/go/business_entity/data_loader.go" \
  "i18nify-data/go/business_entity/data_loader_test.go" \
  "i18nify-data/go/business_entity/go.mod" \
  "packages/i18nify-go/modules/business_entity/business_entity.go" \
  "packages/i18nify-go/modules/business_entity/business_entity_test.go" \
  "packages/i18nify-js/src/modules/businessEntity/__tests__/getBusinessCategories.test.ts" \
  "packages/i18nify-js/src/modules/businessEntity/__tests__/getBusinessEntityType.test.ts" \
  "packages/i18nify-js/src/modules/businessEntity/__tests__/getBusinessSubCategories.test.ts" \
  "packages/i18nify-js/src/modules/businessEntity/data.ts" \
  "packages/i18nify-js/src/modules/businessEntity/getBusinessCategories.ts" \
  "packages/i18nify-js/src/modules/businessEntity/getBusinessEntityType.ts" \
  "packages/i18nify-js/src/modules/businessEntity/getBusinessSubCategories.ts" \
  "packages/i18nify-js/src/modules/businessEntity/index.ts" \
  "packages/i18nify-js/src/modules/businessEntity/types.ts"

# ══════════════════════════════════════════════════════════════════════════════
# PR 3 — Utility: names  (15 files)
# ══════════════════════════════════════════════════════════════════════════════
create_branch "feat/names" \
"feat(names): add names utility for data, Go, and JavaScript

- Add canonical i18nify-data/names/data.json
- Add standalone Go data-loader module (i18nify-data/go/names/)
- Add packages/i18nify-go names module with tests
- Add packages/i18nify-js names module (getHonorificTitles, isValidName)
  with types and tests" \
  "i18nify-data/names/data.json" \
  "i18nify-data/go/names/data/data.json" \
  "i18nify-data/go/names/data_loader.go" \
  "i18nify-data/go/names/data_loader_test.go" \
  "i18nify-data/go/names/go.mod" \
  "i18nify-data/go/names/names.go" \
  "packages/i18nify-go/modules/names/names.go" \
  "packages/i18nify-go/modules/names/names_test.go" \
  "packages/i18nify-js/src/modules/names/__tests__/getHonorificTitles.test.ts" \
  "packages/i18nify-js/src/modules/names/__tests__/isValidName.test.ts" \
  "packages/i18nify-js/src/modules/names/data.ts" \
  "packages/i18nify-js/src/modules/names/getHonorificTitles.ts" \
  "packages/i18nify-js/src/modules/names/index.ts" \
  "packages/i18nify-js/src/modules/names/isValidName.ts" \
  "packages/i18nify-js/src/modules/names/types.ts"

echo ""
echo "══════════════════════════════════════════════════"
echo "  All branches pushed. Open PRs:"
echo "    gh pr create --repo razorpay/i18nify --base master --head upendra-kushwaha:feat/skill-utility-creator"
echo "    gh pr create --repo razorpay/i18nify --base master --head upendra-kushwaha:feat/business-entity"
echo "    gh pr create --repo razorpay/i18nify --base master --head upendra-kushwaha:feat/names"
echo "══════════════════════════════════════════════════"
