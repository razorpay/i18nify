package datetime

import (
	"fmt"
	"math"
	"strings"
	"time"
)

var flexibleDateLayouts = []string{
	"2006/01/02",
	"02/01/2006",
	"2006.01.02",
	"02-01-2006",
	"01/02/2006",
	"2006-01-02",
	"2006. 01. 02.",
	"02.01.2006",
	"01.02.2006",
	"2006/01/02 15:04:05",
	"02/01/2006 15:04:05",
	"2006-01-02 15:04:05",
	"02-01-2006 15:04:05",
	"2006.01.02 15:04:05",
	"02.01.2006 15:04:05",
	"2006-01-02T15:04:05",
}

// ParseFlexibleDate parses time.Time, millisecond timestamps, and multiple string layouts.
func ParseFlexibleDate(input interface{}) (ParsedFlexibleDate, error) {
	if input == nil {
		return ParsedFlexibleDate{}, fmt.Errorf("parseFlexibleDate: invalid input")
	}

	var parsedDate time.Time

	switch value := input.(type) {
	case time.Time:
		parsedDate = value
	case string:
		if strings.TrimSpace(value) == "" {
			return ParsedFlexibleDate{}, fmt.Errorf("parseFlexibleDate: invalid input")
		}

		date, err := parseFlexibleDateString(value)
		if err != nil {
			return ParsedFlexibleDate{}, err
		}
		parsedDate = date
	case int:
		parsedDate = time.UnixMilli(int64(value))
	case int64:
		parsedDate = time.UnixMilli(value)
	case float64:
		if math.IsNaN(value) || math.IsInf(value, 0) {
			return ParsedFlexibleDate{}, fmt.Errorf("parseFlexibleDate: invalid input")
		}
		parsedDate = time.UnixMilli(int64(value))
	case float32:
		if math.IsNaN(float64(value)) || math.IsInf(float64(value), 0) {
			return ParsedFlexibleDate{}, fmt.Errorf("parseFlexibleDate: invalid input")
		}
		parsedDate = time.UnixMilli(int64(value))
	default:
		return ParsedFlexibleDate{}, fmt.Errorf("parseFlexibleDate: unsupported input type %T", input)
	}

	return ParsedFlexibleDate{
		Date:      parsedDate,
		Year:      parsedDate.Year(),
		Month:     int(parsedDate.Month()),
		Day:       parsedDate.Day(),
		Hour:      parsedDate.Hour(),
		Minute:    parsedDate.Minute(),
		Second:    parsedDate.Second(),
		Timestamp: parsedDate.UnixMilli(),
	}, nil
}

func parseFlexibleDateString(value string) (time.Time, error) {
	for _, layout := range []string{time.RFC3339Nano, time.RFC3339} {
		if parsedDate, err := time.Parse(layout, value); err == nil {
			return parsedDate, nil
		}
	}

	for _, layout := range flexibleDateLayouts {
		if parsedDate, err := time.ParseInLocation(layout, value, time.Local); err == nil {
			return parsedDate, nil
		}
	}

	return time.Time{}, fmt.Errorf("parseFlexibleDate: could not parse %q as a valid date", value)
}
