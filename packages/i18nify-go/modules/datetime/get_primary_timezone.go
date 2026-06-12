package datetime

import (
	"fmt"
	"strings"
)

// GetPrimaryTimezone returns the capital city's IANA timezone for a country code.
func GetPrimaryTimezone(countryCode string) (string, error) {
	code := strings.ToUpper(strings.TrimSpace(countryCode))
	if code == "" {
		return "", fmt.Errorf("getPrimaryTimezone: country code must not be empty")
	}

	metadata, err := getCountryMetadataData()
	if err != nil {
		return "", fmt.Errorf("getPrimaryTimezone: %w", err)
	}

	countryMeta, exists := metadata.GetMetadataInformation()[code]
	if !exists || countryMeta == nil {
		return "", fmt.Errorf("getPrimaryTimezone: country code %q not found", code)
	}

	timezone := countryMeta.GetTimezoneOfCapital()
	if timezone == "" {
		return "", fmt.Errorf("getPrimaryTimezone: no primary timezone for country code %q", code)
	}

	return timezone, nil
}
