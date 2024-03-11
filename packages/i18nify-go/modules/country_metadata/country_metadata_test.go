package country_metadata

import (
	_ "encoding/json"
	"errors"
	"github.com/stretchr/testify/assert"
	"io/ioutil"
	"testing"
)

func TestUnmarshalCountryMetadata(t *testing.T) {
	jsonData, err := ioutil.ReadFile("data.json")
	countryMetadata, err := UnmarshalCountryMetadata(jsonData)

	assert.NoError(t, err, "Unexpected error during unmarshal")

	result := countryMetadata.MetadataInformation["IN"]
	assertINMetaData(t, result)
}

func TestMarshalCountryMetadata(t *testing.T) {
	expectedJSON := `{"metadata_information":{"IN":{"country_name":"India","continent_code":"AS","continent_name":"Asia","alpha_3":"IND","numeric_code":"356","flag":"https://flagcdn.com/in.svg","sovereignty":"UN member state","dial_code":"+91","currency":["INR"],"timezones":{"Asia/Kolkata":{"utc_offset":"UTC +05:30"}},"timezone_of_capital":"Asia/Kolkata","locales":[{"code":"en_IN","name":"English (India)"},{"code":"hi","name":"Hindi"}],"default_locale":"en_IN"}}}`
	locale1 := NewLocale("en_IN", "English (India)")
	locale2 := NewLocale("hi", "Hindi")
	countryMetadata := NewCountryMetadata(map[string]MetadataInformation{
		"IN": *NewMetadataInformation("IND", "AS", "Asia", "India", []string{"INR"}, "en_IN", "+91", "https://flagcdn.com/in.svg", []Locale{*locale1, *locale2}, "356", "UN member state", "Asia/Kolkata", map[string]Timezone{"Asia/Kolkata": *NewTimezone("UTC +05:30")}),
	})
	marshaledJSON, err := countryMetadata.Marshal()
	assert.NoError(t, err)

	assert.JSONEq(t, expectedJSON, string(marshaledJSON))
}

var readFileFunc = ioutil.ReadFile

func TestGetMetadataInformation(t *testing.T) {
	jsonData, err := ioutil.ReadFile("data.json")

	// Mock implementation of ioutil.ReadFile
	readFileFunc = func(filename string) ([]byte, error) {
		return jsonData, errors.New("error reading JSON file")
	}
	defer func() {
		// Restore the original implementation after the test
		readFileFunc = ioutil.ReadFile
	}()

	_, err = readFileFunc(DataFile)
	if err != nil {
		return
	}

	result := GetMetadataInformation("IN")
	assertINMetaData(t, result)
}

func TestNewCountryMetadata(t *testing.T) {
	locale1 := NewLocale("en_IN", "English (India)")
	metadata := map[string]MetadataInformation{
		"IN": *NewMetadataInformation("IND", "AS", "Asia", "India", []string{"INR"}, "en_IN", "+91", "https://flagcdn.com/in.svg", []Locale{*locale1}, "356", "UN member state", "Asia/Kolkata", map[string]Timezone{"Asia/Kolkata": *NewTimezone("UTC +05:30")}),
	}
	countryMetadata := NewCountryMetadata(metadata)

	result := countryMetadata.MetadataInformation["IN"]
	assertINMetaData(t, result)
}

func assertINMetaData(t *testing.T, result MetadataInformation) {
	assert.Equal(t, "IND", result.GetAlpha3(), "Alpha3 field mismatch")
	assert.Equal(t, "AS", result.GetContinentCode(), "ContinentCode field mismatch")
	assert.Equal(t, "Asia", result.GetContinentName(), "ContinentName field mismatch")
	assert.Equal(t, "356", result.GetNumericCode(), "NumericCode field mismatch")
	assert.Equal(t, "https://flagcdn.com/in.svg", result.GetFlag(), "Flag field mismatch")
	assert.Equal(t, "UN member state", result.GetSovereignty(), "Sovereignty field mismatch")
	assert.Equal(t, "+91", result.GetDialCode(), "DialCode field mismatch")
	assert.Equal(t, "Asia/Kolkata", result.GetTimezoneOfCapital(), "TimezoneOfCapital field mismatch")
	assert.Equal(t, "en_IN", result.GetDefaultLocale(), "DefaultLocale field mismatch")
	assert.Equal(t, Locale{Code: "en_IN", Name: "English (India)"}, result.GetLocales()[0], "Locale field mismatch")
	assert.Equal(t, []string{"INR"}, result.GetCurrency(), "Currency field mismatch")
	assert.Equal(t, Timezone{UTCOffset: "UTC +05:30"}, result.GetTimezones()["Asia/Kolkata"], "Timezones field mismatch")
}
