package datetime

import (
	"fmt"
	"time"
)

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

// sundayEpoch is January 4, 1970, which was a Sunday.
// Starting from a known Sunday and iterating seven days reproduces the
// same full-week sequence as the JS implementation, which uses
// new Date(1970, 0, 4 + i) for i in [0, 6].
var sundayEpoch = time.Date(1970, time.January, 4, 0, 0, 0, 0, time.UTC)

// GetWeekdays returns a slice of seven weekday names starting from Sunday.
// It mirrors the i18nify-js getWeekdays function.
//
// The returned slice always has exactly 7 elements ordered
// [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday].
//
// Note: Go's time.Format always produces English names. For fully localised
// weekday names, use a CLDR-backed library.
//
// Example:
//
//	days, err := GetWeekdays(GetWeekdaysOptions{Weekday: WeekdayShort})
//	// → ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
func GetWeekdays(opts GetWeekdaysOptions) ([]string, error) {
	style := opts.Weekday
	if style == "" {
		style = WeekdayLong
	}

	var formatFn func(time.Time) string
	switch style {
	case WeekdayLong:
		formatFn = func(t time.Time) string { return t.Format("Monday") }
	case WeekdayShort:
		formatFn = func(t time.Time) string { return t.Format("Mon") }
	case WeekdayNarrow:
		// Go has no built-in narrow weekday token; return the first letter of
		// the abbreviated name, matching the JS "narrow" behaviour.
		formatFn = func(t time.Time) string { return t.Format("Mon")[:1] }
	default:
		return nil, fmt.Errorf(
			"getWeekdays: unsupported weekday style %q; valid values are 'long', 'short', 'narrow'",
			style,
		)
	}

	weekdays := make([]string, 7)
	for i := 0; i < 7; i++ {
		weekdays[i] = formatFn(sundayEpoch.AddDate(0, 0, i))
	}
	return weekdays, nil
}
