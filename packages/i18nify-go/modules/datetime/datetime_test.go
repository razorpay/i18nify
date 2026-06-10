package datetime

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// ─── FormatDateTime ───────────────────────────────────────────────────────────

func TestFormatDateTime_DateOnly_enUS(t *testing.T) {
	ts := time.Date(2024, 3, 5, 0, 0, 0, 0, time.UTC)
	got, err := FormatDateTime(ts, FormatDateTimeOptions{
		Locale:       "en-US",
		DateTimeMode: ModeDateOnly,
	})
	require.NoError(t, err)
	assert.Equal(t, "3/5/2024", got)
}

func TestFormatDateTime_DateOnly_enGB(t *testing.T) {
	ts := time.Date(2024, 3, 5, 0, 0, 0, 0, time.UTC)
	got, err := FormatDateTime(ts, FormatDateTimeOptions{
		Locale:       "en-GB",
		DateTimeMode: ModeDateOnly,
	})
	require.NoError(t, err)
	assert.Equal(t, "5/3/2024", got)
}

func TestFormatDateTime_DateOnly_Japanese(t *testing.T) {
	ts := time.Date(2024, 3, 5, 0, 0, 0, 0, time.UTC)
	got, err := FormatDateTime(ts, FormatDateTimeOptions{
		Locale:       "ja",
		DateTimeMode: ModeDateOnly,
	})
	require.NoError(t, err)
	assert.Equal(t, "2024/3/5", got)
}

func TestFormatDateTime_TimeOnly_24h(t *testing.T) {
	ts := time.Date(2024, 1, 1, 14, 5, 9, 0, time.UTC)
	got, err := FormatDateTime(ts, FormatDateTimeOptions{
		Locale:       "en-US",
		DateTimeMode: ModeTimeOnly,
	})
	require.NoError(t, err)
	assert.Equal(t, "14:5:9", got)
}

func TestFormatDateTime_TimeOnly_12h(t *testing.T) {
	h12 := true
	ts := time.Date(2024, 1, 1, 14, 5, 9, 0, time.UTC)
	got, err := FormatDateTime(ts, FormatDateTimeOptions{
		Locale:       "en-US",
		DateTimeMode: ModeTimeOnly,
		Hour12:       &h12,
	})
	require.NoError(t, err)
	assert.Equal(t, "2:5:9 PM", got)
}

func TestFormatDateTime_DateTime(t *testing.T) {
	ts := time.Date(2024, 3, 5, 14, 30, 0, 0, time.UTC)
	got, err := FormatDateTime(ts, FormatDateTimeOptions{
		Locale:       "en-US",
		DateTimeMode: ModeDateTime,
	})
	require.NoError(t, err)
	assert.Equal(t, "3/5/2024 14:30:0", got)
}

func TestFormatDateTime_LongMonth(t *testing.T) {
	ts := time.Date(2024, 3, 5, 0, 0, 0, 0, time.UTC)
	got, err := FormatDateTime(ts, FormatDateTimeOptions{
		Locale: "en-US",
		Year:   StyleNumeric,
		Month:  StyleLong,
		Day:    StyleNumeric,
	})
	require.NoError(t, err)
	assert.Equal(t, "March/5/2024", got)
}

func TestFormatDateTime_TwoDigitYear(t *testing.T) {
	ts := time.Date(2024, 3, 5, 0, 0, 0, 0, time.UTC)
	got, err := FormatDateTime(ts, FormatDateTimeOptions{
		Locale: "en-US",
		Year:   Style2Digit,
		Month:  Style2Digit,
		Day:    Style2Digit,
	})
	require.NoError(t, err)
	assert.Equal(t, "03/05/24", got)
}

func TestFormatDateTime_NoComponents_Error(t *testing.T) {
	ts := time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC)
	_, err := FormatDateTime(ts, FormatDateTimeOptions{})
	require.Error(t, err)
}

func TestFormatDateTime_DefaultLocale(t *testing.T) {
	ts := time.Date(2024, 3, 5, 0, 0, 0, 0, time.UTC)
	got, err := FormatDateTime(ts, FormatDateTimeOptions{
		DateTimeMode: ModeDateOnly,
	})
	require.NoError(t, err)
	// Default locale is "en-US" → MDY
	assert.Equal(t, "3/5/2024", got)
}

// ─── GetRelativeTime ──────────────────────────────────────────────────────────

func TestGetRelativeTime_SecondsAgo(t *testing.T) {
	base := time.Date(2024, 1, 1, 12, 0, 0, 0, time.UTC)
	past := base.Add(-30 * time.Second)
	got, err := GetRelativeTime(past, GetRelativeTimeOptions{BaseDate: base, Numeric: "always"})
	require.NoError(t, err)
	assert.Equal(t, "30 seconds ago", got)
}

func TestGetRelativeTime_MinutesAgo(t *testing.T) {
	base := time.Date(2024, 1, 1, 12, 0, 0, 0, time.UTC)
	past := base.Add(-5 * time.Minute)
	got, err := GetRelativeTime(past, GetRelativeTimeOptions{BaseDate: base, Numeric: "always"})
	require.NoError(t, err)
	assert.Equal(t, "5 minutes ago", got)
}

func TestGetRelativeTime_HoursAgo(t *testing.T) {
	base := time.Date(2024, 1, 1, 12, 0, 0, 0, time.UTC)
	past := base.Add(-3 * time.Hour)
	got, err := GetRelativeTime(past, GetRelativeTimeOptions{BaseDate: base, Numeric: "always"})
	require.NoError(t, err)
	assert.Equal(t, "3 hours ago", got)
}

func TestGetRelativeTime_Yesterday_Auto(t *testing.T) {
	base := time.Date(2024, 1, 2, 12, 0, 0, 0, time.UTC)
	past := base.Add(-24 * time.Hour)
	got, err := GetRelativeTime(past, GetRelativeTimeOptions{BaseDate: base})
	require.NoError(t, err)
	assert.Equal(t, "yesterday", got)
}

func TestGetRelativeTime_Tomorrow_Auto(t *testing.T) {
	base := time.Date(2024, 1, 1, 12, 0, 0, 0, time.UTC)
	future := base.Add(24 * time.Hour)
	got, err := GetRelativeTime(future, GetRelativeTimeOptions{BaseDate: base})
	require.NoError(t, err)
	assert.Equal(t, "tomorrow", got)
}

func TestGetRelativeTime_LastWeek_Auto(t *testing.T) {
	base := time.Date(2024, 1, 8, 0, 0, 0, 0, time.UTC)
	past := base.Add(-7 * 24 * time.Hour)
	got, err := GetRelativeTime(past, GetRelativeTimeOptions{BaseDate: base})
	require.NoError(t, err)
	assert.Equal(t, "last week", got)
}

func TestGetRelativeTime_InFuture(t *testing.T) {
	base := time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC)
	future := base.Add(2 * time.Hour)
	got, err := GetRelativeTime(future, GetRelativeTimeOptions{BaseDate: base, Numeric: "always"})
	require.NoError(t, err)
	assert.Equal(t, "in 2 hours", got)
}

func TestGetRelativeTime_YearsAgo(t *testing.T) {
	base := time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC)
	past := base.AddDate(-3, 0, 0)
	got, err := GetRelativeTime(past, GetRelativeTimeOptions{BaseDate: base, Numeric: "always"})
	require.NoError(t, err)
	assert.Equal(t, "3 years ago", got)
}

// ─── GetWeekdays ──────────────────────────────────────────────────────────────

func TestGetWeekdays_Long(t *testing.T) {
	days, err := GetWeekdays(GetWeekdaysOptions{Weekday: WeekdayLong})
	require.NoError(t, err)
	assert.Len(t, days, 7)
	assert.Equal(t, "Sunday", days[0])
	assert.Equal(t, "Saturday", days[6])
}

func TestGetWeekdays_Short(t *testing.T) {
	days, err := GetWeekdays(GetWeekdaysOptions{Weekday: WeekdayShort})
	require.NoError(t, err)
	assert.Equal(t, []string{"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"}, days)
}

func TestGetWeekdays_Narrow(t *testing.T) {
	days, err := GetWeekdays(GetWeekdaysOptions{Weekday: WeekdayNarrow})
	require.NoError(t, err)
	assert.Equal(t, []string{"S", "M", "T", "W", "T", "F", "S"}, days)
}

func TestGetWeekdays_DefaultStyle(t *testing.T) {
	days, err := GetWeekdays(GetWeekdaysOptions{})
	require.NoError(t, err)
	assert.Equal(t, "Sunday", days[0], "default style should be long")
}

func TestGetWeekdays_InvalidStyle(t *testing.T) {
	_, err := GetWeekdays(GetWeekdaysOptions{Weekday: "invalid"})
	require.Error(t, err)
}

func TestGetWeekdays_StartsOnSunday(t *testing.T) {
	days, err := GetWeekdays(GetWeekdaysOptions{Weekday: WeekdayLong})
	require.NoError(t, err)
	assert.Equal(t, "Sunday", days[0], "first element must be Sunday to match JS behaviour")
}

// ─── GetTimeZoneByCountry ─────────────────────────────────────────────────────

func TestGetTimeZoneByCountry_India(t *testing.T) {
	tzs, err := GetTimeZoneByCountry("IN")
	require.NoError(t, err)
	require.NotEmpty(t, tzs)

	// India has a single timezone.
	tz, ok := tzs["Asia/Kolkata"]
	require.True(t, ok, "expected Asia/Kolkata in result")
	assert.Equal(t, "UTC +05:30", tz.UTCOffset)
}

func TestGetTimeZoneByCountry_CaseInsensitive(t *testing.T) {
	tzs1, err1 := GetTimeZoneByCountry("IN")
	tzs2, err2 := GetTimeZoneByCountry("in")
	require.NoError(t, err1)
	require.NoError(t, err2)
	assert.Equal(t, tzs1, tzs2)
}

func TestGetTimeZoneByCountry_EmptyCode(t *testing.T) {
	_, err := GetTimeZoneByCountry("")
	require.Error(t, err)
}

func TestGetTimeZoneByCountry_UnknownCode(t *testing.T) {
	_, err := GetTimeZoneByCountry("ZZ")
	require.Error(t, err)
}

func TestGetTimeZoneByCountry_MultipleTimezones(t *testing.T) {
	// The US observes multiple timezones.
	tzs, err := GetTimeZoneByCountry("US")
	require.NoError(t, err)
	assert.Greater(t, len(tzs), 1, "US should have multiple timezone entries")
}

// ─── GetTimezoneList ──────────────────────────────────────────────────────────

func TestGetTimezoneList_ReturnsNonEmpty(t *testing.T) {
	list, err := GetTimezoneList()
	require.NoError(t, err)
	assert.NotEmpty(t, list)
}

func TestGetTimezoneList_KolkataEntry(t *testing.T) {
	list, err := GetTimezoneList()
	require.NoError(t, err)

	entry, ok := list["Asia/Kolkata"]
	require.True(t, ok, "Asia/Kolkata must be present")
	assert.Equal(t, "UTC +05:30", entry.UTCOffset)

	found := false
	for _, cc := range entry.Countries {
		if cc == "IN" {
			found = true
			break
		}
	}
	assert.True(t, found, "IN must be listed under Asia/Kolkata")
}

func TestGetTimezoneList_NewYorkHasUTCOffset(t *testing.T) {
	list, err := GetTimezoneList()
	require.NoError(t, err)

	entry, ok := list["America/New_York"]
	require.True(t, ok, "America/New_York must be present")
	assert.NotEmpty(t, entry.UTCOffset)
	assert.Contains(t, entry.Countries, "US")
}

func TestGetTimezoneList_EachEntryHasCountries(t *testing.T) {
	list, err := GetTimezoneList()
	require.NoError(t, err)

	for tzKey, entry := range list {
		assert.NotEmpty(t, entry.Countries, "timezone %q must have at least one country", tzKey)
		assert.NotEmpty(t, entry.UTCOffset, "timezone %q must have a UTC offset", tzKey)
	}
}

func TestGetTimezoneList_NoDuplicateCountriesPerTimezone(t *testing.T) {
	list, err := GetTimezoneList()
	require.NoError(t, err)

	for tzKey, entry := range list {
		seen := make(map[string]bool)
		for _, cc := range entry.Countries {
			assert.False(t, seen[cc], "duplicate country %q under timezone %q", cc, tzKey)
			seen[cc] = true
		}
	}
}

func TestGetTimezoneList_SharedTimezone(t *testing.T) {
	// Multiple countries can share a single timezone — verify aggregation works.
	list, err := GetTimezoneList()
	require.NoError(t, err)

	sharedFound := false
	for _, entry := range list {
		if len(entry.Countries) > 1 {
			sharedFound = true
			break
		}
	}
	assert.True(t, sharedFound, "at least one timezone should be shared by multiple countries")
}

// ─── GetPrimaryTimezone ───────────────────────────────────────────────────────

func TestGetPrimaryTimezone_India(t *testing.T) {
	tz, err := GetPrimaryTimezone("IN")
	require.NoError(t, err)
	assert.Equal(t, "Asia/Kolkata", tz)
}

func TestGetPrimaryTimezone_US(t *testing.T) {
	tz, err := GetPrimaryTimezone("US")
	require.NoError(t, err)
	assert.Equal(t, "America/New_York", tz)
}

func TestGetPrimaryTimezone_Russia(t *testing.T) {
	tz, err := GetPrimaryTimezone("RU")
	require.NoError(t, err)
	assert.Equal(t, "Europe/Moscow", tz)
}

func TestGetPrimaryTimezone_Australia(t *testing.T) {
	tz, err := GetPrimaryTimezone("AU")
	require.NoError(t, err)
	assert.Equal(t, "Australia/Sydney", tz)
}

func TestGetPrimaryTimezone_CaseInsensitive(t *testing.T) {
	upper, err1 := GetPrimaryTimezone("IN")
	lower, err2 := GetPrimaryTimezone("in")
	require.NoError(t, err1)
	require.NoError(t, err2)
	assert.Equal(t, upper, lower)
}

func TestGetPrimaryTimezone_EmptyCode(t *testing.T) {
	_, err := GetPrimaryTimezone("")
	require.Error(t, err)
}

func TestGetPrimaryTimezone_UnknownCode(t *testing.T) {
	_, err := GetPrimaryTimezone("ZZ")
	require.Error(t, err)
	assert.Contains(t, err.Error(), "ZZ")
}

func TestGetPrimaryTimezone_ReturnsIANAIdentifier(t *testing.T) {
	// Spot-check a handful of countries to confirm IANA format (Region/City).
	cases := []struct{ cc, want string }{
		{"GB", "Europe/London"},
		{"DE", "Europe/Berlin"},
		{"CN", "Asia/Shanghai"},
		{"BR", "America/Cuiaba"},
	}
	for _, tc := range cases {
		tz, err := GetPrimaryTimezone(tc.cc)
		require.NoError(t, err, "country %s", tc.cc)
		assert.Equal(t, tc.want, tz, "country %s", tc.cc)
	}
}

// ─── GetFinancialYear ─────────────────────────────────────────────────────────

func TestGetFinancialYear_India_AprilStart(t *testing.T) {
	// Apr 1 2024 → FY 2024-25
	fy, err := GetFinancialYear(time.Date(2024, 4, 1, 0, 0, 0, 0, time.UTC), "IN")
	require.NoError(t, err)
	assert.Equal(t, "2024-25", fy)
}

func TestGetFinancialYear_India_March(t *testing.T) {
	// Mar 31 2024 → still FY 2023-24
	fy, err := GetFinancialYear(time.Date(2024, 3, 31, 0, 0, 0, 0, time.UTC), "IN")
	require.NoError(t, err)
	assert.Equal(t, "2023-24", fy)
}

func TestGetFinancialYear_India_November(t *testing.T) {
	fy, err := GetFinancialYear(time.Date(2024, 11, 15, 0, 0, 0, 0, time.UTC), "IN")
	require.NoError(t, err)
	assert.Equal(t, "2024-25", fy)
}

func TestGetFinancialYear_Australia_JulyStart(t *testing.T) {
	// Jul 1 2024 → FY 2024-25
	fy, err := GetFinancialYear(time.Date(2024, 7, 1, 0, 0, 0, 0, time.UTC), "AU")
	require.NoError(t, err)
	assert.Equal(t, "2024-25", fy)
}

func TestGetFinancialYear_Australia_June(t *testing.T) {
	// Jun 30 2024 → FY 2023-24
	fy, err := GetFinancialYear(time.Date(2024, 6, 30, 0, 0, 0, 0, time.UTC), "AU")
	require.NoError(t, err)
	assert.Equal(t, "2023-24", fy)
}

func TestGetFinancialYear_US_OctoberStart(t *testing.T) {
	// Oct 1 2024 → FY2025
	fy, err := GetFinancialYear(time.Date(2024, 10, 1, 0, 0, 0, 0, time.UTC), "US")
	require.NoError(t, err)
	assert.Equal(t, "FY2025", fy)
}

func TestGetFinancialYear_US_September(t *testing.T) {
	// Sep 30 2024 → FY2024
	fy, err := GetFinancialYear(time.Date(2024, 9, 30, 0, 0, 0, 0, time.UTC), "US")
	require.NoError(t, err)
	assert.Equal(t, "FY2024", fy)
}

func TestGetFinancialYear_CaseInsensitive(t *testing.T) {
	upper, err1 := GetFinancialYear(time.Date(2024, 11, 15, 0, 0, 0, 0, time.UTC), "IN")
	lower, err2 := GetFinancialYear(time.Date(2024, 11, 15, 0, 0, 0, 0, time.UTC), "in")
	require.NoError(t, err1)
	require.NoError(t, err2)
	assert.Equal(t, upper, lower)
}

func TestGetFinancialYear_LabelFormatOverride_Long(t *testing.T) {
	fy, err := GetFinancialYear(
		time.Date(2024, 11, 15, 0, 0, 0, 0, time.UTC), "IN",
		GetFinancialYearOptions{LabelFormat: FYLabelLong},
	)
	require.NoError(t, err)
	assert.Equal(t, "2024-2025", fy)
}

func TestGetFinancialYear_LabelFormatOverride_FY(t *testing.T) {
	fy, err := GetFinancialYear(
		time.Date(2024, 11, 15, 0, 0, 0, 0, time.UTC), "IN",
		GetFinancialYearOptions{LabelFormat: FYLabelFY},
	)
	require.NoError(t, err)
	assert.Equal(t, "FY2025", fy)
}

func TestGetFinancialYear_LabelFormatOverride_ShortOnUS(t *testing.T) {
	fy, err := GetFinancialYear(
		time.Date(2024, 10, 1, 0, 0, 0, 0, time.UTC), "US",
		GetFinancialYearOptions{LabelFormat: FYLabelShort},
	)
	require.NoError(t, err)
	assert.Equal(t, "2024-25", fy)
}

func TestGetFinancialYear_UnsupportedCountry(t *testing.T) {
	_, err := GetFinancialYear(time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC), "DE")
	require.Error(t, err)
	assert.Contains(t, err.Error(), "DE")
}

func TestGetFinancialYear_EmptyCountryCode(t *testing.T) {
	_, err := GetFinancialYear(time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC), "")
	require.Error(t, err)
}
