# i18nify-go

A comprehensive internationalization solution for Go applications, providing easy access to country, currency, phone number, bank codes, and subdivision data.

## Requirements
- Go 1.20 or higher

## Installation

```bash
go get github.com/razorpay/i18nify/packages/i18nify-go
```

## How Data Is Loaded

This package uses an **externalized data architecture**. All data lives in dedicated Go modules under [`i18nify-data/go/`](../../i18nify-data/go/) in this repository, separate from the consumer code.

```
i18nify-data/go/
├── bankcodes/                          # Bank codes data package
├── currency/                           # Currency data package
├── country/
│   ├── metadata/                       # Country metadata data package
│   └── subdivisions/                   # Country subdivisions data package
└── phone-number/
    └── country-code-to-phone-number/   # Phone number data package
```

### How it works

Each data package:
1. Contains a **proto-generated Go struct** (`*.pb.go`) defining the data schema
2. Embeds the source JSON data via `//go:embed data/*.json`
3. Exposes a **`Get*Data()` function** that deserializes the JSON into the proto struct once (lazy, cached)

The consumer modules (`packages/i18nify-go/modules/`) import these data packages and call the getter functions. They then convert the proto types into their own exported types via a `convertFromDataSource()` function.

```
Source JSON (i18nify-data/*)
    ↓  copied by generate-package.sh
Embedded JSON (i18nify-data/go/*/data/*.json)
    ↓  protojson.Unmarshal (once, cached)
Proto struct (*pb.go)
    ↓  convertFromDataSource()
Consumer struct (returned to callers)
```

### Data lifecycle

- Data is loaded **once** on first call via `sync.Once` (single file) or an RWMutex cache keyed by country code (multi-file)
- All subsequent calls return from the in-memory cache
- The Go binary embeds all data at compile time — no network calls, no file I/O at runtime

### Updating data

Data is updated automatically by the **Auto-Generate Go Packages** CI workflow whenever source data changes in `i18nify-data/`. The workflow:
1. Validates the source data against the proto schema
2. Regenerates the data package (copies JSON, recompiles proto)
3. Commits the updated package and bumps the version in `go.mod`

---

## Features

### 1. Country Metadata
- Country names and codes (ISO 3166-1 alpha-2 and alpha-3)
- Supported currencies and default currency
- International dial codes
- Timezone information with UTC offsets
- Default locale settings
- Locale list

```go
import "github.com/razorpay/i18nify/packages/i18nify-go/modules/country_metadata"

info := country_metadata.GetMetadataInformation("IN")
fmt.Println(info.CountryName)       // India
fmt.Println(info.DialCode)          // +91
fmt.Println(info.SupportedCurrency) // [INR]
fmt.Println(info.Alpha3)            // IND

// Lookup by numeric code
info = country_metadata.GetMetadataInformationByISONumericCode("356") // India

// Lookup by alpha-3
code := country_metadata.GetCountryCodeFromAlpha3("IND") // IN

// Lookup by country name
code = country_metadata.GetCountryCodeISO2("India") // IN
```

### 2. Currency
- Currency names, symbols, and ISO 4217 numeric codes
- Minor unit (decimal places)
- Physical currency denominations
- Conversion between major and minor units

```go
import "github.com/razorpay/i18nify/packages/i18nify-go/modules/currency"

info, _ := currency.GetCurrencyInformation("INR")
fmt.Println(info.Name)    // Indian Rupee
fmt.Println(info.Symbol)  // ₹
fmt.Println(info.NumericCode) // 356

sym, _ := currency.GetCurrencySymbol("USD")  // $

code, _ := currency.GetCurrencyCodeByISONumericCode("840") // USD

// Format amounts
formatted, _ := info.FormatCurrency(1500000, "en-IN") // 15,00,000.00
```

### 3. Phone Numbers
- International dial codes
- Country-specific phone number format patterns
- Regex for validation

```go
import "github.com/razorpay/i18nify/packages/i18nify-go/modules/phonenumber"

info := phonenumber.GetCountryTeleInformation("IN")
fmt.Println(info.DialCode) // +91
fmt.Println(info.Format)   // xxxx xxxxxx
fmt.Println(info.Regex)    // (?:000800|[2-9]\d\d)\d{7}|1\d{7,12}
```

### 4. Country Subdivisions
- State/province names and codes
- City information with timezones and district names
- Postal/ZIP code data
- City-to-ZIP code mapping
- Available country codes

```go
import "github.com/razorpay/i18nify/packages/i18nify-go/modules/country_subdivisions"

data := country_subdivisions.GetCountrySubdivisions("IN")
fmt.Println(data.CountryName) // India

state, _ := data.GetStateByStateCode("KA")
fmt.Println(state.GetName())         // Karnataka
fmt.Println(len(state.GetCities()))  // 30

// List all available country codes
codes, _ := country_subdivisions.GetAvailableCountryCodes() // [IN MY SG US]
```

**Supported countries:** IN (India), MY (Malaysia), SG (Singapore), US (United States)

### 5. Bank Codes
- SWIFT / BIC code validation
- Routing number validation (US)
- IFSC code validation (India)
- Bank name lookup by short code or identifier
- Full bank list per country

```go
import "github.com/razorpay/i18nify/packages/i18nify-go/modules/bankcodes"

// Validate an identifier
valid, _ := bankcodes.IsValidBankIdentifier("IN", "IFSC", "ABHY0065001") // true
valid, _ = bankcodes.IsValidBankIdentifier("US", "ROUTING_NUMBER", "053208066") // true

// Lookup by short code
name, _ := bankcodes.GetBankNameFromShortCode("US", "USBK")  // U.S. BANK N.A.
ids, _  := bankcodes.GetDefaultBankIdentifiersFromShortCode("US", "BUYE")

// All banks for a country
banks, _ := bankcodes.GetAllBanksWithShortCodes("IN") // map[shortCode]bankName
```

**Supported countries:** IN (India), MY (Malaysia), SG (Singapore), US (United States)

### 6. Date & Time
- Primary timezone lookup by country code

```go
import "github.com/razorpay/i18nify/packages/i18nify-go/modules/datetime"

timezone, _ := datetime.GetPrimaryTimezone("IN")

fmt.Println(timezone) // Asia/Kolkata
```

---

## Package Structure

```
packages/i18nify-go/
├── modules/
│   ├── bankcodes/            # Bank code validation and information
│   ├── datetime/             # Timezone utilities
│   ├── currency/             # Currency information and formatting
│   ├── phonenumber/          # Phone number formats and dial codes
│   ├── country_metadata/     # Country metadata (dial code, flag, locale, etc.)
│   └── country_subdivisions/ # States, cities, and postal codes
└── example/
    └── example.go            # Usage examples

i18nify-data/go/              # Externalized data packages (auto-generated)
├── bankcodes/
├── currency/
├── country/
│   ├── metadata/
│   └── subdivisions/
└── phone-number/
    └── country-code-to-phone-number/
```

## Data Sources

| Module | Countries | Source |
|---|---|---|
| Subdivisions | IN | [All India Pincode Directory](https://www.data.gov.in/catalog/all-india-pincode-directory) |
| Subdivisions | MY | [Malaysia Postcode](https://malaysiapostcode.com/) |
| Subdivisions | US | [United States ZIP Codes](https://www.unitedstateszipcodes.org) |
| Subdivisions | SG | Singapore postal data |
| Currency | All | ISO 4217 |
| Country Metadata | 249 countries | ISO 3166-1 |
| Bank Codes | IN, MY, SG, US | Country-specific banking registries |
| Phone Numbers | 260 countries | ITU-T E.164 |

## Contributing

- Open issues for bugs or feature requests
- Submit pull requests with improvements
- To add a new country to subdivisions or bankcodes, add the source data under `i18nify-data/` — the CI pipeline auto-generates the Go package

## License
[License details to be added]
