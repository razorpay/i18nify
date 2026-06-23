package datetime

import (
	"fmt"
	"strings"
)

// GetTimeZoneByCountry returns timezone identifiers and UTC offsets for an
// ISO 3166-1 alpha-2 country code.
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
