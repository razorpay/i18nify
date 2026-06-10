package datetime

import (
	"fmt"
	"strings"
)

// GetTimeZoneByCountry returns the timezone identifiers and their UTC offsets
// for the given ISO 3166-1 alpha-2 country code (case-insensitive).
//
// The returned map is keyed by IANA timezone identifier (e.g., "Asia/Kolkata")
// and each value carries the UTC offset string (e.g., "+05:30").
//
// When a country observes multiple timezones (e.g., "US", "RU", "AU") the
// full set is returned. Data is sourced from the embedded country metadata
// package (i18nify-data/go/country/metadata).
//
// Errors are returned for:
//   - an empty country code
//   - a code not present in the metadata
//   - a code present in the metadata but with no timezone entries
//
// Example:
//
//	tzs, err := GetTimeZoneByCountry("IN")
//	// → map["Asia/Kolkata": {UTCOffset: "+05:30"}]
func GetTimeZoneByCountry(countryCode string) (map[string]TimeZoneInfo, error) {
	if strings.TrimSpace(countryCode) == "" {
		return nil, fmt.Errorf("getTimeZoneByCountry: country code must not be empty")
	}

	code := strings.ToUpper(strings.TrimSpace(countryCode))

	if cachedCountryMetadata == nil {
		return nil, fmt.Errorf("getTimeZoneByCountry: country metadata not loaded")
	}

	metadataMap := cachedCountryMetadata.GetMetadataInformation()
	countryMeta, exists := metadataMap[code]
	if !exists {
		return nil, fmt.Errorf("getTimeZoneByCountry: country code %q not found", code)
	}

	rawTimezones := countryMeta.GetTimezones()
	if len(rawTimezones) == 0 {
		return nil, fmt.Errorf("getTimeZoneByCountry: no timezone data for country code %q", code)
	}

	result := make(map[string]TimeZoneInfo, len(rawTimezones))
	for tzKey, tzVal := range rawTimezones {
		if tzVal != nil {
			result[tzKey] = TimeZoneInfo{UTCOffset: tzVal.GetUtcOffset()}
		}
	}

	return result, nil
}
