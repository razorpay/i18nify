#!/usr/bin/env bash
# smoke.sh — verifies the utility-creator pipeline works end-to-end for http_status_codes
# Run from repo root: bash .claude/skills/utility-creator/smoke.sh
# Requires: venv present at repo root OR venv activated before running

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

RUNNER="$REPO_ROOT/.claude/skills/utility-creator/tools/crawlers/crawl4ai_runner.py"
PY=""
for _name in python python3 python3.12 python3.11 python3.10 python3.9; do
  if [ -x "$REPO_ROOT/venv/bin/$_name" ]; then
    PY="$REPO_ROOT/venv/bin/$_name"
    break
  fi
done
if [ -z "$PY" ]; then
  # venv/bin/ missing — try to use venv site-packages via PYTHONPATH
  _site=$(ls -d "$REPO_ROOT/venv/lib/python"*/site-packages 2>/dev/null | head -1 || true)
  if [ -n "$_site" ]; then
    export PYTHONPATH="$_site${PYTHONPATH:+:$PYTHONPATH}"
    echo "    NOTE: venv/bin/ missing — using system python3 with PYTHONPATH=$_site"
    echo "    (Recipe 3 / crawl4ai_runner.py will still need a working venv)"
  else
    echo "    WARNING: no venv found at $REPO_ROOT/venv — using bare system python3"
  fi
  PY="python3"
fi

fail() { echo "SMOKE_FAIL: $1" >&2; exit 1; }
ok()   { echo "  OK  $1"; }

check_cache() {
  "$PY" << 'PYEOF'
import os, sys
from datetime import datetime, timezone

topic = "http_status_codes"
local_path = "i18nify-data/http-status/data.json"
ttl = 7

if os.path.exists(local_path):
    mtime = os.path.getmtime(local_path)
    age_days = (datetime.now(timezone.utc).timestamp() - mtime) / 86400
    if age_days <= ttl:
        print(f"CACHE_HIT|LOCAL:{local_path}|{age_days:.1f}|{ttl}")
    else:
        print(f"CACHE_STALE|{age_days:.1f}|{ttl}")
else:
    print("CACHE_MISS")
PYEOF
}

echo "=== utility-creator smoke test: http_status_codes ==="
echo "    python: $PY"
echo ""

# ── Recipe 0 — deps ────────────────────────────────────────────────────────
echo "[0] Recipe 0 — install deps"
"$PY" -m pip install 'requests==2.32.3' 'pyyaml==6.0.2' 'lxml==5.3.0' 'defusedxml==0.7.1' -q 2>&1 | tail -2
ok "deps installed"

# ── Recipe 1 — check local cache ───────────────────────────────────────────
echo "[1] Recipe 1 — check local cache"
R1=$(check_cache)
echo "    $R1"

ROUTING=$(echo "$R1" | cut -d'|' -f1)
CACHE_PATH=$(echo "$R1" | cut -d'|' -f2)

if [[ "$ROUTING" == "CACHE_HIT" ]]; then
  ok "local cache hit"
elif [[ "$ROUTING" == "CACHE_STALE" ]]; then
  echo "    cache stale — running Recipe 3 live fetch"
  "$PY" "$RUNNER" --topic http_status
  ok "live data refreshed"
elif [[ "$ROUTING" == "CACHE_MISS" ]]; then
  echo "    no local data — running Recipe 3 live fetch"
  "$PY" "$RUNNER" --topic http_status
  ok "live data populated"
else
  fail "Recipe 1 returned unexpected token: $ROUTING"
fi

if [[ "$ROUTING" != "CACHE_HIT" ]]; then
  echo "[1b] Recipe 1 — re-check local cache after Recipe 3"
  R1=$(check_cache)
  echo "    $R1"
  ROUTING=$(echo "$R1" | cut -d'|' -f1)
  CACHE_PATH=$(echo "$R1" | cut -d'|' -f2)
  [[ "$ROUTING" == "CACHE_HIT" ]] || fail "Recipe 3 did not produce a fresh cache: $R1"
  ok "local cache hit after fetch"
fi

# ── Recipe 2 — load cache (only if CACHE_HIT|LOCAL:...) ────────────────────
if [[ "$ROUTING" == "CACHE_HIT" ]]; then
  echo "[2] Recipe 2 — load cache envelope"
  R2=$("$PY" << PYEOF
import json, sys, os
from datetime import datetime, timezone

hit_path = "$CACHE_PATH"
PATH_DATA_KEY = {"i18nify-data/http-status/data.json": "http_status_information"}
PATH_SOURCE_URL = {"i18nify-data/http-status/data.json": "https://www.iana.org/assignments/http-status-codes/http-status-codes.xml"}

file_path = hit_path[len("LOCAL:"):]
mtime = os.path.getmtime(file_path)
fetched_at = datetime.fromtimestamp(mtime, tz=timezone.utc).isoformat()
data_key   = PATH_DATA_KEY.get(file_path, "")
source_url = PATH_SOURCE_URL.get(file_path, "local")

with open(file_path) as f:
    canonical = json.load(f)

data_dict = canonical.get(data_key) if data_key else None
if not data_dict:
    data_dict = next(iter(canonical.values()), {})

data = [{"cc": k, **v} for k, v in data_dict.items()] if isinstance(data_dict, dict) else []

envelope = {"sources": [{"meta": {"tier": 1, "source_name": source_url,
    "url_used": source_url, "fetched_at": fetched_at, "via_github": False}, "data": data}]}

with open("/tmp/uc_smoke_cache_data.json", "w") as f:
    json.dump(envelope, f, ensure_ascii=False)
print(f"ENVELOPE_OK|rows={len(data)}")
PYEOF
  )
  echo "    $R2"
  [[ "$R2" == ENVELOPE_OK* ]] || fail "Recipe 2 failed: $R2"
  ok "envelope loaded"

  # ── Recipe 5 — normalise ─────────────────────────────────────────────────
  echo "[5] Recipe 5 — normalise"
  "$PY" << 'PYEOF' > /dev/null || fail "Recipe 5: normalise step exited non-zero"
import json
with open("/tmp/uc_smoke_cache_data.json") as f:
    envelope = json.load(f)
parsed = []
for i, src in enumerate(envelope.get("sources", [])):
    m = src["meta"]; raw = src["data"]
    rows = raw if isinstance(raw, list) else []
    cols = list(rows[0].keys()) if rows else []
    parsed.append({"tier": m["tier"], "name": m["source_name"], "url": m["url_used"],
        "via_mirror": m["via_github"], "fetched_at": m["fetched_at"],
        "columns": cols, "rows": rows, "source_type": "prefetch_cache", "from_cache": True})
with open("/tmp/uc_smoke_parsed.json", "w") as f:
    json.dump(parsed, f, ensure_ascii=False)
print(f"CACHE_LOAD_DONE|{len(parsed)}")
PYEOF
  ok "data normalised"
fi

# ── Recipe 6 — score ───────────────────────────────────────────────────────
echo "[6] Recipe 6 — score"
PARSED_FILE="/tmp/uc_smoke_parsed.json"
if [[ ! -f "$PARSED_FILE" ]]; then
  fail "Recipe 5 did not write /tmp/uc_smoke_parsed.json"
fi

R6=$("$PY" << PYEOF
import json, math
from datetime import datetime, timezone

with open("$PARSED_FILE") as f:
    sources = json.load(f)

topic = "http_status_codes"; topic_ttl = 7
from_cache = any(s.get("from_cache") for s in sources)
cache_freshness = 1.0
if from_cache:
    fas = [s.get("fetched_at") for s in sources if s.get("fetched_at")]
    if fas:
        oldest = min(datetime.fromisoformat(t) for t in fas)
        age_d = (datetime.now(timezone.utc) - oldest).total_seconds() / 86400
        cache_freshness = max(0.5, 1.0 - (age_d / topic_ttl) * 0.5)

expected = 60; n = len(sources)
scored = []
for src in sources:
    ta = 1.0 if src["tier"]==1 else 0.7
    mult = min(1.0, math.log2(n+1)/3)
    fresh = cache_freshness if src.get("from_cache") else 0.97
    cov = min(1.0, len(src.get("rows",[])) / expected)
    base = 0.35*ta + 0.15*mult + 0.15*fresh + 0.15*cov + 0.10*0.85 + 0.10*1.0
    scored.append({**src, "score": round(100*base), "factors": {
        "tier_authority":ta,"multiplicity":mult,"freshness":fresh,
        "coverage":cov,"recurrence":0.85,"independence":1.0,"conflict_penalty":0}})
scored.sort(key=lambda s: -s["score"])
w = scored[0]
result = {"topic": topic, "winner": w, "all_sources": scored,
          "conflicts": [], "conflict_count": 0, "from_cache": from_cache, "cache_freshness": cache_freshness}
with open("/tmp/uc_smoke_result.json","w") as f:
    json.dump(result, f, ensure_ascii=False)
print(f"SCORE_DONE|score={w['score']}|tier={w['tier']}|rows={len(w.get('rows',[]))}")
PYEOF
)
echo "    $R6"
[[ "$R6" == SCORE_DONE* ]] || fail "Recipe 6 failed: $R6"
ok "scored"

# ── Recipe 7 — extract winner ──────────────────────────────────────────────
echo "[7] Recipe 7 — extract winner"
"$PY" -c "
import json
with open('/tmp/uc_smoke_result.json') as f:
    r = json.load(f)
w = r['winner']
assert w['score'] > 0, 'score must be > 0'
assert len(w.get('rows', [])) >= 60, f'expected >=60 HTTP status rows, got {len(w.get(\"rows\", []))}'
print(f\"  topic={r['topic']} score={w['score']} rows={len(w.get('rows',[]))} tier={w['tier']}\")
"
ok "winner extracted"

# ── Cleanup ────────────────────────────────────────────────────────────────
rm -f /tmp/uc_smoke_cache_data.json /tmp/uc_smoke_parsed.json /tmp/uc_smoke_result.json

echo ""
echo "SMOKE_OK|http_status_codes|pipeline verified end-to-end"
