// Package datetime provides locale-aware functions for formatting, computing,
// and inspecting dates and times. It mirrors the i18nify-js dateTime module:
//
//   - FormatDateTime        — locale-aware date/time string formatting
//   - GetRelativeTime       — human-readable relative time (e.g., "3 hours ago")
//   - GetWeekdays           — ordered list of weekday names for a locale
//   - GetTimeZoneByCountry  — timezone identifiers + UTC offsets for a country
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

