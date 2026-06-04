---
description: Show fetch status for all i18nify pipeline datasets
allowed-tools: Bash, Read
---

# i18nify Data Pipeline Status

Run this command and display the results as a table:

```bash
source venv/bin/activate && python tools/crawlers/validate.py --status
```

After showing the table:
1. Highlight any datasets with status `STALE` or `MISSING`
2. Suggest the command to refresh stale datasets:
   ```
   /fetch-data {topic}
   ```
3. Show total count of fresh vs stale vs missing topics.
