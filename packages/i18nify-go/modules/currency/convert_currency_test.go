package currency

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestConvertCurrencyFx(t *testing.T) {
	tests := []struct {
		name         string
		amount       float64
		fromCurrency string
		toCurrency   string
		exchangeRate float64
		want         float64
		wantErr      bool
		errContains  string
	}{
		{
			name:         "USD to JPY rounds to 0 decimal places",
			amount:       100,
			fromCurrency: "USD",
			toCurrency:   "JPY",
			exchangeRate: 149.5,
			want:         14950,
		},
		{
			name:         "USD to KWD rounds to 3 decimal places",
			amount:       100,
			fromCurrency: "USD",
			toCurrency:   "KWD",
			exchangeRate: 0.307,
			want:         30.7,
		},
		{
			name:         "JPY to USD rounds to 2 decimal places",
			amount:       1000,
			fromCurrency: "JPY",
			toCurrency:   "USD",
			exchangeRate: 0.0067,
			want:         6.7,
		},
		{
			name:         "USD to INR standard 2dp",
			amount:       1,
			fromCurrency: "USD",
			toCurrency:   "INR",
			exchangeRate: 83.5,
			want:         83.5,
		},
		{
			name:         "same currency rate 1 returns original amount",
			amount:       99.99,
			fromCurrency: "EUR",
			toCurrency:   "EUR",
			exchangeRate: 1,
			want:         99.99,
		},
		{
			name:         "zero amount returns zero",
			amount:       0,
			fromCurrency: "USD",
			toCurrency:   "EUR",
			exchangeRate: 0.92,
			want:         0,
		},
		{
			name:         "KWD result preserves 3 decimal places",
			amount:       1,
			fromCurrency: "USD",
			toCurrency:   "KWD",
			exchangeRate: 0.3071,
			want:         0.307,
		},
		{
			name:         "empty fromCurrency returns error",
			fromCurrency: "",
			toCurrency:   "USD",
			exchangeRate: 1,
			wantErr:      true,
			errContains:  "fromCurrency",
		},
		{
			name:         "empty toCurrency returns error",
			fromCurrency: "USD",
			toCurrency:   "",
			exchangeRate: 1,
			wantErr:      true,
			errContains:  "toCurrency",
		},
		{
			name:         "invalid fromCurrency returns error",
			fromCurrency: "INVALID",
			toCurrency:   "USD",
			exchangeRate: 1,
			wantErr:      true,
			errContains:  "fromCurrency",
		},
		{
			name:         "invalid toCurrency returns error",
			fromCurrency: "USD",
			toCurrency:   "INVALID",
			exchangeRate: 1,
			wantErr:      true,
			errContains:  "toCurrency",
		},
		{
			name:         "negative exchange rate returns error",
			fromCurrency: "USD",
			toCurrency:   "EUR",
			exchangeRate: -0.92,
			wantErr:      true,
			errContains:  "positive",
		},
		{
			name:         "zero exchange rate returns error",
			fromCurrency: "USD",
			toCurrency:   "EUR",
			exchangeRate: 0,
			wantErr:      true,
			errContains:  "positive",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := ConvertCurrency(tt.amount, tt.fromCurrency, tt.toCurrency, tt.exchangeRate)
			if tt.wantErr {
				assert.Error(t, err)
				if tt.errContains != "" {
					assert.Contains(t, err.Error(), tt.errContains)
				}
				return
			}
			assert.NoError(t, err)
			assert.InDelta(t, tt.want, got, 0.0001)
		})
	}
}
