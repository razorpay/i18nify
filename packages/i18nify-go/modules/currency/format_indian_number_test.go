package currency

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFormatIndianNumber(t *testing.T) {
	tests := []struct {
		name    string
		amount  interface{}
		want    string
		wantErr bool
	}{
		{"1 lakh", 100000, "1,00,000", false},
		{"10 lakhs", 1000000, "10,00,000", false},
		{"1 crore", 10000000, "1,00,00,000", false},
		{"below 1000", 999, "999", false},
		{"1000", 1000, "1,000", false},
		{"10000", 10000, "10,000", false},
		{"12,34,567", 1234567, "12,34,567", false},
		{"zero", 0, "0", false},
		{"negative 10 lakhs", -1000000, "-10,00,000", false},
		{"string input", "100000", "1,00,000", false},
		{"invalid string", "abc", "", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := FormatIndianNumber(tt.amount, NumberFormatOptions{})
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			assert.NoError(t, err)
			assert.Equal(t, tt.want, result)
		})
	}
}

func TestFormatIndianNumber_WithCurrency(t *testing.T) {
	result, err := FormatIndianNumber(100000, NumberFormatOptions{Currency: "INR"})
	assert.NoError(t, err)
	assert.Contains(t, result, "1,00,000")
	assert.Contains(t, result, "₹")
}
