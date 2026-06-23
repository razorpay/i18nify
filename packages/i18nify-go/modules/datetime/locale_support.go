package datetime

import "strings"

const defaultLocale = "en-IN"

// normalizeLocale applies the package default when locale is empty.
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

// localeLanguage returns the primary language subtag.
func localeLanguage(locale string) string {
	if locale == "" {
		return "en"
	}
	return strings.ToLower(localeBase(locale))
}

// localeUses12Hour reports whether a locale conventionally uses a 12-hour clock.
func localeUses12Hour(locale string) bool {
	switch localeLanguage(locale) {
	case "en", "hi", "ar", "bn", "pa", "ur", "fa", "mr", "ta", "te", "kn", "ml", "gu", "ne", "si":
		return true
	default:
		return false
	}
}

// relTemplateSets contains English relative-time string templates keyed by style.
// Keys use the form "<unit>:<past|future>[:<value>]".
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
