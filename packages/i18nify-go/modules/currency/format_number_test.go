package currency

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// intPtr is a helper to get a pointer to an int literal.
func intPtr(i int) *int { return &i }

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
			opts:     NumberFormatOptions{Currency: "USD", Locale: "en-US"},
			expected: "$1,000.50",
		},
		{
			name:     "negative USD",
			amount:   -500.0,
			opts:     NumberFormatOptions{Currency: "USD", Locale: "en-US"},
			expected: "-$500.00",
		},
		{
			name:     "zero USD",
			amount:   0,
			opts:     NumberFormatOptions{Currency: "USD", Locale: "en-US"},
			expected: "$0.00",
		},
		{
			name:     "plain decimal no currency",
			amount:   "750.75",
			opts:     NumberFormatOptions{Locale: "en-US"},
			expected: "750.75",
		},
		{
			name:     "large number plain decimal",
			amount:   12345.6789,
			opts:     NumberFormatOptions{Locale: "en-US"},
			expected: "12,345.679",
		},
		{
			name:     "JPY zero fraction digits",
			amount:   5000,
			opts:     NumberFormatOptions{Currency: "JPY", Locale: "en-US"},
			expected: "¥5,000", // JPY minor_unit = 0, canonical symbol = "¥"
		},
		{
			name:   "custom fraction digits override",
			amount: "42.12345",
			opts: NumberFormatOptions{
				Currency:              "USD",
				Locale:                "en-US",
				MaximumFractionDigits: intPtr(3),
			},
			expected: "$42.123",
		},
		{
			name:   "disable grouping",
			amount: 1234567.89,
			opts: NumberFormatOptions{
				Locale:      "en-US",
				UseGrouping: boolPtr(false),
			},
			expected: "1234567.89",
		},
		{
			// EUR in de-DE is suffix with NBSP separator between number and symbol.
			name:     "EUR suffix locale (de-DE)",
			amount:   1234.56,
			opts:     NumberFormatOptions{Currency: "EUR", Locale: "de-DE"},
			expected: "1.234,56 €",
		},
		{
			name:    "invalid string amount",
			amount:  "not-a-number",
			opts:    NumberFormatOptions{Currency: "USD", Locale: "en-US"},
			wantErr: true,
		},
		{
			name:    "string with commas (not parseable)",
			amount:  "1,234",
			opts:    NumberFormatOptions{Locale: "en-US"},
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
		locale   string
	}{
		{"SGD", "en-SG"},
		{"AUD", "en-AU"},
		{"HKD", "en-HK"},
		{"CAD", "en-CA"},
	}

	for _, tc := range cases {
		t.Run(tc.currency, func(t *testing.T) {
			result, err := cachedCurrencyData.FormatNumber(1000.0, NumberFormatOptions{
				Currency: tc.currency,
				Locale:   tc.locale,
			})
			require.NoError(t, err)

			sym, symErr := GetCurrencySymbol(tc.currency)
			require.NoError(t, symErr)
			assert.Contains(t, result, sym,
				"formatted string should contain canonical symbol %q for %s", sym, tc.currency)
		})
	}
}
