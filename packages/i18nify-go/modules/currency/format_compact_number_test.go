package currency

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFormatCompactNumber(t *testing.T) {
	tests := []struct {
		name    string
		amount  interface{}
		want    string
		wantErr bool
	}{
		// Crore
		{"1 Crore", 10_000_000, "1 Cr", false},
		{"1.5 Crore", 15_000_000, "1.5 Cr", false},
		{"1.53 Crore", 15_300_000, "1.53 Cr", false},
		{"100 Crore", 1_000_000_000, "100 Cr", false},

		// Lakh
		{"1 Lakh", 100_000, "1 L", false},
		{"5.5 Lakh", 550_000, "5.5 L", false},
		{"75 Lakh", 7_500_000, "75 L", false},
		{"99.99 Lakh", 9_999_000, "99.99 L", false},

		// Negatives
		{"-1 Crore", -10_000_000, "-1 Cr", false},
		{"-5 Lakh", -500_000, "-5 L", false},

		// String input
		{"string 10000000", "10000000", "1 Cr", false},

		// Invalid
		{"invalid string", "abc", "", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := FormatCompactNumber(tt.amount, NumberFormatOptions{})
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			assert.NoError(t, err)
			assert.Equal(t, tt.want, result)
		})
	}
}

func TestFormatCompactNumber_BelowLakh(t *testing.T) {
	result, err := FormatCompactNumber(50_000, NumberFormatOptions{})
	assert.NoError(t, err)
	assert.NotContains(t, result, "Cr")
	assert.NotContains(t, result, " L")
}

func TestFormatCompactNumber_Zero(t *testing.T) {
	result, err := FormatCompactNumber(0, NumberFormatOptions{})
	assert.NoError(t, err)
	assert.Equal(t, "0", result)
}
