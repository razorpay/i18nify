package currency

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestIsZeroDecimalCurrency(t *testing.T) {
	zero := []string{"JPY", "KRW", "VND", "ISK", "CLP", "BIF", "XOF", "XAF"}
	for _, code := range zero {
		t.Run(code+"_zero", func(t *testing.T) {
			got, err := IsZeroDecimalCurrency(code)
			assert.NoError(t, err)
			assert.True(t, got)
		})
	}

	nonZero := []string{"USD", "EUR", "INR", "GBP", "BHD", "KWD"}
	for _, code := range nonZero {
		t.Run(code+"_not_zero", func(t *testing.T) {
			got, err := IsZeroDecimalCurrency(code)
			assert.NoError(t, err)
			assert.False(t, got)
		})
	}

	t.Run("empty_code", func(t *testing.T) {
		_, err := IsZeroDecimalCurrency("")
		assert.Error(t, err)
	})

	t.Run("invalid_code", func(t *testing.T) {
		_, err := IsZeroDecimalCurrency("XXX")
		assert.Error(t, err)
	})
}

func TestIsThreeDecimalCurrency(t *testing.T) {
	three := []string{"BHD", "KWD", "OMR", "JOD", "IQD", "TND", "LYD"}
	for _, code := range three {
		t.Run(code+"_three", func(t *testing.T) {
			got, err := IsThreeDecimalCurrency(code)
			assert.NoError(t, err)
			assert.True(t, got)
		})
	}

	nonThree := []string{"USD", "EUR", "INR", "GBP", "JPY", "KRW"}
	for _, code := range nonThree {
		t.Run(code+"_not_three", func(t *testing.T) {
			got, err := IsThreeDecimalCurrency(code)
			assert.NoError(t, err)
			assert.False(t, got)
		})
	}

	t.Run("empty_code", func(t *testing.T) {
		_, err := IsThreeDecimalCurrency("")
		assert.Error(t, err)
	})

	t.Run("invalid_code", func(t *testing.T) {
		_, err := IsThreeDecimalCurrency("XXX")
		assert.Error(t, err)
	})
}
