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
- Example:
```go
country := i18nify_go.NewCountry("IN")
metaData := country.GetCountryMetadata()
fmt.Printf("Country: %s\n", metaData.CountryName)       // India
fmt.Printf("Currency: %v\n", metaData.SupportedCurrency) // [INR]
fmt.Printf("Dial Code: %s\n", metaData.DialCode)        // +91
```

### 2. Currency Module
- Currency names and symbols
- Currency codes (ISO 4217)
- Minor unit information
- Physical currency denominations
- Numeric codes
- Direct currency symbol retrieval
- Currency conversion between major and minor units
- Example:
```go
// Get currency information
currencyIN := country.GetCountryCurrency()
fmt.Printf("Currency Name: %s\n", currencyIN[0].Name) // Indian Rupee
fmt.Printf("Symbol: %s\n", currencyIN[0].Symbol)      // ₹

// Convert between major and minor units
majorAmount, _ := currency.ConvertToMajorUnit("INR", 1234) // 12.34 rupees
minorAmount, _ := currency.ConvertToMinorUnit("USD", 12.34) // 1234 cents
```

### 3. Phone Number Handling
- International dial codes
- Phone number validation patterns
- Country-specific phone number formats
- Direct phone number information retrieval
- Example:
```go
phoneNumber := country.GetCountryPhoneNumber()
fmt.Printf("Dial Code: %s\n", phoneNumber.DialCode)  // +91
fmt.Printf("Regex: %s\n", phoneNumber.Regex)         // /^(?:(?:\+|0{0,2})91\s*[-]?\s*|[0]?)?[6789]\d{9}$/
```

### 4. Subdivisions (States) Information
- State/province names and codes
- City information
- Postal/ZIP code data
- City-to-ZIP code mapping
- State lookup by ZIP code
- Example:
```go
subdivisions := country.GetCountrySubDivisions()
state := subdivisions.GetStates()["KA"]
fmt.Printf("State: %s\n", state.GetName())        // Karnataka
fmt.Printf("Cities: %d\n", len(state.GetCities())) // 58

// Get state by zipcode
states := country.GetStatesByZipCode("452010")
fmt.Printf("State: %s\n", states[0].GetName())    // Madhya Pradesh
```

### 5. Bank Codes
- IFSC code validation
- Bank name lookup by short code
- Bank identifier retrieval
- Bank name lookup by identifier
- Example:
```go
// Validate IFSC code
isValid, _ := bankcodes.IsValidBankIdentifier("IN", bankcodes.IdentifierTypeIFSC, "HDFC0000001")

// Get bank information
bankName, _ := bankcodes.GetBankNameFromShortCode("IN", "HDFC") // HDFC Bank Limited
identifiers, _ := bankcodes.GetDefaultBankIdentifiersFromShortCode("IN", "HDFC")
```

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
    fmt.Printf("Country: %s\n", metaData.CountryName)       // India
    fmt.Printf("Currency: %v\n", metaData.SupportedCurrency) // [INR]
    fmt.Printf("Dial Code: %s\n", metaData.DialCode)        // +91
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
- Data is loaded lazily, only when needed
- Memory usage is optimized by sharing common data structures

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
- Add more test cases
- Improve documentation
- Add support for more data formats

## License
[License details to be added]

## Support
For support, please:
- Open an issue in the GitHub repository
- Check the [example.go](example/example.go) file for usage examples
