"""
Standalone Recipe 8-Go runner used by test_execution_harness.py.

Environment variables (mirrors recipe8_runner.py):
  UC_TOPIC_KEY       — canonical topic key (e.g. "currency_codes")
  UC_PROJECT_ROOT    — absolute path to the project root (temp workspace)
  UC_TSF_RESULT_PATH — path to the tsf_result.json fixture

Prerequisite: recipe8_runner.py must have already written
  {PROJECT_ROOT}/i18nify-data/{snake}/data.json

Writes Go utility files and prints WROTE| / GO_UTILITY_DONE| tokens.
Uses named .format() throughout so Go % format verbs (%v, %w, %s) never
interfere with Python string formatting.
"""

import json
import os
import re
import sys

TOPIC_KEY    = os.environ["UC_TOPIC_KEY"]
PROJECT_ROOT = os.environ["UC_PROJECT_ROOT"]
TSF_RESULT   = os.environ["UC_TSF_RESULT_PATH"]

TOPIC_MAP = {
    "currency_codes":      {"snake": "currency",    "pascal": "Currency",    "data_key": "currency_information",     "go_pkg": "currency"},
    "country_codes":       {"snake": "country",     "pascal": "Country",     "data_key": "country_information",      "go_pkg": "country"},
    "phone_calling_codes": {"snake": "phoneNumber", "pascal": "PhoneNumber", "data_key": "country_tele_information", "go_pkg": "phonenumber"},
    "language_codes":      {"snake": "language",    "pascal": "Language",    "data_key": "language_information",     "go_pkg": "language"},
    "timezones":           {"snake": "timezone",    "pascal": "Timezone",    "data_key": "timezone_information",     "go_pkg": "timezone"},
    "tld_list":            {"snake": "tld",         "pascal": "Tld",         "data_key": "tld_information",          "go_pkg": "tld"},
    "address_formats":     {"snake": "address",     "pascal": "Address",     "data_key": "address_format_information", "go_pkg": "address"},
    "gst_rates_india":     {"snake": "gst",         "pascal": "Gst",         "data_key": "gst_information",          "go_pkg": "gst"},
    "population_data":     {"snake": "population",  "pascal": "Population",  "data_key": "population_information",   "go_pkg": "population"},
}

cfg = TOPIC_MAP.get(TOPIC_KEY)
if not cfg:
    print("GO_UTILITY_ERROR|unsupported topic '%s'" % TOPIC_KEY)
    sys.exit(1)

snake         = cfg["snake"]
pascal        = cfg["pascal"]
data_key      = cfg["data_key"]
go_pkg        = cfg["go_pkg"]

# ── Load canonical data written by recipe8_runner.py ─────────────────────────

data_path = os.path.join(PROJECT_ROOT, "i18nify-data", snake, "data.json")
if not os.path.exists(data_path):
    print("GO_UTILITY_ERROR|canonical data not found at i18nify-data/%s/data.json" % snake)
    sys.exit(1)

with open(data_path, encoding="utf-8") as f:
    canonical = json.load(f)

data_dict = canonical.get(data_key, {})
if not data_dict:
    print("GO_UTILITY_ERROR|key '%s' not found in canonical data" % data_key)
    sys.exit(1)

# ── Helpers ───────────────────────────────────────────────────────────────────

def _to_pascal(s):
    return "".join(p.capitalize() for p in re.split(r"[_\s]+", s) if p)


def _go_type(val):
    if val is None:            return "string"
    if isinstance(val, bool):  return "bool"
    if isinstance(val, int):   return "int32"
    if isinstance(val, float): return "float64"
    if isinstance(val, list):
        return "[]string" if not val or isinstance(val[0], str) else "json.RawMessage"
    if isinstance(val, dict):  return "json.RawMessage"
    return "string"


def _go_zero(go_type):
    if go_type == "string":                      return '""'
    if go_type in ("int32", "int64", "float64"): return "0"
    if go_type == "bool":                        return "false"
    return "nil"


def _collect_samples(entries):
    all_keys = {}
    for entry in entries:
        if isinstance(entry, dict):
            for k in entry:
                all_keys.setdefault(k, None)
    for k in list(all_keys):
        for entry in entries:
            if isinstance(entry, dict) and k in entry:
                v = entry[k]
                if v not in (None, "", [], {}):
                    all_keys[k] = v
                    break
    return all_keys


def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(content)
    print("WROTE|" + os.path.relpath(path, PROJECT_ROOT))


# ── Derive struct fields from sample data ─────────────────────────────────────

samples          = _collect_samples(list(data_dict.values()))
fields_named     = [(_to_pascal(fn), _go_type(fv), fn) for fn, fv in samples.items()]
data_key_pascal  = _to_pascal(data_key)
needs_json       = any(gt == "json.RawMessage" for _, gt, _ in fields_named)

# ── File 1: {go_pkg}.pb.go ────────────────────────────────────────────────────

_pb_header = "// Hand-written Go structs mirroring {go_pkg}.proto.\n// Matches the canonical i18nify-data/{go_pkg}/data.json schema.\n\npackage {go_pkg}\n".format(go_pkg=go_pkg)
if needs_json:
    _pb_header += '\nimport "encoding/json"\n'

_pb_data_struct = (
    "\n// {pascal}Data is the root container parsed from data.json.\n"
    "type {pascal}Data struct {{\n"
    "\t{dkp} map[string]*{pascal}Info `json:\"{data_key},omitempty\"`\n"
    "}}\n\n"
    "func (x *{pascal}Data) Get{dkp}() map[string]*{pascal}Info {{\n"
    "\tif x != nil {{\n"
    "\t\treturn x.{dkp}\n"
    "\t}}\n"
    "\treturn nil\n"
    "}}\n"
).format(pascal=pascal, dkp=data_key_pascal, data_key=data_key)

_pb_info_struct = (
    "\n// {pascal}Info holds all fields for a single {go_pkg} entry.\n"
    "type {pascal}Info struct {{\n"
).format(pascal=pascal, go_pkg=go_pkg)
for gfname, gtype, jname in fields_named:
    _pb_info_struct += '\t{name} {gtype} `json:"{jname},omitempty"`\n'.format(
        name=gfname, gtype=gtype, jname=jname)
_pb_info_struct += "}\n"

_pb_getters = ""
for gfname, gtype, jname in fields_named:
    _pb_getters += (
        "\nfunc (x *{pascal}Info) Get{gfname}() {gtype} {{\n"
        "\tif x != nil {{\n"
        "\t\treturn x.{gfname}\n"
        "\t}}\n"
        "\treturn {zero}\n"
        "}}\n"
    ).format(pascal=pascal, gfname=gfname, gtype=gtype, zero=_go_zero(gtype))

f_go_pb = _pb_header + _pb_data_struct + _pb_info_struct + _pb_getters

# ── File 2: data_loader.go ────────────────────────────────────────────────────

f_go_loader = (
    "// Code generated by i18nify utility-creator. DO NOT EDIT.\n\n"
    "package {go_pkg}\n\n"
    'import (\n\t_ "embed"\n\t"encoding/json"\n\t"sync"\n)\n\n'
    "//go:embed data/data.json\n"
    "var dataJSON []byte\n\n"
    "var (\n"
    "\tdata     *{pascal}Data\n"
    "\tdataOnce sync.Once\n"
    "\tdataErr  error\n"
    ")\n\n"
    "// Get{pascal}Data retrieves the {go_pkg} data (singleton, thread-safe).\n"
    "func Get{pascal}Data() (*{pascal}Data, error) {{\n"
    "\tdataOnce.Do(func() {{\n"
    "\t\tdata = &{pascal}Data{{}}\n"
    "\t\tdataErr = json.Unmarshal(dataJSON, data)\n"
    "\t}})\n"
    "\treturn data, dataErr\n"
    "}}\n"
).format(go_pkg=go_pkg, pascal=pascal)

# ── File 3: data_loader_test.go ───────────────────────────────────────────────

f_go_loader_test = (
    "// Code generated by i18nify utility-creator. DO NOT EDIT.\n\n"
    "package {go_pkg}\n\n"
    'import (\n\t"testing"\n)\n\n'
    "func TestGet{pascal}Data(t *testing.T) {{\n"
    "\tdata, err := Get{pascal}Data()\n"
    "\tif err != nil {{\n"
    '\t\tt.Fatalf("Get{pascal}Data() error = %v", err)\n'
    "\t}}\n"
    "\tif data == nil {{\n"
    '\t\tt.Fatal("Get{pascal}Data() returned nil")\n'
    "\t}}\n"
    "}}\n\n"
    "func TestGet{pascal}Data_Idempotent(t *testing.T) {{\n"
    "\td1, err1 := Get{pascal}Data()\n"
    "\tif err1 != nil {{\n"
    '\t\tt.Fatalf("first call error: %v", err1)\n'
    "\t}}\n"
    "\td2, err2 := Get{pascal}Data()\n"
    "\tif err2 != nil {{\n"
    '\t\tt.Fatalf("second call error: %v", err2)\n'
    "\t}}\n"
    "\tif d1 != d2 {{\n"
    '\t\tt.Error("Get{pascal}Data() must return the same cached pointer")\n'
    "\t}}\n"
    "}}\n\n"
    "func TestGet{pascal}Data_NotEmpty(t *testing.T) {{\n"
    "\tdata, err := Get{pascal}Data()\n"
    "\tif err != nil {{\n"
    '\t\tt.Fatalf("Get{pascal}Data() error = %v", err)\n'
    "\t}}\n"
    "\tif data == nil {{\n"
    '\t\tt.Error("Data should not be nil")\n'
    "\t}}\n"
    "\tif len(data.Get{dkp}()) == 0 {{\n"
    '\t\tt.Error("{dkp} should not be empty")\n'
    "\t}}\n"
    "}}\n"
).format(go_pkg=go_pkg, pascal=pascal, dkp=data_key_pascal)

# ── File 4: go.mod ────────────────────────────────────────────────────────────

f_go_mod = "module github.com/razorpay/i18nify/i18nify-data/go/{go_pkg}\n\ngo 1.20\n".format(go_pkg=go_pkg)

# ── File 5: packages/i18nify-go/modules/{snake}/{go_pkg}.go ──────────────────

_mod_info_fields = ""
for gfname, gtype, jname in fields_named:
    _mod_info_fields += '\t{name} {gtype} `json:"{jname}"`\n'.format(
        name=gfname, gtype=gtype, jname=jname)

f_go_module = (
    "// Package {go_pkg} provides {go_pkg} information keyed by country code.\n"
    "package {go_pkg}\n\n"
    'import (\n\t"encoding/json"\n\t"fmt"\n\n'
    '\tdataSource "github.com/razorpay/i18nify/i18nify-data/go/{go_pkg}"\n'
    ")\n\n"
    "// {pascal}Info contains data for a single {go_pkg} entry.\n"
    "type {pascal}Info struct {{\n"
    "{mod_info_fields}"
    "}}\n\n"
    "// {pascal}Data holds {go_pkg} information keyed by country code.\n"
    "type {pascal}Data struct {{\n"
    '\t{dkp} map[string]{pascal}Info `json:"{data_key}"`\n'
    "}}\n\n"
    "var cached{pascal}Data *{pascal}Data\n\n"
    "func init() {{\n"
    "\tsrc, err := dataSource.Get{pascal}Data()\n"
    "\tif err != nil {{\n"
    '\t\tpanic(fmt.Sprintf("failed to load {go_pkg} data: %v", err))\n'
    "\t}}\n"
    "\td := convertFromDataSource(src)\n"
    "\tcached{pascal}Data = &d\n"
    "}}\n\n"
    "func convertFromDataSource(src *dataSource.{pascal}Data) {pascal}Data {{\n"
    "\tif src == nil {{\n"
    "\t\treturn {pascal}Data{{}}\n"
    "\t}}\n"
    "\tinfo := make(map[string]{pascal}Info, len(src.Get{dkp}()))\n"
    "\tfor cc, entry := range src.Get{dkp}() {{\n"
    "\t\tif entry == nil {{\n"
    "\t\t\tcontinue\n"
    "\t\t}}\n"
    "\t\tb, _ := json.Marshal(entry)\n"
    "\t\tvar v {pascal}Info\n"
    "\t\tif err := json.Unmarshal(b, &v); err != nil {{\n"
    "\t\t\tcontinue\n"
    "\t\t}}\n"
    "\t\tinfo[cc] = v\n"
    "\t}}\n"
    "\treturn {pascal}Data{{{dkp}: info}}\n"
    "}}\n\n"
    "// Unmarshal{pascal}Data parses raw JSON into a {pascal}Data struct.\n"
    "func Unmarshal{pascal}Data(data []byte) ({pascal}Data, error) {{\n"
    "\tvar r {pascal}Data\n"
    "\terr := json.Unmarshal(data, &r)\n"
    "\treturn r, err\n"
    "}}\n\n"
    "// Get{pascal}List returns all {go_pkg} entries keyed by code.\n"
    "func Get{pascal}List() map[string]{pascal}Info {{\n"
    "\treturn cached{pascal}Data.{dkp}\n"
    "}}\n\n"
    "// Get{pascal}Info returns the {go_pkg} entry for the given code.\n"
    "func Get{pascal}Info(cc string) ({pascal}Info, error) {{\n"
    '\tif cc == "" {{\n'
    '\t\treturn {pascal}Info{{}}, fmt.Errorf("code cannot be empty")\n'
    "\t}}\n"
    "\tinfo, ok := cached{pascal}Data.{dkp}[cc]\n"
    "\tif !ok {{\n"
    '\t\treturn {pascal}Info{{}}, fmt.Errorf("{pascal} info for \'%s\' not found", cc)\n'
    "\t}}\n"
    "\treturn info, nil\n"
    "}}\n"
).format(
    go_pkg=go_pkg, pascal=pascal, data_key=data_key,
    dkp=data_key_pascal, mod_info_fields=_mod_info_fields,
)

# ── File 6: packages/i18nify-go/modules/{snake}/{go_pkg}_test.go ─────────────

f_go_module_test = (
    "package {go_pkg}\n\n"
    'import (\n\t"testing"\n)\n\n'
    "func TestGet{pascal}List(t *testing.T) {{\n"
    "\tlist := Get{pascal}List()\n"
    "\tif len(list) == 0 {{\n"
    '\t\tt.Error("Get{pascal}List returned empty map")\n'
    "\t}}\n"
    "}}\n\n"
    "func TestGet{pascal}Info_Empty(t *testing.T) {{\n"
    '\t_, err := Get{pascal}Info("")\n'
    "\tif err == nil {{\n"
    '\t\tt.Error("expected error for empty code, got nil")\n'
    "\t}}\n"
    "}}\n\n"
    "func TestGet{pascal}Info_Unknown(t *testing.T) {{\n"
    '\t_, err := Get{pascal}Info("ZZZZ")\n'
    "\tif err == nil {{\n"
    '\t\tt.Error("expected error for unknown code, got nil")\n'
    "\t}}\n"
    "}}\n\n"
    "func TestUnmarshal{pascal}Data(t *testing.T) {{\n"
    "\tlist := Get{pascal}List()\n"
    "\tif len(list) == 0 {{\n"
    '\t\tt.Error("list should not be empty")\n'
    "\t}}\n"
    "}}\n"
).format(go_pkg=go_pkg, pascal=pascal)

# ── Write all files ───────────────────────────────────────────────────────────

go_data_dir = os.path.join(PROJECT_ROOT, "i18nify-data", "go", go_pkg)
write_file(os.path.join(go_data_dir, "%s.pb.go" % go_pkg),     f_go_pb)
write_file(os.path.join(go_data_dir, "data_loader.go"),         f_go_loader)
write_file(os.path.join(go_data_dir, "data_loader_test.go"),    f_go_loader_test)
write_file(os.path.join(go_data_dir, "data", "data.json"),      json.dumps(canonical, ensure_ascii=False, indent=2))
write_file(os.path.join(go_data_dir, "go.mod"),                 f_go_mod)

go_mod_dir = os.path.join(PROJECT_ROOT, "packages", "i18nify-go", "modules", snake)
write_file(os.path.join(go_mod_dir, "%s.go" % go_pkg),          f_go_module)
write_file(os.path.join(go_mod_dir, "%s_test.go" % go_pkg),     f_go_module_test)

print("GO_UTILITY_DONE|%s|files=7|entries=%d" % (go_pkg, len(data_dict)))
