package geo

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// ─── GetDefaultLocaleList ─────────────────────────────────────────────────────

func TestGetDefaultLocaleList_Returns(t *testing.T) {
	locales, err := GetDefaultLocaleList()
	require.NoError(t, err)
	assert.NotEmpty(t, locales)
}

func TestGetDefaultLocaleList_KnownCountries(t *testing.T) {
	locales, err := GetDefaultLocaleList()
	require.NoError(t, err)

	cases := map[string]string{
		"IN": "en_IN",
		"US": "en_US",
	}
	for code, want := range cases {
		got, ok := locales[code]
		require.True(t, ok, "country %s should be present", code)
		assert.Equal(t, want, got)
	}
}

func TestGetDefaultLocaleList_AllValuesNonEmpty(t *testing.T) {
	locales, err := GetDefaultLocaleList()
	require.NoError(t, err)
	for code, locale := range locales {
		assert.NotEmpty(t, locale, "country %s has empty default locale", code)
	}
}

// ─── FormatAddressWithFormat ──────────────────────────────────────────────────

func TestFormatAddressWithFormat_Basic(t *testing.T) {
	components := AddressComponents{
		Name:          "John Doe",
		StreetAddress: "1600 Amphitheatre Pkwy",
		City:          "Mountain View",
		State:         "CA",
		Zip:           "94043",
	}
	result, err := FormatAddressWithFormat("US", components)
	require.NoError(t, err)
	assert.Contains(t, result, "John Doe")
	assert.Contains(t, result, "1600 Amphitheatre Pkwy")
	assert.Contains(t, result, "94043")
}

func TestFormatAddressWithFormat_India(t *testing.T) {
	components := AddressComponents{
		Name:          "Rahul Sharma",
		Organization:  "Razorpay",
		StreetAddress: "SJR Cyber, 22, Laskar Hosur Rd",
		City:          "Bengaluru",
		State:         "Karnataka",
		Zip:           "560102",
	}
	result, err := FormatAddressWithFormat("IN", components)
	require.NoError(t, err)
	assert.Contains(t, result, "Rahul Sharma")
	assert.Contains(t, result, "Razorpay")
	assert.Contains(t, result, "560102")
}

func TestFormatAddressWithFormat_SkipsEmptyLines(t *testing.T) {
	components := AddressComponents{
		Name:          "Alice",
		StreetAddress: "42 Main St",
		City:          "London",
		Zip:           "SW1A 1AA",
	}
	result, err := FormatAddressWithFormat("GB", components)
	require.NoError(t, err)
	for _, line := range strings.Split(result, "\n") {
		assert.NotEmpty(t, strings.TrimSpace(line), "blank lines must be removed")
	}
}

func TestFormatAddressWithFormat_EmptyCountryCode(t *testing.T) {
	_, err := FormatAddressWithFormat("", AddressComponents{})
	require.Error(t, err)
}

func TestFormatAddressWithFormat_UnknownCountryCode(t *testing.T) {
	_, err := FormatAddressWithFormat("ZZ", AddressComponents{})
	require.Error(t, err)
}
