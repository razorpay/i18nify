# utility-creator

> A Claude Code skill that automatically builds complete i18nify data modules — it finds the best data source online, validates it, and writes all the code files you need (TypeScript + Go) in one shot.

---

## Background — what is this, and why does it exist?

**i18nify** is Razorpay's internationalisation library. It ships structured reference data (currency codes, country metadata, phone calling codes, VAT rates, etc.) along with TypeScript and Go utilities to look up and format that data.

Adding a new data module used to be a manual chore:
1. Find a reliable source (ISO body? IANA? OECD API?)
2. Download and parse the data
3. Write `data.json`, `types.ts`, `constants.ts`, `utils.ts`, `index.ts`, tests, and the Go equivalents

**This skill automates the entire process.** You tell Claude "add a utility for VAT rates", and it handles everything — finding the source, scoring its reliability, fetching the data, and writing all the files.

---

## How it works (the big picture)

```
You type a topic
      ↓
Claude resolves it to a canonical name  ("VAT rates" → "vat_rates_global")
      ↓
Claude checks if fresh data is already cached locally
      ↓  (cache miss or stale)
Python scraper fetches data from the best official source
      ↓
Data is validated against a schema
      ↓
Claude writes JS/TS + Go module files into the repo
      ↓
You get a complete, working module with tests
```

The skill never guesses or uses random internet data. Every source is ranked on a **tier system**:

| Tier | Meaning | Example |
|---|---|---|
| **T1** | Official standards body — always prefer | ISO 4217 for currencies, IANA for timezones |
| **T2** | Trusted mirror of T1 — use only if T1 is inaccessible | datahub.io packaging ISO data |
| **T3** | Community / unverified — never used | Random GitHub repos, blog posts |

---

## What's in this folder

```
.claude/skills/utility-creator/
│
│  ← The skill itself (how Claude knows what to do)
├── SKILL.md                      Main skill entrypoint. Claude reads this first.
├── smoke.sh                      Quick sanity check — runs the full pipeline in ~5 s
├── i18nify_schemas.py            Pydantic data models defining the shape of every
│                                 i18nify data type (currency, country, language, etc.)
├── requirements.txt              Python packages needed by the scrapers
│
│  ← Reference documentation
├── docs/
│   ├── 1_REGISTRY_AND_TIERS.md  Which source to use for which topic, and why
│   ├── 2_EXECUTION_RECIPES.md   Step-by-step "Recipes" Claude follows to fetch + generate
│   ├── 3_SCORING_AND_UI.md      How sources are scored and displayed to the user
│   └── 4_ERROR_HANDLING.md      What to do when a fetch fails or a source is unreachable
│
│  ← Automated tests for the skill itself
├── evals/
│   ├── run_evals.sh             Runs every test below in one command
│   ├── test_synonyms.py         Does "currencies" correctly resolve to "currency_codes"?
│   ├── test_cache_routing.py    Does the skill skip fetching when data is fresh enough?
│   ├── test_data_precision.py   Is the fetched data accurate (correct field values)?
│   ├── test_scoring.py          Does the tier scoring algorithm rank sources correctly?
│   ├── test_recipe8_structure.py Are the generated TS/Go files structured correctly?
│   ├── test_output_quality.py   Do the generated files pass TypeScript + Go quality checks?
│   ├── test_functional.py       Full end-to-end: invoke the skill, check all output files
│   ├── test_execution_harness.py Full end-to-end: generates real files and runs gofmt on them
│   └── fixtures/
│       ├── recipe8_runner.py    Standalone script that generates JS/TS files from a fixture
│       └── recipe8go_runner.py  Standalone script that generates Go files from a fixture
│
│  ← Python scrapers (the data fetching layer)
└── tools/
    ├── cli.py                   Interactive menu — pick a topic and it fetches the data
    └── crawlers/
        ├── crawl4ai_runner.py   Scrapes websites using the Crawl4AI library
        ├── pdf_scraper.py       Extracts structured data from PDF sources (e.g. OECD reports)
        ├── pdf_scraper_test.py  Tests for the PDF scraper
        ├── skill_router.py      Decides whether to use the web scraper or the PDF scraper
        └── validate.py          Checks that scraped data matches the expected schema
```

---

## First-time setup

**1. Install Python dependencies**

The scrapers are Python scripts. They need a virtual environment:

```bash
# From the repo root
python3 -m venv venv
source venv/bin/activate
pip install -r .claude/skills/utility-creator/requirements.txt
```

**2. Start the Crawl4AI server** (needed for web scraping)

Crawl4AI runs as a local Docker container. The scrapers talk to it on port 11235:

```bash
docker run -p 11235:11235 unclecode/crawl4ai
```

Leave this running in a separate terminal while you use the skill.

**3. Verify everything works**

```bash
source venv/bin/activate   # if not already active
bash .claude/skills/utility-creator/smoke.sh
```

Expected output:
```
SMOKE_OK|http_status_codes|pipeline verified end-to-end
```

If you see `SMOKE_OK`, you're ready.

---

## Using the skill

You use this skill by talking to Claude Code. Just describe what you want:

```
"Add a utility for VAT rates"
"Create a currency module"
"Build an HTTP status codes utility"
```

Claude will walk you through a clarification step (to nail down scope), then handle everything automatically.

**Under the hood**, Claude follows a numbered sequence of "Recipes" defined in `docs/2_EXECUTION_RECIPES.md`:

| Recipe | What it does |
|---|---|
| Recipe 0 | Installs any missing Python packages |
| Recipe 1 | Checks if local cached data is fresh enough to reuse |
| Recipe 3 | Fetches fresh data from the official source |
| Recipe 6 | Validates the fetched data against the schema |
| Recipe 8 | Writes the JS/TS module files |
| Recipe 8-Go | Writes the Go module files |

You don't need to call these manually — Claude does it. The docs are there if you're debugging or extending the skill.

---

## Running the tests

The `evals/` folder contains automated tests that verify the skill itself behaves correctly. Run them all:

```bash
source venv/bin/activate
bash .claude/skills/utility-creator/evals/run_evals.sh
```

Or run a specific test file:

```bash
# Test that the full lifecycle works end-to-end (slowest, most thorough)
python3 -m pytest .claude/skills/utility-creator/evals/test_functional.py -v

# Test that generated files are valid TypeScript + Go (runs gofmt)
python3 -m pytest .claude/skills/utility-creator/evals/test_execution_harness.py -v

# Test data quality with a score report
python3 -m pytest .claude/skills/utility-creator/evals/test_output_quality.py -v --report
```

### What each test file checks

| File | Plain-English description |
|---|---|
| `test_synonyms.py` | "currencies" → "currency_codes": does the alias system work? |
| `test_cache_routing.py` | Fresh data is reused; stale or missing data triggers a new fetch |
| `test_data_precision.py` | Fetched values match the real-world ground truth (e.g. JPY minor_unit = 0) |
| `test_scoring.py` | T1 sources score higher than T2; T3 is rejected outright |
| `test_recipe8_structure.py` | Generated TS files have `export`, `as const`, `withErrorBoundary`, etc. |
| `test_output_quality.py` | JSON schema validity + TypeScript type exports + Go struct names |
| `test_functional.py` | Invoke the full skill with a Japan/JPY fixture; check every output file |
| `test_execution_harness.py` | Generate real files in a temp dir; run `gofmt -e` and `tsc --noEmit` on them |

---

## Using the scrapers directly

If you want to fetch data without going through Claude, you can call the scrapers directly.

**Interactive menu (easiest):**

```bash
source venv/bin/activate
python3 .claude/skills/utility-creator/tools/cli.py
# Shows a menu — pick a topic, it fetches and validates the data
```

**Fetch a specific topic from the web:**

```bash
python3 .claude/skills/utility-creator/tools/crawlers/crawl4ai_runner.py --topic currency
```

**Fetch from a PDF source (e.g. OECD report):**

```bash
python3 .claude/skills/utility-creator/tools/crawlers/pdf_scraper.py \
  --url https://example.com/oecd-report.pdf \
  --topic vat_rates_global
```

**Let the router pick the right scraper automatically:**

```bash
python3 .claude/skills/utility-creator/tools/crawlers/skill_router.py --topic corporate_tax_rates
```

**Validate a data file you already have:**

```bash
python3 .claude/skills/utility-creator/tools/crawlers/validate.py \
  --file i18nify-data/currency/data.json \
  --topic currency
```

---

## Source traceability

Every `data.json` file generated by this skill includes a `_source` block at the top level. This tells you exactly where the data came from:

```json
{
  "_source": {
    "name": "ISO 4217",
    "url": "https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml",
    "tier": 1
  },
  "currency_information": { ... }
}
```

The same `_source` block is embedded in the Go-side `data/data.json` so traceability is consistent across both languages.

---

## Supported topics

| Topic name | What it is | Where data comes from | Countries/entries |
|---|---|---|---|
| `currency_codes` | ISO currency codes, symbols, minor units | ISO 4217 XML via SIX Group | ~180 currencies |
| `http_status_codes` | HTTP response codes and descriptions | IANA HTTP Status Code Registry | All registered |
| `corporate_tax_rates` | Corporate income tax rates by country | OECD SDMX REST API | ~112 countries |
| `vat_rates_global` | VAT / GST / consumption tax rates | OECD Consumption Tax Trends 2024 | ~75 countries |
| `address_formats` | Postal address field ordering per country | Universal Postal Union PDF | 190+ countries |

For full details — TTLs, fallback sources, synonyms — see [`docs/1_REGISTRY_AND_TIERS.md`](./docs/1_REGISTRY_AND_TIERS.md).

---

## Security dependency updates (also in this PR)

This PR also bumps several npm and Node.js versions to fix known CVEs:

| What was updated | Old version | New version | Issue fixed |
|---|---|---|---|
| `@playwright/test` | < 1.55.1 | 1.60.0 | CVE-2025-59288 — macOS installer used `curl -k` (no TLS verification) |
| `js-yaml` | 3.x / 4.x | 3.14.2 / 4.2.0 | Prototype pollution vulnerability |
| `rollup` | ^4.0.2 | ^4.59.0 | Arbitrary file write (CVE range 4.0.0–4.58.0) |
| `vite` | ^4.4.11 | ^6.4.2 | `fs.deny` bypass (CVE range ≤ 6.4.1) |
| `esbuild` | < 0.28.1 | 0.28.1 | CVE fixed via yarn resolutions |
| Node.js in CI | 20.3.1 | 20.19.1 | Required by vite ^6 and `@vitejs/plugin-react-swc` ^4 |

---

## Reference docs

| I want to… | Read this file |
|---|---|
| Find the right source for a topic / understand tiers | [`docs/1_REGISTRY_AND_TIERS.md`](./docs/1_REGISTRY_AND_TIERS.md) |
| Understand or debug a specific Recipe step | [`docs/2_EXECUTION_RECIPES.md`](./docs/2_EXECUTION_RECIPES.md) |
| Understand how sources are scored or how the output widget looks | [`docs/3_SCORING_AND_UI.md`](./docs/3_SCORING_AND_UI.md) |
| Handle a fetch failure or an unreachable source | [`docs/4_ERROR_HANDLING.md`](./docs/4_ERROR_HANDLING.md) |
