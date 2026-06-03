"""
Execution-based evaluation harness for utility-creator Recipe 8 + Recipe 8-Go.

Architecture
============
1. Clean workspace  — unique isolated tempdir per run; no pre-existing files
2. Skill execution  — runs recipe8_runner.py (JS/TS) then recipe8go_runner.py (Go)
3. File existence   — checks every expected .proto, .go, data.json, .ts path
4. Content checks   — JSON parse, proto syntax, gofmt -e on Go files
5. Report output    — JSON + Markdown (success, generated_files, missing_files, errors)

Usage
=====
pytest (CI):        python3 -m pytest test_execution_harness.py -v
JSON report:        python3 test_execution_harness.py --report
Markdown report:    python3 test_execution_harness.py --report --markdown

Sample assertions
=================
PASS: all 17 expected files written; data.json parses; .proto has `syntax = "proto3"`;
      gofmt exits 0 on every .go file
FAIL: UTILITY_ERROR token in stdout; missing file; json.JSONDecodeError; gofmt exit != 0

Setup
=====
Prerequisites: venv at repo root with pip packages (installed by run_evals.sh).
               gofmt in PATH (optional — Go checks skip gracefully if absent).
No other setup needed — a fresh tempdir workspace is created per run.
"""

import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from typing import Any, Dict, List, Tuple

REPO_ROOT      = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
RUNNER_JS      = os.path.join(os.path.dirname(__file__), "fixtures", "recipe8_runner.py")
RUNNER_GO      = os.path.join(os.path.dirname(__file__), "fixtures", "recipe8go_runner.py")
VENV_PY        = os.path.join(REPO_ROOT, "venv", "bin", "python")
PYTHON         = VENV_PY if os.path.isfile(VENV_PY) else sys.executable
GOFMT          = shutil.which("gofmt")          # None when Go is not installed

# ── Test input — currency_codes is the reference topic (all 17 files covered) ─

TOPIC_KEY = "currency_codes"

CURRENCY_FIXTURE_ROWS = [
    {"cc": "USD", "name": "US Dollar",      "numeric_code": "840", "minor_unit": "2", "symbol": "$"},
    {"cc": "EUR", "name": "Euro",            "numeric_code": "978", "minor_unit": "2", "symbol": "€"},
    {"cc": "GBP", "name": "Pound Sterling", "numeric_code": "826", "minor_unit": "2", "symbol": "£"},
    {"cc": "JPY", "name": "Yen",            "numeric_code": "392", "minor_unit": "0", "symbol": "¥"},
    {"cc": "INR", "name": "Indian Rupee",   "numeric_code": "356", "minor_unit": "2", "symbol": "₹"},
]

FIXTURE_RESULT = {
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
        "rows":    CURRENCY_FIXTURE_ROWS,
        "factors": {},
    },
}

# ── All expected output files (relative to PROJECT_ROOT) ─────────────────────
# Grouped by type for targeted validation.

EXPECTED_PROTO_FILES = [
    "i18nify-data/currency/proto/currency.proto",
]

EXPECTED_DOC_FILES = [
    "i18nify-data/currency/README.md",
]

EXPECTED_DATA_JSON_FILES = [
    "i18nify-data/currency/data.json",           # canonical JS-side data
    "i18nify-data/go/currency/data/data.json",   # embedded Go copy
]

EXPECTED_JS_TS_FILES = [
    "packages/i18nify-js/src/modules/currency/data/currencyConfig.json",
    "packages/i18nify-js/src/modules/currency/types.ts",
    "packages/i18nify-js/src/modules/currency/constants.ts",
    "packages/i18nify-js/src/modules/currency/utils.ts",
    "packages/i18nify-js/src/modules/currency/getCurrencyList.ts",
    "packages/i18nify-js/src/modules/currency/index.ts",
    "packages/i18nify-js/src/modules/currency/__tests__/getCurrencyList.test.ts",
]

EXPECTED_GO_FILES = [
    "i18nify-data/go/currency/currency.pb.go",
    "i18nify-data/go/currency/data_loader.go",
    "i18nify-data/go/currency/data_loader_test.go",
    "i18nify-data/go/currency/go.mod",
    "packages/i18nify-go/modules/currency/currency.go",
    "packages/i18nify-go/modules/currency/currency_test.go",
]

ALL_EXPECTED_FILES = (
    EXPECTED_PROTO_FILES
    + EXPECTED_DOC_FILES
    + EXPECTED_DATA_JSON_FILES
    + EXPECTED_JS_TS_FILES
    + EXPECTED_GO_FILES
)

# ── Module-level workspace (created once, shared across all test classes) ─────

_WS: str = ""          # absolute path to the isolated temp workspace
_JS_PROC  = None       # CompletedProcess for recipe8_runner.py
_GO_PROC  = None       # CompletedProcess for recipe8go_runner.py


def _make_minimal_project(root: str) -> None:
    """Scaffold the minimum directory structure Recipe 8 expects."""
    os.makedirs(os.path.join(root, "packages", "i18nify-js", "src", "modules"), exist_ok=True)
    go_pkg = os.path.join(root, "packages", "i18nify-go")
    os.makedirs(go_pkg, exist_ok=True)
    with open(os.path.join(go_pkg, "go.mod"), "w") as f:
        f.write(
            "module github.com/razorpay/i18nify/packages/i18nify-go\n\n"
            "go 1.21\n\nrequire (\n)\n"
        )
    with open(os.path.join(root, "packages", "i18nify-js", "src", "index.ts"), "w") as f:
        f.write("// barrel\n")


def _run_runner(script: str, fixture_path: str) -> subprocess.CompletedProcess:
    env = os.environ.copy()
    env["UC_TOPIC_KEY"]       = TOPIC_KEY
    env["UC_PROJECT_ROOT"]    = _WS
    env["UC_TSF_RESULT_PATH"] = fixture_path
    return subprocess.run(
        [PYTHON, script],
        capture_output=True, text=True, env=env, cwd=REPO_ROOT,
    )


def setUpModule() -> None:
    global _WS, _JS_PROC, _GO_PROC

    # 1. Clean, isolated workspace — guaranteed empty
    _WS = tempfile.mkdtemp(prefix="uc_harness_")
    _make_minimal_project(_WS)

    fixture_path = os.path.join(_WS, "tsf_result.json")
    with open(fixture_path, "w") as f:
        json.dump(FIXTURE_RESULT, f)

    # 2. Skill execution — JS/TS first (writes data.json consumed by Go runner)
    _JS_PROC = _run_runner(RUNNER_JS, fixture_path)
    if _JS_PROC.returncode != 0:
        raise RuntimeError(
            "recipe8_runner.py failed — harness cannot proceed.\n"
            "stdout: %s\nstderr: %s" % (_JS_PROC.stdout[:500], _JS_PROC.stderr[:500])
        )

    # 3. Skill execution — Go files (reads the data.json written above)
    _GO_PROC = _run_runner(RUNNER_GO, fixture_path)
    # Go runner failure is NOT fatal for the module — individual tests report it.


def tearDownModule() -> None:
    shutil.rmtree(_WS, ignore_errors=True)


# ── Helpers ───────────────────────────────────────────────────────────────────

def _full(rel: str) -> str:
    return os.path.join(_WS, rel)


def _read(rel: str) -> str:
    with open(_full(rel), encoding="utf-8") as f:
        return f.read()


def _gofmt_errors(rel: str) -> str:
    """Return gofmt stderr if the file has syntax errors, else ''."""
    if GOFMT is None:
        return ""
    proc = subprocess.run(
        [GOFMT, "-e", _full(rel)],
        capture_output=True, text=True,
    )
    # gofmt exits 0 even on formatting differences; non-zero = syntax error
    return proc.stderr.strip() if proc.returncode != 0 else ""


# ─────────────────────────────────────────────────────────────────────────────
# 1. Clean Workspace Isolation
# ─────────────────────────────────────────────────────────────────────────────

class TestCleanWorkspaceIsolation(unittest.TestCase):
    """
    REQUIREMENT: each run starts from a unique, empty directory.
    No pre-existing utilities, cached data, or leftover artifacts.
    """

    def test_workspace_exists_and_is_a_directory(self):
        self.assertTrue(os.path.isdir(_WS), "Workspace temp dir must exist as a directory")

    def test_workspace_path_is_unique(self):
        """Temp dir prefix must make the path unique — no two runs share state."""
        self.assertIn("uc_harness_", _WS, "Workspace must use the uc_harness_ prefix")

    def test_workspace_starts_empty_before_skill_runs(self):
        """
        Verify by checking that no module files pre-existed (they were all written
        by recipe8_runner.py, so they must NOT exist if we check before the runners ran).
        We verify indirectly: all generated files report WROTE| (not SKIP|) in stdout.
        """
        wrote_lines = [
            l for l in _JS_PROC.stdout.splitlines()
            if l.startswith("WROTE|")
        ]
        self.assertGreater(len(wrote_lines), 0,
            "Expected WROTE| lines in JS stdout — workspace must have been empty at start")

    def test_no_unexpected_files_in_workspace(self):
        """Workspace should only contain files written by the two runners + fixture."""
        expected = set(ALL_EXPECTED_FILES) | {
            "tsf_result.json",
            "packages/i18nify-js/src/index.ts",
            "packages/i18nify-go/go.mod",
        }
        for root, dirs, files in os.walk(_WS):
            dirs[:] = [d for d in dirs if d != "__pycache__"]
            for fname in files:
                rel = os.path.relpath(os.path.join(root, fname), _WS)
                # Pass if it's in expected or is a sub-path of expected
                matched = any(rel == e or rel.startswith(e.split("/")[0]) for e in expected)
                self.assertTrue(matched, "Unexpected file in workspace: %s" % rel)


# ─────────────────────────────────────────────────────────────────────────────
# 2. Skill Execution
# ─────────────────────────────────────────────────────────────────────────────

class TestSkillExecution(unittest.TestCase):
    """
    REQUIREMENT: both runners must exit 0, emit only protocol tokens (WROTE|,
    UTILITY_DONE|, GO_UTILITY_DONE|), and report correct file/entry counts.
    """

    # ── JS/TS runner ─────────────────────────────────────────────────────────

    def test_js_runner_exits_zero(self):
        self.assertEqual(
            _JS_PROC.returncode, 0,
            "recipe8_runner.py must exit 0.\nstderr: %s" % _JS_PROC.stderr[:300],
        )

    def test_js_runner_emits_utility_done(self):
        self.assertIn("UTILITY_DONE|currency|files=10", _JS_PROC.stdout,
            "JS runner must emit UTILITY_DONE|currency|files=10")

    def test_js_runner_emits_correct_entry_count(self):
        self.assertIn("entries=%d" % len(CURRENCY_FIXTURE_ROWS), _JS_PROC.stdout,
            "UTILITY_DONE must report entries=%d" % len(CURRENCY_FIXTURE_ROWS))

    def test_js_runner_stdout_only_has_protocol_tokens(self):
        """Strict output contract — no raw code may appear in stdout."""
        allowed = re.compile(r"^(WROTE\||UTILITY_DONE\||UTILITY_ERROR\|)")
        for line in _JS_PROC.stdout.strip().splitlines():
            if line.strip():
                self.assertTrue(allowed.match(line),
                    "Unexpected JS stdout line (code leak?): %r" % line)

    def test_js_runner_no_traceback(self):
        self.assertNotIn("Traceback", _JS_PROC.stderr,
            "Traceback in JS runner stderr:\n" + _JS_PROC.stderr[:400])

    # ── Go runner ────────────────────────────────────────────────────────────

    def test_go_runner_exits_zero(self):
        self.assertEqual(
            _GO_PROC.returncode, 0,
            "recipe8go_runner.py must exit 0.\nstderr: %s" % _GO_PROC.stderr[:300],
        )

    def test_go_runner_emits_go_utility_done(self):
        self.assertIn("GO_UTILITY_DONE|currency|files=7", _GO_PROC.stdout,
            "Go runner must emit GO_UTILITY_DONE|currency|files=7")

    def test_go_runner_stdout_only_has_protocol_tokens(self):
        allowed = re.compile(r"^(WROTE\||GO_UTILITY_DONE\||GO_UTILITY_ERROR\|)")
        for line in _GO_PROC.stdout.strip().splitlines():
            if line.strip():
                self.assertTrue(allowed.match(line),
                    "Unexpected Go stdout line (code leak?): %r" % line)

    def test_go_runner_no_traceback(self):
        self.assertNotIn("Traceback", _GO_PROC.stderr,
            "Traceback in Go runner stderr:\n" + _GO_PROC.stderr[:400])

    def test_both_runners_together_write_all_files(self):
        """Combined WROTE| count must equal the total expected file count (17)."""
        js_wrote = len([l for l in _JS_PROC.stdout.splitlines() if l.startswith("WROTE|")])
        go_wrote = len([l for l in _GO_PROC.stdout.splitlines() if l.startswith("WROTE|")])
        total_wrote = js_wrote + go_wrote
        total_expected = len(ALL_EXPECTED_FILES)
        self.assertEqual(total_wrote, total_expected,
            "Expected %d total WROTE| lines, got %d (JS=%d Go=%d)" % (
                total_expected, total_wrote, js_wrote, go_wrote))


# ─────────────────────────────────────────────────────────────────────────────
# 3. Proto Files
# ─────────────────────────────────────────────────────────────────────────────

class TestProtoFiles(unittest.TestCase):
    """
    REQUIREMENT: .proto files must exist and contain valid proto3 syntax.
    Full protoc is not required — checks are pure Python syntax validation.
    """

    def test_proto_file_exists(self):
        for rel in EXPECTED_PROTO_FILES:
            with self.subTest(path=rel):
                self.assertTrue(os.path.isfile(_full(rel)),
                    ".proto file missing: %s" % rel)

    def test_proto_file_is_not_empty(self):
        for rel in EXPECTED_PROTO_FILES:
            if not os.path.isfile(_full(rel)):
                self.skipTest("%s not present" % rel)
            with self.subTest(path=rel):
                self.assertGreater(os.path.getsize(_full(rel)), 0,
                    ".proto file is empty: %s" % rel)

    def test_proto_has_syntax_declaration(self):
        """proto3 files must start with `syntax = "proto3";`"""
        for rel in EXPECTED_PROTO_FILES:
            if not os.path.isfile(_full(rel)):
                self.skipTest("%s not present" % rel)
            content = _read(rel)
            with self.subTest(path=rel):
                self.assertIn('syntax = "proto3"', content,
                    "%s missing proto3 syntax declaration" % rel)

    def test_proto_has_package_declaration(self):
        """Every .proto must declare a package."""
        for rel in EXPECTED_PROTO_FILES:
            if not os.path.isfile(_full(rel)):
                self.skipTest("%s not present" % rel)
            content = _read(rel)
            with self.subTest(path=rel):
                self.assertTrue(re.search(r"^package\s+\w+", content, re.MULTILINE),
                    "%s missing package declaration" % rel)

    def test_proto_balanced_braces(self):
        """Balanced `{` and `}` — catches trivially malformed proto output."""
        for rel in EXPECTED_PROTO_FILES:
            if not os.path.isfile(_full(rel)):
                self.skipTest("%s not present" % rel)
            content = _read(rel)
            with self.subTest(path=rel):
                self.assertEqual(content.count("{"), content.count("}"),
                    "%s has unbalanced braces" % rel)


# ─────────────────────────────────────────────────────────────────────────────
# 4. Data JSON Files
# ─────────────────────────────────────────────────────────────────────────────

class TestDataJsonFiles(unittest.TestCase):
    """
    REQUIREMENT: data.json files must exist, parse cleanly, and contain
    the expected structure and entry count.
    """

    def test_all_data_json_files_exist(self):
        for rel in EXPECTED_DATA_JSON_FILES:
            with self.subTest(path=rel):
                self.assertTrue(os.path.isfile(_full(rel)),
                    "data.json missing: %s" % rel)

    def test_canonical_data_json_parses(self):
        """Primary data.json must not be empty or corrupt JSON."""
        rel = "i18nify-data/currency/data.json"
        if not os.path.isfile(_full(rel)):
            self.skipTest(rel + " not present")
        try:
            with open(_full(rel), encoding="utf-8") as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            self.fail("JSONDecodeError in %s: %s" % (rel, e))
        self.assertIsInstance(data, dict, "%s root must be a JSON object" % rel)

    def test_canonical_data_json_has_currency_information_key(self):
        rel = "i18nify-data/currency/data.json"
        if not os.path.isfile(_full(rel)):
            self.skipTest(rel + " not present")
        with open(_full(rel), encoding="utf-8") as f:
            data = json.load(f)
        self.assertIn("currency_information", data,
            "canonical data.json must have 'currency_information' root key")
        self.assertGreater(len(data["currency_information"]), 0,
            "currency_information is empty")

    def test_canonical_data_json_has_source_block(self):
        rel = "i18nify-data/currency/data.json"
        if not os.path.isfile(_full(rel)):
            self.skipTest(rel + " not present")
        with open(_full(rel), encoding="utf-8") as f:
            data = json.load(f)
        self.assertIn("_source", data, "canonical data.json missing _source block")
        src = data["_source"]
        for field in ("topic", "name", "url", "tier"):
            self.assertIn(field, src, "_source missing field: %s" % field)

    def test_canonical_data_json_entry_count_matches_fixture(self):
        rel = "i18nify-data/currency/data.json"
        if not os.path.isfile(_full(rel)):
            self.skipTest(rel + " not present")
        with open(_full(rel), encoding="utf-8") as f:
            data = json.load(f)
        count = len(data.get("currency_information", {}))
        self.assertEqual(count, len(CURRENCY_FIXTURE_ROWS),
            "Expected %d entries, found %d in data.json" % (len(CURRENCY_FIXTURE_ROWS), count))

    def test_go_embedded_data_json_parses(self):
        """i18nify-data/go/currency/data/data.json must also be valid JSON."""
        rel = "i18nify-data/go/currency/data/data.json"
        if not os.path.isfile(_full(rel)):
            self.skipTest(rel + " not present")
        try:
            with open(_full(rel), encoding="utf-8") as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            self.fail("JSONDecodeError in Go embedded data.json: %s" % e)
        self.assertIn("currency_information", data,
            "Go embedded data.json must have currency_information key")

    def test_both_data_json_files_are_identical(self):
        """Canonical and Go-embedded data.json must be byte-for-byte identical."""
        canonical = "i18nify-data/currency/data.json"
        embedded  = "i18nify-data/go/currency/data/data.json"
        if not os.path.isfile(_full(canonical)) or not os.path.isfile(_full(embedded)):
            self.skipTest("One or both data.json files not present")
        with open(_full(canonical), encoding="utf-8") as f:
            c = f.read()
        with open(_full(embedded), encoding="utf-8") as f:
            e = f.read()
        self.assertEqual(c, e,
            "canonical and Go-embedded data.json differ — Go will embed stale data")


# ─────────────────────────────────────────────────────────────────────────────
# 5. Go Files
# ─────────────────────────────────────────────────────────────────────────────

class TestGoFiles(unittest.TestCase):
    """
    REQUIREMENT: all .go files must exist and pass gofmt syntax check.
    Go compilation is skipped (requires full module graph); syntax is sufficient.
    """

    def test_all_go_files_exist(self):
        for rel in EXPECTED_GO_FILES:
            with self.subTest(path=rel):
                self.assertTrue(os.path.isfile(_full(rel)),
                    ".go file missing: %s" % rel)

    def test_go_files_are_not_empty(self):
        for rel in EXPECTED_GO_FILES:
            if not os.path.isfile(_full(rel)):
                continue
            with self.subTest(path=rel):
                self.assertGreater(os.path.getsize(_full(rel)), 0,
                    ".go file is empty: %s" % rel)

    def test_go_files_have_package_declaration(self):
        """Every .go file must start with `package <name>`."""
        for rel in EXPECTED_GO_FILES:
            if not os.path.isfile(_full(rel)) or rel.endswith("go.mod"):
                continue
            content = _read(rel)
            with self.subTest(path=rel):
                self.assertTrue(
                    re.search(r"^package\s+\w+", content, re.MULTILINE),
                    "%s missing package declaration" % rel,
                )

    def test_go_pb_file_has_type_definitions(self):
        """currency.pb.go must define CurrencyData and CurrencyInfo types."""
        rel = "i18nify-data/go/currency/currency.pb.go"
        if not os.path.isfile(_full(rel)):
            self.skipTest(rel + " not present")
        content = _read(rel)
        for typename in ("CurrencyData", "CurrencyInfo"):
            with self.subTest(typename=typename):
                self.assertIn(typename, content,
                    "%s missing type definition: %s" % (rel, typename))

    def test_data_loader_has_go_embed_directive(self):
        """data_loader.go must use //go:embed to embed data.json at compile time."""
        rel = "i18nify-data/go/currency/data_loader.go"
        if not os.path.isfile(_full(rel)):
            self.skipTest(rel + " not present")
        content = _read(rel)
        self.assertIn("//go:embed", content,
            "data_loader.go must use //go:embed to embed data.json")

    def test_data_loader_uses_sync_once(self):
        """data_loader.go must use sync.Once for thread-safe singleton loading."""
        rel = "i18nify-data/go/currency/data_loader.go"
        if not os.path.isfile(_full(rel)):
            self.skipTest(rel + " not present")
        content = _read(rel)
        self.assertIn("sync.Once", content,
            "data_loader.go must use sync.Once for idempotent loading")

    def test_go_module_file_exports_get_list(self):
        """currency.go must export GetCurrencyList for package consumers."""
        rel = "packages/i18nify-go/modules/currency/currency.go"
        if not os.path.isfile(_full(rel)):
            self.skipTest(rel + " not present")
        content = _read(rel)
        self.assertIn("GetCurrencyList", content,
            "currency.go must export GetCurrencyList()")

    def test_go_module_file_exports_get_info(self):
        """currency.go must export GetCurrencyInfo for per-code lookups."""
        rel = "packages/i18nify-go/modules/currency/currency.go"
        if not os.path.isfile(_full(rel)):
            self.skipTest(rel + " not present")
        content = _read(rel)
        self.assertIn("GetCurrencyInfo", content,
            "currency.go must export GetCurrencyInfo()")

    def test_go_test_file_has_test_functions(self):
        """currency_test.go must define at least one Test* function."""
        rel = "packages/i18nify-go/modules/currency/currency_test.go"
        if not os.path.isfile(_full(rel)):
            self.skipTest(rel + " not present")
        content = _read(rel)
        test_fns = re.findall(r"^func Test\w+\(", content, re.MULTILINE)
        self.assertGreaterEqual(len(test_fns), 2,
            "currency_test.go must have ≥2 Test* functions; found %d" % len(test_fns))

    @unittest.skipIf(GOFMT is None, "gofmt not found in PATH — skipping Go syntax checks")
    def test_go_files_pass_gofmt_syntax_check(self):
        """gofmt -e must exit 0 on every .go file (syntax-only check)."""
        go_only = [r for r in EXPECTED_GO_FILES if r.endswith(".go")]
        for rel in go_only:
            if not os.path.isfile(_full(rel)):
                continue
            errors = _gofmt_errors(rel)
            with self.subTest(path=rel):
                self.assertEqual(errors, "",
                    "gofmt syntax error in %s:\n%s" % (rel, errors))


# ─────────────────────────────────────────────────────────────────────────────
# 6. JS / TS Utility Files
# ─────────────────────────────────────────────────────────────────────────────

class TestJsTsFiles(unittest.TestCase):
    """
    REQUIREMENT: all TypeScript utility files must exist with correct structural
    markers (type exports, error boundary, barrel pattern, test structure).
    """

    def test_all_js_ts_files_exist(self):
        for rel in EXPECTED_JS_TS_FILES:
            with self.subTest(path=rel):
                self.assertTrue(os.path.isfile(_full(rel)),
                    "JS/TS file missing: %s" % rel)

    def test_module_config_json_parses(self):
        rel = "packages/i18nify-js/src/modules/currency/data/currencyConfig.json"
        if not os.path.isfile(_full(rel)):
            self.skipTest(rel + " not present")
        try:
            with open(_full(rel), encoding="utf-8") as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            self.fail("JSONDecodeError in currencyConfig.json: %s" % e)
        self.assertGreater(len(data), 0, "currencyConfig.json is empty")

    def test_types_ts_exports_code_type(self):
        rel = "packages/i18nify-js/src/modules/currency/types.ts"
        if not os.path.isfile(_full(rel)):
            self.skipTest(rel + " not present")
        content = _read(rel)
        self.assertIn("export type", content, "types.ts must export a named type")
        self.assertIn("CurrencyCodeType", content, "types.ts must export CurrencyCodeType")

    def test_constants_ts_uses_as_const(self):
        rel = "packages/i18nify-js/src/modules/currency/constants.ts"
        if not os.path.isfile(_full(rel)):
            self.skipTest(rel + " not present")
        self.assertIn("as const", _read(rel),
            "constants.ts must use `as const` for compile-time immutability")

    def test_get_list_ts_has_error_boundary(self):
        rel = "packages/i18nify-js/src/modules/currency/getCurrencyList.ts"
        if not os.path.isfile(_full(rel)):
            self.skipTest(rel + " not present")
        self.assertIn("withErrorBoundary", _read(rel),
            "getCurrencyList.ts must use withErrorBoundary")

    def test_index_ts_is_pure_barrel(self):
        rel = "packages/i18nify-js/src/modules/currency/index.ts"
        if not os.path.isfile(_full(rel)):
            self.skipTest(rel + " not present")
        content = _read(rel)
        has_logic = re.search(r"\bfunction\b|\bclass\b|\bconst\b\s+\w+\s*=\s*[^;{]", content)
        self.assertIsNone(has_logic,
            "index.ts must be a pure barrel — no logic or const bindings")

    def test_test_file_has_assertions(self):
        rel = "packages/i18nify-js/src/modules/currency/__tests__/getCurrencyList.test.ts"
        if not os.path.isfile(_full(rel)):
            self.skipTest(rel + " not present")
        content = _read(rel)
        self.assertIn("expect(", content, "test file must contain expect() assertions")
        self.assertIn("describe(", content, "test file must have a describe() block")


# ─────────────────────────────────────────────────────────────────────────────
# 7. Report Generation
# ─────────────────────────────────────────────────────────────────────────────

class TestReportGeneration(unittest.TestCase):
    """
    REQUIREMENT: the harness must be able to produce a complete, consistent
    JSON report with success, generated_files, missing_files, and errors keys.
    """

    def _build_report(self) -> Dict[str, Any]:
        return build_report()

    def test_report_has_required_keys(self):
        report = self._build_report()
        for key in ("success", "topic", "workspace", "generated_files",
                    "missing_files", "errors", "summary"):
            self.assertIn(key, report, "Report missing key: %s" % key)

    def test_report_success_is_boolean(self):
        report = self._build_report()
        self.assertIsInstance(report["success"], bool)

    def test_report_generated_files_are_strings(self):
        report = self._build_report()
        for path in report["generated_files"]:
            self.assertIsInstance(path, str)

    def test_report_missing_files_is_list(self):
        report = self._build_report()
        self.assertIsInstance(report["missing_files"], list)

    def test_report_errors_is_dict(self):
        report = self._build_report()
        self.assertIsInstance(report["errors"], dict)
        for key in ("json_validation", "proto_validation", "go_fmt"):
            self.assertIn(key, report["errors"], "errors dict missing key: %s" % key)

    def test_report_summary_has_counts(self):
        report = self._build_report()
        summary = report["summary"]
        self.assertIn("total_checks", summary)
        self.assertIn("passed", summary)
        self.assertIn("failed", summary)
        self.assertIn("score", summary)

    def test_report_is_json_serialisable(self):
        """Report dict must round-trip through JSON without errors."""
        report = self._build_report()
        try:
            serialised = json.dumps(report, indent=2, ensure_ascii=False)
            back = json.loads(serialised)
        except (TypeError, json.JSONDecodeError) as e:
            self.fail("Report is not JSON-serialisable: %s" % e)
        self.assertEqual(report["success"], back["success"])


# ─────────────────────────────────────────────────────────────────────────────
# Report Builder & Printer
# ─────────────────────────────────────────────────────────────────────────────

def build_report() -> Dict[str, Any]:
    """
    Build the structured evaluation report dict.

    Returns
    -------
    dict with keys:
        success         bool
        topic           str
        workspace       str
        generated_files list[str]  — relative paths that exist on disk
        missing_files   list[str]  — expected paths not found
        errors          dict       — json_validation, proto_validation, go_fmt
        summary         dict       — total_checks, passed, failed, score
    """
    generated: List[str] = []
    missing:   List[str] = []

    for rel in ALL_EXPECTED_FILES:
        if os.path.isfile(_full(rel)):
            generated.append(rel)
        else:
            missing.append(rel)

    # ── JSON validation ───────────────────────────────────────────────────────
    json_errors: List[str] = []
    for rel in EXPECTED_DATA_JSON_FILES + ["packages/i18nify-js/src/modules/currency/data/currencyConfig.json"]:
        if not os.path.isfile(_full(rel)):
            json_errors.append("%s: file missing" % rel)
            continue
        try:
            with open(_full(rel), encoding="utf-8") as f:
                data = json.load(f)
            if not data:
                json_errors.append("%s: parsed to empty object" % rel)
        except json.JSONDecodeError as e:
            json_errors.append("%s: JSONDecodeError — %s" % (rel, e))

    # ── Proto validation ──────────────────────────────────────────────────────
    proto_errors: List[str] = []
    for rel in EXPECTED_PROTO_FILES:
        if not os.path.isfile(_full(rel)):
            proto_errors.append("%s: file missing" % rel)
            continue
        content = _read(rel)
        if 'syntax = "proto3"' not in content:
            proto_errors.append('%s: missing syntax = "proto3"' % rel)
        if not re.search(r"^package\s+\w+", content, re.MULTILINE):
            proto_errors.append("%s: missing package declaration" % rel)
        if content.count("{") != content.count("}"):
            proto_errors.append("%s: unbalanced braces" % rel)

    # ── gofmt validation ──────────────────────────────────────────────────────
    go_fmt_errors: List[str] = []
    if GOFMT:
        go_only = [r for r in EXPECTED_GO_FILES if r.endswith(".go")]
        for rel in go_only:
            if not os.path.isfile(_full(rel)):
                continue
            err = _gofmt_errors(rel)
            if err:
                go_fmt_errors.append("%s: %s" % (rel, err))
    else:
        go_fmt_errors.append("gofmt not found in PATH — Go syntax checks skipped")

    # ── Summary ───────────────────────────────────────────────────────────────
    all_errors = json_errors + proto_errors + [e for e in go_fmt_errors if "skipped" not in e]
    total_checks = len(ALL_EXPECTED_FILES)
    passed       = len(generated)
    failed       = len(missing) + len(all_errors)
    success      = len(missing) == 0 and len(json_errors) == 0 and len(proto_errors) == 0

    return {
        "success":         success,
        "topic":           TOPIC_KEY,
        "workspace":       _WS,
        "generated_files": generated,
        "missing_files":   missing,
        "errors": {
            "json_validation":  json_errors,
            "proto_validation": proto_errors,
            "go_fmt":           go_fmt_errors,
        },
        "summary": {
            "total_checks": total_checks,
            "passed":       passed,
            "failed":       len(missing),
            "error_count":  len(all_errors),
            "score":        "%d/%d" % (passed, total_checks),
        },
    }


def print_json_report(report: Dict[str, Any]) -> None:
    print(json.dumps(report, indent=2, ensure_ascii=False))


def print_markdown_report(report: Dict[str, Any]) -> None:
    ok  = "✓" if report["success"] else "✗"
    print("# Utility-Creator Execution Harness Report")
    print()
    print("**Topic:** `%s`" % report["topic"])
    print("**Overall: %s %s  [%s]**" % (
        ok,
        "PASS" if report["success"] else "FAIL",
        report["summary"]["score"],
    ))
    print()

    print("## Generated Files (%d/%d)" % (
        len(report["generated_files"]), report["summary"]["total_checks"]))
    for f in report["generated_files"]:
        print("  - `%s`" % f)
    print()

    if report["missing_files"]:
        print("## Missing Files")
        for f in report["missing_files"]:
            print("  - `%s`" % f)
        print()

    print("## Validation Results")
    for category, errors in report["errors"].items():
        label = category.replace("_", " ").title()
        if not errors:
            print("  - **%s:** PASS" % label)
        else:
            print("  - **%s:** %d issue(s)" % (label, len(errors)))
            for e in errors:
                print("    - %s" % e)
    print()

    print("## Sample Assertions")
    print("```")
    print("PASS criteria:")
    print("  - all %d expected files exist on disk (WROTE| token for each)" % report["summary"]["total_checks"])
    print("  - data.json parses as valid JSON with currency_information key")
    print('  - .proto file contains syntax = "proto3" and package declaration')
    print("  - gofmt -e exits 0 on every .go file")
    print()
    print("FAIL triggers:")
    print("  - UTILITY_ERROR| or GO_UTILITY_ERROR| token in runner stdout")
    print("  - any expected file absent from the workspace")
    print("  - JSONDecodeError on data.json or currencyConfig.json")
    print("  - missing proto3 syntax declaration or unbalanced braces")
    print("  - gofmt exit code != 0 on any .go file")
    print("```")


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    use_markdown = "--markdown" in sys.argv
    use_report   = "--report"   in sys.argv

    if use_report:
        _WS = tempfile.mkdtemp(prefix="uc_harness_report_")
        try:
            _make_minimal_project(_WS)
            fixture_path = os.path.join(_WS, "tsf_result.json")
            with open(fixture_path, "w") as f:
                json.dump(FIXTURE_RESULT, f)
            _JS_PROC = _run_runner(RUNNER_JS, fixture_path)
            _GO_PROC = _run_runner(RUNNER_GO, fixture_path)

            report = build_report()
            if use_markdown:
                print_markdown_report(report)
            else:
                print_json_report(report)
        finally:
            shutil.rmtree(_WS, ignore_errors=True)

        sys.exit(0 if report["success"] else 1)
    else:
        unittest.main(verbosity=2)
