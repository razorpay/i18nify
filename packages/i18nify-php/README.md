# razorpay/i18nify-php

The PHP SDK for [i18nify](https://github.com/razorpay/i18nify). Same data, same
behaviour as `@razorpay/i18nify-js` and `i18nify-go` — currently the currency
module (formatting and unit conversion).

Formatting runs on PHP's `intl` extension, which binds to the same ICU/CLDR
engine behind JS `Intl.NumberFormat`, so output matches the JS and Go SDKs for
the same locale and fraction digits.

## Install

```bash
composer require razorpay/i18nify-php
```

Requires PHP >= 7.4 and `ext-intl`.

## Usage

```php
use RZP\I18nify\Currency\Currency;

// Subunits in, display-ready string out (symbol rendered separately by templates)
Currency::formatSubunitsWithoutSymbol(12345678, 'INR');   // '1,23,456.78'
Currency::formatSubunitsWithoutSymbol(12345678, 'MYR');   // '123,456.78'
Currency::formatSubunitsWithoutSymbol(12345678, 'JPY');   // '12,345,678'
Currency::formatSubunitsWithoutSymbol(12345678, 'KWD');   // '12,345.678'

// Explicit locale
Currency::formatNumberWithoutSymbol(123456.78, ['currency' => 'SGD', 'locale' => 'en-US']);
// '123,456.78'

// With the canonical i18nify symbol
Currency::formatNumber(123456.78, ['currency' => 'MYR', 'locale' => 'en-US']);
// 'RM123,456.78'

// Structured breakdown (mirrors the JS ByParts type)
Currency::formatNumberByParts(-123456.78, ['currency' => 'MYR', 'locale' => 'en-US']);
// ['integer' => '123,456', 'decimal' => '.', 'fraction' => '78',
//  'currency' => 'RM', 'minusSign' => '-', 'isPrefixSymbol' => true, 'rawParts' => [...]]

// Unit conversion and metadata
Currency::convertToMajorUnit(12345678, 'MYR');   // 123456.78
Currency::convertToMinorUnit(123456.78, 'MYR');  // 12345678.0
Currency::getMinorUnit('KWD');                   // 3
Currency::getCurrencySymbol('SGD');              // 'S$'
Currency::isValidCurrencyCode('ZZZ');            // false
```

### Display locale

When `locale` is omitted from `formatNumberWithoutSymbol()` /
`formatSubunitsWithoutSymbol()`, it is derived from the currency:

| Currency | Locale  | Grouping                        |
| -------- | ------- | ------------------------------- |
| INR      | `en-IN` | lakh/crore — `1,23,456.78`      |
| all else | `en-US` | international — `123,456.78`    |

`formatNumber()` and `formatNumberByParts()` fall back to
`Currency::DEFAULT_LOCALE` (`en-IN`), matching `i18nify-go` and `i18nify-js`.

Unknown currency codes degrade gracefully: 2 minor units, prefix symbol, code
used as the symbol. Use `isValidCurrencyCode()` when you need strictness.

## Data

Currency metadata comes from the canonical dataset at
`i18nify-data/currency/data.json`. There is no copy of it in this package's
source tree — inside the monorepo the SDK reads that file in place, so the JS,
Go and PHP SDKs can never disagree about the data. The release pipeline copies
it into the published package so Composer installs are self-contained.

To point the SDK at a dataset somewhere else (shared volume, config-managed
path, test fixture), set `I18NIFY_CURRENCY_DATA_PATH` or call
`Currency::setDataPath('/path/to/data.json')`. `Currency::resolveDataPath()`
reports which file is in use.

## Development

```bash
cd packages/i18nify-php
composer install
composer test
```

`scripts/php/sync-data.sh` (from the repo root) verifies the canonical dataset
and fails if a copy has crept into the package.
