package datetime

import (
	"fmt"
	"strings"
	"time"
)

// FormatFromUnixOptions configures FormatFromUnix.
type FormatFromUnixOptions struct {
	// Timezone is an IANA timezone name. Defaults to UTC.
	Timezone string
	// Locale controls the default output layout. Defaults to en-US.
	Locale string
	// Layout overrides the locale-derived layout when set.
	Layout string
}

// FormatFromUnix converts a Unix timestamp in seconds into a formatted datetime string.
func FormatFromUnix(unixTimestamp int64, opts ...FormatFromUnixOptions) (string, error) {
	option := FormatFromUnixOptions{}
	if len(opts) > 0 {
		option = opts[0]
	}

	timezone := option.Timezone
	if timezone == "" {
		timezone = "UTC"
	}

	location, err := time.LoadLocation(timezone)
	if err != nil {
		return "", fmt.Errorf("formatFromUnix: invalid timezone %q: %w", timezone, err)
	}

	locale := option.Locale
	if locale == "" {
		locale = "en-US"
	}

	layout := option.Layout
	if layout == "" {
		layout = defaultDateTimeLayout(locale)
	}

	return time.Unix(unixTimestamp, 0).In(location).Format(layout), nil
}

func defaultDateTimeLayout(locale string) string {
	normalizedLocale := strings.ToLower(locale)

	switch {
	case strings.HasPrefix(normalizedLocale, "en-us"):
		return "1/2/2006, 3:04:05 PM"
	case strings.HasPrefix(normalizedLocale, "ja"), strings.HasPrefix(normalizedLocale, "ko"), strings.HasPrefix(normalizedLocale, "zh"):
		return "2006-01-02 15:04:05"
	default:
		return "2/1/2006, 15:04:05"
	}
}
