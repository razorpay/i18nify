// Package datetime provides Go helpers for formatting dates, relative time,
// weekdays, and country timezone data.
package datetime

import (
	"fmt"
	"math"
	"strings"
	"time"

	countrymetadata "github.com/razorpay/i18nify/packages/i18nify-go/modules/country_metadata"
)

// TimeZoneInfo stores details for a single IANA timezone.
type TimeZoneInfo struct {
	UTCOffset string `json:"utc_offset"`
}

// TimezoneListEntry stores a timezone offset and its matching countries.
type TimezoneListEntry struct {
	UTCOffset string   `json:"utc_offset"`
	Countries []string `json:"countries"`
}

// ---- locale helpers ----

const defaultLocale = "en-IN"

func normalizeLocale(locale string) string {
	if strings.TrimSpace(locale) == "" {
		return defaultLocale
	}
	return locale
}

func localeBase(locale string) string {
	if idx := strings.IndexByte(locale, '-'); idx > 0 {
		return locale[:idx]
	}
	return locale
}

func localeLanguage(locale string) string {
	if locale == "" {
		return "en"
	}
	return strings.ToLower(localeBase(locale))
}

func localeUses12Hour(locale string) bool {
	switch localeLanguage(locale) {
	case "en", "hi", "ar", "bn", "pa", "ur", "fa", "mr", "ta", "te", "kn", "ml", "gu", "ne", "si":
		return true
	default:
		return false
	}
}

// ---- FormatDateTime ----

var englishNarrowMonths = [12]string{"J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"}

// DateTimeMode controls which date/time components are included.
type DateTimeMode string

const (
	ModeDateOnly DateTimeMode = "dateOnly"
	ModeTimeOnly DateTimeMode = "timeOnly"
	ModeDateTime DateTimeMode = "dateTime"
)

// FieldStyle controls how an individual field is rendered.
type FieldStyle string

const (
	StyleNumeric FieldStyle = "numeric"
	Style2Digit  FieldStyle = "2-digit"
	StyleLong    FieldStyle = "long"
	StyleShort   FieldStyle = "short"
	StyleNarrow  FieldStyle = "narrow"
)

// FormatDateTimeOptions configures FormatDateTime output.
type FormatDateTimeOptions struct {
	Locale       string
	DateTimeMode DateTimeMode
	Year         FieldStyle
	Month        FieldStyle
	Day          FieldStyle
	Hour         FieldStyle
	Minute       FieldStyle
	Second       FieldStyle
	Hour12       *bool
}

func dateOrderForLocale(locale string) string {
	if loc, ok := countrymetadata.GetLocaleByIdentifier(locale); ok && loc.DateOrder != "" {
		return loc.DateOrder
	}
	if loc, ok := countrymetadata.GetLocaleByIdentifier(localeBase(locale)); ok && loc.DateOrder != "" {
		return loc.DateOrder
	}
	return "DMY"
}

func dateSepForLocale(locale string) string {
	if loc, ok := countrymetadata.GetLocaleByIdentifier(locale); ok && loc.DateSeparator != "" {
		return loc.DateSeparator
	}
	if loc, ok := countrymetadata.GetLocaleByIdentifier(localeBase(locale)); ok && loc.DateSeparator != "" {
		return loc.DateSeparator
	}
	return "/"
}

func defaultFieldStyle(style *FieldStyle) {
	if *style == "" {
		*style = StyleNumeric
	}
}

func yearFmt(s FieldStyle) string {
	if s == Style2Digit {
		return "06"
	}
	return "2006"
}

func dayFmt(s FieldStyle) string {
	if s == Style2Digit {
		return "02"
	}
	return "2"
}

func hourFmt(s FieldStyle, hour12 bool) string {
	if hour12 {
		if s == Style2Digit {
			return "03"
		}
		return "3"
	}
	return "15"
}

func minuteFmt(s FieldStyle) string {
	if s == StyleNumeric {
		return "4"
	}
	return "04"
}

func secondFmt(s FieldStyle) string {
	if s == StyleNumeric {
		return "5"
	}
	return "05"
}

// FormatDateTime formats a date using locale-aware ordering and separators.
func FormatDateTime(date time.Time, opts FormatDateTimeOptions) (string, error) {
	locale := normalizeLocale(opts.Locale)

	year := opts.Year
	month := opts.Month
	day := opts.Day
	hour := opts.Hour
	minute := opts.Minute
	second := opts.Second

	hour12 := localeUses12Hour(locale)
	if opts.Hour12 != nil {
		hour12 = *opts.Hour12
	}

	switch opts.DateTimeMode {
	case ModeDateOnly:
		defaultFieldStyle(&year)
		defaultFieldStyle(&month)
		defaultFieldStyle(&day)
		hour, minute, second = "", "", ""
	case ModeTimeOnly:
		defaultFieldStyle(&hour)
		defaultFieldStyle(&minute)
		defaultFieldStyle(&second)
		year, month, day = "", "", ""
	case ModeDateTime:
		defaultFieldStyle(&year)
		defaultFieldStyle(&month)
		defaultFieldStyle(&day)
		defaultFieldStyle(&hour)
		defaultFieldStyle(&minute)
		defaultFieldStyle(&second)
	}

	var parts []string

	if year != "" || month != "" || day != "" {
		sep := dateSepForLocale(locale)
		order := dateOrderForLocale(locale)

		var yearStr, monthStr, dayStr string
		if year != "" {
			yearStr = date.Format(yearFmt(year))
		}
		if month != "" {
			switch month {
			case StyleLong:
				monthStr = date.Format("January")
			case StyleShort:
				monthStr = date.Format("Jan")
			case StyleNarrow:
				monthStr = englishNarrowMonths[int(date.Month())-1]
			case Style2Digit:
				monthStr = date.Format("01")
			default:
				monthStr = date.Format("1")
			}
		}
		if day != "" {
			dayStr = date.Format(dayFmt(day))
		}

		var dp []string
		switch order {
		case "MDY":
			if monthStr != "" {
				dp = append(dp, monthStr)
			}
			if dayStr != "" {
				dp = append(dp, dayStr)
			}
			if yearStr != "" {
				dp = append(dp, yearStr)
			}
		case "YMD":
			if yearStr != "" {
				dp = append(dp, yearStr)
			}
			if monthStr != "" {
				dp = append(dp, monthStr)
			}
			if dayStr != "" {
				dp = append(dp, dayStr)
			}
		default:
			if dayStr != "" {
				dp = append(dp, dayStr)
			}
			if monthStr != "" {
				dp = append(dp, monthStr)
			}
			if yearStr != "" {
				dp = append(dp, yearStr)
			}
		}
		if len(dp) > 0 {
			parts = append(parts, strings.Join(dp, sep))
		}
	}

	if hour != "" || minute != "" || second != "" {
		var tp []string
		if hour != "" {
			tp = append(tp, hourFmt(hour, hour12))
		}
		if minute != "" {
			tp = append(tp, minuteFmt(minute))
		}
		if second != "" {
			tp = append(tp, secondFmt(second))
		}
		timeLayout := strings.Join(tp, ":")
		if hour12 {
			timeLayout += " PM"
		}
		parts = append(parts, date.Format(timeLayout))
	}

	if len(parts) == 0 {
		return "", fmt.Errorf("formatDateTime: no date or time components specified in options")
	}

	return strings.Join(parts, " "), nil
}

// ---- GetRelativeTime ----

// GetRelativeTimeOptions configures GetRelativeTime output.
type GetRelativeTimeOptions struct {
	Locale   string
	BaseDate time.Time
	Numeric  string
	Style    string
}

const (
	thresholdMinute = 60
	thresholdHour   = thresholdMinute * 60
	thresholdDay    = thresholdHour * 24
	thresholdWeek   = thresholdDay * 7
	thresholdMonth  = thresholdDay * 30
	thresholdYear   = thresholdDay * 365
)

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

var relTemplateSets = map[string]map[string]string{
	"long": {
		"second:past":     "%d seconds ago",
		"second:future":   "in %d seconds",
		"minute:past":     "%d minutes ago",
		"minute:future":   "in %d minutes",
		"hour:past":       "%d hours ago",
		"hour:future":     "in %d hours",
		"day:past":        "%d days ago",
		"day:future":      "in %d days",
		"week:past":       "%d weeks ago",
		"week:future":     "in %d weeks",
		"month:past":      "%d months ago",
		"month:future":    "in %d months",
		"year:past":       "%d years ago",
		"year:future":     "in %d years",
		"second:past:0":   "now",
		"second:future:0": "now",
		"second:past:1":   "a second ago",
		"second:future:1": "in a second",
		"minute:past:1":   "a minute ago",
		"minute:future:1": "in a minute",
		"hour:past:1":     "an hour ago",
		"hour:future:1":   "in an hour",
		"day:past:1":      "yesterday",
		"day:future:1":    "tomorrow",
		"week:past:1":     "last week",
		"week:future:1":   "next week",
		"month:past:1":    "last month",
		"month:future:1":  "next month",
		"year:past:1":     "last year",
		"year:future:1":   "next year",
	},
	"short": {
		"second:past":     "%d sec. ago",
		"second:future":   "in %d sec.",
		"minute:past":     "%d min. ago",
		"minute:future":   "in %d min.",
		"hour:past":       "%d hr. ago",
		"hour:future":     "in %d hr.",
		"day:past":        "%d days ago",
		"day:future":      "in %d days",
		"week:past":       "%d wk. ago",
		"week:future":     "in %d wk.",
		"month:past":      "%d mo. ago",
		"month:future":    "in %d mo.",
		"year:past":       "%d yr. ago",
		"year:future":     "in %d yr.",
		"second:past:0":   "now",
		"second:future:0": "now",
		"second:past:1":   "1 sec. ago",
		"second:future:1": "in 1 sec.",
		"minute:past:1":   "1 min. ago",
		"minute:future:1": "in 1 min.",
		"hour:past:1":     "1 hr. ago",
		"hour:future:1":   "in 1 hr.",
		"day:past:1":      "yesterday",
		"day:future:1":    "tomorrow",
		"week:past:1":     "last wk.",
		"week:future:1":   "next wk.",
		"month:past:1":    "last mo.",
		"month:future:1":  "next mo.",
		"year:past:1":     "last yr.",
		"year:future:1":   "next yr.",
	},
}

// GetRelativeTime returns a human-readable relative-time string.
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

// ---- GetTimeZoneByCountry ----

// GetTimeZoneByCountry returns timezone identifiers and UTC offsets for an
// ISO 3166-1 alpha-2 country code.
func GetTimeZoneByCountry(countryCode string) (map[string]TimeZoneInfo, error) {
	if strings.TrimSpace(countryCode) == "" {
		return nil, fmt.Errorf("getTimeZoneByCountry: country code must not be empty")
	}

	code := strings.ToUpper(strings.TrimSpace(countryCode))

	countryMeta := countrymetadata.GetMetadataInformation(code)
	if countryMeta.CountryName == "" {
		return nil, fmt.Errorf("getTimeZoneByCountry: country code %q not found", code)
	}

	rawTimezones := countryMeta.Timezones
	if len(rawTimezones) == 0 {
		return nil, fmt.Errorf("getTimeZoneByCountry: no timezone data for country code %q", code)
	}

	result := make(map[string]TimeZoneInfo, len(rawTimezones))
	for tzKey, tzVal := range rawTimezones {
		result[tzKey] = TimeZoneInfo{UTCOffset: tzVal.UTCOffset}
	}

	return result, nil
}

// ---- GetWeekdays ----

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
	Locale  string
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
