// Package datetime provides Go helpers for formatting dates, relative time,
// weekdays, and country timezone data.
package datetime

// TimeZoneInfo stores details for a single IANA timezone.
type TimeZoneInfo struct {
	UTCOffset string `json:"utc_offset"`
}

// TimezoneListEntry stores a timezone offset and its matching countries.
type TimezoneListEntry struct {
	UTCOffset string   `json:"utc_offset"`
	Countries []string `json:"countries"`
}
