package geo

import (
	"fmt"
	"strings"
)

// AddressComponents holds the values for each address field accepted by the
// country-specific address format templates. All fields are optional; fields
// left empty cause their corresponding {placeholder} to be replaced with an
// empty string, and any line that becomes blank after substitution is removed.
//
// Field names match the {placeholder} tokens used in the templates stored in
// i18nify-data/address/data.json.
type AddressComponents struct {
	Name          string // Recipient or personal name
	Organization  string // Company or organisation name
	StreetAddress string // Primary street address line
	City          string // City or town
	State         string // State, province, or region
	Zip           string // Postal or ZIP code
	District      string // District (used in some countries)
	SortingCode   string // Sorting / CEDEX code (France, UK, etc.)
}

// FormatAddressWithFormat formats the given address components using the
// country-specific template for countryCode (ISO 3166-1 alpha-2).
//
// The template is sourced from the embedded address data
// (i18nify-data/go/address/data/data.json). Placeholders of the form
// {field_name} are replaced with the corresponding value from components.
// Lines that are blank or whitespace-only after substitution are removed.
//
// The logic is identical to the JavaScript formatAddressWithFormat function
// in the i18nify-js geo module.
//
// Example:
//
//	components := AddressComponents{
//	    Name:          "John Doe",
//	    StreetAddress: "1600 Amphitheatre Pkwy",
//	    City:          "Mountain View",
//	    State:         "CA",
//	    Zip:           "94043",
//	}
//	result, err := FormatAddressWithFormat("US", components)
//	// → "John Doe\n1600 Amphitheatre Pkwy\nMountain View, CA 94043"
func FormatAddressWithFormat(countryCode string, components AddressComponents) (string, error) {
	if strings.TrimSpace(countryCode) == "" {
		return "", fmt.Errorf("formatAddressWithFormat: country code must not be empty")
	}

	code := strings.ToUpper(strings.TrimSpace(countryCode))

	addrMap := cachedAddressData.GetAddressFormatInformation()
	addrInfo, exists := addrMap[code]
	if !exists || addrInfo == nil {
		return "", fmt.Errorf("formatAddressWithFormat: address format for country code %q not found", code)
	}

	replacer := strings.NewReplacer(
		"{name}", components.Name,
		"{organization}", components.Organization,
		"{street_address}", components.StreetAddress,
		"{city}", components.City,
		"{state}", components.State,
		"{zip}", components.Zip,
		"{district}", components.District,
		"{sorting_code}", components.SortingCode,
	)
	substituted := replacer.Replace(addrInfo.GetTemplate())

	rawLines := strings.Split(substituted, "\n")
	formatted := make([]string, 0, len(rawLines))
	for _, line := range rawLines {
		if trimmed := strings.TrimSpace(line); trimmed != "" {
			formatted = append(formatted, trimmed)
		}
	}

	return strings.Join(formatted, "\n"), nil
}
