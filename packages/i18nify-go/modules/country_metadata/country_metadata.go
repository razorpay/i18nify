// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    countryMetadata, err := UnmarshalCountryMetadata(bytes)
//    bytes, err = countryMetadata.Marshal()

// Package country_metadata provides functionality to handle metadata information about countries.
package country_metadata

import (
	"encoding/json"
	"fmt"
	"math"
	"sort"
	"strings"
	"time"

	dataSource "github.com/razorpay/i18nify/i18nify-data/go/country/metadata"
)

// Package-level cache for country meta_data (loaded once at package initialization)
var cachedCountyMetaData *CountryMetadata

// init loads the country metadata from the externalized data package when the package is imported.
func init() {
	src, err := dataSource.GetCountryMetadataData()
	if err != nil {
		panic(fmt.Sprintf("failed to load country metadata: %v", err))
	}

	data := convertFromDataSource(src)
	cachedCountyMetaData = &data
}

// convertFromDataSource maps the proto-generated CountryMetadataData to the module's CountryMetadata type.
func convertFromDataSource(src *dataSource.CountryMetadataData) CountryMetadata {
	if src == nil {
		return CountryMetadata{}
	}
	formats := make([]SupportedDateFormat, 0, len(src.GetSupportedDateFormats()))
	for _, format := range src.GetSupportedDateFormats() {
		if format == nil {
			continue
		}
		formats = append(formats, SupportedDateFormat{
			Regex:       format.GetRegex(),
			YearIndex:   format.GetYearIndex(),
			MonthIndex:  format.GetMonthIndex(),
			DayIndex:    format.GetDayIndex(),
			HourIndex:   format.GetHourIndex(),
			MinuteIndex: format.GetMinuteIndex(),
			SecondIndex: format.GetSecondIndex(),
			Format:      format.GetFormat(),
		})
	}
	info := make(map[string]MetadataInformation, len(src.GetMetadataInformation()))
	for code, cm := range src.GetMetadataInformation() {
		if cm == nil {
			continue
		}
		timezones := make(map[string]Timezone, len(cm.GetTimezones()))
		for tzKey, tzVal := range cm.GetTimezones() {
			if tzVal != nil {
				timezones[tzKey] = Timezone{UTCOffset: tzVal.GetUtcOffset()}
			}
		}
		locales := make(map[string]Locale, len(cm.GetLocales()))
		for locKey, locVal := range cm.GetLocales() {
			if locVal != nil {
				locales[locKey] = Locale{
					Name:            locVal.GetName(),
					DateOrder:       locVal.GetDateOrder(),
					DateSeparator:   locVal.GetDateSeparator(),
					HonorificTitles: convertHonorificTitlesFromDataSource(locVal.GetHonorificTitles()),
				}
			}
		}
		info[code] = MetadataInformation{
			Alpha3:            cm.GetAlpha_3(),
			ContinentCode:     cm.GetContinentCode(),
			ContinentName:     cm.GetContinentName(),
			CountryName:       cm.GetCountryName(),
			SupportedCurrency: cm.GetSupportedCurrency(),
			DefaultLocale:     cm.GetDefaultLocale(),
			DialCode:          cm.GetDialCode(),
			Flag:              cm.GetFlag(),
			Locales:           locales,
			NumericCode:       cm.GetNumericCode(),
			Sovereignty:       cm.GetSovereignty(),
			TimezoneOfCapital: cm.GetTimezoneOfCapital(),
			Timezones:         timezones,
			DefaultCurrency:   cm.GetDefaultCurrency(),
		}
	}
	return CountryMetadata{MetadataInformation: info, SupportedDateFormats: formats}
}

// UnmarshalCountryMetadata parses JSON data into a CountryMetadata struct.
func UnmarshalCountryMetadata(data []byte) (CountryMetadata, error) {
	var r CountryMetadata
	err := json.Unmarshal(data, &r)
	return r, err
}

// Marshal converts a CountryMetadata struct into JSON data.
func (r *CountryMetadata) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

// CountryMetadata represents metadata information about countries.
type CountryMetadata struct {
	// MetadataInformation holds metadata information for each country, keyed by country code.
	MetadataInformation  map[string]MetadataInformation `json:"metadata_information"`
	SupportedDateFormats []SupportedDateFormat          `json:"supported_date_formats,omitempty"`
}

// GetAllMetadataInformation returns all metadata information about countries.
func (r *CountryMetadata) GetAllMetadataInformation() map[string]MetadataInformation {
	return r.MetadataInformation
}

// GetSupportedDateFormats returns all globally supported date input patterns.
func (r *CountryMetadata) GetSupportedDateFormats() []SupportedDateFormat {
	return r.SupportedDateFormats
}

// GetMetadataInformation retrieves metadata information for a specific country code.
func GetMetadataInformation(code string) MetadataInformation {
	countryMetadataInfo, exists := cachedCountyMetaData.MetadataInformation[code]
	if !exists {
		fmt.Printf("failed to retrive the country metadata for country code: %s", code)
		return MetadataInformation{}
	}

	return countryMetadataInfo
}

// GetMetadataInformationByISONumericCode retrieves metadata information for a specific ISO 3166-1 numeric code.
func GetMetadataInformationByISONumericCode(numericCode string) MetadataInformation {
	for _, info := range cachedCountyMetaData.MetadataInformation {
		if info.NumericCode == numericCode {
			return info
		}
	}
	fmt.Printf("failed to retrive the country metadata for numeric code: %s", numericCode)
	return MetadataInformation{}
}

// getLocaleByIdentifier returns locale metadata for a locale tag like en_US or en-US.
// It first checks the country implied by the locale, then falls back to a full
// scan across all countries for language-only locales.
func getLocaleByIdentifier(locale string) (Locale, bool) {
	localeKey := normalizeLocaleKey(locale)
	if localeKey == "" {
		return Locale{}, false
	}

	if loc, ok := countryLocaleForLocale(localeKey); ok {
		return loc, true
	}

	for _, countryMeta := range cachedCountyMetaData.MetadataInformation {
		loc, ok := countryMeta.Locales[localeKey]
		if ok {
			return loc, true
		}
	}

	return Locale{}, false
}

func countryLocaleForLocale(localeKey string) (Locale, bool) {
	parts := strings.FieldsFunc(localeKey, func(r rune) bool {
		return r == '_'
	})
	if len(parts) < 2 {
		return Locale{}, false
	}

	countryCode := parts[len(parts)-1]
	countryMeta, ok := cachedCountyMetaData.MetadataInformation[countryCode]
	if !ok {
		return Locale{}, false
	}

	loc, ok := countryMeta.Locales[localeKey]
	if !ok {
		return Locale{}, false
	}

	return loc, true
}

func normalizeLocaleKey(locale string) string {
	parts := strings.FieldsFunc(strings.TrimSpace(locale), func(r rune) bool {
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

// NewCountryMetadata creates a new CountryMetadata instance.
func NewCountryMetadata(metadataInformation map[string]MetadataInformation) *CountryMetadata {
	return &CountryMetadata{
		MetadataInformation: metadataInformation,
	}
}

// MetadataInformation contains detailed information about a specific country.
type MetadataInformation struct {
	Alpha3            string              `json:"alpha_3"`             // Alpha3 represents the ISO 3166-1 alpha-3 code of the country.
	ContinentCode     string              `json:"continent_code"`      // ContinentCode represents the continent code of the country.
	ContinentName     string              `json:"continent_name"`      // ContinentName represents the name of the continent where the country belongs.
	CountryName       string              `json:"country_name"`        // CountryName represents the official name of the country.
	SupportedCurrency []string            `json:"supported_currency"`  // SupportedCurrency represents the official currencies used in the country.
	DefaultLocale     string              `json:"default_locale"`      // DefaultLocale represents the default locale used in the country.
	DialCode          string              `json:"dial_code"`           // DialCode represents the international dialing code of the country.
	Flag              string              `json:"flag"`                // Flag represents the flag emoji or image URL of the country.
	Locales           map[string]Locale   `json:"locales"`             // Locales represents the list of supported locales in the country.
	NumericCode       string              `json:"numeric_code"`        // NumericCode represents the ISO 3166-1 numeric code of the country.
	Sovereignty       string              `json:"sovereignty"`         // Sovereignty represents the official sovereignty status of the country.
	TimezoneOfCapital string              `json:"timezone_of_capital"` // TimezoneOfCapital represents the timezone of the capital city of the country.
	Timezones         map[string]Timezone `json:"timezones"`           // Timezones represents the list of timezones used in the country, keyed by timezone identifier.
	DefaultCurrency   string              `json:"default_currency"`    // DefaultCurrency represents the default currency used in the country.
}

// SupportedDateFormat describes a globally supported input date/time pattern.
type SupportedDateFormat struct {
	Regex       string `json:"regex"`
	YearIndex   int32  `json:"year_index"`
	MonthIndex  int32  `json:"month_index"`
	DayIndex    int32  `json:"day_index"`
	HourIndex   int32  `json:"hour_index,omitempty"`
	MinuteIndex int32  `json:"minute_index,omitempty"`
	SecondIndex int32  `json:"second_index,omitempty"`
	Format      string `json:"format"`
}

// NewMetadataInformation creates a new MetadataInformation instance.
func NewMetadataInformation(alpha_3 string, continentCode string, continentName string, countryName string, currency []string, defaultCurrency string, defaultLocale string, dialCode string, flag string, locales map[string]Locale, numericCode string, sovereignty string, timezoneOfCapital string, timezones map[string]Timezone) *MetadataInformation {
	return &MetadataInformation{
		Alpha3:            alpha_3,
		ContinentCode:     continentCode,
		ContinentName:     continentName,
		CountryName:       countryName,
		SupportedCurrency: currency,
		DefaultLocale:     defaultLocale,
		DialCode:          dialCode,
		Flag:              flag,
		Locales:           locales,
		NumericCode:       numericCode,
		Sovereignty:       sovereignty,
		TimezoneOfCapital: timezoneOfCapital,
		Timezones:         timezones,
		DefaultCurrency:   defaultCurrency,
	}
}

// Locale represents a locale with its code and name.
type Locale struct {
	Name            string           `json:"name"`                       // Name represents the name of the locale.
	DateOrder       string           `json:"date_order,omitempty"`       // DateOrder represents the locale-specific date field order when country-specific.
	DateSeparator   string           `json:"date_separator,omitempty"`   // DateSeparator represents the locale-specific date separator when country-specific.
	HonorificTitles []HonorificTitle `json:"honorific_titles,omitempty"` // HonorificTitles represents locale-specific honorific titles.
}

// HonorificTitle represents a locale-specific honorific title entry.
type HonorificTitle struct {
	Code        string `json:"code"`
	Title       string `json:"title"`
	Gender      string `json:"gender"`
	Description string `json:"description"`
}

// NewLocale creates a new Locale instance.
func NewLocale(name string) *Locale {
	return &Locale{
		Name: name,
	}
}

// Timezone represents a timezone with its UTC offset.
type Timezone struct {
	UTCOffset string `json:"utc_offset"` // UTCOffset represents the UTC offset of the timezone.
}

// NewTimezone creates a new Timezone instance.
func NewTimezone(utcOffset string) *Timezone {
	return &Timezone{
		UTCOffset: utcOffset,
	}
}

// GetCountryCodeFromAlpha3 returns the ISO 3166-1 alpha-2 country code for a given alpha-3 code.
func GetCountryCodeFromAlpha3(alpha3 string) string {
	normalized := strings.ToUpper(strings.TrimSpace(alpha3))
	for iso2, info := range cachedCountyMetaData.MetadataInformation {
		if info.Alpha3 == normalized {
			return iso2
		}
	}
	return ""
}

func GetCountryCodeISO2(countryName string) string {
	normalizedName := strings.ToUpper(strings.TrimSpace(countryName))
	for code, info := range cachedCountyMetaData.MetadataInformation {
		if strings.ToUpper(info.CountryName) == normalizedName {
			return code
		}
	}
	return ""
}

// ---- Datetime types ----

// TimeZoneInfo stores details for a single IANA timezone.
type TimeZoneInfo struct {
	UTCOffset string `json:"utc_offset"`
}

// TimezoneListEntry stores a timezone offset and its matching countries.
type TimezoneListEntry struct {
	UTCOffset string   `json:"utc_offset"`
	Countries []string `json:"countries"`
}

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

// GetRelativeTimeOptions configures GetRelativeTime output.
type GetRelativeTimeOptions struct {
	Locale   string
	BaseDate time.Time
	Numeric  string
	Style    string
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

// ---- relative time internals ----

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
	relStyleLong: {
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
	relStyleShort: {
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

var englishNarrowMonths = [12]string{"J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"}

var englishWeekdays = map[WeekdayStyle][7]string{
	WeekdayLong:   {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"},
	WeekdayShort:  {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"},
	WeekdayNarrow: {"S", "M", "T", "W", "T", "F", "S"},
}

// ---- FormatDateTime ----

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
		case dateOrderMDY:
			if monthStr != "" {
				dp = append(dp, monthStr)
			}
			if dayStr != "" {
				dp = append(dp, dayStr)
			}
			if yearStr != "" {
				dp = append(dp, yearStr)
			}
		case dateOrderYMD:
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

// GetRelativeTime returns a human-readable relative-time string.
func GetRelativeTime(date time.Time, opts GetRelativeTimeOptions) (string, error) {
	baseDate := opts.BaseDate
	if baseDate.IsZero() {
		baseDate = time.Now()
	}

	numeric := strings.ToLower(opts.Numeric)
	if numeric == "" {
		numeric = numericAuto
	}

	style := strings.ToLower(opts.Style)
	if style == "" {
		style = relStyleLong
	}

	templates := relTemplateSets[relStyleLong]
	if style == relStyleShort || style == relStyleNarrow {
		templates = relTemplateSets[relStyleShort]
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
	direction := dirFuture
	if rounded <= 0 {
		direction = dirPast
		rounded = -rounded
	}

	result, err := lookupRelativeTemplate(templates, unit, direction, rounded, numeric)
	if err != nil {
		return "", fmt.Errorf("getRelativeTime: %w", err)
	}
	return result, nil
}

// ---- GetTimeZoneByCountry ----

// GetTimeZoneByCountry returns timezone identifiers and UTC offsets for an
// ISO 3166-1 alpha-2 country code.
func GetTimeZoneByCountry(countryCode string) (map[string]TimeZoneInfo, error) {
	if strings.TrimSpace(countryCode) == "" {
		return nil, fmt.Errorf("getTimeZoneByCountry: country code must not be empty")
	}

	code := strings.ToUpper(strings.TrimSpace(countryCode))

	countryMeta := GetMetadataInformation(code)
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

// convertHonorificTitlesFromDataSource maps proto-generated honorific titles to the module type.
func convertHonorificTitlesFromDataSource(src []*dataSource.HonorificTitle) []HonorificTitle {
	if len(src) == 0 {
		return nil
	}

	titles := make([]HonorificTitle, 0, len(src))
	for _, title := range src {
		if title == nil {
			continue
		}
		titles = append(titles, HonorificTitle{
			Code:        title.GetCode(),
			Title:       title.GetTitle(),
			Gender:      title.GetGender(),
			Description: title.GetDescription(),
		})
	}

	return titles
}

// GetHonorificTitles returns honorific titles for the given ISO 3166-1 alpha-2
// country code (matched case-insensitively). Titles are sourced from the
// country's locales — the default locale first, then the remaining locales in
// alphabetical order. The returned slice is a copy and safe to mutate.
func GetHonorificTitles(countryCode string) ([]HonorificTitle, error) {
	cc := strings.ToUpper(strings.TrimSpace(countryCode))
	if cc == "" {
		return nil, fmt.Errorf("getHonorificTitles: countryCode must not be empty")
	}

	info, ok := cachedCountyMetaData.MetadataInformation[cc]
	if !ok {
		return nil, fmt.Errorf("getHonorificTitles: no honorific titles found for country code: %q", cc)
	}

	titles := honorificTitlesFromLocales(info)
	if len(titles) == 0 {
		return nil, fmt.Errorf("getHonorificTitles: no honorific titles found for country code: %q", cc)
	}

	// Return a copy so callers cannot mutate the cached data.
	out := make([]HonorificTitle, len(titles))
	copy(out, titles)
	return out, nil
}

// honorificTitlesFromLocales returns the first non-empty honorific title set for
// the country, preferring the default locale then alphabetical locale order.
func honorificTitlesFromLocales(info MetadataInformation) []HonorificTitle {
	if len(info.Locales) == 0 {
		return nil
	}

	if info.DefaultLocale != "" {
		if titles := info.Locales[info.DefaultLocale].HonorificTitles; len(titles) > 0 {
			return titles
		}
	}

	keys := make([]string, 0, len(info.Locales))
	for key := range info.Locales {
		keys = append(keys, key)
	}
	sort.Strings(keys)

	for _, key := range keys {
		if titles := info.Locales[key].HonorificTitles; len(titles) > 0 {
			return titles
		}
	}

	return nil
}
