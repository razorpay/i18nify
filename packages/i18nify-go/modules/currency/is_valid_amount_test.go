package currency

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestIsValidAmount_USD(t *testing.T) {
	cases := []struct {
		amount string
		want   bool
	}{
		{"10", true},
		{"10.5", true},
		{"10.50", true},
		{"0.99", true},
		{"1000.00", true},
		{"-10.50", true},
		{"10.123", false},
		{"0.001", false},
	}
	for _, tc := range cases {
		t.Run(tc.amount, func(t *testing.T) {
			got, err := IsValidAmount(tc.amount, "USD")
			require.NoError(t, err)
			assert.Equal(t, tc.want, got)
		})
	}
}

func TestIsValidAmount_JPY(t *testing.T) {
	t.Run("integer allowed", func(t *testing.T) {
		got, err := IsValidAmount("100", "JPY")
		require.NoError(t, err)
		assert.True(t, got)
	})

	t.Run("any decimal rejected", func(t *testing.T) {
		for _, amount := range []string{"100.5", "100.00", "1.1"} {
			got, err := IsValidAmount(amount, "JPY")
			require.NoError(t, err)
			assert.False(t, got, "expected false for %s JPY", amount)
		}
	})
}

func TestIsValidAmount_KWD(t *testing.T) {
	for _, amount := range []string{"10", "10.1", "10.12", "10.123"} {
		t.Run(amount+" allowed", func(t *testing.T) {
			got, err := IsValidAmount(amount, "KWD")
			require.NoError(t, err)
			assert.True(t, got)
		})
	}

	t.Run("4 decimals rejected", func(t *testing.T) {
		got, err := IsValidAmount("10.1234", "KWD")
		require.NoError(t, err)
		assert.False(t, got)
	})
}

func TestIsValidAmount_CLF(t *testing.T) {
	t.Run("4 decimals allowed", func(t *testing.T) {
		got, err := IsValidAmount("1.1234", "CLF")
		require.NoError(t, err)
		assert.True(t, got)
	})

	t.Run("5 decimals rejected", func(t *testing.T) {
		got, err := IsValidAmount("1.12345", "CLF")
		require.NoError(t, err)
		assert.False(t, got)
	})
}

func TestIsValidAmount_InvalidCurrencyCode(t *testing.T) {
	for _, code := range []string{"XYZ", "", "usd", "INVALID"} {
		t.Run(code, func(t *testing.T) {
			_, err := IsValidAmount("10.50", code)
			assert.Error(t, err, "expected error for invalid code: %q", code)
		})
	}
}

func TestIsValidAmount_InvalidFormat(t *testing.T) {
	cases := []string{"abc", "10,50", "1e2", "", "   ", "1.2.3", "$10.50", "1 000.50"}
	for _, amount := range cases {
		t.Run(amount, func(t *testing.T) {
			got, err := IsValidAmount(amount, "USD")
			require.NoError(t, err)
			assert.False(t, got, "expected false for amount %q", amount)
		})
	}
}

func TestIsValidAmount_EdgeCases(t *testing.T) {
	t.Run("trims whitespace", func(t *testing.T) {
		got, err := IsValidAmount("  10.50  ", "USD")
		require.NoError(t, err)
		assert.True(t, got)
	})

	t.Run("zero with 2 decimals valid for USD", func(t *testing.T) {
		got, err := IsValidAmount("0.00", "USD")
		require.NoError(t, err)
		assert.True(t, got)
	})

	t.Run("negative amount valid", func(t *testing.T) {
		got, err := IsValidAmount("-100.50", "USD")
		require.NoError(t, err)
		assert.True(t, got)
	})
}
