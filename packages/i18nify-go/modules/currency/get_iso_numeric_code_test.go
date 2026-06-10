package currency

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGetISONumericCode_WellKnown(t *testing.T) {
	cases := []struct {
		code     string
		expected string
	}{
		{"USD", "840"},
		{"INR", "356"},
		{"EUR", "978"},
		{"JPY", "392"},
		{"GBP", "826"},
		{"AUD", "036"},
		{"CAD", "124"},
		{"CHF", "756"},
		{"CNY", "156"},
		{"BHD", "048"},
		{"KWD", "414"},
	}
	for _, tc := range cases {
		t.Run(tc.code, func(t *testing.T) {
			got, err := GetISONumericCode(tc.code)
			require.NoError(t, err)
			assert.Equal(t, tc.expected, got)
		})
	}
}

func TestGetISONumericCode_ZeroPadded(t *testing.T) {
	t.Run("ALL → 008 not 8", func(t *testing.T) {
		got, err := GetISONumericCode("ALL")
		require.NoError(t, err)
		assert.Equal(t, "008", got)
	})

	t.Run("AUD → 036 not 36", func(t *testing.T) {
		got, err := GetISONumericCode("AUD")
		require.NoError(t, err)
		assert.Equal(t, "036", got)
	})
}

func TestGetISONumericCode_ReturnType(t *testing.T) {
	got, err := GetISONumericCode("USD")
	require.NoError(t, err)
	assert.IsType(t, "", got, "result must be a string")
	assert.Len(t, got, 3, "numeric code must be exactly 3 characters")
}

func TestGetISONumericCode_InvalidCode(t *testing.T) {
	for _, code := range []string{"XYZ", "", "usd", "INVALID"} {
		t.Run(code, func(t *testing.T) {
			_, err := GetISONumericCode(code)
			assert.Error(t, err, "expected error for code %q", code)
		})
	}
}

func TestGetISONumericCode_AllCodesHaveThreeDigits(t *testing.T) {
	for code := range cachedCurrencyData.CurrencyInformation {
		got, err := GetISONumericCode(code)
		require.NoError(t, err, "unexpected error for code %s", code)
		assert.Len(t, got, 3, "numeric code for %s should be 3 chars, got %q", code, got)
	}
}
