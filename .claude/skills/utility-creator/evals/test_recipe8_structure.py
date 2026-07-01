"""
Evals for Recipe 8 (JS/TS utility generation) and Recipe 8-Go.

Sets up a minimal project scaffold in a temp directory, runs Recipe 8
via fixtures/recipe8_runner.py (parameterised via env vars), and verifies:
  - all expected file paths are written (WROTE| lines in stdout)
  - UTILITY_DONE token is present
  - no raw code content is echoed to stdout
  - generated TypeScript files have correct structural markers
  - generated canonical data has all fixture rows

Run: python3 -m pytest test_recipe8_structure.py -v
"""

import json
import os
import re
import sys
import shutil
import subprocess
import tempfile
import textwrap
import unittest

REPO_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "..")
)
RUNNER_PATH = os.path.join(os.path.dirname(__file__), "fixtures", "recipe8_runner.py")

VENV_PY = os.path.join(REPO_ROOT, "venv", "bin", "python")
PYTHON  = VENV_PY if os.path.isfile(VENV_PY) else sys.executable

# Minimal tsf_result.json fixture using a subset of real currency rows.
CURRENCY_FIXTURE_ROWS = [
    {"cc": "USD", "name": "US Dollar",      "numeric_code": "840", "minor_unit": "2", "symbol": "$"},
    {"cc": "EUR", "name": "Euro",            "numeric_code": "978", "minor_unit": "2", "symbol": "€"},
    {"cc": "GBP", "name": "Pound Sterling", "numeric_code": "826", "minor_unit": "2", "symbol": "£"},
    {"cc": "JPY", "name": "Yen",            "numeric_code": "392", "minor_unit": "0", "symbol": "¥"},
    {"cc": "INR", "name": "Indian Rupee",   "numeric_code": "356", "minor_unit": "2", "symbol": "₹"},
]

FIXTURE_RESULT = {
    "topic":          "currency_codes",
    "from_cache":     False,
    "cache_freshness": 0.97,
    "conflict_count": 0,
    "conflicts":      [],
    "all_sources":    [],
    "winner": {
        "tier":  1,
        "name":  "SIX Group XML",
        "url":   "https://www.six-group.com/...",
        "score": 91,
        "rows":  CURRENCY_FIXTURE_ROWS,
        "factors": {},
    },
}

EXPECTED_JS_FILES = [
    "i18nify-data/currency/data.json",
    "i18nify-data/currency/proto/currency.proto",
    "i18nify-data/currency/README.md",
    "packages/i18nify-js/src/modules/currency/data/currencyConfig.json",
    "packages/i18nify-js/src/modules/currency/types.ts",
    "packages/i18nify-js/src/modules/currency/constants.ts",
    "packages/i18nify-js/src/modules/currency/utils.ts",
    "packages/i18nify-js/src/modules/currency/getCurrencyList.ts",
    "packages/i18nify-js/src/modules/currency/index.ts",
    "packages/i18nify-js/src/modules/currency/__tests__/getCurrencyList.test.ts",
]


def _make_minimal_project(root):
    os.makedirs(os.path.join(root, "packages", "i18nify-js", "src", "modules"), exist_ok=True)
    go_pkg = os.path.join(root, "packages", "i18nify-go")
    os.makedirs(go_pkg, exist_ok=True)
    with open(os.path.join(go_pkg, "go.mod"), "w") as f:
        f.write("module github.com/razorpay/i18nify/packages/i18nify-go\n\ngo 1.21\n\nrequire (\n)\n")
    with open(os.path.join(root, "packages", "i18nify-js", "src", "index.ts"), "w") as f:
        f.write("// barrel\n")


def _run_recipe8(topic_key, project_root, fixture_path):
    env = os.environ.copy()
    env["UC_TOPIC_KEY"]       = topic_key
    env["UC_PROJECT_ROOT"]    = project_root
    env["UC_TSF_RESULT_PATH"] = fixture_path
    proc = subprocess.run(
        [PYTHON, RUNNER_PATH],
        capture_output=True, text=True, env=env, cwd=REPO_ROOT,
    )
    return proc


class TestRecipe8OutputContract(unittest.TestCase):

    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix="uc_eval_r8_")
        _make_minimal_project(self.tmp)
        self.fixture_path = os.path.join(self.tmp, "tsf_result.json")
        with open(self.fixture_path, "w") as f:
            json.dump(FIXTURE_RESULT, f)
        self.proc = _run_recipe8("currency_codes", self.tmp, self.fixture_path)

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def test_exits_zero(self):
        self.assertEqual(self.proc.returncode, 0,
            "Recipe 8 must exit 0\nstdout: %s\nstderr: %s" % (self.proc.stdout[:300], self.proc.stderr[:300]))

    def test_utility_done_token_present(self):
        self.assertIn("UTILITY_DONE|currency|files=10", self.proc.stdout,
            "UTILITY_DONE missing.\nstdout: " + self.proc.stdout[:400])

    def test_all_js_files_written(self):
        for rel_path in EXPECTED_JS_FILES:
            with self.subTest(path=rel_path):
                self.assertIn("WROTE|" + rel_path, self.proc.stdout,
                    "Missing WROTE| for %s\nstdout:\n%s" % (rel_path, self.proc.stdout))

    def test_all_js_files_exist_on_disk(self):
        for rel_path in EXPECTED_JS_FILES:
            full = os.path.join(self.tmp, rel_path)
            with self.subTest(path=rel_path):
                self.assertTrue(os.path.isfile(full),
                    "File not found on disk: " + rel_path)

    def test_no_raw_code_echoed_to_stdout(self):
        """stdout must only contain WROTE| or UTILITY_DONE| or UTILITY_ERROR| lines."""
        allowed = re.compile(r"^(WROTE\||UTILITY_DONE\||UTILITY_ERROR\|)")
        for line in self.proc.stdout.strip().splitlines():
            if line.strip():
                self.assertTrue(allowed.match(line),
                    "Unexpected output line (raw code leak?): %r" % line)

    def test_no_traceback_in_stderr(self):
        self.assertNotIn("Traceback", self.proc.stderr,
            "Traceback in stderr:\n" + self.proc.stderr[:400])

    def test_entry_count_in_utility_done(self):
        """UTILITY_DONE should report 5 entries (matching our fixture)."""
        self.assertIn("entries=5", self.proc.stdout)


class TestRecipe8TypeScriptContent(unittest.TestCase):

    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix="uc_eval_ts_")
        _make_minimal_project(self.tmp)
        self.fixture_path = os.path.join(self.tmp, "tsf_result.json")
        with open(self.fixture_path, "w") as f:
            json.dump(FIXTURE_RESULT, f)
        _run_recipe8("currency_codes", self.tmp, self.fixture_path)

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def _read(self, rel_path):
        with open(os.path.join(self.tmp, rel_path), encoding="utf-8") as f:
            return f.read()

    def test_types_ts_has_code_type_export(self):
        content = self._read("packages/i18nify-js/src/modules/currency/types.ts")
        self.assertIn("CurrencyCodeType", content)
        self.assertIn("export type", content)

    def test_constants_ts_has_code_list(self):
        content = self._read("packages/i18nify-js/src/modules/currency/constants.ts")
        self.assertIn("CURRENCY_CODE_LIST", content)
        for code in ("USD", "EUR", "GBP", "JPY", "INR"):
            self.assertIn(code, content, "%s missing from constants.ts" % code)

    def test_get_list_ts_has_error_boundary(self):
        content = self._read("packages/i18nify-js/src/modules/currency/getCurrencyList.ts")
        self.assertIn("withErrorBoundary", content)
        self.assertIn("getCurrencyList", content)

    def test_index_ts_exports_get_list(self):
        content = self._read("packages/i18nify-js/src/modules/currency/index.ts")
        self.assertIn("getCurrencyList", content)
        self.assertIn("export", content)

    def test_test_file_imports_get_list(self):
        content = self._read(
            "packages/i18nify-js/src/modules/currency/__tests__/getCurrencyList.test.ts"
        )
        self.assertIn("getCurrencyList", content)
        self.assertIn("describe", content)

    def test_canonical_data_json_has_root_key(self):
        with open(os.path.join(self.tmp, "i18nify-data/currency/data.json")) as f:
            data = json.load(f)
        self.assertIn("currency_information", data)
        self.assertGreater(len(data["currency_information"]), 0)

    def test_canonical_data_json_has_source_metadata(self):
        """data.json must contain a _source block with exactly topic, name, url, and tier."""
        with open(os.path.join(self.tmp, "i18nify-data/currency/data.json")) as f:
            data = json.load(f)

        self.assertIn("_source", data, "_source key missing from canonical data.json")
        src = data["_source"]

        # Check that all four keys exist
        self.assertIn("topic", src, "_source.topic missing")
        self.assertIn("name",  src, "_source.name missing")
        self.assertIn("url",   src, "_source.url missing")
        self.assertIn("tier",  src, "_source.tier missing")

        # Check that they aren't empty
        self.assertTrue(src["topic"], "_source.topic must not be empty")
        self.assertTrue(src["name"],  "_source.name must not be empty")
        self.assertTrue(src["url"],   "_source.url must not be empty")

        # Strict check: Ensure ONLY these 4 keys exist
        self.assertEqual(len(src.keys()), 4, "The _source block should only contain topic, name, url, and tier")


class TestRecipe8CanonicalDataContent(unittest.TestCase):

    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix="uc_eval_data_")
        _make_minimal_project(self.tmp)
        self.fixture_path = os.path.join(self.tmp, "tsf_result.json")
        with open(self.fixture_path, "w") as f:
            json.dump(FIXTURE_RESULT, f)
        _run_recipe8("currency_codes", self.tmp, self.fixture_path)

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def test_all_fixture_codes_present_in_canonical_data(self):
        with open(os.path.join(self.tmp, "i18nify-data/currency/data.json")) as f:
            data = json.load(f)["currency_information"]
        for row in CURRENCY_FIXTURE_ROWS:
            self.assertIn(row["cc"], data,
                "%s missing from generated canonical data" % row["cc"])

    def test_canonical_data_has_name_field_per_entry(self):
        with open(os.path.join(self.tmp, "i18nify-data/currency/data.json")) as f:
            data = json.load(f)["currency_information"]
        for code, entry in data.items():
            self.assertIn("name", entry, "%s missing `name` in generated canonical data" % code)

    def test_entry_count_matches_fixture(self):
        with open(os.path.join(self.tmp, "i18nify-data/currency/data.json")) as f:
            data = json.load(f)["currency_information"]
        self.assertEqual(len(data), len(CURRENCY_FIXTURE_ROWS),
            "Expected %d entries, got %d" % (len(CURRENCY_FIXTURE_ROWS), len(data)))

    def test_source_metadata_matches_fixture_winner(self):
        """_source fields must match the fixture winner's name and url."""
        with open(os.path.join(self.tmp, "i18nify-data/currency/data.json")) as f:
            data = json.load(f)
        src = data.get("_source", {})
        self.assertEqual(src.get("name"), FIXTURE_RESULT["winner"]["name"])
        self.assertEqual(src.get("url"),  FIXTURE_RESULT["winner"]["url"])
        self.assertEqual(src.get("tier"), FIXTURE_RESULT["winner"]["tier"])


class TestRecipe8UnsupportedTopic(unittest.TestCase):

    def test_http_status_is_unsupported(self):
        """http_status_codes is intentionally absent from Recipe 8 TOPIC_MAP."""
        tmp = tempfile.mkdtemp(prefix="uc_eval_unsupported_")
        try:
            _make_minimal_project(tmp)
            fixture = dict(FIXTURE_RESULT, topic="http_status_codes")
            fixture_path = os.path.join(tmp, "tsf_result.json")
            with open(fixture_path, "w") as f:
                json.dump(fixture, f)
            proc = _run_recipe8("http_status_codes", tmp, fixture_path)
            self.assertIn("UTILITY_ERROR", proc.stdout,
                "Expected UTILITY_ERROR for unsupported topic.\nstdout: " + proc.stdout)
            self.assertNotEqual(proc.returncode, 0)
        finally:
            shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    unittest.main(verbosity=2)
