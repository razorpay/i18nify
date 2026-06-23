package geo

import (
	"fmt"
	"strings"
)

// AddressComponents holds address field values for template substitution.
// All fields are optional; empty fields substitute as blank strings and
// lines that become blank after substitution are dropped from the output.
type AddressComponents struct {
	Name          string
	Organization  string
	StreetAddress string
	City          string
	State         string
	Zip           string
	District      string
	SortingCode   string
}

// FormatAddressWithFormat formats address components using the country-specific template for countryCode.
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
