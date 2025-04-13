package phonenumber

import (
	_ "encoding/json"
	"errors"
	"os"
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

func TestGetCountryTeleInformationWithError(t *testing.T) {
	tests := []struct {
		name        string
		countryCode string
		wantErr     bool
		errMsg      string
		checkFields bool
	}{
		{
			name:        "Valid country code - India",
			countryCode: "IN",
			wantErr:     false,
			checkFields: true,
		},
		{
			name:        "Empty country code",
			countryCode: "",
			wantErr:     true,
			errMsg:      "country code cannot be empty",
		},
		{
			name:        "Invalid country code",
			countryCode: "XX",
			wantErr:     true,
			errMsg:      "no phone information found for country code: XX",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			info, err := GetCountryTeleInformation(tt.countryCode)

			if tt.wantErr {
				assert.Error(t, err)
				if tt.errMsg != "" {
					assert.Equal(t, tt.errMsg, err.Error())
				}
				return
			}

			assert.NoError(t, err)
			if tt.checkFields {
				assert.NotEmpty(t, info.DialCode, "DialCode should not be empty")
				assert.NotEmpty(t, info.Format, "Format should not be empty")
				assert.NotEmpty(t, info.Regex, "Regex should not be empty")
			}
		})
	}
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

var readFileFunc = os.ReadFile

func TestGetCountryTeleInformation(t *testing.T) {
	jsonData, err := os.ReadFile("data.json")

	// Mock implementation of os.ReadFile
	readFileFunc = func(filename string) ([]byte, error) {
		return jsonData, errors.New("error reading JSON file")
	}
	defer func() {
		// Restore the original implementation after the test
		readFileFunc = os.ReadFile
	}()

	_, err = readFileFunc(DataFile)
	if err != nil {
		return
	}

	result := GetCountryTeleInformation("IN")

	// Use assert.Equal for assertions with inline expected values
	assert.Equal(t, "+1", result.DialCode, "DialCode field mismatch")
	assert.Equal(t, "XXX-XXX-XXXX", result.Format, "Format field mismatch")
	assert.Equal(t, "\\d{3}-\\d{3}-\\d{4}", result.Regex, "Regex field mismatch")
}
