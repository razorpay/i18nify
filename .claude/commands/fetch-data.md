---
description: Fetch i18nify reference data for a given topic using Crawl4AI
allowed-tools: Bash, Read, Write, mcp__crawl4ai__scrape, mcp__crawl4ai__crawl
---

# Fetch i18nify Data: $ARGUMENTS

Fetch the reference dataset for topic: **$ARGUMENTS**

## Steps

1. Activate the Python virtual environment:
```bash
source venv/bin/activate
```

2. Check if fresh data already exists (< 30 days old):
```bash
python tools/crawlers/validate.py --check-age $ARGUMENTS
```
   If output is `FRESH`, skip to step 5.

3. Use the `crawl4ai` MCP tool to fetch the source URL for this topic.
   The URL mappings are in CLAUDE.md under "Topics and their T1 sources".

   For SPA pages (`country`, `language` from ISO OBP):
   ```json
   {
     "url": "<topic_url>",
     "wait_for": "table tbody tr",
     "js_code": "await new Promise(r => setTimeout(r, 4000));"
   }
   ```

   For static XML / plain text / JSON / YAML: fetch directly without JS execution.

4. Save the raw crawled content to `/tmp/i18nify_raw_$ARGUMENTS.txt`

5. Run the extraction and validation pipeline:
```bash
python tools/crawlers/crawl4ai_runner.py --topic $ARGUMENTS --input /tmp/i18nify_raw_$ARGUMENTS.txt
```

6. If extraction fails or returns 0 rows:
   - Check if the page structure changed (compare against known column names in the schema)
   - Try a different extraction strategy (CSS selectors vs LLM extraction)
   - Report the exact error with the FETCH_ERROR token

7. Print final status:
   - Success: `FETCH_OK|$ARGUMENTS|{row_count}`
   - Failure: `FETCH_ERROR|$ARGUMENTS|{reason}`
