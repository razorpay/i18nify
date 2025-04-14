// Package date_time provides utilities for date and time formatting, parsing, and manipulation.
package date_time

import (
	"errors"
	"fmt"
	"time"
)

// exported constants for time duration
const (
	Minute = time.Minute
	Hour   = time.Hour
	Day    = Hour * 24
	Week   = Day * 7
	Month  = Day * 30
	Year   = Month * 12
)

// IntlOptions represents the options for formatting the date and time.
type IntlOptions struct {
	// Locale - Locale by which the timezone should be formatted/converted.
	// Valid examples include "IST", "UTC", "GMT", "GMT+2"
	// Invalid Locale will by default get converted to UTC
	Locale string
	// Hour12 - boolean flag to identify the time format
	Hour12 *bool
}

// DateTimeModeOption represents the different modes of date-time formatting
type DateTimeModeOption string

const (
	DateTimeMode DateTimeModeOption = "dateTime"
	DateOnlyMode DateTimeModeOption = "dateOnly"
	TimeOnlyMode DateTimeModeOption = "timeOnly"
)

// DateTimeOptions represents the configuration for date-time formatting
type DateTimeOptions struct {
	// DateTimeMode - DateTime format, examples: "dateTime", "dateOnly", "timeOnly"
	// by default or illegal value passed takes dateOnly mode
	// Exported through DateTimeModeOption
	DateTimeMode DateTimeModeOption
	// BaseDate - Base date in case of getting relative time
	BaseDate string
	// IntlOptions - Options for providing flags/details related to internationalization of date
	IntlOptions *IntlOptions
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
