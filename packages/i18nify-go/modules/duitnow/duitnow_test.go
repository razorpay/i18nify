package duitnow

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGetSupportedBanks(t *testing.T) {
	banks := GetSupportedBanks()
	require.Len(t, banks, 48)

	var retail, corporate int
	byCode := make(map[string]SupportedBank, len(banks))
	for _, b := range banks {
		require.NotEmpty(t, b.Code)
		require.True(t, b.Retail || b.Corporate, "code %q must be supported for at least one segment", b.Code)
		_, dup := byCode[b.Code]
		require.False(t, dup, "code %q listed twice", b.Code)
		byCode[b.Code] = b
		if b.Retail {
			retail++
		}
		if b.Corporate {
			corporate++
		}
	}
	assert.Equal(t, 44, retail)
	assert.Equal(t, 32, corporate)

	assert.Equal(t, SupportedBank{Code: "CIBB", Retail: true, Corporate: true}, byCode["CIBB"])
	assert.Equal(t, SupportedBank{Code: "MB2U", Retail: true, Corporate: false}, byCode["MB2U"])
	assert.Equal(t, SupportedBank{Code: "DEUT", Retail: false, Corporate: true}, byCode["DEUT"])
}

func TestGetBanks(t *testing.T) {
	banks := GetBanks()
	require.Len(t, banks, 25)

	// Row order is part of the data: rows can share a code (CIMY appears on two rows).
	assert.Equal(t, Bank{Key: "AGOB", Name: "Agro Bank", FPXCode: "AGOB", OBWCode: "AGMY"}, banks[0])
	assert.Equal(t, Bank{Key: "CIMY", Name: "CIMB Bank", FPXCode: "", OBWCode: "CIMY"}, banks[len(banks)-1])

	for _, b := range banks {
		assert.NotEmpty(t, b.Key)
		assert.NotEmpty(t, b.Name)
		assert.True(t, b.FPXCode != "" || b.OBWCode != "", "bank %q must have at least one rail", b.Key)
	}
}

func TestGetObwEnabledCodes(t *testing.T) {
	assert.Equal(t, []string{"AFBQ", "FNXS", "UOVB", "PICA", "AGMY", "DASH", "CIMY"}, GetObwEnabledCodes())
}

func TestGetRetailBanks(t *testing.T) {
	banks := GetRetailBanks()
	require.Len(t, banks, 44)
	assert.Equal(t, "PHBM", banks[0])
	assert.Contains(t, banks, "MB2U")
	assert.NotContains(t, banks, "DEUT", "DEUT is corporate-only")
}

func TestGetCorporateBanks(t *testing.T) {
	banks := GetCorporateBanks()
	require.Len(t, banks, 32)
	for _, code := range banks {
		assert.True(t, len(code) > len(CorporateSuffix) && code[len(code)-len(CorporateSuffix):] == CorporateSuffix,
			"corporate code %q must carry the %s suffix", code, CorporateSuffix)
	}
	assert.Contains(t, banks, "UOMY_C")
	assert.Contains(t, banks, "DEUT_C")
	assert.NotContains(t, banks, "MB2U_C", "MB2U is retail-only")
}

func TestIsSupportedBank(t *testing.T) {
	for _, code := range []string{"MB2U", "CIBB", "CIBB_C", "UOMY_C", "DEUT_C", "PICA"} {
		assert.True(t, IsSupportedBank(code), "code %q", code)
	}
	for _, code := range []string{"", "NOT_A_BANK", "DEUT", "MB2U_C", "HBMY", "mb2u"} {
		assert.False(t, IsSupportedBank(code), "code %q", code)
	}
}

func TestIsObwEnabled(t *testing.T) {
	for _, code := range GetObwEnabledCodes() {
		assert.True(t, IsObwEnabled(code), "code %q", code)
	}
	for _, code := range []string{"", "NOT_A_BANK", "AGOB", "CIBB"} {
		assert.False(t, IsObwEnabled(code), "code %q", code)
	}
}

// CIMB has two rows sharing CIMY: {Key: CIBB, FPX: CIBB, OBW: CIMY} and {Key: CIMY, OBW: CIMY}.
// The later row wins, so CIMY keeps its own key instead of collapsing into CIBB.
func TestCanonicalKey(t *testing.T) {
	for code, want := range map[string]string{
		"CIMY": "CIMY",
		"CIBB": "CIBB",
		"PHBM": "PHBM", // FPX code, also the key
		"PHMY": "PHBM", // OBW code for the same bank
		"ARBK": "ARBK",
		"ARMY": "ARBK",
		"AFBQ": "AFBQ", // OBW-only row
		"ZZZZ": "ZZZZ", // unknown codes pass through
	} {
		assert.Equal(t, want, CanonicalKey(code), "code %s", code)
	}
}

func TestLookupBank(t *testing.T) {
	b, ok := LookupBank("CIMY")
	require.True(t, ok)
	assert.Equal(t, "CIMY", b.Key)

	b, ok = LookupBank("PHMY")
	require.True(t, ok)
	assert.Equal(t, Bank{Key: "PHBM", Name: "Affin Bank", FPXCode: "PHBM", OBWCode: "PHMY"}, b)

	// Corporate codes have no row of their own; callers trim the suffix first.
	_, ok = LookupBank("PHBM_C")
	assert.False(t, ok)

	_, ok = LookupBank("ZZZZ")
	assert.False(t, ok)
	_, ok = LookupBank("")
	assert.False(t, ok)
}

func TestGettersReturnCopies(t *testing.T) {
	GetRetailBanks()[0] = "MUTATED"
	GetCorporateBanks()[0] = "MUTATED"
	assert.NotEqual(t, "MUTATED", GetRetailBanks()[0])
	assert.NotEqual(t, "MUTATED", GetCorporateBanks()[0])

	GetSupportedBanks()[0].Code = "MUTATED"
	GetBanks()[0].Key = "MUTATED"
	GetObwEnabledCodes()[0] = "MUTATED"

	assert.NotEqual(t, "MUTATED", GetSupportedBanks()[0].Code)
	assert.NotEqual(t, "MUTATED", GetBanks()[0].Key)
	assert.NotEqual(t, "MUTATED", GetObwEnabledCodes()[0])
}
