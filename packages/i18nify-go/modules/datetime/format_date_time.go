package datetime

import (
	"fmt"
	"strings"
	"time"
)

var englishNarrowMonths = [12]string{"J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"}

// DateTimeMode controls which date/time components are included in the output.
// Mirrors the dateTimeMode option of the JS formatDateTime function.
type DateTimeMode string

const (
	// ModeDateOnly formats only the date portion (year, month, day).
	ModeDateOnly DateTimeMode = "dateOnly"
	// ModeTimeOnly formats only the time portion (hour, minute, second).
	ModeTimeOnly DateTimeMode = "timeOnly"
	// ModeDateTime formats both date and time.
	ModeDateTime DateTimeMode = "dateTime"
)

// FieldStyle controls how an individual date/time field is rendered.
// Mirrors the Intl.DateTimeFormatOptions field style values.
type FieldStyle string

const (
	// StyleNumeric renders the field as a plain number (e.g., "1", "2006").
	StyleNumeric FieldStyle = "numeric"
	// Style2Digit renders the field zero-padded to two digits (e.g., "01", "06").
	Style2Digit FieldStyle = "2-digit"
	// StyleLong renders the field in full long form (e.g., "January", "Monday").
	StyleLong FieldStyle = "long"
	// StyleShort renders the field in abbreviated form (e.g., "Jan", "Mon").
	StyleShort FieldStyle = "short"
	// StyleNarrow renders the field in its narrowest form (e.g., "J").
	StyleNarrow FieldStyle = "narrow"
)

// FormatDateTimeOptions configures FormatDateTime output.
// It mirrors the options parameter of the JS formatDateTime function.
type FormatDateTimeOptions struct {
	// Locale is an IETF BCP 47 language tag (e.g., "en-US", "de", "ja").
	// Defaults to "en-IN" when empty, matching the JS getLocale() fallback.
	Locale string

	// DateTimeMode selects a preset set of components to include.
	// Individual field styles below fall back to StyleNumeric if unset.
	DateTimeMode DateTimeMode

	// Individual field styles — each mirrors the corresponding
	// Intl.DateTimeFormatOptions field. An empty value means "omit this field"
	// unless DateTimeMode forces a default.
	Year   FieldStyle
	Month  FieldStyle
	Day    FieldStyle
	Hour   FieldStyle
	Minute FieldStyle
	Second FieldStyle

	// Hour12, when non-nil, overrides the locale default:
	//   true  → 12-hour clock (AM/PM)
	//   false → 24-hour clock
	// When nil, the hour cycle is derived from the locale (e.g., "en" → 12-hour).
	Hour12 *bool
}

// dateOrderForLocale returns the date-field ordering ("MDY"/"DMY"/"YMD") for
// the given locale, sourced from the embedded datetime data package.
// Falls back to "DMY" when the locale is not found.
func dateOrderForLocale(locale string) string {
	orders := cachedDateTimeData.LocaleDateOrders

	if ord, ok := orders[locale]; ok {
		return ord
	}
	// Try primary language subtag (e.g., "zh-SG" → "zh").
	if ord, ok := orders[localeBase(locale)]; ok {
		return ord
	}
	return "DMY"
}

// dateSepForLocale returns the conventional date separator for a locale,
// sourced from the embedded datetime data package. Falls back to "/".
func dateSepForLocale(locale string) string {
	seps := cachedDateTimeData.LocaleDateSeparators

	if sep, ok := seps[localeBase(locale)]; ok {
		return sep
	}
	return "/"
}

func defaultFieldStyle(style *FieldStyle) {
	if *style == "" {
		*style = StyleNumeric
	}
}

// yearFmt maps a FieldStyle to Go's time.Format token for the year component.
func yearFmt(s FieldStyle) string {
	if s == Style2Digit {
		return "06"
	}
	return "2006"
}

// dayFmt maps a FieldStyle to Go's time.Format token for the day component.
func dayFmt(s FieldStyle) string {
	if s == Style2Digit {
		return "02"
	}
	return "2"
}

// hourFmt maps a FieldStyle + hour12 flag to Go's time.Format token for the hour.
func hourFmt(s FieldStyle, hour12 bool) string {
	if hour12 {
		if s == Style2Digit {
			return "03"
		}
		return "3"
	}
	// 24-hour: Go only provides zero-padded "15".
	return "15"
}

// minuteFmt maps a FieldStyle to Go's time.Format token for the minute.
func minuteFmt(s FieldStyle) string {
	if s == StyleNumeric {
		return "4"
	}
	return "04"
}

// secondFmt maps a FieldStyle to Go's time.Format token for the second.
func secondFmt(s FieldStyle) string {
	if s == StyleNumeric {
		return "5"
	}
	return "05"
}

// FormatDateTime formats date according to the given locale and field options.
// It mirrors the i18nify-js formatDateTime function from the dateTime module.
//
// This is a simplified Go equivalent, not a full Intl.DateTimeFormat replica.
// In particular, it does not support the full JS option surface, and textual
// month output is English-only.
//
// Locale affects:
//   - date-field ordering (MDY/DMY/YMD) and separator, from i18nify-data
//   - default hour cycle (12-hour vs 24-hour) when Hour12 is nil
//
// Month names are English-only.
//
// Example — format as a US date:
//
//	s, err := FormatDateTime(t, FormatDateTimeOptions{
//	    Locale:       "en-US",
//	    DateTimeMode: ModeDateOnly,
//	})
//	// → "5/30/2026"
func FormatDateTime(date time.Time, opts FormatDateTimeOptions) (string, error) {
	locale := normalizeLocale(opts.Locale)

	year := opts.Year
	month := opts.Month
	day := opts.Day
	hour := opts.Hour
	minute := opts.Minute
	second := opts.Second

	// Derive hour cycle from locale; explicit Hour12 option overrides.
	hour12 := localeUses12Hour(locale)
	if opts.Hour12 != nil {
		hour12 = *opts.Hour12
	}

	// Apply DateTimeMode defaults — mirrors the JS switch-case block exactly.
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

	// ── Date segment ─────────────────────────────────────────────────────────
	if year != "" || month != "" || day != "" {
		sep := dateSepForLocale(locale)
		order := dateOrderForLocale(locale)

		// Build each date component as an actual string.
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

	// ── Time segment ─────────────────────────────────────────────────────────
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
