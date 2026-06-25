// Package datetime provides Go helpers for formatting dates, relative time,
// weekdays, and country timezone data. Data is loaded from embedded i18nify
// datasets at package init.
package datetime

import (
	"fmt"

	countryMetadata "github.com/razorpay/i18nify/i18nify-data/go/country/metadata"
)

// cachedCountryMetadata is the country metadata used by GetTimeZoneByCountry.
var cachedCountryMetadata *countryMetadata.CountryMetadataData

// init loads country metadata once at package startup.
func init() {
	cm, err := countryMetadata.GetCountryMetadataData()
	if err != nil {
		panic(fmt.Sprintf("datetime: failed to load country metadata: %v", err))
	}
	cachedCountryMetadata = cm
}

// TimeZoneInfo stores details for a single IANA timezone.
type TimeZoneInfo struct {
	UTCOffset string `json:"utc_offset"`
}

// TimezoneListEntry stores a timezone offset and its matching countries.
type TimezoneListEntry struct {
	UTCOffset string   `json:"utc_offset"`
	Countries []string `json:"countries"`
}
