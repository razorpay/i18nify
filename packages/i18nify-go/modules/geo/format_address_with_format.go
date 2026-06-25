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
// Templates are loaded from embedded country metadata at startup (see geo.go init).
// Each {placeholder} in the template is replaced with the matching field; blank lines in the result are removed.
func FormatAddressWithFormat(countryCode string, components AddressComponents) (string, error) {
	if strings.TrimSpace(countryCode) == "" {
		return "", fmt.Errorf("formatAddressWithFormat: country code must not be empty")
	}

	code := strings.ToUpper(strings.TrimSpace(countryCode))

	countryMeta, exists := cachedCountryMetadata.GetMetadataInformation()[code]
	if !exists || countryMeta == nil || countryMeta.GetAddressFormat() == "" {
		return "", fmt.Errorf("formatAddressWithFormat: address format for country code %q not found", code)
	}

	// Reuse the base formatter so template substitution and blank-line cleanup
	// remain defined in one place for the Go geo module.
	return FormatAddress(countryMeta.GetAddressFormat(), components)
}
