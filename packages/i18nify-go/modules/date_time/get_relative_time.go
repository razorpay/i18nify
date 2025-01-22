package date_time

import "fmt"

// GetRelativeTime calculates the relative time string (e.g., "2 hours ago" or "in 2 hours").
func GetRelativeTime(dateStr string, options DateTimeOptions) (string, error) {
	date, err := convertToStandardDate(dateStr)
	if err != nil {
		return "", err
	}
	baseDate, err := convertToStandardDate(options.BaseDate)
	if err != nil {
		return "", err
	}

	duration := date.Sub(baseDate)
	absDuration := duration
	prefix := "ago"

	// Handle future dates
	if duration > 0 {
		prefix = "in"
	} else {
		absDuration = -duration
	}

	// Format the duration with appropriate unit
	var result string
	switch {
	case absDuration < minute:
		result = formatDuration(int(absDuration.Seconds()), "second", prefix)
	case absDuration < hour:
		result = formatDuration(int(absDuration.Minutes()), "minute", prefix)
	case absDuration < day:
		result = formatDuration(int(absDuration.Hours()), "hour", prefix)
	case absDuration < week:
		result = formatDuration(int(absDuration.Hours()/24), "day", prefix)
	case absDuration < month:
		result = formatDuration(int(absDuration.Hours()/(24*7)), "week", prefix)
	case absDuration < year:
		result = formatDuration(int(absDuration.Hours()/(24*30)), "month", prefix)
	default:
		result = formatDuration(int(absDuration.Hours()/(24*365)), "year", prefix)
	}

	return result, nil
}

// formatDuration handles singular/plural forms and prefix placement
func formatDuration(value int, unit string, prefix string) string {
	if value == 0 {
		return fmt.Sprintf("0 %ss %s", unit, prefix)
	}

	// Handle singular/plural
	if value == 1 {
		if prefix == "ago" {
			return fmt.Sprintf("1 %s %s", unit, prefix)
		}
		return fmt.Sprintf("%s 1 %s", prefix, unit)
	}

	if prefix == "ago" {
		return fmt.Sprintf("%d %ss %s", value, unit, prefix)
	}
	return fmt.Sprintf("%s %d %ss", prefix, value, unit)
}
