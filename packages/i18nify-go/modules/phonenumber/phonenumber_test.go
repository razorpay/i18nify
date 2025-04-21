package phonenumber

import (
	_ "encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestUnmarshalPhoneNumber(t *testing.T) {
	jsonData, err := teleJsonDir.ReadFile(DataFile)
	assert.NoError(t, err, "Failed to read test data file")

	result, err := UnmarshalPhoneNumber(jsonData)
	assert.NoError(t, err, "Unexpected error during unmarshal")

	information := result.CountryTeleInformation["IN"]
	assert.Equal(t, "+91", information.DialCode, "DialCode field mismatch")
	assert.Equal(t, "xxxx xxxxxx", information.Format, "Format field mismatch")
	assert.NotEmpty(t, information.Regex, "Regex field should not be empty")
}

func TestGetCountryTeleInformation(t *testing.T) {
	// Test with valid country code
	info := GetCountryTeleInformation("IN")
	assert.NotEmpty(t, info.DialCode, "DialCode should not be empty")
	assert.NotEmpty(t, info.Format, "Format should not be empty")
	assert.NotEmpty(t, info.Regex, "Regex should not be empty")

	// Test with empty country code
	emptyInfo := GetCountryTeleInformation("")
	assert.Empty(t, emptyInfo.DialCode, "DialCode should be empty for empty country code")
	assert.Empty(t, emptyInfo.Format, "Format should be empty for empty country code")
	assert.Empty(t, emptyInfo.Regex, "Regex should be empty for empty country code")

	// Test with invalid country code
	invalidInfo := GetCountryTeleInformation("XX")
	assert.Empty(t, invalidInfo.DialCode, "DialCode should be empty for invalid country code")
	assert.Empty(t, invalidInfo.Format, "Format should be empty for invalid country code")
	assert.Empty(t, invalidInfo.Regex, "Regex should be empty for invalid country code")
}

func TestMarshalPhoneNumber(t *testing.T) {
	phoneNumber := NewPhoneNumber(map[string]CountryTeleInformation{
		"IN": {
			DialCode: "+91",
			Format:   "xxxx xxxxxx",
			Regex:    "^[6-9]\\d{9}$",
		},
	})

	marshaledJSON, err := phoneNumber.Marshal()
	assert.NoError(t, err)
	assert.Contains(t, string(marshaledJSON), `"dial_code":"+91"`)
	assert.Contains(t, string(marshaledJSON), `"format":"xxxx xxxxxx"`)
}
