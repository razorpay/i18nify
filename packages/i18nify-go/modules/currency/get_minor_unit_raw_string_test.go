package currency

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetMinorUnitRawString(t *testing.T) {
	tests := []struct {
		name          string
		currencyCode  string
		amount        interface{}
		expected      string
		expectedError string
	}{
		{
			name:         "USD 100 → 10000",
			currencyCode: "USD",
			amount:       100.0,
			expected:     "10000",
		},
		{
			name:         "USD 1 → 100",
			currencyCode: "USD",
			amount:       1.0,
			expected:     "100",
		},
		{
			name:         "INR 4.14 → 414",
			currencyCode: "INR",
			amount:       4.14,
			expected:     "414",
		},
		{
			name:         "GBP 1 → 100",
			currencyCode: "GBP",
			amount:       1.0,
			expected:     "100",
		},
		{
			name:         "integer amount accepted",
			currencyCode: "USD",
			amount:       50,
			expected:     "5000",
		},
		{
			name:         "string amount accepted",
			currencyCode: "USD",
			amount:       "2.00",
			expected:     "200",
		},
		{
			name:          "unsupported currency code",
			currencyCode:  "XXX",
			amount:        100.0,
			expectedError: "currency code 'XXX' not found",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := GetMinorUnitRawString(tt.currencyCode, tt.amount)
			if tt.expectedError != "" {
				assert.EqualError(t, err, tt.expectedError)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tt.expected, result)
			}
		})
	}
}
