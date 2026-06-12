package datetime

import (
	"fmt"
	"sort"
	"strings"
)

// TimezoneToCountry returns all country codes that observe the given IANA timezone.
func TimezoneToCountry(timezone string) ([]string, error) {
	normalizedTimezone := strings.TrimSpace(timezone)
	if normalizedTimezone == "" {
		return nil, fmt.Errorf("timezoneToCountry: timezone must not be empty")
	}

	metadata, err := getCountryMetadataData()
	if err != nil {
		return nil, fmt.Errorf("timezoneToCountry: %w", err)
	}

	countries := make([]string, 0)
	for countryCode, countryMeta := range metadata.GetMetadataInformation() {
		if countryMeta == nil {
			continue
		}

		if _, exists := countryMeta.GetTimezones()[normalizedTimezone]; exists {
			countries = append(countries, countryCode)
		}
	}

	if len(countries) == 0 {
		return nil, fmt.Errorf("timezoneToCountry: timezone %q not found", normalizedTimezone)
	}

	sort.Strings(countries)
	return countries, nil
}
