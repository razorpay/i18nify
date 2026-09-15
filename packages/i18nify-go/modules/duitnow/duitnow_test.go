package duitnow

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGetSupportedBanks(t *testing.T) {
	banks := GetSupportedBanks()
	require.Len(t, banks, 44+32)

	// The allow-list is the retail codes followed by the corporate codes.
	assert.Equal(t, append(GetRetailBanks(), GetCorporateBanks()...), banks)

	seen := make(map[string]struct{}, len(banks))
	for _, code := range banks {
		require.NotEmpty(t, code)
		_, dup := seen[code]
		require.False(t, dup, "code %q listed twice", code)
		seen[code] = struct{}{}
		assert.True(t, IsSupportedBank(code), "listed code %q must be supported", code)
	}

	for _, code := range []string{"CIBB", "CIBB_C", "MB2U", "DEUT_C", "UOMY_C", "BNPA_C"} {
		assert.Contains(t, banks, code)
	}
	for _, code := range []string{"DEUT", "MB2U_C", "HBMY"} {
		assert.NotContains(t, banks, code)
	}
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
		assert.True(t, strings.HasSuffix(code, CorporateSuffix) && len(code) > len(CorporateSuffix),
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

func TestIsCorporateBank(t *testing.T) {
	for _, code := range []string{"AFBQ_C", "PHBM_C", "UOMY_C", "BNPA_C"} {
		assert.True(t, IsCorporateBank(code), "code %q", code)
	}
	for _, code := range []string{"", "AFBQ", "PHBM", "A_CB", "PHBM_c"} {
		assert.False(t, IsCorporateBank(code), "code %q", code)
	}
}

func TestLookupBank(t *testing.T) {
	b, ok := LookupBank("CIMY")
	require.True(t, ok)
	assert.Equal(t, "CIMY", b.Key)

	b, ok = LookupBank("PHMY")
	require.True(t, ok)
	assert.Equal(t, Bank{Key: "PHBM", Name: "Affin Bank", FPXCode: "PHBM", OBWCode: "PHMY"}, b)

	_, ok = LookupBank("ZZZZ")
	assert.False(t, ok)
	_, ok = LookupBank("")
	assert.False(t, ok)
}

// Corporate codes have no row of their own: LookupBank strips CorporateSuffix and resolves them
// onto their retail row, so every corporate bank resolves exactly like its retail code.
func TestLookupBank_CorporateCodesResolveOntoTheirRetailRow(t *testing.T) {
	retail, ok := LookupBank("PHBM")
	require.True(t, ok)
	corporate, ok := LookupBank("PHBM_C")
	require.True(t, ok)
	assert.Equal(t, retail, corporate)

	b, ok := LookupBank("CIMY_C")
	require.True(t, ok)
	assert.Equal(t, "CIMY", b.Key, "the overlapping-row rule still applies after the suffix is stripped")

	for _, code := range GetCorporateBanks() {
		_, retailOK := LookupBank(strings.TrimSuffix(code, CorporateSuffix))
		_, corporateOK := LookupBank(code)
		assert.Equal(t, retailOK, corporateOK, "corporate code %q must resolve like its retail code", code)
	}

	_, ok = LookupBank(CorporateSuffix)
	assert.False(t, ok, "a bare suffix is not a bank")
	_, ok = LookupBank("ZZZZ_C")
	assert.False(t, ok)
}

func TestGettersReturnCopies(t *testing.T) {
	GetSupportedBanks()[0] = "MUTATED"
	GetRetailBanks()[0] = "MUTATED"
	GetCorporateBanks()[0] = "MUTATED"
	GetBanks()[0].Key = "MUTATED"
	GetObwEnabledCodes()[0] = "MUTATED"

	assert.NotEqual(t, "MUTATED", GetSupportedBanks()[0])
	assert.NotEqual(t, "MUTATED", GetRetailBanks()[0])
	assert.NotEqual(t, "MUTATED", GetCorporateBanks()[0])
	assert.NotEqual(t, "MUTATED", GetBanks()[0].Key)
	assert.NotEqual(t, "MUTATED", GetObwEnabledCodes()[0])
}
