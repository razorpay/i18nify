package geo

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetCurrencyByCountry_KnownCodes(t *testing.T) {
	tests := []struct {
		cc   string
		want string
	}{
		{"IN", "INR"},
		{"US", "USD"},
		{"DE", "EUR"},
		{"JP", "JPY"},
		{"GB", "GBP"},
		{"SG", "SGD"},
		{"MY", "MYR"},
		{"AU", "AUD"},
	}
	for _, tt := range tests {
		t.Run(tt.cc, func(t *testing.T) {
			got, err := GetCurrencyByCountry(tt.cc)
			assert.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestGetCurrencyByCountry_LowercaseInput(t *testing.T) {
	got, err := GetCurrencyByCountry("in")
	assert.NoError(t, err)
	assert.Equal(t, "INR", got)
}

func TestGetCurrencyByCountry_MixedCaseInput(t *testing.T) {
	got, err := GetCurrencyByCountry("Us")
	assert.NoError(t, err)
	assert.Equal(t, "USD", got)
}

func TestGetCurrencyByCountry_WithWhitespace(t *testing.T) {
	got, err := GetCurrencyByCountry("  DE  ")
	assert.NoError(t, err)
	assert.Equal(t, "EUR", got)
}

func TestGetCurrencyByCountry_InvalidCode(t *testing.T) {
	_, err := GetCurrencyByCountry("XX")
	assert.Error(t, err)
	assert.True(t, strings.Contains(err.Error(), "invalid"))
}

func TestGetCurrencyByCountry_EmptyCode(t *testing.T) {
	_, err := GetCurrencyByCountry("")
	assert.Error(t, err)
	assert.True(t, strings.Contains(err.Error(), "required"))
}
