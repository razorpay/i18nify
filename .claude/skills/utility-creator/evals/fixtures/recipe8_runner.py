"""
Standalone Recipe 8 runner used by test_recipe8_structure.py.

Reads configuration from environment variables to avoid f-string escaping:
  UC_TOPIC_KEY       — canonical topic key (e.g. "currency_codes")
  UC_PROJECT_ROOT    — absolute path to the project root
  UC_TSF_RESULT_PATH — path to the tsf_result.json fixture
"""

import json
import os
import re
import sys

TOPIC_KEY    = os.environ["UC_TOPIC_KEY"]
PROJECT_ROOT = os.environ["UC_PROJECT_ROOT"]
TSF_RESULT   = os.environ["UC_TSF_RESULT_PATH"]

TOPIC_MAP = {
    "currency_codes":      {"snake": "currency",    "pascal": "Currency",    "data_key": "currency_information",         "id_field": "cc"},
    "country_codes":       {"snake": "country",     "pascal": "Country",     "data_key": "country_information",          "id_field": "cc"},
    "phone_calling_codes": {"snake": "phoneNumber", "pascal": "PhoneNumber", "data_key": "country_tele_information",     "id_field": "cc"},
    "language_codes":      {"snake": "language",    "pascal": "Language",    "data_key": "language_information",         "id_field": "cc"},
    "timezones":           {"snake": "timezone",    "pascal": "Timezone",    "data_key": "timezone_information",         "id_field": "cc"},
    "tld_list":            {"snake": "tld",         "pascal": "Tld",         "data_key": "tld_information",              "id_field": "cc"},
    "address_formats":     {"snake": "address",     "pascal": "Address",     "data_key": "address_format_information",   "id_field": "cc"},
    "gst_rates_india":     {"snake": "gst",         "pascal": "Gst",         "data_key": "gst_information",              "id_field": "code"},
    "population_data":     {"snake": "population",  "pascal": "Population",  "data_key": "population_information",       "id_field": "cc"},
}

cfg = TOPIC_MAP.get(TOPIC_KEY)
if not cfg:
    print("UTILITY_ERROR|unsupported topic '%s' — add a mapping entry in Recipe 8 TOPIC_MAP" % TOPIC_KEY)
    sys.exit(1)

snake    = cfg["snake"]
pascal   = cfg["pascal"]
data_key = cfg["data_key"]
id_field = cfg["id_field"]

with open(TSF_RESULT) as f:
    result = json.load(f)

winner = result["winner"]
rows   = winner.get("rows", [])
if not rows:
    print("UTILITY_ERROR|winner has no rows — cannot generate data files")
    sys.exit(1)

data_dict = {}
for row in rows:
    key = row.get("cc") or row.get(id_field) or str(list(row.values())[0])
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

snake_upper = re.sub(r"(?<=[a-z])(?=[A-Z])", "_", snake).upper()
module_dir  = os.path.join(PROJECT_ROOT, "packages", "i18nify-js", "src", "modules", snake)
data_dir    = os.path.join(PROJECT_ROOT, "i18nify-data", snake)

# ── File content templates (same as Recipe 8) ──────────────────────────────────
f_data_json     = json.dumps(canonical_data, ensure_ascii=False, indent=2)
f_readme        = "# %s Data\n\nCanonical %s data.\n" % (pascal, pascal.lower())
f_proto         = 'syntax = "proto3";\npackage %s;\n' % snake

CONFIG_FIELDS   = {"name", "symbol", "minor_unit"}
module_config   = {
    k: {fk: fv for fk, fv in v.items() if fk in CONFIG_FIELDS or not CONFIG_FIELDS.intersection(v)}
    for k, v in data_dict.items()
}
f_module_config = json.dumps(module_config, ensure_ascii=False, indent=2)

f_types = (
    "import {snake_upper}_INFO from './data/{snake}Config.json';\n\n"
    "export type {pascal}CodeType = keyof typeof {snake_upper}_INFO;\n\n"
    "export interface {pascal}Type {{\n"
    "  code: {pascal}CodeType;\n"
    "  name: string;\n"
    "}}\n"
).format(snake_upper=snake_upper, snake=snake, pascal=pascal)

f_constants = (
    "export const {snake_upper}_CODE_LIST = {codes} as const;\n"
).format(
    snake_upper=snake_upper,
    codes=json.dumps(sorted(data_dict.keys()), ensure_ascii=False, indent=2)
)

f_utils = (
    "import type {{ {pascal}CodeType }} from './types';\n"
    "import {snake_upper}_INFO from './data/{snake}Config.json';\n\n"
    "export const get{pascal}Info = (code: {pascal}CodeType) =>\n"
    "  ({snake_upper}_INFO as Record<string, unknown>)[code] ?? null;\n"
).format(pascal=pascal, snake=snake, snake_upper=snake_upper)

f_get_list = (
    "import {{ withErrorBoundary }} from '../../common/errorBoundary';\n"
    "import {snake_upper}_INFO from './data/{snake}Config.json';\n"
    "import type {{ {pascal}CodeType }} from './types';\n\n"
    "const get{pascal}List = (): Record<{pascal}CodeType, (typeof {snake_upper}_INFO)[{pascal}CodeType]> =>\n"
    "  {snake_upper}_INFO as Record<{pascal}CodeType, (typeof {snake_upper}_INFO)[{pascal}CodeType]>;\n\n"
    "export default withErrorBoundary<typeof get{pascal}List>(get{pascal}List);\n"
).format(pascal=pascal, snake=snake, snake_upper=snake_upper)

f_index = (
    "export {{ default as get{pascal}List }} from './get{pascal}List';\n"
    "export * from './types';\n"
    "export * from './utils';\n"
).format(pascal=pascal)

f_test = (
    "import get{pascal}List from '../get{pascal}List';\n\n"
    "describe('get{pascal}List', () => {{\n"
    "  it('returns all {snake} entries', () => {{\n"
    "    const list = get{pascal}List();\n"
    "    expect(typeof list).toBe('object');\n"
    "    expect(Object.keys(list).length).toBeGreaterThan(0);\n"
    "  }});\n\n"
    "  it('each entry has expected shape', () => {{\n"
    "    const list = get{pascal}List();\n"
    "    const sample = Object.values(list)[0] as Record<string, unknown>;\n"
    "    expect(typeof sample).toBe('object');\n"
    "  }});\n"
    "}});\n"
).format(pascal=pascal, snake=snake)


def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(content)
    rel = os.path.relpath(path, PROJECT_ROOT)
    print("WROTE|" + rel)


write_file(os.path.join(data_dir,   "data.json"),                         f_data_json)
write_file(os.path.join(data_dir,   "proto", snake + ".proto"),           f_proto)
write_file(os.path.join(data_dir,   "README.md"),                         f_readme)
write_file(os.path.join(module_dir, "data",  snake + "Config.json"),      f_module_config)
write_file(os.path.join(module_dir, "types.ts"),                          f_types)
write_file(os.path.join(module_dir, "constants.ts"),                      f_constants)
write_file(os.path.join(module_dir, "utils.ts"),                          f_utils)
write_file(os.path.join(module_dir, "get" + pascal + "List.ts"),          f_get_list)
write_file(os.path.join(module_dir, "index.ts"),                          f_index)
write_file(os.path.join(module_dir, "__tests__", "get" + pascal + "List.test.ts"), f_test)

print("UTILITY_DONE|%s|files=10|entries=%d" % (snake, len(data_dict)))
