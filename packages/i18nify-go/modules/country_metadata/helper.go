package country_metadata

import (
	"fmt"
	"strings"
)

// ---- string constants ----

const (
	defaultLocale = "en-IN"

	numericAuto   = "auto"
	numericAlways = "always"

	relStyleLong   = "long"
	relStyleShort  = "short"
	relStyleNarrow = "narrow"

	dirPast   = "past"
	dirFuture = "future"

	dateOrderDMY = "DMY"
	dateOrderMDY = "MDY"
	dateOrderYMD = "YMD"
)

// ---- locale helpers ----

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

func dateOrderForLocale(locale string) string {
	if loc, ok := getLocaleByIdentifier(locale); ok && loc.DateOrder != "" {
		return loc.DateOrder
	}
	if loc, ok := getLocaleByIdentifier(localeBase(locale)); ok && loc.DateOrder != "" {
		return loc.DateOrder
	}
	return dateOrderDMY
}

func dateSepForLocale(locale string) string {
	if loc, ok := getLocaleByIdentifier(locale); ok && loc.DateSeparator != "" {
		return loc.DateSeparator
	}
	if loc, ok := getLocaleByIdentifier(localeBase(locale)); ok && loc.DateSeparator != "" {
		return loc.DateSeparator
	}
	return "/"
}

// ---- field format helpers ----

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

// ---- relative time helpers ----

func lookupRelativeTemplate(templates map[string]string, unit relUnit, direction string, value int, numeric string) (string, error) {
	if numeric != numericAlways {
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
