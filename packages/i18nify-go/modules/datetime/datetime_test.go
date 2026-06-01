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
