package currency

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// boolPtr is a helper to get a pointer to a bool literal.
func boolPtr(b bool) *bool { return &b }

// ---- FormatNumber ----

func TestFormatNumber(t *testing.T) {
	tests := []struct {
		name     string
		amount   interface{}
		opts     NumberFormatOptions
		expected string
		wantErr  bool
	}{
		{
			name:     "USD prefix symbol with grouping",
			amount:   1000.5,
			opts:     NumberFormatOptions{Currency: "USD"},
			expected: "$1,000.50",
		},
		{
			name:     "negative USD",
			amount:   -500.0,
			opts:     NumberFormatOptions{Currency: "USD"},
			expected: "-$500.00",
		},
		{
			name:     "zero USD",
			amount:   0,
			opts:     NumberFormatOptions{Currency: "USD"},
			expected: "$0.00",
		},
		{
			name:     "plain decimal no currency",
			amount:   "750.75",
			opts:     NumberFormatOptions{},
			expected: "750.75",
		},
		{
			name:     "large number plain decimal",
			amount:   12345.6789,
			opts:     NumberFormatOptions{},
			expected: "12,345.679",
		},
		{
			name:     "JPY zero fraction digits",
			amount:   5000,
			opts:     NumberFormatOptions{Currency: "JPY"},
			expected: "¥5,000", // JPY minor_unit = 0, canonical symbol = "¥"
		},
		{
			name:   "disable grouping",
			amount: 1234567.89,
			opts: NumberFormatOptions{
				UseGrouping: boolPtr(false),
			},
			expected: "1234567.89",
		},
		{
			name:     "EUR prefix symbol",
			amount:   1234.56,
			opts:     NumberFormatOptions{Currency: "EUR"},
			expected: "€1,234.56",
		},
		{
			name:    "invalid string amount",
			amount:  "not-a-number",
			opts:    NumberFormatOptions{Currency: "USD"},
			wantErr: true,
		},
		{
			name:    "string with commas (not parseable)",
			amount:  "1,234",
			opts:    NumberFormatOptions{},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := cachedCurrencyData.FormatNumber(tt.amount, tt.opts)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			require.NoError(t, err)
			assert.Equal(t, tt.expected, got)
		})
	}
}

// TestFormatNumber_IntlMappedCurrencies verifies that INTL_MAPPING currencies emit
// canonical i18nify symbols (not the generic $ that Intl/x/text may return).
func TestFormatNumber_IntlMappedCurrencies(t *testing.T) {
	cases := []struct {
		currency string
	}{
		{"SGD"},
		{"AUD"},
		{"HKD"},
		{"CAD"},
	}

	for _, tc := range cases {
		t.Run(tc.currency, func(t *testing.T) {
			result, err := cachedCurrencyData.FormatNumber(1000.0, NumberFormatOptions{
				Currency: tc.currency,
			})
			require.NoError(t, err)

			sym, symErr := GetCurrencySymbol(tc.currency)
			require.NoError(t, symErr)
			assert.Contains(t, result, sym,
				"formatted string should contain canonical symbol %q for %s", sym, tc.currency)
		})
	}
}
