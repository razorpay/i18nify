#!/usr/bin/env python3
"""
i18nify PDF scraper — download, cache, and extract structured data from standards-body PDFs.

Handles paywalled / downloadable PDFs (ITU E.164, UPU, etc.) that the main
Crawl4AI runner cannot reach as plain text/XML.

Usage:
    from pdf_scraper import PdfScraper, extract_phone_from_itu_e164

    scraper = PdfScraper(cache_dir="/tmp/i18nify_pdf_cache")
    rows = extract_phone_from_itu_e164(scraper)
"""
from __future__ import annotations

import json
import os
import re
import urllib.request
from pathlib import Path
from typing import Any

try:
    import fitz  # PyMuPDF
except ImportError as _e:
    raise ImportError(
        "PyMuPDF (fitz) is required for PDF scraping. "
        "Install it with: pip3 install PyMuPDF"
    ) from _e


# ── Defaults ─────────────────────────────────────────────────────────────────

DEFAULT_CACHE_DIR = Path(__file__).resolve().parents[2] / "i18nify-data" / "pdf-cache"
DEFAULT_TIMEOUT = 30


# ── Download helpers ─────────────────────────────────────────────────────────

def _http_get(url: str, timeout: int = DEFAULT_TIMEOUT) -> bytes:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            ),
            "Accept": "application/pdf,*/*",
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def _safe_filename(url: str) -> str:
    """Convert a URL into a filesystem-safe cache key."""
    return re.sub(r"[^a-zA-Z0-9_.-]", "_", url.split("://")[-1])[:128]


# ── Core scraper class ────────────────────────────────────────────────────────

class PdfScraper:
    """Download, cache, and extract structured data from PDF documents."""

    def __init__(self, cache_dir: str | Path | None = None) -> None:
        self.cache_dir = Path(cache_dir or DEFAULT_CACHE_DIR)
        self.cache_dir.mkdir(parents=True, exist_ok=True)

    # ── Cache / Download ─────────────────────────────────────────────────────

    def download(
        self,
        url: str,
        force: bool = False,
        timeout: int = DEFAULT_TIMEOUT,
        fetcher: Any | None = None,
    ) -> Path:
        """Download a PDF to the local cache and return its path.

        Args:
            url:     Remote PDF URL.
            force:   Re-download even if cached.
            timeout: HTTP timeout in seconds (ignored when *fetcher* is used).
            fetcher: Optional callable ``(url: str, dest: Path) -> None``.
                     When provided, the scraper delegates the actual download to
                     *fetcher* instead of using ``urllib.request``.  This is the
                     hook used by ``crawl4ai_runner.py`` to bypass WAFs via
                     Crawl4AI's headless browser.
        """
        cached = self.cache_dir / (_safe_filename(url) + ".pdf")
        if cached.exists() and not force:
            return cached
        if fetcher is not None:
            fetcher(url, cached)
        else:
            raw = _http_get(url, timeout=timeout)
            cached.write_bytes(raw)
        return cached

    def load(self, path: str | Path) -> fitz.Document:
        """Open a PDF with PyMuPDF from a local path."""
        return fitz.open(str(path))

    @classmethod
    def from_cached(cls, path: str | Path, cache_dir: str | Path | None = None) -> "PdfScraper":
        """Create a scraper instance that operates on an already-downloaded PDF.

        This bypasses the internal ``download()`` step entirely — useful when a
        headless browser (e.g. Crawl4AI) has already saved the PDF to disk.
        """
        instance = cls(cache_dir=cache_dir)
        instance._preloaded_path = Path(path)
        return instance

    # ── Text extraction ────────────────────────────────────────────────────

    @staticmethod
    def extract_text(
        doc: fitz.Document | str | Path,
        page_numbers: list[int] | None = None,
        mode: str = "text",
    ) -> dict[int, str]:
        """Extract text per page.

        Args:
            doc:  A fitz.Document, or a path to a PDF file.
            page_numbers: 0-based page indices to scan.  ``None`` = all pages.
            mode: "text" (raw) | "blocks" (paragraph blocks) | "html" | "dict"

        Returns:
            {page_index: extracted_text}
        """
        if isinstance(doc, (str, Path)):
            doc = fitz.open(str(doc))
        pages = page_numbers if page_numbers is not None else range(len(doc))
        result: dict[int, str] = {}
        for p in pages:
            page = doc.load_page(p)
            if mode == "blocks":
                blocks = page.get_text("blocks")
                result[p] = "\n\n".join(
                    b[4] for b in blocks if isinstance(b[4], str)
                )
            elif mode == "dict":
                result[p] = json.dumps(page.get_text("dict"), ensure_ascii=False)
            else:
                result[p] = page.get_text("text")
        return result

    @staticmethod
    def search(
        doc: fitz.Document | str | Path,
        keywords: list[str] | str,
        case_sensitive: bool = False,
    ) -> list[dict[str, Any]]:
        """Search for keywords across all pages and return matches with context.

        Returns a list of hit dicts:
            {
                "keyword": str,
                "page": int (1-based),
                "rect": [x0, y0, x1, y1],
                "surrounding_text": str,   # ~400 chars around the hit
            }
        """
        if isinstance(doc, (str, Path)):
            doc = fitz.open(str(doc))
        if isinstance(keywords, str):
            keywords = [keywords]
        hits: list[dict[str, Any]] = []
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            for kw in keywords:
                rects = page.search_for(kw)
                if not rects:
                    continue
                # Extract surrounding text for context
                full_text = page.get_text("text")
                for rect in rects:
                    x0, y0, x1, y1 = rect
                    # Build a slightly larger rect for context extraction
                    ctx_rect = fitz.Rect(
                        max(0, x0 - 20),
                        max(0, y0 - 50),
                        page.rect.width,
                        min(page.rect.height, y1 + 100),
                    )
                    surrounding = page.get_text("text", clip=ctx_rect)
                    hits.append({
                        "keyword": kw,
                        "page": page_num + 1,
                        "rect": [x0, y0, x1, y1],
                        "surrounding_text": surrounding.strip(),
                    })
        return hits

    @staticmethod
    def extract_sections(
        doc: fitz.Document | str | Path,
        section_headers: list[str],
        end_markers: list[str] | None = None,
    ) -> dict[str, str]:
        """Extract text that appears *after* a section header until an end marker.

        This is useful for standards-body PDFs that have clearly labelled
        sections (e.g. "Annex A", "Table 3", "References").

        Args:
            section_headers: Case-insensitive header strings to search for.
            end_markers:     Optional headers that terminate the extraction.

        Returns:
            {matched_header: extracted_text}
        """
        if isinstance(doc, (str, Path)):
            doc = fitz.open(str(doc))
        if end_markers is None:
            end_markers = []
        headers_lower = [h.lower() for h in section_headers]
        end_lower = [m.lower() for m in end_markers]
        extracted: dict[str, str] = {}
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            blocks = page.get_text("blocks")
            in_section: str | None = None
            buffer: list[str] = []
            for block in blocks:
                text = block[4] if isinstance(block[4], str) else ""
                text_stripped = text.strip()
                text_lower = text_stripped.lower()
                # Detect end marker
                if in_section and any(em in text_lower for em in end_lower):
                    extracted[in_section] = "\n".join(buffer).strip()
                    in_section = None
                    buffer = []
                    continue
                # Detect start of a new section
                for idx, hl in enumerate(headers_lower):
                    if hl in text_lower and len(text_stripped) < 200:
                        # Save previous section if any
                        if in_section:
                            extracted[in_section] = "\n".join(buffer).strip()
                        in_section = section_headers[idx]
                        buffer = []
                        break
                else:
                    if in_section:
                        buffer.append(text_stripped)
            # Page ended while still in a section
            if in_section:
                extracted[in_section] = "\n".join(buffer).strip()
        return extracted

    # ── Table extraction ─────────────────────────────────────────────────────

    @staticmethod
    def extract_tables(
        doc: fitz.Document | str | Path,
        page_numbers: list[int] | None = None,
    ) -> dict[int, list[list[list[str | None]]]]:
        """Extract tables from PDF pages.

        Returns:
            {page_index: [ [[table1_row1_col1, ...], [table1_row2_col1, ...]], [[table2...]], ... ]}

        Note:
            PyMuPDF may return ``None`` for merged or empty cells.
            Each page can contain multiple tables.
        """
        if isinstance(doc, (str, Path)):
            doc = fitz.open(str(doc))
        pages = page_numbers if page_numbers is not None else range(len(doc))
        result: dict[int, list[list[list[str | None]]]] = {}
        for p in pages:
            page = doc.load_page(p)
            tabs = page.find_tables()
            if tabs.tables:
                result[p] = [tab.extract() for tab in tabs.tables]
        return result

    # ── Link extraction ──────────────────────────────────────────────────────

    @staticmethod
    def extract_links(
        doc: fitz.Document | str | Path,
        page_numbers: list[int] | None = None,
    ) -> list[dict[str, Any]]:
        """Extract all hyperlinks from a PDF.

        Returns:
            [{"page": 1, "url": "...", "rect": [x0,y0,x1,y1], "text": "..."}, ...]
        """
        if isinstance(doc, (str, Path)):
            doc = fitz.open(str(doc))
        pages = page_numbers if page_numbers is not None else range(len(doc))
        links: list[dict[str, Any]] = []
        for p in pages:
            page = doc.load_page(p)
            page_links = page.get_links()
            for link in page_links:
                if link.get("uri"):
                    links.append({
                        "page": p + 1,
                        "url": link["uri"],
                        "rect": list(link.get("from", fitz.Rect())),
                        "text": page.get_text("text", clip=link.get("from")),
                    })
        return links

    # ── High-level convenience ───────────────────────────────────────────────

    def scrape(
        self,
        url: str,
        keywords: list[str] | None = None,
        extract_tables: bool = False,
        extract_links: bool = False,
        force_download: bool = False,
    ) -> dict[str, Any]:
        """One-shot download + full extraction.

        Returns a serialisable dict suitable for downstream parsers.
        """
        path = self.download(url, force=force_download)
        doc = self.load(path)
        result: dict[str, Any] = {
            "source_url": url,
            "cached_path": str(path),
            "page_count": len(doc),
        }
        result["text_by_page"] = self.extract_text(doc)
        if keywords:
            result["search_hits"] = self.search(doc, keywords)
        if extract_tables:
            result["tables"] = self.extract_tables(doc)
        if extract_links:
            result["links"] = self.extract_links(doc)
        doc.close()
        return result


# ── Domain-specific extractors (standards-body PDFs) ───────────────────────

ITU_E164_LANDING_URL = "https://www.itu.int/pub/T-SP-E.164D"
ITU_E164_FALLBACK_PDF = "https://www.itu.int/dms_pub/itu-t/opb/sp/T-SP-E.164D-11-2011-PDF-E.pdf"
UPU_POSTAL_URL = "https://www.upu.int/en/Postal-Solutions/Programmes-and-Projects/Addressing-Solutions"


def _resolve_itu_pdf_url(timeout: int = DEFAULT_TIMEOUT) -> str:
    """Resolve the ITU E.164 landing page to the actual PDF download URL.

    The /pub/ page is an HTML landing page.  We scrape it for the first
    ``.pdf`` href and fall back to a known direct DMS link if resolution fails.
    """
    try:
        html = _http_get(ITU_E164_LANDING_URL, timeout=timeout).decode("utf-8", "replace")
    except Exception:
        return ITU_E164_FALLBACK_PDF

    # Look for href="...something.pdf..."
    match = re.search(r'href="([^"]+\.pdf[^"]*)"', html, re.IGNORECASE)
    if match:
        href = match.group(1)
        # Resolve relative URLs
        if href.startswith("http"):
            return href
        base = "https://www.itu.int"
        return base + (href if href.startswith("/") else "/" + href)
    return ITU_E164_FALLBACK_PDF


def extract_phone_from_itu_e164(
    scraper: PdfScraper | None = None,
    pdf_path: str | Path | None = None,
) -> list[dict]:
    """Extract country-level phone data from the ITU E.164 assignment list PDF.

    The ITU publishes a PDF at `T-SP-E.164D` that contains a table with:
      - Country / Geographical Area
      - Country Code
      - Note (ISPC, etc.)

    Args:
        scraper:   PdfScraper instance (created automatically if omitted).
        pdf_path:  Optional path to a **pre-downloaded** PDF.  When provided,
                   the function skips its internal ``download()`` step entirely.
                   This is the integration hook used by ``crawl4ai_runner.py``
                   after Crawl4AI's headless browser has bypassed a WAF.

    Returns:
        List of row dicts in the same shape as the libphonenumber XML parser.
    """
    scraper = scraper or PdfScraper()

    if pdf_path is not None:
        # WAF-bypass path: caller already downloaded the PDF (e.g. via Crawl4AI)
        path = Path(pdf_path)
        if not path.exists():
            print(f"FETCH_ERROR|itu_e164|pre-loaded PDF not found: {path}", file=os.sys.stderr)
            return []
    else:
        # Standard path: resolve landing page → PDF URL → download via urllib
        pdf_url = _resolve_itu_pdf_url()
        try:
            path = scraper.download(pdf_url)
        except Exception as e:
            print(f"FETCH_ERROR|itu_e164|{e}", file=os.sys.stderr)
            return []

    doc = scraper.load(path)
    rows: list[dict] = []

    # The ITU E.164 PDF is typically a simple table: Country | Code | Notes
    # PyMuPDF table finder works well for this.
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
                    "cc": "",                # ISO 3166-1 alpha-2 — not present in ITU PDF
                    "country_name": country,
                    "calling_code": f"+{code}",
                    "notes": " ".join(str(c or "").strip() for c in row[2:]),
                    "source": "itu_e164_pdf",
                })

    doc.close()
    return rows


def extract_postal_from_upu(scraper: PdfScraper | None = None) -> list[dict]:
    """Extract postal code format data from UPU addressing guides.

    Returns rows with:
      - cc / country_name
      - postal_format
      - postal_regex (if available)
    """
    scraper = scraper or PdfScraper()
    # UPU docs are behind a login wall for some downloads.
    # This function is a scaffold — it will work if a direct PDF URL is supplied.
    print(
        "WARN: UPU postal PDF requires manual download or authenticated access. "
        "Place the PDF in the cache directory and re-run.",
        file=os.sys.stderr,
    )
    return []


# ── CLI entry-point (for standalone use) ─────────────────────────────────────

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="i18nify PDF scraper")
    parser.add_argument("url", help="URL of the PDF to download and scrape")
    parser.add_argument("--cache-dir", default=str(DEFAULT_CACHE_DIR), help="Cache directory")
    parser.add_argument("--keywords", nargs="+", default=None, help="Keywords to search for")
    parser.add_argument("--tables", action="store_true", help="Extract tables")
    parser.add_argument("--links", action="store_true", help="Extract hyperlinks")
    parser.add_argument("--output", "-o", default=None, help="Output JSON file")
    parser.add_argument("--itu-e164", action="store_true", help="Run ITU E.164 extractor")
    args = parser.parse_args()

    scraper = PdfScraper(cache_dir=args.cache_dir)

    if args.itu_e164:
        rows = extract_phone_from_itu_e164(scraper)
        print(json.dumps(rows, indent=2, ensure_ascii=False))
    else:
        result = scraper.scrape(
            args.url,
            keywords=args.keywords,
            extract_tables=args.tables,
            extract_links=args.links,
        )
        if args.output:
            with open(args.output, "w", encoding="utf-8") as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
            print(f"Saved to {args.output}")
        else:
            print(json.dumps(result, indent=2, ensure_ascii=False))
