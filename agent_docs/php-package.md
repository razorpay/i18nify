# i18nify-php

PHP SDK, `packages/i18nify-php/`. Composer package name: `razorpay/i18nify-php`.

## Why it exists

The API monolith needed locale-correct invoice amount formatting for non-Indian
currencies. i18nify shipped JS and Go only, so the first cut of that work
hand-ported the currency module into `api/app/lib/I18nify/` and vendored a copy
of `i18nify-data/currency/data.json` alongside it. That is two sources of truth
for one behaviour. This package is the fix: i18nify owns the data *and* the
formatting logic, and the monolith keeps only thin wiring.

## Layout

```
packages/i18nify-php/
├── composer.json                        # PSR-4: RZP\I18nify\ -> src/
├── phpunit.xml
├── src/Currency/
│   ├── Currency.php                     # public API (mirrors i18nify-js surface)
│   └── FormatNumber.php                 # NumberFormatter, locale resolution, parts assembly
└── tests/CurrencyTest.php
```

No `data/` directory in git — the dataset is read from `i18nify-data/`.

`FormatNumber.php` is the counterpart of i18nify-go's `format_number.go`. It is
not named `format_number.php` because PSR-4 autoloading requires the filename to
match the class name.

## Architecture

Three SDKs, one dataset, one formatting engine per language binding:

```
i18nify-data/currency/data.json (canonical)
      │
      ├── JS:  prebuild strips it into src/modules/currency/data/currencyConfig.json
      ├── Go:  //go:embed via the generated i18nify-data/go/currency module
      └── PHP: read in place with file_get_contents — no copy in the package
```

Formatting itself is ICU/CLDR in all three: `Intl.NumberFormat` (JS),
`golang.org/x/text` (Go), `ext-intl` `NumberFormatter` (PHP). Same locale + same
fraction digits therefore produce the same string, which
`scripts/php/parity-check.sh` asserts in CI against Node.

## Where the data comes from

There is **no dataset file in this package's git tree**. `Currency::resolveDataPath()`
picks the first hit from, in order:

1. `$I18NIFY_CURRENCY_DATA_PATH` / `Currency::setDataPath()` — explicit override.
2. `__DIR__/../../../../i18nify-data/currency/data.json` — the canonical file,
   used whenever the package sits inside the monorepo (local dev, CI, a
   `path`-type composer repository). Read in place, so it cannot drift.
3. `__DIR__/data/currency.json` — dist-local copy. Exists only in the published
   package, produced by `scripts/php/sync-data.sh --deref` during release.

`scripts/php/sync-data.sh`:

| Invocation | What it does |
|---|---|
| (no args) | Verifies the canonical file parses **and** that `src/Currency/data/currency.json` is not tracked in git. CI runs this before the tests. |
| `--deref` | Copies the canonical file into the package. Release only. |
| `--clean` | Removes the copy. |

`src/Currency/data/` is gitignored. The release job strips that ignore rule from
the copied `.gitignore` before splitting, otherwise the mirror repo would commit
a package with no data in it — there is an explicit assertion for this in
`php-release.yml`.

If you add another module (phone-number, country, …) add its mapping to the
`MAPPINGS` array in `scripts/php/sync-data.sh` and a candidate path in
`Currency::DATA_PATH_CANDIDATES`-style resolution for that module. Never commit
a copy.

## Locale resolution

| Caller                                                      | Locale when omitted                       |
| ----------------------------------------------------------- | ----------------------------------------- |
| `formatNumber()`, `formatNumberByParts()`                    | `Currency::DEFAULT_LOCALE` = `en-IN`      |
| `formatNumberWithoutSymbol()`, `formatSubunitsWithoutSymbol()` | `FormatNumber::localeForCurrency($code)`  |

`localeForCurrency()` is the mapping that used to live in the monolith:
`INR -> en-IN` (lakh/crore), everything else `-> en-US` (international). Add
overrides to `FormatNumber::$currencyDisplayLocales`, not at call sites.

Unknown currency codes degrade rather than throw: 2 minor units, prefix symbol,
code used as its own symbol. `isValidCurrencyCode()` is there when a caller
needs strictness.

## Commands

```bash
cd packages/i18nify-php
composer install
composer test                      # phpunit
composer validate --strict

# from repo root
scripts/php/sync-data.sh           # verify canonical dataset, assert no copy in the package
scripts/php/sync-data.sh --deref   # materialise the dist copy (release only)
scripts/php/sync-data.sh --clean   # remove the dist copy
scripts/php/parity-check.sh        # PHP vs JS Intl output diff (needs php+intl+node)
```

## Release

Packagist cannot serve a package from a monorepo subdirectory, so releases
mirror the Go flow — see `.github/workflows/php-release.yml`:

1. `sync-data.sh --deref` copies the canonical dataset into the package.
2. `composer validate` + PHPUnit gate the release.
3. Version resolved from the latest `i18nify-php/v*` tag, bumped by the merged
   PR's `php:major` / `php:minor` / `php:patch` label (default patch). This is
   the changeset equivalent — changesets itself is npm-only and ignores this
   package. Record the human-readable entry in
   `packages/i18nify-php/CHANGELOG.md`.
4. `symplify/monorepo-split-github-action` pushes `packages/i18nify-php/` to the
   read-only mirror `razorpay/i18nify-php` and tags it `vX.Y.Z`.
5. The monorepo is tagged `i18nify-php/vX.Y.Z`.
6. Packagist picks up the mirror tag from its GitHub webhook; the workflow also
   POSTs to the Packagist update API when `PACKAGIST_USERNAME` /
   `PACKAGIST_TOKEN` are configured.

**One-time setup required before the first release:** create the
`razorpay/i18nify-php` mirror repo, submit it to Packagist (the package name in
`composer.json` matches the mirror repo name, so there is nothing to reconcile),
and give `CI_BOT_TOKEN` write access to the mirror. If public Packagist is not acceptable, point an internal Satis/Private
Packagist instance at the mirror instead — nothing else in the flow changes.

`composer.json` deliberately carries **no** `version` field; Packagist derives
it from tags.

## Consuming from the API monolith

```php
use RZP\I18nify\Currency\Currency;

// subunits in, display string out — replaces the local FormatsInvoiceAmounts logic
Currency::formatSubunitsWithoutSymbol($amount, $invoice->getCurrency());
```
