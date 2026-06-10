package geo

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestConvertCountryCode_Alpha2ToAlpha3(t *testing.T) {
	cases := [][2]string{
		{"IN", "IND"},
		{"US", "USA"},
		{"GB", "GBR"},
		{"DE", "DEU"},
		{"JP", "JPN"},
		{"SG", "SGP"},
	}
	for _, c := range cases {
		t.Run(c[0]+"→"+c[1], func(t *testing.T) {
			got, err := ConvertCountryCode(c[0])
			require.NoError(t, err)
			assert.Equal(t, c[1], got)
		})
	}
}

func TestConvertCountryCode_Alpha3ToAlpha2(t *testing.T) {
	cases := [][2]string{
		{"IND", "IN"},
		{"USA", "US"},
		{"GBR", "GB"},
		{"DEU", "DE"},
		{"JPN", "JP"},
		{"SGP", "SG"},
	}
	for _, c := range cases {
		t.Run(c[0]+"→"+c[1], func(t *testing.T) {
			got, err := ConvertCountryCode(c[0])
			require.NoError(t, err)
			assert.Equal(t, c[1], got)
		})
	}
}

func TestConvertCountryCode_CaseNormalisation(t *testing.T) {
	got, err := ConvertCountryCode("in")
	require.NoError(t, err)
	assert.Equal(t, "IND", got)

	got, err = ConvertCountryCode("ind")
	require.NoError(t, err)
	assert.Equal(t, "IN", got)
}

func TestConvertCountryCode_Errors(t *testing.T) {
	t.Run("empty", func(t *testing.T) {
		_, err := ConvertCountryCode("")
		assert.Error(t, err)
	})
	t.Run("one_char", func(t *testing.T) {
		_, err := ConvertCountryCode("X")
		assert.Error(t, err)
	})
	t.Run("four_chars", func(t *testing.T) {
		_, err := ConvertCountryCode("XXXX")
		assert.Error(t, err)
	})
	t.Run("unknown_alpha2", func(t *testing.T) {
		_, err := ConvertCountryCode("XX")
		assert.Error(t, err)
	})
	t.Run("unknown_alpha3", func(t *testing.T) {
		_, err := ConvertCountryCode("XYZ")
		assert.Error(t, err)
	})
}

func TestConvertCountryCode_RoundTrip(t *testing.T) {
	pairs := [][2]string{
		{"IN", "IND"}, {"US", "USA"}, {"CN", "CHN"}, {"FR", "FRA"},
	}
	for _, pair := range pairs {
		a2, a3 := pair[0], pair[1]
		t.Run(a2+"↔"+a3, func(t *testing.T) {
			got3, err := ConvertCountryCode(a2)
			require.NoError(t, err)
			assert.Equal(t, a3, got3)

			got2, err := ConvertCountryCode(a3)
			require.NoError(t, err)
			assert.Equal(t, a2, got2)
		})
	}
}
