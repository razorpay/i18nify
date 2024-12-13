package currency

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestConvertCurrency(t *testing.T) {
	tests := []struct {
		name               string
		currencyCode       string
		amount             interface{}
		minorExpectedValue float64
		majorExpectedValue float64
		expectedError      string
	}{
		{
			name:               "Valid USD Conversion",
			currencyCode:       "USD",
			amount:             1234.0,
			minorExpectedValue: 123400,
			majorExpectedValue: 12.34,
			expectedError:      "",
		},
		{
			name:               "Valid EUR Conversion",
			currencyCode:       "EUR",
			amount:             4568,
			minorExpectedValue: 456800,
			majorExpectedValue: 45.68,
			expectedError:      "",
		},
		{
			name:               "Valid GBP Conversion",
			currencyCode:       "GBP",
			amount:             100.0,
			minorExpectedValue: 10000.00,
			majorExpectedValue: 1.00,
			expectedError:      "",
		},
		{
			name:               "Valid Bahraini Dinar Conversion",
			currencyCode:       "BHD",
			amount:             1000.0,
			minorExpectedValue: 1000000.00,
			majorExpectedValue: 1.00,
			expectedError:      "",
		},
		{
			name:               "Valid Iraqi Dinar Conversion",
			currencyCode:       "IQD",
			amount:             1000.0,
			minorExpectedValue: 1000000.00,
			majorExpectedValue: 1.00,
			expectedError:      "",
		},
		{
			name:               "Valid Unidad Previsional Conversion",
			currencyCode:       "UYW",
			amount:             10000.0,
			minorExpectedValue: 100000000.00,
			majorExpectedValue: 1.00,
			expectedError:      "",
		},
		{
			name:               "Invalid Currency Code",
			currencyCode:       "INR0",
			amount:             100.0,
			minorExpectedValue: 0,
			majorExpectedValue: 0,
			expectedError:      "currency code 'INR0' not found",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Call both functions and capture errors
			majorActualValue, majorError := ConvertToMajorUnit(tt.currencyCode, tt.amount)
			minorActualValue, minorError := ConvertToMinorUnit(tt.currencyCode, tt.amount)

			// Compare the result values
			assert.InDelta(t, tt.majorExpectedValue, majorActualValue, 0.001, "unexpected major unit conversion")
			assert.InDelta(t, tt.minorExpectedValue, minorActualValue, 0.001, "unexpected minor unit conversion")

			// Check for errors
			if tt.expectedError != "" {
				// Ensure both major and minor conversions return the same error
				assert.Error(t, majorError)
				assert.Error(t, minorError)
				assert.EqualError(t, majorError, tt.expectedError)
				assert.EqualError(t, minorError, tt.expectedError)
			} else {
				// Ensure no errors are returned
				assert.NoError(t, majorError)
				assert.NoError(t, minorError)
			}
		})
	}
}
