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
			got, err := FormatNumber(tt.amount, tt.opts)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			require.NoError(t, err)
			assert.Equal(t, tt.expected, got)
		})
	}
}

// ---- FormatNumberByParts ----

func TestFormatNumberByParts_USD_enUS(t *testing.T) {
	result, err := FormatNumberByParts(12345.67, NumberFormatOptions{
		Currency: "USD",
		Locale:   "en-US",
	})
	require.NoError(t, err)

	assert.Equal(t, "$", result.Currency)
	assert.Equal(t, "12,345", result.Integer) // groups merged into integer
	assert.Equal(t, ".", result.Decimal)
	assert.Equal(t, "67", result.Fraction)
	assert.True(t, result.IsPrefixSymbol)
	assert.Equal(t, "currency", result.RawParts[0].Type)
	assert.Equal(t, "$", result.RawParts[0].Value)
}

func TestFormatNumberByParts_EUR_deDE(t *testing.T) {
	// de-DE: suffix symbol, period group sep, comma decimal sep.
	result, err := FormatNumberByParts(12345.67, NumberFormatOptions{
		Currency: "EUR",
		Locale:   "de-DE",
	})
	require.NoError(t, err)

	assert.Equal(t, "€", result.Currency)
	assert.Equal(t, "12.345", result.Integer) // "." group sep merged in
	assert.Equal(t, ",", result.Decimal)
	assert.Equal(t, "67", result.Fraction)
	assert.False(t, result.IsPrefixSymbol)

	// Currency part must be last in rawParts.
	last := result.RawParts[len(result.RawParts)-1]
	assert.Equal(t, "currency", last.Type)
	assert.Equal(t, "€", last.Value)
}

func TestFormatNumberByParts_Negative_Prefix(t *testing.T) {
	// Minus sign must precede the currency symbol for prefix locales.
	result, err := FormatNumberByParts(-500.0, NumberFormatOptions{
		Currency: "USD",
		Locale:   "en-US",
	})
	require.NoError(t, err)

	assert.Equal(t, "-", result.MinusSign)
	assert.True(t, result.IsPrefixSymbol)
	assert.Equal(t, "minusSign", result.RawParts[0].Type)
	assert.Equal(t, "currency", result.RawParts[1].Type)
}

func TestFormatNumberByParts_Negative_Suffix(t *testing.T) {
	// Minus sign must precede the number for suffix locales.
	result, err := FormatNumberByParts(-1234567.0, NumberFormatOptions{
		Currency: "EUR",
		Locale:   "de-DE",
	})
	require.NoError(t, err)

	assert.Equal(t, "-", result.MinusSign)
	assert.False(t, result.IsPrefixSymbol)
	assert.Equal(t, "minusSign", result.RawParts[0].Type)
	// Currency must still be last.
	last := result.RawParts[len(result.RawParts)-1]
	assert.Equal(t, "currency", last.Type)
}

func TestFormatNumberByParts_NoCurrency(t *testing.T) {
	result, err := FormatNumberByParts(123.45, NumberFormatOptions{
		Locale: "en-US",
	})
	require.NoError(t, err)

	assert.Equal(t, "123", result.Integer)
	assert.Equal(t, ".", result.Decimal)
	assert.Equal(t, "45", result.Fraction)
	assert.Empty(t, result.Currency)
	assert.True(t, result.IsPrefixSymbol) // JS default when no currency
}

func TestFormatNumberByParts_JPY_ZeroFraction(t *testing.T) {
	// JPY has minor_unit = 0 → no decimal/fraction parts.
	result, err := FormatNumberByParts(12346.0, NumberFormatOptions{
		Currency: "JPY",
		Locale:   "en-US",
	})
	require.NoError(t, err)

	assert.Empty(t, result.Decimal)
	assert.Empty(t, result.Fraction)
	assert.NotEmpty(t, result.Integer)
}

func TestFormatNumberByParts_InvalidAmount(t *testing.T) {
	_, err := FormatNumberByParts("not-a-number", NumberFormatOptions{
		Currency: "USD",
		Locale:   "en-US",
	})
	assert.Error(t, err)
}

func TestFormatNumberByParts_UnknownCurrency(t *testing.T) {
	// Unknown currency code: prefix, code-as-symbol, NBSP separator.
	result, err := FormatNumberByParts(12345.67, NumberFormatOptions{
		Currency: "XYZ",
		Locale:   "en-US",
	})
	require.NoError(t, err)

	assert.Equal(t, "XYZ", result.Currency)
	assert.True(t, result.IsPrefixSymbol)

	// rawParts[0] = currency, rawParts[1] = literal (space/nbsp)
	require.GreaterOrEqual(t, len(result.RawParts), 2)
	assert.Equal(t, "currency", result.RawParts[0].Type)
	assert.Equal(t, "literal", result.RawParts[1].Type)
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
			result, err := FormatNumber(1000.0, NumberFormatOptions{
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
