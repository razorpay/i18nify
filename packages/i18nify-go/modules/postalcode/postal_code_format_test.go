package postalcode

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGetPostalCodeFormat_Numeric(t *testing.T) {
	cases := []string{"US", "IN", "DE", "FR", "JP"}
	for _, cc := range cases {
		info, err := GetPostalCodeFormat(cc)
		require.NoError(t, err, cc)
		assert.Equal(t, FormatNumeric, info.Format, "expected numeric for %s", cc)
	}
}

func TestGetPostalCodeFormat_Alphanumeric(t *testing.T) {
	cases := []string{"CA", "GB", "NL", "AR"}
	for _, cc := range cases {
		info, err := GetPostalCodeFormat(cc)
		require.NoError(t, err, cc)
		assert.Equal(t, FormatAlphanumeric, info.Format, "expected alphanumeric for %s", cc)
	}
}

func TestGetPostalCodeFormat_None(t *testing.T) {
	cases := []string{"AE", "HK", "BF"}
	for _, cc := range cases {
		info, err := GetPostalCodeFormat(cc)
		require.NoError(t, err, cc)
		assert.Equal(t, FormatNone, info.Format, "expected none for %s", cc)
	}
}

func TestGetPostalCodeFormat_Shape(t *testing.T) {
	info, err := GetPostalCodeFormat("US")
	require.NoError(t, err)
	assert.Equal(t, "United States", info.CountryName)
	assert.Equal(t, FormatNumeric, info.Format)
	assert.NotEmpty(t, info.ZipRegex)
	assert.NotEmpty(t, info.Examples)
}

func TestGetPostalCodeFormat_CaseInsensitive(t *testing.T) {
	lower, err := GetPostalCodeFormat("us")
	require.NoError(t, err)
	upper, err := GetPostalCodeFormat("US")
	require.NoError(t, err)
	assert.Equal(t, upper, lower)
}

func TestGetPostalCodeFormat_EmptyInput(t *testing.T) {
	_, err := GetPostalCodeFormat("")
	assert.Error(t, err)
}

func TestGetPostalCodeFormat_UnknownCode(t *testing.T) {
	_, err := GetPostalCodeFormat("XX")
	assert.ErrorContains(t, err, "XX")
}
