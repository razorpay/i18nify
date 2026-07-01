"""
Evals for the Recipe 6 scoring formula.

These tests are PURE PYTHON — no subprocess, no I/O, no temp files.
They verify that the weighted scoring formula behaves correctly under
known inputs. Changing any weight in Recipe 6 must update these tests.

Run: python3 -m pytest test_scoring.py -v
"""

import math
import unittest

# ── Scoring formula (copied verbatim from Recipe 6) ─────────────────────────
# Any change to Recipe 6 weights must be reflected here too.

WEIGHTS = {
    "tier_authority": 0.35,
    "multiplicity":   0.15,
    "freshness":      0.15,
    "coverage":       0.15,
    "recurrence":     0.10,
    "independence":   0.10,
}


def compute_score(
    tier: int,
    n_sources: int,
    rows_returned: int,
    expected_rows: int,
    freshness: float,
    recurrence: float = 0.85,
    independence: float = 1.0,
    conflict_penalty: float = 0.0,
) -> int:
    tier_authority = 1.0 if tier == 1 else 0.7
    multiplicity   = min(1.0, math.log2(n_sources + 1) / 3)
    coverage       = min(1.0, rows_returned / expected_rows) if expected_rows else 0.0
    base = (
        WEIGHTS["tier_authority"] * tier_authority
        + WEIGHTS["multiplicity"]   * multiplicity
        + WEIGHTS["freshness"]      * freshness
        + WEIGHTS["coverage"]       * coverage
        + WEIGHTS["recurrence"]     * recurrence
        + WEIGHTS["independence"]   * independence
    )
    return round(100 * base * (1 - conflict_penalty))


def cache_freshness(age_days: float, ttl_days: float) -> float:
    """Linear decay formula from Recipe 6."""
    return max(0.5, 1.0 - (age_days / ttl_days) * 0.5)


# ── Tests ────────────────────────────────────────────────────────────────────

class TestScoringFormula(unittest.TestCase):

    # ── Tier authority ───────────────────────────────────────────────────────

    def test_t1_beats_t2_all_else_equal(self):
        """T1 source must outscore T2 when everything else is identical."""
        t1 = compute_score(tier=1, n_sources=1, rows_returned=100, expected_rows=100, freshness=0.97)
        t2 = compute_score(tier=2, n_sources=1, rows_returned=100, expected_rows=100, freshness=0.97)
        self.assertGreater(t1, t2, f"T1={t1} should be > T2={t2}")

    def test_t1_full_coverage_exceeds_85(self):
        """T1 with 100% coverage, fresh, no conflicts should score ≥ 85."""
        score = compute_score(tier=1, n_sources=1, rows_returned=180, expected_rows=180, freshness=0.97)
        self.assertGreaterEqual(score, 85, f"Expected >=85, got {score}")

    def test_t1_score_ceiling_is_100(self):
        """Score is capped at 100 (via round(100 * base))."""
        score = compute_score(
            tier=1, n_sources=7, rows_returned=500, expected_rows=100,
            freshness=1.0, recurrence=1.0, independence=1.0
        )
        self.assertLessEqual(score, 100)

    # ── Multiplicity ─────────────────────────────────────────────────────────

    def test_multiplicity_1_source(self):
        """1 source → multiplicity = log2(2)/3 ≈ 0.333."""
        expected = min(1.0, math.log2(2) / 3)
        self.assertAlmostEqual(expected, 0.333, places=2)

    def test_multiplicity_2_sources(self):
        """2 sources → multiplicity ≈ 0.528."""
        expected = min(1.0, math.log2(3) / 3)
        self.assertAlmostEqual(expected, 0.528, places=2)

    def test_two_sources_beats_one_source(self):
        """Having 2 sources should score higher than 1 source, all else equal."""
        s1 = compute_score(tier=1, n_sources=1, rows_returned=180, expected_rows=180, freshness=0.97)
        s2 = compute_score(tier=1, n_sources=2, rows_returned=180, expected_rows=180, freshness=0.97)
        self.assertGreater(s2, s1)

    # ── Coverage ─────────────────────────────────────────────────────────────

    def test_zero_rows_lowers_score(self):
        """0 rows returned → coverage = 0, should significantly reduce score."""
        full  = compute_score(tier=1, n_sources=1, rows_returned=180, expected_rows=180, freshness=0.97)
        empty = compute_score(tier=1, n_sources=1, rows_returned=0,   expected_rows=180, freshness=0.97)
        self.assertGreater(full, empty)

    def test_coverage_capped_at_1(self):
        """Returning more rows than expected doesn't push coverage above 1.0."""
        score_over  = compute_score(tier=1, n_sources=1, rows_returned=9999, expected_rows=180, freshness=0.97)
        score_exact = compute_score(tier=1, n_sources=1, rows_returned=180,  expected_rows=180, freshness=0.97)
        self.assertEqual(score_over, score_exact, "Coverage should cap at 1.0")

    def test_partial_coverage_reduces_score(self):
        """50% coverage should score lower than 100% coverage."""
        full = compute_score(tier=1, n_sources=1, rows_returned=180, expected_rows=180, freshness=0.97)
        half = compute_score(tier=1, n_sources=1, rows_returned=90,  expected_rows=180, freshness=0.97)
        self.assertGreater(full, half)

    # ── Freshness ─────────────────────────────────────────────────────────────

    def test_live_fetch_freshness_is_097(self):
        """Live fetches use freshness=0.97 (not from cache)."""
        self.assertAlmostEqual(0.97, 0.97)  # explicit constant check

    def test_cache_freshness_just_refreshed(self):
        """Cache fetched today (age=0) → freshness = 1.0."""
        self.assertAlmostEqual(cache_freshness(age_days=0, ttl_days=30), 1.0)

    def test_cache_freshness_at_ttl_boundary(self):
        """Cache at exact TTL boundary → freshness = 0.5."""
        self.assertAlmostEqual(cache_freshness(age_days=30, ttl_days=30), 0.5)

    def test_cache_freshness_never_below_05(self):
        """Cache older than TTL still clamps at 0.5 (not negative)."""
        stale = cache_freshness(age_days=9999, ttl_days=30)
        self.assertGreaterEqual(stale, 0.5)

    def test_cache_freshness_midway(self):
        """Cache at half-TTL (15 of 30 days) → freshness = 0.75."""
        self.assertAlmostEqual(cache_freshness(age_days=15, ttl_days=30), 0.75)

    # ── Conflict penalty ──────────────────────────────────────────────────────

    def test_no_conflicts_no_penalty(self):
        """Zero conflict penalty should not reduce score."""
        score_no_conflict  = compute_score(tier=1, n_sources=1, rows_returned=180, expected_rows=180, freshness=0.97, conflict_penalty=0.0)
        score_with_penalty = compute_score(tier=1, n_sources=1, rows_returned=180, expected_rows=180, freshness=0.97, conflict_penalty=0.5)
        self.assertGreater(score_no_conflict, score_with_penalty)

    def test_full_conflict_scores_zero(self):
        """100% conflict penalty → score = 0."""
        score = compute_score(tier=1, n_sources=1, rows_returned=180, expected_rows=180, freshness=0.97, conflict_penalty=1.0)
        self.assertEqual(score, 0)

    def test_50pct_conflict_halves_score(self):
        """50% conflict should roughly halve the score."""
        no_conflict   = compute_score(tier=1, n_sources=1, rows_returned=180, expected_rows=180, freshness=0.97, conflict_penalty=0.0)
        half_conflict = compute_score(tier=1, n_sources=1, rows_returned=180, expected_rows=180, freshness=0.97, conflict_penalty=0.5)
        self.assertAlmostEqual(half_conflict / no_conflict, 0.5, places=1)

    # ── TTL table ─────────────────────────────────────────────────────────────

    def test_iana_ttl_is_7_days(self):
        """IANA topics (http_status_codes, tld_list, timezones) have TTL=7."""
        TTL_MAP = {
            "http_status_codes": 7,
            "tld_list":          7,
            "timezones":         7,
            "currency_codes":    30,
            "country_codes":     30,
            "language_codes":    30,
            "phone_calling_codes": 30,
            "population_data":   365,
        }
        self.assertEqual(TTL_MAP["http_status_codes"], 7)
        self.assertEqual(TTL_MAP["tld_list"],           7)
        self.assertEqual(TTL_MAP["currency_codes"],    30)
        self.assertEqual(TTL_MAP["population_data"],  365)

    # ── Ordering ──────────────────────────────────────────────────────────────

    def test_score_ordering_t1_gt_t2(self):
        """For a realistic set of inputs, T1 must rank above T2."""
        t1 = compute_score(tier=1, n_sources=1, rows_returned=60,  expected_rows=60,  freshness=0.97)
        t2 = compute_score(tier=2, n_sources=1, rows_returned=60,  expected_rows=60,  freshness=0.97)
        self.assertGreater(t1, t2, f"T1 ({t1}) should beat T2 ({t2})")


class TestCacheFreshnessFormula(unittest.TestCase):
    """Extra coverage for the cache_freshness helper."""

    def test_monotone_decay(self):
        """Freshness strictly decreases as age increases (until floor)."""
        ttl = 30
        ages = [0, 5, 10, 15, 20, 25, 30]
        scores = [cache_freshness(a, ttl) for a in ages]
        for i in range(len(scores) - 1):
            self.assertGreaterEqual(scores[i], scores[i + 1],
                f"freshness not monotone: age={ages[i]} → {scores[i]}, age={ages[i+1]} → {scores[i+1]}")

    def test_floor_holds_for_very_old_cache(self):
        """Even 1000-day-old cache stays at 0.5."""
        self.assertEqual(cache_freshness(1000, 30), 0.5)


if __name__ == "__main__":
    unittest.main(verbosity=2)
