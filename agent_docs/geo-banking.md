# Geo & Banking Modules

## Supported Countries

Subdivision and banking data is limited to: **IN, MY, SG, US**

This constraint is enforced in two places:
- `packages/i18nify-js/src/modules/shared/sourceConstants.ts:I18NIFY_DATA_SUPPORTED_COUNTRIES`
- `packages/i18nify-js/src/modules/geo/types.ts:I18nifyCountryCodeType`

All world countries (~250) are supported for metadata and flags.

## Geo Module Functions

`packages/i18nify-js/src/modules/geo/`

### Remote-fetch (return Promises, fetch from GitHub raw)

| Function | Returns | Notes |
|---|---|---|
| `getAllCountries()` | `Record<CountryCodeType, CountryMetaType>` | Full metadata for all world countries |
| `getByCountry(cc)` | `CountryMetaType` | Single country metadata |
| `getStates(cc)` | states object | IN/MY/SG/US only |
| `getCities(cc, stateCode?)` | `string[]` city names | All states if no stateCode |
| `getZipcodes(cc, stateCode?)` | `string[]` | Deduplicated via Set |
| `getZipcodesByCity(cc, cityIdentifier)` | `string[]` | Exact name match first, then partial |
| `getCityByZipcode(zip, cc?)` | `string` city name | Searches all supported countries in parallel if no cc |
| `getStatesByZipCode(zip, cc?)` | `{code, name, country}` | Parallel search; returns first match |
| `validateZipCode(zip, cc?)` | `boolean` | Parallel search across all supported countries |
| `getLocaleByCountry(cc)` | `string[]` | Locale codes for a country |
| `getLocaleList()` | `Record<string, string[]>` | All countries' locales |
| `getDefaultLocaleByCountry(cc)` | `string` | Single default locale |
| `getDefaultLocaleList()` | `Record<string, string>` | All countries' default locales |

### Synchronous (bundled data)

| Function | Returns |
|---|---|
| `getFlagOfCountry(cc)` | `{original: string, '4X3': string}` |
| `getFlagsForAllCountries()` | `Record<CountryCodeType, GetFlagReturnType>` |

`getFlagOfCountry` validates against `LIST_OF_ALL_COUNTRIES` — see `packages/i18nify-js/src/modules/geo/data/listOfAllCountries.ts`.

## Type Shapes

- `CountryMetaType` — `packages/i18nify-js/src/modules/geo/types.ts:1`
- `CountryDetailType` (subdivision response) — `packages/i18nify-js/src/modules/geo/types.ts:32`
- `CityType`, `StateType` — `packages/i18nify-js/src/modules/geo/types.ts:18`

## Remote Fetch Pattern

All remote geo functions follow the same structure. See canonical example: `packages/i18nify-js/src/modules/geo/getStates.ts:1`

## Banking Module

`packages/i18nify-js/src/modules/banking/getListOfBanks.ts`

- `getListOfBanks(countryCode)` — fetches `I18NIFY_DATA_SOURCE/bankcodes/{CC}.json`, returns `data.details[]` (banks without branch detail)
- Validates HTTP response `.ok` before parsing
- Only IN/MY/SG/US supported

Bank data shape: `i18nify-data/bankcodes/IN.json` — `{defaults: {identifier_type}, details: [{name, short_code, branches: [{code, city, identifiers}]}]}`
