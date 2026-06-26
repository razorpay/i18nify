package datetime

import (
	"fmt"
	"strings"

	countrymetadata "github.com/razorpay/i18nify/packages/i18nify-go/modules/country_metadata"
)

// GetTimeZoneByCountry returns timezone identifiers and UTC offsets for an
// ISO 3166-1 alpha-2 country code.
func GetTimeZoneByCountry(countryCode string) (map[string]TimeZoneInfo, error) {
	if strings.TrimSpace(countryCode) == "" {
		return nil, fmt.Errorf("getTimeZoneByCountry: country code must not be empty")
	}

	code := strings.ToUpper(strings.TrimSpace(countryCode))

	countryMeta := countrymetadata.GetMetadataInformation(code)
	if countryMeta.CountryName == "" {
		return nil, fmt.Errorf("getTimeZoneByCountry: country code %q not found", code)
	}

	rawTimezones := countryMeta.Timezones
	if len(rawTimezones) == 0 {
		return nil, fmt.Errorf("getTimeZoneByCountry: no timezone data for country code %q", code)
	}

	result := make(map[string]TimeZoneInfo, len(rawTimezones))
	for tzKey, tzVal := range rawTimezones {
		result[tzKey] = TimeZoneInfo{UTCOffset: tzVal.UTCOffset}
	}

	return result, nil
}
