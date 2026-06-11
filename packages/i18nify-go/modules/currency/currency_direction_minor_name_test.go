package currency

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetCurrencyDirection(t *testing.T) {
	rtl := []string{"BHD", "KWD", "SAR", "AED", "AFN", "IQD", "IRR", "OMR", "QAR", "YER", "DZD"}
	for _, code := range rtl {
		t.Run(code+"_rtl", func(t *testing.T) {
			dir, err := GetCurrencyDirection(code)
			assert.NoError(t, err)
			assert.Equal(t, "rtl", dir)
		})
	}

	ltr := []string{"USD", "EUR", "INR", "GBP", "JPY", "ILS"}
	for _, code := range ltr {
		t.Run(code+"_ltr", func(t *testing.T) {
			dir, err := GetCurrencyDirection(code)
			assert.NoError(t, err)
			assert.Equal(t, "ltr", dir)
		})
	}

	t.Run("empty_code", func(t *testing.T) {
		_, err := GetCurrencyDirection("")
		assert.Error(t, err)
	})

	t.Run("invalid_code", func(t *testing.T) {
		_, err := GetCurrencyDirection("XXX")
		assert.Error(t, err)
	})
}

func TestGetMinorUnitName(t *testing.T) {
	tests := []struct {
		code string
		want string
	}{
		{"USD", "cent"},
		{"EUR", "cent"},
		{"GBP", "penny"},
		{"JPY", "sen"},
		{"INR", "paisa"},
		{"PKR", "paisa"},
		{"BHD", "fils"},
		{"KWD", "fils"},
		{"AED", "fils"},
		{"SAR", "halala"},
		{"OMR", "baisa"},
		{"TND", "millime"},
		{"ILS", "agora"},
		{"NOK", "øre"},
		{"SEK", "öre"},
		{"RUB", "kopek"},
		{"NGN", "kobo"},
		{"GHS", "pesewa"},
	}

	for _, tt := range tests {
		t.Run(tt.code, func(t *testing.T) {
			got, err := GetMinorUnitName(tt.code)
			assert.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestGetMinorUnitName_ValidButUnlisted(t *testing.T) {
	// ALL (Albanian Lek) is a valid code but not in the minor unit names table
	got, err := GetMinorUnitName("ALL")
	assert.NoError(t, err)
	assert.Equal(t, "", got)
}

func TestGetMinorUnitName_Errors(t *testing.T) {
	_, err := GetMinorUnitName("")
	assert.Error(t, err)

	_, err = GetMinorUnitName("XXX")
	assert.Error(t, err)
}
