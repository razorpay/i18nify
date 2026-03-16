# i18nify Data Pipeline

## i18nify-data Structure

`i18nify-data/` is the canonical source of truth. All packages consume it.

| Path | Key | Contents |
|---|---|---|
| `country/metadata/data.json` | `metadata_information` | All world countries — name, dial_code, supported_currency[], locales{}, default_locale, default_currency, timezones{}, alpha_3, numeric_code, flag, sovereignty |
| `country/subdivisions/{CC}.json` | `states` | States → cities → zipcodes + timezone. Only IN, MY, SG, US |
| `currency/data.json` | `currency_information` | Per-currency: name, symbol, minor_unit, numeric_code, physical_currency_denominations[] |
| `bankcodes/{CC}.json` | `defaults`, `details` | Bank list with branches, SWIFT/IFSC/routing identifiers |
| `phone-number/country-code-to-phone-number/data.json` | `country_tele_information` | Per-country: dial_code, format (`xxxx xxxxxx`), regex |
| `phone-number/dial-code-to-country/data.json` | `dial_code_to_country` | Dial code → [country codes] (multiple countries can share a dial code) |
| `assets/flags/*.svg` | — | SVG flags, lowercase filenames (e.g., `in.svg`) |

Each folder also has a `schema.json` for validation.

## Pre-build Subset Generation

Before Rollup runs, `scripts/jsonSubsets/index.ts` strips the large `i18nify-data` JSONs into minimal bundled subsets:

| Source | Output | Strips to |
|---|---|---|
| `currency/data.json` → `currency_information` | `src/modules/currency/data/currencyConfig.json` | `{name, minor_unit, symbol}` per code |
| `phone-number/country-code-to-phone-number/data.json` → `country_tele_information` | `src/modules/phoneNumber/data/phoneFormatterMapper.json` | `{CC: "format_string"}` |
| `phone-number/country-code-to-phone-number/data.json` → `country_tele_information` | `src/modules/phoneNumber/data/phoneRegexMapper.json` | `{CC: "regex_string"}` |

These generated files are **committed to the repo** and must be regenerated when i18nify-data changes:
```
yarn workspace @razorpay/i18nify-js run generate:jsonSubsets
```

## Adding a New Country (Subdivisions)

1. Add `i18nify-data/country/subdivisions/{CC}.json` following the schema in `i18nify-data/country/subdivisions/schema.json`
2. Add `{CC}` to `available_countries` array in `scripts/dataValidate.ts` (line ~110) — otherwise the validation script skips the new file
3. Add the country code to `I18NIFY_DATA_SUPPORTED_COUNTRIES` in `packages/i18nify-js/src/modules/shared/sourceConstants.ts`
4. Update `I18nifyCountryCodeType` union in `packages/i18nify-js/src/modules/geo/types.ts`
5. Add banking data at `i18nify-data/bankcodes/{CC}.json` if applicable
6. Validate: `yarn validate-i18nify-data`

## Adding/Updating Currency Data

1. Edit `i18nify-data/currency/data.json`
2. Regenerate subsets: `yarn workspace @razorpay/i18nify-js run generate:jsonSubsets`
3. If the new currency has an ambiguous symbol (e.g., `$`), add it to `INTL_MAPPING` in `packages/i18nify-js/src/modules/currency/constants.ts`

## Data Validation

The `yarn validate-i18nify-data` script takes a list of changed files and validates each against its `schema.json` using AJV. Run this after any changes to `i18nify-data/`.

## Runtime Data Fetching

Geographic and banking functions fetch data at runtime from:
```
https://raw.githubusercontent.com/razorpay/i18nify/master/i18nify-data
```
This constant is at `packages/i18nify-js/src/modules/shared/sourceConstants.ts:I18NIFY_DATA_SOURCE`.

Flags are served from `https://flagcdn.com` (original aspect ratio) and `https://unpkg.com/@razorpay/i18nify-js/lib/assets/flags` (4×3).
