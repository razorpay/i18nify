"""
test_functional.py — Functional / behavioural evaluation for utility-creator.

Unlike test_execution_harness.py (infrastructure: file existence, JSON validity,
proto syntax, gofmt), these tests verify ACTUAL SKILL BEHAVIOUR:

  Class 1 — TestSkillSimulation
      Simulates invoking the skill with the prompt "Add a formatCurrency utility
      for Japan".  Uses a Japan/JPY fixture and verifies the output reflects the
      prompt — correct data, correct module name, no error tokens.

  Class 2 — TestGeneratedFileContent
      Verifies that generated TypeScript files contain functionally correct code:
      correct imports, exported function signatures, error-boundary wrapping,
      null-safe lookups, and meaningful test assertions.

  Class 3 — TestIndexTsBarrelExport
      Verifies that packages/i18nify-js/src/index.ts is updated to export the
      new module so consumers can import from the package root.

  Class 4 — TestDataJsonJapanEntry
      Verifies that data.json contains a structurally complete entry for Japan
      (JPY), with all required fields populated and correct ISO values.

  Class 5 — TestTypeScriptCompilation
      Writes the generated module into the real packages/i18nify-js/src/modules/
      directory under a temp name and runs `tsc --noEmit` to catch broken imports
      or type errors before they reach CI.
      Skipped when node_modules is absent (yarn install has not been run).

  Class 6 — TestProjectBuildStability
      Runs `yarn build` in the real JS package after writing the generated module,
      verifying no compilation regressions.
      Skipped when node_modules is absent.

  Class 7 — TestProjectDevServer
      Starts `yarn dev` for a few seconds and confirms the compiler emits no
      TypeScript errors or "Module not found" messages during startup.
      Skipped when node_modules is absent.

  Class 8 — TestYarnTestSuite
      Runs `yarn test --testPathPattern` scoped to the generated test file and
      verifies it passes.
      Skipped when node_modules is absent.

Run with pytest:
    python3 -m pytest test_functional.py -v

Run standalone:
    python3 test_functional.py
"""

import json
import os
import re
import shutil
import subprocess
import sys
import time
import tempfile
import unittest
from typing import Any, Dict, List, Optional

# ── Paths ─────────────────────────────────────────────────────────────────────

REPO_ROOT   = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
RUNNER_JS   = os.path.join(os.path.dirname(__file__), "fixtures", "recipe8_runner.py")
RUNNER_GO   = os.path.join(os.path.dirname(__file__), "fixtures", "recipe8go_runner.py")
VENV_PY     = os.path.join(REPO_ROOT, "venv", "bin", "python")
PYTHON      = VENV_PY if os.path.isfile(VENV_PY) else sys.executable
JS_PKG_DIR  = os.path.join(REPO_ROOT, "packages", "i18nify-js")
YARN        = shutil.which("yarn") or "yarn"
TSC_BIN     = os.path.join(JS_PKG_DIR, "node_modules", ".bin", "tsc")

# Temp module name written into the real JS package for build/tsc/test checks.
# Uses a double-underscore prefix so it is trivially .gitignore-able and clearly
# a test artefact, not a shipped module.
_TEMP_MODULE = "__uc_functest__"

# ── Environment probes (evaluated once at import time) ────────────────────────

_HAS_NODE_MODULES = os.path.isdir(os.path.join(JS_PKG_DIR, "node_modules"))
_HAS_TSC          = os.path.isfile(TSC_BIN)
_HAS_YARN         = bool(shutil.which("yarn"))
_HAS_PKG_JSON     = os.path.isfile(os.path.join(JS_PKG_DIR, "package.json"))
_SKIP_YARN        = not (_HAS_YARN and _HAS_PKG_JSON and _HAS_NODE_MODULES)
_SKIP_REASON      = (
    "Skipped: "
    + (", ".join(filter(None, [
        "yarn not in PATH"        if not _HAS_YARN        else "",
        "package.json missing"    if not _HAS_PKG_JSON    else "",
        "node_modules missing — run `yarn install`" if not _HAS_NODE_MODULES else "",
    ])) or "prerequisites met")
)

# ── Japan/JPY fixture ─────────────────────────────────────────────────────────
#
# Simulates the skill being invoked with:
#   "Add a formatCurrency utility for Japan"
#
# JPY is the primary row; four additional currencies provide realistic coverage.

TOPIC_KEY = "currency_codes"

JAPAN_FIXTURE_ROWS: List[Dict[str, str]] = [
    {"cc": "JPY", "name": "Yen",            "numeric_code": "392", "minor_unit": "0", "symbol": "¥"},
    {"cc": "USD", "name": "US Dollar",      "numeric_code": "840", "minor_unit": "2", "symbol": "$"},
    {"cc": "EUR", "name": "Euro",           "numeric_code": "978", "minor_unit": "2", "symbol": "€"},
    {"cc": "INR", "name": "Indian Rupee",   "numeric_code": "356", "minor_unit": "2", "symbol": "₹"},
    {"cc": "GBP", "name": "Pound Sterling", "numeric_code": "826", "minor_unit": "2", "symbol": "£"},
]

FIXTURE_RESULT: Dict[str, Any] = {
    "topic":           TOPIC_KEY,
    "from_cache":      False,
    "cache_freshness": 0.97,
    "conflict_count":  0,
    "conflicts":       [],
    "all_sources":     [],
    "winner": {
        "tier":    1,
        "name":    "SIX Group XML",
        "url":     "https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml",
        "score":   91,
        "rows":    JAPAN_FIXTURE_ROWS,
        "factors": {},
    },
}

# ── Module-level state (initialised by setUpModule) ───────────────────────────

_WS: str = ""               # isolated temp workspace
_JS_PROC: Optional[subprocess.CompletedProcess] = None
_GO_PROC: Optional[subprocess.CompletedProcess] = None


# ── Workspace helpers ─────────────────────────────────────────────────────────

def _make_minimal_project(root: str) -> None:
    """Scaffold the minimum directory structure the recipe runners expect."""
    os.makedirs(os.path.join(root, "packages", "i18nify-js", "src", "modules"), exist_ok=True)
    go_pkg = os.path.join(root, "packages", "i18nify-go")
    os.makedirs(go_pkg, exist_ok=True)
    with open(os.path.join(go_pkg, "go.mod"), "w") as f:
        f.write("module github.com/razorpay/i18nify/packages/i18nify-go\n\ngo 1.21\n\nrequire (\n)\n")
    with open(os.path.join(root, "packages", "i18nify-js", "src", "index.ts"), "w") as f:
        f.write("// barrel\n")


def _run_runner(script: str, fixture_path: str) -> subprocess.CompletedProcess:
    env = {**os.environ,
           "UC_TOPIC_KEY":       TOPIC_KEY,
           "UC_PROJECT_ROOT":    _WS,
           "UC_TSF_RESULT_PATH": fixture_path}
    return subprocess.run([PYTHON, script], capture_output=True, text=True, env=env, cwd=REPO_ROOT)


def _ws_path(rel: str) -> str:
    return os.path.join(_WS, rel)


def _read(rel: str) -> str:
    with open(_ws_path(rel), encoding="utf-8") as fh:
        return fh.read()


def _load_json(rel: str) -> Any:
    with open(_ws_path(rel), encoding="utf-8") as fh:
        return json.load(fh)


def _copy_module_to_real_pkg(src_module: str, dest_name: str) -> Optional[str]:
    """Copy workspace module dir into the real JS package under dest_name."""
    src  = os.path.join(_WS, "packages", "i18nify-js", "src", "modules", src_module)
    dest = os.path.join(JS_PKG_DIR, "src", "modules", dest_name)
    if not os.path.isdir(src):
        return None
    shutil.copytree(src, dest, dirs_exist_ok=True)
    return dest


def _cleanup_real_pkg_module(dest_name: str) -> None:
    path = os.path.join(JS_PKG_DIR, "src", "modules", dest_name)
    if os.path.isdir(path):
        shutil.rmtree(path, ignore_errors=True)


# ── Module-level setup / teardown ─────────────────────────────────────────────

def setUpModule() -> None:
    global _WS, _JS_PROC, _GO_PROC

    _WS = tempfile.mkdtemp(prefix="uc_functional_")
    _make_minimal_project(_WS)

    fixture_path = os.path.join(_WS, "tsf_result.json")
    with open(fixture_path, "w") as fh:
        json.dump(FIXTURE_RESULT, fh)

    _JS_PROC = _run_runner(RUNNER_JS, fixture_path)
    if _JS_PROC.returncode != 0:
        raise RuntimeError(
            "recipe8_runner.py failed — harness cannot proceed.\n"
            "stdout: %s\nstderr: %s" % (_JS_PROC.stdout[:500], _JS_PROC.stderr[:500])
        )
    _GO_PROC = _run_runner(RUNNER_GO, fixture_path)


def tearDownModule() -> None:
    shutil.rmtree(_WS, ignore_errors=True)
    _cleanup_real_pkg_module(_TEMP_MODULE)


# =============================================================================
# Class 1 — Skill Simulation
# =============================================================================

class TestSkillSimulation(unittest.TestCase):
    """
    Simulate invoking the skill with "Add a formatCurrency utility for Japan".

    Verifies the runner exits cleanly, emits only protocol tokens (no code leaks),
    generates the right module name, and reports the expected entry count.
    """

    def test_js_runner_exits_zero(self):
        self.assertEqual(
            _JS_PROC.returncode, 0,
            "Skill invocation failed.\nstderr: %s" % _JS_PROC.stderr[:400],
        )

    def test_no_utility_error_token(self):
        self.assertNotIn(
            "UTILITY_ERROR", _JS_PROC.stdout,
            "UTILITY_ERROR in runner output — skill reported failure",
        )

    def test_no_traceback_in_stderr(self):
        self.assertNotIn(
            "Traceback", _JS_PROC.stderr,
            "Python traceback in runner stderr:\n" + _JS_PROC.stderr[:400],
        )

    def test_utility_done_emitted_for_currency_module(self):
        self.assertIn(
            "UTILITY_DONE|currency|",
            _JS_PROC.stdout,
            "UTILITY_DONE|currency| missing — module was not generated",
        )

    def test_utility_done_reports_correct_entry_count(self):
        expected = "entries=%d" % len(JAPAN_FIXTURE_ROWS)
        self.assertIn(
            expected, _JS_PROC.stdout,
            "UTILITY_DONE must report %s (one per fixture row)" % expected,
        )

    def test_only_protocol_tokens_in_stdout(self):
        """Strict output contract — no raw source code may appear in stdout."""
        allowed = re.compile(r"^(WROTE\||UTILITY_DONE\||UTILITY_ERROR\|)")
        for line in _JS_PROC.stdout.strip().splitlines():
            if line.strip():
                self.assertTrue(
                    allowed.match(line),
                    "Code leak in runner stdout: %r" % line,
                )

    def test_every_wrote_token_points_to_currency_module(self):
        """All WROTE| paths must be under the currency module or i18nify-data."""
        for line in _JS_PROC.stdout.splitlines():
            if not line.startswith("WROTE|"):
                continue
            path = line[len("WROTE|"):]
            self.assertTrue(
                "currency" in path or "i18nify-data" in path,
                "WROTE| path is outside expected module tree: %s" % path,
            )


# =============================================================================
# Class 2 — Generated File Content Quality
# =============================================================================

class TestGeneratedFileContent(unittest.TestCase):
    """
    Verify that generated TypeScript files contain functionally correct code —
    not just that they exist, but that the code inside them would actually work
    when consumed by downstream packages.
    """

    # ── types.ts ──────────────────────────────────────────────────────────────

    def test_types_ts_imports_from_config_json(self):
        rel = "packages/i18nify-js/src/modules/currency/types.ts"
        if not os.path.isfile(_ws_path(rel)):
            self.skipTest(rel + " not present")
        self.assertIn(
            "currencyConfig.json", _read(rel),
            "types.ts must import from the module-local currencyConfig.json",
        )

    def test_types_ts_exports_currency_code_type(self):
        rel = "packages/i18nify-js/src/modules/currency/types.ts"
        if not os.path.isfile(_ws_path(rel)):
            self.skipTest(rel + " not present")
        content = _read(rel)
        self.assertIn("export type", content, "types.ts must export a named type")
        self.assertRegex(
            content, r"CurrencyCodeType",
            "types.ts must export CurrencyCodeType",
        )

    # ── constants.ts ──────────────────────────────────────────────────────────

    def test_constants_ts_exports_code_list(self):
        rel = "packages/i18nify-js/src/modules/currency/constants.ts"
        if not os.path.isfile(_ws_path(rel)):
            self.skipTest(rel + " not present")
        content = _read(rel)
        self.assertIn("CURRENCY_CODE_LIST", content,
                      "constants.ts must export CURRENCY_CODE_LIST")
        self.assertIn("as const", content,
                      "constants.ts must use `as const` for compile-time safety")

    def test_constants_ts_includes_jpy(self):
        """JPY must appear in the generated code list — this is the Japan simulation."""
        rel = "packages/i18nify-js/src/modules/currency/constants.ts"
        if not os.path.isfile(_ws_path(rel)):
            self.skipTest(rel + " not present")
        self.assertIn('"JPY"', _read(rel),
                      "constants.ts must include JPY in the code list")

    # ── utils.ts ──────────────────────────────────────────────────────────────

    def test_utils_ts_exports_get_currency_info(self):
        rel = "packages/i18nify-js/src/modules/currency/utils.ts"
        if not os.path.isfile(_ws_path(rel)):
            self.skipTest(rel + " not present")
        self.assertIn("getCurrencyInfo", _read(rel),
                      "utils.ts must export getCurrencyInfo()")

    def test_utils_ts_uses_null_safe_lookup(self):
        """getCurrencyInfo must return null for unknown codes (not throw)."""
        rel = "packages/i18nify-js/src/modules/currency/utils.ts"
        if not os.path.isfile(_ws_path(rel)):
            self.skipTest(rel + " not present")
        self.assertIn("?? null", _read(rel),
                      "utils.ts must use `?? null` for a null-safe unknown-code return")

    # ── getCurrencyList.ts ────────────────────────────────────────────────────

    def test_get_list_ts_wraps_with_error_boundary(self):
        rel = "packages/i18nify-js/src/modules/currency/getCurrencyList.ts"
        if not os.path.isfile(_ws_path(rel)):
            self.skipTest(rel + " not present")
        self.assertIn("withErrorBoundary", _read(rel),
                      "getCurrencyList.ts must wrap the function with withErrorBoundary")

    def test_get_list_ts_default_export_is_wrapped_function(self):
        rel = "packages/i18nify-js/src/modules/currency/getCurrencyList.ts"
        if not os.path.isfile(_ws_path(rel)):
            self.skipTest(rel + " not present")
        self.assertIn("export default withErrorBoundary", _read(rel),
                      "getCurrencyList.ts default export must be the wrapped function")

    # ── index.ts (module barrel) ──────────────────────────────────────────────

    def test_module_index_ts_re_exports_get_list(self):
        rel = "packages/i18nify-js/src/modules/currency/index.ts"
        if not os.path.isfile(_ws_path(rel)):
            self.skipTest(rel + " not present")
        self.assertIn("getCurrencyList", _read(rel),
                      "module index.ts must re-export getCurrencyList")

    def test_module_index_ts_is_pure_barrel(self):
        """Module index.ts must only re-export — no logic, no const bindings."""
        rel = "packages/i18nify-js/src/modules/currency/index.ts"
        if not os.path.isfile(_ws_path(rel)):
            self.skipTest(rel + " not present")
        content = _read(rel)
        logic = re.search(r"\bfunction\b|\bclass\b|\bconst\b\s+\w+\s*=\s*[^;{]", content)
        self.assertIsNone(logic,
                          "module index.ts must be a pure barrel — no logic or const bindings")

    # ── test file ─────────────────────────────────────────────────────────────

    def test_generated_test_has_describe_block(self):
        rel = "packages/i18nify-js/src/modules/currency/__tests__/getCurrencyList.test.ts"
        if not os.path.isfile(_ws_path(rel)):
            self.skipTest(rel + " not present")
        self.assertIn("describe(", _read(rel),
                      "generated test file must have a describe() block")

    def test_generated_test_has_expect_assertions(self):
        rel = "packages/i18nify-js/src/modules/currency/__tests__/getCurrencyList.test.ts"
        if not os.path.isfile(_ws_path(rel)):
            self.skipTest(rel + " not present")
        self.assertIn("expect(", _read(rel),
                      "generated test file must contain expect() assertions")

    def test_generated_test_checks_entry_shape_not_just_length(self):
        """
        A test that only checks Object.keys(list).length > 0 verifies infrastructure.
        A functional test must also assert that individual entries have the expected shape.
        """
        rel = "packages/i18nify-js/src/modules/currency/__tests__/getCurrencyList.test.ts"
        if not os.path.isfile(_ws_path(rel)):
            self.skipTest(rel + " not present")
        content = _read(rel)
        has_shape_check = (
            "typeof sample" in content
            or "Object.values" in content
            or "toBe('object')" in content
        )
        self.assertTrue(has_shape_check,
                        "Generated test must verify the shape of individual entries, not just count")


# =============================================================================
# Class 3 — src/index.ts Barrel Export
# =============================================================================

class TestIndexTsBarrelExport(unittest.TestCase):
    """
    Verify that packages/i18nify-js/src/index.ts is updated to export the new
    module so downstream consumers can import from the package root.
    """

    _rel = "packages/i18nify-js/src/index.ts"

    def test_root_index_ts_exists(self):
        self.assertTrue(os.path.isfile(_ws_path(self._rel)),
                        "packages/i18nify-js/src/index.ts must exist after skill run")

    def test_root_index_ts_exports_currency_module(self):
        if not os.path.isfile(_ws_path(self._rel)):
            self.skipTest(self._rel + " not present")
        self.assertIn("./modules/currency", _read(self._rel),
                      "src/index.ts must export from './modules/currency'")

    def test_root_index_ts_uses_star_export(self):
        if not os.path.isfile(_ws_path(self._rel)):
            self.skipTest(self._rel + " not present")
        content = _read(self._rel)
        self.assertRegex(content, r"export \* from ['\"]./modules/currency['\"]",
                         "src/index.ts must use `export * from './modules/currency'`")

    def test_root_index_ts_has_no_bare_imports(self):
        """The barrel must only re-export — no side-effectful import statements."""
        if not os.path.isfile(_ws_path(self._rel)):
            self.skipTest(self._rel + " not present")
        content = _read(self._rel)
        bare_imports = re.findall(r"^import\s+\w", content, re.MULTILINE)
        self.assertEqual(len(bare_imports), 0,
                         "src/index.ts must not contain side-effectful import statements")


# =============================================================================
# Class 4 — data.json Japan Entry Validation
# =============================================================================

class TestDataJsonJapanEntry(unittest.TestCase):
    """
    Verify that data.json contains a structurally complete entry for Japan (JPY),
    with all required fields populated and correct ISO 4217 values.
    """

    _canonical_rel = "i18nify-data/currency/data.json"
    _config_rel    = "packages/i18nify-js/src/modules/currency/data/currencyConfig.json"
    _data: Optional[Dict] = None

    def _canonical(self) -> Dict:
        if TestDataJsonJapanEntry._data is None:
            if not os.path.isfile(_ws_path(self._canonical_rel)):
                self.skipTest(self._canonical_rel + " not present")
            TestDataJsonJapanEntry._data = _load_json(self._canonical_rel)
        return TestDataJsonJapanEntry._data

    def _currencies(self) -> Dict:
        return self._canonical().get("currency_information", {})

    # ── Structure ─────────────────────────────────────────────────────────────

    def test_data_json_has_currency_information_key(self):
        data = self._canonical()
        self.assertIn("currency_information", data,
                      "data.json must have a 'currency_information' root key")

    def test_data_json_has_source_block_with_required_fields(self):
        data = self._canonical()
        self.assertIn("_source", data, "data.json missing _source provenance block")
        for field in ("topic", "name", "url", "tier"):
            self.assertIn(field, data["_source"],
                          "_source block missing field: %s" % field)

    def test_data_json_entry_count_matches_fixture(self):
        count = len(self._currencies())
        self.assertEqual(count, len(JAPAN_FIXTURE_ROWS),
                         "Expected %d entries, got %d" % (len(JAPAN_FIXTURE_ROWS), count))

    # ── Japan / JPY entry ─────────────────────────────────────────────────────

    def test_jpy_entry_exists(self):
        self.assertIn("JPY", self._currencies(),
                      "data.json must contain a JPY entry (Japan simulation fixture)")

    def test_jpy_name_is_yen(self):
        entry = self._currencies().get("JPY", {})
        self.assertEqual(entry.get("name"), "Yen",
                         "JPY.name must be 'Yen'")

    def test_jpy_numeric_code_is_392(self):
        entry = self._currencies().get("JPY", {})
        self.assertEqual(entry.get("numeric_code"), "392",
                         "JPY ISO 4217 numeric code must be '392'")

    def test_jpy_minor_unit_is_zero(self):
        """Japanese Yen has no subunit — minor_unit must be '0'."""
        entry = self._currencies().get("JPY", {})
        self.assertEqual(entry.get("minor_unit"), "0",
                         "JPY minor_unit must be '0' (no subunit)")

    # ── All entries completeness ───────────────────────────────────────────────

    def test_all_entries_have_non_empty_name(self):
        for code, entry in self._currencies().items():
            with self.subTest(code=code):
                self.assertIn("name", entry, "%s missing 'name'" % code)
                self.assertTrue(entry["name"], "%s has empty 'name'" % code)

    def test_all_entries_have_numeric_code(self):
        for code, entry in self._currencies().items():
            with self.subTest(code=code):
                self.assertIn("numeric_code", entry, "%s missing 'numeric_code'" % code)

    # ── Module-local config ───────────────────────────────────────────────────

    def test_module_config_contains_jpy(self):
        """currencyConfig.json (the module-local copy) must also include JPY."""
        if not os.path.isfile(_ws_path(self._config_rel)):
            self.skipTest(self._config_rel + " not present")
        config = _load_json(self._config_rel)
        self.assertIn("JPY", config,
                      "currencyConfig.json must contain a JPY entry")

    def test_canonical_and_go_data_json_are_in_sync(self):
        """The Go-embedded data.json must be identical to the canonical one."""
        go_rel = "i18nify-data/go/currency/data/data.json"
        if not os.path.isfile(_ws_path(go_rel)) or not os.path.isfile(_ws_path(self._canonical_rel)):
            self.skipTest("One or both data.json files absent")
        canonical_text = _read(self._canonical_rel)
        go_text        = _read(go_rel)
        self.assertEqual(canonical_text, go_text,
                         "Go-embedded data.json differs from canonical — Go will embed stale data")


# =============================================================================
# Class 5 — TypeScript Compilation Check (tsc --noEmit)
# =============================================================================

class TestTypeScriptCompilation(unittest.TestCase):
    """
    Copy the generated module into the real packages/i18nify-js/src/modules/
    under a temp name and run `tsc --noEmit` on the full package.

    Catches broken imports, wrong relative paths, and type mismatches that
    only surface when compiled against the real tsconfig and node_modules.

    Skipped when node_modules is absent.
    """

    _module_dir: Optional[str] = None
    _proc: Optional[subprocess.CompletedProcess] = None

    @classmethod
    def setUpClass(cls) -> None:
        if _SKIP_YARN or not _HAS_TSC:
            return
        cls._module_dir = _copy_module_to_real_pkg("currency", _TEMP_MODULE)
        if cls._module_dir is None:
            return
        cls._proc = subprocess.run(
            [TSC_BIN, "--noEmit", "--skipLibCheck"],
            capture_output=True, text=True,
            cwd=JS_PKG_DIR, timeout=90,
        )

    @classmethod
    def tearDownClass(cls) -> None:
        _cleanup_real_pkg_module(_TEMP_MODULE)

    @unittest.skipIf(_SKIP_YARN or not _HAS_TSC, _SKIP_REASON)
    def test_tsc_exits_zero_after_module_addition(self):
        if self._proc is None:
            self.skipTest("module not copied — source missing in workspace")
        self.assertEqual(
            self._proc.returncode, 0,
            "tsc --noEmit reported errors after writing the generated module.\n"
            "stdout: %s" % self._proc.stdout[:800],
        )

    @unittest.skipIf(_SKIP_YARN or not _HAS_TSC, _SKIP_REASON)
    def test_no_typescript_errors_in_generated_files(self):
        if self._proc is None:
            self.skipTest("module not copied")
        ts_errors = re.findall(r"error TS\d+:", self._proc.stdout)
        self.assertEqual(len(ts_errors), 0,
                         "%d TypeScript error(s):\n%s" % (len(ts_errors), "\n".join(ts_errors[:10])))

    @unittest.skipIf(_SKIP_YARN or not _HAS_TSC, _SKIP_REASON)
    def test_no_module_not_found_errors(self):
        if self._proc is None:
            self.skipTest("module not copied")
        self.assertNotIn(
            "Cannot find module", self._proc.stdout,
            "tsc reported 'Cannot find module' — relative imports are broken:\n"
            + self._proc.stdout[:600],
        )


# =============================================================================
# Class 6 — Post-Skill Build Stability (yarn build)
# =============================================================================

class TestProjectBuildStability(unittest.TestCase):
    """
    Write the generated module into the real JS package and run `yarn build`
    to verify no compilation or bundling regressions.

    Skipped when node_modules is absent or yarn is not in PATH.
    """

    _module_dir: Optional[str] = None
    _proc: Optional[subprocess.CompletedProcess] = None

    @classmethod
    def setUpClass(cls) -> None:
        if _SKIP_YARN:
            return
        cls._module_dir = _copy_module_to_real_pkg("currency", _TEMP_MODULE)
        if cls._module_dir is None:
            return
        cls._proc = subprocess.run(
            [YARN, "build"],
            capture_output=True, text=True,
            cwd=JS_PKG_DIR, timeout=180,
        )

    @classmethod
    def tearDownClass(cls) -> None:
        _cleanup_real_pkg_module(_TEMP_MODULE)

    @unittest.skipIf(_SKIP_YARN, _SKIP_REASON)
    def test_yarn_build_exits_zero(self):
        if self._proc is None:
            self.skipTest("module not copied — source missing in workspace")
        self.assertEqual(
            self._proc.returncode, 0,
            "yarn build failed after skill-generated module was written.\n"
            "stdout (tail): %s\nstderr: %s"
            % (self._proc.stdout[-800:], self._proc.stderr[-400:]),
        )

    @unittest.skipIf(_SKIP_YARN, _SKIP_REASON)
    def test_yarn_build_produces_no_typescript_errors(self):
        if self._proc is None:
            self.skipTest("module not copied")
        combined = self._proc.stdout + self._proc.stderr
        ts_errors = re.findall(r"error TS\d+:", combined)
        self.assertEqual(len(ts_errors), 0,
                         "%d TypeScript error(s) in yarn build:\n%s"
                         % (len(ts_errors), "\n".join(ts_errors[:10])))

    @unittest.skipIf(_SKIP_YARN, _SKIP_REASON)
    def test_yarn_build_produces_no_module_not_found(self):
        if self._proc is None:
            self.skipTest("module not copied")
        self.assertNotIn(
            "Module not found", self._proc.stdout + self._proc.stderr,
            "yarn build reported 'Module not found' — import path is wrong",
        )


# =============================================================================
# Class 7 — Post-Skill Dev Server Check (yarn dev)
# =============================================================================

class TestProjectDevServer(unittest.TestCase):
    """
    Start `yarn dev` briefly and verify the compiler emits no TypeScript errors
    or broken-import messages during startup.

    yarn dev is typically a watch-mode process; we start it, wait 8 seconds for
    the initial compilation pass, then kill it and inspect the buffered output.

    Skipped when node_modules is absent or yarn is not in PATH.
    """

    _module_dir: Optional[str] = None
    _dev_output: str = ""

    @classmethod
    def setUpClass(cls) -> None:
        if _SKIP_YARN:
            return
        cls._module_dir = _copy_module_to_real_pkg("currency", _TEMP_MODULE)
        try:
            proc = subprocess.Popen(
                [YARN, "dev"],
                stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                text=True, cwd=JS_PKG_DIR,
            )
            time.sleep(8)
            proc.terminate()
            try:
                out, _ = proc.communicate(timeout=5)
                cls._dev_output = out or ""
            except subprocess.TimeoutExpired:
                proc.kill()
                cls._dev_output = ""
        except (FileNotFoundError, OSError):
            cls._dev_output = ""

    @classmethod
    def tearDownClass(cls) -> None:
        _cleanup_real_pkg_module(_TEMP_MODULE)

    @unittest.skipIf(_SKIP_YARN, _SKIP_REASON)
    def test_dev_server_emits_no_typescript_errors(self):
        ts_errors = re.findall(r"error TS\d+:", self._dev_output)
        self.assertEqual(len(ts_errors), 0,
                         "yarn dev emitted TypeScript errors:\n"
                         + "\n".join(ts_errors[:10]))

    @unittest.skipIf(_SKIP_YARN, _SKIP_REASON)
    def test_dev_server_emits_no_module_not_found(self):
        self.assertNotIn(
            "Module not found", self._dev_output,
            "yarn dev reported 'Module not found' — a relative import is broken:\n"
            + self._dev_output[:500],
        )

    @unittest.skipIf(_SKIP_YARN, _SKIP_REASON)
    def test_dev_server_emits_no_cannot_find_module(self):
        self.assertNotIn(
            "Cannot find module", self._dev_output,
            "yarn dev reported 'Cannot find module':\n" + self._dev_output[:500],
        )


# =============================================================================
# Class 8 — Yarn Test Suite (yarn test)
# =============================================================================

class TestYarnTestSuite(unittest.TestCase):
    """
    Run `yarn test` scoped to the generated test file and verify it passes.
    Uses --testPathPattern to avoid running the full suite.

    Skipped when node_modules is absent or yarn is not in PATH.
    """

    _module_dir: Optional[str] = None
    _proc: Optional[subprocess.CompletedProcess] = None
    _test_file: Optional[str] = None

    @classmethod
    def setUpClass(cls) -> None:
        if _SKIP_YARN:
            return

        cls._module_dir = _copy_module_to_real_pkg("currency", _TEMP_MODULE)
        if cls._module_dir is None:
            return

        test_file = os.path.join(
            cls._module_dir, "__tests__", "getCurrencyList.test.ts"
        )
        if not os.path.isfile(test_file):
            return

        cls._test_file = test_file
        cls._proc = subprocess.run(
            [YARN, "test",
             "--testPathPattern", re.escape(test_file),
             "--passWithNoTests",
             "--no-coverage",
             "--forceExit"],
            capture_output=True, text=True,
            cwd=JS_PKG_DIR, timeout=120,
        )

    @classmethod
    def tearDownClass(cls) -> None:
        _cleanup_real_pkg_module(_TEMP_MODULE)

    @unittest.skipIf(_SKIP_YARN, _SKIP_REASON)
    def test_yarn_test_exits_zero(self):
        if self._proc is None:
            self.skipTest("test file not generated or yarn unavailable")
        self.assertEqual(
            self._proc.returncode, 0,
            "yarn test failed for the generated test file.\n"
            "stdout: %s\nstderr: %s"
            % (self._proc.stdout[-800:], self._proc.stderr[-400:]),
        )

    @unittest.skipIf(_SKIP_YARN, _SKIP_REASON)
    def test_no_failed_suites_in_output(self):
        if self._proc is None:
            self.skipTest("test file not generated or yarn unavailable")
        combined = self._proc.stdout + self._proc.stderr
        # Jest emits "FAIL" followed by the file path on a failed suite
        failed = re.findall(r"^FAIL\s+\S+", combined, re.MULTILINE)
        self.assertEqual(len(failed), 0,
                         "Failed test suite(s) reported:\n" + "\n".join(failed))

    @unittest.skipIf(_SKIP_YARN, _SKIP_REASON)
    def test_generated_test_validates_entry_shape(self):
        """
        Verify the test file checks the shape of entries (not just count).
        This is the functional vs. infrastructure distinction: a test that only
        asserts list.length > 0 would pass even if all entry fields were empty.
        """
        ws_rel = "packages/i18nify-js/src/modules/currency/__tests__/getCurrencyList.test.ts"
        if not os.path.isfile(_ws_path(ws_rel)):
            self.skipTest("test file not present in workspace")
        content = _read(ws_rel)
        has_shape_check = (
            "typeof sample" in content
            or "Object.values" in content
            or "toBe('object')" in content
            or "toHaveProperty" in content
        )
        self.assertTrue(has_shape_check,
                        "Generated test must verify entry shape, not just list non-emptiness")


# =============================================================================
# Entry point
# =============================================================================

if __name__ == "__main__":
    unittest.main(verbosity=2)
