# utility-creator

A Claude Code skill that fetches authoritative reference data, scores it against a tiered source registry, and scaffolds complete i18nify JS/TS + Go module files directly into the repo.

## What it does

Given a topic like `currency`, `http_status_codes`, `vat_rates_global`, or `corporate_tax_rates`, the skill:

1. Resolves the topic to a canonical name via synonym lookup
2. Checks a local file cache (TTL-aware); fetches fresh data on miss/stale
3. Scores each source against a tier registry (T1 = standards body API, T2 = authoritative PDF, T3 = structured web)
4. Outputs a scored widget + `_source` traceability block `{ name, url, tier }`
5. Scaffolds JS/TS files (`types.ts`, `constants.ts`, `utils.ts`, `getCurrencyList.ts`, `index.ts`, test file) and Go files (`*_structs.go`, `data_loader.go`, `data_loader_test.go`, `data/data.json`, `go.mod`) under the correct repo paths

## Directory layout

```
.claude/skills/utility-creator/
├── SKILL.md                     # Entrypoint — start here
├── smoke.sh                     # End-to-end smoke test (probe: http_status_codes)
├── i18nify_schemas.py           # Pydantic models for all i18nify data types
├── requirements.txt             # Python dependencies for scrapers
├── docs/
│   ├── 1_REGISTRY_AND_TIERS.md  # Source tier definitions, topic registry, TTLs
│   ├── 2_EXECUTION_RECIPES.md   # Recipes 0–8-Go — step-by-step execution
│   ├── 3_SCORING_AND_UI.md      # Scoring formula, widget rendering, diagnostics
│   └── 4_ERROR_HANDLING.md      # Error patterns, fallback behaviour, halt protocol
├── evals/
│   ├── run_evals.sh             # Single-command runner for the full eval suite
│   ├── test_synonyms.py         # Topic synonym resolution and registry lookup
│   ├── test_cache_routing.py    # TTL-based cache hit/miss routing logic
│   ├── test_data_precision.py   # Field-level precision of scraped output
│   ├── test_scoring.py          # Source scoring and tier ranking
│   ├── test_recipe8_structure.py# Recipe 8 output structure validation
│   ├── test_output_quality.py   # Data JSON quality + TS/Go code generation rubric
│   ├── test_functional.py       # 8-class behavioural suite (full lifecycle)
│   ├── test_execution_harness.py# End-to-end execution harness (JS/TS + Go)
│   └── fixtures/
│       ├── recipe8_runner.py    # Standalone JS/TS file generator (reads tsf_result.json)
│       └── recipe8go_runner.py  # Standalone Go file generator (reads tsf_result.json)
└── tools/
    ├── cli.py                   # Interactive triage menu for topic scrapers
    └── crawlers/
        ├── crawl4ai_runner.py   # Crawl4AI-based web scraper (all topics)
        ├── pdf_scraper.py       # PDF scraper for data sources in PDF form
        ├── pdf_scraper_test.py  # Tests for the PDF scraper
        ├── skill_router.py      # Routes topic requests to the correct scraper
        └── validate.py          # Validates scraped data against Pydantic schemas
```

## Quick start

**1. Smoke test** — verifies the end-to-end pipeline (~5 s):

```bash
cd "$(git rev-parse --show-toplevel)"
bash .claude/skills/utility-creator/smoke.sh
# → SMOKE_OK|http_status_codes|pipeline verified end-to-end
```

**2. Run the skill** — follow the steps in `SKILL.md`:

- Step 0: Clarification gate (scope + intent)
- Step 1: Topic resolution (synonym lookup → canonical name)
- Step 3: Recipe 0 (cache check) → Recipe 1 (TTL routing) → Recipe 3 (fetch) → Recipe 8 (scaffold)

**3. Python prerequisites** — activate the venv before any Recipe that calls scrapers:

```bash
source venv/bin/activate   # repo root venv; contains crawl4ai, PyMuPDF, pydantic
```

Install dependencies if the venv is fresh:

```bash
pip install -r .claude/skills/utility-creator/requirements.txt
```

## Running the eval suite

```bash
bash .claude/skills/utility-creator/evals/run_evals.sh
```

Or run individual modules:

```bash
python3 -m pytest .claude/skills/utility-creator/evals/test_functional.py -v
python3 -m pytest .claude/skills/utility-creator/evals/test_execution_harness.py -v
python3 -m pytest .claude/skills/utility-creator/evals/test_output_quality.py -v --report
```

### Eval coverage

| Module | What it checks | Tests |
|---|---|---|
| `test_synonyms.py` | Synonym → canonical resolution, registry lookup | ~30 |
| `test_cache_routing.py` | TTL-based cache hit/miss routing | ~25 |
| `test_data_precision.py` | Field-level precision of scraped output | ~20 |
| `test_scoring.py` | Source scoring algorithm, tier ranking | ~25 |
| `test_recipe8_structure.py` | Recipe 8 JS/TS output structure | ~30 |
| `test_output_quality.py` | JSON schema, TS type exports, Go codegen rubric | 30 |
| `test_functional.py` | Full skill lifecycle (8 classes, JPY/Japan fixture) | ~50 |
| `test_execution_harness.py` | End-to-end file generation + gofmt validation | 50 |

## Data pipeline tools

**Interactive scraper CLI:**

```bash
python3 .claude/skills/utility-creator/tools/cli.py
```

**Run a scraper directly:**

```bash
# Web scrape (via Crawl4AI)
python3 .claude/skills/utility-creator/tools/crawlers/crawl4ai_runner.py --topic currency

# PDF scrape
python3 .claude/skills/utility-creator/tools/crawlers/pdf_scraper.py --url <pdf_url> --topic vat_rates_global

# Route automatically to the correct scraper
python3 .claude/skills/utility-creator/tools/crawlers/skill_router.py --topic corporate_tax_rates

# Validate scraped output against Pydantic schemas
python3 .claude/skills/utility-creator/tools/crawlers/validate.py --file data.json --topic currency
```

> **Note:** `crawl4ai_runner.py` connects directly to a local Crawl4AI instance at `http://localhost:11235`. Start it with `docker run -p 11235:11235 unclecode/crawl4ai` before running web scrapers.

## Source traceability

Every canonical `data.json` now includes a `_source` block:

```json
{
  "_source": {
    "name": "ISO 4217",
    "url": "https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml",
    "tier": 1
  }
}
```

This block is embedded verbatim in the Go-side `data/data.json` as well.

## Registered topics

| Topic | Tier | Source | Coverage |
|---|---|---|---|
| `currency` | T1 | ISO 4217 XML (SIX Group) | ~180 currencies |
| `http_status_codes` | T1 | IANA HTTP Status Code Registry | All registered codes |
| `corporate_tax_rates` | T1 | OECD SDMX REST API | ~112 jurisdictions |
| `vat_rates_global` | T1 | OECD Consumption Tax Trends 2024 | ~75 countries |
| `address_formats` | T2 | Universal Postal Union (PDF) | 190+ countries |

Full registry with TTLs and fallback sources: [`docs/1_REGISTRY_AND_TIERS.md`](./docs/1_REGISTRY_AND_TIERS.md).

## Security fixes (shipped in this PR)

| Package | Before | After | CVE |
|---|---|---|---|
| `@playwright/test` | <1.55.1 | 1.60.0 | CVE-2025-59288 |
| `js-yaml` | 3.x / 4.x | 3.14.2 / 4.2.0 | prototype pollution |
| `rollup` | ^4.0.2 | ^4.59.0 | arbitrary file write |
| `vite` | ^4.4.11 | ^6.4.2 | fs.deny bypass |
| `esbuild` | <0.28.1 | 0.28.1 | CVE (via resolutions) |
| Node.js (CI) | 20.3.1 | 20.19.1 | required by vite ^6 + @vitejs/plugin-react-swc ^4 |

## Reference

| Need | File |
|---|---|
| Source URLs, tier rules, topic synonyms | [`docs/1_REGISTRY_AND_TIERS.md`](./docs/1_REGISTRY_AND_TIERS.md) |
| Run any Recipe (0–8-Go), utility generation | [`docs/2_EXECUTION_RECIPES.md`](./docs/2_EXECUTION_RECIPES.md) |
| Scoring formula, widget rendering, diagnostics | [`docs/3_SCORING_AND_UI.md`](./docs/3_SCORING_AND_UI.md) |
| Error handling, fallback behaviour, halt protocol | [`docs/4_ERROR_HANDLING.md`](./docs/4_ERROR_HANDLING.md) |
