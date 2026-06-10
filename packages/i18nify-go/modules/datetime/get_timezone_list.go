package datetime

import "fmt"

// GetTimezoneList aggregates all IANA timezone identifiers across every country
// in the metadata. Each entry carries the UTC offset and the list of ISO 3166-1
// alpha-2 country codes that observe that timezone.
//
// Countries sharing a timezone (e.g., multiple Caribbean nations using
// "America/Port_of_Spain") are all listed under that timezone's entry.
//
// This mirrors the JS getTimezoneList implementation; the only difference is
// that Go reads from the embedded country metadata loaded at package init
// instead of fetching over HTTP.
//
// Example:
//
//	list, err := GetTimezoneList()
//	list["Asia/Kolkata"]
//	// → {UTCOffset: "UTC +05:30", Countries: ["IN"]}
//
//	list["America/New_York"]
//	// → {UTCOffset: "UTC -05:00", Countries: ["US", ...]}
func GetTimezoneList() (map[string]TimezoneListEntry, error) {
	if cachedCountryMetadata == nil {
		return nil, fmt.Errorf("getTimezoneList: country metadata not loaded")
	}

	metadataMap := cachedCountryMetadata.GetMetadataInformation()
	result := make(map[string]TimezoneListEntry)

	for countryCode, countryMeta := range metadataMap {
		if countryMeta == nil {
			continue
		}

		for tzKey, tzVal := range countryMeta.GetTimezones() {
			if tzVal == nil {
				continue
			}

			entry, exists := result[tzKey]
			if !exists {
				entry = TimezoneListEntry{
					UTCOffset: tzVal.GetUtcOffset(),
					Countries: []string{},
				}
			}

			seen := false
			for _, cc := range entry.Countries {
				if cc == countryCode {
					seen = true
					break
				}
			}
			if !seen {
				entry.Countries = append(entry.Countries, countryCode)
			}

			result[tzKey] = entry
		}
	}

	return result, nil
}
