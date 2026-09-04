package bankcodes

import (
	"sort"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

const testBankCountry = "SG"

// sgProductionBankCodes is the live list of bank codes enabled for Singapore
// onboarding.
var sgProductionBankCodes = []string{
	"BKCH", "BKID", "CIBB", "CITI", "DBSS",
	"GLDT", "GXSP", "HLBB", "HSBC", "ICBK",
	"ICIC", "IDIB", "INGP", "IOBA", "MBBE",
	"OCBC", "PCBC", "RHBB", "SBIN", "SCBL",
	"SIEI", "SIVF", "SSPI", "TRBU", "UOVB",
}

func TestGetBanksByBankCodes(t *testing.T) {
	tests := []struct {
		name          string
		countryCode   string
		bankCodes     []string
		wantBankCodes []string
		wantErr       bool
		errContains   []string
	}{
		{
			name:          "subset lookup returns only requested banks",
			countryCode:   testBankCountry,
			bankCodes:     []string{"DBSS", "UOVB"},
			wantBankCodes: []string{"DBSS", "UOVB"},
		},
		{
			name:          "bank codes are matched case-insensitively and trimmed",
			countryCode:   testBankCountry,
			bankCodes:     []string{"dbss", "  UoVb  "},
			wantBankCodes: []string{"DBSS", "UOVB"},
		},
		{
			name:          "repeated bank codes are de-duplicated",
			countryCode:   testBankCountry,
			bankCodes:     []string{"DBSS", "dbss", " DBSS ", "UOVB"},
			wantBankCodes: []string{"DBSS", "UOVB"},
		},
		{
			name:          "blank entries are skipped",
			countryCode:   testBankCountry,
			bankCodes:     []string{"DBSS", "", "   "},
			wantBankCodes: []string{"DBSS"},
		},
		{
			name:        "unknown bank codes error and name every bad value",
			countryCode: testBankCountry,
			bankCodes:   []string{"DBSS", "NOPE", "ZZZZ"},
			wantErr:     true,
			errContains: []string{"getBanksByBankCodes", "unknown bank codes", "SG", "NOPE", "ZZZZ"},
		},
		{
			name:        "a full BIC is not a bank code",
			countryCode: testBankCountry,
			bankCodes:   []string{"DBSSSGSG"},
			wantErr:     true,
			errContains: []string{"unknown bank codes", "DBSSSGSG"},
		},
		{
			name:        "nil bank codes error instead of returning every bank",
			countryCode: testBankCountry,
			wantErr:     true,
			errContains: []string{"at least one non-blank bank code is required"},
		},
		{
			name:        "empty bank codes error instead of returning every bank",
			countryCode: testBankCountry,
			bankCodes:   []string{},
			wantErr:     true,
			errContains: []string{"at least one non-blank bank code is required"},
		},
		{
			name:        "all-blank bank codes error",
			countryCode: testBankCountry,
			bankCodes:   []string{"", "  "},
			wantErr:     true,
			errContains: []string{"at least one non-blank bank code is required"},
		},
		{
			name:        "unsupported country code errors",
			countryCode: "ZZ",
			bankCodes:   []string{"DBSS"},
			wantErr:     true,
			errContains: []string{"failed to load bank information for country ZZ"},
		},
		{
			name:        "empty country code errors",
			countryCode: "",
			bankCodes:   []string{"DBSS"},
			wantErr:     true,
			errContains: []string{"country code is empty"},
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetBanksByBankCodes(tt.countryCode, tt.bankCodes)

			if tt.wantErr {
				require.Error(t, err)
				assert.Nil(t, got, "no partial slice should be returned alongside an error")
				for _, want := range tt.errContains {
					assert.Contains(t, err.Error(), want)
				}
				return
			}

			require.NoError(t, err)

			gotBankCodes := make([]string, 0, len(got))
			for _, bank := range got {
				gotBankCodes = append(gotBankCodes, bank.BankCode)
			}
			sort.Strings(gotBankCodes)
			assert.Equal(t, tt.wantBankCodes, gotBankCodes)
		})
	}
}

// TestGetBanksByBankCodes_KnownBankCodes pins the bank code -> bank name
// resolutions the SG onboarding flow depends on. Every code below identifies
// exactly one bank in the data set.
func TestGetBanksByBankCodes_KnownBankCodes(t *testing.T) {
	want := map[string]string{
		"DBSS": "DBS BANK LTD",
		"UOVB": "UNITED OVERSEAS BANK LIMITED",
		"ICIC": "ICICI BANK LIMITED",
		"BKCH": "BANK OF CHINA LIMITED",
		"TRBU": "TRUST BANK SINGAPORE LIMITED",
		"GXSP": "GXS BANK PTE. LTD.",
	}

	for bankCode, name := range want {
		bankCode, name := bankCode, name
		t.Run(bankCode, func(t *testing.T) {
			got, err := GetBanksByBankCodes(testBankCountry, []string{bankCode})
			require.NoError(t, err)
			require.Len(t, got, 1)
			assert.Equal(t, BankIdentity{BankCode: bankCode, Name: name}, got[0])
		})
	}
}

// TestGetBanksByBankCodes_SharedBankCodes documents the cost of keying on the
// bank code: it is a BIC prefix, so distinct legal entities share one. Every
// entity is returned rather than one being silently picked.
func TestGetBanksByBankCodes_SharedBankCodes(t *testing.T) {
	shared := map[string][]string{
		"CITI": {
			"CITIBANK NA SINGAPORE BANK CLEARING MEMBER",
			"CITIBANK SINGAPORE LIMITED",
			"CITIBANK SINGAPORE LTD",
			"CITIBANK,N.A.",
		},
		"HSBC": {
			"HSBC BANK (SINGAPORE) LIMITED",
			"THE HONGKONG AND SHANGHAI BANKING CORPORATION LIMITED",
		},
		"MBBE": {
			"MALAYAN BANKING BERHAD",
			"MAYBANK SINGAPORE LIMITED",
		},
		"OCBC": {
			"OCBC SECURITIES PRIVATE LIMITED",
			"OVERSEA-CHINESE BANKING CORPORATION LIMITED",
		},
		"SCBL": {
			"RAFFLES NOMINEES (PTE.) LIMITED",
			"STANDARD CHARTERED BANK",
			"STANDARD CHARTERED BANK (SINGAPORE) LIMITED",
		},
	}

	for bankCode, wantNames := range shared {
		bankCode, wantNames := bankCode, wantNames
		t.Run(bankCode, func(t *testing.T) {
			got, err := GetBanksByBankCodes(testBankCountry, []string{bankCode})
			require.NoError(t, err)

			want := make([]BankIdentity, 0, len(wantNames))
			for _, name := range wantNames {
				want = append(want, BankIdentity{BankCode: bankCode, Name: name})
			}
			// wantNames is already in name order, which is the documented sort.
			assert.Equal(t, want, got)
		})
	}
}

// TestGetBanksByBankCodes_SGProductionList checks the full enabled list
// resolves, with no code dropped and no duplicate entry.
func TestGetBanksByBankCodes_SGProductionList(t *testing.T) {
	got, err := GetBanksByBankCodes(testBankCountry, sgProductionBankCodes)
	require.NoError(t, err)
	// 25 codes, but CITI/HSBC/MBBE/OCBC/SCBL cover more than one bank each.
	require.Len(t, got, 33)

	seen := make(map[BankIdentity]struct{}, len(got))
	codes := make(map[string]struct{}, len(sgProductionBankCodes))
	for _, bank := range got {
		assert.NotEmpty(t, bank.BankCode)
		assert.NotEmpty(t, bank.Name)

		if _, dup := seen[bank]; dup {
			t.Errorf("duplicate entry returned: %+v", bank)
		}
		seen[bank] = struct{}{}
		codes[bank.BankCode] = struct{}{}
	}

	gotCodes := make([]string, 0, len(codes))
	for code := range codes {
		gotCodes = append(gotCodes, code)
	}
	sort.Strings(gotCodes)

	wantCodes := append([]string(nil), sgProductionBankCodes...)
	sort.Strings(wantCodes)
	assert.Equal(t, wantCodes, gotCodes, "every enabled bank code must resolve")
}

func TestGetBanksByBankCodes_SortedByNameIndependentOfInputOrder(t *testing.T) {
	got, err := GetBanksByBankCodes(testBankCountry, sgProductionBankCodes)
	require.NoError(t, err)

	names := make([]string, 0, len(got))
	for _, bank := range got {
		names = append(names, bank.Name)
	}
	assert.True(t, sort.StringsAreSorted(names), "expected names sorted ascending, got %v", names)

	reversed := make([]string, 0, len(sgProductionBankCodes))
	for i := len(sgProductionBankCodes) - 1; i >= 0; i-- {
		reversed = append(reversed, sgProductionBankCodes[i])
	}
	reordered, err := GetBanksByBankCodes(testBankCountry, reversed)
	require.NoError(t, err)
	assert.Equal(t, got, reordered, "ordering must not depend on input order")
}

func TestGetBanksByBankCodes_DeterministicAcrossCalls(t *testing.T) {
	first, err := GetBanksByBankCodes(testBankCountry, sgProductionBankCodes)
	require.NoError(t, err)
	require.NotEmpty(t, first)

	for i := 0; i < 5; i++ {
		next, err := GetBanksByBankCodes(testBankCountry, sgProductionBankCodes)
		require.NoError(t, err)
		require.Equal(t, first, next, "GetBanksByBankCodes must be deterministic")
	}
}

// TestGetBanksByBankCodes_IN covers a data set where the bank code is an IFSC
// prefix: the sponsor bank shares its code with every co-operative and regional
// bank routed through it.
func TestGetBanksByBankCodes_IN(t *testing.T) {
	got, err := GetBanksByBankCodes("IN", []string{"idib", " IDIB "})
	require.NoError(t, err)

	assert.Equal(t, []BankIdentity{
		{BankCode: "IDIB", Name: "Indian Bank"},
		{BankCode: "IDIB", Name: "Pallavan Grama Bank"},
		{BankCode: "IDIB", Name: "Puduvai Bharathiar Grama Bank"},
		{BankCode: "IDIB", Name: "Saptagiri Grameena Bank"},
	}, got)

	// The fan-out can be much wider — HDFC sponsors hundreds of banks — so
	// callers picking a single bank must filter by name themselves.
	wide, err := GetBanksByBankCodes("IN", []string{"HDFC"})
	require.NoError(t, err)
	assert.Greater(t, len(wide), 100)
	assert.Contains(t, wide, BankIdentity{BankCode: "HDFC", Name: "HDFC Bank"})
}

// TestGetBanksByBankCodes_US guards the branch that skips records with no short
// code: US rows are keyed on routing numbers and 83 of them carry no bank code
// at all, so a routing number is not a valid lookup key.
func TestGetBanksByBankCodes_US(t *testing.T) {
	got, err := GetBanksByBankCodes("US", []string{"usbk"})
	require.NoError(t, err)
	assert.Equal(t, []BankIdentity{
		{BankCode: "USBK", Name: "U.S. BANK N.A."},
		{BankCode: "USBK", Name: "U.S. BANK NATIONAL ASSOCIATION"},
	}, got)

	_, err = GetBanksByBankCodes("US", []string{"011000138"})
	require.Error(t, err)
	assert.Contains(t, err.Error(), "unknown bank codes")
}
