# utility-creator — Execution Recipes

This file is a supplement to the root [`SKILL.md`](../SKILL.md).
It contains Section 2-C (all numbered Recipes), Section 12 (i18nify Utility Generation), and Section 13 (Handling Unknown Topics).

---

## Section 2-C — Concrete execution recipes

**These Recipes are the ONLY permitted method for data retrieval in this skill.**
**Do not write curl, wget, or requests code outside these Recipes.**
**Do not explore repos, read source files, or use web_fetch/web_search to retrieve data.**
**Copy each Recipe block exactly into bash_tool. Substitute only the {PLACEHOLDER} values.**

Recipe execution order is enforced by Section 6. Never run a Recipe out of order.

---

---

### Recipe 0 — Setup (run once per session before anything else)

```bash
pip3 install requests pyyaml lxml -q 2>&1 | tail -3
```

---

### Recipe 1 — Check local canonical cache, then remote manifest

Run this at Step 3. Checks `i18nify-data/{topic}/data.json` (the canonical
output written by `crawl4ai_runner.py`) on the local filesystem first. Falls
back to the remote GitHub manifest only when no local file exists.

Uses `os.path.getmtime()` on the canonical file for cache-age calculation — no
metadata block required.

Replace `{TOPIC_KEY}` with the resolved topic key from Step 1.
Replace `{PREFETCH_REPO}` and `{PREFETCH_BRANCH}` with configured values.

```bash
python3 << 'EOF'
import os, sys, urllib.request, json
from datetime import datetime, timezone

topic = "{TOPIC_KEY}"

# Map TSF topic keys → canonical i18nify-data file paths (mirrors DATA_PATH_MAP in schemas)
# NOTE: these files only exist after crawl4ai_runner.py has fetched + validated the topic
# at least once. If missing, Recipe 1 returns CACHE_MISS and Recipe 3 fetches + writes them.
# Verified present (as of last pipeline run): tld_list, http_status_codes, language_codes,
#   phone_calling_codes, unicode_blocks, address_formats.
# Not yet fetched (will CACHE_MISS → Recipe 3): currency_codes, country_codes, timezones,
#   mime_types, gst_rates_india.
CANONICAL_PATH = {
    "currency_codes":      "i18nify-data/currency/data.json",
    "country_codes":       "i18nify-data/country/metadata/data.json",
    "tld_list":            "i18nify-data/tld/data.json",
    "http_status_codes":   "i18nify-data/http-status/data.json",
    "language_codes":      "i18nify-data/language/data.json",
    "phone_calling_codes": "i18nify-data/phone-number/data.json",
    "timezones":           "i18nify-data/timezone/data.json",
    "mime_types":          "i18nify-data/media/data.json",
    "unicode_blocks":      "i18nify-data/unicode-blocks/data.json",
    "address_formats":     "i18nify-data/address/data.json",
    "gst_rates_india":     "i18nify-data/gst/data.json",
    "population_data":     "i18nify-data/population/data.json",
    "corporate_tax_rates": "i18nify-data/corporate-tax/data.json",
    "vat_rates_global":    "i18nify-data/vat-global/data.json",
}

ttl_map = {
    "currency_codes":30,"country_codes":30,"address_formats":30,
    "tld_list":7,"language_codes":30,"http_status_codes":7,
    "phone_calling_codes":30,"timezones":7,"mime_types":30,
    "unicode_blocks":30,"gst_rates_india":30,"population_data":365,
    "corporate_tax_rates":30,
    "vat_rates_global":365,
}
ttl = ttl_map.get(topic, 30)

# 1. Check local canonical file first (age derived from mtime)
local_path = CANONICAL_PATH.get(topic)
if local_path and os.path.exists(local_path):
    try:
        mtime = os.path.getmtime(local_path)
        age_days = (datetime.now(timezone.utc).timestamp() - mtime) / 86400
        if age_days <= ttl:
            print(f"CACHE_HIT|LOCAL:{local_path}|{age_days:.1f}|{ttl}")
        else:
            print(f"CACHE_STALE|{age_days:.1f}|{ttl}")
        sys.exit(0)
    except Exception:
        pass  # cannot stat file → fall through to remote

# 2. Fallback: remote GitHub manifest
url = "https://raw.githubusercontent.com/{PREFETCH_REPO}/{PREFETCH_BRANCH}/data/manifest.json"
try:
    with urllib.request.urlopen(url, timeout=5) as r:
        manifest = json.loads(r.read())
    entry = manifest.get("topics", {}).get(topic)
    if not entry or not entry.get("ok"):
        print("CACHE_MISS")
        sys.exit(0)
    generated = datetime.fromisoformat(manifest["generated"])
    age_days = (datetime.now(timezone.utc) - generated).total_seconds() / 86400
    if age_days <= ttl:
        print(f"CACHE_HIT|REMOTE:{entry['raw_url']}|{age_days:.1f}|{ttl}")
    else:
        print(f"CACHE_STALE|{age_days:.1f}|{ttl}")
except Exception as e:
    print(f"CACHE_ERROR|{e}")
EOF
```

**Parse the output:**
- `CACHE_HIT|LOCAL:{path}|{age}|{ttl}` → proceed to Recipe 2 with that path
- `CACHE_HIT|REMOTE:{url}|{age}|{ttl}` → proceed to Recipe 2 with that URL
- `CACHE_STALE|...` → proceed to Recipe 3 (crawl4ai runner)
- `CACHE_MISS` → proceed to Recipe 3 (crawl4ai runner)
- `CACHE_ERROR|...` → proceed to Recipe 3 (crawl4ai runner), do not surface error to user

---

### Recipe 2 — Load data from cache (local canonical or remote envelope)

Run this when Recipe 1 returns `CACHE_HIT`. The `{CACHE_ENVELOPE_URL}` value
is the second pipe-delimited field from the `CACHE_HIT` line — it starts with
either `LOCAL:` (canonical `i18nify-data/…/data.json`) or `REMOTE:` (GitHub
envelope URL).

Local canonical files are written by `crawl4ai_runner.py` and have the
structure `{data_key: {id: {...}, ...}}`. This recipe loads them, reconstructs
a flat row list (`cc` key added back), derives `fetched_at` from mtime, and
wraps everything into the `sources` envelope that Recipe 5 expects.

```bash
python3 << 'EOF'
import urllib.request, json, sys, os
from datetime import datetime, timezone

hit_path = "{CACHE_ENVELOPE_URL}"   # from Recipe 1 CACHE_HIT output

# Maps canonical file path → root data_key (mirrors DATA_KEY_MAP in schemas)
PATH_DATA_KEY = {
    "i18nify-data/currency/data.json":          "currency_information",
    "i18nify-data/country/metadata/data.json":  "country_information",
    "i18nify-data/tld/data.json":               "tld_information",
    "i18nify-data/http-status/data.json":       "http_status_information",
    "i18nify-data/language/data.json":          "language_information",
    "i18nify-data/phone-number/data.json":      "country_tele_information",
    "i18nify-data/timezone/data.json":          "timezone_information",
    "i18nify-data/media/data.json":             "mime_type_information",
    "i18nify-data/unicode-blocks/data.json":    "unicode_block_information",
    "i18nify-data/address/data.json":           "address_format_information",
    "i18nify-data/population/data.json":        "population_information",
    "i18nify-data/vat-global/data.json":        "vat_global_information",
}

# Maps canonical file path → T1 source URL for display in the widget
PATH_SOURCE_URL = {
    "i18nify-data/currency/data.json":          "https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml",
    "i18nify-data/country/metadata/data.json":  "https://www.iso.org/obp/ui/#search/code/",
    "i18nify-data/tld/data.json":               "https://data.iana.org/TLD/tlds-alpha-by-domain.txt",
    "i18nify-data/http-status/data.json":       "https://www.iana.org/assignments/http-status-codes/http-status-codes.xml",
    "i18nify-data/language/data.json":          "https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-core/supplemental/territoryInfo.json",
    "i18nify-data/phone-number/data.json":      "https://raw.githubusercontent.com/google/libphonenumber/master/resources/PhoneNumberMetadata.xml",
    "i18nify-data/timezone/data.json":          "https://raw.githubusercontent.com/eggert/tz/main/zone1970.tab",
    "i18nify-data/media/data.json":             "https://www.iana.org/assignments/media-types/media-types.xml",
    "i18nify-data/unicode-blocks/data.json":    "https://www.unicode.org/Public/UNIDATA/Blocks.txt",
    "i18nify-data/address/data.json":           "https://chromium-i18n.appspot.com/ssl-address/data",
    "i18nify-data/population/data.json":        "https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&mrv=1&per_page=300",
    "i18nify-data/vat-global/data.json":        "https://www.oecd.org/en/topics/sub-issues/tax-policy/tax-database.html",
}

try:
    if hit_path.startswith("LOCAL:"):
        file_path = hit_path[len("LOCAL:"):]
        # Derive fetched_at from file mtime (canonical files have no meta block)
        mtime = os.path.getmtime(file_path)
        fetched_at = datetime.fromtimestamp(mtime, tz=timezone.utc).isoformat()

        data_key   = PATH_DATA_KEY.get(file_path, "")
        source_url = PATH_SOURCE_URL.get(file_path, "local")

        with open(file_path) as f:
            canonical = json.load(f)

        # canonical structure: {data_key: {id: {...}, ...}}
        data_dict = canonical.get(data_key) if data_key else None
        if not data_dict:
            # fallback: use first top-level value
            data_dict = next(iter(canonical.values()), {})

        # Reconstruct flat row list with the dict key added back as "cc"
        data = [{"cc": k, **v} for k, v in data_dict.items()] if isinstance(data_dict, dict) else []

        envelope = {
            "sources": [{
                "meta": {
                    "tier":        1,
                    "source_name": source_url,
                    "url_used":    source_url,
                    "fetched_at":  fetched_at,
                    "via_github":  False,
                },
                "data": data,
            }]
        }
    else:
        url = hit_path[len("REMOTE:"):] if hit_path.startswith("REMOTE:") else hit_path
        with urllib.request.urlopen(url, timeout=10) as r:
            envelope = json.loads(r.read())

    # Emit compact summary for scoring
    for i, src in enumerate(envelope.get("sources", [])):
        m = src["meta"]
        print(f"SOURCE|{i}|tier={m['tier']}|name={m['source_name']}"
              f"|url={m['url_used']}|fetched={m['fetched_at']}"
              f"|via_github={m['via_github']}")

    # Write normalised envelope for Recipe 5
    with open("/tmp/tsf_cache_data.json", "w") as f:
        json.dump(envelope, f, ensure_ascii=False)
    print("ENVELOPE_OK")
except Exception as e:
    print(f"ENVELOPE_ERROR|{e}")
EOF
```

**Parse the output:**
- Lines starting with `SOURCE|` → extract tier, name, url, fetched_at for scoring
- `ENVELOPE_OK` → proceed to Recipe 5 using `/tmp/tsf_cache_data.json`
- `ENVELOPE_ERROR|...` → fall through to Recipe 3 (crawl4ai runner)

---

### Recipe 3 — Crawl4AI pipeline runner

Run this when Recipe 1 returns CACHE_STALE, CACHE_MISS, or CACHE_ERROR.
Delegates to `tools/crawlers/crawl4ai_runner.py` which fetches from T1
canonical sources, validates against Pydantic schemas, and writes the
canonical output to `i18nify-data/{topic}/data.json`.

On success the cache is immediately populated, so a re-run of Recipe 1 will
return `CACHE_HIT|LOCAL:...` — no separate parse step required.

Replace `{TOPIC_KEY}` with the resolved topic key from Step 1.

```bash
python3 << 'EOF'
import subprocess, sys, os

# Map TSF topic keys → crawl4ai_runner --topic argument
PIPELINE_NAME = {
    "currency_codes":      "currency",
    "country_codes":       "country",
    "tld_list":            "tld",
    "http_status_codes":   "http_status",
    "language_codes":      "language",
    "phone_calling_codes": "phone",
    "timezones":           "timezone",
    "mime_types":          "mime",
    "unicode_blocks":      "unicode_blocks",
    "address_formats":     "address",
    "gst_rates_india":     "gst",
    "population_data":     "population",
    "corporate_tax_rates": "corporate_tax",
    "vat_rates_global":    "vat_global",
}

tsf_topic     = "{TOPIC_KEY}"
pipeline_topic = PIPELINE_NAME.get(tsf_topic)

if not pipeline_topic:
    print(f"RUNNER_ERROR|no pipeline mapping for TSF topic: {tsf_topic!r}")
    sys.exit(1)

# Resolve repo root so the runner's relative paths work correctly
root_result = subprocess.run(
    ["git", "rev-parse", "--show-toplevel"],
    capture_output=True, text=True,
)
repo_root = root_result.stdout.strip()
if not repo_root:
    print("RUNNER_ERROR|could not determine repo root via git")
    sys.exit(1)

runner   = os.path.join(repo_root, "tools", "crawlers", "crawl4ai_runner.py")
venv_py  = os.path.join(repo_root, "venv", "bin", "python")
python   = venv_py if os.path.exists(venv_py) else sys.executable

proc = subprocess.run(
    [python, runner, "--topic", pipeline_topic],
    cwd=repo_root,
    capture_output=True,
    text=True,
)

# Stream output for visibility
print(proc.stdout, end="")
if proc.stderr:
    print(proc.stderr, end="", file=sys.stderr)

if proc.returncode != 0 or "FETCH_ERROR" in proc.stdout or "PARSE_ERROR" in proc.stdout:
    print(f"RUNNER_FAILED|{pipeline_topic}|exit={proc.returncode}")
    sys.exit(1)

if "PARSE_OK" in proc.stdout:
    print(f"RUNNER_OK|{pipeline_topic}")
else:
    print(f"RUNNER_FAILED|{pipeline_topic}|no PARSE_OK in output")
    sys.exit(1)
EOF
```

**Parse the output:**
- `RUNNER_OK|{pipeline_topic}` → runner wrote `i18nify-data/{canonical_path}`; re-run Recipe 1 to get `CACHE_HIT|LOCAL`
- `RUNNER_FAILED|...` → runner could not fetch or validate; proceed to Section 8
- `RUNNER_ERROR|...` or non-zero exit or Traceback → follow Section 11 halt-and-display rules

---

### Recipe 4 — (removed)

Recipe 4 was a standalone live-fetch recipe that predated the `crawl4ai_runner.py` pipeline.
It was merged into Recipe 3. The numbering gap is preserved intentionally so that references
in commit history and issue comments remain valid. Recipe 3 now covers what both 3 and 4 did.

---

### Recipe 5 — Load and normalise cache envelope data

Run this after Recipe 2 succeeds (cache hit path). Normalises the cache envelope into `/tmp/tsf_parsed.json` for Recipe 6.

```bash
python3 << 'EOF'
import json

with open("/tmp/tsf_cache_data.json") as f:
    envelope = json.load(f)

parsed = []
for i, src in enumerate(envelope.get("sources", [])):
    m   = src["meta"]
    raw = src["data"]
    # data is already normalised by prefetch.py — wrap into common schema
    if isinstance(raw, list):
        cols = list(raw[0].keys()) if raw else []
        rows = raw
    elif isinstance(raw, dict):
        # e.g. CLDR names dict → flatten to rows
        rows = [{"code":k, **v} if isinstance(v,dict) else {"code":k,"value":v}
                for k,v in raw.items()]
        cols = list(rows[0].keys()) if rows else []
    else:
        rows, cols = [], []
    parsed.append({
        "tier":        m["tier"],
        "name":        m["source_name"],
        "url":         m["url_used"],
        "via_mirror":  m["via_github"],
        "fetched_at":  m["fetched_at"],
        "columns":     cols,
        "rows":        rows,
        "source_type": "prefetch_cache",
        "from_cache":  True,
    })
    print(f"CACHE_SRC_OK|{i}|tier={m['tier']}|rows={len(rows)}|name={m['source_name']}")

with open("/tmp/tsf_parsed.json","w") as f:
    json.dump(parsed, f, ensure_ascii=False)
print(f"CACHE_LOAD_DONE|{len(parsed)}")
EOF
```

---

### Recipe 6 — Conflict detection and score computation

Run this after Recipe 5. Works identically for live and cached data.

```bash
python3 << 'EOF'
import json, math
from datetime import datetime, timezone
from collections import defaultdict

with open("/tmp/tsf_parsed.json") as f:
    sources = json.load(f)

topic      = "{TOPIC_KEY}"
from_cache = any(s.get("from_cache") for s in sources)

# ── TTL and cache age ─────────────────────────────────────────────────────
TTL_DAYS = {"currency_codes":30,"country_codes":30,"address_formats":30,
            "tld_list":7,"language_codes":30,"http_status_codes":7,
            "phone_calling_codes":30,"timezones":7,"vat_rates_global":365}
topic_ttl = TTL_DAYS.get(topic, 30)

# ── Cache freshness factor ────────────────────────────────────────────────
cache_freshness = 1.0
if from_cache:
    fetched_ats = [s.get("fetched_at") for s in sources if s.get("fetched_at")]
    if fetched_ats:
        oldest = min(datetime.fromisoformat(t) for t in fetched_ats)
        age_d = (datetime.now(timezone.utc) - oldest).total_seconds() / 86400
        cache_freshness = max(0.5, 1.0 - (age_d / topic_ttl) * 0.5)
        # Mixed-age warning
        newest = max(datetime.fromisoformat(t) for t in fetched_ats)
        delta_d = (newest - oldest).total_seconds() / 86400
        if delta_d > 7:
            print(f"MIXED_AGE_WARNING|delta={delta_d:.1f}d")

# ── Conflict detection ────────────────────────────────────────────────────
# Build a key→field→{source_name: value} index
field_index = defaultdict(lambda: defaultdict(dict))
for src in sources:
    for row in src.get("rows", []):
        # Use first column as row key
        cols = src.get("columns", [])
        if not cols:
            continue
        row_key = str(row.get(cols[0], ""))
        for col in cols[1:]:
            val = str(row.get(col, "")).strip().lower()
            field_index[row_key][col][src["name"]] = val

conflicts = []
total_fields = 0
for row_key, fields in field_index.items():
    for field, src_vals in fields.items():
        total_fields += 1
        unique_vals = set(src_vals.values())
        if len(unique_vals) > 1:
            conflicts.append({"row":row_key,"field":field,"values":src_vals})

conflict_penalty = min(1.0, len(conflicts) / total_fields) if total_fields else 0

# ── Score per source ──────────────────────────────────────────────────────
EXPECTED = {"currency_codes":180,"country_codes":249,"address_formats":240,
            "tld_list":1500,"language_codes":184,"http_status_codes":60,
            "phone_calling_codes":240,"timezones":600,"population_data":217,
            "vat_rates_global":75}
expected = EXPECTED.get(topic, 100)
n = len(sources)

scored = []
for src in sources:
    tier_authority = 1.0 if src["tier"]==1 else (0.7 if not src.get("stale") else 0.5)
    multiplicity   = min(1.0, math.log2(n+1)/3)
    freshness      = cache_freshness if src.get("from_cache") else 0.97
    coverage       = min(1.0, len(src.get("rows",[])) / expected)
    recurrence     = 0.85 if src["tier"]==1 else 0.6
    independence   = 1.0
    base = (0.35*tier_authority + 0.15*multiplicity + 0.15*freshness
            + 0.15*coverage    + 0.10*recurrence   + 0.10*independence)
    score = round(100 * base * (1 - conflict_penalty))
    scored.append({**src, "score":score, "factors":{
        "tier_authority":tier_authority,"multiplicity":multiplicity,
        "freshness":freshness,"coverage":coverage,"recurrence":recurrence,
        "independence":independence,"conflict_penalty":conflict_penalty,
    }})

scored.sort(key=lambda s: -s["score"])
winner = scored[0] if scored else None

result = {
    "topic":          topic,
    "winner":         winner,
    "all_sources":    scored,
    "conflicts":      conflicts[:20],  # cap at 20 for widget
    "conflict_count": len(conflicts),
    "from_cache":     from_cache,
    "cache_freshness":cache_freshness,
}
with open("/tmp/tsf_result.json","w") as f:
    json.dump(result, f, ensure_ascii=False)

print(f"SCORE_DONE|winner={winner['name'] if winner else 'none'}"
      f"|score={winner['score'] if winner else 0}"
      f"|conflicts={len(conflicts)}"
      f"|from_cache={from_cache}")
EOF
```

**Parse the output:**
- `SCORE_DONE|winner=...|score=...|conflicts=...|from_cache=...`
- `MIXED_AGE_WARNING|delta=...` → add mixed-age warning to widget
- Full result is in `/tmp/tsf_result.json` — read this to build the widget

---

### Recipe 7 — Read final result for widget rendering

```bash
python3 -c "
import json
with open('/tmp/tsf_result.json') as f:
    r = json.load(f)
w = r['winner']
print(f\"topic={r['topic']}\")
print(f\"score={w['score']}\")
print(f\"tier={w['tier']}\")
print(f\"source_name={w['name']}\")
print(f\"source_url={w['url']}\")
print(f\"rows={len(w.get('rows',[]))}\")
print(f\"from_cache={r['from_cache']}\")
print(f\"conflict_count={r['conflict_count']}\")
"
```

---

### Recipe 8 — Generate i18nify utility files (utility generation path only)

**TRIGGER**: Run this recipe ONLY when the user explicitly asks to generate, scaffold, or create an i18nify utility/module for the resolved topic. Do NOT run on every invocation. Requires Recipe 7 to have already run (i.e. `/tmp/tsf_result.json` exists).

**STRICT OUTPUT CONSTRAINT**: This recipe writes all files directly to the filesystem. It must NOT echo or print raw code content to the terminal. Only `WROTE|{path}` status lines and the final `UTILITY_DONE|` line may appear in stdout.

Replace `{TOPIC_KEY}` (from Step 1) and `{PROJECT_ROOT}` (absolute path to repo root, determined from `git rev-parse --show-toplevel` or conversation context).

```bash
python3 << 'RECIPE8_EOF'
import json, os, sys, re

# ── Substitutions ─────────────────────────────────────────────────
TOPIC_KEY    = "{TOPIC_KEY}"      # from Step 1  e.g. "currency_codes"
PROJECT_ROOT = "{PROJECT_ROOT}"   # e.g. "/Users/me/i18nify"
# ─────────────────────────────────────────────────────────────────

# ── Topic → module naming map ─────────────────────────────────────
TOPIC_MAP = {
    # ALL topics use id_field="cc" (ISO 3166-1 alpha-2) as the root dict key.
    # crawl4ai_runner.py guarantees a "cc" field in every output row.
    "currency_codes":      {"snake": "currency",        "pascal": "Currency",        "data_key": "currency_information",          "id_field": "cc"},
    "country_codes":       {"snake": "country",         "pascal": "Country",         "data_key": "country_information",           "id_field": "cc"},
    "phone_calling_codes": {"snake": "phoneNumber",     "pascal": "PhoneNumber",     "data_key": "country_tele_information",      "id_field": "cc"},
    "language_codes":      {"snake": "language",        "pascal": "Language",        "data_key": "language_information",          "id_field": "cc"},
    "timezones":           {"snake": "timezone",        "pascal": "Timezone",        "data_key": "timezone_information",          "id_field": "cc"},
    "tld_list":            {"snake": "tld",             "pascal": "Tld",             "data_key": "tld_information",               "id_field": "cc"},
    "address_formats":     {"snake": "address",         "pascal": "Address",         "data_key": "address_format_information",    "id_field": "cc"},
    "country_metadata":    {"snake": "countryMetadata", "pascal": "CountryMetadata", "data_key": "country_metadata_information",  "id_field": "cc"},
    "gst_rates_india":     {"snake": "gst",             "pascal": "Gst",             "data_key": "gst_information",               "id_field": "code"},
    "population_data":     {"snake": "population",      "pascal": "Population",      "data_key": "population_information",        "id_field": "cc"},
    "corporate_tax_rates": {"snake": "corporateTax",    "pascal": "CorporateTax",    "data_key": "corporate_tax_information",     "id_field": "cc", "canonical_dir": "corporate-tax"},
    "vat_rates_global":    {"snake": "vatRates",        "pascal": "VatRates",        "data_key": "vat_global_information",        "id_field": "cc", "canonical_dir": "vat-global"},
}

cfg = TOPIC_MAP.get(TOPIC_KEY)
if not cfg:
    print(f"UTILITY_ERROR|unsupported topic '{TOPIC_KEY}' — add a mapping entry in Recipe 8 TOPIC_MAP")
    sys.exit(1)

snake         = cfg["snake"]                         # camelCase module name  e.g. "currency"
pascal        = cfg["pascal"]                        # PascalCase             e.g. "Currency"
data_key      = cfg["data_key"]                      # i18nify-data root key  e.g. "currency_information"
id_field      = cfg["id_field"]                      # row identifier field   e.g. "code"
canonical_dir = cfg.get("canonical_dir", snake)      # i18nify-data/ dir — defaults to snake when they match

# ── Load winner rows from Recipe 7 output ─────────────────────────
with open("/tmp/tsf_result.json") as f:
    result = json.load(f)
winner = result["winner"]
rows   = winner.get("rows", [])
if not rows:
    print("UTILITY_ERROR|winner has no rows — cannot generate data files")
    sys.exit(1)

# ── Build i18nify-data canonical dict (always keyed by ISO 3166-1 alpha-2 cc) ──
data_dict = {}
for row in rows:
    # "cc" is the universal country-code key guaranteed by crawl4ai_runner.py.
    # Fall back to id_field (also "cc") then first column value if somehow absent.
    key = row.get("cc") or row.get(id_field) or str(list(row.values())[0])
    # Exclude cc / id_field from the value dict to avoid redundancy.
    data_dict[key] = {k: v for k, v in row.items() if k not in {"cc", id_field}}

canonical_data = {
    "_source": {
        "topic": TOPIC_KEY,
        "name":  winner.get("name", ""),
        "url":   winner.get("url", ""),
        "tier":  winner.get("tier", 0),
    },
    data_key: data_dict,
}

# ── Derive proto schema recursively from data_dict ────────────────

def _to_pascal(s):
    """Convert snake_case or camelCase field name to PascalCase."""
    parts = re.split(r'[_\s]+', s)
    return ''.join(p.capitalize() for p in parts if p)

def _singularize(name):
    """Naive English singularization used for naming list-element messages."""
    if name.endswith('ies') and len(name) > 3:
        return name[:-3] + 'y'
    if name.endswith('ses') and len(name) > 4:
        return name[:-2]
    if name.endswith('es') and len(name) > 3:
        return name[:-2]
    if name.endswith('s') and len(name) > 1:
        return name[:-1]
    return name

def _py_to_proto_scalar(v):
    """Map a Python value to its proto3 scalar type keyword."""
    if isinstance(v, bool):
        return "bool"
    if isinstance(v, int):
        return "int32"
    if isinstance(v, float):
        return "double"
    return "string"

def _infer_representative(values):
    """Return first non-empty, non-None value from a list of samples."""
    for v in values:
        if v is not None and v != "" and v != [] and v != {}:
            return v
    return values[0] if values else None

def _collect_field_samples(entries):
    """
    Deep-union all fields across every entry. Collects all keys found in ANY
    entry, then for each key gathers all values across ALL entries (None for
    entries missing that key). This ensures fields sparse in the data are still
    typed correctly — a field present in 1 of 251 entries is not dropped.
    """
    # Pass 1: union of all keys in insertion order
    all_keys: dict = {}
    for entry in entries:
        if not isinstance(entry, dict):
            continue
        for k in entry:
            all_keys.setdefault(k, len(all_keys))

    # Pass 2: collect every value per key (None for absent entries)
    acc: dict = {k: [] for k in all_keys}
    for entry in entries:
        if not isinstance(entry, dict):
            continue
        for k in all_keys:
            acc[k].append(entry.get(k, None))

    return {k: _infer_representative(vs) for k, vs in acc.items()}

_proto_messages = []  # (msg_name, comment, field_lines) — deepest sub-messages first
_proto_seen = set()

def _generate_proto_message(msg_name, comment, field_samples):
    """
    Recursively walk field_samples and emit message definitions.
    - dict values          → named sub-message + singular field
    - list-of-dict values  → named sub-message + repeated field
    - list-of-scalar       → repeated <scalar_type> field
    - scalar               → <scalar_type> field
    Sub-messages are appended before the parent so proto file reads
    bottom-up (deepest first), which is valid in proto3.
    """
    if msg_name in _proto_seen:
        return
    _proto_seen.add(msg_name)

    field_lines = []
    for idx, (field_name, sample_val) in enumerate(field_samples.items(), start=1):
        safe = re.sub(r'[^a-zA-Z0-9_]', '_', field_name)

        if isinstance(sample_val, dict) and sample_val:
            # nested object → dedicated message
            nested_name = _to_pascal(field_name)
            nested_samples = _collect_field_samples([sample_val])
            _generate_proto_message(
                nested_name,
                f"// {nested_name} contains nested {field_name} attributes.",
                nested_samples,
            )
            field_lines.append(f"  {nested_name} {safe} = {idx};")

        elif isinstance(sample_val, list) and sample_val:
            first = sample_val[0]
            if isinstance(first, dict) and first:
                # list of objects → dedicated message + repeated field
                item_name = _to_pascal(_singularize(field_name))
                item_samples = _collect_field_samples(sample_val)
                _generate_proto_message(
                    item_name,
                    f"// {item_name} represents a single item in the {field_name} list.",
                    item_samples,
                )
                field_lines.append(f"  repeated {item_name} {safe} = {idx};")
            else:
                # list of scalars
                field_lines.append(
                    f"  repeated {_py_to_proto_scalar(first)} {safe} = {idx};"
                )

        else:
            field_lines.append(f"  {_py_to_proto_scalar(sample_val)} {safe} = {idx};")

    _proto_messages.append((msg_name, comment, field_lines))

# Deep-union samples across all entries.
# enrich_row() in crawl4ai_runner.py guarantees country_name and all standard fields
# are already present in the canonical data — no sentinel overlay required.
_collected = _collect_field_samples(list(data_dict.values()))
_generate_proto_message(
    f"{pascal}Info",
    f"// {pascal}Info holds all fields for a single {snake} entry, keyed by country code.",
    _collected,
)

# Assemble final .proto: header + root Data message + all generated messages
_proto_parts = [
    f'syntax = "proto3";',
    f'package {snake};',
    f'option go_package = "github.com/razorpay/i18nify/i18nify-data/go/{snake};{snake}";',
    "",
    f"// {pascal}Data is the root message.",
    f"// The map key is the ISO 3166-1 alpha-2 country code.",
    f"message {pascal}Data {{",
    f"  map<string, {pascal}Info> {data_key} = 1;",
    f"}}",
]
for _msg_name, _comment, _flines in _proto_messages:
    _proto_parts.append("")
    _proto_parts.append(_comment)
    _proto_parts.append(f"message {_msg_name} {{")
    _proto_parts.extend(_flines)
    _proto_parts.append("}")

f_proto = "\n".join(_proto_parts) + "\n"

# UPPER_SNAKE_CASE from camelCase
snake_upper = re.sub(r"(?<=[a-z])(?=[A-Z])", "_", snake).upper()

module_dir = os.path.join(PROJECT_ROOT, "packages", "i18nify-js", "src", "modules", snake)
data_dir   = os.path.join(PROJECT_ROOT, "i18nify-data", canonical_dir)

# ── File content templates ─────────────────────────────────────────

# i18nify-data/{snake}/data.json
f_data_json = json.dumps(canonical_data, ensure_ascii=False, indent=2) + "\n"

# i18nify-data/{snake}/README.md
f_readme = (
    f"# {pascal} Data\n\n"
    f"Canonical {pascal.lower()} reference data for i18nify.\n\n"
    f"## Schema\n\n"
    f"- **Root key**: `{data_key}`\n"
    f"- **Entry key**: ISO/official `{id_field}` code\n"
    f"- **Total entries**: {len(data_dict)}\n\n"
    f"## Source\n\n"
    f"Data sourced from {winner.get('name', 'authoritative source')} "
    f"(accuracy score: {winner.get('score', 'N/A')}/100, Tier {winner.get('tier', 'N/A')}).\n"
)

# packages/.../modules/{snake}/data/{snake}Config.json — compact module-local copy
# Only include fields commonly used in JS utilities (name, symbol, minor_unit where present)
CONFIG_FIELDS = {"name", "symbol", "minor_unit"}
module_config = {
    k: {fk: fv for fk, fv in v.items() if fk in CONFIG_FIELDS or not CONFIG_FIELDS.intersection(v)}
    for k, v in data_dict.items()
}
f_module_config = json.dumps(module_config, ensure_ascii=False, indent=2) + "\n"

# packages/.../modules/{snake}/types.ts
f_types = (
    f"import {snake_upper}_INFO from './data/{snake}Config.json';\n\n"
    f"export type {pascal}CodeType = keyof typeof {snake_upper}_INFO;\n\n"
    f"export interface {pascal}Type {{\n"
    f"  code: {pascal}CodeType;\n"
    f"  name: string;\n"
    f"}}\n"
)

# packages/.../modules/{snake}/constants.ts
f_constants = (
    f"export const {snake_upper}_CODE_LIST = {json.dumps(sorted(data_dict.keys()), ensure_ascii=False, indent=2)} as const;\n"
)

# packages/.../modules/{snake}/utils.ts
f_utils = (
    f"import type {{ {pascal}CodeType }} from './types';\n"
    f"import {snake_upper}_INFO from './data/{snake}Config.json';\n\n"
    f"export const get{pascal}Info = (code: {pascal}CodeType) =>\n"
    f"  ({snake_upper}_INFO as Record<string, unknown>)[code] ?? null;\n"
)

# packages/.../modules/{snake}/get{Pascal}List.ts
f_get_list = (
    f"import {{ withErrorBoundary }} from '../../common/errorBoundary';\n"
    f"import {snake_upper}_INFO from './data/{snake}Config.json';\n"
    f"import type {{ {pascal}CodeType }} from './types';\n\n"
    f"const get{pascal}List = (): Record<{pascal}CodeType, (typeof {snake_upper}_INFO)[{pascal}CodeType]> =>\n"
    f"  {snake_upper}_INFO as Record<{pascal}CodeType, (typeof {snake_upper}_INFO)[{pascal}CodeType]>;\n\n"
    f"export default withErrorBoundary<typeof get{pascal}List>(get{pascal}List);\n"
)

# packages/.../modules/{snake}/index.ts
f_index = (
    f"export {{ default as get{pascal}List }} from './get{pascal}List';\n"
    f"export * from './types';\n"
    f"export * from './utils';\n"
)

# packages/.../modules/{snake}/__tests__/get{Pascal}List.test.ts
f_test = (
    f"import get{pascal}List from '../get{pascal}List';\n"
    f"import type {{ {pascal}CodeType }} from '../types';\n\n"
    f"describe('get{pascal}List', () => {{\n"
    f"  it('returns all {snake} entries', () => {{\n"
    f"    const list = get{pascal}List();\n"
    f"    expect(typeof list).toBe('object');\n"
    f"    expect(Object.keys(list).length).toBeGreaterThan(0);\n"
    f"  }});\n\n"
    f"  it('each entry has expected shape', () => {{\n"
    f"    const list = get{pascal}List();\n"
    f"    const sample = Object.values(list)[0] as Record<string, unknown>;\n"
    f"    expect(typeof sample).toBe('object');\n"
    f"  }});\n\n"
    f"  it('returns entry for a valid code', () => {{\n"
    f"    const list = get{pascal}List();\n"
    f"    const code = Object.keys(list)[0] as {pascal}CodeType;\n"
    f"    expect(list[code]).toBeTruthy();\n"
    f"  }});\n"
    f"}});\n"
)

# ── Write files to filesystem (no content echoed to terminal) ──────
def write_file(path: str, content: str) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(content)
    rel = os.path.relpath(path, PROJECT_ROOT)
    print(f"WROTE|{rel}")

write_file(os.path.join(data_dir,   "data.json"),                        f_data_json)
write_file(os.path.join(data_dir,   "proto", f"{snake}.proto"),          f_proto)
write_file(os.path.join(data_dir,   "README.md"),                        f_readme)
write_file(os.path.join(module_dir, "data",  f"{snake}Config.json"),     f_module_config)
write_file(os.path.join(module_dir, "types.ts"),                         f_types)
write_file(os.path.join(module_dir, "constants.ts"),                     f_constants)
write_file(os.path.join(module_dir, "utils.ts"),                         f_utils)
write_file(os.path.join(module_dir, f"get{pascal}List.ts"),              f_get_list)
write_file(os.path.join(module_dir, "index.ts"),                         f_index)
write_file(os.path.join(module_dir, "__tests__", f"get{pascal}List.test.ts"), f_test)

print(f"UTILITY_DONE|{snake}|files=10|entries={len(data_dict)}")
RECIPE8_EOF
```

**Parse the output:**
- `WROTE|{rel_path}` lines → collect into file list for summary
- `UTILITY_DONE|{snake}|files={n}|entries={m}` → generation succeeded
- `UTILITY_ERROR|{message}` → halt, display error per Section 11 rules
- Non-zero exit or Traceback → halt, display error per Section 11 rules

**After Recipe 8 completes:** Use the **Write tool** (not bash) to update `packages/i18nify-js/src/index.ts` — append `export * from './modules/{snake}';` on a new line at the end of the existing module exports block. Read the file first to find the correct insertion point.

---

### Recipe 8-Go — Generate Go utility files (always runs after Recipe 8 on utility generation path)

**TRIGGER**: Run this recipe immediately after Recipe 8 on every utility generation invocation. Do NOT skip it — Go files are always generated alongside JS files.

**STRICT OUTPUT CONSTRAINT**: Like Recipe 8, writes files directly to filesystem. Only `WROTE|{path}`, `SKIP|{path}`, and the final `GO_UTILITY_DONE|` line may appear in stdout. No raw code.

Replace `{TOPIC_KEY}` (from Step 1) and `{PROJECT_ROOT}` (from Step A).

```bash
python3 << 'RECIPE8GO_EOF'
import json, os, sys, re

# ── Substitutions ─────────────────────────────────────────────────
TOPIC_KEY    = "{TOPIC_KEY}"
PROJECT_ROOT = "{PROJECT_ROOT}"
# ─────────────────────────────────────────────────────────────────

TOPIC_MAP = {
    "currency_codes":      {"snake": "currency",        "pascal": "Currency",        "data_key": "currency_information",         "go_pkg": "currency"},
    "country_codes":       {"snake": "country",         "pascal": "Country",         "data_key": "country_information",          "go_pkg": "country"},
    "phone_calling_codes": {"snake": "phoneNumber",     "pascal": "PhoneNumber",     "data_key": "country_tele_information",     "go_pkg": "phonenumber"},
    "language_codes":      {"snake": "language",        "pascal": "Language",        "data_key": "language_information",         "go_pkg": "language"},
    "timezones":           {"snake": "timezone",        "pascal": "Timezone",        "data_key": "timezone_information",         "go_pkg": "timezone"},
    "tld_list":            {"snake": "tld",             "pascal": "Tld",             "data_key": "tld_information",              "go_pkg": "tld"},
    "address_formats":     {"snake": "address",         "pascal": "Address",         "data_key": "address_format_information",   "go_pkg": "address"},
    "country_metadata":    {"snake": "countryMetadata", "pascal": "CountryMetadata", "data_key": "country_metadata_information", "go_pkg": "countrymetadata"},
    "gst_rates_india":     {"snake": "gst",             "pascal": "Gst",             "data_key": "gst_information",              "go_pkg": "gst"},
    "population_data":     {"snake": "population",      "pascal": "Population",      "data_key": "population_information",       "go_pkg": "population"},
    "vat_rates_global":    {"snake": "vatRates",        "pascal": "VatRates",        "data_key": "vat_global_information",       "go_pkg": "vatrates",  "canonical_dir": "vat-global"},
}

cfg = TOPIC_MAP.get(TOPIC_KEY)
if not cfg:
    print(f"GO_UTILITY_ERROR|unsupported topic '{TOPIC_KEY}' — add a mapping entry in Recipe 8-Go TOPIC_MAP")
    sys.exit(1)

snake         = cfg["snake"]
pascal        = cfg["pascal"]
data_key      = cfg["data_key"]
go_pkg        = cfg["go_pkg"]
canonical_dir = cfg.get("canonical_dir", snake)

# ── Load canonical data ───────────────────────────────────────────
data_path = os.path.join(PROJECT_ROOT, "i18nify-data", canonical_dir, "data.json")
if not os.path.exists(data_path):
    print(f"GO_UTILITY_ERROR|canonical data not found at i18nify-data/{canonical_dir}/data.json")
    sys.exit(1)

with open(data_path, encoding="utf-8") as f:
    canonical = json.load(f)

data_dict = canonical.get(data_key, {})
if not data_dict:
    print(f"GO_UTILITY_ERROR|key '{data_key}' not found in canonical data")
    sys.exit(1)

# ── Helpers ────────────────────────────────────────────────────────
# Common Go acronyms that must be ALL-CAPS (not just Capitalized).
_GO_ACRONYMS = {
    "id": "ID", "url": "URL", "http": "HTTP", "api": "API",
    "cvv": "CVV", "upi": "UPI", "json": "JSON", "xml": "XML",
    "uuid": "UUID", "csv": "CSV", "iban": "IBAN", "bic": "BIC",
}

def _to_pascal(s):
    parts = re.split(r'[_\s]+', s)
    return ''.join(
        _GO_ACRONYMS.get(p.lower(), p.capitalize())
        for p in parts if p
    )

def _go_type(val):
    if val is None: return "string"
    if isinstance(val, bool): return "bool"
    if isinstance(val, int): return "int32"
    if isinstance(val, float): return "float64"
    if isinstance(val, list):
        if not val: return "[]string"
        first = val[0]
        if isinstance(first, str): return "[]string"
        if isinstance(first, bool): return "[]bool"
        if isinstance(first, int): return "[]int32"
        return "json.RawMessage"
    if isinstance(val, dict): return "json.RawMessage"
    return "string"

def _go_zero(go_type):
    if go_type == "string": return '""'
    if go_type in ("int32", "int64", "float64"): return "0"
    if go_type == "bool": return "false"
    return "nil"

def _collect_samples(entries):
    all_keys = {}
    for entry in entries:
        if isinstance(entry, dict):
            for k in entry:
                all_keys.setdefault(k, None)
    for k in all_keys:
        for entry in entries:
            if isinstance(entry, dict) and k in entry:
                v = entry[k]
                if v is not None and v != "" and v != [] and v != {}:
                    all_keys[k] = v
                    break
    return all_keys

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(content)
    rel = os.path.relpath(path, PROJECT_ROOT)
    print(f"WROTE|{rel}")

samples = _collect_samples(list(data_dict.values()))
fields_named = [(_to_pascal(fname), _go_type(fval), fname) for fname, fval in samples.items()]
data_key_pascal = _to_pascal(data_key)
needs_json_import = any(gt == "json.RawMessage" for _, gt, _ in fields_named)

# ── 1. {go_pkg}_structs.go ────────────────────────────────────────
# Named _structs.go (not .pb.go) to avoid confusion with protoc-generated files.
pb_lines = [
    f"// Hand-written Go structs for {go_pkg}.",
    f"// Matches the canonical i18nify-data/{go_pkg}/data.json schema.",
    "",
    f"package {go_pkg}",
    "",
]
if needs_json_import:
    pb_lines += ['import "encoding/json"', '']

pb_lines += [
    f"// {pascal}Data is the root container.",
    f"type {pascal}Data struct {{",
    f'\t{data_key_pascal} map[string]*{pascal}Info `json:"{data_key},omitempty"`',
    "}",
    "",
    f"func (x *{pascal}Data) Get{data_key_pascal}() map[string]*{pascal}Info {{",
    "\tif x != nil {",
    f"\t\treturn x.{data_key_pascal}",
    "\t}",
    "\treturn nil",
    "}",
    "",
    f"// {pascal}Info holds all fields for a single {go_pkg} entry.",
    f"type {pascal}Info struct {{",
]
for gfname, gtype, jname in fields_named:
    pb_lines.append(f'\t{gfname} {gtype} `json:"{jname},omitempty"`')
pb_lines += ["}", ""]
for gfname, gtype, jname in fields_named:
    pb_lines += [
        f"func (x *{pascal}Info) Get{gfname}() {gtype} {{",
        "\tif x != nil {",
        f"\t\treturn x.{gfname}",
        "\t}",
        f"\treturn {_go_zero(gtype)}",
        "}",
        "",
    ]
f_go_pb = "\n".join(pb_lines) + "\n"

# ── 2. data_loader.go ─────────────────────────────────────────────
f_go_loader = (
    "// Code generated by i18nify go generator. DO NOT EDIT.\n\n"
    f"package {go_pkg}\n\n"
    'import (\n\t_ "embed"\n\t"encoding/json"\n\t"sync"\n)\n\n'
    '//go:embed data/data.json\n'
    'var dataJSON []byte\n\n'
    'var (\n'
    f'\tdata     *{pascal}Data\n'
    '\tdataOnce sync.Once\n'
    '\tdataErr  error\n'
    ')\n\n'
    f'// Get{pascal}Data retrieves the {go_pkg} data.\n'
    f'func Get{pascal}Data() (*{pascal}Data, error) {{\n'
    '\tdataOnce.Do(func() {\n'
    f'\t\tdata = &{pascal}Data{{}}\n'
    '\t\tdataErr = json.Unmarshal(dataJSON, data)\n'
    '\t})\n'
    '\treturn data, dataErr\n'
    '}\n'
)

# ── 3. data_loader_test.go ────────────────────────────────────────
f_go_loader_test = (
    "// Code generated by i18nify go generator. DO NOT EDIT.\n\n"
    f"package {go_pkg}\n\n"
    'import (\n\t"testing"\n)\n\n'
    f'func TestGet{pascal}Data(t *testing.T) {{\n'
    f'\tdata, err := Get{pascal}Data()\n'
    '\tif err != nil {\n'
    f'\t\tt.Fatalf("Get{pascal}Data() error = %v", err)\n'
    '\t}\n'
    '\tif data == nil {\n'
    f'\t\tt.Fatal("Get{pascal}Data() returned nil data")\n'
    '\t}\n'
    '\tt.Log("Data loaded successfully")\n'
    '}\n\n'
    f'func TestGet{pascal}Data_Idempotent(t *testing.T) {{\n'
    f'\tdata1, err1 := Get{pascal}Data()\n'
    '\tif err1 != nil {\n'
    f'\t\tt.Fatalf("First Get{pascal}Data() error = %v", err1)\n'
    '\t}\n'
    f'\tdata2, err2 := Get{pascal}Data()\n'
    '\tif err2 != nil {\n'
    f'\t\tt.Fatalf("Second Get{pascal}Data() error = %v", err2)\n'
    '\t}\n'
    '\tif data1 != data2 {\n'
    f'\t\tt.Error("Get{pascal}Data() should return cached data on subsequent calls")\n'
    '\t}\n'
    '}\n\n'
    f'func TestGet{pascal}Data_NotEmpty(t *testing.T) {{\n'
    f'\tdata, err := Get{pascal}Data()\n'
    '\tif err != nil {\n'
    f'\t\tt.Fatalf("Get{pascal}Data() error = %v", err)\n'
    '\t}\n'
    '\tif data == nil {\n'
    '\t\tt.Error("Data should not be nil")\n'
    '\t}\n'
    f'\tif len(data.Get{data_key_pascal}()) == 0 {{\n'
    f'\t\tt.Error("{data_key_pascal} should not be empty")\n'
    '\t}\n'
    '}\n'
)

# ── 4. go.mod for i18nify-data/go/{go_pkg} ───────────────────────
f_go_mod = (
    f"module github.com/razorpay/i18nify/i18nify-data/go/{go_pkg}\n\ngo 1.20\n"
)

# ── 5. packages/i18nify-go/modules/{snake}/{go_pkg}.go ─────────────
mod_info_fields = "\n".join(
    f'\t{gfname} {gtype} `json:"{jname}"`'
    for gfname, gtype, jname in fields_named
)
f_go_module = (
    f"// Package {go_pkg} provides {go_pkg} information keyed by ISO 3166-1 alpha-2 country code.\n"
    f"package {go_pkg}\n\n"
    'import (\n\t"encoding/json"\n\t"fmt"\n\n'
    f'\tdataSource "github.com/razorpay/i18nify/i18nify-data/go/{go_pkg}"\n'
    ')\n\n'
    f'// {pascal}Info contains data for a single {go_pkg} entry.\n'
    f'type {pascal}Info struct {{\n'
    + mod_info_fields + "\n"
    '}\n\n'
    f'// {pascal}Data holds {go_pkg} information keyed by ISO 3166-1 alpha-2 country code.\n'
    f'type {pascal}Data struct {{\n'
    f'\t{data_key_pascal} map[string]{pascal}Info `json:"{data_key}"`\n'
    '}\n\n'
    f'var cached{pascal}Data *{pascal}Data\n\n'
    'func init() {\n'
    f'\tsrc, err := dataSource.Get{pascal}Data()\n'
    '\tif err != nil {\n'
    f'\t\tpanic(fmt.Sprintf("failed to load {go_pkg} data: %v", err))\n'
    '\t}\n'
    '\tdata := convertFromDataSource(src)\n'
    f'\tcached{pascal}Data = &data\n'
    '}\n\n'
    f'func convertFromDataSource(src *dataSource.{pascal}Data) {pascal}Data {{\n'
    '\tif src == nil {\n'
    f'\t\treturn {pascal}Data{{}}\n'
    '\t}\n'
    f'\tinfo := make(map[string]{pascal}Info, len(src.Get{data_key_pascal}()))\n'
    f'\tfor cc, entry := range src.Get{data_key_pascal}() {{\n'
    '\t\tif entry == nil {\n'
    '\t\t\tcontinue\n'
    '\t\t}\n'
    '\t\tb, merr := json.Marshal(entry)\n'
    '\t\tif merr != nil {\n'
    '\t\t\tcontinue\n'
    '\t\t}\n'
    f'\t\tvar v {pascal}Info\n'
    '\t\tif err := json.Unmarshal(b, &v); err != nil {\n'
    '\t\t\tcontinue\n'
    '\t\t}\n'
    '\t\tinfo[cc] = v\n'
    '\t}\n'
    f'\treturn {pascal}Data{{{data_key_pascal}: info}}\n'
    '}\n\n'
    f'// Unmarshal{pascal}Data parses JSON data into a {pascal}Data struct.\n'
    f'func Unmarshal{pascal}Data(data []byte) ({pascal}Data, error) {{\n'
    f'\tvar r {pascal}Data\n'
    '\terr := json.Unmarshal(data, &r)\n'
    '\treturn r, err\n'
    '}\n\n'
    f'// Get{pascal}List returns all {go_pkg} entries keyed by country code.\n'
    f'func Get{pascal}List() map[string]{pascal}Info {{\n'
    f'\treturn cached{pascal}Data.{data_key_pascal}\n'
    '}\n\n'
    f'// Get{pascal}Info returns the {go_pkg} entry for the given ISO 3166-1 alpha-2 country code.\n'
    f'func Get{pascal}Info(cc string) ({pascal}Info, error) {{\n'
    '\tif cc == "" {\n'
    f'\t\treturn {pascal}Info{{}}, fmt.Errorf("country code cannot be empty")\n'
    '\t}\n'
    f'\tinfo, exists := cached{pascal}Data.{data_key_pascal}[cc]\n'
    '\tif !exists {\n'
    f'\t\treturn {pascal}Info{{}}, fmt.Errorf("{pascal} info for country code \'%s\' not found", cc)\n'
    '\t}\n'
    '\treturn info, nil\n'
    '}\n'
)

# ── 6. packages/i18nify-go/modules/{snake}/{go_pkg}_test.go ───────
f_go_module_test = (
    f"package {go_pkg}\n\n"
    'import (\n\t"encoding/json"\n\t"testing"\n\n\t"github.com/stretchr/testify/assert"\n)\n\n'
    f'func TestGet{pascal}List(t *testing.T) {{\n'
    f'\tlist := Get{pascal}List()\n'
    '\tassert.NotEmpty(t, list)\n'
    '\tfor cc, info := range list {\n'
    '\t\tassert.Len(t, cc, 2, "country code should be 2 chars: %s", cc)\n'
    '\t\t_ = info\n'
    '\t}\n'
    '}\n\n'
    f'func TestGet{pascal}Info_Invalid(t *testing.T) {{\n'
    f'\t_, err := Get{pascal}Info("XX")\n'
    '\tassert.Error(t, err)\n\n'
    f'\t_, err = Get{pascal}Info("")\n'
    '\tassert.Error(t, err)\n'
    '}\n\n'
    f'func TestUnmarshal{pascal}Data(t *testing.T) {{\n'
    f'\tsrc, err := Get{pascal}Data()\n'
    '\tif err != nil {\n'
    f'\t\tt.Fatalf("Get{pascal}Data() error = %v", err)\n'
    '\t}\n'
    f'\traw, _ := json.Marshal(src)\n'
    f'\tparsed, err := Unmarshal{pascal}Data(raw)\n'
    '\tassert.NoError(t, err)\n'
    f'\tassert.NotEmpty(t, parsed.{data_key_pascal})\n'
    '}\n'
)

# ── Write i18nify-data/go/{go_pkg}/ ──────────────────────────────
go_data_dir = os.path.join(PROJECT_ROOT, "i18nify-data", "go", go_pkg)
write_file(os.path.join(go_data_dir, f"{go_pkg}_structs.go"), f_go_pb)
write_file(os.path.join(go_data_dir, "data_loader.go"),      f_go_loader)
write_file(os.path.join(go_data_dir, "data_loader_test.go"), f_go_loader_test)
write_file(os.path.join(go_data_dir, "data", "data.json"),   json.dumps(canonical, ensure_ascii=False, indent=2))
write_file(os.path.join(go_data_dir, "go.mod"),              f_go_mod)

# ── Write packages/i18nify-go/modules/{snake}/ ───────────────────
go_mod_dir = os.path.join(PROJECT_ROOT, "packages", "i18nify-go", "modules", snake)
write_file(os.path.join(go_mod_dir, f"{go_pkg}.go"),         f_go_module)
write_file(os.path.join(go_mod_dir, f"{go_pkg}_test.go"),    f_go_module_test)

# ── Update packages/i18nify-go/go.mod ────────────────────────────
pkg_go_mod_path = os.path.join(PROJECT_ROOT, "packages", "i18nify-go", "go.mod")
with open(pkg_go_mod_path, encoding="utf-8") as f:
    go_mod_content = f.read()

dep_module = f"github.com/razorpay/i18nify/i18nify-data/go/{go_pkg}"
if dep_module not in go_mod_content:
    go_mod_content = go_mod_content.rstrip()
    last_paren = go_mod_content.rfind("\n)")
    if last_paren >= 0:
        require_line = f"\n\t{dep_module} v1.0.0"
        go_mod_content = go_mod_content[:last_paren] + require_line + go_mod_content[last_paren:]
    else:
        go_mod_content += f"\nrequire {dep_module} v1.0.0\n"
    go_mod_content += f"\nreplace {dep_module} => ../../i18nify-data/go/{go_pkg}\n"
    with open(pkg_go_mod_path, "w", encoding="utf-8") as f:
        f.write(go_mod_content)
    print(f"WROTE|packages/i18nify-go/go.mod")
else:
    print(f"SKIP|packages/i18nify-go/go.mod (dependency already present)")

print(f"GO_UTILITY_DONE|{snake}|files=8|entries={len(data_dict)}")
RECIPE8GO_EOF
```

**Parse the output:**
- `WROTE|{rel_path}` lines → collect into file list for summary
- `SKIP|{rel_path}` → dependency already present, no action needed
- `GO_UTILITY_DONE|{snake}|files={n}|entries={m}` → generation succeeded
- `GO_UTILITY_ERROR|{message}` → halt, display error per Section 11 rules
- Non-zero exit or Traceback → halt, display error per Section 11 rules

---

### Temp file map (summary)

| File | Written by | Read by | Contents |
|------|-----------|---------|----------|
| `/tmp/tsf_cache_data.json` | Recipe 2 | Recipe 5 | Full pre-fetch envelope JSON |
| `/tmp/tsf_parsed.json` | Recipe 5 | Recipe 6 | Normalised source data array |
| `/tmp/tsf_result.json` | Recipe 6 | Recipe 7 | Winner, scores, conflicts |

---

## Section 12 — i18nify Utility Generation

### Trigger conditions

Run this section when the user explicitly requests any of:
- "generate a utility for [topic]"
- "scaffold a module for [topic]"
- "create i18nify module for [topic]"
- "build the [topic] utility"
- "generate code for [topic]"

Do NOT run this section on a plain `/utility-creator [topic]` invocation — only when utility generation is explicitly requested.

### Pre-conditions

Steps 1–7 of Section 6 must have already executed. `/tmp/tsf_result.json` must exist with a valid winner. If it does not exist, run Steps 1–7 first, then continue here.

### Step A — Determine PROJECT_ROOT

Run: `git -C "$(pwd)" rev-parse --show-toplevel` via bash_tool.
Set `{PROJECT_ROOT}` to the output (trim trailing newline).

### Step B — Run Recipe 8

Run Section 2-C **Recipe 8** via bash_tool. Substitute:
- `{TOPIC_KEY}` — canonical topic key from Step 1 (e.g. `currency_codes`)
- `{PROJECT_ROOT}` — from Step A

Check stdout character by character:
- Each `WROTE|{path}` → collect path into written-files list
- `UTILITY_DONE|{snake}|files={n}|entries={m}` → generation succeeded; extract snake, n, m
- `UTILITY_ERROR|{message}` → halt, display per Section 11
- Any Traceback or non-zero exit → halt, display per Section 11

### Step B-Go — Run Recipe 8-Go

Immediately after Step B succeeds, run Section 2-C **Recipe 8-Go** via bash_tool. Substitute the same `{TOPIC_KEY}` and `{PROJECT_ROOT}` values.

Check stdout:
- Each `WROTE|{path}` → collect into written-files list
- Each `SKIP|{path}` → note as already-present, no error
- `GO_UTILITY_DONE|{snake}|files={n}|entries={m}` → succeeded
- `GO_UTILITY_ERROR|{message}` → halt, display per Section 11
- Any Traceback or non-zero exit → halt, display per Section 11

### Step C — Update src/index.ts barrel

Using the **Read tool**, read `packages/i18nify-js/src/index.ts` and check whether the line `export * from './modules/{snake}';` already exists in the file.

- **If it already exists**: skip this step entirely — do not make any edit.
- **If it does not exist**: use the **Edit tool** (not bash, not Write) to find the last `export * from './modules/...';` line and append `export * from './modules/{snake}';` immediately after it on a new line. Do not rewrite the whole file.

### Step D — Output summary (NO raw code; scoring diagnostic required)

Output a markdown summary table of files written, then the scoring diagnostic block from Section 9.5. Do NOT print or echo any generated file content. Example output:

```
✅ i18nify utility generated: {snake} ({n} JS files + {n_go} Go files, {m} data entries)

| File | Type |
|------|------|
| i18nify-data/{snake}/data.json | Canonical data |
| i18nify-data/{snake}/proto/{snake}.proto | Protobuf schema definition |
| i18nify-data/{snake}/README.md | Documentation |
| packages/i18nify-js/src/modules/{snake}/data/{snake}Config.json | Module-local data |
| packages/i18nify-js/src/modules/{snake}/types.ts | TypeScript types |
| packages/i18nify-js/src/modules/{snake}/constants.ts | Constants |
| packages/i18nify-js/src/modules/{snake}/utils.ts | Utilities |
| packages/i18nify-js/src/modules/{snake}/get{Pascal}List.ts | Main function |
| packages/i18nify-js/src/modules/{snake}/index.ts | Barrel exports |
| packages/i18nify-js/src/modules/{snake}/__tests__/get{Pascal}List.test.ts | Tests |
| packages/i18nify-js/src/index.ts | Updated barrel |
| i18nify-data/go/{go_pkg}/{go_pkg}_structs.go | Go structs |
| i18nify-data/go/{go_pkg}/data_loader.go | Go data loader (//go:embed) |
| i18nify-data/go/{go_pkg}/data_loader_test.go | Go data loader tests |
| i18nify-data/go/{go_pkg}/data/data.json | Go embedded data |
| i18nify-data/go/{go_pkg}/go.mod | Go module definition |
| packages/i18nify-go/modules/{snake}/{go_pkg}.go | Go accessor module |
| packages/i18nify-go/modules/{snake}/{go_pkg}_test.go | Go accessor tests |
| packages/i18nify-go/go.mod | Updated (added {go_pkg} dep) |
```

After the table, run the Section 9.5 bash snippet and print the scoring diagnostic block verbatim. Example tail of output:

```
╔══════════════════════════════════════════════════════════╗
║           TSF SCORING & DIAGNOSTICS SUMMARY              ║
╚══════════════════════════════════════════════════════════╝

  Topic          : address_formats
  Winning source : Google i18n address data
  Source URL     : https://chromium-i18n.appspot.com/ssl-address/data/
  Tier           : Tier 1 (Official (T1))
  Rows fetched   : 249
  From cache     : False
  Conflicts      : 0

  ── Score breakdown (weight × raw value) ──────────────────

  tier_authority  (×0.35)  [████████████████████] 1.00
  multiplicity    (×0.15)  [██████████░░░░░░░░░░] 0.50
  freshness       (×0.15)  [███████████████████░] 0.97
  coverage        (×0.15)  [████████████████████] 1.00
  recurrence      (×0.10)  [█████████████████░░░] 0.85
  independence    (×0.10)  [████████████████████] 1.00

  conflict_penalty         -0.00  (applied after base)

  ─────────────────────────────────────────────────────────
  FINAL ACCURACY SCORE     91/100
══════════════════════════════════════════════════════════════
```

### File pattern reference (for generated files)

The generated files follow the patterns established in `packages/i18nify-js/src/modules/currency` and `packages/i18nify-js/src/modules/phoneNumber`:

| Pattern | Detail |
|---------|--------|
| All function exports | Wrapped: `withErrorBoundary<typeof fn>(fn)` |
| Module data | Imported from `./data/{snake}Config.json` — compact subset of canonical data |
| Canonical data | In `i18nify-data/{snake}/data.json` under a `{data_key}` root key |
| Type alias | `{Pascal}CodeType = keyof typeof {SNAKE_UPPER}_INFO` |
| External data import | Via TypeScript path alias `#/i18nify-data/...` when needed |
| Proto schema | `syntax = "proto3"` with `map<string, {Pascal}Info>` and go_package option |

---

## Section 13 — Handling Unknown Topics (Research & Registry Proposal)

### Directive: the registry is a cache, not a ceiling

Your primary directive is to find technical sources. The internal registry (Section 2) is a cache of previously solved topics, not a limitation of your capabilities. An unknown topic is a **research assignment**, not a failure condition.

- **DO NOT** route to Section 8 the moment a topic is not in the registry.
- **DO** use `web_search` and `web_fetch` to hunt for the official T1/T2 authoritative source (government portals, standards bodies, official registries).
- **Evaluate** every found source against the strict T1/T2 criteria from Section 1.
- **If a valid source is found**, produce a Section 13 registry-addition proposal (Step D below).
- **Only emit Section 8** after exhaustive web searching proves no T1/T2 source exists anywhere on the internet.

### Step A — Web search hunt (3 targeted queries)

Run these three searches in order, stopping at the first that yields a T1 or T2 source:

1. `"{topic} {jurisdiction} official dataset site:gov OR site:int OR site:org"`
2. `"{topic} {jurisdiction} ISO OR IANA OR ITU OR Unicode OR W3C official"`
3. `"{topic} {jurisdiction} machine-readable JSON OR XML OR CSV official"`

Substitute `{jurisdiction}` when scope is country-specific (e.g. "Australia ATO GST rates").  
Substitute `{topic}` with the normalised topic name from the user's query.

### Step B — Classify every result

Apply the Section 1 tier criteria to each found source:

| Classification | Criteria | Action |
|---|---|---|
| **Tier 1** | Maintained by the owning standards body or government agency | Accept — proceed to Step C |
| **Tier 2** | Mirrors a T1 source; clear citation chain; actively maintained | Accept as fallback — proceed to Step C |
| **Tier 3** | Community / blog / npm / GitHub without cited upstream | Discard immediately |

If only T3 sources survive → all three searches exhausted → route to Section 8.  
If any T1 or T2 source found → continue to Step C.

### Step C — Assess machine-readability

| Source type | Action |
|---|---|
| JSON / XML / CSV endpoint | Propose new pipeline topic (Step D) |
| HTML page (SPA or static) | Propose Crawl4AI strategy (Step D) |
| PDF only | Propose PyMuPDF parser — cite CBIC GST as precedent (Step D) |
| Paywalled / login-required | Check if T2 mirror exists; if so propose T2; otherwise note in proposal |
| Human-readable only, no download | Section 8 — note the limitation honestly |

### Step D — Registry-addition proposal

When a valid T1/T2 source is confirmed, output this structured proposal. Do NOT silently proceed to fetch data — propose first and let the user approve before any pipeline changes are made.

```
## New Topic Proposal: {topic_key}

**Source found**: {source_name}  
**URL**: {source_url}  
**Tier**: T{1 or 2}  
**Machine-readable format**: {JSON | XML | CSV | PDF | HTML}  
**Estimated coverage**: ~{n} entries  

### Changes required to add this topic to the pipeline

**1. SKILL.md — Add to Section 2 source registry:**
### {topic_key}
Synonyms: `{comma-separated synonyms}`
- T{tier}: {source_name} — `{source_url}`
- Expected coverage: ~{n} entries

**2. crawl4ai_runner.py — Add fetch + parse functions:**
def fetch_{snake}():     # downloads from {source_url}
def parse_{snake}(raw):  # returns list[dict] with fields {field_list}

**3. schemas/i18nify_schemas.py — Add Pydantic schema:**
class {Pascal}(BaseModel):
    {field: type for each field}

**4. Canonical data path**: i18nify-data/{snake}/data.json  
   Root key: {data_key}  
   Entry key: {id_field}

Would you like me to implement these changes?
```

### Section 8 is the last resort, not the first

Section 8 is only correct when **all** of the following are true:

1. The topic is not in the registry (Section 2)
2. All three web search queries in Step A returned no T1/T2 sources
3. Every found source classified as T3 or lower after applying Section 1 criteria

If even one T1 or T2 source is found anywhere, respond with the Step D proposal instead of Section 8.

---
