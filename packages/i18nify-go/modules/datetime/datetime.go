// Package datetime provides date and time helpers inspired by the i18nify-js
// dateTime module.
//
//   - FormatDateTime        — date/time formatting with locale-based ordering,
//     separators, and hour-cycle defaults
//   - GetRelativeTime       — human-readable relative time in English
//   - GetWeekdays           — ordered list of weekday names in English
//   - GetTimeZoneByCountry  — timezone identifiers + UTC offsets for a country
//
// Scope note:
//   - GetTimeZoneByCountry is a close data-parity helper.
//   - FormatDateTime, GetRelativeTime, and GetWeekdays are simplified Go
//     equivalents, not full Intl-powered replicas of the JS implementation.
//
// Configuration data (locale ordering, separators, supported date formats) is
// loaded at startup from the embedded i18nify-data/go/datetime package.
// Timezone data is sourced from i18nify-data/go/country/metadata.
package datetime

import (
	"fmt"

	datetimeData "github.com/razorpay/i18nify/i18nify-data/go/datetime"
	countryMetadata "github.com/razorpay/i18nify/i18nify-data/go/country/metadata"
)

// cachedDateTimeData is the datetime configuration loaded at init.
var cachedDateTimeData *datetimeData.DateTimeData

// cachedCountryMetadata is the country metadata used by GetTimeZoneByCountry.
var cachedCountryMetadata *countryMetadata.CountryMetadataData

// init loads both data packages once at package startup.
// Panics on failure so misconfiguration is caught immediately,
// matching the convention used by all other i18nify-go service modules.
func init() {
	dt, err := datetimeData.GetDateTimeData()
	if err != nil {
		panic(fmt.Sprintf("datetime: failed to load datetime data: %v", err))
	}
	cachedDateTimeData = dt

	cm, err := countryMetadata.GetCountryMetadataData()
	if err != nil {
		panic(fmt.Sprintf("datetime: failed to load country metadata: %v", err))
	}
	cachedCountryMetadata = cm
}

// TimeZoneInfo holds details for a single IANA timezone identifier.
type TimeZoneInfo struct {
	// UTCOffset is the UTC offset string (e.g., "UTC +05:30").
	UTCOffset string `json:"utc_offset"`
}
