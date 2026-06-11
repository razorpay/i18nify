package datetime

import (
	"fmt"
	"time"
)

// FormatFromUnixOptions extends FormatDateTimeOptions with a timezone setting.
type FormatFromUnixOptions struct {
	FormatDateTimeOptions

	// Timezone is an IANA timezone name (e.g., "America/New_York", "Asia/Kolkata").
	// Defaults to "UTC" when empty.
	Timezone string
}

// FormatFromUnix converts a Unix timestamp (seconds since epoch) to a
// timezone-aware formatted datetime string.
//
// It returns an error when the timezone identifier is not recognised by the
// system timezone database. When no FormatFromUnixOptions are supplied the
// output uses ModeDateTime with the en-US locale in UTC.
//
// Example:
//
//	s, err := FormatFromUnix(1609459200, FormatFromUnixOptions{
//	    Timezone: "America/New_York",
//	    FormatDateTimeOptions: FormatDateTimeOptions{DateTimeMode: ModeDateTime, Locale: "en-US"},
//	})
//	// → "12/31/2020 19:0:0"  (2021-01-01 00:00 UTC = 2020-12-31 19:00 EST)
func FormatFromUnix(unixTimestamp int64, opts ...FormatFromUnixOptions) (string, error) {
	opt := FormatFromUnixOptions{}
	if len(opts) > 0 {
		opt = opts[0]
	}

	timezone := opt.Timezone
	if timezone == "" {
		timezone = "UTC"
	}

	loc, err := time.LoadLocation(timezone)
	if err != nil {
		return "", fmt.Errorf("formatFromUnix: invalid timezone %q: %w", timezone, err)
	}

	t := time.Unix(unixTimestamp, 0).In(loc)

	fmtOpts := opt.FormatDateTimeOptions
	if fmtOpts.DateTimeMode == "" {
		fmtOpts.DateTimeMode = ModeDateTime
	}

	return FormatDateTime(t, fmtOpts)
}
