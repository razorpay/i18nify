package datetime

import (
	"fmt"
	"math"
	"strings"
	"time"
)

// GetRelativeTimeOptions configures GetRelativeTime output.
// It mirrors the options parameter of the JS getRelativeTime function.
type GetRelativeTimeOptions struct {
	// Locale is an IETF BCP 47 language tag. Defaults to "en-US".
	Locale string

	// BaseDate is the reference point for the relative calculation.
	// When zero-valued, the current time (time.Now()) is used — matching JS behaviour
	// where options.baseDate defaults to new Date().
	BaseDate time.Time

	// Numeric controls whether the output always uses a numeral ("always") or
	// uses natural-language forms where possible ("auto").
	// Mirrors Intl.RelativeTimeFormatOptions.numeric. Defaults to "auto".
	Numeric string

	// Style controls output verbosity: "long" (default), "short", or "narrow".
	// Mirrors Intl.RelativeTimeFormatOptions.style.
	Style string
}

// Time-unit thresholds in seconds — exact copies of the JS constants.
const (
	thresholdMinute = 60
	thresholdHour   = thresholdMinute * 60
	thresholdDay    = thresholdHour * 24
	thresholdWeek   = thresholdDay * 7
	thresholdMonth  = thresholdDay * 30
	thresholdYear   = thresholdDay * 365
)

// relUnit is the resolved time unit used when formatting.
type relUnit string

const (
	relSecond relUnit = "second"
	relMinute relUnit = "minute"
	relHour   relUnit = "hour"
	relDay    relUnit = "day"
	relWeek   relUnit = "week"
	relMonth  relUnit = "month"
	relYear   relUnit = "year"
)

// relTemplates is the lookup table for English relative-time strings.
// Keys follow the pattern "<unit>:<past|future>[:<value>]":
//   - The two-part key is the plural template (e.g., "3 days ago").
//   - The three-part key (with value) is a natural-language override for
//     Numeric="auto" (e.g., "yesterday", "last week").
//
// Only English entries are included. Additional locales can be added as needed.
var relTemplates = map[string]string{
	// ── plural templates ───────────────────────────────────────────────────
	"second:past":  "%d seconds ago",
	"second:future": "in %d seconds",
	"minute:past":  "%d minutes ago",
	"minute:future": "in %d minutes",
	"hour:past":    "%d hours ago",
	"hour:future":  "in %d hours",
	"day:past":     "%d days ago",
	"day:future":   "in %d days",
	"week:past":    "%d weeks ago",
	"week:future":  "in %d weeks",
	"month:past":   "%d months ago",
	"month:future": "in %d months",
	"year:past":    "%d years ago",
	"year:future":  "in %d years",

	// ── natural-language singular overrides (Numeric="auto") ───────────────
	"second:past:1":  "a second ago",
	"second:future:1": "in a second",
	"minute:past:1":  "a minute ago",
	"minute:future:1": "in a minute",
	"hour:past:1":    "an hour ago",
	"hour:future:1":  "in an hour",
	"day:past:1":     "yesterday",
	"day:future:1":   "tomorrow",
	"week:past:1":    "last week",
	"week:future:1":  "next week",
	"month:past:1":   "last month",
	"month:future:1": "next month",
	"year:past:1":    "last year",
	"year:future:1":  "next year",
}

// GetRelativeTime returns a locale-aware string that describes the time
// elapsed between date and a base date (defaults to now).
//
// The selection of time unit mirrors the JS implementation exactly:
//
//	|diff| < 60 s  → "second"
//	|diff| < 3600 s → "minute"
//	|diff| < 86400 s → "hour"
//	|diff| < 604800 s → "day"
//	|diff| < 2592000 s (30 d) → "week"
//	|diff| < 31536000 s (365 d) → "month"
//	otherwise → "year"
//
// Example:
//
//	s, err := GetRelativeTime(yesterday, GetRelativeTimeOptions{Locale: "en-US"})
//	// → "yesterday"  (Numeric="auto" default)
func GetRelativeTime(date time.Time, opts GetRelativeTimeOptions) (string, error) {
	locale := opts.Locale
	if locale == "" {
		locale = "en-US"
	}

	baseDate := opts.BaseDate
	if baseDate.IsZero() {
		baseDate = time.Now()
	}

	numeric := strings.ToLower(opts.Numeric)
	if numeric == "" {
		numeric = "auto"
	}

	diffSeconds := date.Sub(baseDate).Seconds()
	abs := math.Abs(diffSeconds)

	// Determine unit — mirrors JS thresholds exactly.
	var unit relUnit
	var rawValue float64

	switch {
	case abs < float64(thresholdMinute):
		unit, rawValue = relSecond, diffSeconds
	case abs < float64(thresholdHour):
		unit, rawValue = relMinute, diffSeconds/thresholdMinute
	case abs < float64(thresholdDay):
		unit, rawValue = relHour, diffSeconds/thresholdHour
	case abs < float64(thresholdWeek):
		unit, rawValue = relDay, diffSeconds/thresholdDay
	case abs < float64(thresholdMonth):
		unit, rawValue = relWeek, diffSeconds/thresholdWeek
	case abs < float64(thresholdYear):
		unit, rawValue = relMonth, diffSeconds/thresholdMonth
	default:
		unit, rawValue = relYear, diffSeconds/thresholdYear
	}

	rounded := int(math.Round(rawValue))
	direction := "future"
	if rounded <= 0 {
		direction = "past"
		rounded = -rounded
	}

	result, err := lookupRelativeTemplate(unit, direction, rounded, numeric)
	if err != nil {
		return "", fmt.Errorf("getRelativeTime: %w", err)
	}
	return result, nil
}

// lookupRelativeTemplate returns the formatted relative time string.
func lookupRelativeTemplate(unit relUnit, direction string, value int, numeric string) (string, error) {
	// Natural-language singular override when numeric != "always".
	if numeric != "always" {
		singularKey := fmt.Sprintf("%s:%s:%d", unit, direction, value)
		if tmpl, ok := relTemplates[singularKey]; ok {
			return tmpl, nil
		}
	}

	// Plural / numeric template.
	pluralKey := fmt.Sprintf("%s:%s", unit, direction)
	if tmpl, ok := relTemplates[pluralKey]; ok {
		return fmt.Sprintf(tmpl, value), nil
	}

	return "", fmt.Errorf("no template for unit=%s direction=%s", unit, direction)
}
