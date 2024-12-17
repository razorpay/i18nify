// Package dateTime provides utilities for date and time formatting, parsing, and manipulation.
package dateTime

import (
	"fmt"
	"time"
)

const (
	minute = time.Minute
	hour   = time.Hour
	day    = hour * 24
	week   = day * 7
	month  = day * 30
	year   = month * 12
)

// IntlOptions represents the options for formatting the date and time.
type IntlOptions struct {
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

// DateTimeOptions represents the configuration for date-time formatting
type DateTimeOptions struct {
	DateTimeMode DateTimeMode
	BaseDate     string
	IntlOptions  *IntlOptions
}

// parseDateTime handles parsing various date string formats
func parseDateTime(dateStr string) (time.Time, error) {
	formats := []string{
		time.RFC3339,
		"2006-01-02T15:04:05",
		"2006-01-02",
		"1/2/2006",
	}

	for _, format := range formats {
		parsed, err := time.Parse(format, dateStr)
		if err == nil {
			return parsed, nil
		}
	}

	return time.Time{}, fmt.Errorf("invalid date format, please pass one of these formats %v", formats)
}

// GetWeekdays returns an array of weekday names starting from Sunday.
func GetWeekdays() []string {
	var weekdays []string
	// Jan 4, 1970, is a Sunday
	startDate := time.Date(1970, 1, 4, 0, 0, 0, 0, time.UTC)
	for i := 0; i < 7; i++ {
		weekdays = append(weekdays, startDate.AddDate(0, 0, i).Weekday().String())
	}
	return weekdays
}

// ParseDateTime parses a date string and returns its components.
func ParseDateTime(dateStr, layout string) (time.Time, error) {
	parsedDate, err := time.Parse(layout, dateStr)
	if err != nil {
		return time.Time{}, fmt.Errorf("failed to parse date: %w", err)
	}
	return parsedDate, nil
}

// StringToDate converts a string representation of a date into a time.Time object.
func StringToDate(dateStr string, layout string) (time.Time, error) {
	return ParseDateTime(dateStr, layout)
}
