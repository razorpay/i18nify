package postal_code

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetPostalCodeFormat_KnownCodes(t *testing.T) {
	tests := []struct {
		cc          string
		countryName string
		format      PostalCodeFormat
		zipRegex    string
		examples    []string
	}{
		{"IN", "India", FormatNumeric, "\\d{6}", []string{"110034", "110001"}},
		{"US", "United States", FormatNumeric, "(\\d{5})(?:[ \\-](\\d{4}))?", []string{"95014", "22162-1010"}},
		{"HK", "Hong Kong", FormatNone, "", []string{}},
	}

	for _, tt := range tests {
		t.Run(tt.cc, func(t *testing.T) {
			got, err := GetPostalCodeFormat(tt.cc)
			assert.NoError(t, err)
			assert.Equal(t, tt.countryName, got.CountryName)
			assert.Equal(t, tt.format, got.Format)
			assert.Equal(t, tt.zipRegex, got.ZipRegex)
			assert.Equal(t, tt.examples, got.Examples)
		})
	}
}

func TestGetPostalCodeFormat_LowercaseInput(t *testing.T) {
	got, err := GetPostalCodeFormat("in")
	assert.NoError(t, err)
	assert.Equal(t, "India", got.CountryName)
	assert.Equal(t, FormatNumeric, got.Format)
}

func TestGetPostalCodeFormat_WithWhitespace(t *testing.T) {
	got, err := GetPostalCodeFormat("  HK  ")
	assert.NoError(t, err)
	assert.Equal(t, "Hong Kong", got.CountryName)
	assert.Equal(t, FormatNone, got.Format)
}

func TestGetPostalCodeFormat_InvalidCode(t *testing.T) {
	_, err := GetPostalCodeFormat("XX")
	assert.Error(t, err)
	assert.True(t, strings.Contains(err.Error(), "no postal code data"))
}

func TestGetPostalCodeFormat_EmptyCode(t *testing.T) {
	_, err := GetPostalCodeFormat("")
	assert.Error(t, err)
	assert.True(t, strings.Contains(err.Error(), "non-empty string"))
}
