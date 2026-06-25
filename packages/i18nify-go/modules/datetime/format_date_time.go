package datetime

import (
	"fmt"
	"strings"
	"time"

	countryMetadata "github.com/razorpay/i18nify/i18nify-data/go/country/metadata"
)

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
	// Locale defaults to "en-IN" when empty.
	Locale string

	// DateTimeMode selects a preset set of components to include.
	DateTimeMode DateTimeMode

	Year   FieldStyle
	Month  FieldStyle
	Day    FieldStyle
	Hour   FieldStyle
	Minute FieldStyle
	Second FieldStyle

	// Hour12 overrides the locale default when non-nil.
	Hour12 *bool
}

// dateOrderForLocale returns the date ordering for a locale.
func dateOrderForLocale(locale string) string {
	if loc, ok := localeInfoForLocale(locale); ok && loc.GetDateOrder() != "" {
		return loc.GetDateOrder()
	}
	if loc, ok := localeInfoForLocale(localeBase(locale)); ok && loc.GetDateOrder() != "" {
		return loc.GetDateOrder()
	}
	return "DMY"
}

// dateSepForLocale returns the date separator for a locale.
func dateSepForLocale(locale string) string {
	if loc, ok := localeInfoForLocale(locale); ok && loc.GetDateSeparator() != "" {
		return loc.GetDateSeparator()
	}
	if loc, ok := localeInfoForLocale(localeBase(locale)); ok && loc.GetDateSeparator() != "" {
		return loc.GetDateSeparator()
	}
	return "/"
}

func localeInfoForLocale(locale string) (*countryMetadata.LocaleInfo, bool) {
	if cachedCountryMetadata == nil {
		return nil, false
	}

	localeKey := normalizeLocaleKey(locale)
	if localeKey == "" {
		return nil, false
	}

	if loc, ok := countryLocaleForLocale(localeKey); ok {
		return loc, true
	}

	for _, countryMeta := range cachedCountryMetadata.GetMetadataInformation() {
		if countryMeta == nil {
			continue
		}
		loc, ok := countryMeta.GetLocales()[localeKey]
		if ok && loc != nil {
			return loc, true
		}
	}

	return nil, false
}

func countryLocaleForLocale(localeKey string) (*countryMetadata.LocaleInfo, bool) {
	parts := strings.FieldsFunc(localeKey, func(r rune) bool {
		return r == '_'
	})
	if len(parts) < 2 {
		return nil, false
	}

	countryCode := parts[len(parts)-1]
	countryMeta, ok := cachedCountryMetadata.GetMetadataInformation()[countryCode]
	if !ok || countryMeta == nil {
		return nil, false
	}
	loc, ok := countryMeta.GetLocales()[localeKey]
	if !ok || loc == nil {
		return nil, false
	}
	return loc, true
}

func normalizeLocaleKey(locale string) string {
	parts := strings.FieldsFunc(locale, func(r rune) bool {
		return r == '-' || r == '_'
	})
	if len(parts) == 0 {
		return ""
	}

	parts[0] = strings.ToLower(parts[0])
	if len(parts) >= 2 {
		parts[len(parts)-1] = strings.ToUpper(parts[len(parts)-1])
	}

	return strings.Join(parts, "_")
}

func defaultFieldStyle(style *FieldStyle) {
	if *style == "" {
		*style = StyleNumeric
	}
}

// yearFmt maps a year style to a Go layout token.
func yearFmt(s FieldStyle) string {
	if s == Style2Digit {
		return "06"
	}
	return "2006"
}

// dayFmt maps a day style to a Go layout token.
func dayFmt(s FieldStyle) string {
	if s == Style2Digit {
		return "02"
	}
	return "2"
}

// hourFmt maps an hour style to a Go layout token.
func hourFmt(s FieldStyle, hour12 bool) string {
	if hour12 {
		if s == Style2Digit {
			return "03"
		}
		return "3"
	}
	return "15"
}

// minuteFmt maps a minute style to a Go layout token.
func minuteFmt(s FieldStyle) string {
	if s == StyleNumeric {
		return "4"
	}
	return "04"
}

// secondFmt maps a second style to a Go layout token.
func secondFmt(s FieldStyle) string {
	if s == StyleNumeric {
		return "5"
	}
	return "05"
}

// FormatDateTime formats a date using locale-aware ordering and separators.
// This is a simplified Go equivalent of the JS helper and keeps month names in
// English.
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
			default: // numeric
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
		default: // DMY
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
