package i18nify_go

import (
	"sort"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/razorpay/i18nify/packages/i18nify-go/modules/bankcodes"
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/country_metadata"
)

// *Bank must satisfy IBank, including the new GetBanksByBankCodes method.
var _ IBank = (*Bank)(nil)

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

func TestBankGetBanksByBankCodes(t *testing.T) {
	bank := NewBank("SG")

	got, err := bank.GetBanksByBankCodes([]string{"UOVB", "DBSS"})
	require.NoError(t, err)
	assert.Equal(t, []bankcodes.BankIdentity{
		{BankCode: "DBSS", Name: "DBS BANK LTD"},
		{BankCode: "UOVB", Name: "UNITED OVERSEAS BANK LIMITED"},
	}, got)

	// Delegates to the module, so results must be identical.
	direct, err := bankcodes.GetBanksByBankCodes("SG", []string{"UOVB", "DBSS"})
	require.NoError(t, err)
	assert.Equal(t, direct, got)
}

func TestBankGetBanksByBankCodes_UnknownBankCode(t *testing.T) {
	bank := NewBank("SG")

	got, err := bank.GetBanksByBankCodes([]string{"DBSS", "NOTABANK"})
	require.Error(t, err)
	assert.Nil(t, got)
	assert.Contains(t, err.Error(), "NOTABANK")
}

func TestBankGetBanksByBankCodes_EmptyIsAnError(t *testing.T) {
	bank := NewBank("SG")

	got, err := bank.GetBanksByBankCodes(nil)
	require.Error(t, err)
	assert.Nil(t, got, "empty bank codes must not fall back to every bank")
}
