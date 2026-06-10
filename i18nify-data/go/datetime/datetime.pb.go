// Hand-written Go structs for datetime configuration data.
// These mirror the data.json schema for the datetime module.
// (protoc is not available for this package; structs are maintained manually.)

package datetime

// DateTimeData is the root structure loaded from data/data.json.
type DateTimeData struct {
	// LocaleDateOrders maps a BCP 47 locale tag (or base language) to the
	// canonical date-field ordering used by that locale.
	// Values: "MDY" | "DMY" | "YMD". Absent keys default to "DMY".
	LocaleDateOrders map[string]string `json:"locale_date_orders"`

	// LocaleDateSeparators maps a BCP 47 base language subtag (e.g., "de")
	// to the conventional date-field separator character. Absent keys default to "/".
	LocaleDateSeparators map[string]string `json:"locale_date_separators"`

	// SupportedDateFormats lists all date/timestamp string patterns that
	// the datetime module recognises for parsing. Ported from the JS
	// supportedDateFormats.ts source.
	SupportedDateFormats []SupportedDateFormat `json:"supported_date_formats"`
}

// SupportedDateFormat describes a single regex-based date string pattern.
// It mirrors the SupportedDateFormats TypeScript interface in i18nify-js.
type SupportedDateFormat struct {
	// Regex is the ECMAScript-compatible regular expression (stored as a plain
	// string; callers must compile it with regexp.MustCompile).
	Regex string `json:"regex"`

	// YearIndex is the capture-group index (1-based) for the year component.
	YearIndex int `json:"year_index"`

	// MonthIndex is the capture-group index for the month component.
	MonthIndex int `json:"month_index"`

	// DayIndex is the capture-group index for the day component.
	DayIndex int `json:"day_index"`

	// HourIndex, MinuteIndex, SecondIndex are optional capture-group indices
	// for time components. Zero means the component is absent in this pattern.
	HourIndex   int `json:"hour_index,omitempty"`
	MinuteIndex int `json:"minute_index,omitempty"`
	SecondIndex int `json:"second_index,omitempty"`

	// Format is a human-readable label (e.g., "YYYY/MM/DD") for documentation.
	Format string `json:"format"`
}
