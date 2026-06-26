package currency

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// ---- FormatNumberByParts ----

func TestFormatNumberByParts_USD(t *testing.T) {
	result, err := cachedCurrencyData.FormatNumberByParts(12345.67, NumberFormatOptions{
		Currency: "USD",
	})
	require.NoError(t, err)

	assert.Equal(t, "$", result.Currency)
	assert.Equal(t, "12,345", result.Integer) // groups merged into integer
	assert.Equal(t, ".", result.Decimal)
	assert.True(t, result.IsPrefixSymbol)
	assert.Equal(t, PartCurrency, result.RawParts[0].Type)
	assert.Equal(t, "$", result.RawParts[0].Value)
}

func TestFormatNumberByParts_EUR(t *testing.T) {
	result, err := cachedCurrencyData.FormatNumberByParts(12345.67, NumberFormatOptions{
		Currency: "EUR",
	})
	require.NoError(t, err)

	assert.Equal(t, "€", result.Currency)
	assert.Equal(t, "12,345", result.Integer)
	assert.Equal(t, ".", result.Decimal)
	assert.True(t, result.IsPrefixSymbol)

	assert.Equal(t, PartCurrency, result.RawParts[0].Type)
	assert.Equal(t, "€", result.RawParts[0].Value)
}

func TestFormatNumberByParts_Negative_Prefix(t *testing.T) {
	// Minus sign must precede the currency symbol for prefix currencies.
	result, err := cachedCurrencyData.FormatNumberByParts(-500.0, NumberFormatOptions{
		Currency: "USD",
	})
	require.NoError(t, err)

	assert.Equal(t, "-", result.MinusSign)
	assert.True(t, result.IsPrefixSymbol)
	assert.Equal(t, PartMinusSign, result.RawParts[0].Type)
	assert.Equal(t, PartCurrency, result.RawParts[1].Type)
}

func TestFormatNumberByParts_Negative_Prefix_EUR(t *testing.T) {
	// Minus sign must precede the currency symbol for prefix currencies.
	result, err := cachedCurrencyData.FormatNumberByParts(-1234567.0, NumberFormatOptions{
		Currency: "EUR",
	})
	require.NoError(t, err)

	assert.Equal(t, "-", result.MinusSign)
	assert.True(t, result.IsPrefixSymbol)
	assert.Equal(t, PartMinusSign, result.RawParts[0].Type)
	assert.Equal(t, PartCurrency, result.RawParts[1].Type)
}

func TestFormatNumberByParts_NoCurrency(t *testing.T) {
	result, err := cachedCurrencyData.FormatNumberByParts(123.45, NumberFormatOptions{})
	require.NoError(t, err)

	assert.Equal(t, "123", result.Integer)
	assert.Equal(t, ".", result.Decimal)
	assert.Empty(t, result.Currency)
	assert.True(t, result.IsPrefixSymbol) // JS default when no currency
}

func TestFormatNumberByParts_JPY(t *testing.T) {
	// JPY has minor_unit = 0 → no decimal part.
	result, err := cachedCurrencyData.FormatNumberByParts(12346.0, NumberFormatOptions{
		Currency: "JPY",
	})
	require.NoError(t, err)

	assert.Empty(t, result.Decimal)
	assert.NotEmpty(t, result.Integer)
}

func TestFormatNumberByParts_InvalidAmount(t *testing.T) {
	_, err := cachedCurrencyData.FormatNumberByParts("not-a-number", NumberFormatOptions{
		Currency: "USD",
	})
	assert.Error(t, err)
}

func TestFormatNumberByParts_UnknownCurrency(t *testing.T) {
	// Unknown currency code: prefix, code-as-symbol, NBSP separator.
	result, err := cachedCurrencyData.FormatNumberByParts(12345.67, NumberFormatOptions{
		Currency: "XYZ",
	})
	require.NoError(t, err)

	assert.Equal(t, "XYZ", result.Currency)
	assert.True(t, result.IsPrefixSymbol)

	// rawParts[0] = currency, rawParts[1] = literal (space/nbsp)
	require.GreaterOrEqual(t, len(result.RawParts), 2)
	assert.Equal(t, PartCurrency, result.RawParts[0].Type)
	assert.Equal(t, PartLiteral, result.RawParts[1].Type)
}
