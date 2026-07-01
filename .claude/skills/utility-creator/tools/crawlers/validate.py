#!/usr/bin/env python3
"""
i18nify pipeline status and staleness checker.

Usage:
  python .claude/skills/utility-creator/tools/crawlers/validate.py --status               # table of all topics
  python .claude/skills/utility-creator/tools/crawlers/validate.py --check-age currency   # FRESH or STALE
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

SCRIPT_PATH = Path(__file__).resolve()


def _find_project_root(start: Path) -> Path:
    for path in (start, *start.parents):
        if (path / "package.json").exists() and (path / "i18nify-data").exists():
            return path
    raise RuntimeError(f"Could not find i18nify project root from {start}")


REPO_ROOT = _find_project_root(SCRIPT_PATH)

# Canonical output paths (mirrors DATA_PATH_MAP in .claude/skills/utility-creator/i18nify_schemas.py)
CANONICAL_PATH: dict[str, str] = {
    "currency":       "i18nify-data/currency/data.json",
    "country":        "i18nify-data/country/metadata/data.json",
    "tld":            "i18nify-data/tld/data.json",
    "http_status":    "i18nify-data/http-status/data.json",
    "language":       "i18nify-data/language/data.json",
    "phone":          "i18nify-data/phone-number/data.json",
    "timezone":       "i18nify-data/timezone/data.json",
    "mime":           "i18nify-data/media/data.json",
    "unicode_blocks": "i18nify-data/unicode-blocks/data.json",
    "address":        "i18nify-data/address/data.json",
    "gst":            "i18nify-data/gst/data.json",
    "gst_au":         "i18nify-data/gst-australia/data.json",
    "eu_vat":         "i18nify-data/vat/data.json",
    "population":     "i18nify-data/population/data.json",
}

# Root data key for each topic (to count entries)
DATA_KEY: dict[str, str] = {
    "currency":       "currency_information",
    "country":        "country_information",
    "tld":            "tld_information",
    "http_status":    "http_status_information",
    "language":       "language_information",
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

# Topic TTL in days (mirrors SKILL.md Section 5)
TTL_DAYS: dict[str, int] = {
    "currency":       30,
    "country":        30,
    "tld":            7,
    "http_status":    7,
    "language":       30,
    "phone":          30,
    "timezone":       7,
    "mime":           30,
    "unicode_blocks": 30,
    "address":        30,
    "gst":            30,
    "gst_au":         30,
    "eu_vat":         30,
    "population":     365,
}

ALL_TOPICS = list(TTL_DAYS.keys())


def _canonical_file(topic: str) -> Path:
    return REPO_ROOT / CANONICAL_PATH[topic]


def _file_age_days(path: Path) -> float:
    """Return age in days derived from file mtime, or inf if file absent."""
    if not path.exists():
        return float("inf")
    mtime = os.path.getmtime(path)
    return (datetime.now(timezone.utc).timestamp() - mtime) / 86400


def _entry_count(path: Path, data_key: str) -> int:
    """Count entries in the canonical data.json, or return 0 on any error."""
    try:
        with open(path) as f:
            return len(json.load(f).get(data_key, {}))
    except Exception:
        return 0


def check_age(topic: str) -> str:
    """Return 'FRESH' or 'STALE' for a single topic."""
    age = _file_age_days(_canonical_file(topic))
    ttl = TTL_DAYS.get(topic, 30)
    if age == float("inf"):
        return "STALE"
    return "FRESH" if age <= ttl else "STALE"


def print_status() -> None:
    """Print a status table for all topics."""
    col_w = [20, 8, 10, 10, 8]
    header = f"{'Topic':<{col_w[0]}} {'Count':>{col_w[1]}} {'Age (d)':>{col_w[2]}} {'TTL (d)':>{col_w[1]}} {'Status':<{col_w[4]}}"
    sep    = "-" * (sum(col_w) + len(col_w))
    print(header)
    print(sep)

    fresh_count = stale_count = missing_count = 0
    stale_topics: list[str] = []

    for topic in ALL_TOPICS:
        ttl  = TTL_DAYS[topic]
        path = _canonical_file(topic)
        age  = _file_age_days(path)

        if age == float("inf"):
            print(f"{topic:<{col_w[0]}} {'—':>{col_w[1]}} {'—':>{col_w[2]}} {ttl:>{col_w[1]}} MISSING")
            missing_count += 1
            stale_topics.append(topic)
            continue

        count  = _entry_count(path, DATA_KEY[topic])
        fresh  = age <= ttl
        age_str    = f"{age:.1f}"
        status_str = "FRESH" if fresh else "STALE"

        print(f"{topic:<{col_w[0]}} {count:>{col_w[1]}} {age_str:>{col_w[2]}} {ttl:>{col_w[1]}} {status_str}")
        if fresh:
            fresh_count += 1
        else:
            stale_count += 1
            stale_topics.append(topic)

    print(sep)
    print(f"Fresh: {fresh_count}  Stale: {stale_count}  Missing: {missing_count}")

    if stale_topics:
        print("\nTo refresh stale/missing topics:")
        for t in stale_topics:
            print(f"  /fetch-data {t}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="i18nify pipeline status checker")
    group  = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--status",     action="store_true",
                       help="Show status table for all topics")
    group.add_argument("--check-age",  metavar="TOPIC",
                       help="Print FRESH or STALE for the given topic")
    args = parser.parse_args()

    if args.status:
        print_status()
    else:
        result = check_age(args.check_age)
        print(result)
        sys.exit(0 if result == "FRESH" else 1)
