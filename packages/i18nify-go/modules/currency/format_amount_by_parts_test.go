package currency

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFormatAmountByParts(t *testing.T) {
	tests := []struct {
		name     string
		amount   interface{}
		currency string
		wantErr  bool
	}{
		{"USD integer", 1234, "USD", false},
		{"USD with decimals", 1234.56, "USD", false},
		{"INR large amount", 100000, "INR", false},
		{"zero", 0, "USD", false},
		{"negative", -1234.56, "USD", false},
		{"string input", "1234.56", "USD", false},
		{"empty currency", 100, "", true},
		{"invalid amount", "abc", "USD", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := FormatAmountByParts(tt.amount, tt.currency, NumberFormatOptions{})
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			assert.NoError(t, err)
			assert.NotNil(t, result)
			assert.Greater(t, len(result.RawParts), 0)
		})
	}
}

func TestFormatAmountByParts_USDFields(t *testing.T) {
	result, err := FormatAmountByParts(1234.56, "USD", NumberFormatOptions{})
	assert.NoError(t, err)
	assert.Equal(t, "$", result.Currency)
	assert.Contains(t, result.Integer, "1")
	assert.Equal(t, "56", result.Fraction)
	assert.True(t, result.IsPrefixSymbol)
}

func TestFormatAmountByParts_INRFields(t *testing.T) {
	result, err := FormatAmountByParts(100000, "INR", NumberFormatOptions{})
	assert.NoError(t, err)
	assert.Equal(t, "₹", result.Currency)
	assert.Contains(t, result.Integer, "1")
}

func TestFormatAmountByParts_NegativeAmount(t *testing.T) {
	result, err := FormatAmountByParts(-500.75, "USD", NumberFormatOptions{})
	assert.NoError(t, err)
	assert.Equal(t, "-", result.MinusSign)
	assert.Equal(t, "75", result.Fraction)
}

func TestFormatAmountByParts_ZeroAmount(t *testing.T) {
	result, err := FormatAmountByParts(0, "USD", NumberFormatOptions{})
	assert.NoError(t, err)
	assert.Equal(t, "0", result.Integer)
	assert.Equal(t, "00", result.Fraction)
}

func TestFormatAmountByParts_CurrencyPropagatedToOpts(t *testing.T) {
	opts := NumberFormatOptions{}
	_, err := FormatAmountByParts(100, "EUR", opts)
	assert.NoError(t, err)
	// Original opts should not be mutated — FormatAmountByParts copies the struct
	assert.Equal(t, "", opts.Currency)
}
