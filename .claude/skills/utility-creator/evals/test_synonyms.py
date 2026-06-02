"""
Evals for topic synonym resolution (SKILL.md Section 2, Step 1).

Verifies that user-facing query strings are correctly normalised to
canonical topic keys. A wrong mapping causes the wrong pipeline to run
and the wrong data to be fetched.

Run: python3 -m pytest test_synonyms.py -v
"""

import unittest
from typing import Optional

# ── Synonym table (mirrors Section 2 in 1_REGISTRY_AND_TIERS.md) ────────────
# Map of topic_key → list of synonyms that must resolve to it.
SYNONYM_MAP = {
    "currency_codes": [
        "currency codes",
        "iso 4217",
        "currency list",
        "world currencies",
        "currency symbols",
        "Swiss money",       # example from SKILL.md workflow section
    ],
    "country_codes": [
        "country codes",
        "iso 3166",
        "country list",
        "cca2",
        "cca3",
    ],
    "timezones": [
        "iana timezones",
        "timezone list",
        "tz database",
        "time zones",
        "timezones",
    ],
    "phone_calling_codes": [
        "phone codes",
        "calling codes",
        "country dial codes",
        "e.164",
        "phone country code",
    ],
    "tld_list": [
        "tld",
        "tlds",
        "top level domains",
        "cctld",
        "domain extensions",
    ],
    "language_codes": [
        "iso 639",
        "language codes",
        "language list",
        "locale codes",
    ],
    "address_formats": [
        "address format",
        "address formats",
        "postal address",
        "country address",
        "address per country",
    ],
    "http_status_codes": [
        "http status",
        "http codes",
        "status codes",
        "rfc 9110",
    ],
    "mime_types": [
        "mime types",
        "media types",
        "content types",
        "iana media types",
    ],
    "unicode_blocks": [
        "unicode blocks",
        "unicode ranges",
        "unicode characters",
    ],
    "gst_rates_india": [
        "india gst",
        "gst rates",
        "hsn code gst",
        "gst india",
        "gstin tax",
        "indian tax rates",
    ],
    "population_data": [
        "population",
        "world population",
        "population counts",
    ],
}


def resolve_topic(query: str) -> Optional[str]:
    """
    Resolve a user query to a canonical topic key using lowercase
    substring matching — mirrors Step 1 of the SKILL.md workflow.

    Returns the topic key or None if no match found.
    """
    normalised = query.lower().strip()
    for topic_key, synonyms in SYNONYM_MAP.items():
        for syn in synonyms:
            if syn.lower() in normalised or normalised in syn.lower():
                return topic_key
    return None


class TestSynonymResolution(unittest.TestCase):

    def _assert_resolves_to(self, query: str, expected_key: str):
        result = resolve_topic(query)
        self.assertEqual(
            result, expected_key,
            f"Query {query!r} → {result!r}, expected {expected_key!r}"
        )

    # ── currency_codes ────────────────────────────────────────────────────────

    def test_currency_codes_direct(self):
        self._assert_resolves_to("currency codes", "currency_codes")

    def test_iso_4217(self):
        self._assert_resolves_to("ISO 4217", "currency_codes")

    def test_currency_symbols(self):
        self._assert_resolves_to("currency symbols", "currency_codes")

    def test_swiss_money_example_from_skill(self):
        """SKILL.md explicitly lists 'Swiss money' as an example synonym."""
        self._assert_resolves_to("Swiss money", "currency_codes")

    # ── country_codes ─────────────────────────────────────────────────────────

    def test_country_codes_direct(self):
        self._assert_resolves_to("country codes", "country_codes")

    def test_iso_3166(self):
        self._assert_resolves_to("ISO 3166", "country_codes")

    def test_cca2(self):
        self._assert_resolves_to("cca2", "country_codes")

    # ── http_status_codes ─────────────────────────────────────────────────────

    def test_http_status(self):
        self._assert_resolves_to("http status", "http_status_codes")

    def test_http_codes(self):
        self._assert_resolves_to("http codes", "http_status_codes")

    def test_status_codes(self):
        self._assert_resolves_to("status codes", "http_status_codes")

    def test_rfc_9110(self):
        self._assert_resolves_to("rfc 9110", "http_status_codes")

    # ── phone_calling_codes ───────────────────────────────────────────────────

    def test_calling_codes(self):
        self._assert_resolves_to("calling codes", "phone_calling_codes")

    def test_e164(self):
        self._assert_resolves_to("e.164", "phone_calling_codes")

    def test_phone_codes(self):
        self._assert_resolves_to("phone codes", "phone_calling_codes")

    # ── tld_list ──────────────────────────────────────────────────────────────

    def test_tld(self):
        self._assert_resolves_to("tld", "tld_list")

    def test_tlds(self):
        self._assert_resolves_to("tlds", "tld_list")

    def test_top_level_domains(self):
        self._assert_resolves_to("top level domains", "tld_list")

    def test_domain_extensions(self):
        self._assert_resolves_to("domain extensions", "tld_list")

    # ── address_formats ───────────────────────────────────────────────────────

    def test_address_format(self):
        self._assert_resolves_to("address format", "address_formats")

    def test_postal_address(self):
        self._assert_resolves_to("postal address", "address_formats")

    # ── gst_rates_india ───────────────────────────────────────────────────────

    def test_india_gst(self):
        self._assert_resolves_to("india gst", "gst_rates_india")

    def test_gst_rates(self):
        self._assert_resolves_to("gst rates", "gst_rates_india")

    def test_hsn_code_gst(self):
        self._assert_resolves_to("hsn code gst", "gst_rates_india")

    # ── language_codes ────────────────────────────────────────────────────────

    def test_language_codes(self):
        self._assert_resolves_to("language codes", "language_codes")

    def test_iso_639(self):
        self._assert_resolves_to("iso 639", "language_codes")

    # ── timezones ─────────────────────────────────────────────────────────────

    def test_iana_timezones(self):
        self._assert_resolves_to("iana timezones", "timezones")

    def test_tz_database(self):
        self._assert_resolves_to("tz database", "timezones")

    # ── mime_types ────────────────────────────────────────────────────────────

    def test_mime_types(self):
        self._assert_resolves_to("mime types", "mime_types")

    def test_media_types(self):
        self._assert_resolves_to("media types", "mime_types")

    def test_iana_media_types(self):
        self._assert_resolves_to("iana media types", "mime_types")

    # ── unicode_blocks ────────────────────────────────────────────────────────

    def test_unicode_blocks(self):
        self._assert_resolves_to("unicode blocks", "unicode_blocks")

    def test_unicode_ranges(self):
        self._assert_resolves_to("unicode ranges", "unicode_blocks")


class TestSynonymCoverage(unittest.TestCase):
    """Meta-tests verifying the synonym map is complete and consistent."""

    REGISTERED_TOPICS = {
        "currency_codes", "country_codes", "timezones", "phone_calling_codes",
        "tld_list", "language_codes", "address_formats", "http_status_codes",
        "mime_types", "unicode_blocks", "gst_rates_india", "population_data",
    }

    def test_all_registered_topics_have_synonyms(self):
        """Every registered topic must have at least one synonym."""
        for topic in self.REGISTERED_TOPICS:
            with self.subTest(topic=topic):
                self.assertIn(topic, SYNONYM_MAP, f"{topic} missing from SYNONYM_MAP")
                self.assertGreater(len(SYNONYM_MAP[topic]), 0, f"{topic} has empty synonym list")

    def test_no_synonym_maps_to_two_different_topics(self):
        """A single synonym string must not appear in two different topic lists."""
        seen = {}
        for topic_key, synonyms in SYNONYM_MAP.items():
            for syn in synonyms:
                norm = syn.lower()
                if norm in seen:
                    self.fail(
                        f"Synonym {syn!r} appears in both {seen[norm]!r} and {topic_key!r}"
                    )
                seen[norm] = topic_key

    def test_direct_topic_key_resolves_to_itself(self):
        """Each canonical key string should resolve back to itself (sanity check)."""
        for topic_key in self.REGISTERED_TOPICS:
            with self.subTest(topic_key=topic_key):
                # Normalised form of the key (replace _ with space) should match
                readable = topic_key.replace("_", " ")
                result = resolve_topic(readable)
                self.assertEqual(result, topic_key,
                    f"Key-as-query {readable!r} resolved to {result!r}, not {topic_key!r}")


if __name__ == "__main__":
    unittest.main(verbosity=2)
