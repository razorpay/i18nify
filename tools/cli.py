#!/usr/bin/env python3
"""i18nify pipeline CLI — interactive triage menu.

Separates the Manager (this file) from the Workhorse (crawl4ai_runner.py).
Run with:
    python tools/cli.py
"""
from __future__ import annotations

import inspect
import json
import os
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
RUNNER    = REPO_ROOT / "tools" / "crawlers" / "crawl4ai_runner.py"
VENV_PY   = REPO_ROOT / "venv" / "bin" / "python"
PYTHON    = str(VENV_PY) if VENV_PY.exists() else sys.executable

# ── Topic registry (Manager-owned; mirrors SOURCE_URLS in crawl4ai_runner.py) ─

TOPICS: dict[str, dict] = {
    "currency":       {"desc": "ISO 4217 currency codes",              "source": "SIX Group XML"},
    "country":        {"desc": "ISO 3166-1 country codes",             "source": "ISO OBP SPA"},
    "tld":            {"desc": "IANA top-level domains",               "source": "IANA TLD list"},
    "http_status":    {"desc": "HTTP status codes",                    "source": "IANA HTTP registry"},
    "language":       {"desc": "ISO 639 language codes (CLDR)",        "source": "Unicode CLDR territoryInfo"},
    "phone":          {"desc": "Phone calling codes (E.164)",          "source": "Google libphonenumber XML"},
    "timezone":       {"desc": "IANA timezone identifiers",            "source": "IANA zone1970.tab"},
    "mime":           {"desc": "IANA media / MIME types",              "source": "IANA media-types XML"},
    "unicode_blocks": {"desc": "Unicode block ranges",                 "source": "Unicode Blocks.txt"},
    "address":        {"desc": "Postal address formats per country",   "source": "Google i18n address data"},
    "gst":            {"desc": "India GST rates by HSN chapter",       "source": "CBIC chapter-wise PDF"},
    "gst_au":         {"desc": "Australia GST supply classifications", "source": "ATO ato.gov.au"},
}

# ── Schema map (Manager-owned; mirrors SCHEMA_MAP in i18nify_schemas.py) ──────

SCHEMA_CLASS_NAMES: dict[str, str] = {
    "currency":       "Currency",
    "country":        "Country",
    "tld":            "TLD",
    "http_status":    "HttpStatus",
    "language":       "Language",
    "phone":          "PhoneCode",
    "timezone":       "Timezone",
    "mime":           "MimeType",
    "unicode_blocks": "UnicodeBlock",
    "address":        "AddressFormat",
    "gst":            "GstRate",
    "gst_au":         "GstRateAustralia",
}

# ── Canonical data path map ───────────────────────────────────────────────────

DATA_PATH: dict[str, str] = {
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
}

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
}

TTL_DAYS: dict[str, int] = {
    "currency": 30, "country": 30, "tld": 7, "http_status": 7,
    "language": 30, "phone": 30, "timezone": 7, "mime": 30,
    "unicode_blocks": 30, "address": 30, "gst": 30, "gst_au": 30,
}


# ── Helpers ───────────────────────────────────────────────────────────────────

def _cyan(s: str) -> str:
    return f"\033[96m{s}\033[0m"

def _green(s: str) -> str:
    return f"\033[92m{s}\033[0m"

def _yellow(s: str) -> str:
    return f"\033[93m{s}\033[0m"

def _bold(s: str) -> str:
    return f"\033[1m{s}\033[0m"

def _data_age(topic: str) -> str:
    path = REPO_ROOT / DATA_PATH.get(topic, "")
    if not path.exists():
        return _yellow("MISSING")
    age_d = (datetime.now(timezone.utc).timestamp() - os.path.getmtime(path)) / 86400
    ttl = TTL_DAYS.get(topic, 30)
    if age_d <= ttl:
        return _green(f"FRESH ({age_d:.1f}d old)")
    return _yellow(f"STALE ({age_d:.1f}d old, TTL={ttl}d)")


# ── Step 1: topic selection ───────────────────────────────────────────────────

def ask_topic() -> str:
    print(_bold("\nAvailable topics:"))
    print(f"  {'#':<4} {'Topic':<16} {'Description':<44} {'Data status'}")
    print("  " + "─" * 82)
    topic_list = list(TOPICS.keys())
    for idx, t in enumerate(topic_list, 1):
        info = TOPICS[t]
        status = _data_age(t)
        print(f"  {idx:<4} {t:<16} {info['desc']:<44} {status}")
    print()

    while True:
        raw = input("Enter topic name or number: ").strip()
        if raw.isdigit():
            n = int(raw)
            if 1 <= n <= len(topic_list):
                return topic_list[n - 1]
        elif raw in TOPICS:
            return raw
        print(f"  Not recognised. Enter a number (1–{len(topic_list)}) or a topic name.")


# ── Step 2: action selection ──────────────────────────────────────────────────

def ask_action(topic: str) -> str:
    info = TOPICS[topic]
    print(_bold(f"\nTopic: {topic}"))
    print(f"  Source : {info['source']}")
    print(f"  Data   : {_data_age(topic)}")
    print()
    print("  [1] Fetch data            — download from T1 source, validate, write data.json")
    print("  [2] Show Pydantic schema  — display the schema class used for this topic")
    print("  [3] Generate utility      — scaffold JS + Go utility files from existing data")
    print("  [q] Quit")
    print()

    while True:
        choice = input("Choose [1/2/3/q]: ").strip().lower()
        if choice in ("1", "2", "3", "q"):
            return choice
        print("  Enter 1, 2, 3, or q.")


# ── Action 1: fetch data ──────────────────────────────────────────────────────

def fetch_data(topic: str) -> None:
    print(f"\n  Running pipeline for {_cyan(topic)} …\n")
    proc = subprocess.run(
        [PYTHON, str(RUNNER), "--topic", topic],
        cwd=str(REPO_ROOT),
    )
    if proc.returncode != 0:
        print(f"\n  {_yellow('Pipeline exited with errors. Check output above.')}")
    else:
        print(f"\n  {_green('Done.')} Data written to {DATA_PATH.get(topic, '?')}")


# ── Action 2: show schema ─────────────────────────────────────────────────────

def show_schema(topic: str) -> None:
    schemas_path = REPO_ROOT / "schemas" / "i18nify_schemas.py"
    sys.path.insert(0, str(REPO_ROOT / "schemas"))
    try:
        import importlib
        mod = importlib.import_module("i18nify_schemas")
        class_name = SCHEMA_CLASS_NAMES.get(topic)
        if not class_name:
            print(f"  No schema mapped for topic '{topic}'.")
            return
        cls = getattr(mod, class_name, None)
        if cls is None:
            print(f"  Class '{class_name}' not found in {schemas_path}.")
            return
        print(f"\n  {_bold(f'Pydantic schema: {class_name}')}  (from schemas/i18nify_schemas.py)\n")
        src = inspect.getsource(cls)
        for line in src.splitlines():
            print(f"    {line}")
        print()
        # Show a sample row from the canonical file if it exists
        data_file = REPO_ROOT / DATA_PATH.get(topic, "")
        if data_file.exists():
            with open(data_file) as f:
                canon = json.load(f)
            key = DATA_KEY.get(topic, "")
            entries = canon.get(key, {})
            if entries:
                sample_key, sample_val = next(iter(entries.items()))
                print(f"  {_bold('Sample entry')} (key={sample_key!r}):")
                for k, v in sample_val.items():
                    print(f"    {k}: {v!r}")
                print()
    except ImportError as e:
        print(f"  Could not import schemas module: {e}")
    finally:
        sys.path.pop(0)


# ── Action 3: generate utility ────────────────────────────────────────────────

def generate_utility(topic: str) -> None:
    data_file = REPO_ROOT / DATA_PATH.get(topic, "")

    # Ensure data is available — offer to fetch if missing or stale
    if not data_file.exists():
        print(f"\n  {_yellow('No data found for')} {topic}.")
        run_first = input("  Fetch data now before generating? [y/N]: ").strip().lower()
        if run_first == "y":
            fetch_data(topic)
        else:
            print("  Skipping utility generation — no data available.")
            return
    else:
        age_d = (datetime.now(timezone.utc).timestamp() - os.path.getmtime(data_file)) / 86400
        ttl = TTL_DAYS.get(topic, 30)
        if age_d > ttl:
            print(f"\n  {_yellow('Data is stale')} ({age_d:.1f}d old, TTL={ttl}d).")
            refresh = input("  Re-fetch before generating? [y/N]: ").strip().lower()
            if refresh == "y":
                fetch_data(topic)

    # Load canonical data
    if not data_file.exists():
        print(f"  Data file still missing after fetch attempt. Cannot generate.")
        return

    with open(data_file) as f:
        canon = json.load(f)

    key = DATA_KEY.get(topic, "")
    data_dict = canon.get(key, {})
    if not data_dict:
        print(f"  Data key '{key}' not found in {data_file}. Cannot generate.")
        return

    rows = [{"code": k, **v} for k, v in data_dict.items()]
    print(f"\n  {_green(str(len(rows)))} entries loaded from {data_file.relative_to(REPO_ROOT)}")

    # Build a minimal tsf_result.json so Recipe 8 (from SKILL.md) can consume it
    result = {
        "topic": _tsf_topic_key(topic),
        "winner": {
            "name":       TOPICS[topic]["source"],
            "url":        "",
            "tier":       1,
            "score":      88,
            "rows":       rows,
            "columns":    list(rows[0].keys()) if rows else [],
            "factors":    {},
        },
        "conflict_count": 0,
        "from_cache": True,
    }
    tmp = Path(tempfile.gettempdir()) / "tsf_result.json"
    with open(tmp, "w") as f:
        json.dump(result, f, ensure_ascii=False)
    print(f"  Wrote {tmp} ({len(rows)} rows).")

    print(f"\n  {_bold('Utility generation requires the TSF skill.')}")
    print("  Run in Claude Code:")
    print(f"    /technical-source-finder {_cyan(TOPICS[topic]['desc'])}")
    print("  Then type: generate utility")
    print()
    print("  Or to run Recipe 8 directly, paste this in your terminal:")
    gen_cmd = "source venv/bin/activate && python3 tools/generate_utility.py"
    print(f"    {_cyan(gen_cmd)}")
    print()


def _tsf_topic_key(topic: str) -> str:
    """Map workhorse topic name → TSF canonical topic key."""
    return {
        "currency":       "currency_codes",
        "country":        "country_codes",
        "tld":            "tld_list",
        "http_status":    "http_status_codes",
        "language":       "language_codes",
        "phone":          "phone_calling_codes",
        "timezone":       "timezones",
        "mime":           "mime_types",
        "unicode_blocks": "unicode_blocks",
        "address":        "address_formats",
        "gst":            "gst_rates_india",
        "gst_au":         "gst_rates_australia",
    }.get(topic, topic)


# ── Entry point ───────────────────────────────────────────────────────────────

def main() -> None:
    print(_bold("\n╔══════════════════════════════════╗"))
    print(_bold("║   i18nify Data Pipeline CLI      ║"))
    print(_bold("╚══════════════════════════════════╝"))

    topic  = ask_topic()
    action = ask_action(topic)

    if action == "1":
        fetch_data(topic)
    elif action == "2":
        show_schema(topic)
    elif action == "3":
        generate_utility(topic)
    else:
        print("  Bye.")


if __name__ == "__main__":
    main()
