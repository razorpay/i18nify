#!/usr/bin/env bash
# run_evals.sh — orchestrates all utility-creator evals.
#
# Usage (from repo root):
#   bash .claude/skills/utility-creator/evals/run_evals.sh
#
# Optional flags:
#   -v   verbose (show individual test names)
#   -k <pattern>  run only matching tests (passed to pytest -k)
#
# Exit code: 0 = all pass, 1 = any failure.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
EVALS_DIR="$REPO_ROOT/.claude/skills/utility-creator/evals"

cd "$REPO_ROOT"

# ── Python interpreter (prefer venv) ─────────────────────────────────────────
VENV_PY="$REPO_ROOT/venv/bin/python"
PY="${VENV_PY:-python3}"
if [ ! -x "$PY" ]; then PY="python3"; fi

echo "=== utility-creator evals ==="
echo "    python : $PY"
echo "    dir    : $EVALS_DIR"
echo ""

# ── Parse flags ───────────────────────────────────────────────────────────────
VERBOSE=""
KFLAG=""
while [[ $# -gt 0 ]]; do
  case $1 in
    -v) VERBOSE="-v" ;;
    -k) KFLAG="-k $2"; shift ;;
    *)  echo "Unknown flag: $1"; exit 1 ;;
  esac
  shift
done

# ── Install test dependencies (idempotent) ────────────────────────────────────
"$PY" -m pip install "pytest==8.2.2" -q 2>&1 | tail -1

# ── Eval modules (order = fast → slow) ───────────────────────────────────────
EVAL_MODULES=(
  "test_synonyms.py"          # pure Python, no I/O
  "test_scoring.py"           # pure Python, no I/O
  "test_cache_routing.py"     # creates/reads temp files
  "test_data_precision.py"    # reads canonical data from repo
  "test_recipe8_structure.py" # subprocess Recipe 8 in temp dir (slowest)
  "test_output_quality.py"    # data.json + utils code quality rubric (slowest)
)

PASS=0
FAIL=0
SKIP=0
ERRORS=()

for module in "${EVAL_MODULES[@]}"; do
  module_path="$EVALS_DIR/$module"
  echo "── $module"

  if ! "$PY" -m pytest "$module_path" $VERBOSE $KFLAG --tb=short -q 2>&1; then
    FAIL=$((FAIL + 1))
    ERRORS+=("$module")
  else
    PASS=$((PASS + 1))
  fi
  echo ""
done

# ── Quality report (rubric-style score card) ──────────────────────────────────
echo "── Quality Report"
"$PY" "$EVALS_DIR/test_output_quality.py" --report 2>/dev/null || true
echo ""

# ── Summary ───────────────────────────────────────────────────────────────────
echo "══════════════════════════════════════════"
echo "  EVAL SUMMARY"
echo "  Passed modules : $PASS / $((PASS + FAIL))"

if [[ $FAIL -eq 0 ]]; then
  echo "  Result         : ALL PASS"
  echo "══════════════════════════════════════════"
  exit 0
else
  echo "  Failed modules :"
  for e in "${ERRORS[@]}"; do echo "    ✗ $e"; done
  echo "  Result         : FAIL"
  echo "══════════════════════════════════════════"
  exit 1
fi
