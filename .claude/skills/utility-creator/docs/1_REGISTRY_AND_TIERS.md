# Technical Source Finder — Registry & Tiers

This file is a supplement to the root [`SKILL.md`](../SKILL.md).
It contains Section 1 (Tier system), Section 2 (Source registry), and Section 2-B (Pre-fetch cache resolver).

---

## Section 1 — Tier system

### Tier 1 — Official (always prefer)

Maintained directly by the standards body that owns the data. Authoritative by mandate.

| Body | Domain | Owns |
|---|---|---|
| ITU | itu.int | Phone number formats, E.164 calling codes |
| ISO | iso.org | Currency codes (ISO 4217), country codes (ISO 3166), language codes (ISO 639) |
| IANA | iana.org | Timezone database, TLD / ccTLD list, IP allocations |
| Unicode / CLDR | unicode.org | Currency display formats, number formatting, locale data |
| SIX Group | six-group.com | ISO 4217 currency XML (delegated by ISO) |
| Google i18n | chromium-i18n.appspot.com | Address formats per country |
| W3C | w3.org | HTML, CSS, HTTP specs |
| IETF | ietf.org, datatracker.ietf.org | Internet standards — RFC 5322, RFC 3339 etc |

### Tier 2 — Official-derived (FALLBACK ONLY — use ONLY when T1 is inaccessible, paywalled, or non-machine-readable)

Directly packages or mirrors Tier 1 data with clear citation chain. Actively maintained.

**These sources are last-resort fallbacks. If a machine-readable T1 source exists for the topic, Tier 2 must be completely ignored and excluded from fetching. Never choose T2 for convenience.**

| Source | Upstream | Packages |
|---|---|---|
| restcountries.com/v3.1 | ISO 3166 | Country name, codes, currencies, languages |
| datahub.io/core/currency-codes | SIX Group / ISO 4217 | Currency codes, numeric codes, minor units |
| datahub.io/core/top-level-domain-names | IANA Root Zone DB | All TLDs with type and sponsor |
| datahub.io/core/language-codes | ISO 639 | Language codes and names |
| unpkg.com/libphonenumber-js | ITU E.164 + Google | Example mobile numbers per country |
| github.com/google/libphonenumber | ITU E.164 + Google | Full phone format patterns |
| github.com/commerceguys/addressing | Google i18n Address Data | Address formats for 200+ countries — fallback if Google i18n appspot is inaccessible |
| github.com/OpenCageData/address-formatting | Multiple postal authorities | Address templates per country — fallback if all T1 address sources are blocked |

### Tier 3 — Community (NEVER USE)

Random GitHub repos, gists, blog posts, npm packages without cited upstream. Excluded regardless of popularity. Star counts don't matter — provenance does.

### Classification criteria

| Criterion | T1 | T2 | T3 |
|---|---|---|---|
| Maintained by the standards body itself | yes | no | no |
| Cites an upstream Tier 1 source | n/a | yes | no/unclear |
| Actively maintained (last update <2yr) | usually | yes | varies |
| Open to community edits without review | no | no | yes |

Tier is per-topic, not per-domain. Wikipedia is T3 for ISO currency codes but arguably T2 for "list of UN member states" (UN itself updates the article). Always classify against the specific topic, not the domain.

### Tier values used in scoring

| Tier | Score |
|---|---|
| T1 (official) | 1.0 |
| T2 (mirror, fresh) | 0.7 |
| T2 (mirror, stale >2yr) | 0.5 |
| T3 (rejected before scoring) | 0.3 |

### Tier 1 scraping policy (strict)

If a Tier 1 source exists for the topic, it MUST be scraped using the Crawl4AI runner (Recipe 3). Do NOT fall back to Tier 2 mirrors for convenience.

**Pragmatic Fallback Rule — Tier 2 sources may ONLY be used if the Tier 1 source is completely inaccessible, paywalled (like ITU), or non-machine-readable. If a machine-readable Tier 1 source exists, Tier 2 must be completely ignored and excluded from fetching.**

- **T1 accessible and machine-readable** → use Recipe 3 to scrape it directly. Tier 2 is excluded entirely.
- **T1 is a PDF, paywalled, or non-machine-readable** → Tier 2 fallback is permitted. Use the best Tier 2 source listed in Section 2 for that topic. Note the fallback in the widget.
- **T1 not found for this topic** → route to Section 8 response.

Tier 2 mirrors are listed in Section 2. They are ONLY consulted as a last resort when the Pragmatic Fallback conditions above are met.

---

## Section 2 — Source registry (topic → sources map)

Pre-computed mapping for the top topics. When a query matches one of these, skip web search and go directly to fetching. Match queries against synonyms with lowercase substring matching.

### currency_codes
Synonyms: `iso 4217`, `currency codes`, `currency list`, `world currencies`, `currency symbols`
- T1: SIX Group XML — `https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml`
- T1: Unicode CLDR currency names — `https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-numbers-full/main/en/currencies.json`
- T1: Unicode CLDR currency fractions — `https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-core/supplemental/currencyData.json`
- Expected coverage: ~180 active codes

### country_codes
Synonyms: `iso 3166`, `country codes`, `country list`, `cca2`, `cca3`
- T1: ISO OBP SPA — `https://www.iso.org/obp/ui/#search/code/` (requires Crawl4AI; see crawl4ai_runner.py `fetch_country_iso_obp()`)
- Expected coverage: 249 countries

### timezones
Synonyms: `iana timezones`, `timezone list`, `tz database`, `time zones`
- T1: IANA tzdata zone1970.tab — `https://raw.githubusercontent.com/eggert/tz/main/zone1970.tab`
- Expected coverage: 600+ identifiers

### phone_calling_codes
Synonyms: `phone codes`, `calling codes`, `country dial codes`, `e.164`, `phone country code`
- T1: ITU E.164 — `https://www.itu.int/pub/T-SP-E.164D` (PDF/paywalled — no machine-readable T1 exists)
- T1-derived fallback: Google i18n libphonenumber metadata — `https://raw.githubusercontent.com/google/libphonenumber/master/resources/PhoneNumberMetadata.xml` (published and maintained by Google i18n team; accepted as T1-derived under strict policy)
  - **Fallback condition met**: ITU T1 is paywalled and non-machine-readable → T1-derived fallback is permitted per the Pragmatic Fallback Rule.
- T2 fallback (last resort only): `unpkg.com/libphonenumber-js` or `datahub.io/core/language-codes` — only if libphonenumber XML is also inaccessible.
- Note: ITU E.164 is not machine-readable. Use `--input` mode with a manually downloaded ITU document, or use the Google i18n libphonenumber XML which is the authoritative T1-derived source.
- Expected coverage: 240 country codes

### tld_list
Synonyms: `tld`, `tlds`, `top level domains`, `cctld`, `domain extensions`
- T1: IANA TLD list — `https://data.iana.org/TLD/tlds-alpha-by-domain.txt`
- Expected coverage: 1500+ TLDs

### language_codes
Synonyms: `iso 639`, `language codes`, `language list`, `locale codes`
- T1: Unicode CLDR territoryInfo — `https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-core/supplemental/territoryInfo.json`
  - Note: keyed by ISO 3166-1 alpha-2 country code → official ISO 639-1 language codes (country-to-languages mapping)
- Expected coverage: 249 countries


### address_formats
Synonyms: `address format`, `postal address`, `country address`, `address per country`
- T1: Google i18n — `https://chromium-i18n.appspot.com/ssl-address/data` (root endpoint enumerates all countries; per-country: `…/data/{CC}`)
  - Note: dynamic multi-page JSON API; see crawl4ai_runner.py `fetch_address_google_i18n()` for batch scrape implementation
- T2 fallback (last resort only): `github.com/OpenCageData/address-formatting` YAML — only if Google i18n appspot is completely inaccessible or returns no data. **Do NOT use as primary source.**
- Expected coverage: 240+ countries

### postal_codes
Synonyms: `postal codes`, `zip codes`, `postcode format`
- T1: UPU — paywalled, not machine-readable. No accessible T1 source exists → Section 8 response.

### currency_display
Synonyms: `currency format`, `currency symbol`, `currency display`, `cldr currency`
- T1: CLDR JSON — `https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-numbers-modern/main/en/numbers.json`
- Expected coverage: 700+ locales

### http_status_codes
Synonyms: `http status`, `http codes`, `status codes`, `rfc 9110`
- T1: IANA registry — `https://www.iana.org/assignments/http-status-codes/http-status-codes.xml`
  - github_mirror: none (IANA XML; use pre-fetch pipeline)
- Expected coverage: 60+ codes

### mime_types
Synonyms: `mime types`, `media types`, `content types`, `iana media types`
- T1: IANA — `https://www.iana.org/assignments/media-types/media-types.xml`
- Expected coverage: 2000+ types

### unicode_blocks
Synonyms: `unicode blocks`, `unicode ranges`, `unicode characters`
- T1: Unicode.org — `https://www.unicode.org/Public/UNIDATA/Blocks.txt`

### iban_formats
Synonyms: `iban`, `iban format`, `bank account format`
- T1: SWIFT IBAN registry — `https://www.swift.com/standards/data-standards/iban`

### email_syntax
Synonyms: `email format`, `email syntax`, `rfc 5322`, `email validation`
- T1: RFC 5322 — `https://datatracker.ietf.org/doc/html/rfc5322`

### gst_rates_india
Synonyms: `india gst`, `gst rates`, `hsn code gst`, `gst india`, `gstin tax`, `indian tax rates`, `hsn chapter rates`, `sac gst`, `gst percentage india`
- T1: CBIC chapter-wise rate schedule PDF — `https://cbic-gst.gov.in/pdf/chapter-wise-rate-wise-gst-schedule-18.05.2017.pdf`
  - Official PDF published by CBIC (Central Board of Indirect Taxes and Customs) listing all HSN chapters with applicable GST rates (Nil / 5% / 12% / 18% / 28%).
  - Columns: S.No. | Chapter | Nil | 5% | 12% | 18% | 28%
  - Use `crawl4ai_runner.py --topic gst` which downloads the PDF directly via `fetch_gst_india()` and parses it with `parse_gst_india()` using PyMuPDF.
  - Requires `PyMuPDF` (`pip install PyMuPDF`) in the venv.
  - Landing page (for Referer header): `https://cbic-gst.gov.in/gst-goods-services-rates.html`
- Expected coverage: ~81 HSN chapters (2017 base schedule; chapters with highly heterogeneous sub-heading rates show "Varies")
- Note: The CBIC HSN/SAC search API (`https://services.gst.gov.in/services/searchhsnsac`) was previously used but is rate-limited and does not expose chapter-level rate breakdowns. The PDF is the primary T1 source.

### population_data
Synonyms: `population`, `pop`, `world population`, `population counts`, `population growth`, `population by country`
- T1: UN World Population Prospects 2024 (gzip'd CSV) — `https://population.un.org/wpp/Download/Files/1_Indicator%20(Standard)/CSV_FILES/WPP2024_TotalPopulationBySex.csv.gz`
- T1 fallback: World Bank Open Data API (SP.POP.TOTL + SP.POP.GROW) — `https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&mrv=1&per_page=300`
  - **Fallback condition**: UN WPP gzip may be blocked by Cloudflare or have temporary download issues.
  - Growth rate fetched from a second endpoint: `https://api.worldbank.org/v2/country/all/indicator/SP.POP.GROW?format=json&mrv=1&per_page=300`
- Expected coverage: ~217 sovereign countries (ISO 3166-1 alpha-2)
- TTL: 365 days (annual release cadence)

### corporate_tax_rates
Synonyms: `corporate tax rates`, `cit rates`, `corporate income tax`, `company tax rates`, `statutory tax rates`, `corporate tax by country`, `tax rates by country`
- T1: OECD SDMX REST API — `https://sdmx.oecd.org/public/rest/data/OECD.CTP.TPS,DSD_TAX_CIT@DF_CIT,1.0/all?format=csv`
  - Filter MEASURE=CIT for standard statutory rate; take most recent year per country.
  - Use `crawl4ai_runner.py --topic corporate_tax` which downloads via `fetch_corporate_tax()` and parses with `parse_corporate_tax()`.
- Expected coverage: ~112 jurisdictions (2024–2025 OECD Inclusive Framework members)
- Note: Alpha-3 REF_AREA codes are enriched to alpha-2 (cc) + country_name in the parse step.

### vat_rates_global
Synonyms: `vat rates`, `gst rates global`, `standard vat rate`, `value added tax rates`, `indirect tax rates`, `consumption tax rates global`, `global tax rates`
- T1: OECD Consumption Tax Trends 2024 (Table 2.A.1) — compiled static dataset from https://www.oecd.org/en/topics/sub-issues/tax-policy/tax-database.html
  - Use `crawl4ai_runner.py --topic vat_global` which returns authoritative static data via `fetch_vat_global()` / `parse_vat_global()`.
  - OECD SDMX API has no dedicated VAT-rates dataflow; data is compiled from T1 OECD + EC TEDB publications.
  - Covers ~75 jurisdictions: all OECD members, EU, G20, and key emerging markets (Razorpay footprint).
- Expected coverage: ~75 countries (standard rate only; granularity=summary)
- TTL: 365 days (OECD annual publication cadence)
- Coverage gap: Non-OECD/non-G20 countries not included. Use `gst_rates_india` for India HSN detail.

### payment_translations

Synonyms: `payment translations`, `payment ui strings`, `payment labels`, `localized payment text`, `checkout translations`, `payment screen strings`

- **No T1/T2 source exists.** No standards body maintains translated application UI strings for payment flows.
- Route to Section 8. Do NOT search CLDR — `cldr-localenames-modern` contains language *names* only, not payment UI strings. This is a known wrong attribution; reject it immediately.
- If the user explicitly wants to proceed with hand-curated or AI-assisted translations after seeing the Section 8 response, use `"tier": "hand-curated"` in `_source` and surface this clearly. See the TRANSLATION & LOCALIZED UI STRINGS RULE in SKILL.md.

---

### Unknown topic — research hunt

If the query doesn't match any known topic, the registry is not your ceiling — it is just a cache of previously solved topics. Activate the **Section 13 research protocol**:

1. Run targeted web searches to find the official T1/T2 source
2. Classify every result against the tier criteria (discard T3 immediately)
3. If a valid source is found → produce a Section 13 registry-addition proposal
4. Only if exhaustive searching yields nothing → route to Section 8 "no trustable source" response

Do NOT route to Section 8 until Section 13 has been fully executed.

---

## Section 2-B — Pre-fetch cache resolver

### Purpose

Corporate sandbox policies block many T1/T2 canonical domains at the network
egress layer (not CORS — a proxy-level 403 before the request reaches the
target server). A companion pipeline (`prefetch.py`) runs outside the sandbox
on an unrestricted machine, fetches those sources, and pushes normalised JSON
to a GitHub repo you own. Because `raw.githubusercontent.com` is on the
sandbox allowlist, the skill can always read back from that repo.

### Configuration

Set these two values once when deploying the skill:

```
PREFETCH_REPO   = "razorpay/i18nify"      # GitHub repo owner/name
PREFETCH_BRANCH = "master"                 # branch where pipeline pushes data
```

Manifest URL:
```
https://raw.githubusercontent.com/{PREFETCH_REPO}/{PREFETCH_BRANCH}/data/manifest.json
```

### Resolver algorithm (runs as Step 3 in Section 6, after topic is resolved)

PRECONDITION: canonical topic key is already known from Step 1.
(e.g. "Swiss money" → "currency_codes" via synonym matching in Step 1)

```
Step 3 — Pre-fetch cache resolver

  a. Fetch manifest.json from the GitHub cache repo (10s timeout).
     URL: https://raw.githubusercontent.com/{PREFETCH_REPO}/{PREFETCH_BRANCH}/data/manifest.json

  b. Parse manifest. Look up manifest.topics[topic]:

     if topic entry exists AND manifest.topics[topic].ok == true:
       cache_url  = manifest.topics[topic].raw_url
       cache_age  = (now − manifest.generated) in days   ← ISO timestamp diff
       topic_ttl  = TTL from Section 5 TTL table (e.g. 30d for currency_codes)

       if cache_age <= topic_ttl:
         ── CACHE HIT ──
         Fetch cache_url (raw JSON envelope). 10s timeout.
         Extract sources from envelope.sources[].
         For each source entry:
           tier       ← envelope.sources[n].meta.tier
           url_used   ← envelope.sources[n].meta.url_used
           via_github ← envelope.sources[n].meta.via_github
           data       ← envelope.sources[n].data
         Skip Step 4 (live fetch).
         Proceed to Step 5 (normalise) using this data.

       else:
         ── CACHE STALE ──
         Log internally: "cache stale (age={cache_age}d > ttl={topic_ttl}d)"
         Fall through to Step 4 (live fetch attempt).

     else:
       ── CACHE MISS ──
       topic not in manifest or ok=false
       Fall through to Step 4 (live fetch attempt).

  c. If manifest.json itself fails to fetch (timeout, 404, parse error):
     Fall through to Step 4 (live fetch attempt).
     Do NOT abort — pipeline may not be deployed yet.
     Do NOT surface this error to the user.
```

### Tier classification for cache hits

Cache data inherits the tier of its **original source**, not the GitHub
delivery URL. GitHub is a delivery mechanism, not a data authority.

```
envelope.sources[n].meta.tier == 1  →  treat as T1 in scoring
envelope.sources[n].meta.tier == 2  →  treat as T2 in scoring
```

Always display the original canonical source URL in the widget, with a note
that data was served from cache. Never show the GitHub cache URL as the source.

### Freshness score for cache hits

Apply a linear decay multiplier so a just-refreshed cache scores identically
to a live fetch, and a cache at TTL boundary scores 0.5× freshness:

```python
cache_freshness = max(0.5, 1.0 - (cache_age_days / topic_ttl_days) * 0.5)
```

Substitute this value for the `freshness` factor in the Section 3 formula.

### Conflict detection with mixed-age cache entries

If two sources in the same envelope have `fetched_at` timestamps more than
7 days apart, add a widget warning:

```
"Conflict detection may be unreliable — cache sources have different fetch
timestamps (delta: {days}d). Re-run: python prefetch.py --topics {topic} --push"
```

### Widget note when serving from cache

Add this to the amber info banner in the widget:

```
Pre-fetched data · cached {cache_age_human} ago
Original source: {canonical_url}  (blocked by sandbox policy)
Refresh: python prefetch.py --push --topics {topic}
```

---
