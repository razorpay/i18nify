package geo

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestDetectLocale_CountryCode(t *testing.T) {
	tests := []struct {
		cc   string
		want string
	}{
		{"IN", "en_IN"},
		{"US", "en_US"},
		{"DE", "de"},
		{"JP", "ja"},
	}
	for _, tt := range tests {
		t.Run(tt.cc, func(t *testing.T) {
			got, err := DetectLocale(DetectLocaleOptions{CountryCode: tt.cc})
			assert.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestDetectLocale_CountryCode_Lowercase(t *testing.T) {
	got, err := DetectLocale(DetectLocaleOptions{CountryCode: "in"})
	assert.NoError(t, err)
	assert.Equal(t, "en_IN", got)
}

func TestDetectLocale_AcceptLanguage(t *testing.T) {
	tests := []struct {
		name   string
		header string
		want   string
	}{
		{"single locale", "de-DE", "de-DE"},
		{"multi locale picks highest q", "en-US,en;q=0.9,fr;q=0.8", "en-US"},
		{"no q-value defaults to 1.0", "ja,en;q=0.5", "ja"},
		{"wildcard ignored", "*,en;q=0.5", "en"},
		{"q-value ordering", "fr;q=0.7,de;q=0.9,en;q=0.5", "de"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := DetectLocale(DetectLocaleOptions{AcceptLanguage: tt.header})
			assert.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestDetectLocale_BrowserLocale(t *testing.T) {
	got, err := DetectLocale(DetectLocaleOptions{BrowserLocale: "fr-FR"})
	assert.NoError(t, err)
	assert.Equal(t, "fr-FR", got)
}

func TestDetectLocale_BrowserLocale_TrimSpace(t *testing.T) {
	got, err := DetectLocale(DetectLocaleOptions{BrowserLocale: "  en-GB  "})
	assert.NoError(t, err)
	assert.Equal(t, "en-GB", got)
}

func TestDetectLocale_Currency(t *testing.T) {
	tests := []struct {
		currency string
		want     string
	}{
		{"INR", "en_IN"},
		{"USD", "en_US"},
		{"JPY", "ja"},
	}
	for _, tt := range tests {
		t.Run(tt.currency, func(t *testing.T) {
			got, err := DetectLocale(DetectLocaleOptions{Currency: tt.currency})
			assert.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestDetectLocale_Currency_CaseInsensitive(t *testing.T) {
	got, err := DetectLocale(DetectLocaleOptions{Currency: "inr"})
	assert.NoError(t, err)
	assert.Equal(t, "en_IN", got)
}

func TestDetectLocale_Priority_CountryOverAcceptLanguage(t *testing.T) {
	got, err := DetectLocale(DetectLocaleOptions{
		CountryCode:    "JP",
		AcceptLanguage: "en-US",
	})
	assert.NoError(t, err)
	assert.Equal(t, "ja", got)
}

func TestDetectLocale_Priority_AcceptLanguageFallback(t *testing.T) {
	// Unknown country code → falls back to AcceptLanguage
	got, err := DetectLocale(DetectLocaleOptions{
		CountryCode:    "XX",
		AcceptLanguage: "en-US",
	})
	assert.NoError(t, err)
	assert.Equal(t, "en-US", got)
}

func TestDetectLocale_NoSignals_Error(t *testing.T) {
	_, err := DetectLocale(DetectLocaleOptions{})
	assert.Error(t, err)
	assert.True(t, strings.Contains(err.Error(), "at least one detection signal"))
}

func TestDetectLocale_UnknownCurrency_Error(t *testing.T) {
	_, err := DetectLocale(DetectLocaleOptions{Currency: "UNKNOWN"})
	assert.Error(t, err)
	assert.True(t, strings.Contains(err.Error(), "could not determine"))
}
