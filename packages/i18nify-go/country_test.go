package i18nify_go

import (
	"sort"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/razorpay/i18nify/packages/i18nify-go/modules/country_metadata"
)

func TestPackageGetCountriesByCodes(t *testing.T) {
	got, err := GetCountriesByCodes([]string{"sg", "IN", " us "})
	require.NoError(t, err)
	require.Len(t, got, 3)

	codes := make([]string, 0, len(got))
	names := make([]string, 0, len(got))
	for _, info := range got {
		codes = append(codes, info.Code)
		names = append(names, info.CountryName)
	}
	assert.True(t, sort.StringsAreSorted(names), "expected sort by country name, got %v", names)

	sort.Strings(codes)
	assert.Equal(t, []string{"IN", "SG", "US"}, codes)

	// Delegates to the module, so results must be identical.
	direct, err := country_metadata.GetCountriesByCodes([]string{"sg", "IN", " us "})
	require.NoError(t, err)
	assert.Equal(t, direct, got)
}

func TestPackageGetCountriesByCodes_UnknownCode(t *testing.T) {
	got, err := GetCountriesByCodes([]string{"IN", "XK"})
	require.Error(t, err)
	assert.Nil(t, got)
	assert.Contains(t, err.Error(), "XK")
}
