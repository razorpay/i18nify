# i18nify-go
A comprehensive internationalization solution for Go applications, providing easy access to country, currency, phone number, bank codes, and subdivision data.

## Requirements
- Go 1.16 or higher
- No external dependencies

## Features

### 1. Country Metadata
- Country names and codes
- Supported currencies
- International dial codes
- Timezone information
- Default locale settings

### 2. Currency Module
- Currency names and symbols
- Currency codes (ISO 4217)
- Minor unit information
- Physical currency denominations
- Numeric codes
- Direct currency symbol retrieval

### 3. Phone Number Handling
- International dial codes
- Phone number validation patterns
- Country-specific phone number formats
- Direct phone number information retrieval

### 4. Subdivisions (States) Information
- State/province names and codes
- City information
- Postal/ZIP code data
- City-to-ZIP code mapping
- State lookup by ZIP code

### 5. Bank Codes
- IFSC code validation
- Bank name lookup by short code
- Bank identifier retrieval
- Bank name lookup by identifier

## Installation

```bash
go get github.com/razorpay/i18nify/packages/i18nify-go
```

## Quick Start

```go
package main

import (
    "fmt"
    i18nify_go "github.com/razorpay/i18nify/packages/i18nify-go"
)

func main() {
    // Initialize for a country
    country := i18nify_go.NewCountry("IN")
    
    // Get basic country information
    metaData := country.GetCountryMetadata()
    fmt.Printf("Country: %s\n", metaData.CountryName)
    fmt.Printf("Currency: %s\n", metaData.SupportedCurrency[0])
    fmt.Printf("Dial Code: %s\n", metaData.DialCode)
}
```

## Usage

For comprehensive examples of how to use all features of i18nify-go, please refer to the [example.go](example/example.go) file. The examples cover:

1. Basic country information retrieval
2. Currency operations and information
3. Phone number handling and validation
4. Subdivision and location data access
5. Bank code validation and information retrieval

Each example includes proper error handling and demonstrates real-world usage scenarios.

## Package Structure

```
i18nify-go/
├── modules/
│   ├── bankcodes/        # Bank code validation and information
│   ├── currency/         # Currency-related operations
│   ├── phonenumber/      # Phone number handling
│   ├── country_metadata/ # Country information
│   └── country_subdivisions/ # State and city information
└── example/
    └── example.go        # Comprehensive usage examples
```

## Performance Considerations

- The package loads data from JSON files on first use and caches it in memory
- All operations after initial load are performed in memory
- Consider the memory footprint when working with large datasets
- For optimal performance, initialize country objects once and reuse them

## Data Sources
- India (IN): [All India Pincode Directory](https://www.data.gov.in/catalog/all-india-pincode-directory)
- Malaysia (MY): [Malaysia Postcode](https://malaysiapostcode.com/)
- USA (US): [United States ZIP Codes](https://www.unitedstateszipcodes.org)
- Singapore (SG): To be determined

## Contributing
We welcome contributions to improve this package! Please feel free to:
- Open issues for bugs or feature requests
- Submit pull requests with improvements
- Help expand the data coverage for more countries

## License
[License details to be added]

## Support
For support, please open an issue in the GitHub repository or contact the maintainers.
