package datetime

import "fmt"

var englishWeekdays = map[WeekdayStyle][7]string{
	WeekdayLong:   {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"},
	WeekdayShort:  {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"},
	WeekdayNarrow: {"S", "M", "T", "W", "T", "F", "S"},
}

// WeekdayStyle controls the display length of weekday names.
// Mirrors the weekday option of Intl.DateTimeFormatOptions.
type WeekdayStyle string

const (
	// WeekdayLong returns the full weekday name (e.g., "Monday").
	WeekdayLong WeekdayStyle = "long"
	// WeekdayShort returns the abbreviated weekday name (e.g., "Mon").
	WeekdayShort WeekdayStyle = "short"
	// WeekdayNarrow returns the first letter of the short name (e.g., "M").
	WeekdayNarrow WeekdayStyle = "narrow"
)

// GetWeekdaysOptions configures GetWeekdays output.
type GetWeekdaysOptions struct {
	// Locale is an IETF BCP 47 language tag. Defaults to "en-US".
	// Note: Go's time package always produces English weekday names;
	// locale is accepted for API consistency but does not affect output text.
	Locale string

	// Weekday controls the display format. Defaults to WeekdayLong.
	Weekday WeekdayStyle
}

// GetWeekdays returns a slice of seven weekday names starting from Sunday.
// It mirrors the i18nify-js getWeekdays function.
//
// This is a simplified Go equivalent. Unlike the JS version, it does not use
// Intl-backed locale data and therefore always returns English weekday names.
//
// The returned slice always has exactly 7 elements ordered
// [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday].
// Weekday names are English-only.
//
// Example:
//
//	days, err := GetWeekdays(GetWeekdaysOptions{Weekday: WeekdayShort})
//	// → ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
func GetWeekdays(opts GetWeekdaysOptions) ([]string, error) {
	_ = normalizeLocale(opts.Locale)

	style := opts.Weekday
	if style == "" {
		style = WeekdayLong
	}

	switch style {
	case WeekdayLong, WeekdayShort, WeekdayNarrow:
		// valid
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
