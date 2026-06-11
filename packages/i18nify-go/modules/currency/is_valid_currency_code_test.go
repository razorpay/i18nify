package currency

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestIsValidCurrencyCode_Valid(t *testing.T) {
	valid := []string{"USD", "EUR", "INR", "GBP", "JPY", "AUD", "CAD", "CHF", "BHD", "KWD", "KRW"}
	for _, code := range valid {
		t.Run(code, func(t *testing.T) {
			assert.True(t, IsValidCurrencyCode(code), "expected valid: %s", code)
		})
	}
}

func TestIsValidCurrencyCode_Invalid(t *testing.T) {
	invalid := []string{"INVALID", "XYZ", "US", "usd", "xxx", "XXX"}
	for _, code := range invalid {
		t.Run(code, func(t *testing.T) {
			assert.False(t, IsValidCurrencyCode(code), "expected invalid: %s", code)
		})
	}
}

func TestIsValidCurrencyCode_Empty(t *testing.T) {
	assert.False(t, IsValidCurrencyCode(""))
}

func TestIsValidCurrencyCode_CaseSensitive(t *testing.T) {
	assert.False(t, IsValidCurrencyCode("usd"), "lowercase should be rejected")
	assert.False(t, IsValidCurrencyCode("Usd"), "mixed-case should be rejected")
	assert.True(t, IsValidCurrencyCode("USD"), "uppercase should be accepted")
}
