package currency

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// ---- FormatNumberByParts ----

func TestFormatNumberByParts_USD_enUS(t *testing.T) {
	result, err := cachedCurrencyData.FormatNumberByParts(12345.67, NumberFormatOptions{
		Currency: "USD",
		Locale:   "en-US",
	})
	require.NoError(t, err)

	assert.Equal(t, "$", result.Currency)
	assert.Equal(t, "12,345", result.Integer) // groups merged into integer
	assert.Equal(t, ".", result.Decimal)
	assert.Equal(t, "67", result.Fraction)
	assert.True(t, result.IsPrefixSymbol)
	assert.Equal(t, PartCurrency, result.RawParts[0].Type)
	assert.Equal(t, "$", result.RawParts[0].Value)
}

func TestFormatNumberByParts_EUR_deDE(t *testing.T) {
	// de-DE: suffix symbol, period group sep, comma decimal sep.
	result, err := cachedCurrencyData.FormatNumberByParts(12345.67, NumberFormatOptions{
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
	assert.Equal(t, PartCurrency, last.Type)
	assert.Equal(t, "€", last.Value)
}

func TestFormatNumberByParts_Negative_Prefix(t *testing.T) {
	// Minus sign must precede the currency symbol for prefix locales.
	result, err := cachedCurrencyData.FormatNumberByParts(-500.0, NumberFormatOptions{
		Currency: "USD",
		Locale:   "en-US",
	})
	require.NoError(t, err)

	assert.Equal(t, "-", result.MinusSign)
	assert.True(t, result.IsPrefixSymbol)
	assert.Equal(t, PartMinusSign, result.RawParts[0].Type)
	assert.Equal(t, PartCurrency, result.RawParts[1].Type)
}

func TestFormatNumberByParts_Negative_Suffix(t *testing.T) {
	// Minus sign must precede the number for suffix locales.
	result, err := cachedCurrencyData.FormatNumberByParts(-1234567.0, NumberFormatOptions{
		Currency: "EUR",
		Locale:   "de-DE",
	})
	require.NoError(t, err)

	assert.Equal(t, "-", result.MinusSign)
	assert.False(t, result.IsPrefixSymbol)
	assert.Equal(t, PartMinusSign, result.RawParts[0].Type)
	// Currency must still be last.
	last := result.RawParts[len(result.RawParts)-1]
	assert.Equal(t, PartCurrency, last.Type)
}

func TestFormatNumberByParts_NoCurrency(t *testing.T) {
	result, err := cachedCurrencyData.FormatNumberByParts(123.45, NumberFormatOptions{
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
	result, err := cachedCurrencyData.FormatNumberByParts(12346.0, NumberFormatOptions{
		Currency: "JPY",
		Locale:   "en-US",
	})
	require.NoError(t, err)

	assert.Empty(t, result.Decimal)
	assert.Empty(t, result.Fraction)
	assert.NotEmpty(t, result.Integer)
}

func TestFormatNumberByParts_InvalidAmount(t *testing.T) {
	_, err := cachedCurrencyData.FormatNumberByParts("not-a-number", NumberFormatOptions{
		Currency: "USD",
		Locale:   "en-US",
	})
	assert.Error(t, err)
}

func TestFormatNumberByParts_UnknownCurrency(t *testing.T) {
	// Unknown currency code: prefix, code-as-symbol, NBSP separator.
	result, err := cachedCurrencyData.FormatNumberByParts(12345.67, NumberFormatOptions{
		Currency: "XYZ",
		Locale:   "en-US",
	})
	require.NoError(t, err)

	assert.Equal(t, "XYZ", result.Currency)
	assert.True(t, result.IsPrefixSymbol)

	// rawParts[0] = currency, rawParts[1] = literal (space/nbsp)
	require.GreaterOrEqual(t, len(result.RawParts), 2)
	assert.Equal(t, PartCurrency, result.RawParts[0].Type)
	assert.Equal(t, PartLiteral, result.RawParts[1].Type)
}
