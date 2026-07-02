# utility-creator — Scoring, UI & Output

This file is a supplement to the root [`SKILL.md`](../SKILL.md).
It contains Sections 3, 4, 5, 7, 8, 9, and 9.5.

---

## Section 3 — Scoring model (Model B)

### Formula

```
score = 100 × (
    0.35 × tier_authority
  + 0.15 × multiplicity
  + 0.15 × freshness
  + 0.15 × coverage
  + 0.10 × recurrence
  + 0.10 × independence
) × (1 − conflict_penalty)
```

Final range: 0–100. All factor values normalised to 0.0–1.0 before weighting.

### Why this formula

Tier authority carries the highest weight (0.35) because it's the only factor measuring signal-of-truth. Every other factor measures signal-of-agreement — and agreement is useless if the sources copied each other. Without tier weighting, ten SEO blogs would outscore one ISO standard.

Conflict is a multiplier, not a subtractor. An additive penalty lets a high base score absorb large disagreements. Multiplier collapses correctly: 100% disagreement → score 0.

### Computing each factor

tier_authority — Look up tier (Section 1). T1=1.0, T2 fresh=0.7, T2 stale=0.5.

multiplicity — Log-scaled count of sources that returned data (excluding T3).
```
multiplicity = min(1.0, log2(n_sources + 1) / 3)
```
1 src=0.33, 2=0.53, 3=0.67, 5=0.86, 7+=1.0. Log scale because the 1st-to-2nd source is more meaningful than the 5th-to-6th.

freshness — Linear decay against the topic TTL (same TTL table as the cache resolver).
```
cache_freshness = max(0.5, 1.0 - (age_days / topic_ttl_days) * 0.5)
```
A just-refreshed cache → 1.0. At the TTL boundary → 0.5. Never below 0.5.
For live fetches (not from cache), freshness is fixed at 0.97.

| Topic class   | TTL (days) | freshness at TTL boundary |
|---------------|-----------|--------------------------|
| ISO standards | 30        | 0.5                      |
| IANA registry |  7        | 0.5                      |
| Phone / addr  | 30        | 0.5                      |
| Live fetch    | n/a       | 0.97 (fixed)             |

coverage — Fraction of expected rows returned.
```
coverage = min(1.0, rows_returned / expected_rows)
```
Use expected counts from Section 2. If unknown topic, set expected = max rows seen across sources.

recurrence — Average of two parts.
- source_recurrence = `min(1.0, citations_count / 10)` — how many trusted sources cite this one upstream
- value_recurrence = fraction of fields where this source's value matches the most-common value
- recurrence = (source_recurrence + value_recurrence) / 2

independence — Fraction of agreeing sources with distinct upstreams.
```
independence = len(unique_upstreams) / len(agreeing_sources)
```
If 5 sources all cite Wikipedia → 0.2. If 5 cite 5 different standards bodies → 1.0. Catches echo-chamber agreement.

conflict_penalty — see Section 4.

### Worked example

Query: "ISO 4217 currency codes". Sources: SIX Group (T1), datahub.io (T2), restcountries (T2).

For SIX Group (winning source):

| Factor | Value | × Weight | Subtotal |
|---|---|---|---|
| tier_authority | 1.0 | 0.35 | 0.350 |
| multiplicity | 0.67 (3 sources) | 0.15 | 0.100 |
| freshness | 0.95 (8 months, iso class) | 0.15 | 0.143 |
| coverage | 1.0 (178/178) | 0.15 | 0.150 |
| recurrence | 0.85 | 0.10 | 0.085 |
| independence | 0.67 (2 distinct upstreams) | 0.10 | 0.067 |
| Base | | | 0.895 |

No conflicts → conflict_penalty = 0.
Final = 100 × 0.895 × (1 − 0) = 90 → 90/100, T1, six-group.com.

### Score classification

| Score | Class | UI color | Meaning |
|---|---|---|---|
| 85–100 | high | green | T1, fresh, complete, no conflicts |
| 65–84 | mid | amber | T2 mirror or older T1 |
| 0–64 | low | red | Stale, partial, conflicting, or T3 only |

---

## Section 4 — Conflict handling

### Detection — field-by-field, not source-by-source

Two sources can agree on 100 fields and disagree on 2 — only those 2 count.

```
For each (row_key, field) pair across all sources:
  values_seen = { source.value for each source reporting that field }
  if |values_seen| == 1 → field agrees
  if |values_seen| > 1 → field conflicts, record which sources hold which value
```

### Normalise before comparing

Avoid false-positive conflicts:
- Strip whitespace, lowercase strings (case-insensitive)
- Parse numbers (don't compare "5" string to 5 number)
- Strip leading + on phone codes
- Parse dates to ISO format

### Tie-breaking — which value wins (apply in order, stop at first that resolves)

Rule 1 — Tier priority. Highest-tier source wins. A T1 holding value X beats any number of T2/T3 sources holding Y.

Rule 2 — Majority within tier. If multiple sources at highest tier disagree, majority wins.

Rule 3 — Topic specificity. Prefer source whose mandate matches the topic:
- ITU wins over ISO for phone-related data
- ISO wins over IANA for country codes
- IANA wins over ISO for timezones
- Unicode wins for character/locale data

Rule 4 — Freshness. Most recently updated wins.

Rule 5 — Unresolved. If still tied, flag as unresolved in UI, show all candidate values.

### Conflict penalty calculation

```
total_fields = number of distinct (row, field) pairs across all sources
conflicting_fields = count where 2+ distinct values exist
conflict_penalty = min(1.0, conflicting_fields / total_fields)
```

Apply as multiplier: `final_score = base_score × (1 − conflict_penalty)`.

### Surfacing conflicts in the UI

The widget MUST display conflicts when they exist:

1. Conflict count badge — "3 conflicts detected" near the score
2. Conflict expansion panel — click to reveal list:
   ```
   Field: minor_unit (currency BHD)
   - SIX Group (T1): 3
   - datahub.io (T2): 3
   - some-mirror (T2): 2 ← outlier
   Resolved to: 3 (T1 majority)
   ```
3. Inline markers in data table — small icon next to rows with conflicting fields
4. Honest score — conflict penalty visible in breakdown

Never hide a conflict by silently picking one value.

### What is NOT a conflict
- One source has more fields than another → coverage, not conflict
- One source has fewer rows → coverage
- Values differing only in formatting → normalise first
- Source returned an error → fetch failure, exclude from conflict detection

---

## Section 5 — Performance & optimisation

### Target latencies

| Query type | Target |
|---|---|
| Cache hit (repeat query) | <50ms |
| Known topic, sources reachable | 1–2s |
| Known topic, slow source | 2–3s (short-circuit) |
| Unknown topic, needs discovery | 4–6s |

### Six optimisations in priority order

1. Parallel fetches — Never serial. Use `Promise.allSettled` (JS) or `asyncio.gather` (Python). `allSettled` is critical — `Promise.all` rejects the whole batch on one 404. 60–75% reduction in fetch time.

2. Query cache with topic-aware TTL:

| Topic class | TTL | Why |
|---|---|---|
| ISO standards | 30 days | Updated yearly at most |
| IANA registries | 7 days | Quarterly updates |
| Phone calling codes | 30 days | Rarely changes |
| Address formats | 30 days | Stable |
| Exchange rates | 5 minutes | Live financial data |
| Crypto prices | 30 seconds | Volatile |

Don't use flat TTL. Cache key: `hash(query.lower().strip())`.

3. Pre-computed source registry — Tier classification via static lookup in Section 1, NOT LLM call. Microseconds vs 800ms.

4. Known-topic source map — Use Section 2 directly. Skip web search for matched topics. Saves 2–4 seconds.

5. Early-exit short-circuit — If first response is T1, complete, and running score ≥90, stop waiting:
```
After each result: if r.tier == 1 AND r.coverage >= 1.0 AND running_score >= 90:
  cancel pending fetches, return now
```

6. Streaming UI — Show results as they arrive. Doesn't reduce wall-clock but jumps perceived speed 2–3×.

### What to skip
- Redis/Postgres (in-memory or SQLite is fine at this scale)
- WebWorkers (bottleneck is network, not CPU)
- Response compression (negligible at our data sizes)
- Predictive pre-fetching (hard to predict, wastes bandwidth)

### Failure handling
- Set 10s timeout per fetch
- On timeout: mark source `failed_timeout`, exclude from conflict detection, reduce multiplicity, continue
- If ALL live sources fail:
  → Emergency fallback: attempt to read the pre-fetch cache (Section 2-B) ignoring TTL.
  → If cache has any entry for this topic, serve it with a staleness warning in the widget.
  → Stale data is always preferable to no data — never silently return empty.
  → If cache also empty → Section 8 "no trustable source" response.

### Refresh threshold for pre-fetch pipeline

To guarantee the cache is never more than 50% expired when the skill reads it,
the `prefetch.py` pipeline uses `REFRESH_THRESHOLD = 0.5`. This means it
refreshes a topic when `cache_age >= 0.5 × TTL`:

| Topic class   | TTL    | Refresh trigger | Recommended cron |
|---------------|--------|-----------------|------------------|
| ISO standards | 30 days | 15 days        | weekly `0 2 * * 1` |
| IANA registry |  7 days |  3.5 days      | daily `0 2 * * *`  |
| Address fmts  | 30 days | 15 days        | weekly `0 2 * * 1` |
| Phone codes   | 30 days | 15 days        | weekly `0 2 * * 1` |

One missed daily run never causes a stale-cache fallthrough at 50% threshold.

---

## Section 9.5 — Scoring & Diagnostics Summary

### Purpose

After every run (widget-only or widget + utility), the skill MUST print a
concise scoring breakdown in the terminal so the user can see exactly how the
winner was chosen. This is the ONLY permitted prose/text output beyond the
widget itself.

### When to print

Print this block:
1. After the widget renders (Step 8.5), on every plain `/utility-creator` run.
2. After the utility summary table (Section 12, Step D), on utility generation runs.

### How to generate

Run the following bash snippet immediately after Recipe 7 (the winner data
is already in `/tmp/tsf_result.json`):

```bash
python3 << 'EOF'
import json, sys
with open("/tmp/tsf_result.json") as f:
    r = json.load(f)
w = r.get("winner")
if not w:
    print("No winner — see error output above.")
    sys.exit(0)

fac = w.get("factors", {})

def fmt_bar(v, width=20):
    filled = round(v * width)
    return "[" + "█" * filled + "░" * (width - filled) + f"] {v:.2f}"

lines = [
    "",
    "╔══════════════════════════════════════════════════════════╗",
    "║           TSF SCORING & DIAGNOSTICS SUMMARY              ║",
    "╚══════════════════════════════════════════════════════════╝",
    "",
    f"  Topic          : {r['topic']}",
    f"  Winning source : {w['name']}",
    f"  Source URL     : {w.get('url', 'n/a')}",
    f"  Tier           : Tier {w['tier']} ({'Official (T1)' if w['tier'] == 1 else 'Official-derived (T2)'})",
    f"  Rows fetched   : {len(w.get('rows', []))}",
    f"  From cache     : {r.get('from_cache', False)}",
    f"  Conflicts      : {r.get('conflict_count', 0)}",
    "",
    "  ── Score breakdown (weight × raw value) ──────────────────",
    "",
    f"  tier_authority  (×0.35)  {fmt_bar(fac.get('tier_authority', 0))}",
    f"  multiplicity    (×0.15)  {fmt_bar(fac.get('multiplicity', 0))}",
    f"  freshness       (×0.15)  {fmt_bar(fac.get('freshness', 0))}",
    f"  coverage        (×0.15)  {fmt_bar(fac.get('coverage', 0))}",
    f"  recurrence      (×0.10)  {fmt_bar(fac.get('recurrence', 0))}",
    f"  independence    (×0.10)  {fmt_bar(fac.get('independence', 0))}",
    "",
    f"  conflict_penalty         -{fac.get('conflict_penalty', 0):.2f}  (applied after base)",
    "",
    "  ─────────────────────────────────────────────────────────",
    f"  FINAL ACCURACY SCORE     {w['score']}/100",
    "═" * 62,
    "",
]
print("\n".join(lines))
EOF
```

### Output format rule

The output is a single fenced code block (triple-backtick) printed as
plain terminal text — not HTML, not a widget. It must appear directly
after the widget in the response. Do not summarise it in prose; just
emit the block as-is.

### If `/tmp/tsf_result.json` is missing

Skip the diagnostic block silently and do not error. The widget itself
already surfaced whatever failure occurred.

---

## Section 7 — Output contract — LIVE WIDGET + SCORING DIAGNOSTIC

Every response MUST output exactly one interactive widget followed by one scoring diagnostic block. Do NOT output:
- Sources tables in markdown
- Best API blocks
- data.json dumps
- Preamble or summary text
- Markdown explanations alongside the widget

These are internal working steps, never shown to the user.

**Exception — scoring diagnostic**: After the widget renders, the skill MUST print a single fenced Markdown block (see Section 9.5) that contains the winning source name/URL, tier, final score, and per-factor breakdown. This is the one permitted piece of terminal text output. Everything else in this list remains forbidden.

**Exception — Missing Data Clarification Menu**: If the user's request named specific data fields that are absent from the winning source's output, the skill MUST append the following menu immediately after the Scoring Diagnostic block. Never skip this step silently — surfacing the gap is mandatory.

```
---
**Missing Data Notice**
The authoritative source used for this widget does not track the following requested data: **[list missing fields, e.g., "historical calling codes"]**.

How would you like to proceed?
- **[1]** This data is sufficient for my needs.
- **[2]** Run a deep research hunt (Section 13 protocol) specifically to find an authoritative source for the missing fields.
---
```

Detection rule: compare the field names the user named in their query against the column list in `/tmp/tsf_parsed.json`. Any named field absent from every source's `columns` array is a missing field and must be listed in the menu.

### The widget MUST include
- Real fetched data (never placeholders)
- Accuracy score 0–100 with per-factor breakdown
- Tier badge for winning source (T1=green, T2=amber)
- Source URL clearly visible and clickable
- Conflict report if sources disagreed
- Filter/search controls for the data
- Pagination if >50 rows

### Widget HTML template

Use this structure. Replace placeholders with computed values. Embed real data in the JS constants — no runtime API calls inside the widget except where the source provides a live JSON endpoint.

```html
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  .tsf{padding:1rem 0;font-family:var(--font-sans)}
  .tsf-hdr{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;padding:.75rem 0;border-bottom:.5px solid var(--color-border-tertiary);margin-bottom:1rem}
  .tsf-title{font-size:15px;font-weight:500;color:var(--color-text-primary)}
  .tsf-source{font-size:12px;color:var(--color-text-secondary);margin-top:3px;font-family:var(--font-mono)}
  .tsf-source a{color:var(--color-text-info);text-decoration:none;word-break:break-all}
  .tsf-score{font-size:32px;font-weight:500;font-family:var(--font-mono)}
  .tsf-score.high{color:var(--color-text-success)}
  .tsf-score.mid{color:var(--color-text-warning)}
  .tsf-score.low{color:var(--color-text-danger)}
  .tsf-tier{font-size:10px;font-weight:500;padding:3px 9px;border-radius:99px;letter-spacing:.5px;font-family:var(--font-mono)}
  .tsf-tier.t1{background:var(--color-background-success);color:var(--color-text-success)}
  .tsf-tier.t2{background:var(--color-background-warning);color:var(--color-text-warning)}
  .tsf-breakdown{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin-bottom:1rem}
  .tsf-bd{background:var(--color-background-secondary);border-radius:var(--border-radius-md);padding:.6rem .85rem}
  .tsf-bd-lbl{font-size:10px;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:.5px;font-family:var(--font-mono);margin-bottom:3px}
  .tsf-bd-val{font-size:14px;font-weight:500;font-family:var(--font-mono)}
  .tsf-bd-bar{height:3px;background:var(--color-border-tertiary);border-radius:99px;margin-top:5px;overflow:hidden}
  .tsf-bd-fill{height:100%;background:var(--color-text-info);border-radius:99px}
  .tsf-conflict{background:var(--color-background-warning);border-radius:var(--border-radius-md);padding:.7rem .9rem;margin-bottom:1rem;font-size:12px;color:var(--color-text-warning)}
  .tsf-table{width:100%;border-collapse:collapse;font-family:var(--font-mono);font-size:12px}
  .tsf-table th{text-align:left;padding:6px 10px;color:var(--color-text-secondary);border-bottom:.5px solid var(--color-border-tertiary);font-weight:500;font-size:10px;text-transform:uppercase;letter-spacing:.6px}
  .tsf-table td{padding:6px 10px;border-bottom:.5px solid var(--color-border-tertiary);color:var(--color-text-primary)}
</style>

<div class="tsf">
  <div class="tsf-hdr">
    <div>
      <div class="tsf-title">{TOPIC_TITLE}</div>
      <div class="tsf-source">source → <a href="{SOURCE_URL}" target="_blank">{SOURCE_NAME}</a></div>
    </div>
    <div style="display:flex;align-items:center;gap:12px">
      <span class="tsf-tier {TIER_CLASS}">TIER {TIER_NUM}</span>
      <div style="text-align:right">
        <div class="tsf-score {SCORE_CLASS}">{SCORE}</div>
        <div style="font-size:10px;color:var(--color-text-secondary);font-family:var(--font-mono);letter-spacing:.6px">ACCURACY / 100</div>
      </div>
    </div>
  </div>

  <!-- Per-factor breakdown grid: one .tsf-bd per factor with label, contribution, and progress bar -->
  <div class="tsf-breakdown"></div>

  <!-- Conflict block renders only if conflicts exist, populated from conflict detection -->

  <input type="text" placeholder="filter rows…" oninput="tsfFilter()"
         style="padding:7px 10px;border:.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);background:var(--color-background-primary);color:var(--color-text-primary);font-size:13px;font-family:var(--font-mono);width:100%;margin-bottom:.75rem"/>

  <div id="tsf-table-wrap"></div>
</div>

<script>
const ROWS = {ROWS_JSON};
const COLUMNS = {COLUMNS_JSON};
const PAGE_SIZE = 50;
let filtered = ROWS, page = 0;

function render() {
  const start = page * PAGE_SIZE;
  const slice = filtered.slice(start, start + PAGE_SIZE);
  const thead = '<tr>' + COLUMNS.map(c => `<th>${c}</th>`).join('') + '</tr>';
  const tbody = slice.map(row =>
    '<tr>' + COLUMNS.map(c => `<td>${row[c] ?? ''}</td>`).join('') + '</tr>'
  ).join('');
  let pager = '';
  if (filtered.length > PAGE_SIZE) {
    const prev = page > 0 ? `<button onclick="page--;render()">‹ prev</button>` : '';
    const next = start + PAGE_SIZE < filtered.length ? `<button onclick="page++;render()">next ›</button>` : '';
    pager = `<div style="margin-top:.5rem;font-size:12px;color:var(--color-text-secondary);display:flex;gap:8px;align-items:center">${prev}<span>${start+1}–${Math.min(start+PAGE_SIZE,filtered.length)} of ${filtered.length}</span>${next}</div>`;
  }
  document.getElementById('tsf-table-wrap').innerHTML =
    `<table class="tsf-table"><thead>${thead}</thead><tbody>${tbody}</tbody></table>${pager}`;
}

function tsfFilter() {
  const q = document.querySelector('.tsf input[type=text]').value.toLowerCase();
  filtered = q
    ? ROWS.filter(r => COLUMNS.some(c => String(r[c] ?? '').toLowerCase().includes(q)))
    : ROWS;
  page = 0;
  render();
}

render();
</script>
```

---

## Section 8 — When no trustable source exists

If neither T1 nor T2 source exists for the topic, do NOT produce a widget and do NOT fall back to T3. Respond with this exact structure:

```
## Could not find a trustable source for: [Topic]

Why:
- Tier 1 check: [what official body would own this, and whether they publish it]
- Tier 2 check: [what mirrors were looked for, and why none qualified]

What you can do instead:
Option 1 — [most practical path, e.g. "Download the ITU PDF and extract manually"]
Option 2 — [alternative path]
Option 3 — [if applicable, e.g. "Sign up for paywalled official access"]

Note: Tier 3 community sources exist but are not recommended — accuracy cannot be guaranteed without an official reference to verify against.
```

---

## Section 9 — Edge cases

| Case | Handling |
|---|---|
| T1 blocked by domain policy (egress proxy 403) | Try github_mirror URL for that source (Section 2). Tier stays T1 — GitHub is delivery, not authority. If no mirror exists, check pre-fetch cache (Section 2-B). Add widget note: "Served via GitHub mirror — canonical domain blocked by sandbox policy." |
| T1 blocked and no github_mirror | Check pre-fetch cache (Section 2-B). If cache warm, serve with cache banner. If cache cold, fall through to T2 sources. |
| All live sources fail, cache is warm but stale | Serve stale cache with staleness warning. Never return empty when stale data exists. |
| All live sources fail, cache is cold | Section 8 "no trustable source" response. |
| Mixed-age cache sources (fetched_at delta > 7d) | Add widget warning about unreliable conflict detection. Show re-run command. |
| T2 source is stale (>5 years) | Use but add freshness warning in widget |
| Topic is ambiguous (e.g. "payment formats") | Ask ONE clarifying question. Do not guess. |
| Topic has no standards body | State this. Do not invent a T1 authority. Go to Section 8 response. |
| User explicitly asks for T3 | Explain why not recommended. Point to T1/T2 alternative. Provide on insistence with warning. |
| Two T1 sources disagree | Apply Section 4 tie-breaking rules in order. |
| Sources disagree on a value | Highest-tier value wins. Show all conflicting values side-by-side. Apply conflict penalty. |

---
