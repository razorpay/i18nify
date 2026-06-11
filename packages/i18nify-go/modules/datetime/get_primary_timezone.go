package datetime

import (
	"fmt"
	"strings"
)

// GetPrimaryTimezone returns the primary IANA timezone identifier for the given
// ISO 3166-1 alpha-2 country code (case-insensitive).
//
// For single-timezone countries the result is their only timezone.
// For multi-timezone countries (e.g., "US", "RU", "AU") the result is the
// capital city's timezone, sourced from the timezone_of_capital field in the
// embedded country metadata.
//
// Errors are returned for:
//   - an empty country code
//   - a code not present in the metadata
//
// Example:
//
//	tz, err := GetPrimaryTimezone("IN")
//	// → "Asia/Kolkata", nil
//
//	tz, err := GetPrimaryTimezone("US")
//	// → "America/New_York", nil
func GetPrimaryTimezone(countryCode string) (string, error) {
	if strings.TrimSpace(countryCode) == "" {
		return "", fmt.Errorf("getPrimaryTimezone: country code must not be empty")
	}

	code := strings.ToUpper(strings.TrimSpace(countryCode))

	if cachedCountryMetadata == nil {
		return "", fmt.Errorf("getPrimaryTimezone: country metadata not loaded")
	}

	metadataMap := cachedCountryMetadata.GetMetadataInformation()
	countryMeta, exists := metadataMap[code]
	if !exists {
		return "", fmt.Errorf("getPrimaryTimezone: country code %q not found", code)
	}

	tz := countryMeta.GetTimezoneOfCapital()
	if tz == "" {
		return "", fmt.Errorf("getPrimaryTimezone: no primary timezone for country code %q", code)
	}

	return tz, nil
}
