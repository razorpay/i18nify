package bankcodes

import (
	"sort"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

const testBankCountry = "SG"

// sgProductionBICs is the live list of BICs enabled for Singapore onboarding.
var sgProductionBICs = []string{
	"BKCHSGSG", "BKIDSGSG", "CIBBSGSG", "CITISG21", "DBSSSGSG",
	"GLDTSGSG", "GXSPSGSG", "HLBBSGSG", "HSBCSGS2", "ICBKSGSG",
	"ICICSGSG", "IDIBSGSG", "INGPSGSG", "IOBASGSG", "MBBESGS2",
	"OCBCSGSG", "PCBCSGSG", "RHBBSGSG", "SBINSGSG", "SCBLSG22",
	"SIEISGS1", "SIVFSGSG", "SSPISGSG", "TRBUSGSG", "UOVBSGSG",
}

func TestGetBanksByIdentifiers(t *testing.T) {
	tests := []struct {
		name            string
		countryCode     string
		identifiers     []string
		wantIdentifiers []string
		wantErr         bool
		errContains     []string
	}{
		{
			name:            "subset lookup returns only requested banks",
			countryCode:     testBankCountry,
			identifiers:     []string{"DBSSSGSG", "OCBCSGSG"},
			wantIdentifiers: []string{"DBSSSGSG", "OCBCSGSG"},
		},
		{
			name:            "identifiers are matched case-insensitively and trimmed",
			countryCode:     testBankCountry,
			identifiers:     []string{"dbsssgsg", "  OcbcSgSg  "},
			wantIdentifiers: []string{"DBSSSGSG", "OCBCSGSG"},
		},
		{
			name:            "repeated identifiers are de-duplicated",
			countryCode:     testBankCountry,
			identifiers:     []string{"DBSSSGSG", "dbsssgsg", " DBSSSGSG ", "OCBCSGSG"},
			wantIdentifiers: []string{"DBSSSGSG", "OCBCSGSG"},
		},
		{
			name:            "blank entries are skipped",
			countryCode:     testBankCountry,
			identifiers:     []string{"DBSSSGSG", "", "   "},
			wantIdentifiers: []string{"DBSSSGSG"},
		},
		{
			name:        "unknown identifiers error and name every bad value",
			countryCode: testBankCountry,
			identifiers: []string{"DBSSSGSG", "NOPE", "ZZZZ"},
			wantErr:     true,
			errContains: []string{"getBanksByIdentifiers", "unknown bank identifiers", "SG", "NOPE", "ZZZZ"},
		},
		{
			name:        "short code alone is not an identifier",
			countryCode: testBankCountry,
			identifiers: []string{"CITI"},
			wantErr:     true,
			errContains: []string{"unknown bank identifiers", "CITI"},
		},
		{
			name:        "nil identifiers error instead of returning every bank",
			countryCode: testBankCountry,
			wantErr:     true,
			errContains: []string{"at least one non-blank bank identifier is required"},
		},
		{
			name:        "empty identifiers error instead of returning every bank",
			countryCode: testBankCountry,
			identifiers: []string{},
			wantErr:     true,
			errContains: []string{"at least one non-blank bank identifier is required"},
		},
		{
			name:        "all-blank identifiers error",
			countryCode: testBankCountry,
			identifiers: []string{"", "  "},
			wantErr:     true,
			errContains: []string{"at least one non-blank bank identifier is required"},
		},
		{
			name:        "unsupported country code errors",
			countryCode: "ZZ",
			identifiers: []string{"DBSSSGSG"},
			wantErr:     true,
			errContains: []string{"failed to load bank information for country ZZ"},
		},
		{
			name:        "empty country code errors",
			countryCode: "",
			identifiers: []string{"DBSSSGSG"},
			wantErr:     true,
			errContains: []string{"country code is empty"},
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetBanksByIdentifiers(tt.countryCode, tt.identifiers)

			if tt.wantErr {
				require.Error(t, err)
				assert.Nil(t, got, "no partial slice should be returned alongside an error")
				for _, want := range tt.errContains {
					assert.Contains(t, err.Error(), want)
				}
				return
			}

			require.NoError(t, err)

			gotIdentifiers := make([]string, 0, len(got))
			for _, bank := range got {
				gotIdentifiers = append(gotIdentifiers, bank.Identifier)
			}
			sort.Strings(gotIdentifiers)
			assert.Equal(t, tt.wantIdentifiers, gotIdentifiers)
		})
	}
}

// TestGetBanksByIdentifiers_KnownBICs pins the BIC -> bank name resolutions the
// SG onboarding flow depends on.
func TestGetBanksByIdentifiers_KnownBICs(t *testing.T) {
	want := map[string]string{
		"CITISG21": "CITIBANK SINGAPORE LIMITED",
		"HSBCSGS2": "HSBC BANK (SINGAPORE) LIMITED",
		"OCBCSGSG": "OVERSEA-CHINESE BANKING CORPORATION LIMITED",
		"SCBLSG22": "STANDARD CHARTERED BANK (SINGAPORE) LIMITED",
		"MBBESGS2": "MAYBANK SINGAPORE LIMITED",
		"DBSSSGSG": "DBS BANK LTD",
	}

	for bic, name := range want {
		bic, name := bic, name
		t.Run(bic, func(t *testing.T) {
			got, err := GetBanksByIdentifiers(testBankCountry, []string{bic})
			require.NoError(t, err)
			require.Len(t, got, 1)
			assert.Equal(t, bic, got[0].Identifier)
			assert.Equal(t, name, got[0].Name)
			assert.NotEmpty(t, got[0].ShortCode)
		})
	}
}

// TestGetBanksByIdentifiers_DisambiguatesPrefixSiblings is the reason this
// function exists. Each pair below shares a 4-character short code (the BIC
// prefix) but is a different legal entity, so a short-code lookup can only ever
// return one of them. Keyed on the full BIC they resolve distinctly.
func TestGetBanksByIdentifiers_DisambiguatesPrefixSiblings(t *testing.T) {
	siblings := []struct {
		shortCode string
		a, b      string
		wantA     string
		wantB     string
	}{
		{
			shortCode: "CITI",
			a:         "CITISG21", wantA: "CITIBANK SINGAPORE LIMITED",
			b: "CITISGSG", wantB: "CITIBANK,N.A.",
		},
		{
			shortCode: "HSBC",
			a:         "HSBCSGS2", wantA: "HSBC BANK (SINGAPORE) LIMITED",
			b: "HSBCSGSG", wantB: "THE HONGKONG AND SHANGHAI BANKING CORPORATION LIMITED",
		},
		{
			shortCode: "OCBC",
			a:         "OCBCSGSG", wantA: "OVERSEA-CHINESE BANKING CORPORATION LIMITED",
			b: "OCBCSGS1", wantB: "OCBC SECURITIES PRIVATE LIMITED",
		},
		{
			shortCode: "SCBL",
			a:         "SCBLSG22", wantA: "STANDARD CHARTERED BANK (SINGAPORE) LIMITED",
			b: "SCBLSG21", wantB: "RAFFLES NOMINEES (PTE.) LIMITED",
		},
		{
			shortCode: "MBBE",
			a:         "MBBESGS2", wantA: "MAYBANK SINGAPORE LIMITED",
			b: "MBBESGSG", wantB: "MALAYAN BANKING BERHAD",
		},
	}

	for _, tt := range siblings {
		tt := tt
		t.Run(tt.shortCode, func(t *testing.T) {
			got, err := GetBanksByIdentifiers(testBankCountry, []string{tt.a, tt.b})
			require.NoError(t, err)
			require.Len(t, got, 2, "both prefix siblings must resolve")

			byIdentifier := make(map[string]BankIdentity, len(got))
			for _, bank := range got {
				byIdentifier[bank.Identifier] = bank
			}

			assert.Equal(t, tt.wantA, byIdentifier[tt.a].Name)
			assert.Equal(t, tt.wantB, byIdentifier[tt.b].Name)
			assert.NotEqual(t, byIdentifier[tt.a].Name, byIdentifier[tt.b].Name,
				"prefix siblings must resolve to different banks")

			// Both share the short code, which is exactly why the short code is
			// not a usable key.
			assert.Equal(t, tt.shortCode, byIdentifier[tt.a].ShortCode)
			assert.Equal(t, tt.shortCode, byIdentifier[tt.b].ShortCode)
		})
	}
}

// TestGetBanksByIdentifiers_SGProductionList checks the full enabled list
// resolves 1:1 with no collisions.
func TestGetBanksByIdentifiers_SGProductionList(t *testing.T) {
	got, err := GetBanksByIdentifiers(testBankCountry, sgProductionBICs)
	require.NoError(t, err)
	require.Len(t, got, len(sgProductionBICs), "every enabled BIC must resolve to exactly one entry")

	names := make(map[string]string, len(got))
	identifiers := make([]string, 0, len(got))
	for _, bank := range got {
		assert.NotEmpty(t, bank.Identifier)
		assert.NotEmpty(t, bank.ShortCode)
		assert.NotEmpty(t, bank.Name)

		if existing, dup := names[bank.Name]; dup {
			t.Errorf("bank name %q resolved from both %q and %q", bank.Name, existing, bank.Identifier)
		}
		names[bank.Name] = bank.Identifier
		identifiers = append(identifiers, bank.Identifier)
	}
	assert.Len(t, names, len(sgProductionBICs), "the enabled list must yield distinct bank names")

	sort.Strings(identifiers)
	wantIdentifiers := append([]string(nil), sgProductionBICs...)
	sort.Strings(wantIdentifiers)
	assert.Equal(t, wantIdentifiers, identifiers)
}

func TestGetBanksByIdentifiers_SortedByNameIndependentOfInputOrder(t *testing.T) {
	got, err := GetBanksByIdentifiers(testBankCountry, sgProductionBICs)
	require.NoError(t, err)

	names := make([]string, 0, len(got))
	for _, bank := range got {
		names = append(names, bank.Name)
	}
	assert.True(t, sort.StringsAreSorted(names), "expected names sorted ascending, got %v", names)

	reversed := make([]string, 0, len(sgProductionBICs))
	for i := len(sgProductionBICs) - 1; i >= 0; i-- {
		reversed = append(reversed, sgProductionBICs[i])
	}
	reordered, err := GetBanksByIdentifiers(testBankCountry, reversed)
	require.NoError(t, err)
	assert.Equal(t, got, reordered, "ordering must not depend on input order")
}

func TestGetBanksByIdentifiers_DeterministicAcrossCalls(t *testing.T) {
	first, err := GetBanksByIdentifiers(testBankCountry, sgProductionBICs)
	require.NoError(t, err)
	require.NotEmpty(t, first)

	for i := 0; i < 5; i++ {
		next, err := GetBanksByIdentifiers(testBankCountry, sgProductionBICs)
		require.NoError(t, err)
		require.Equal(t, first, next, "GetBanksByIdentifiers must be deterministic")
	}
}

// TestGetBanksByIdentifiers_DistinctIdentifiersSameBank documents that the
// result is one entry per requested identifier, not per bank.
func TestGetBanksByIdentifiers_DistinctIdentifiersSameBank(t *testing.T) {
	got, err := GetBanksByIdentifiers(testBankCountry, []string{
		"DBSSSGSG", "DBSSSGS2", "CITISG21", "CITISGSL",
	})
	require.NoError(t, err)
	require.Len(t, got, 4, "one entry per requested identifier")

	assert.Equal(t, []BankIdentity{
		{Identifier: "CITISG21", ShortCode: "CITI", Name: "CITIBANK SINGAPORE LIMITED"},
		{Identifier: "CITISGSL", ShortCode: "CITI", Name: "CITIBANK SINGAPORE LIMITED"},
		{Identifier: "DBSSSGS2", ShortCode: "DBSS", Name: "DBS BANK LTD"},
		{Identifier: "DBSSSGSG", ShortCode: "DBSS", Name: "DBS BANK LTD"},
	}, got)

	// Callers building a dropdown are expected to collapse by Name.
	unique := make(map[string]struct{}, len(got))
	for _, bank := range got {
		unique[bank.Name] = struct{}{}
	}
	assert.Len(t, unique, 2)
}

// TestGetBanksByIdentifiers_IFSC covers the ifsc_code branch of the match. IN
// is the cleanest data set for this: all 164,783 IFSC codes are distinct and
// none maps to more than one bank name.
func TestGetBanksByIdentifiers_IFSC(t *testing.T) {
	got, err := GetBanksByIdentifiers("IN", []string{"hdfc0000001", " SBIN0000001 "})
	require.NoError(t, err)

	assert.Equal(t, []BankIdentity{
		{Identifier: "HDFC0000001", ShortCode: "HDFC", Name: "HDFC Bank"},
		{Identifier: "SBIN0000001", ShortCode: "SBIN", Name: "State Bank of India"},
	}, got)
}

// TestGetBanksByIdentifiers_RoutingNumber covers the routing_number branch.
// US routing-number records carry no short code, so only Name is asserted.
func TestGetBanksByIdentifiers_RoutingNumber(t *testing.T) {
	got, err := GetBanksByIdentifiers("US", []string{"011000138", "011001234"})
	require.NoError(t, err)
	require.Len(t, got, 2)

	byIdentifier := make(map[string]string, len(got))
	for _, bank := range got {
		byIdentifier[bank.Identifier] = bank.Name
	}
	assert.Equal(t, "BANK OF AMERICA", byIdentifier["011000138"])
	assert.Equal(t, "BANK OF NEW YORK MELLON", byIdentifier["011001234"])
}
