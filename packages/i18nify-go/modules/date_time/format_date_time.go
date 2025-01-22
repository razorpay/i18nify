package date_time

import (
	"fmt"
	"time"
)

// FormatDateTime formats a date-time string based on the provided options
func FormatDateTime(dateStr string, options *DateTimeOptions) (string, error) {
	// Set default options if not provided
	if options == nil {
		options = &DateTimeOptions{
			DateTimeMode: dateOnlyMode,
		}
	}

	// Parse the input date
	parsedTime, err := convertToStandardDate(dateStr)
	if err != nil {
		return "", fmt.Errorf("error parsing date: %v", err)
	}

	// Determine formatting based on mode
	switch options.DateTimeMode {
	case dateTimeMode:
		return formatFullDateTime(parsedTime, options), nil
	case dateOnlyMode:
		return formatDateOnly(parsedTime, options), nil
	case timeOnlyMode:
		return formatTimeOnly(parsedTime, options), nil
	default:
		return formatDateOnly(parsedTime, options), nil
	}
}

// formatFullDateTime handles full date and time formatting
func formatFullDateTime(t time.Time, options *DateTimeOptions) string {
	var loc *time.Location = nil
	// Check if IntlOptions contains a locale or timezone
	if options.IntlOptions != nil {
		if options.IntlOptions.Locale != "" {
			// Load the timezone based on Locale (e.g., "IST", "GMT")
			timezone, isTimeZonePresent := timezoneMapping[options.IntlOptions.Locale]
			// in case of invalid timezone, this can be changed to return err if expected
			if !isTimeZonePresent {
				timezone = "UTC"
			}
			location, err := time.LoadLocation(timezone)
			if err == nil {
				loc = location
			}
		}
	}
	if loc != nil {
		t = t.In(loc)
	}

	// Check for 24-hour format option
	hour12 := false
	if options.IntlOptions != nil {
		if options.IntlOptions.Hour12 != nil {
			hour12 = *options.IntlOptions.Hour12
		}
	}
	hour12Format := "1/2/2006, 3:04:05 PM"
	hour24Format := "1/2/2006, 15:04:05"
	if loc != nil {
		hour12Format = "1/2/2006, 3:04:05 PM MST"
		hour24Format = "1/2/2006, 15:04:05 MST"
	}

	// Choose format based on 12/24 hour
	if hour12 {
		return t.Format(hour12Format)
	}
	return t.Format(hour24Format)
}

// formatDateOnly handles date-only formatting
func formatDateOnly(t time.Time, options *DateTimeOptions) string {
	return t.Format("1/2/2006")
}

// formatTimeOnly handles time-only formatting
func formatTimeOnly(t time.Time, options *DateTimeOptions) string {
	// Check for 24-hour format option
	hour12 := true
	if options.IntlOptions != nil {
		if options.IntlOptions.Hour12 != nil {
			hour12 = *options.IntlOptions.Hour12
		}
	}

	// Choose format based on 12/24 hour
	if hour12 {
		return t.Format("3:04:05 PM")
	}
	return t.Format("15:04:05")
}
