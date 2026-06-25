package currency

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestConvertStringToMinorUnit(t *testing.T) {
	tests := []struct {
		name          string
		currency      string
		amount        string
		expected      int64
		expectedError string
	}{
		// Plain decimal strings
		{"USD plain", "USD", "10.50", 1050, ""},
		{"USD integer", "USD", "100", 10000, ""},
		{"USD small", "USD", "0.01", 1, ""},
		// US format with thousands separator
		{"USD thousands", "USD", "1,234.56", 123456, ""},
		{"USD large", "USD", "1,000,000.00", 100000000, ""},
		// Symbol-prefixed strings
		{"USD with symbol", "USD", "$10.50", 1050, ""},
		{"INR with symbol", "INR", "₹4.14", 414, ""},
		{"GBP with symbol", "GBP", "£10.50", 1050, ""},
		// European format (comma as decimal separator)
		{"EUR European decimal", "EUR", "10,50", 1050, ""},
		{"EUR European thousands", "EUR", "1.234,56", 123456, ""},
		{"EUR with symbol", "EUR", "€10,50", 1050, ""},
		// Currencies with 0 minor units
		{"JPY no minor unit", "JPY", "1234", 1234, ""},
		{"JPY with symbol", "JPY", "¥1,234", 1234, ""},
		// Currencies with 3 minor units (BHD — Bahraini Dinar)
		{"BHD three minor units", "BHD", "10.500", 10500, ""},
		{"BHD small", "BHD", "1.234", 1234, ""},
		// Error cases
		{"Invalid currency code", "XXX", "10.50", 0, "currency code 'XXX' not found"},
		{"Non-numeric string", "USD", "abc", 0, "invalid amount string"},
		{"Empty string", "USD", "", 0, "invalid amount string"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := ConvertStringToMinorUnit(tt.currency, tt.amount)
			if tt.expectedError != "" {
				assert.Error(t, err)
				assert.Contains(t, err.Error(), tt.expectedError)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tt.expected, result)
			}
		})
	}
}
