// Package dateTime provides utilities for date and time formatting, parsing, and manipulation.
package dateTime

import (
	"errors"
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

// stringToDate converts a date string into a Go time.Time object.
func stringToDate(dateString string) (time.Time, error) {
	for _, format := range SupportedDateFormats {
		if format.Regex != nil {
			// Handle custom regex formats
			if matches := format.Regex.FindStringSubmatch(dateString); matches != nil {
				year := matches[format.YearIndex]
				month := matches[format.MonthIndex]
				day := matches[format.DayIndex]
				hour, minute, second := "00", "00", "00"

				if format.HourIndex > 0 {
					hour = matches[format.HourIndex]
					minute = matches[format.MinuteIndex]
					second = matches[format.SecondIndex]
				}

				combined := fmt.Sprintf("%s-%s-%sT%s:%s:%sZ", year, month, day, hour, minute, second)
				return time.Parse(time.RFC3339, combined)
			}
		} else if format.Format != "" {
			// Handle Go's standard layouts
			if parsedTime, err := time.Parse(format.Format, dateString); err == nil {
				return parsedTime, nil
			}
		}
	}

	return time.Time{}, fmt.Errorf("date format not recognized: %s", dateString)
}

// convertToStandardDate converts a date input (string or time.Time) into a standardized time.Time object.
func convertToStandardDate(dateInput interface{}) (time.Time, error) {
	switch date := dateInput.(type) {
	case string:
		return stringToDate(date)
	case time.Time:
		return date, nil
	default:
		return time.Time{}, errors.New("unsupported date input type")
	}
}

// StringToDate converts a string representation of a date into a time.Time object.
func StringToDate(dateStr string) (time.Time, error) {
	return convertToStandardDate(dateStr)
}
