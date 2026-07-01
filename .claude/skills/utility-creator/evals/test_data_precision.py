"""
Evals for the DATA PRECISION RULE (SKILL.md §DATA_PRECISION_RULE).

Rule: every shortcode must be accompanied by its full human-readable
English name in the same object. Bare shortcodes are forbidden.

Tests run against the actual canonical data files in i18nify-data/.
Skipped gracefully when a file is not present in the working tree.

Run: python3 -m pytest test_data_precision.py -v
"""

import json
import os
import unittest

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))

DATA_FILES = {
    "currency_codes":      ("i18nify-data/currency/data.json",           "currency_information"),
    "http_status_codes":   ("i18nify-data/http-status/data.json",        "http_status_information"),
    "phone_calling_codes": ("i18nify-data/phone-number/data.json",       "country_tele_information"),
    "language_codes":      ("i18nify-data/language/data.json",           "language_information"),
    "address_formats":     ("i18nify-data/address/data.json",            "address_format_information"),
    "tld_list":            ("i18nify-data/tld/data.json",                "tld_information"),
}


def load_canonical(topic_key: str):
    """Load canonical data dict for a topic, or return None if file absent."""
    rel_path, data_key = DATA_FILES[topic_key]
    full_path = os.path.join(REPO_ROOT, rel_path)
    if not os.path.exists(full_path):
        return None
    with open(full_path, encoding="utf-8") as f:
        raw = json.load(f)
    return raw.get(data_key)


class TestCurrencyDataPrecision(unittest.TestCase):
    """ISO 4217 currency entries: cc must be accompanied by `name`."""

    def setUp(self):
        data = load_canonical("currency_codes")
        if data is None:
            self.skipTest("currency data.json not present")
        self.data = data

    def test_has_entries(self):
        self.assertGreater(len(self.data), 0, "currency data should not be empty")

    def test_every_entry_has_name(self):
        """Every currency entry must have a non-empty `name` field."""
        missing = [
            cc for cc, entry in self.data.items()
            if not isinstance(entry, dict) or not entry.get("name", "").strip()
        ]
        self.assertEqual(missing, [], f"Currency entries missing `name`: {missing[:5]}")

    def test_expected_minimum_coverage(self):
        """Should have at least 150 active ISO 4217 codes."""
        self.assertGreaterEqual(len(self.data), 150,
            f"Expected ≥150 currency entries, got {len(self.data)}")

    def test_major_currencies_present(self):
        """USD, EUR, GBP, JPY, INR must be present."""
        for code in ("USD", "EUR", "GBP", "JPY", "INR"):
            with self.subTest(code=code):
                self.assertIn(code, self.data, f"{code} missing from currency data")

    def test_usd_has_required_fields(self):
        """USD entry must have name, numeric_code, and minor_unit."""
        usd = self.data.get("USD", {})
        for field in ("name", "numeric_code", "minor_unit"):
            with self.subTest(field=field):
                self.assertIn(field, usd, f"USD missing field: {field!r}")
                self.assertTrue(str(usd[field]).strip(), f"USD.{field} is blank")

    def test_no_bare_currency_codes(self):
        """Entry values must be dicts — not bare strings or None."""
        non_dict = [
            cc for cc, entry in self.data.items()
            if not isinstance(entry, dict)
        ]
        self.assertEqual(non_dict, [], f"Non-dict currency entries: {non_dict[:5]}")


class TestHttpStatusDataPrecision(unittest.TestCase):
    """HTTP status entries: code must be accompanied by `description`."""

    def setUp(self):
        data = load_canonical("http_status_codes")
        if data is None:
            self.skipTest("http-status data.json not present")
        self.data = data

    def test_has_entries(self):
        self.assertGreater(len(self.data), 0)

    def test_every_entry_has_description(self):
        """Every HTTP status entry must have a non-empty `description`."""
        missing = [
            code for code, entry in self.data.items()
            if not isinstance(entry, dict) or not entry.get("description", "").strip()
        ]
        self.assertEqual(missing, [], f"Status entries missing `description`: {missing[:5]}")

    def test_minimum_60_codes(self):
        """IANA registry has 60+ defined status codes."""
        self.assertGreaterEqual(len(self.data), 60,
            f"Expected ≥60 HTTP status codes, got {len(self.data)}")

    def test_well_known_codes_present(self):
        """200, 301, 400, 404, 500 must be present."""
        for code in ("200", "301", "400", "404", "500"):
            with self.subTest(code=code):
                self.assertIn(code, self.data, f"HTTP {code} missing from data")


class TestRootDataKeyPresent(unittest.TestCase):
    """Canonical JSON files must have the expected root data_key structure."""

    def _assert_root_key(self, topic_key: str, expected_key: str):
        rel_path, _ = DATA_FILES[topic_key]
        full_path = os.path.join(REPO_ROOT, rel_path)
        if not os.path.exists(full_path):
            self.skipTest(f"{rel_path} not present")
        with open(full_path, encoding="utf-8") as f:
            raw = json.load(f)
        self.assertIn(expected_key, raw,
            f"{rel_path}: root key {expected_key!r} not found. Got: {list(raw.keys())}")
        self.assertIsInstance(raw[expected_key], dict,
            f"{rel_path}: root key {expected_key!r} must be a dict")
        self.assertGreater(len(raw[expected_key]), 0,
            f"{rel_path}: root key {expected_key!r} is an empty dict")

    def test_currency_root_key(self):
        self._assert_root_key("currency_codes", "currency_information")

    def test_http_status_root_key(self):
        self._assert_root_key("http_status_codes", "http_status_information")

    def test_phone_root_key(self):
        self._assert_root_key("phone_calling_codes", "country_tele_information")

    def test_language_root_key(self):
        self._assert_root_key("language_codes", "language_information")


class TestDataFileSchemaConsistency(unittest.TestCase):
    """All entries in a data file must have consistent (union of) field names."""

    def _check_field_consistency(self, topic_key: str, required_fields: list[str]):
        data = load_canonical(topic_key)
        if data is None:
            self.skipTest(f"{topic_key} data.json not present")
        failures = []
        for code, entry in data.items():
            if not isinstance(entry, dict):
                continue
            for field in required_fields:
                if field not in entry:
                    failures.append((code, field))
        if failures:
            sample = failures[:5]
            self.fail(f"{topic_key}: {len(failures)} entries missing required fields. Sample: {sample}")

    def test_currency_required_fields(self):
        """Every currency entry must have name and numeric_code."""
        self._check_field_consistency("currency_codes", ["name", "numeric_code"])

    def test_http_status_required_fields(self):
        """Every HTTP status entry must have description."""
        self._check_field_consistency("http_status_codes", ["description"])


class TestNoFabricatedData(unittest.TestCase):
    """
    Guards against the ANTI-MORPHING rule: the pipeline must not derive
    missing fields from related fields. We detect proxy violations by
    checking for known patterns of fabricated data (blank placeholders,
    'Unknown', sentinel values).
    """

    SENTINEL_VALUES = {"unknown", "n/a", "n.a.", "tbd", "todo", "null", "none", ""}

    def _check_no_sentinels(self, topic_key: str, fields_to_check: list[str]):
        data = load_canonical(topic_key)
        if data is None:
            self.skipTest(f"{topic_key} data.json not present")
        violations = []
        for code, entry in data.items():
            if not isinstance(entry, dict):
                continue
            for field in fields_to_check:
                val = str(entry.get(field, "")).strip().lower()
                if val in self.SENTINEL_VALUES:
                    violations.append((code, field, val))
        if violations:
            sample = violations[:5]
            self.fail(
                f"{topic_key}: {len(violations)} sentinel values found in "
                f"[{', '.join(fields_to_check)}]. Sample: {sample}"
            )

    def test_currency_no_sentinel_names(self):
        """Currency names must not be empty or sentinel placeholders."""
        self._check_no_sentinels("currency_codes", ["name"])

    def test_http_status_no_sentinel_descriptions(self):
        """HTTP status descriptions must not be empty or sentinel placeholders."""
        self._check_no_sentinels("http_status_codes", ["description"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
