"""
Pydantic schemas for i18nify reference data.
Must mirror the proto definitions in i18nify-data/*/proto/.
Do not add fields that don't exist in the corresponding proto.

MASTER RULE: ALL schemas must include a full human-readable name counterpart for
every shortcode they define. Concretely:
  - If a schema has 'cc', it MUST also have 'country_name: str'.
  - If a schema has 'alpha2' (language), it MUST also have 'english: str'.
  - If a schema has a list of language codes, each entry MUST be a LanguageDetail
    object with both 'code' and 'name' — never a bare string.
No standalone shortcodes are permitted in any output data.
"""
from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel, field_validator


class Currency(BaseModel):
    code: str         # ISO 4217 alpha code e.g. "USD"
    name: str         # "US Dollar"
    numeric: str      # "840"
    minor_unit: str   # "2"
    entity: str       # "UNITED STATES OF AMERICA (THE)"

    @field_validator("code")
    @classmethod
    def code_must_be_alpha(cls, v: str) -> str:
        if not v.isalpha() or len(v) != 3:
            raise ValueError(f"Currency code must be 3 alpha chars, got: {v!r}")
        return v.upper()


class Country(BaseModel):
    name: str
    cca2: str    # ISO 3166-1 alpha-2
    cca3: str    # ISO 3166-1 alpha-3
    ccn3: str    # ISO 3166-1 numeric
    region: str
    sub_region: str


class TLD(BaseModel):
    tld: str          # e.g. "com" (no leading dot, lowercase)
    tld_type: str = ""  # "country-code", "generic", etc.

    @field_validator("tld")
    @classmethod
    def normalise_tld(cls, v: str) -> str:
        return v.lstrip(".").lower()


class HttpStatus(BaseModel):
    code: str          # "200"
    description: str   # "OK"


class Language(BaseModel):
    alpha2: str        # ISO 639-1 two-letter code
    alpha3: str = ""   # ISO 639-2/3 three-letter code
    english: str       # English name of the language


class PhoneCode(BaseModel):
    cc: str            # ISO 3166-1 alpha-2 country code
    country_name: str
    calling_code: str  # e.g. "+1"
    format: str = ""   # e.g. "xxx xxx xxxx"
    regex: str = ""    # generalDesc nationalNumberPattern

    @field_validator("calling_code")
    @classmethod
    def ensure_plus(cls, v: str) -> str:
        if not v.startswith("+"):
            return "+" + v
        return v


class Timezone(BaseModel):
    codes: str         # comma-separated CC codes
    coordinates: str
    timezone: str      # IANA timezone identifier
    comments: str = ""


class MimeType(BaseModel):
    type: str          # full type e.g. "application/json"
    subtype: str       # subtype portion e.g. "json"
    category: str      # top-level category e.g. "application"
    reference: str = ""


class UnicodeBlock(BaseModel):
    start: str         # "0000"
    end: str           # "007F"
    block_name: str    # "Basic Latin"
    range: str         # "U+0000..U+007F"


class AddressFormat(BaseModel):
    cc: str
    country_name: str
    template: str
    required_fields: List[str] = []
    allowed_fields: List[str] = []
    latin_template: Optional[str] = None
    upper_case_fields: List[str] = []
    zip_name_type: Optional[str] = None
    state_name_type: Optional[str] = None
    locality_name_type: Optional[str] = None
    sublocality_name_type: Optional[str] = None
    lang: Optional[str] = None
    languages: List[LanguageDetail] = []
    zip_regex: Optional[str] = None
    zipex: Optional[str] = None
    posturl: Optional[str] = None


class LanguageDetail(BaseModel):
    """A single language with its ISO 639-1 code and English name."""
    code: str   # ISO 639-1 two-letter code  e.g. "en"
    name: str   # English name  e.g. "English"


class LanguageEntry(BaseModel):
    """Country-to-languages mapping from CLDR territoryInfo."""
    cc: str
    country_name: str
    languages: List[LanguageDetail]   # official languages — each with code + English name


class Population(BaseModel):
    """Country-level population estimate/projection from World Bank / UN WPP 2024."""
    cc: str               # ISO 3166-1 alpha-2 country code
    country_name: str     # Full English country name
    iso3: Optional[str] = None  # ISO 3166-1 alpha-3 code
    population: int       # Total population (persons)
    year: int             # Estimate/projection year
    variant: str = ""     # "Medium" (projection) or "Estimates" (historical)
    population_growth_rate: Optional[float] = None  # Annual population growth rate (%)


class GstRate(BaseModel):
    """India GST rate entry keyed by HSN chapter (2-digit, e.g. '01')."""
    code: str          # HSN chapter e.g. "01"
    description: str   # "Live animals"
    gst_rate: str      # "0%", "5%", "12%", "18%", "28%", "Exempt", "Varies"
    cess: str = ""
    notes: str = ""


class GstRateAustralia(BaseModel):
    """Australia GST supply classification entry (A New Tax System (GST) Act 1999)."""
    code: str               # "TAXABLE", "GST_FREE", "INPUT_TAXED"
    category: str           # Human-readable category name
    rate_pct: int           # 10 or 0
    bas_codes: List[str]    # BAS G-codes e.g. ["G1"]
    description: str        # ATO description of the category
    examples: List[str]     # Representative goods/services


class EuVatRate(BaseModel):
    """EU VAT entry per country — rates + VAT number validation fields.

    Keyed by ISO 3166-1 alpha-2 country code. Combines:
      - Rate data (standard, reduced, super_reduced, parking) from EC DG TAXUD
      - VAT number validation fields (regex, prefix, example) — VAT number patterns
        are not available from any T1 source in machine-readable form; sourced from
        vatnode/eu-vat-rates-data (T2, daily-synced from EC TEDB).

    Field names match the JSON tags in packages/i18nify-go/modules/vat/vat.go.
    """
    cc: str                                # ISO 3166-1 alpha-2, e.g. "DE"
    country_name: str                      # Full English name, e.g. "Germany"
    standard_rate: float                   # Standard VAT rate %, e.g. 19.0
    reduced_rates: List[float] = []        # Reduced rates, e.g. [7.0]
    super_reduced_rate: Optional[float] = None  # Super-reduced rate, e.g. 2.1
    parking_rate: Optional[float] = None   # Parking rate (BE, IE, LU, PT)
    currency: str = "EUR"                  # ISO 4217, non-eurozone members differ
    local_name: str = ""                   # Local language term, e.g. "Umsatzsteuer"
    vat_abbreviation: str = ""             # Local abbreviation, e.g. "USt"
    vat_number_format: str = ""            # Human-readable, e.g. "DE + 9 digits"
    regex: str = ""                        # Regex validation pattern
    vat_prefix: str = ""                   # VAT number prefix, e.g. "ATU", "EL"
    vies_cc: str = ""                      # VIES country code (GR → "EL")
    example: str = ""                      # Example VAT number, e.g. "DE123456789"
    digits: int = 0                        # Total digit/char count in VAT number


# ── Registry ────────────────────────────────────────────────────────────────
SCHEMA_MAP: dict[str, type[BaseModel]] = {
    "currency":       Currency,
    "country":        Country,
    "tld":            TLD,
    "http_status":    HttpStatus,
    "language":       Language,
    "language_cldr":  LanguageEntry,
    "phone":          PhoneCode,
    "timezone":       Timezone,
    "mime":           MimeType,
    "unicode_blocks": UnicodeBlock,
    "address":        AddressFormat,
    "gst":            GstRate,
    "gst_au":         GstRateAustralia,
    "eu_vat":         EuVatRate,
    "population":     Population,
}

# Data key used in i18nify-data/{topic}/data.json root object
DATA_KEY_MAP: dict[str, str] = {
    "currency":       "currency_information",
    "country":        "country_information",
    "tld":            "tld_information",
    "http_status":    "http_status_information",
    "language":       "language_information",
    "language_cldr":  "language_information",
    "phone":          "country_tele_information",
    "timezone":       "timezone_information",
    "mime":           "mime_type_information",
    "unicode_blocks": "unicode_block_information",
    "address":        "address_format_information",
    "gst":            "gst_information",
    "gst_au":         "gst_information",
    "eu_vat":         "vat_information",
    "population":     "population_information",
}

# Canonical output path within i18nify-data/
DATA_PATH_MAP: dict[str, str] = {
    "currency":       "currency/data.json",
    "country":        "country/metadata/data.json",
    "tld":            "tld/data.json",
    "http_status":    "http-status/data.json",
    "language":       "language/data.json",
    "language_cldr":  "language/data.json",
    "phone":          "phone-number/data.json",
    "timezone":       "timezone/data.json",
    "mime":           "media/data.json",
    "unicode_blocks": "unicode-blocks/data.json",
    "address":        "address/data.json",
    "gst":            "gst/data.json",
    "gst_au":         "gst-australia/data.json",
    "eu_vat":         "vat/data.json",
    "population":     "population/data.json",
}
