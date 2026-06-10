package datetime

import (
	"fmt"
	"strings"
	"time"
)

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
	// Defaults to "en-US" when empty.
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
	if idx := strings.IndexByte(locale, '-'); idx > 0 {
		if ord, ok := orders[locale[:idx]]; ok {
			return ord
		}
	}
	return "DMY"
}

// dateSepForLocale returns the conventional date separator for a locale,
// sourced from the embedded datetime data package. Falls back to "/".
func dateSepForLocale(locale string) string {
	seps := cachedDateTimeData.LocaleDateSeparators

	base := locale
	if idx := strings.IndexByte(locale, '-'); idx > 0 {
		base = locale[:idx]
	}
	if sep, ok := seps[base]; ok {
		return sep
	}
	return "/"
}

// yearFmt maps a FieldStyle to Go's time.Format token for the year component.
func yearFmt(s FieldStyle) string {
	if s == Style2Digit {
		return "06"
	}
	return "2006"
}

// monthFmt maps a FieldStyle to Go's time.Format token for the month component.
func monthFmt(s FieldStyle) string {
	switch s {
	case StyleLong:
		return "January"
	case StyleShort, StyleNarrow:
		return "Jan"
	case Style2Digit:
		return "01"
	default: // numeric
		return "1"
	}
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
// Locale affects date-field ordering (MDY/DMY/YMD) and separator character,
// as configured in i18nify-data/go/datetime/data/data.json.
// Month and weekday names are always in English because Go's time package does
// not embed CLDR locale data.
//
// Example — format as a US date:
//
//	s, err := FormatDateTime(t, FormatDateTimeOptions{
//	    Locale:       "en-US",
//	    DateTimeMode: ModeDateOnly,
//	})
//	// → "5/30/2026"
func FormatDateTime(date time.Time, opts FormatDateTimeOptions) (string, error) {
	locale := opts.Locale
	if locale == "" {
		locale = "en-US"
	}

	year := opts.Year
	month := opts.Month
	day := opts.Day
	hour := opts.Hour
	minute := opts.Minute
	second := opts.Second

	hour12 := false
	if opts.Hour12 != nil {
		hour12 = *opts.Hour12
	}

	// Apply DateTimeMode defaults — mirrors the JS switch-case block exactly.
	switch opts.DateTimeMode {
	case ModeDateOnly:
		if year == "" {
			year = StyleNumeric
		}
		if month == "" {
			month = StyleNumeric
		}
		if day == "" {
			day = StyleNumeric
		}
		hour, minute, second = "", "", ""

	case ModeTimeOnly:
		if hour == "" {
			hour = StyleNumeric
		}
		if minute == "" {
			minute = StyleNumeric
		}
		if second == "" {
			second = StyleNumeric
		}
		year, month, day = "", "", ""

	case ModeDateTime:
		if year == "" {
			year = StyleNumeric
		}
		if month == "" {
			month = StyleNumeric
		}
		if day == "" {
			day = StyleNumeric
		}
		if hour == "" {
			hour = StyleNumeric
		}
		if minute == "" {
			minute = StyleNumeric
		}
		if second == "" {
			second = StyleNumeric
		}
	}

	var segments []string

	// ── Date segment ─────────────────────────────────────────────────────────
	if year != "" || month != "" || day != "" {
		sep := dateSepForLocale(locale)
		order := dateOrderForLocale(locale)

		var dp []string
		switch order {
		case "MDY":
			if month != "" {
				dp = append(dp, monthFmt(month))
			}
			if day != "" {
				dp = append(dp, dayFmt(day))
			}
			if year != "" {
				dp = append(dp, yearFmt(year))
			}
		case "YMD":
			if year != "" {
				dp = append(dp, yearFmt(year))
			}
			if month != "" {
				dp = append(dp, monthFmt(month))
			}
			if day != "" {
				dp = append(dp, dayFmt(day))
			}
		default: // DMY
			if day != "" {
				dp = append(dp, dayFmt(day))
			}
			if month != "" {
				dp = append(dp, monthFmt(month))
			}
			if year != "" {
				dp = append(dp, yearFmt(year))
			}
		}
		if len(dp) > 0 {
			segments = append(segments, strings.Join(dp, sep))
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
		segments = append(segments, timeLayout)
	}

	if len(segments) == 0 {
		return "", fmt.Errorf("formatDateTime: no date or time components specified in options")
	}

	return date.Format(strings.Join(segments, " ")), nil
}
