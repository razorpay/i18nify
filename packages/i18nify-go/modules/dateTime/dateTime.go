// Package dateTime provides utilities for date and time formatting, parsing, and manipulation.
package dateTime

import (
	"fmt"
	"time"
)

// Allowed format parts keys.
var allowedFormatPartsKeys = []string{
	"day",
	"dayPeriod",
	"era",
	"fractionalSecond",
	"hour",
	"minute",
	"month",
	"relatedYear",
	"second",
	"timeZone",
	"weekday",
	"year",
	"yearName",
}

// FormatDateTimeOptions represents the options for formatting the date and time.
type FormatDateTimeOptions struct {
	Locale       string
	DateTimeMode string
	Hour12       *bool
}

// DateTimeMode represents the different modes of date-time formatting
type DateTimeMode string

const (
	dateTimeMode DateTimeMode = "dateTime"
	dateOnlyMode DateTimeMode = "dateOnly"
	timeOnlyMode DateTimeMode = "timeOnly"
)

// FormatOptions represents the configuration for date-time formatting
type FormatOptions struct {
	Locale       string
	DateTimeMode DateTimeMode
	IntlOptions  map[string]interface{}
}

// FormatDateTime formats a date-time string based on the provided options
func FormatDateTime(dateStr string, options *FormatOptions) (string, error) {
	// Set default options if not provided
	if options == nil {
		options = &FormatOptions{
			Locale:       "en-US",
			DateTimeMode: dateOnlyMode,
		}
	}

	// Parse the input date
	parsedTime, err := parseDateTime(dateStr)
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

// parseDateTime handles parsing various date string formats
func parseDateTime(dateStr string) (time.Time, error) {
	formats := []string{
		time.RFC3339,
		"2006-01-02T15:04:05",
		"2006-01-02",
	}

	for _, format := range formats {
		parsed, err := time.Parse(format, dateStr)
		if err == nil {
			return parsed, nil
		}
	}

	return time.Time{}, fmt.Errorf("invalid date format, please pass one of these formats %v", formats)
}

// formatFullDateTime handles full date and time formatting
func formatFullDateTime(t time.Time, options *FormatOptions) string {
	// Check for 24-hour format option
	hour12 := true
	if options.IntlOptions != nil {
		if h12, ok := options.IntlOptions["hour12"].(bool); ok {
			hour12 = h12
		}
	}

	// Choose format based on 12/24 hour
	if hour12 {
		return t.Format("1/2/2006, 3:04:05 PM")
	}
	return t.Format("1/2/2006, 15:04:05")
}

// formatDateOnly handles date-only formatting
func formatDateOnly(t time.Time, options *FormatOptions) string {
	return t.Format("1/2/2006")
}

// formatTimeOnly handles time-only formatting
func formatTimeOnly(t time.Time, options *FormatOptions) string {
	// Check for 24-hour format option
	hour12 := true
	if options.IntlOptions != nil {
		if h12, ok := options.IntlOptions["hour12"].(bool); ok {
			hour12 = h12
		}
	}

	// Choose format based on 12/24 hour
	if hour12 {
		return t.Format("3:04:05 PM")
	}
	return t.Format("15:04:05")
}
