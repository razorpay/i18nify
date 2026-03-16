# i18nify-go Package

## Entry Points

`packages/i18nify-go/`

- `NewCountry(code string) ICountry` — `packages/i18nify-go/country.go:70`
- `NewBank(countryCode string) *Bank` — `packages/i18nify-go/bank.go:19`

## ICountry Interface

Defined in `packages/i18nify-go/interface.go`:

| Method | Returns | Source module |
|---|---|---|
| `GetCountryMetadata()` | `MetadataInformation` | `modules/country_metadata` |
| `GetCountrySubDivisions()` | `CountrySubdivisions` | `modules/country_subdivisions` |
| `GetCountryPhoneNumber()` | `CountryTeleInformation` | `modules/phonenumber` |
| `GetCountryCurrency()` | `[]CurrencyInformation` | `modules/currency` |
| `GetStatesByZipCode(zip)` | `[]State` | `modules/country_subdivisions/zipcode` |
| `IsValidZipCode(zip)` | `bool` | `modules/country_subdivisions/zipcode` |
| `GetZipCodesFromCity(city)` | `[]string` | `modules/country_subdivisions/zipcode` |
| `GetCountryCodeISO2()` | `string` | `modules/country_metadata` |

## Module Structure

Each Go module uses `//go:embed data` to bundle JSON at compile time:

```
modules/
├── bankcodes/              # embed: data/*.json (per country)
├── country_subdivisions/   # embed: data/*.json (per country), cached in map
│   └── zipcode/            # zip lookup functions
├── country_metadata/       # embed: data/data.json
├── currency/               # embed: data/data.json
└── phonenumber/            # embed: data/data.json (single file, all countries)
```

## Caching

Three levels of caching across the Go modules:

| Module | Strategy | Detail |
|---|---|---|
| `country_metadata` | Package `init()` — loaded once at import | `var cachedCountyMetaData *CountryMetadata` populated in `init()`. Panics if file is missing. |
| `country_subdivisions` | Lazy map — loaded once per country code | `var countrySubDivisionStore = make(map[string]CountrySubdivisions)` |
| `country_subdivisions/zipcode` | Lazy map — built from subdivisions | `var zipCodeStore = make(map[string]ZipCodeData)` — inverted index (zipcode → states, city → zipcodes) |
| `currency`, `phonenumber`, `bankcodes` | No cache | JSON read and unmarshalled on every call |

`GetCountryCodeISO2` in `country_metadata` bypasses the cache and re-reads the file directly — takes a country *name* string and returns the ISO2 code (reverse lookup). `GetMetadataInformationByISONumericCode` uses the cache and looks up by numeric code string (e.g., `"356"` for India).

## Bank Operations (`modules/bankcodes/`)

Bank identifier types (constants):
- `IdentifierTypeIFSC = "IFSC"` — India
- `IdentifierTypeSWIFT = "SWIFT"` — international
- `IdentifierTypeRoutingNumber = "ROUTING_NUMBER"` — USA

Functions available at package level (not on an interface):
- `IsValidBankIdentifier(cc, identifierType, value)` — SWIFT normalizes trailing `XXX` (11-char → 8-char)
- `GetBankNameFromShortCode(cc, shortCode)` → bank name string
- `GetDefaultBankIdentifiersFromShortCode(cc, shortCode)` → identifiers using country's default type
- `GetBankNameFromBankIdentifier(cc, identifier)` → bank name by any identifier type
- `GetBaseBranchIdentifierFromShortCode(cc, bankShortCode)` → prefers branch with empty `code` field (main branch), falls back to first found
- `GetAllBanksWithShortCodes(cc)` → `map[shortCode]name`

The `Bank` struct (via `NewBank`) exposes only `GetAllBanksWithShortCodes` and `GetBaseBranchIdentifierFromShortCode`. Call package-level functions directly for the full API.

## Data Types

- `CountrySubdivisions`, `State`, `City` — `packages/i18nify-go/modules/country_subdivisions/country_subdivisions.go:38`
- `CountryTeleInformation` — `packages/i18nify-go/modules/phonenumber/phonenumber.go:78`
- `MetadataInformation` — `packages/i18nify-go/modules/country_metadata/country_metadata.go:94`
- `BankDetails`, `Branch`, `Identifier` — `packages/i18nify-go/modules/bankcodes/bankcodes.go:17`

## Running Go Tests

```
cd packages/i18nify-go
go test ./...
```

Test files: `*_test.go` in each module directory.
