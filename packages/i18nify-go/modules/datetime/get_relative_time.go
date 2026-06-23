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
	// Locale is an IETF BCP 47 language tag. Defaults to "en-IN".
	// Non-English locales fall back to English templates; locale-specific
	// relative-time strings can be added to relTemplateSets as needed.
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
	// "narrow" produces the same output as "short" for English templates.
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

// GetRelativeTime returns an English relative-time string that describes the
// time elapsed between date and a base date (defaults to now).
//
// This is a simplified Go equivalent of the JS helper. It mirrors the JS unit
// selection thresholds and basic numeric/style behavior, but it does not use
// Intl.RelativeTimeFormat and does not provide locale-specific text output.
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
//	s, err := GetRelativeTime(yesterday, GetRelativeTimeOptions{Locale: "en-IN"})
//	// → "yesterday"  (Numeric="auto" default, Style="long" default)
func GetRelativeTime(date time.Time, opts GetRelativeTimeOptions) (string, error) {
	baseDate := opts.BaseDate
	if baseDate.IsZero() {
		baseDate = time.Now()
	}

	numeric := strings.ToLower(opts.Numeric)
	if numeric == "" {
		numeric = "auto"
	}

	style := strings.ToLower(opts.Style)
	if style == "" {
		style = "long"
	}

	// "narrow" uses the same abbreviated strings as "short" for English.
	templates := relTemplateSets["long"]
	if style == "short" || style == "narrow" {
		templates = relTemplateSets["short"]
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

	result, err := lookupRelativeTemplate(templates, unit, direction, rounded, numeric)
	if err != nil {
		return "", fmt.Errorf("getRelativeTime: %w", err)
	}
	return result, nil
}

// lookupRelativeTemplate returns the formatted relative time string using
// the provided template map (from relTemplateSets).
func lookupRelativeTemplate(templates map[string]string, unit relUnit, direction string, value int, numeric string) (string, error) {
	// Natural-language singular override when numeric != "always".
	if numeric != "always" {
		singularKey := fmt.Sprintf("%s:%s:%d", unit, direction, value)
		if tmpl, ok := templates[singularKey]; ok {
			return tmpl, nil
		}
	}

	// Plural / numeric template.
	pluralKey := fmt.Sprintf("%s:%s", unit, direction)
	if tmpl, ok := templates[pluralKey]; ok {
		return fmt.Sprintf(tmpl, value), nil
	}

	return "", fmt.Errorf("no template for unit=%s direction=%s", unit, direction)
}
