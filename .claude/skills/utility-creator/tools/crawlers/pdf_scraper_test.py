#!/usr/bin/env python3
"""Tests for the i18nify PDF scraper module."""
from __future__ import annotations

import json
import os
import sys
import tempfile
from pathlib import Path

import fitz  # PyMuPDF
import pytest

# Module under test
sys.path.insert(0, str(Path(__file__).resolve().parent))
import pdf_scraper


def _make_test_pdf(tmpdir: str, text: str = "", tables: list | None = None) -> Path:
    """Generate a minimal PDF with optional text and tables for testing."""
    path = Path(tmpdir) / "test.pdf"
    doc = fitz.open()
    page = doc.new_page()

    if text:
        # Insert text at a known position
        rect = fitz.Rect(50, 50, 400, 200)
        page.insert_textbox(rect, text, fontsize=12)

    if tables:
        # Draw a simple table using rectangles and text
        x0, y0 = 50, 250
        col_width, row_height = 150, 30
        for r_idx, row in enumerate(tables):
            for c_idx, cell_text in enumerate(row):
                rx = x0 + c_idx * col_width
                ry = y0 + r_idx * row_height
                rect = fitz.Rect(rx, ry, rx + col_width, ry + row_height)
                page.draw_rect(rect)
                page.insert_textbox(rect, str(cell_text), fontsize=10)

    doc.save(str(path))
    doc.close()
    return path


class TestPdfScraperCore:
    """Tests for PdfScraper download, text extraction, and utilities."""

    def test_download_and_cache(self, tmp_path: Path) -> None:
        scraper = pdf_scraper.PdfScraper(cache_dir=tmp_path)
        # Use a small publicly accessible PDF (W3C spec example)
        url = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        try:
            path = scraper.download(url)
        except Exception:
            # Network-restricted environments may block external PDF downloads
            pytest.skip("Network access blocked — skipping live download test")
        assert path.exists()
        assert path.stat().st_size > 0
        # Second call should return cached copy (no re-download)
        path2 = scraper.download(url)
        assert path == path2

    def test_extract_text(self, tmp_path: Path) -> None:
        pdf_path = _make_test_pdf(str(tmp_path), text="Hello PDF world!\nThis is page 1.")
        scraper = pdf_scraper.PdfScraper(cache_dir=tmp_path)
        texts = scraper.extract_text(pdf_path)
        assert len(texts) == 1
        assert "Hello PDF world!" in texts[0]

    def test_extract_text_blocks(self, tmp_path: Path) -> None:
        pdf_path = _make_test_pdf(str(tmp_path), text="Block A\n\nBlock B")
        scraper = pdf_scraper.PdfScraper(cache_dir=tmp_path)
        texts = scraper.extract_text(pdf_path, mode="blocks")
        assert len(texts) == 1
        assert "Block A" in texts[0]
        assert "Block B" in texts[0]

    def test_search(self, tmp_path: Path) -> None:
        pdf_path = _make_test_pdf(str(tmp_path), text="The quick brown fox jumps over the lazy dog.")
        scraper = pdf_scraper.PdfScraper(cache_dir=tmp_path)
        hits = scraper.search(pdf_path, ["fox", "dog"])
        keywords_found = [h["keyword"] for h in hits]
        assert "fox" in keywords_found
        assert "dog" in keywords_found
        for h in hits:
            assert h["page"] == 1
            assert isinstance(h["rect"], list)
            assert len(h["rect"]) == 4
            assert h["surrounding_text"] != ""

    def test_search_no_match(self, tmp_path: Path) -> None:
        pdf_path = _make_test_pdf(str(tmp_path), text="Hello world")
        scraper = pdf_scraper.PdfScraper(cache_dir=tmp_path)
        hits = scraper.search(pdf_path, ["nonexistent"])
        assert hits == []

    def test_extract_sections(self, tmp_path: Path) -> None:
        # Build a PDF with separate text blocks so PyMuPDF can distinguish them
        path = Path(tmp_path) / "sections.pdf"
        doc = fitz.open()
        page = doc.new_page()
        y = 50
        for block in [
            "Introduction",
            "This is the intro.",
            "Data Section",
            "Row one data.",
            "Row two data.",
            "End Section",
            "This is the end.",
        ]:
            rect = fitz.Rect(50, y, 400, y + 25)
            page.insert_textbox(rect, block, fontsize=12)
            y += 30
        doc.save(str(path))
        doc.close()

        scraper = pdf_scraper.PdfScraper(cache_dir=tmp_path)
        sections = scraper.extract_sections(
            path,
            section_headers=["Data Section"],
            end_markers=["End Section"],
        )
        assert "Data Section" in sections
        assert "Row one data" in sections["Data Section"]
        assert "End Section" not in sections["Data Section"]

    def test_extract_tables(self, tmp_path: Path) -> None:
        tables = [
            ["Country", "Code"],
            ["United States", "1"],
            ["United Kingdom", "44"],
        ]
        pdf_path = _make_test_pdf(str(tmp_path), tables=tables)
        scraper = pdf_scraper.PdfScraper(cache_dir=tmp_path)
        extracted = scraper.extract_tables(pdf_path)
        assert len(extracted) == 1  # one page
        page_tables = extracted[0]
        assert len(page_tables) >= 1
        # First table should contain our data
        first_table = page_tables[0]
        assert any("United States" in str(cell) for row in first_table for cell in row)

    def test_extract_links(self, tmp_path: Path) -> None:
        path = Path(tmp_path) / "link_test.pdf"
        doc = fitz.open()
        page = doc.new_page()
        rect = fitz.Rect(50, 50, 300, 80)
        page.insert_textbox(rect, "Click here", fontsize=12)
        page.insert_link({
            "kind": fitz.LINK_URI,
            "from": rect,
            "uri": "https://example.com/test",
        })
        doc.save(str(path))
        doc.close()

        scraper = pdf_scraper.PdfScraper(cache_dir=tmp_path)
        links = scraper.extract_links(path)
        assert len(links) == 1
        assert links[0]["url"] == "https://example.com/test"
        assert links[0]["page"] == 1

    def test_scrape_one_shot(self, tmp_path: Path) -> None:
        pdf_path = _make_test_pdf(
            str(tmp_path),
            text="Alpha\nBeta\nGamma",
            tables=[["A", "B"], ["1", "2"]],
        )
        # Manually copy into cache so scrape can "download" it
        scraper = pdf_scraper.PdfScraper(cache_dir=tmp_path)
        # Simulate download by copying the file to the expected cache location
        cached = scraper.cache_dir / (_safe_filename("https://example.com/test.pdf") + ".pdf")
        cached.write_bytes(pdf_path.read_bytes())

        result = scraper.scrape(
            "https://example.com/test.pdf",
            keywords=["Beta"],
            extract_tables=True,
            extract_links=True,
        )
        assert result["page_count"] == 1
        assert "Beta" in result["text_by_page"][0]
        assert len(result["search_hits"]) >= 1
        assert result["search_hits"][0]["keyword"] == "Beta"
        assert "tables" in result
        assert "links" in result


class TestDomainSpecificExtractors:
    """Tests for ITU E.164 and other standards-body extractors."""

    def test_extract_phone_from_itu_e164_mock(self, tmp_path: Path) -> None:
        """Test ITU E.164 extractor with a synthetic table."""
        tables = [
            ["Country or area", "Country Code", "Note"],
            ["United States", "1", "NPA-NXX"],
            ["India", "91", ""],
            ["United Kingdom", "44", ""],
        ]
        pdf_path = _make_test_pdf(str(tmp_path), tables=tables)
        scraper = pdf_scraper.PdfScraper(cache_dir=tmp_path)

        # Monkey-patch the download to return our mock PDF
        original_download = scraper.download
        def _mock_download(url, **kwargs):
            cached = scraper.cache_dir / (_safe_filename(url) + ".pdf")
            cached.write_bytes(pdf_path.read_bytes())
            return cached
        scraper.download = _mock_download

        rows = pdf_scraper.extract_phone_from_itu_e164(scraper)
        assert len(rows) == 3
        codes = {r["calling_code"] for r in rows}
        assert "+1" in codes
        assert "+91" in codes
        assert "+44" in codes

    def test_extract_postal_from_upu_warns(self) -> None:
        """UPU extractor should warn and return empty (auth required)."""
        rows = pdf_scraper.extract_postal_from_upu()
        assert rows == []


# ── Helper to mirror internal function ──────────────────────────────────────

def _safe_filename(url: str) -> str:
    return __import__("re").sub(r"[^a-zA-Z0-9_.-]", "_", url.split("://")[-1])[:128]
