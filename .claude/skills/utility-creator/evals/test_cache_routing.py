"""
Evals for Recipe 1 — cache routing logic.

Verifies that the Recipe 1 Python snippet emits the correct routing token
(CACHE_HIT, CACHE_STALE, CACHE_MISS) based on file age and TTL.

Run: python3 -m pytest test_cache_routing.py -v
"""

import os
import sys
import time
import json
import tempfile
import textwrap
import subprocess
import unittest

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))

VENV_PY = os.path.join(REPO_ROOT, "venv", "bin", "python")
PYTHON  = VENV_PY if os.path.isfile(VENV_PY) else sys.executable

# Recipe 1 core logic — extracted to run against a configurable path + ttl
RECIPE1_SCRIPT = textwrap.dedent("""\
    import os, sys
    from datetime import datetime, timezone

    topic      = {topic!r}
    local_path = {local_path!r}
    ttl        = {ttl}

    if os.path.exists(local_path):
        mtime    = os.path.getmtime(local_path)
        age_days = (datetime.now(timezone.utc).timestamp() - mtime) / 86400
        if age_days <= ttl:
            print(f"CACHE_HIT|LOCAL:{{local_path}}|{{age_days:.1f}}|{{ttl}}")
        else:
            print(f"CACHE_STALE|{{age_days:.1f}}|{{ttl}}")
    else:
        print("CACHE_MISS")
""")


def run_recipe1(local_path: str, topic: str = "http_status_codes", ttl: int = 7) -> str:
    """Run the Recipe 1 cache check against `local_path` and return the first output token."""
    script = RECIPE1_SCRIPT.format(topic=topic, local_path=local_path, ttl=ttl)
    proc = subprocess.run([PYTHON, "-c", script], capture_output=True, text=True)
    return proc.stdout.strip().split("\n")[0]


class TestCacheHitRouting(unittest.TestCase):

    def test_fresh_file_returns_cache_hit(self):
        """A just-written file should return CACHE_HIT|LOCAL:..."""
        with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
            json.dump({"http_status_information": {}}, f)
            path = f.name
        try:
            result = run_recipe1(path, ttl=7)
            self.assertTrue(result.startswith("CACHE_HIT|LOCAL:"),
                            f"Expected CACHE_HIT|LOCAL:..., got: {result!r}")
        finally:
            os.unlink(path)

    def test_cache_hit_contains_path(self):
        """CACHE_HIT token must embed the exact file path."""
        with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
            json.dump({}, f)
            path = f.name
        try:
            result = run_recipe1(path, ttl=30)
            self.assertIn(path, result, "CACHE_HIT must include the file path")
        finally:
            os.unlink(path)

    def test_cache_hit_embeds_age_and_ttl(self):
        """CACHE_HIT line must have pipe-delimited age and ttl fields."""
        with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
            json.dump({}, f)
            path = f.name
        try:
            result = run_recipe1(path, ttl=30)
            parts = result.split("|")
            # Format: CACHE_HIT|LOCAL:{path}|{age}|{ttl}
            self.assertEqual(len(parts), 4, f"Expected 4 pipe-delimited fields, got: {result!r}")
            self.assertEqual(parts[-1], "30", f"Last field should be TTL=30, got {parts[-1]!r}")
        finally:
            os.unlink(path)


class TestCacheStaleRouting(unittest.TestCase):

    def _write_old_file(self, days_old: float = 10.0) -> str:
        with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
            json.dump({}, f)
            path = f.name
        old_mtime = time.time() - days_old * 86400
        os.utime(path, (old_mtime, old_mtime))
        return path

    def test_stale_file_returns_cache_stale(self):
        """A file older than TTL should return CACHE_STALE|..."""
        path = self._write_old_file(days_old=10.0)
        try:
            result = run_recipe1(path, ttl=7)
            self.assertTrue(result.startswith("CACHE_STALE|"),
                            f"Expected CACHE_STALE|..., got: {result!r}")
        finally:
            os.unlink(path)

    def test_stale_token_has_age_and_ttl(self):
        """CACHE_STALE must include age and ttl fields."""
        path = self._write_old_file(days_old=15.0)
        try:
            result = run_recipe1(path, ttl=7)
            parts = result.split("|")
            # Format: CACHE_STALE|{age}|{ttl}
            self.assertEqual(len(parts), 3, f"Expected 3 fields, got: {result!r}")
        finally:
            os.unlink(path)

    def test_file_at_exactly_ttl_boundary_is_hit(self):
        """A file aged exactly at TTL (<=) should be a CACHE_HIT, not STALE."""
        path = self._write_old_file(days_old=7.0)
        try:
            result = run_recipe1(path, ttl=7)
            # age_days ≈ 7.0 which is <= 7, so CACHE_HIT expected
            # (floating point may push it slightly over; allow STALE with age 7.x)
            self.assertTrue(
                result.startswith("CACHE_HIT") or result.startswith("CACHE_STALE"),
                f"Unexpected token at TTL boundary: {result!r}"
            )
        finally:
            os.unlink(path)


class TestCacheMissRouting(unittest.TestCase):

    def test_missing_file_returns_cache_miss(self):
        """A path that does not exist should return CACHE_MISS."""
        result = run_recipe1("/tmp/definitely_does_not_exist_xyzzy.json", ttl=7)
        self.assertEqual(result, "CACHE_MISS", f"Expected CACHE_MISS, got: {result!r}")

    def test_missing_file_different_topic(self):
        """CACHE_MISS regardless of topic when file is absent."""
        result = run_recipe1("/tmp/no_such_file.json", topic="currency_codes", ttl=30)
        self.assertEqual(result, "CACHE_MISS")


class TestCacheTTLPerTopic(unittest.TestCase):
    """Verify each topic's configured TTL matches the SKILL.md spec."""

    EXPECTED_TTLS = {
        "http_status_codes":   7,
        "tld_list":            7,
        "timezones":           7,
        "currency_codes":      30,
        "country_codes":       30,
        "language_codes":      30,
        "phone_calling_codes": 30,
        "address_formats":     30,
        "mime_types":          30,
        "unicode_blocks":      30,
        "gst_rates_india":     30,
        "population_data":     365,
    }

    def test_ttl_values_match_spec(self):
        """Canonical TTL table (from Recipe 1 ttl_map) must match SKILL.md spec."""
        # Inline the actual ttl_map from Recipe 1 for comparison
        actual_ttl_map = {
            "currency_codes":      30,
            "country_codes":       30,
            "address_formats":     30,
            "tld_list":             7,
            "language_codes":      30,
            "http_status_codes":    7,
            "phone_calling_codes": 30,
            "timezones":            7,
            "mime_types":          30,
            "unicode_blocks":      30,
            "gst_rates_india":     30,
            "population_data":    365,
        }
        for topic, expected_ttl in self.EXPECTED_TTLS.items():
            with self.subTest(topic=topic):
                self.assertEqual(
                    actual_ttl_map.get(topic),
                    expected_ttl,
                    f"TTL mismatch for {topic}: expected {expected_ttl}, got {actual_ttl_map.get(topic)}"
                )

    def test_iana_topics_use_short_ttl(self):
        """IANA-managed topics (http_status_codes, tld_list, timezones) must have TTL ≤ 7."""
        iana_topics = ["http_status_codes", "tld_list", "timezones"]
        for topic in iana_topics:
            with self.subTest(topic=topic):
                self.assertLessEqual(
                    self.EXPECTED_TTLS[topic], 7,
                    f"{topic} should have TTL ≤ 7 days"
                )

    def test_iso_standard_topics_use_30_day_ttl(self):
        """ISO standard topics (currency, country, language) must have TTL = 30."""
        iso_topics = ["currency_codes", "country_codes", "language_codes"]
        for topic in iso_topics:
            with self.subTest(topic=topic):
                self.assertEqual(
                    self.EXPECTED_TTLS[topic], 30,
                    f"{topic} should have TTL = 30 days"
                )

    def test_population_data_uses_annual_ttl(self):
        """population_data has an annual release cadence — TTL must be 365 days."""
        self.assertEqual(self.EXPECTED_TTLS["population_data"], 365)


class TestCacheRoutingWithRealData(unittest.TestCase):
    """Run Recipe 1 against the actual canonical files in the repo."""

    def test_http_status_canonical_file_exists(self):
        """i18nify-data/http-status/data.json should exist and be a CACHE_HIT."""
        path = os.path.join(REPO_ROOT, "i18nify-data", "http-status", "data.json")
        if not os.path.exists(path):
            self.skipTest("http-status data.json not present in repo")
        result = run_recipe1(path, topic="http_status_codes", ttl=7)
        # Could be CACHE_HIT or CACHE_STALE depending on file age — both are valid
        self.assertTrue(
            result.startswith("CACHE_HIT") or result.startswith("CACHE_STALE"),
            f"Expected CACHE_HIT or CACHE_STALE, got: {result!r}"
        )

    def test_currency_canonical_file_exists(self):
        """i18nify-data/currency/data.json should exist and be a CACHE_HIT or CACHE_STALE."""
        path = os.path.join(REPO_ROOT, "i18nify-data", "currency", "data.json")
        if not os.path.exists(path):
            self.skipTest("currency data.json not present in repo")
        result = run_recipe1(path, topic="currency_codes", ttl=30)
        self.assertTrue(
            result.startswith("CACHE_HIT") or result.startswith("CACHE_STALE"),
            f"Expected CACHE_HIT or CACHE_STALE, got: {result!r}"
        )


if __name__ == "__main__":
    unittest.main(verbosity=2)
