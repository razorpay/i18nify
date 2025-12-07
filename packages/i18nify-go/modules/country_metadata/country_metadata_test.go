package country_metadata

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetMetadataInformation(t *testing.T) {
	result := GetMetadataInformation("IN")
	assertINMetaData(t, result)
}

func TestNewCountryMetadata(t *testing.T) {
	locales := make(map[string]Locale)
	locales["en_IN"] = *NewLocale("English (India)")

	metadata := map[string]MetadataInformation{
		"IN": *NewMetadataInformation("IND", "AS", "Asia", "India", []string{"INR"}, "INR", "en_IN", "+91", "https://flagcdn.com/in.svg", locales, "356", "UN member state", "Asia/Kolkata", map[string]Timezone{"Asia/Kolkata": *NewTimezone("UTC +05:30")}),
	}
	countryMetadata := NewCountryMetadata(metadata)

	result := countryMetadata.MetadataInformation["IN"]
	assertINMetaData(t, result)
}

func assertINMetaData(t *testing.T, result MetadataInformation) {
	assert.Equal(t, "IND", result.Alpha3, "Alpha3 field mismatch")
	assert.Equal(t, "AS", result.ContinentCode, "ContinentCode field mismatch")
	assert.Equal(t, "Asia", result.ContinentName, "ContinentName field mismatch")
	assert.Equal(t, "356", result.NumericCode, "NumericCode field mismatch")
	assert.Equal(t, "https://flagcdn.com/in.svg", result.Flag, "Flag field mismatch")
	assert.Equal(t, "UN member state", result.Sovereignty, "Sovereignty field mismatch")
	assert.Equal(t, "+91", result.DialCode, "DialCode field mismatch")
	assert.NotNil(t, result.Timezones["Asia/Kolkata"], "TimezoneOfCapital field mismatch")
	assert.Equal(t, "en_IN", result.DefaultLocale, "DefaultLocale field mismatch")
	//assert.Equal(t, Locale{Code: "en_IN", Name: "English (India)"}, result.Locales[0], "Locale field mismatch")
	assert.Equal(t, []string{"INR"}, result.SupportedCurrency, "SupportedCurrency field mismatch")
	assert.Equal(t, Timezone{UTCOffset: "UTC +05:30"}, result.Timezones["Asia/Kolkata"], "Timezones field mismatch")
}

func TestGetCountryCodeISO2(t *testing.T) {
	testCases := []struct {
		name         string
		countryName  string
		expectedCode string
	}{
		{
			name:         "Valid country name - India",
			countryName:  "India",
			expectedCode: "IN",
		},
		{
			name:         "Valid country name with different case - india",
			countryName:  "india",
			expectedCode: "IN",
		},
		{
			name:         "Valid country name with spaces - United States",
			countryName:  "United States of America (the)",
			expectedCode: "US",
		},
		{
			name:         "Valid country name with leading/trailing spaces",
			countryName:  "  India  ",
			expectedCode: "IN",
		},
		{
			name:         "Non-existent country name",
			countryName:  "NonExistentCountry",
			expectedCode: "",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			result := GetCountryCodeISO2(tc.countryName)
			assert.Equal(t, tc.expectedCode, result, "Country code doesn't match expected value")
		})
	}
}
