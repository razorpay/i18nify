package datetime

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestFormatFromUnix_BasicUTC(t *testing.T) {
	// Unix 0 = 1970-01-01 00:00:00 UTC
	// en-US MDY numeric → "1/1/1970 00:0:0"
	got, err := FormatFromUnix(0, FormatFromUnixOptions{
		Timezone: "UTC",
		FormatDateTimeOptions: FormatDateTimeOptions{
			Locale:       "en-US",
			DateTimeMode: ModeDateTime,
		},
	})
	require.NoError(t, err)
	assert.Equal(t, "1/1/1970 00:0:0", got)
}

func TestFormatFromUnix_ModernTimestamp(t *testing.T) {
	// 1609459200 = 2021-01-01 00:00:00 UTC
	got, err := FormatFromUnix(1609459200, FormatFromUnixOptions{
		Timezone: "UTC",
		FormatDateTimeOptions: FormatDateTimeOptions{
			Locale:       "en-US",
			DateTimeMode: ModeDateTime,
		},
	})
	require.NoError(t, err)
	assert.Equal(t, "1/1/2021 00:0:0", got)
}

func TestFormatFromUnix_TimezoneShiftsBehindUTC(t *testing.T) {
	// Unix 0 in America/New_York (UTC-5 in Jan) = 1969-12-31 19:00:00 EST
	got, err := FormatFromUnix(0, FormatFromUnixOptions{
		Timezone: "America/New_York",
		FormatDateTimeOptions: FormatDateTimeOptions{
			Locale:       "en-US",
			DateTimeMode: ModeDateTime,
		},
	})
	require.NoError(t, err)
	assert.Equal(t, "12/31/1969 19:0:0", got)
}

func TestFormatFromUnix_TimezoneShiftsAheadOfUTC(t *testing.T) {
	// Unix 0 in Asia/Kolkata (UTC+5:30) = 1970-01-01 05:30:00 IST
	got, err := FormatFromUnix(0, FormatFromUnixOptions{
		Timezone: "Asia/Kolkata",
		FormatDateTimeOptions: FormatDateTimeOptions{
			Locale:       "en-US",
			DateTimeMode: ModeDateTime,
		},
	})
	require.NoError(t, err)
	assert.Equal(t, "1/1/1970 05:30:0", got)
}

func TestFormatFromUnix_DefaultsToUTCWhenTimezoneEmpty(t *testing.T) {
	withExplicit, err1 := FormatFromUnix(0, FormatFromUnixOptions{
		Timezone: "UTC",
		FormatDateTimeOptions: FormatDateTimeOptions{Locale: "en-US", DateTimeMode: ModeDateTime},
	})
	withDefault, err2 := FormatFromUnix(0, FormatFromUnixOptions{
		FormatDateTimeOptions: FormatDateTimeOptions{Locale: "en-US", DateTimeMode: ModeDateTime},
	})
	require.NoError(t, err1)
	require.NoError(t, err2)
	assert.Equal(t, withExplicit, withDefault)
}

func TestFormatFromUnix_DefaultsToModeDateTimeWhenModeEmpty(t *testing.T) {
	withMode, _ := FormatFromUnix(0, FormatFromUnixOptions{
		Timezone: "UTC",
		FormatDateTimeOptions: FormatDateTimeOptions{Locale: "en-US", DateTimeMode: ModeDateTime},
	})
	withoutMode, err := FormatFromUnix(0, FormatFromUnixOptions{
		Timezone:              "UTC",
		FormatDateTimeOptions: FormatDateTimeOptions{Locale: "en-US"},
	})
	require.NoError(t, err)
	assert.Equal(t, withMode, withoutMode)
}

func TestFormatFromUnix_DateOnlyMode(t *testing.T) {
	// 1609459200 = 2021-01-01 UTC
	got, err := FormatFromUnix(1609459200, FormatFromUnixOptions{
		Timezone: "UTC",
		FormatDateTimeOptions: FormatDateTimeOptions{
			Locale:       "en-US",
			DateTimeMode: ModeDateOnly,
		},
	})
	require.NoError(t, err)
	assert.Equal(t, "1/1/2021", got)
}

func TestFormatFromUnix_TimeOnlyMode(t *testing.T) {
	// Unix 0 in UTC = 00:00:00
	got, err := FormatFromUnix(0, FormatFromUnixOptions{
		Timezone: "UTC",
		FormatDateTimeOptions: FormatDateTimeOptions{
			Locale:       "en-US",
			DateTimeMode: ModeTimeOnly,
		},
	})
	require.NoError(t, err)
	assert.Equal(t, "00:0:0", got)
}

func TestFormatFromUnix_InvalidTimezone(t *testing.T) {
	_, err := FormatFromUnix(0, FormatFromUnixOptions{Timezone: "Not/A/Valid/Zone"})
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "invalid timezone")
}

func TestFormatFromUnix_NoOptions(t *testing.T) {
	// Should not panic and should return a non-empty string
	got, err := FormatFromUnix(1609459200)
	require.NoError(t, err)
	assert.NotEmpty(t, got)
}

func TestFormatFromUnix_NegativeTimestamp(t *testing.T) {
	// -1 = 1969-12-31 23:59:59 UTC → dateOnly → 12/31/1969
	got, err := FormatFromUnix(-1, FormatFromUnixOptions{
		Timezone: "UTC",
		FormatDateTimeOptions: FormatDateTimeOptions{
			Locale:       "en-US",
			DateTimeMode: ModeDateOnly,
		},
	})
	require.NoError(t, err)
	assert.Equal(t, "12/31/1969", got)
}

func TestFormatFromUnix_DifferentTimezonesDifferentOutput(t *testing.T) {
	utc, _ := FormatFromUnix(0, FormatFromUnixOptions{Timezone: "UTC",
		FormatDateTimeOptions: FormatDateTimeOptions{Locale: "en-US", DateTimeMode: ModeDateTime}})
	ny, _ := FormatFromUnix(0, FormatFromUnixOptions{Timezone: "America/New_York",
		FormatDateTimeOptions: FormatDateTimeOptions{Locale: "en-US", DateTimeMode: ModeDateTime}})
	assert.NotEqual(t, utc, ny)
}
