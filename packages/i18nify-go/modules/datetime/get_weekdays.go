package datetime

import "fmt"

var englishWeekdays = map[WeekdayStyle][7]string{
	WeekdayLong:   {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"},
	WeekdayShort:  {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"},
	WeekdayNarrow: {"S", "M", "T", "W", "T", "F", "S"},
}

// WeekdayStyle controls the display length of weekday names.
type WeekdayStyle string

const (
	WeekdayLong   WeekdayStyle = "long"
	WeekdayShort  WeekdayStyle = "short"
	WeekdayNarrow WeekdayStyle = "narrow"
)

// GetWeekdaysOptions configures GetWeekdays output.
type GetWeekdaysOptions struct {
	// Locale is accepted for API parity but output is English-only.
	Locale string

	// Weekday defaults to WeekdayLong.
	Weekday WeekdayStyle
}

// GetWeekdays returns seven weekday names starting from Sunday.
func GetWeekdays(opts GetWeekdaysOptions) ([]string, error) {
	_ = normalizeLocale(opts.Locale)

	style := opts.Weekday
	if style == "" {
		style = WeekdayLong
	}

	switch style {
	case WeekdayLong, WeekdayShort, WeekdayNarrow:
	default:
		return nil, fmt.Errorf(
			"getWeekdays: unsupported weekday style %q; valid values are 'long', 'short', 'narrow'",
			style,
		)
	}

	weekdays := englishWeekdays[style]
	result := make([]string, len(weekdays))
	copy(result, weekdays[:])
	return result, nil
}
