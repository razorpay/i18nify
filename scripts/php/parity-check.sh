#!/usr/bin/env bash
#
# Cross-SDK parity check: the PHP SDK must produce the same number strings as
# the JS SDK for the same locale and fraction digits. Both sit on ICU/CLDR
# (ext-intl and Intl.NumberFormat respectively), so a divergence here means the
# PHP port has drifted from i18nify-js rather than a CLDR difference.
#
# Compares RZP\I18nify\Currency\Currency::formatNumberWithoutSymbol() against
# Node's Intl.NumberFormat decimal output. Two deliberate scope limits:
#   * The currency symbol is excluded — every i18nify SDK overrides Intl's
#     symbol with the dataset value, so it is not an ICU behaviour worth diffing.
#   * Locales are limited to en-* (Latin digits, stable CLDR grouping). PHP and
#     Node bundle independent ICU versions, and comparing locales whose
#     separators or numbering systems changed between CLDR releases produces
#     failures that say nothing about this package.
#
# Usage: scripts/php/parity-check.sh
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PKG_DIR="$REPO_ROOT/packages/i18nify-php"

command -v php >/dev/null || { echo "✗ php not found on PATH" >&2; exit 1; }
command -v node >/dev/null || { echo "✗ node not found on PATH" >&2; exit 1; }
php -m | grep -qix 'intl' || { echo "✗ ext-intl is not loaded" >&2; exit 1; }

# amount(major)|currency|locale
CASES=$(cat <<'EOF'
0|INR|en-IN
1.23|INR|en-IN
123456.78|INR|en-IN
12345678.9|INR|en-IN
-123456.78|INR|en-IN
99999999.99|INR|en-IN
123456.78|MYR|en-US
123456.78|SGD|en-US
123456.78|USD|en-US
12345678.9|MYR|en-US
-123456.78|SGD|en-US
12345678|JPY|en-US
12345.678|KWD|en-US
1234.5|BHD|en-US
987654321.05|USD|en-GB
987654321.05|USD|en-AU
EOF
)

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

printf '%s\n' "$CASES" > "$TMP_DIR/cases.txt"

php -r '
require $argv[1] . "/vendor/autoload.php";

use RZP\I18nify\Currency\Currency;

$out = fopen($argv[3], "w");

foreach (file($argv[2], FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
    list($amount, $currency, $locale) = explode("|", $line);

    fwrite($out, $line . "\t" . Currency::formatNumberWithoutSymbol((float) $amount, [
        "currency" => $currency,
        "locale"   => $locale,
    ]) . "\n");
}

fclose($out);
' "$PKG_DIR" "$TMP_DIR/cases.txt" "$TMP_DIR/php.tsv"

node -e '
const fs = require("fs");
const [casesFile, dataFile, outFile] = process.argv.slice(1);
const info = JSON.parse(fs.readFileSync(dataFile, "utf8")).currency_information;

const lines = fs
  .readFileSync(casesFile, "utf8")
  .trim()
  .split("\n")
  .map((line) => {
    const [amount, currency, locale] = line.split("|");
    const entry = info[currency];
    const minorUnit = Number(entry ? entry.minor_unit : 2);
    const formatted = new Intl.NumberFormat(locale, {
      style: "decimal",
      minimumFractionDigits: minorUnit,
      maximumFractionDigits: minorUnit,
    }).format(Number(amount));
    return line + "\t" + formatted;
  });

fs.writeFileSync(outFile, lines.join("\n") + "\n");
' "$TMP_DIR/cases.txt" "$REPO_ROOT/i18nify-data/currency/data.json" "$TMP_DIR/js.tsv"

if diff -u "$TMP_DIR/js.tsv" "$TMP_DIR/php.tsv" > "$TMP_DIR/diff.txt"; then
  echo "✓ PHP and JS number formatting agree on $(grep -c . "$TMP_DIR/cases.txt") cases"
else
  echo "✗ PHP and JS number formatting diverge (- = JS, + = PHP):" >&2
  cat "$TMP_DIR/diff.txt" >&2
  exit 1
fi
