"""
Output Quality Evals — data.json and utils code generation quality assessment.

Rubric dimensions (per SKILL.md evaluation guide):
  1. JSON Data Generation  — syntax, schema, data integrity          (weight: 35 %)
  2. Code Generation       — functionality, modularity, error handling (weight: 45 %)
  3. Integration / Synergy — utils ↔ data.json compatibility          (weight: 20 %)

Overall score: weighted pass-ratio × 10, rounded to 1 decimal.

Run individual tests:  python3 -m pytest test_output_quality.py -v
Run quality report:    python3 test_output_quality.py --report
"""

import json
import os
import re
import sys
import shutil
import subprocess
import tempfile
import unittest
from typing import Any, Dict, List, Tuple

REPO_ROOT   = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
RUNNER_PATH = os.path.join(os.path.dirname(__file__), "fixtures", "recipe8_runner.py")
VENV_PY     = os.path.join(REPO_ROOT, "venv", "bin", "python")
PYTHON      = VENV_PY if os.path.isfile(VENV_PY) else sys.executable

# ── Currency fixture (matches test_recipe8_structure.py) ─────────────────────

CURRENCY_FIXTURE_ROWS = [
    {"cc": "USD", "name": "US Dollar",      "numeric_code": "840", "minor_unit": "2", "symbol": "$"},
    {"cc": "EUR", "name": "Euro",            "numeric_code": "978", "minor_unit": "2", "symbol": "€"},
    {"cc": "GBP", "name": "Pound Sterling", "numeric_code": "826", "minor_unit": "2", "symbol": "£"},
    {"cc": "JPY", "name": "Yen",            "numeric_code": "392", "minor_unit": "0", "symbol": "¥"},
    {"cc": "INR", "name": "Indian Rupee",   "numeric_code": "356", "minor_unit": "2", "symbol": "₹"},
]

FIXTURE_RESULT = {
    "topic":           "currency_codes",
    "from_cache":      False,
    "cache_freshness": 0.97,
    "conflict_count":  0,
    "conflicts":       [],
    "all_sources":     [],
    "winner": {
        "tier":    1,
        "name":    "SIX Group XML",
        "url":     "https://www.six-group.com/...",
        "score":   91,
        "rows":    CURRENCY_FIXTURE_ROWS,
        "factors": {},
    },
}

# ── Module-level shared temp directory ───────────────────────────────────────

_SHARED_TMP = ""


def _make_minimal_project(root: str) -> None:
    os.makedirs(os.path.join(root, "packages", "i18nify-js", "src", "modules"), exist_ok=True)
    go_pkg = os.path.join(root, "packages", "i18nify-go")
    os.makedirs(go_pkg, exist_ok=True)
    with open(os.path.join(go_pkg, "go.mod"), "w") as f:
        f.write("module github.com/razorpay/i18nify/packages/i18nify-go\n\ngo 1.21\n\nrequire (\n)\n")
    with open(os.path.join(root, "packages", "i18nify-js", "src", "index.ts"), "w") as f:
        f.write("// barrel\n")


def _run_recipe8(topic_key: str, project_root: str, fixture_path: str) -> subprocess.CompletedProcess:
    env = os.environ.copy()
    env["UC_TOPIC_KEY"]       = topic_key
    env["UC_PROJECT_ROOT"]    = project_root
    env["UC_TSF_RESULT_PATH"] = fixture_path
    return subprocess.run(
        [PYTHON, RUNNER_PATH],
        capture_output=True, text=True, env=env, cwd=REPO_ROOT,
    )


def setUpModule() -> None:
    global _SHARED_TMP
    _SHARED_TMP = tempfile.mkdtemp(prefix="uc_eval_quality_")
    _make_minimal_project(_SHARED_TMP)
    fixture_path = os.path.join(_SHARED_TMP, "tsf_result.json")
    with open(fixture_path, "w") as f:
        json.dump(FIXTURE_RESULT, f)
    proc = _run_recipe8("currency_codes", _SHARED_TMP, fixture_path)
    if proc.returncode != 0:
        raise RuntimeError(
            "Recipe 8 failed during setUpModule — quality evals cannot run.\n"
            "stdout: %s\nstderr: %s" % (proc.stdout[:400], proc.stderr[:400])
        )


def tearDownModule() -> None:
    shutil.rmtree(_SHARED_TMP, ignore_errors=True)


# ── File helpers ──────────────────────────────────────────────────────────────

def _read(rel_path: str) -> str:
    with open(os.path.join(_SHARED_TMP, rel_path), encoding="utf-8") as f:
        return f.read()


def _load_canonical() -> Dict[str, Any]:
    with open(os.path.join(_SHARED_TMP, "i18nify-data/currency/data.json"), encoding="utf-8") as f:
        return json.load(f)


def _load_module_config() -> Dict[str, Any]:
    path = os.path.join(
        _SHARED_TMP,
        "packages/i18nify-js/src/modules/currency/data/currencyConfig.json",
    )
    with open(path, encoding="utf-8") as f:
        return json.load(f)


# ─────────────────────────────────────────────────────────────────────────────
# 1. JSON Data Generation Skill
# ─────────────────────────────────────────────────────────────────────────────

class TestJsonDataQuality(unittest.TestCase):
    """
    Rubric §1 — JSON Data Generation Skill
    Checks syntax/validity, schema structure, and data type integrity.
    """

    def test_json_syntax_valid(self):
        """data.json must parse cleanly — no trailing commas, mismatched brackets, or bad quoting."""
        path = os.path.join(_SHARED_TMP, "i18nify-data/currency/data.json")
        try:
            with open(path, encoding="utf-8") as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            self.fail("data.json has invalid JSON syntax: %s" % e)
        self.assertIsInstance(data, dict, "Root of data.json must be a JSON object, not an array")

    def test_schema_has_hierarchical_root_key(self):
        """data.json must use a topic-namespaced root key — not a flat top-level structure."""
        data = _load_canonical()
        self.assertIn("currency_information", data,
            "data.json missing 'currency_information' root key")
        self.assertIsInstance(data["currency_information"], dict,
            "currency_information must be a dict (code → object map), not a list or scalar")

    def test_schema_root_key_is_not_empty(self):
        """currency_information dict must contain at least one entry."""
        entries = _load_canonical()["currency_information"]
        self.assertGreater(len(entries), 0, "currency_information is empty — no data was written")

    def test_schema_has_source_metadata_block(self):
        """data.json must include a _source block to record data provenance."""
        data = _load_canonical()
        self.assertIn("_source", data, "_source provenance block missing from data.json")
        self.assertIsInstance(data["_source"], dict, "_source must be a dict, not a scalar")

    def test_schema_source_block_has_exact_keys(self):
        """_source must have exactly {topic, name, url, tier} — no extra, none missing."""
        src = _load_canonical()["_source"]
        self.assertEqual(
            set(src.keys()), {"topic", "name", "url", "tier"},
            "_source key set mismatch: %s" % set(src.keys()),
        )

    def test_data_integrity_entry_values_are_dicts(self):
        """Every currency entry must be a dict object — not a bare string, number, or None."""
        entries = _load_canonical()["currency_information"]
        non_dict = [k for k, v in entries.items() if not isinstance(v, dict)]
        self.assertEqual(non_dict, [], "Bare scalar entries found: %s" % non_dict[:5])

    def test_data_integrity_numeric_code_is_string(self):
        """
        ISO 4217 numeric codes are zero-padded 3-digit strings (e.g. '036', '840').
        Casting to int would silently drop leading zeros — they must remain strings.
        """
        entries = _load_canonical()["currency_information"]
        wrong = [
            (code, type(entry.get("numeric_code")).__name__)
            for code, entry in entries.items()
            if not isinstance(entry.get("numeric_code"), str)
        ]
        self.assertEqual(wrong, [],
            "numeric_code must stay as a string. Wrong types: %s" % wrong[:5])

    def test_data_integrity_minor_unit_is_integer_castable(self):
        """
        minor_unit represents decimal places (0–4 for most currencies).
        Whether stored as int or string, int(minor_unit) must succeed and be in [0, 8].
        """
        entries = _load_canonical()["currency_information"]
        invalid = []
        for code, entry in entries.items():
            val = entry.get("minor_unit")
            try:
                i = int(val)
                if not (0 <= i <= 8):
                    invalid.append((code, val, "out-of-range [0,8]"))
            except (TypeError, ValueError):
                invalid.append((code, val, "not int-castable"))
        self.assertEqual(invalid, [], "Invalid minor_unit values: %s" % invalid[:5])

    def test_data_integrity_source_tier_is_integer(self):
        """_source.tier must be a Python int (1, 2, or 3) — not the string '1'."""
        tier = _load_canonical()["_source"]["tier"]
        self.assertIsInstance(tier, int,
            "_source.tier must be int, got %s" % type(tier).__name__)
        self.assertIn(tier, (1, 2, 3),
            "_source.tier must be 1, 2, or 3; got %d" % tier)

    def test_data_integrity_no_empty_name_fields(self):
        """Every entry's `name` field must be a non-empty string — no blank placeholders."""
        entries = _load_canonical()["currency_information"]
        bad = [
            code for code, entry in entries.items()
            if not isinstance(entry.get("name"), str) or not entry["name"].strip()
        ]
        self.assertEqual(bad, [], "Entries with missing/empty name: %s" % bad[:5])

    def test_data_integrity_no_null_required_fields(self):
        """Required fields (name, symbol) must not be null — null breaks consumers silently."""
        entries = _load_canonical()["currency_information"]
        for code, entry in entries.items():
            for field in ("name", "symbol"):
                val = entry.get(field)
                with self.subTest(code=code, field=field):
                    self.assertIsNotNone(val,
                        "%s.%s is None — null values are forbidden in required fields" % (code, field))


# ─────────────────────────────────────────────────────────────────────────────
# 2. Code Generation Skill
# ─────────────────────────────────────────────────────────────────────────────

class TestCodeGenerationQuality(unittest.TestCase):
    """
    Rubric §2 — Code Generation Skill
    Checks functionality, modularity, error handling, and TypeScript best practices.
    """

    def test_types_ts_exports_named_type(self):
        """types.ts must export a named type — single responsibility for type definitions."""
        content = _read("packages/i18nify-js/src/modules/currency/types.ts")
        self.assertIn("export type", content, "types.ts must export at least one named type")
        self.assertIn("CurrencyCodeType", content, "types.ts must export CurrencyCodeType")

    def test_types_ts_defines_structured_interface(self):
        """types.ts must define an interface or object type — not only a code union."""
        content = _read("packages/i18nify-js/src/modules/currency/types.ts")
        has_structure = "interface" in content or (
            "= {" in content and "export" in content
        )
        self.assertTrue(has_structure,
            "types.ts should define a structured interface or object type for the currency shape")

    def test_constants_ts_uses_as_const_for_immutability(self):
        """`as const` is required on the code list — prevents accidental runtime mutation."""
        content = _read("packages/i18nify-js/src/modules/currency/constants.ts")
        self.assertIn("as const", content,
            "constants.ts must use `as const` to make the code list a readonly literal type")

    def test_get_list_has_error_boundary(self):
        """getCurrencyList must be wrapped with withErrorBoundary for graceful error handling."""
        content = _read("packages/i18nify-js/src/modules/currency/getCurrencyList.ts")
        self.assertIn("withErrorBoundary", content,
            "getCurrencyList.ts must use withErrorBoundary — prevents uncaught exceptions "
            "from propagating to the caller")

    def test_get_list_has_explicit_return_type(self):
        """getCurrencyList must have an explicit TypeScript return type annotation."""
        content = _read("packages/i18nify-js/src/modules/currency/getCurrencyList.ts")
        has_return_type = (
            bool(re.search(r":\s*Record<", content))
            or bool(re.search(r"\)\s*:\s*\w", content))
        )
        self.assertTrue(has_return_type,
            "getCurrencyList must have an explicit return type annotation — "
            "implicit `any` defeats the purpose of TypeScript")

    def test_utils_ts_uses_typed_parameters(self):
        """utils.ts functions must annotate parameter types — no implicit `any`."""
        content = _read("packages/i18nify-js/src/modules/currency/utils.ts")
        self.assertIn("CodeType", content,
            "utils.ts must use typed parameters (e.g. code: CurrencyCodeType) — "
            "implicit any hides type errors at call sites")

    def test_utils_ts_handles_unknown_code(self):
        """utils.ts getCurrencyInfo must return null/undefined for unknown codes — not throw."""
        content = _read("packages/i18nify-js/src/modules/currency/utils.ts")
        has_fallback = "?? null" in content or "?? undefined" in content or "|| null" in content
        self.assertTrue(has_fallback,
            "utils.ts must return null/undefined for unknown codes — "
            "throwing on bad input forces callers to add try/catch everywhere")

    def test_index_ts_is_pure_barrel(self):
        """index.ts must only re-export — no business logic, no const bindings with values."""
        content = _read("packages/i18nify-js/src/modules/currency/index.ts")
        has_logic = re.search(r"\bfunction\b|\bclass\b|\bconst\b\s+\w+\s*=\s*[^;{]", content)
        self.assertIsNone(has_logic,
            "index.ts must be a pure barrel (only `export` statements) — "
            "business logic in a barrel hides the module structure")
        self.assertIn("export", content, "index.ts must have at least one export statement")

    def test_test_file_has_describe_and_it_blocks(self):
        """Test file must use describe/it for readable, structured test output."""
        content = _read(
            "packages/i18nify-js/src/modules/currency/__tests__/getCurrencyList.test.ts"
        )
        self.assertIn("describe(", content, "Test file must have a describe() block")
        self.assertIn("it(", content, "Test file must have at least one it() block")

    def test_test_file_has_multiple_cases(self):
        """Test file must cover ≥2 distinct behaviours — one happy path and one shape check."""
        content = _read(
            "packages/i18nify-js/src/modules/currency/__tests__/getCurrencyList.test.ts"
        )
        it_count = len(re.findall(r"\bit\(", content))
        self.assertGreaterEqual(it_count, 2,
            "Test file should have ≥2 it() cases; found %d. "
            "Add tests for: return type, non-empty result, entry shape." % it_count)

    def test_test_file_has_assertions(self):
        """Test file must contain expect() calls — empty test bodies give false confidence."""
        content = _read(
            "packages/i18nify-js/src/modules/currency/__tests__/getCurrencyList.test.ts"
        )
        self.assertIn("expect(", content,
            "Test file must contain expect() assertions — tests without assertions always pass")

    def test_module_config_json_is_valid(self):
        """currencyConfig.json (runtime module data) must be parseable valid JSON."""
        try:
            data = _load_module_config()
        except json.JSONDecodeError as e:
            self.fail("currencyConfig.json has invalid JSON syntax: %s" % e)
        self.assertIsInstance(data, dict,
            "currencyConfig.json root must be a JSON object, not an array or scalar")
        self.assertGreater(len(data), 0, "currencyConfig.json is empty")


# ─────────────────────────────────────────────────────────────────────────────
# 3. Integration & Synergy
# ─────────────────────────────────────────────────────────────────────────────

class TestIntegrationSynergy(unittest.TestCase):
    """
    Rubric §3 — Integration & Synergy
    Verifies that generated utils correctly map to data.json keys and structure.
    Mismatches here cause silent runtime failures that TypeScript cannot catch.
    """

    def test_module_config_codes_are_subset_of_canonical_data(self):
        """
        Every code in currencyConfig.json must also exist in canonical data.json.
        Orphan codes in the module config indicate the module was generated from
        a different source than the canonical data — a data-split bug.
        """
        canonical_codes = set(_load_canonical()["currency_information"].keys())
        config_codes    = set(_load_module_config().keys())
        orphan = config_codes - canonical_codes
        self.assertEqual(orphan, set(),
            "currencyConfig.json has codes absent from canonical data.json: %s" % orphan)

    def test_constants_ts_contains_all_canonical_codes(self):
        """
        Every code in data.json must appear in CURRENCY_CODE_LIST in constants.ts.
        A missing code means a valid ISO currency cannot be passed as a typed argument.
        """
        canonical_codes = set(_load_canonical()["currency_information"].keys())
        content = _read("packages/i18nify-js/src/modules/currency/constants.ts")
        missing = [code for code in canonical_codes if code not in content]
        self.assertEqual(missing, [],
            "Codes in data.json missing from constants.ts: %s" % missing[:5])

    def test_get_list_imports_module_config(self):
        """getCurrencyList must import from currencyConfig.json — the runtime data source."""
        content = _read("packages/i18nify-js/src/modules/currency/getCurrencyList.ts")
        self.assertIn("currencyConfig", content,
            "getCurrencyList.ts must import currencyConfig.json. "
            "Importing from canonical data.json directly would bundle the full dataset.")

    def test_types_ts_derives_type_from_module_config(self):
        """
        CurrencyCodeType must be derived from currencyConfig.json keys.
        If types.ts uses a hand-written union, it will drift from the actual runtime data.
        """
        content = _read("packages/i18nify-js/src/modules/currency/types.ts")
        self.assertIn("currencyConfig", content,
            "types.ts must import currencyConfig.json to derive CurrencyCodeType from actual data keys")

    def test_test_file_imports_get_list(self):
        """Test file must import getCurrencyList — the function under test."""
        content = _read(
            "packages/i18nify-js/src/modules/currency/__tests__/getCurrencyList.test.ts"
        )
        self.assertIn("getCurrencyList", content,
            "Test file must import getCurrencyList")
        self.assertIn("import", content,
            "Test file must have an import statement (currently has no imports)")

    def test_index_ts_re_exports_get_list(self):
        """index.ts barrel must expose getCurrencyList so package consumers can import it."""
        content = _read("packages/i18nify-js/src/modules/currency/index.ts")
        self.assertIn("getCurrencyList", content,
            "index.ts must re-export getCurrencyList — missing re-export breaks public API")

    def test_data_precision_no_bare_shortcodes(self):
        """
        Integration check: data.json must not store bare ISO codes as values.
        Each code key must map to a rich object with at least a `name` field.
        Mirrors SKILL.md DATA PRECISION RULE.
        """
        entries = _load_canonical()["currency_information"]
        violations = [
            code for code, entry in entries.items()
            if not isinstance(entry, dict) or "name" not in entry
        ]
        self.assertEqual(violations, [],
            "Bare shortcodes or entries missing `name`: %s" % violations[:5])


# ─────────────────────────────────────────────────────────────────────────────
# Quality Score Reporter
# ─────────────────────────────────────────────────────────────────────────────

_DIMENSION_CLASSES: Dict[str, Any] = {
    "JSON Data Generation": TestJsonDataQuality,
    "Code Generation":      TestCodeGenerationQuality,
    "Integration/Synergy":  TestIntegrationSynergy,
}

_DIMENSION_WEIGHTS: Dict[str, float] = {
    "JSON Data Generation": 0.35,
    "Code Generation":      0.45,
    "Integration/Synergy":  0.20,
}


def _run_class_silently(cls) -> Tuple[int, int, List[str]]:
    """Return (passed, total, failure_messages) by running a test class quietly."""
    loader = unittest.TestLoader()
    suite  = loader.loadTestsFromTestCase(cls)
    result = unittest.TestResult()
    suite.run(result)
    msgs   = [str(f[1]) for f in result.failures + result.errors]
    passed = suite.countTestCases() - len(result.failures) - len(result.errors)
    return passed, suite.countTestCases(), msgs


def _last_assertion_line(traceback_str: str) -> str:
    """Extract the AssertionError message from a traceback string."""
    lines = [l.strip() for l in traceback_str.splitlines() if l.strip()]
    return lines[-1][:110] if lines else traceback_str[:110]


def print_quality_report() -> None:
    """
    Print the rubric-style quality evaluation report to stdout.
    Format:

      [Overall Score: X/10]
      1. data.json Analysis
      2. utils Code Analysis
      3. Integration Analysis
      4. Suggested Improvements
    """
    dim_results: Dict[str, Dict[str, Any]] = {}
    for dim_name, cls in _DIMENSION_CLASSES.items():
        passed, total, failures = _run_class_silently(cls)
        dim_results[dim_name] = {"passed": passed, "total": total, "failures": failures}

    # Weighted score
    weighted = sum(
        (dim_results[d]["passed"] / dim_results[d]["total"] if dim_results[d]["total"] else 0.0)
        * w
        for d, w in _DIMENSION_WEIGHTS.items()
    )
    overall = round(weighted * 10, 1)

    SEP = "=" * 60
    print("\n" + SEP)
    print("  [Overall Score: %.1f/10]" % overall)
    print(SEP)

    # ── 1. data.json Analysis ─────────────────────────────────────────────────
    r = dim_results["JSON Data Generation"]
    print("\n**1. `data.json` Analysis:**  (%d/%d checks pass)" % (r["passed"], r["total"]))
    print("  * **Strengths:**")
    if r["passed"] > 0:
        print("    - Valid JSON syntax and parseable structure")
        if r["passed"] >= r["total"]:
            print("    - Hierarchical schema with namespaced root key")
            print("    - `_source` provenance block has exactly 4 required keys")
            print("    - Data types are correct: `numeric_code` as string, `tier` as int")
            print("    - No null/blank values in required fields (name, symbol)")
        else:
            print("    - %d of %d structural checks pass" % (r["passed"], r["total"]))
    else:
        print("    - (no checks passed)")
    print("  * **Issues/Bugs:**")
    if r["failures"]:
        for msg in r["failures"]:
            print("    - %s" % _last_assertion_line(msg))
    else:
        print("    - None detected")

    # ── 2. utils Code Analysis ────────────────────────────────────────────────
    r = dim_results["Code Generation"]
    print("\n**2. `utils` Code Analysis:**  (%d/%d checks pass)" % (r["passed"], r["total"]))
    print("  * **Strengths:**")
    if r["passed"] >= r["total"] * 0.8:
        print("    - TypeScript type exports present in `types.ts`")
        print("    - `withErrorBoundary` wrapping in `getCurrencyList.ts`")
        print("    - `as const` applied to code list in `constants.ts`")
        print("    - `index.ts` is a pure barrel (no logic)")
        print("    - Test file uses `describe`/`it`/`expect` structure with multiple cases")
    elif r["passed"] > 0:
        print("    - %d of %d code quality checks pass" % (r["passed"], r["total"]))
    else:
        print("    - (no checks passed)")
    print("  * **Issues/Bugs:**")
    if r["failures"]:
        for msg in r["failures"]:
            print("    - %s" % _last_assertion_line(msg))
    else:
        print("    - None detected")

    # ── 3. Integration Analysis ───────────────────────────────────────────────
    r = dim_results["Integration/Synergy"]
    print("\n**3. Integration Analysis:**  (%d/%d checks pass)" % (r["passed"], r["total"]))
    if r["passed"] == r["total"]:
        print("  - `currencyConfig.json` codes are a strict subset of `data.json` codes")
        print("  - `constants.ts` CURRENCY_CODE_LIST matches canonical data keys")
        print("  - `getCurrencyList.ts` imports `currencyConfig.json` (not the raw canonical file)")
        print("  - `types.ts` derives `CurrencyCodeType` from the same runtime config")
        print("  - Test file correctly targets `getCurrencyList`")
    elif r["failures"]:
        print("  - %d/%d integration checks fail — utils/data.json keys diverge:" % (
            r["total"] - r["passed"], r["total"]))
        for msg in r["failures"]:
            print("    MISMATCH: %s" % _last_assertion_line(msg))
    else:
        print("  - %d/%d checks pass" % (r["passed"], r["total"]))

    # ── 4. Suggested Improvements ─────────────────────────────────────────────
    print("\n**4. Suggested Improvements:**")
    suggestions: List[str] = []

    # Data type: minor_unit stored as string instead of int
    try:
        entries = _load_canonical()["currency_information"]
        sample  = next(iter(entries.values())) if entries else {}
        if isinstance(sample.get("minor_unit"), str):
            suggestions.append(
                "[data.json] `minor_unit` is stored as a string (e.g. \"2\") — "
                "it should be an integer since it represents decimal places.\n"
                "  Fix in recipe8_runner.py:\n"
                "    entry['minor_unit'] = int(entry.get('minor_unit', 0))"
            )
    except Exception:
        pass

    # utils.ts: missing JSDoc comments
    try:
        types_content = _read("packages/i18nify-js/src/modules/currency/types.ts")
        if "/**" not in types_content and "//" not in types_content:
            suggestions.append(
                "[utils] `types.ts` has no JSDoc comments — add inline docs "
                "so IDE tooltips describe each type:\n"
                "  /** ISO 4217 alpha-3 currency code (e.g. 'USD', 'EUR'). */\n"
                "  export type CurrencyCodeType = keyof typeof CURRENCY_INFO;"
            )
    except Exception:
        pass

    # Test file: missing edge-case tests
    try:
        test_content = _read(
            "packages/i18nify-js/src/modules/currency/__tests__/getCurrencyList.test.ts"
        )
        if "null" not in test_content and "undefined" not in test_content:
            suggestions.append(
                "[utils] Test file does not test unknown/invalid codes — add:\n"
                "  it('entry for unknown code is undefined', () => {\n"
                "    const list = getCurrencyList();\n"
                "    expect((list as Record<string, unknown>)['INVALID']).toBeUndefined();\n"
                "  });"
            )
    except Exception:
        pass

    # Collect any remaining failure-driven suggestions
    for dim_name, r in dim_results.items():
        for msg in r["failures"]:
            last = _last_assertion_line(msg)
            # Avoid duplicating already-listed suggestions
            if not any(last[:40] in s for s in suggestions):
                suggestions.append("[%s] %s" % (dim_name, last))

    if suggestions:
        for suggestion in suggestions:
            print("  * %s\n" % suggestion)
    else:
        print("  * No critical improvements needed — all checks pass.")

    print(SEP + "\n")


# ── Entry point for --report mode ─────────────────────────────────────────────

if __name__ == "__main__":
    if "--report" in sys.argv:
        _SHARED_TMP = tempfile.mkdtemp(prefix="uc_eval_quality_report_")
        try:
            _make_minimal_project(_SHARED_TMP)
            fixture_path = os.path.join(_SHARED_TMP, "tsf_result.json")
            with open(fixture_path, "w") as f:
                json.dump(FIXTURE_RESULT, f)
            proc = _run_recipe8("currency_codes", _SHARED_TMP, fixture_path)
            if proc.returncode != 0:
                print("ERROR: Recipe 8 failed:\n" + proc.stderr[:500])
                sys.exit(1)
            print_quality_report()
        finally:
            shutil.rmtree(_SHARED_TMP, ignore_errors=True)
    else:
        unittest.main(verbosity=2)
