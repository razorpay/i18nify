---
name: utility-creator
description: Use when asked to generate, scaffold, or create an i18nify utility module for a technical reference topic (currency, country, phone, address, TLD, language, HTTP status, MIME types, timezones, unicode blocks). Fetches authoritative data, scores sources, and writes JS/TS and Go module files directly to the repo.
user-invocable: true
allowed-tools:
  - Bash(pip install *)
  - Bash(python3 *)
  - WebSearch
  - WebFetch
---

# Utility Creator

Fetch authoritative reference data, score it, and write complete i18nify JS/TS + Go module files directly to the repo. Output a single interactive widget and a scoring diagnostic, then scaffold the module if requested.

## Agent quick start

**Verify the pipeline works first** (takes ~5 s, uses `http_status_codes` as the probe topic):

```bash
cd "$(git rev-parse --show-toplevel)"
bash .claude/skills/utility-creator/smoke.sh
# → SMOKE_OK|http_status_codes|pipeline verified end-to-end
```

**Prerequisites** — venv must be present at repo root. Activate before any Recipe:

```bash
source venv/bin/activate   # required — crawl4ai_runner.py and PyMuPDF live here
```

**To run the skill** — follow Section 6 below. Start at Step 0 (clarification gate), then Step 1 (topic resolution), then Step 3 (Recipe 0 + Recipe 1).

**Canonical data paths** — many topics' data files only exist after `crawl4ai_runner.py` has fetched them at least once. Recipe 1 checks local file age; on `CACHE_MISS` or `CACHE_STALE` it falls through to Recipe 3 which fetches and writes the file.

**Docs navigation** — most content is split across four reference files. Read only the one you need:

| Task | File |
|---|---|
| Find source URLs, tier rules, topic synonyms | [`docs/1_REGISTRY_AND_TIERS.md`](./docs/1_REGISTRY_AND_TIERS.md) |
| Run any Recipe (0–8-Go), utility generation, unknown-topic research | [`docs/2_EXECUTION_RECIPES.md`](./docs/2_EXECUTION_RECIPES.md) |
| Render the widget, scoring formula, conflict handling, diagnostics | [`docs/3_SCORING_AND_UI.md`](./docs/3_SCORING_AND_UI.md) |
| Handle Recipe errors, Tracebacks, halt-and-display protocol | [`docs/4_ERROR_HANDLING.md`](./docs/4_ERROR_HANDLING.md) |

## Trigger conditions

Activate on phrases like: "find sources for", "get data links for", "find an API for", "give me links for", "best source for", "live data for", "fetch [technical topic]", or any request to retrieve structured technical reference data.

Do NOT activate for: general programming help, debugging, opinion questions, non-technical reference data (food, sports, entertainment), or anything not backed by a standards body.

## Phase 0 — Clarification Gate (runs before any data fetching)

### Step 0-A: Internal assessment

Before touching any Recipe, internally check the four parameters against the user's request:

| Parameter | What to check | Example ambiguity |
|---|---|---|
| **Geographical scope** | Global, country-specific, or regional? | "phone codes" (global) vs "phone codes for Southeast Asia" (regional) |
| **Domain/industry context** | General standard or niche-specific? | "address formats" (general) vs "address formats for healthcare billing" (niche) |
| **Data type/granularity** | Dataset, API spec, compliance doc, whitepaper? | "tax data" is vague; "VAT regex patterns per EU country" is clear |
| **Timeframe/version** | Latest, historical, or specific version? | "RFC" alone could mean any version |

### Step 0-B: Act on the assessment

**If ALL four parameters are clearly determined** (either stated explicitly or unambiguously implied by the topic — e.g., "ISO 4217 currency codes" implies global scope, dataset type, and current version):

→ **Bypass clarification entirely.** Proceed directly to Section 6, Step 1.

**If ANY parameter is missing AND matters for this topic:**

→ **Ask only the specific missing question(s).** Halt all execution and wait for the user's reply. Do not begin Section 6 until the reply is received.

**Example clarifying questions** (adapt phrasing to context, ask only what's actually unclear):
- "To get you the right data — is this global or for a specific country/region?"
- "Are you looking for raw datasets, API documentation, or regulatory/compliance guidelines?"
- "Do you need the current standard or a specific historical version?"

> **Rule:** Never ask about a parameter that is obviously implied by the topic. "Currency codes" is inherently global and dataset-typed — skip those questions entirely and proceed.

### Step 0-C: Vague topic router (output format / depth gate)

Before executing any Recipe, evaluate the user's prompt for **output intent**.

If the user provides **only a broad topic** (e.g., *"India GST"*, *"Telecom codes"*) **without specifying** the desired output format or data depth, **DO NOT scrape the data yet.** Instead, halt execution and present the following clarification menu:

---

**Clarification Menu**

I see you want to work with **[topic]**. To make sure I get you exactly what you need, how would you like me to process this?

**1. Choose your depth:**
- **[A]** High-level summaries (Broad categories, e.g. 2-digit chapter codes)
- **[B]** Granular, specific line items (Exact data, e.g. 6-8 digit HSN codes)

**2. Choose your output:**
- **[1]** Fetch the raw data (JSON/CSV)
- **[2]** Generate a data schema (Pydantic / TypeScript)
- **[3]** Build a Python utility script to process this data
- **[4]** Produce a Markdown summary report

Please reply with your choices (e.g., *"B and 2"* or *"A, 1, and 3"*).

---

Once the user replies, map their choice to the pipeline parameters below and **only then** proceed to Section 6, Step 1.

| User choice | Pipeline parameter |
|---|---|
| **A** (high-level) | `granularity="summary"` — broad regex patterns, chapter-level aggregates |
| **B** (granular) | `granularity="item"` — exact line items, strict `^\d{6,8}$` filters |
| **1** (raw data) | `output_mode="data"` — run full Recipes 0-7, emit widget |
| **2** (schema) | `output_mode="schema"` — run Recipes 0-3, skip widget, emit Pydantic/TS |
| **3** (utility) | `output_mode="utility"` — run Recipes 0-7 + Recipe 8, emit generated files |
| **4** (report) | `output_mode="report"` — run Recipes 0-3, emit Markdown summary |

> **Rule:** The clarification menu is a **single-shot gate**. Present it once. If the user ignores the menu and re-states a vague query, treat the second query as the same vague topic and re-present the menu. Never silently default to a granularity or output mode — that causes the 2-digit vs 8-digit data mismatch.

## Core principle

Source quality is guaranteed by the tier system — never recommend Tier 3 community sources when Tier 1 or Tier 2 exist. The output is exactly ONE thing: a live interactive widget. No sources tables, no API blocks, no JSON dumps in the response.

## DATA PRECISION RULE — ENFORCED ON ALL PIPELINE OUTPUTS

The pipeline must never output standalone shortcodes. Every shortcode must be
accompanied by its full human-readable English name in the same object:

| Shortcode field | Required companion field |
|---|---|
| `cc` (country code) | `country_name: str` |
| `alpha2` / `alpha3` (language code) | `english: str` |
| `languages: [str]` list | Must be `[{code, name}]` — never bare strings |
| ISO 4217 `code` (currency) | `name: str` |

This rule is enforced by `enrich_row()` in `tools/crawlers/crawl4ai_runner.py`
and by the Pydantic schemas in `schemas/i18nify_schemas.py`. Any Recipe 8
generated utility file will automatically reflect these enriched fields because
it derives its data from the canonical `i18nify-data/{topic}/data.json` output.

### MISSING FIELDS & ANTI-MORPHING

If the authoritative source does not contain specific data fields the user explicitly requested, you must NEVER morph, fabricate, or guess the missing data to fulfill the prompt. You must output the widget using only the verified data the source actually provides.

- **Do not** fill gaps by pulling columns from a Tier 3 community source.
- **Do not** derive or infer a missing field from related fields (e.g., computing a calling code from a country name).
- **Do not** silently omit the fact that requested fields are absent — surface the gap explicitly via the Missing Data Clarification Menu (Section 7, `docs/3_SCORING_AND_UI.md`).

---

## MANDATORY EXECUTION CONSTRAINT — READ BEFORE ANYTHING ELSE

When this skill activates, the ONLY permitted way to fetch, parse, or score data is by running the numbered Recipes in Section 2-C via bash_tool, in the exact order defined in Section 6.

**These actions are STRICTLY PROHIBITED once this skill activates for a KNOWN registered topic:**
- Exploring GitHub repos manually (checking file structures, reading PHP source, grepping raw files)
- Using web_search or web_fetch to **fetch or parse data** for a topic that is already in the registry (use Recipes instead — canonical domains may be blocked)
- Writing ad-hoc curl, wget, or requests code outside of the Recipes
- Attempting to parse or extract data from any file not written by a Recipe
- Deciding a Recipe "won't work" and inventing an alternative approach
- Skipping Recipe 0 (dependency install) before running any other Recipe
- Proceeding past Step 3 without having run Recipe 0 and Recipe 1 first

**Exception — unknown topics:** When a topic is NOT in the registry, web_search and web_fetch are the correct tools for source discovery. See Section 13 for the mandatory research protocol. The prohibition above applies only after a topic key has been matched in Section 2.

If a Recipe fails or returns an unexpected output, follow the exact fallback path specified in Section 6 for that Recipe's output — do not invent a new approach.

The Recipes exist precisely because canonical domains are blocked for known topics. Attempting to reach those domains via any other method will produce the same 403. Run the Recipes.

---

## Section 1 — Tier system

> **AGENT INSTRUCTION:** The tier system has been moved. You MUST read [docs/1_REGISTRY_AND_TIERS.md](./docs/1_REGISTRY_AND_TIERS.md) for T1/T2/T3 definitions, classification criteria, and the Pragmatic Fallback Rule before selecting or rejecting any source.

---

## Section 2 — Source registry (topic → sources map)

> **AGENT INSTRUCTION:** The source registry has been moved. You MUST read [docs/1_REGISTRY_AND_TIERS.md](./docs/1_REGISTRY_AND_TIERS.md) for the full topic → URL mapping (currency, country, TLD, phone, language, address, HTTP status, MIME, unicode, GST, and more) and synonym matching rules.

---

## Section 2-B — Pre-fetch cache resolver

> **AGENT INSTRUCTION:** The pre-fetch cache resolver algorithm has been moved. You MUST read [docs/1_REGISTRY_AND_TIERS.md](./docs/1_REGISTRY_AND_TIERS.md) for the manifest URL, resolver algorithm, tier classification for cache hits, freshness scoring, and widget cache banner text.

---

## Section 2-C — Concrete execution recipes

> **AGENT INSTRUCTION:** All numbered Recipes (0 through 8-Go) have been moved. You MUST read [docs/2_EXECUTION_RECIPES.md](./docs/2_EXECUTION_RECIPES.md) to execute any data retrieval. Do NOT attempt to write ad-hoc fetch code — copy the exact Recipe blocks from that file.

---

## Section 3 — Scoring model / Section 4 — Conflict handling / Section 5 — Performance

> **AGENT INSTRUCTION:** The scoring formula, conflict detection rules, tie-breaking logic, and performance optimisations have been moved. Read [docs/3_SCORING_AND_UI.md](./docs/3_SCORING_AND_UI.md) when computing scores, handling conflicts, or applying TTL/freshness logic.

---

## Section 6 — Workflow

**MANDATORY. Every step must be executed in order. Do not skip steps. Do not substitute ad-hoc code for a Recipe. If you have not run Recipe 0 yet, STOP and run it now before reading further.**

Each step has a GATE — a condition that must be true before the next step begins. If the gate condition is not met, follow the specified fallback. Never proceed past a gate by assuming it passed.

Step 0 — Clarification gate (Phase 0).
  Run the Phase 0 assessment from the section above.
  ── GATE: All four parameters are clear OR clarifying questions have been answered. ──
  ── Do NOT proceed to Step 1 until this gate is met. ──

Step 1 — Topic resolution.
  Normalise query (lowercase, strip whitespace).
  Match against synonyms in Section 2. This produces the canonical topic key
  (e.g. "Swiss money" → "currency_codes", "address format" → "address_formats").
  Unmatched → fall through to web search fallback queries from Section 2.
  ── GATE: topic key is now defined. Substitute it as {TOPIC_KEY} in all Recipes. ──
  ── Do NOT proceed to Step 2 until {TOPIC_KEY} is set. ──

Step 2 — In-session cache check.
  Hash the resolved topic key, check in-session memory.
  GATE: Hit and not expired → return cached result immediately. STOP. Do not run any Recipe.
  GATE: Miss or expired → continue to Step 3.

Step 3 — MANDATORY: Run Recipe 0, then Recipe 1 via bash_tool.
  ── STOP. Do not proceed until you have run Recipe 0 (pip install). ──
  Run Section 2-C **Recipe 0** via bash_tool (installs deps). Run once per session.
  Run Section 2-C **Recipe 1** via bash_tool. Substitute {TOPIC_KEY} literally.
  Read stdout character by character. The first token on the line determines routing:
    Starts with CACHE_HIT    → take the CACHE_HIT path below. Do NOT run Step 4.
    Starts with CACHE_STALE  → continue to Step 4.
    Starts with CACHE_MISS   → continue to Step 4.
    Starts with CACHE_ERROR  → continue to Step 4. Do not surface the error.

  CACHE_HIT path (skip Step 4 entirely):
    Extract {CACHE_ENVELOPE_URL} from the CACHE_HIT line (second pipe-delimited field).
    Run Section 2-C **Recipe 2** via bash_tool. Substitute {CACHE_ENVELOPE_URL}.
    If Recipe 2 stdout contains ENVELOPE_OK → run Recipe 5. Go to Step 5.
    If Recipe 2 stdout contains ENVELOPE_ERROR → fall through to Step 4 as CACHE_MISS.

Step 4 — MANDATORY: Run Recipe 3 (Crawl4AI pipeline runner) via bash_tool.
  ── STOP. You are here because Step 3 produced CACHE_STALE/MISS/ERROR. ──
  ── Do NOT write ad-hoc fetch code. Do NOT use urllib/requests directly. Run Recipe 3. ──
  Run Section 2-C **Recipe 3** via bash_tool. Substitute {TOPIC_KEY} literally.

  Parse stdout for the terminal routing token:
    Contains RUNNER_OK|{pipeline_topic}:
      → crawl4ai_runner.py succeeded; canonical i18nify-data/{topic}/data.json is written.
      → Re-run Recipe 1 with the same {TOPIC_KEY} — it MUST now return CACHE_HIT|LOCAL:...
      → Extract {CACHE_ENVELOPE_URL} from the CACHE_HIT line.
      → Run Recipe 2 with {CACHE_ENVELOPE_URL}. If ENVELOPE_OK → run Recipe 5. Go to Step 5.
    Contains RUNNER_FAILED|...:
      → The pipeline could not fetch or validate data.
      → Return Section 8 "no trustable source" response.
    Contains RUNNER_ERROR|... or non-zero exit or Traceback:
      → Follow Section 11 halt-and-display rules immediately.
  ── GATE: /tmp/tsf_parsed.json must exist after Recipe 5 completes (written via Step 5 path). ──

Step 5 — Data is normalised.
  ── GATE: /tmp/tsf_parsed.json must exist (written by Recipe 5). ──
  ── If this file does not exist, something went wrong in Step 3 or 4 — do not continue. ──
  Schema confirmed: array of {tier, name, url, via_mirror, columns, rows, source_type, from_cache}.

Step 6 — MANDATORY: Run Recipe 6 via bash_tool.
  ── STOP. Do not compute scores manually. Run Recipe 6. ──
  Run Section 2-C **Recipe 6** via bash_tool. Substitute {TOPIC_KEY} literally.
  Parse stdout:
    MIXED_AGE_WARNING|... → set flag to add mixed-age banner in widget.
    SCORE_DONE|...        → extract winner name, score, conflict_count, from_cache.
  ── GATE: /tmp/tsf_result.json must exist after Recipe 6 completes. ──

Step 7 — MANDATORY: Run Recipe 7 via bash_tool.
  ── STOP. Do not read /tmp/tsf_result.json manually. Run Recipe 7. ──
  Run Section 2-C **Recipe 7** via bash_tool.
  Extract from stdout: topic, score, tier, source_name, source_url, rows, from_cache, conflict_count.

Step 8 — Render the live widget (see Section 7).
  Read /tmp/tsf_result.json for the full data to embed in the widget.
  If from_cache=True → include the cache banner defined in Section 2-B.
  If MIXED_AGE_WARNING was set → include the mixed-age warning.
  If conflict_count > 0 → include the expandable conflict panel.

Step 8.5 — Print scoring & diagnostics summary (see Section 9.5).
  Immediately after the widget, read /tmp/tsf_result.json and print the
  mandatory scoring diagnostic block defined in Section 9.5.

Step 9 — In-session cache write.
  Store result with topic-appropriate TTL from Section 5.
  Cache key: hash(topic_key).

---

## Section 7 — Output contract & Widget HTML template

> **AGENT INSTRUCTION:** The output contract, widget HTML template, scoring diagnostic bash snippet, and widget CSS/JS have been moved. Read [docs/3_SCORING_AND_UI.md](./docs/3_SCORING_AND_UI.md) to render the widget correctly (Section 7) and to print the scoring diagnostic after the widget (Section 9.5).

---

## Section 8 — When no trustable source exists

> **AGENT INSTRUCTION:** The "no trustable source" response template has been moved. Read [docs/3_SCORING_AND_UI.md](./docs/3_SCORING_AND_UI.md) (Section 8) for the exact response structure to use when neither T1 nor T2 exists.

---

## Section 9 — Edge cases / Section 9.5 — Scoring & Diagnostics Summary

> **AGENT INSTRUCTION:** Edge case handling rules and the scoring diagnostics summary bash snippet have been moved. Read [docs/3_SCORING_AND_UI.md](./docs/3_SCORING_AND_UI.md) (Sections 9 and 9.5).

---

## Section 10 — What this skill does NOT do / Section 11 — Error Transparency / Section 11.5 — Troubleshooting

> **AGENT INSTRUCTION:** Error handling rules, the halt-and-display protocol, and the troubleshooting guide have been moved. Read [docs/4_ERROR_HANDLING.md](./docs/4_ERROR_HANDLING.md) whenever a Recipe returns an unexpected error token, non-zero exit, or Traceback.

---

## Section 12 — i18nify Utility Generation / Section 13 — Handling Unknown Topics

> **AGENT INSTRUCTION:** Utility generation steps (Recipes 8 and 8-Go, barrel update, summary output) and the unknown-topic research protocol have been moved. Read [docs/2_EXECUTION_RECIPES.md](./docs/2_EXECUTION_RECIPES.md) (Sections 12 and 13) when the user requests utility scaffolding or when a topic is not in the registry.

---

## One-paragraph summary

**For known topics, all data retrieval is done exclusively by running the numbered Recipes in Section 2-C via bash_tool in the order defined in Section 6. For unknown topics, web_search and web_fetch are used to hunt for authoritative T1/T2 sources before any Section 8 failure is declared (Section 13).** Resolve the query to a canonical topic key via synonym matching (Step 1), check in-session cache (Step 2), then run Recipe 0 (pip install, once) and Recipe 1 (check local canonical `i18nify-data/…/data.json` → remote manifest) via bash_tool — if CACHE_HIT, run Recipe 2 + Recipe 5 and skip live fetching entirely; if CACHE_STALE/MISS/ERROR, run Recipe 3 (Crawl4AI pipeline runner — delegates to `tools/crawlers/crawl4ai_runner.py`, which fetches from canonical T1 sources, validates, and writes `i18nify-data/{topic}/data.json`); on RUNNER_OK re-run Recipe 1 (now returns CACHE_HIT|LOCAL) → Recipe 2 → Recipe 5; on RUNNER_FAILED return Section 8. **Tier 2 sources are ONLY used as a fallback when the T1 source is paywalled, non-machine-readable, or completely inaccessible (Pragmatic Fallback Rule, Section 1).** Run Recipe 6 (conflict detection + Model B scoring, cache_freshness substitution when from_cache), Recipe 7 (extract winner), then render the single live widget with score breakdown, conflict panel, and cache banner (Step 8), then print the scoring diagnostic block from Section 9.5 (Step 8.5). Write to in-session cache (Step 9). Output the widget followed by the scoring diagnostic and nothing else. **When the user additionally requests utility generation**, execute Section 12 (Steps A–D): determine PROJECT_ROOT, run Recipe 8 (JS/TS files) then Recipe 8-Go (Go files) to write all i18nify utility files directly to the filesystem (no code echoed to terminal), update `src/index.ts` barrel with the Edit tool, and output a summary table of JS + Go files written. Section 11 governs error transparency across all Recipes — halt and display raw errors on any unexpected failure token.
