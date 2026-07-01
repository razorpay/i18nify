package currency

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

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
