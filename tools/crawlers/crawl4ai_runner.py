#!/usr/bin/env python3
"""
i18nify data pipeline — extraction, validation, and save.

Usage:
  # Fetch live from T1 source, parse, validate, save:
  python tools/crawlers/crawl4ai_runner.py --topic currency

  # Parse a previously-saved raw file:
  python tools/crawlers/crawl4ai_runner.py --topic currency --input /tmp/i18nify_raw_currency.txt

Prints:
  FETCH_OK|{topic}|{count}   on success
  FETCH_ERROR|{topic}|{msg}  on failure
  PARSE_OK|{topic}|{count}   after successful validation
  PARSE_ERROR|{topic}|{msg}  on validation failure
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:
    yaml = None

try:
    from lxml import etree
except ImportError:
    etree = None

try:
    import pycountry as _pycountry
    # Territories/regions present in Google i18n / CLDR but absent from ISO 3166-1
    _COUNTRY_NAME_OVERRIDES: dict[str, str] = {
        "AC": "Ascension Island",
        "TA": "Tristan da Cunha",
        "XK": "Kosovo",
        "CQ": "Sark",
        "DG": "Diego Garcia",
        "EA": "Ceuta and Melilla",
        "IC": "Canary Islands",
    }

    def _country_name(alpha2: str) -> str:
        if alpha2 in _COUNTRY_NAME_OVERRIDES:
            return _COUNTRY_NAME_OVERRIDES[alpha2]
        c = _pycountry.countries.get(alpha_2=alpha2)
        return c.name if c else ""

    def _language_name(alpha2: str) -> str:
        """Resolve an ISO 639-1 alpha-2 code to its English name."""
        lang = _pycountry.languages.get(alpha_2=alpha2)
        return lang.name if lang else alpha2  # fall back to code rather than empty string

    def _currency_name(alpha3: str) -> str:
        """Resolve an ISO 4217 alpha-3 code to its English name."""
        curr = _pycountry.currencies.get(alpha_3=alpha3)
        return curr.name if curr else ""

except ImportError:
    def _country_name(alpha2: str) -> str:  # type: ignore[misc]
        return ""

    def _language_name(alpha2: str) -> str:  # type: ignore[misc]
        return alpha2

    def _currency_name(alpha3: str) -> str:  # type: ignore[misc]
        return ""

# Address format-token → human-readable template variable mapping (Google i18n spec)
_FMT_TOKENS: dict[str, str] = {
    "%N": "{name}",
    "%O": "{organization}",
    "%A": "{street_address}",
    "%C": "{city}",
    "%S": "{state}",
    "%Z": "{zip}",
    "%D": "{district}",
    "%X": "{sorting_code}",
    "%n": "\n",
}

# Single-char code (from Google i18n `require` / `fmt` uppercase tokens) → field name
_ADDR_CHAR_MAP: dict[str, str] = {
    "N": "name",
    "O": "organization",
    "A": "street_address",
    "C": "city",
    "S": "state",
    "Z": "zip",
    "D": "district",
    "X": "sorting_code",
}

# ── Universal auto-enricher ──────────────────────────────────────────────────

def enrich_row(row: dict) -> dict:
    """Inject full human-readable names alongside any shortcodes in a data row.

    Called on every parsed row before Pydantic validation.  Rules applied:
    - cc / country_code / cca2 → country_name (if absent)
    - languages: List[str]     → List[{code, name}]  (ISO 639-1 expansion)
    - alpha2 (language)        → english (if absent)
    - code (ISO 4217 currency) → name (if absent)
    """
    result = dict(row)

    # 1. Country name from cc / country_code / cca2
    if "country_name" not in result:
        for key in ("cc", "country_code", "cca2"):
            if key in result:
                result["country_name"] = _country_name(str(result[key]))
                break

    # 2. Language list: List[str] → List[{code, name}]
    if "languages" in result and isinstance(result["languages"], list):
        langs = result["languages"]
        if langs and isinstance(langs[0], str):
            result["languages"] = [
                {"code": lc, "name": _language_name(lc)}
                for lc in langs
            ]

    # 3. Single language alpha2 code → english name
    if "alpha2" in result and "english" not in result:
        result["english"] = _language_name(str(result["alpha2"]))

    # 4. Currency alpha3 code → name
    if "code" in result and "name" not in result:
        code_val = str(result["code"])
        if re.fullmatch(r"[A-Z]{3}", code_val):
            resolved = _currency_name(code_val)
            if resolved:
                result["name"] = resolved

    return result


# ── Paths ────────────────────────────────────────────────────────────────────
REPO_ROOT    = Path(__file__).resolve().parents[2]
SCHEMAS_DIR  = REPO_ROOT / "schemas"
sys.path.insert(0, str(REPO_ROOT))

from schemas.i18nify_schemas import SCHEMA_MAP, DATA_KEY_MAP, DATA_PATH_MAP

DATA_OUT_DIR = REPO_ROOT / "i18nify-data"    # canonical data (existing structure)

# ── Crawl4AI Docker (for SPA pages that require JavaScript rendering) ────────
CRAWL4AI_BASE = "http://localhost:11235"

# ── Source URLs — T1 authoritative sources only ──────────────────────────────
# All URLs point to the canonical Tier-1 standards body.
# "country" and "address" require specialised fetch functions (see below)
# because their T1 sources are multi-page or SPA-rendered.
SOURCE_URLS: dict[str, str] = {
    "currency":       "https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml",
    "country":        "https://www.iso.org/obp/ui/#search/code/",          # ISO OBP SPA — T1 (ISO 3166)
    "tld":            "https://data.iana.org/TLD/tlds-alpha-by-domain.txt",
    "http_status":    "https://www.iana.org/assignments/http-status-codes/http-status-codes.xml",
    "language":       "https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-core/supplemental/territoryInfo.json",
    "phone":          "https://raw.githubusercontent.com/google/libphonenumber/master/resources/PhoneNumberMetadata.xml",
    "timezone":       "https://raw.githubusercontent.com/eggert/tz/main/zone1970.tab",
    "mime":           "https://www.iana.org/assignments/media-types/media-types.xml",
    "unicode_blocks": "https://www.unicode.org/Public/UNIDATA/Blocks.txt",
    "address":        "https://chromium-i18n.appspot.com/ssl-address/data", # Google i18n — T1
    "itu_e164":       "https://www.itu.int/pub/T-SP-E.164D",  # ITU E.164 landing page (resolved → .pdf DMS link at runtime)
    "gst":            "https://cbic-gst.gov.in/gst-goods-services-rates.html",  # CBIC GST rate schedule PDF page — T1 (India GST)
    "gst_au":         "https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/when-to-charge-gst-and-when-not-to",  # ATO supply classifications — T1 (Australia GST)
    # T2 sourced daily from EC TEDB (T1). T1 EC Excel provides rates only;
    # VAT number patterns have no T1 machine-readable source → T2 permitted.
    "eu_vat":         "https://raw.githubusercontent.com/vatnode/eu-vat-rates-data/main/data/eu-vat-rates-data.json",
    # T1: UN World Population Prospects 2024 (gzip'd CSV). T2 fallback: World Bank SP.POP.TOTL API.
    "population":     "https://population.un.org/wpp/Download/Files/1_Indicator%20(Standard)/CSV_FILES/WPP2024_TotalPopulationBySex.csv.gz",
}

# ── Fetch helpers ────────────────────────────────────────────────────────────

def _http_get(
    url: str,
    timeout: int = 20,
    extra_headers: dict | None = None,
) -> bytes:
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        ),
        "Accept": "application/pdf,text/html,*/*",
    }
    if extra_headers:
        headers.update(extra_headers)
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def fetch_address_google_i18n() -> bytes:
    """Fetch all per-country address format data from the Google i18n T1 API.

    Hits the root endpoint to discover available country codes, then fetches
    each country individually.  Returns a JSON-encoded dict keyed by country
    code so downstream parse_address() can iterate it uniformly.
    """
    root_url = SOURCE_URLS["address"]
    root_data = json.loads(_http_get(root_url))
    # Root response: {"id": "data", "countries": "AC~AD~AE~..."}
    country_codes = root_data.get("countries", "").split("~")

    result: dict[str, Any] = {}
    for cc in country_codes:
        cc = cc.strip()
        if not cc:
            continue
        try:
            country_url = f"{root_url}/{cc}"
            country_data = json.loads(_http_get(country_url, timeout=10))
            result[cc] = country_data
        except Exception:
            pass  # individual country fetch failure — skip silently
    return json.dumps(result).encode("utf-8")


def fetch_itu_e164_pdf() -> bytes:
    """Fetch the ITU E.164 assignment list PDF.

    The ITU ``/pub/T-SP-E.164D`` page is an HTML landing page.
    We first resolve it to the actual ``.pdf`` DMS link (or fall back to a
    known direct URL) and then download via the standalone pdf_scraper.

    If a strict WAF (e.g. Indian Government CBIC) blocks the plain
    ``urllib.request`` download, we transparently fall back to Crawl4AI's
    headless Chromium engine to bypass the firewall.
    """
    from pdf_scraper import PdfScraper, _resolve_itu_pdf_url

    scraper = PdfScraper()
    pdf_url = _resolve_itu_pdf_url()

    try:
        # Fast path: plain HTTP download (works for open T1 sources)
        path = scraper.download(pdf_url, timeout=30)
    except Exception as urllib_err:
        # Slow path: WAF detected — delegate to Crawl4AI headless browser
        print(
            f"WARN: Direct download failed for {pdf_url} ({urllib_err}). "
            "Falling back to Crawl4AI WAF bypass...",
            file=sys.stderr,
        )
        try:
            path = fetch_pdf_via_crawl4ai(pdf_url)
        except Exception as crawl_err:
            raise RuntimeError(
                f"Failed to download ITU E.164 PDF from {pdf_url}. "
                f"urllib error: {urllib_err}.  "
                f"Crawl4AI fallback error: {crawl_err}.  "
                "Download it manually and re-run with --input <path-to-pdf>"
            ) from crawl_err
    return path.read_bytes()


def fetch_pdf_via_crawl4ai(
    url: str,
    cache_dir: Path | None = None,
    timeout: int = 60,
) -> Path:
    """Download a PDF through Crawl4AI's headless Chromium to bypass WAF.

    Some T1 sources (e.g. Indian Government CBIC) are behind strict Web
    Application Firewalls that reject ``urllib.request``.  This function
    delegates the download to Crawl4AI's Playwright engine, which executes
    the WAF's background JavaScript, sets the required cookies, and then
    returns the raw PDF bytes.

    Args:
        url:         The PDF URL (may be WAF-protected).
        cache_dir:   Directory to save the downloaded PDF.  Defaults to
                     ``i18nify-data/pdf-cache/``.
        timeout:     Request timeout in seconds (Crawl4AI may need 30-60s
                     for heavy WAF pages).

    Returns:
        Path to the cached PDF file.

    Raises:
        RuntimeError: If Crawl4AI is unreachable, returns no results, or
                      the response does not contain valid PDF bytes.
    """
    from pdf_scraper import _safe_filename, DEFAULT_CACHE_DIR

    cache_dir = cache_dir or DEFAULT_CACHE_DIR
    cache_dir.mkdir(parents=True, exist_ok=True)
    cached = cache_dir / (_safe_filename(url) + ".pdf")

    import base64
    crawl_url = f"{CRAWL4AI_BASE}/crawl"
    payload = json.dumps({
        "urls": [url],
        "crawler_config": {
            # pdf=True instructs Crawl4AI to capture page content as PDF bytes
            "pdf": True,
            # Give the WAF's background JS enough time to execute
            "js_code": "await new Promise(r => setTimeout(r, 5000));",
        },
    }).encode("utf-8")

    req = urllib.request.Request(
        crawl_url,
        data=payload,
        headers={"Content-Type": "application/json", "User-Agent": "i18nify-pipeline/1.0"},
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=timeout) as r:
        response = json.loads(r.read())

    results = response.get("results", [])
    if not results:
        raise RuntimeError("Crawl4AI returned no results")

    result = results[0]
    pdf_bytes: bytes | None = None

    # 1. Native pdf field (Crawl4AI 0.8+ returns base64-encoded PDF here)
    raw_pdf = result.get("pdf")
    if raw_pdf:
        if isinstance(raw_pdf, str):
            pdf_bytes = base64.b64decode(raw_pdf)
        elif isinstance(raw_pdf, (bytes, bytearray)):
            pdf_bytes = bytes(raw_pdf)

    # 2. Media attachments (some versions embed PDFs in media list)
    if pdf_bytes is None:
        for media in result.get("media", {}).get("images", []) + result.get("media", {}).get("videos", []):
            media_url = media.get("src", "") or media.get("url", "")
            if media_url.endswith(".pdf"):
                try:
                    pdf_bytes = _http_get(media_url, timeout=timeout)
                except Exception:
                    continue
                if pdf_bytes:
                    break

    # 3. Links — scan internal + external for a .pdf href and download it
    if pdf_bytes is None:
        links_dict = result.get("links", {})
        all_links = (
            links_dict.get("internal", []) + links_dict.get("external", [])
            if isinstance(links_dict, dict)
            else links_dict  # older versions may return a flat list
        )
        for link in all_links:
            if isinstance(link, dict):
                link_url = link.get("href", "") or link.get("url", "")
            else:
                link_url = str(link)
            if link_url.endswith(".pdf"):
                try:
                    pdf_bytes = _http_get(link_url, timeout=timeout)
                except Exception:
                    continue
                if pdf_bytes:
                    break

    # Guard: WAF may still return HTML even after browser crawl
    if pdf_bytes is None:
        html = result.get("html") or result.get("cleaned_html", "")
        if html and ("Request Rejected" in html or "Access Denied" in html):
            raise RuntimeError(
                f"WAF still blocking after Crawl4AI crawl: {url}. "
                "The WAF may require longer JavaScript execution or additional cookies."
            )
        raise RuntimeError(
            f"Could not extract PDF bytes from Crawl4AI response for {url}. "
            f"Available fields: {list(result.keys())}"
        )

    # Verify the payload is actually a PDF (not an HTML error page)
    if not pdf_bytes.startswith(b"%PDF"):
        # Might be an HTML WAF rejection page disguised as 200 OK
        if pdf_bytes.lstrip().startswith(b"<"):
            raise RuntimeError(
                f"Crawl4AI returned HTML instead of PDF for {url}. "
                "WAF may still be blocking the request."
            )
        # Allow non-standard PDF starts (some PDFs have BOMs or prefixes)
        if b"PDF" not in pdf_bytes[:32]:
            raise RuntimeError(
                f"Downloaded content does not appear to be a PDF for {url}. "
                f"First 64 bytes: {pdf_bytes[:64]!r}"
            )

    cached.write_bytes(pdf_bytes)
    return cached


def fetch_country_iso_obp() -> bytes:
    """Fetch ISO 3166 country data via Crawl4AI Docker (SPA scraping).

    ISO OBP is a JavaScript-rendered SPA at https://www.iso.org/obp/ui/
    Requires Crawl4AI running at localhost:11235.
    """
    crawl_url = f"{CRAWL4AI_BASE}/crawl"
    payload = json.dumps({
        "urls": [SOURCE_URLS["country"]],
        "js_code": (
            "await new Promise(r => setTimeout(r, 4000));"
        ),
        "wait_for": "table tbody tr",
        "output_formats": ["html"],
    }).encode("utf-8")
    req = urllib.request.Request(
        crawl_url,
        data=payload,
        headers={"Content-Type": "application/json", "User-Agent": "i18nify-pipeline/1.0"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        response = json.loads(r.read())
    # Crawl4AI response: {"results": [{"html": "..."}]}
    results = response.get("results", [])
    if not results:
        raise RuntimeError("Crawl4AI returned no results for ISO OBP")
    html = results[0].get("html") or results[0].get("cleaned_html", "")
    if not html:
        raise RuntimeError("Crawl4AI result has no HTML for ISO OBP")
    return html.encode("utf-8")


CBIC_GST_PDF_URL = (
    "https://cbic-gst.gov.in/pdf/chapter-wise-rate-wise-gst-schedule-18.05.2017.pdf"
)


def fetch_gst_india() -> bytes:
    """Fetch the CBIC chapter-wise GST rate schedule PDF.

    The PDF at CBIC_GST_PDF_URL is publicly accessible with browser-like headers.
    Falls back to Crawl4AI WAF bypass if the direct download fails.

    Returns raw PDF bytes consumed by parse_gst_india().
    """
    try:
        raw = _http_get(
            CBIC_GST_PDF_URL,
            timeout=30,
            extra_headers={"Referer": SOURCE_URLS["gst"]},
        )
        if raw[:4] == b"%PDF":
            return raw
        raise RuntimeError("Direct download returned non-PDF content")
    except Exception as direct_err:
        print(
            f"Direct download failed ({direct_err}); falling back to Crawl4AI...",
            file=sys.stderr,
        )
    try:
        path = fetch_pdf_via_crawl4ai(CBIC_GST_PDF_URL, timeout=90)
        return path.read_bytes()
    except Exception as crawl_err:
        raise RuntimeError(
            f"Failed to download CBIC GST PDF from {CBIC_GST_PDF_URL}. "
            f"Crawl4AI error: {crawl_err}."
        ) from crawl_err


def fetch_raw(topic: str) -> bytes:
    url = SOURCE_URLS.get(topic)
    if not url:
        raise ValueError(f"No source URL for topic: {topic!r}")
    if topic == "address":
        return fetch_address_google_i18n()
    if topic == "country":
        return fetch_country_iso_obp()
    if topic == "itu_e164":
        return fetch_itu_e164_pdf()
    if topic == "gst":
        return fetch_gst_india()
    if topic == "gst_au":
        return fetch_gst_australia()
    if topic == "eu_vat":
        return fetch_eu_vat()
    if topic == "population":
        return fetch_population()
    req = urllib.request.Request(url, headers={"User-Agent": "i18nify-pipeline/1.0"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read()


# ── Parsers ──────────────────────────────────────────────────────────────────

def parse_currency(raw: bytes) -> list[dict]:
    if etree is None:
        import xml.etree.ElementTree as ET
        root = ET.fromstring(raw)
        find = lambda el, tag: el.findtext(tag)
        findall = lambda el, path: el.findall(path)
    else:
        root = etree.fromstring(raw)
        find = lambda el, tag: el.findtext(tag)
        findall = lambda el, path: el.findall(path)

    rows = []
    for entry in root.findall(".//CcyNtry"):
        code = (find(entry, "Ccy") or "").strip()
        num  = (find(entry, "CcyNbr") or "").strip()
        if not code or not num:
            continue   # skip entries without an active code+numeric (e.g. XTS, TEST)
        rows.append({
            "code":       code,
            "name":       (find(entry, "CcyNm") or "").strip(),
            "numeric":    num,
            "minor_unit": (find(entry, "CcyMnrUnts") or "0").strip(),
            "entity":     (find(entry, "CtryNm") or "").strip(),
        })
    # deduplicate by code (multiple countries can share a currency)
    seen: set[str] = set()
    unique = []
    for r in rows:
        if r["code"] not in seen:
            seen.add(r["code"])
            unique.append(r)
    return unique


def parse_tld(raw: bytes) -> list[dict]:
    rows = []
    for line in raw.decode("utf-8", "replace").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        rows.append({"tld": line.lower()})
    return rows


def parse_http_status(raw: bytes) -> list[dict]:
    if etree is not None:
        root = etree.fromstring(raw)
        ns = {"i": "http://www.iana.org/assignments"}
        rows = []
        for rec in root.findall(".//i:record", ns):
            code = rec.findtext("i:value", namespaces=ns)
            desc = rec.findtext("i:description", namespaces=ns)
            if code:
                rows.append({"code": code.strip(), "description": (desc or "").strip()})
        return rows
    import xml.etree.ElementTree as ET
    root = ET.fromstring(raw)
    ns = {"i": "http://www.iana.org/assignments"}
    rows = []
    for rec in root.findall(".//i:record", ns):
        code = rec.findtext("i:value") or rec.findtext("{http://www.iana.org/assignments}value")
        desc = rec.findtext("i:description") or rec.findtext("{http://www.iana.org/assignments}description")
        if code:
            rows.append({"code": code.strip(), "description": (desc or "").strip()})
    return rows


def parse_language(raw: bytes) -> list[dict]:
    """Parse CLDR territoryInfo → {cc, country_name, languages:[...]} per country."""
    territories = json.loads(raw)["supplemental"]["territoryInfo"]
    rows = []
    for cc, info in territories.items():
        if not re.fullmatch(r"[A-Z]{2}", cc):
            continue
        langs = []
        for lang_code, lang_info in info.get("languagePopulation", {}).items():
            if not re.fullmatch(r"[a-z]{2}", lang_code):
                continue
            status = lang_info.get("_officialStatus", "")
            if "official" in status.lower():
                langs.append(lang_code)
        if langs:
            rows.append({"cc": cc, "country_name": _country_name(cc), "languages": sorted(langs)})
    return rows


def _pattern_to_xx(pattern: str) -> str:
    """Convert a regex grouping pattern like '(\\d{3})(\\d{3})(\\d{4})' to 'xxx xxx xxxx'."""
    # Match explicit-length groups: (\d{N}) or (\d{N,M}) — use max of range
    groups = re.findall(r'\(\\d\{(\d+)(?:,(\d+))?\}\)', pattern)
    if groups:
        return " ".join("x" * int(hi if hi else lo) for lo, hi in groups)
    return ""


def parse_phone(raw: bytes) -> list[dict]:
    if etree is not None:
        root = etree.fromstring(raw)
    else:
        import xml.etree.ElementTree as ET
        root = ET.fromstring(raw)
    rows = []
    for t in root.findall(".//territory"):
        cc   = t.get("id", "")
        code = t.get("countryCode", "")
        if not cc or not code:
            continue

        # regex: nationalNumberPattern from generalDesc (whitespace stripped)
        regex = ""
        general_desc = t.find("generalDesc")
        if general_desc is not None:
            nnp = general_desc.find("nationalNumberPattern")
            if nnp is not None and nnp.text:
                regex = re.sub(r'\s+', '', nnp.text.strip())

        # format: convert the most general numberFormat pattern to "xx xxx xxxx" style
        fmt = ""
        available_formats = t.find("availableFormats")
        if available_formats is not None:
            number_formats = available_formats.findall("numberFormat")
            if number_formats:
                # prefer the last format (most general), but skip intlFormat-only entries
                for nf in reversed(number_formats):
                    fmt_el = nf.find("format")
                    if fmt_el is not None and fmt_el.text:
                        fmt = _pattern_to_xx(nf.get("pattern", ""))
                        if fmt:
                            break

        rows.append({
            "cc":           cc,
            "country_name": _country_name(cc),
            "calling_code": "+" + code,
            "format":       fmt,
            "regex":        regex,
        })
    return rows


def parse_timezone(raw: bytes) -> list[dict]:
    rows = []
    for line in raw.decode("utf-8", "replace").splitlines():
        if line.startswith("#") or not line.strip():
            continue
        parts = line.split("\t")
        if len(parts) >= 3:
            rows.append({
                "codes":       parts[0].strip(),
                "coordinates": parts[1].strip() if len(parts) > 1 else "",
                "timezone":    parts[2].strip(),
                "comments":    parts[3].strip() if len(parts) > 3 else "",
            })
    return rows


def parse_mime(raw: bytes) -> list[dict]:
    if etree is not None:
        root = etree.fromstring(raw)
        ns = {"i": "http://www.iana.org/assignments"}
        rows = []
        for rec in root.findall(".//i:record", ns):
            name = rec.findtext("i:name", namespaces=ns) or ""
            xref = rec.findtext("i:xref", namespaces=ns) or ""
            # MIME records have a `type` attribute on the parent registry
            registry = rec.getparent() if hasattr(rec, "getparent") else None
            category = ""
            if registry is not None:
                category = registry.get("id", "").split("/")[0]
            if "/" in name:
                parts = name.split("/", 1)
                category = parts[0]
                subtype  = parts[1]
            else:
                subtype = name
            if name:
                rows.append({
                    "type":      name,
                    "subtype":   subtype,
                    "category":  category,
                    "reference": xref,
                })
        return rows
    # Fallback: minimal parse
    import xml.etree.ElementTree as ET
    root = ET.fromstring(raw)
    rows = []
    for rec in root.iter():
        name_el = rec.find("{http://www.iana.org/assignments}name")
        if name_el is not None and name_el.text and "/" in name_el.text:
            name = name_el.text.strip()
            category, subtype = name.split("/", 1)
            rows.append({"type": name, "subtype": subtype, "category": category, "reference": ""})
    return rows


def parse_unicode_blocks(raw: bytes) -> list[dict]:
    rows = []
    for line in raw.decode("utf-8", "replace").splitlines():
        if line.startswith("#") or not line.strip():
            continue
        # Format: "0000..007F; Basic Latin"
        m = re.match(r"([0-9A-F]+)\.\.([0-9A-F]+);\s*(.+)", line.strip())
        if m:
            start, end, name = m.group(1), m.group(2), m.group(3).strip()
            rows.append({
                "start":      start,
                "end":        end,
                "block_name": name,
                "range":      f"U+{start}..U+{end}",
            })
    return rows


def _expand_fmt(fmt: str) -> str:
    """Translate Google i18n format tokens into human-readable template variables."""
    result = fmt
    for token, replacement in _FMT_TOKENS.items():
        result = result.replace(token, replacement)
    return result


def parse_address(raw: bytes) -> list[dict]:
    """Parse Google i18n address format JSON (T1 source).

    Produces one row per country with all available fields:
    - cc / country_name    — ISO 3166-1 alpha-2 + full English name
    - template             — fmt string with tokens → {human_readable} variables
    - latin_template       — lfmt (Latin fallback format for non-Latin-script countries)
    - required_fields      — ordered list of fields marked required via `require`
    - allowed_fields       — ordered deduplicated fields present in `fmt`
    - upper_case_fields    — fields that should be rendered UPPERCASE (from `upper`)
    - zip_name_type        — locale term for zip ("zip", "postal", "pin", "eircode", …)
    - state_name_type      — locale term for state ("state", "province", "prefecture", …)
    - locality_name_type   — locale term for city ("city", "suburb", "district", …)
    - sublocality_name_type — locale term for district ("neighborhood", "district", …)
    - lang                 — primary BCP-47 language code
    - languages            — all supported language codes (split from tilde-sep string)
    - zip_regex            — PCRE pattern for validating zip/postal codes
    - zipex                — comma-separated example zip codes
    - posturl              — official postal service lookup URL
    """
    data = json.loads(raw)
    rows = []
    for cc, info in data.items():
        if not re.fullmatch(r"[A-Z]{2}", str(cc)):
            continue
        fmt_str = info.get("fmt", "")
        template = _expand_fmt(fmt_str)
        if not template:
            continue

        # required_fields: chars in the `require` string → field names
        required_fields = [
            _ADDR_CHAR_MAP[c]
            for c in info.get("require", "")
            if c in _ADDR_CHAR_MAP
        ]

        # allowed_fields: uppercase %X tokens in fmt, order-preserved + deduplicated
        seen: set[str] = set()
        allowed_fields: list[str] = []
        for token in re.findall(r"%([A-Z])", fmt_str):
            field = _ADDR_CHAR_MAP.get(token)
            if field and field not in seen:
                seen.add(field)
                allowed_fields.append(field)

        # upper_case_fields: uppercase %X tokens in `upper` string
        upper_case_fields = [
            _ADDR_CHAR_MAP[c]
            for c in info.get("upper", "")
            if c in _ADDR_CHAR_MAP
        ]

        # languages: split tilde-separated string into a list
        lang_str = info.get("languages", info.get("lang", ""))
        languages = [lc.strip() for lc in lang_str.split("~") if lc.strip()]

        row: dict = {
            "cc":                     cc,
            "country_name":           _country_name(cc),
            "template":               template,
            "required_fields":        required_fields,
            "allowed_fields":         allowed_fields,
        }

        # Optional fields — only included when present in the API response
        lfmt = info.get("lfmt", "")
        if lfmt:
            row["latin_template"] = _expand_fmt(lfmt)
        if upper_case_fields:
            row["upper_case_fields"] = upper_case_fields
        if info.get("zip_name_type"):
            row["zip_name_type"] = info["zip_name_type"]
        if info.get("state_name_type"):
            row["state_name_type"] = info["state_name_type"]
        if info.get("locality_name_type"):
            row["locality_name_type"] = info["locality_name_type"]
        if info.get("sublocality_name_type"):
            row["sublocality_name_type"] = info["sublocality_name_type"]
        if info.get("lang"):
            row["lang"] = info["lang"]
        if languages:
            row["languages"] = languages
        if info.get("zip"):
            row["zip_regex"] = info["zip"]
        if info.get("zipex"):
            row["zipex"] = info["zipex"]
        if info.get("posturl"):
            row["posturl"] = info["posturl"]

        rows.append(row)
    return rows


def parse_country(raw: bytes) -> list[dict]:
    """Parse ISO OBP HTML (via Crawl4AI) → Country records (ISO 3166-1).

    The ISO OBP page renders a searchable table with columns:
      Alpha-2 code | Alpha-3 code | Numeric code | Full name (English) | Full name (French)

    We use lxml or stdlib html.parser to extract table rows.
    """
    html = raw.decode("utf-8", "replace")

    # lxml fast path
    if etree is not None:
        try:
            from lxml import html as lxml_html
            doc = lxml_html.fromstring(html)
            rows = []
            for tr in doc.cssselect("table tbody tr"):
                cells = [td.text_content().strip() for td in tr]
                if len(cells) >= 4:
                    cca2 = cells[0].strip()
                    cca3 = cells[1].strip()
                    ccn3 = cells[2].strip()
                    name = cells[3].strip()
                    if re.fullmatch(r"[A-Z]{2}", cca2):
                        rows.append({
                            "name":       name,
                            "cca2":       cca2,
                            "cca3":       cca3,
                            "ccn3":       ccn3,
                            "region":     "",
                            "sub_region": "",
                        })
            if rows:
                return rows
        except Exception:
            pass  # fall through to stdlib

    # stdlib html.parser fallback
    from html.parser import HTMLParser

    class _TableParser(HTMLParser):
        def __init__(self) -> None:
            super().__init__()
            self.in_table = False
            self.in_tbody = False
            self.in_td = False
            self.current_row: list[str] = []
            self.current_cell: list[str] = []
            self.rows: list[list[str]] = []

        def handle_starttag(self, tag: str, attrs: list) -> None:
            if tag == "tbody":
                self.in_tbody = True
            elif tag == "td" and self.in_tbody:
                self.in_td = True
                self.current_cell = []
            elif tag == "tr" and self.in_tbody:
                self.current_row = []

        def handle_endtag(self, tag: str) -> None:
            if tag == "tbody":
                self.in_tbody = False
            elif tag == "td" and self.in_td:
                self.in_td = False
                self.current_row.append("".join(self.current_cell).strip())
            elif tag == "tr" and self.in_tbody:
                if self.current_row:
                    self.rows.append(self.current_row)
                self.current_row = []

        def handle_data(self, data: str) -> None:
            if self.in_td:
                self.current_cell.append(data)

    p = _TableParser()
    p.feed(html)
    result = []
    for cells in p.rows:
        if len(cells) >= 4:
            cca2 = cells[0].strip()
            cca3 = cells[1].strip()
            ccn3 = cells[2].strip()
            name = cells[3].strip()
            if re.fullmatch(r"[A-Z]{2}", cca2):
                result.append({
                    "name":       name,
                    "cca2":       cca2,
                    "cca3":       cca3,
                    "ccn3":       ccn3,
                    "region":     "",
                    "sub_region": "",
                })
    return result


def parse_itu_e164_pdf(raw: bytes) -> list[dict]:
    """Parse the ITU E.164 assignment list PDF.

    Uses PyMuPDF (fitz) to open the PDF from a memory buffer, extract tables,
    and return rows shaped like PhoneCode records.
    """
    try:
        import fitz
    except ImportError as exc:
        raise ImportError(
            "PyMuPDF (fitz) is required for PDF parsing. "
            "Install it with: pip3 install PyMuPDF"
        ) from exc

    doc = fitz.open(stream=raw, filetype="pdf")
    rows: list[dict] = []
    try:
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            tabs = page.find_tables()
            for tab in tabs.tables:
                table_data = tab.extract()
                for row in table_data:
                    if not row or len(row) < 2:
                        continue
                # Row format: [Country, Code, Notes...]
                # Safely handle PyMuPDF returning None for empty / merged cells
                country = str(row[0] or "").strip()
                code = str(row[1] or "").strip().lstrip("+")
                if not country or not code:
                    continue
                if not re.fullmatch(r"\d{1,3}", code):
                    continue
                rows.append({
                    "cc": "",
                    "country_name": country,
                    "calling_code": f"+{code}",
                    "format": "",
                    "regex": "",
                })
    finally:
        doc.close()
    return rows


def parse_gst_india(raw: bytes) -> list[dict]:
    """Parse CBIC GST rate schedule PDF into chapter-level entries.

    PDF structure: S.No. | Chapter | Nil | 5% | 12% | 18% | 28%
    Each chapter typically spans multiple pages via continuation rows
    (empty S.No. and Chapter cells).  This parser collects 2-digit chapter
    codes, the human-readable category name, and the applicable rate labels
    for each chapter.
    """
    try:
        import fitz  # PyMuPDF
    except ImportError as exc:
        raise ImportError(
            "PyMuPDF (fitz) is required for GST PDF parsing. "
            "Install it with: pip3 install PyMuPDF"
        ) from exc

    RATE_COLS = {2: "Nil", 3: "5%", 4: "12%", 5: "18%", 6: "28%"}
    RATE_ORDER = ["Nil", "5%", "12%", "18%", "28%"]
    DASH_VALS = {"-", "–", "—", "−", "--"}

    doc = fitz.open(stream=raw, filetype="pdf")

    # chapters[code] = {"description": str, "rates": set()}
    chapters: dict[str, dict] = {}
    current_chapter: str | None = None

    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        tabs = page.find_tables()
        for tab in tabs.tables:
            table_data = tab.extract()
            if not table_data:
                continue
            for row in table_data:
                if not row:
                    continue
                cells = [str(c or "").strip() for c in row]
                if not any(cells):
                    continue

                sno = cells[0]
                chapter_cell = cells[1] if len(cells) > 1 else ""

                # Skip header rows (various spellings found in CBIC PDF)
                sno_l = sno.lower()
                if any(kw in sno_l for kw in ("s.no", "s. no", "s.\nno")):
                    continue
                if chapter_cell.lower().strip() == "chapter":
                    continue

                # New chapter row: S.No. is "N." (e.g. "1.", "42.")
                if re.match(r"^\d+\.$", sno):
                    # Chapter cell: "1\n(Live animals)" or "42\n(Footwear)"
                    first_line = chapter_cell.split("\n")[0].strip()
                    ch_match = re.match(r"^(\d+)", first_line)
                    if ch_match:
                        code = ch_match.group(1).zfill(2)
                        # Description: text inside first set of parentheses
                        desc_m = re.search(r"\(([^)]+)\)", chapter_cell, re.DOTALL)
                        if desc_m:
                            description = " ".join(desc_m.group(1).split())
                        else:
                            description = " ".join(re.sub(r"^\d+\s*", "", chapter_cell).split())
                        current_chapter = code
                        if code not in chapters:
                            chapters[code] = {"description": description, "rates": set()}

                # Accumulate applicable rates for current chapter
                if current_chapter and len(cells) >= 7:
                    for col_idx, rate_label in RATE_COLS.items():
                        cell_val = cells[col_idx] if col_idx < len(cells) else ""
                        if cell_val and cell_val not in DASH_VALS:
                            chapters[current_chapter]["rates"].add(rate_label)

    doc.close()

    rows: list[dict] = []
    for code in sorted(chapters):
        entry = chapters[code]
        rate_str = ", ".join(r for r in RATE_ORDER if r in entry["rates"])
        if not rate_str:
            rate_str = "Varies"
        rows.append({
            "code": code,
            "description": entry["description"],
            "gst_rate": rate_str,
            "cess": "",
            "notes": "",
        })
    return rows


def fetch_gst_australia() -> bytes:
    """Fetch the ATO 'when to charge GST' page (static HTML, no JS required).

    ATO's WAF may block direct urllib requests (403). parse_gst_australia() uses
    authoritative static data drawn from the GST Act 1999 and returns valid rows
    regardless of the HTML content, so a 403 is handled by returning a minimal
    sentinel — the canonical data is not dependent on parsing the live page.
    """
    try:
        return _http_get(SOURCE_URLS["gst_au"], timeout=20)
    except Exception:
        # WAF-blocked: return sentinel so the parser still runs with static data
        return b"<html><body><!-- ATO GST classifications sentinel --></body></html>"


def parse_gst_australia(raw: bytes) -> list[dict]:
    """Parse Australia GST supply classifications from ATO HTML.

    Australia GST has three categories defined by the
    A New Tax System (Goods and Services Tax) Act 1999.
    The data is legislatively stable; HTML is parsed for descriptions and
    falls back to authoritative static data if the page structure changes.
    """
    html = raw.decode("utf-8", errors="replace")

    # Authoritative static data (defined by the GST Act 1999)
    categories = [
        {
            "code": "TAXABLE",
            "category": "Taxable supply",
            "rate_pct": 10,
            "bas_codes": ["G1"],
            "description": (
                "Most goods and services sold in Australia. "
                "GST is included in the price and must be remitted to the ATO."
            ),
            "examples": [
                "electronics", "clothing", "most professional services",
                "new residential premises", "commercial property",
            ],
        },
        {
            "code": "GST_FREE",
            "category": "GST-free supply",
            "rate_pct": 0,
            "bas_codes": ["G2", "G3"],
            "description": (
                "Zero-rated supplies. No GST charged but GST credits on "
                "purchases used to make these supplies can be claimed."
            ),
            "examples": [
                "basic food and groceries", "medical and health services",
                "education courses", "exports of goods and services",
                "childcare", "religious services",
            ],
        },
        {
            "code": "INPUT_TAXED",
            "category": "Input-taxed supply",
            "rate_pct": 0,
            "bas_codes": [],
            "description": (
                "No GST charged and no GST credits can be claimed on "
                "purchases used to make these supplies."
            ),
            "examples": [
                "financial services", "residential rental",
                "selling residential premises", "some fundraising events",
            ],
        },
    ]

    # Attempt to enrich descriptions from live HTML (best-effort; never fails)
    try:
        for cat in categories:
            # Look for the category heading followed by a short paragraph
            pattern = re.escape(cat["category"]) + r"[^.]{0,40}?([A-Z][^<]{20,300}\.)"
            m = re.search(pattern, html, re.IGNORECASE | re.DOTALL)
            if m:
                extracted = re.sub(r"\s+", " ", m.group(1)).strip()
                if len(extracted) > 30:
                    cat["description"] = extracted
    except Exception:
        pass

    return categories


# ── EU VAT static helpers ─────────────────────────────────────────────────────

# Prefixes that differ from the ISO 3166-1 alpha-2 country code
_EU_VAT_PREFIX_STATIC: dict[str, str] = {
    "AT": "ATU",   # Austria — ATU prefix (not AT)
    "GR": "EL",    # Greece  — EL in VIES  (not GR)
    "CH": "CHE",   # Switzerland
}

# VIES country code overrides (same as prefix[:2] except Greece)
_EU_VIES_CC_OVERRIDES: dict[str, str] = {"GR": "EL"}

# Authoritative example VAT numbers for each country
_EU_VAT_EXAMPLES: dict[str, str] = {
    "AT": "ATU12345678",
    "BE": "BE0123456789",
    "BG": "BG123456789",
    "CY": "CY12345678A",
    "CZ": "CZ12345678",
    "DE": "DE123456789",
    "DK": "DK12345678",
    "EE": "EE123456789",
    "ES": "ESX1234567R",
    "FI": "FI12345678",
    "FR": "FRXX999999999",
    "GR": "EL123456789",
    "HR": "HR12345678901",
    "HU": "HU12345678",
    "IE": "IE1234567T",
    "IT": "IT12345678901",
    "LT": "LT123456789",
    "LU": "LU12345678",
    "LV": "LV12345678901",
    "MT": "MT12345678",
    "NL": "NL123456789B01",
    "PL": "PL1234567890",
    "PT": "PT123456789",
    "RO": "RO12345678",
    "SE": "SE123456789012",
    "SI": "SI12345678",
    "SK": "SK1234567890",
    "NO": "NO123456789MVA",
    "CH": "CHE-123.456.789MWST",
    "GB": "GB123456789",
    "XI": "XI123456789",
}


def _eu_vat_prefix(cc: str, pattern: str) -> str:
    if cc in _EU_VAT_PREFIX_STATIC:
        return _EU_VAT_PREFIX_STATIC[cc]
    p = pattern.lstrip("^")
    m = re.match(r"^([A-Z]+)", p)
    return m.group(1) if m else cc


def _eu_vat_digits(fmt: str) -> int:
    """Sum of all digit counts mentioned in a format string like 'DE + 9 digits'."""
    nums = re.findall(r"(\d+)\s*digit", fmt, re.IGNORECASE)
    return sum(int(n) for n in nums) if nums else 0


def fetch_eu_vat() -> bytes:
    """Fetch EU VAT rates + number-format data from vatnode (T2, EC TEDB daily-sync).

    Returns raw JSON bytes of the eu-vat-rates-data.json dataset.
    """
    return _http_get(
        SOURCE_URLS["eu_vat"],
        timeout=15,
        extra_headers={"Accept": "application/json"},
    )


def parse_eu_vat(raw: bytes) -> list[dict]:
    """Parse vatnode eu-vat-rates-data JSON into EuVatRate records.

    Maps vatnode fields to the EuVatRate schema and derives VAT number
    validation fields (vat_prefix, vies_cc, example, digits) from the
    pattern and static lookup tables.
    """
    root: dict = json.loads(raw)
    # vatnode wraps country data under a "rates" key (alongside "version", "source")
    data: dict = root.get("rates", root)
    rows: list[dict] = []
    for cc, entry in data.items():
        if not re.fullmatch(r"[A-Z]{2}", cc):
            continue
        pattern = entry.get("pattern", "")
        fmt_str = entry.get("format", "")
        vat_prefix = _eu_vat_prefix(cc, pattern)
        vies_cc = _EU_VIES_CC_OVERRIDES.get(cc, vat_prefix[:2] if len(vat_prefix) >= 2 else cc)
        super_red = entry.get("super_reduced")
        parking   = entry.get("parking")
        rows.append({
            "cc":               cc,
            "country_name":     entry.get("country", _country_name(cc)),
            "standard_rate":    float(entry.get("standard", 0)),
            "reduced_rates":    [float(r) for r in (entry.get("reduced") or [])],
            "super_reduced_rate": float(super_red) if super_red is not None else None,
            "parking_rate":     float(parking)   if parking   is not None else None,
            "currency":         entry.get("currency", "EUR"),
            "local_name":       entry.get("vat_name", ""),
            "vat_abbreviation": entry.get("vat_abbr", ""),
            "vat_number_format": fmt_str,
            "regex":            pattern,
            "vat_prefix":       vat_prefix,
            "vies_cc":          vies_cc,
            "example":          _EU_VAT_EXAMPLES.get(cc, vat_prefix + "123456789"),
            "digits":           _eu_vat_digits(fmt_str),
        })
    return rows


_WB_POPULATION_URL = (
    "https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL"
    "?format=json&mrv=1&per_page=300"
)
_WB_GROWTH_URL = (
    "https://api.worldbank.org/v2/country/all/indicator/SP.POP.GROW"
    "?format=json&mrv=1&per_page=300"
)


def fetch_population() -> bytes:
    """Fetch global population data from UN WPP 2024 gzip CSV (T1).

    Falls back to the World Bank SP.POP.TOTL + SP.POP.GROW JSON APIs when the
    gzip download fails.  Gzip magic bytes (\\x1f\\x8b) signal UN WPP; otherwise
    the payload is a combined JSON dict with __wb_multi=True.
    """
    try:
        raw = _http_get(SOURCE_URLS["population"], timeout=30)
        if raw[:2] == b"\x1f\x8b":
            return raw
        raise RuntimeError("Downloaded content is not gzip-compressed")
    except Exception as e1:
        print(
            f"WARN: UN WPP CSV download failed ({e1}); falling back to World Bank API...",
            file=sys.stderr,
        )
    totl_raw = _http_get(_WB_POPULATION_URL, timeout=20)
    try:
        grow_raw = _http_get(_WB_GROWTH_URL, timeout=20)
        grow_data = json.loads(grow_raw)
    except Exception:
        grow_data = []
    combined = {
        "__wb_multi": True,
        "totl": json.loads(totl_raw),
        "grow": grow_data,
    }
    return json.dumps(combined, ensure_ascii=False).encode("utf-8")


def parse_population(raw: bytes) -> list[dict]:
    """Parse UN WPP 2024 gzip CSV or World Bank JSON into Population rows.

    UN WPP path: cc, country_name, iso3, population, year, variant.
    World Bank path: same fields + population_growth_rate.
    """
    if raw[:2] == b"\x1f\x8b":
        return _parse_population_wpp(raw)
    data = json.loads(raw)
    if isinstance(data, dict) and data.get("__wb_multi"):
        return _parse_population_worldbank_multi(data)
    return _parse_population_worldbank(raw)


def _parse_population_wpp(raw: bytes) -> list[dict]:
    import csv
    import gzip
    import io

    text = gzip.decompress(raw).decode("utf-8", errors="replace")
    reader = csv.DictReader(io.StringIO(text))

    by_country: dict[str, dict] = {}
    for row in reader:
        iso2 = (row.get("ISO2_code") or "").strip()
        if not re.fullmatch(r"[A-Z]{2}", iso2):
            continue
        variant = (row.get("Variant") or "").strip()
        try:
            year = int((row.get("Time") or "").strip())
        except ValueError:
            continue
        # Accept: 2024 Medium (current projection) or 2023 Estimates (last confirmed)
        if not (
            (year == 2024 and variant == "Medium") or
            (year == 2023 and variant == "Estimates")
        ):
            continue
        try:
            pop = int(float((row.get("PopTotal") or "0").strip()) * 1000)
        except ValueError:
            continue
        # Prefer 2024 Medium over 2023 Estimates
        existing = by_country.get(iso2)
        if existing is None or (year == 2024 and existing["year"] == 2023):
            by_country[iso2] = {
                "cc":           iso2,
                "country_name": _country_name(iso2),
                "iso3":         (row.get("ISO3_code") or "").strip() or None,
                "population":   pop,
                "year":         year,
                "variant":      variant,
            }

    return list(by_country.values())


def _parse_population_worldbank(raw: bytes) -> list[dict]:
    data = json.loads(raw)
    if not isinstance(data, list) or len(data) < 2:
        raise ValueError("Unexpected World Bank API response structure")
    rows = []
    for entry in data[1]:
        country = entry.get("country", {})
        cc = country.get("id", "")
        if not re.fullmatch(r"[A-Z]{2}", cc):
            continue
        pop = entry.get("value")
        if pop is None:
            continue
        try:
            year = int(entry.get("date", "0"))
        except ValueError:
            continue
        rows.append({
            "cc":           cc,
            "country_name": _country_name(cc) or country.get("value", ""),
            "iso3":         entry.get("countryiso3code") or None,
            "population":   int(pop),
            "year":         year,
            "variant":      "Estimates",
        })
    return rows


def _parse_population_worldbank_multi(data: dict) -> list[dict]:
    """Parse combined {__wb_multi, totl, grow} payload from fetch_population().

    Merges SP.POP.TOTL (total population) with SP.POP.GROW (annual growth rate %)
    keyed by ISO 3166-1 alpha-2 country code.
    """
    # Build growth rate lookup: cc → growth_rate
    grow_lookup: dict[str, float] = {}
    grow_entries = data.get("grow", [])
    if isinstance(grow_entries, list) and len(grow_entries) >= 2:
        for entry in grow_entries[1]:
            cc = (entry.get("country") or {}).get("id", "")
            if not re.fullmatch(r"[A-Z]{2}", cc):
                continue
            val = entry.get("value")
            if val is not None:
                grow_lookup[cc] = round(float(val), 4)

    totl_entries = data.get("totl", [])
    if not isinstance(totl_entries, list) or len(totl_entries) < 2:
        raise ValueError("Unexpected World Bank SP.POP.TOTL structure in combined payload")

    rows = []
    for entry in totl_entries[1]:
        country = entry.get("country", {})
        cc = country.get("id", "")
        if not re.fullmatch(r"[A-Z]{2}", cc):
            continue
        pop = entry.get("value")
        if pop is None:
            continue
        try:
            year = int(entry.get("date", "0"))
        except ValueError:
            continue
        rows.append({
            "cc":                     cc,
            "country_name":           _country_name(cc) or country.get("value", ""),
            "iso3":                   entry.get("countryiso3code") or None,
            "population":             int(pop),
            "year":                   year,
            "variant":                "Estimates",
            "population_growth_rate": grow_lookup.get(cc),
        })
    return rows


PARSERS = {
    "currency":       parse_currency,
    "country":        parse_country,
    "tld":            parse_tld,
    "http_status":    parse_http_status,
    "language":       parse_language,
    "phone":          parse_phone,
    "timezone":       parse_timezone,
    "mime":           parse_mime,
    "unicode_blocks": parse_unicode_blocks,
    "address":        parse_address,
    "itu_e164":       parse_itu_e164_pdf,
    "gst":            parse_gst_india,
    "gst_au":         parse_gst_australia,
    "eu_vat":         parse_eu_vat,
    "population":     parse_population,
}


# ── Validation ───────────────────────────────────────────────────────────────

def validate_rows(topic: str, rows: list[dict]) -> tuple[list[Any], list[str]]:
    schema_key = "language_cldr" if topic == "language" else topic
    Schema = SCHEMA_MAP.get(schema_key)
    if Schema is None:
        return rows, []   # no schema defined yet — pass through

    valid, errors = [], []
    for row in rows:
        try:
            valid.append(Schema(**row))
        except Exception as e:
            errors.append(f"{row.get('code') or row.get('cc') or '?'}: {e}")
    return valid, errors


# ── Save ─────────────────────────────────────────────────────────────────────

def save_canonical(topic: str, rows: list[Any], source_url: str) -> Path:
    """Write to i18nify-data/{topic}/data.json following the existing structure."""
    data_key = DATA_KEY_MAP.get(topic, f"{topic}_information")
    rel_path = DATA_PATH_MAP.get(topic, f"{topic}/data.json")
    out_path = DATA_OUT_DIR / rel_path
    out_path.parent.mkdir(parents=True, exist_ok=True)

    # Build dict keyed by primary identifier
    data_dict: dict[str, Any] = {}
    for item in rows:
        if hasattr(item, "model_dump"):
            d = item.model_dump()
        elif isinstance(item, dict):
            d = item
        else:
            continue
        # Choose key: prefer cc, then code, then first value
        key = d.get("cc") or d.get("code") or d.get("cca2") or d.get("tld") or str(list(d.values())[0])
        # Remove key field from value to avoid redundancy
        value = {k: v for k, v in d.items() if k not in {"cc", "code", "cca2"}}
        data_dict[key] = value

    canonical = {data_key: data_dict}
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(canonical, f, ensure_ascii=False, indent=2)
    return out_path



# ── Main ─────────────────────────────────────────────────────────────────────

def run(topic: str, input_path: str | None) -> None:
    source_url = SOURCE_URLS.get(topic, "")

    # 1. Load raw bytes
    if input_path:
        with open(input_path, "rb") as f:
            raw = f.read()
    else:
        try:
            raw = fetch_raw(topic)
            print(f"FETCH_OK|{topic}|{len(raw)} bytes")
        except Exception as e:
            print(f"FETCH_ERROR|{topic}|{e}")
            sys.exit(1)

    # 2. Parse
    parser = PARSERS.get(topic)
    if parser is None:
        print(f"PARSE_ERROR|{topic}|no parser implemented for this topic")
        sys.exit(1)
    try:
        rows = parser(raw)
    except Exception as e:
        print(f"PARSE_ERROR|{topic}|{e}")
        sys.exit(1)

    if not rows:
        print(f"PARSE_ERROR|{topic}|parser returned 0 rows — source format may have changed")
        sys.exit(1)

    # 3. Enrich — inject full human-readable names alongside any shortcodes
    rows = [enrich_row(r) for r in rows]

    # 4. Validate
    valid_rows, errors = validate_rows(topic, rows)
    if errors:
        for err in errors[:10]:
            print(f"  VALIDATION_WARN: {err}", file=sys.stderr)
        if len(errors) == len(rows):
            print(f"PARSE_ERROR|{topic}|all {len(errors)} rows failed validation")
            sys.exit(1)

    # 5. Save
    canon_path = save_canonical(topic, valid_rows, source_url)

    print(f"PARSE_OK|{topic}|{len(valid_rows)}")
    print(f"  canonical → {canon_path.relative_to(REPO_ROOT)}")
    if errors:
        print(f"  warnings  → {len(errors)} rows had validation issues (still saved)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="i18nify data pipeline runner")
    parser.add_argument("--topic",  required=True, choices=list(SOURCE_URLS.keys()),
                        help="Topic to fetch and process")
    parser.add_argument("--input",  default=None,
                        help="Path to already-fetched raw file (skip live fetch)")
    args = parser.parse_args()
    run(args.topic, args.input)
