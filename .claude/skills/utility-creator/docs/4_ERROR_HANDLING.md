# utility-creator — Error Handling

This file is a supplement to the root [`SKILL.md`](../SKILL.md).
It contains Section 10 (What this skill does NOT do), Section 11 (Error Transparency), and Section 11.5 (Troubleshooting).

---

## Section 10 — What this skill explicitly does NOT do

- Does not use neural networks for ranking. The function is genuinely linear; ML would learn the same weighted sum we hand-wrote, but slower and opaquely. Linear is correct because rules are known, training data doesn't exist, and explainability is mandatory.
- Does not return T3 sources regardless of star count or popularity
- Does not output prose explanations alongside the widget
- Does not fabricate data when a source is unreachable — returns honest "could not find" response
- Does not psychoanalyse the query or ask multiple clarifying questions
- Does not use Wikipedia as a primary source for any technical reference (T3 by default)
- Does not merge in unverified columns from Tier 3 sources just because the Tier 1 source is missing a field the user asked for

---

## Section 11 — Error Transparency

When running any Python script to fetch or cache Tier-1 data, strictly monitor both stdout and stderr.

**The following conditions MUST trigger an immediate halt and raw error display:**
- The script outputs a tag matching `CACHE_ERROR|<message>` or `ENVELOPE_ERROR|<message>`
- The script prints a Python `Traceback` to stderr
- The script exits with a non-zero exit code

**You MUST NOT:**
- Silently swallow the error and continue to the next step
- Ignore the error and proceed as if a fallback was tried
- Vaguely summarise the error (e.g. "the cache was unavailable")

**You MUST:**
- Immediately halt execution — do not proceed to any further Recipe or step
- Display the exact, raw error output to the user in a terminal-style code block:

```
❌ Script error — execution halted

<exact stdout / stderr output here, unmodified>

Fix the issue above before re-running the skill.
```

**Scope of this rule — what is NOT an error:**
- `CACHE_MISS` — expected routing token, not an error; continue to Step 4
- `CACHE_STALE|...` — expected routing token, not an error; continue to Step 4
- `FETCH_FAILED|<name>` — partial fetch failure; log internally, reduce multiplicity, continue
- `ALL_FAILED` — all sources failed; trigger emergency cache fallback per Section 6, not this rule

Any token not listed above that signals an unexpected failure (non-zero exit, `Traceback`, `CACHE_ERROR|`, `ENVELOPE_ERROR|`, `PARSE_ERROR|`, `FETCH_ERROR|`, `UTILITY_ERROR|`) falls under this rule and requires an immediate halt and raw display.

---

## Section 11.5 — Troubleshooting

Real errors encountered during development. Symptom → cause → fix.

- **`ENVELOPE_ERROR|[Errno 2] No such file or directory: 'i18nify-data/.../data.json'`**
  Cause: Recipe 1 returned `CACHE_HIT|LOCAL:…` for a path that doesn't exist yet (topic has never been fetched).
  Fix: Run `python3 .claude/skills/utility-creator/tools/crawlers/crawl4ai_runner.py --topic <name>` to generate the file, then re-run.

- **`RUNNER_FAILED|<topic>|no PARSE_OK in output`**
  Cause: Crawl4AI Docker container is not running.
  Fix: `docker run -d -p 11235:11235 unclecode/crawl4ai` then retry Recipe 3.

- **`RUNNER_FAILED|<topic>|exit=1`** with `ConnectionRefusedError` in stderr
  Cause: Same — Crawl4AI container down. Fix: same as above.

- **Recipe 1 returns `CACHE_HIT|LOCAL:…` for `currency_codes` or `country_codes` even though those files were deleted**
  Cause: git deleted `i18nify-data/currency/data.json` and `i18nify-data/country/metadata/data.json` (visible in `git status`). The CANONICAL_PATH still lists them, so Recipe 1 would hit `CACHE_MISS` (file not found) and fall through to Recipe 3.
  Fix: Expected behaviour — Recipe 3 will re-fetch and re-write them.

- **`smoke.sh` exits without `SMOKE_OK` when tld data is stale**
  Cause: tld_list data is older than 7 days; smoke hits `CACHE_STALE` branch and exits cleanly but does not run Recipes 2–7.
  Fix: Refresh the data first: `python3 .claude/skills/utility-creator/tools/crawlers/crawl4ai_runner.py --topic tld`, then re-run `smoke.sh`.

- **`UTILITY_ERROR|unsupported topic '…' — add a mapping entry in Recipe 8 TOPIC_MAP`**
  Cause: Topic key resolved in Step 1 isn't in Recipe 8's `TOPIC_MAP` (e.g. a newly added topic from Section 13).
  Fix: Add the topic to `TOPIC_MAP` in Recipe 8 and `TOPIC_MAP` in Recipe 8-Go following the pattern of existing entries.

---
