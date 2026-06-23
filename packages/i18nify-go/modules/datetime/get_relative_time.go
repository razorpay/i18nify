package datetime

import (
	"fmt"
	"math"
	"strings"
	"time"
)

// GetRelativeTimeOptions configures GetRelativeTime output.
type GetRelativeTimeOptions struct {
	// Locale defaults to "en-IN" and currently uses English templates.
	Locale string

	// BaseDate defaults to time.Now() when zero.
	BaseDate time.Time

	// Numeric defaults to "auto".
	Numeric string

	// Style defaults to "long". "narrow" uses the short template set.
	Style string
}

// Time-unit thresholds in seconds.
const (
	thresholdMinute = 60
	thresholdHour   = thresholdMinute * 60
	thresholdDay    = thresholdHour * 24
	thresholdWeek   = thresholdDay * 7
	thresholdMonth  = thresholdDay * 30
	thresholdYear   = thresholdDay * 365
)

// relUnit is the resolved time unit.
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

// GetRelativeTime returns a human-readable relative-time string.
// It follows the JS helper's threshold behavior but currently formats output
// with English templates only.
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

	templates := relTemplateSets["long"]
	if style == "short" || style == "narrow" {
		templates = relTemplateSets["short"]
	}

	diffSeconds := date.Sub(baseDate).Seconds()
	abs := math.Abs(diffSeconds)

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

// lookupRelativeTemplate formats a relative-time string from the template map.
func lookupRelativeTemplate(templates map[string]string, unit relUnit, direction string, value int, numeric string) (string, error) {
	if numeric != "always" {
		singularKey := fmt.Sprintf("%s:%s:%d", unit, direction, value)
		if tmpl, ok := templates[singularKey]; ok {
			return tmpl, nil
		}
	}

	pluralKey := fmt.Sprintf("%s:%s", unit, direction)
	if tmpl, ok := templates[pluralKey]; ok {
		return fmt.Sprintf(tmpl, value), nil
	}

	return "", fmt.Errorf("no template for unit=%s direction=%s", unit, direction)
}
