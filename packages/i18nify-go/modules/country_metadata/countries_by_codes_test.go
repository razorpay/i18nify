package country_metadata

import (
	"sort"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGetCountriesByCodes(t *testing.T) {
	tests := []struct {
		name          string
		codes         []string
		wantCodes     []string
		wantErr       bool
		errContains   []string
		wantAllCounts bool
	}{
		{
			name:      "subset lookup returns only requested countries",
			codes:     []string{"IN", "SG", "US"},
			wantCodes: []string{"IN", "SG", "US"},
		},
		{
			name:          "nil codes returns every country",
			codes:         nil,
			wantAllCounts: true,
		},
		{
			name:          "empty codes returns every country",
			codes:         []string{},
			wantAllCounts: true,
		},
		{
			name:      "codes are matched case-insensitively and trimmed",
			codes:     []string{"in", "  sg  ", "uS"},
			wantCodes: []string{"IN", "SG", "US"},
		},
		{
			name:      "repeated codes are de-duplicated",
			codes:     []string{"IN", "in", "IN", "SG", "sg"},
			wantCodes: []string{"IN", "SG"},
		},
		{
			name:      "blank entries are skipped",
			codes:     []string{"IN", "", "   ", "SG"},
			wantCodes: []string{"IN", "SG"},
		},
		{
			name:        "unknown codes error and name every bad code",
			codes:       []string{"IN", "XK", "ZZ", "SG"},
			wantErr:     true,
			errContains: []string{"getCountriesByCodes", "unknown country codes", "XK", "ZZ"},
		},
		{
			name:        "unknown codes are reported even when every code is bad",
			codes:       []string{"QQ"},
			wantErr:     true,
			errContains: []string{"QQ"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetCountriesByCodes(tt.codes)

			if tt.wantErr {
				require.Error(t, err)
				assert.Nil(t, got, "no partial slice should be returned alongside an error")
				for _, want := range tt.errContains {
					assert.Contains(t, err.Error(), want)
				}
				return
			}

			require.NoError(t, err)

			if tt.wantAllCounts {
				assert.Len(t, got, len(cachedCountyMetaData.MetadataInformation),
					"empty/nil codes must return every country in the metadata map")
				return
			}

			gotCodes := make([]string, 0, len(got))
			for _, info := range got {
				gotCodes = append(gotCodes, info.Code)
			}
			sort.Strings(gotCodes)
			assert.Equal(t, tt.wantCodes, gotCodes)
		})
	}
}

func TestGetCountriesByCodes_PopulatesCodeAndMetadata(t *testing.T) {
	got, err := GetCountriesByCodes([]string{"IN"})
	require.NoError(t, err)
	require.Len(t, got, 1)

	assert.Equal(t, "IN", got[0].Code)
	assert.Equal(t, "India", got[0].CountryName)
	assert.Equal(t, "IND", got[0].Alpha3)
	assert.Equal(t, "356", got[0].NumericCode)
	assert.Equal(t, "+91", got[0].DialCode)
	assert.Equal(t, "INR", got[0].DefaultCurrency)
}

func TestGetCountriesByCodes_EveryEntryHasACode(t *testing.T) {
	got, err := GetCountriesByCodes(nil)
	require.NoError(t, err)
	require.NotEmpty(t, got)

	seen := make(map[string]struct{}, len(got))
	for _, info := range got {
		assert.NotEmpty(t, info.Code, "CountryInfo.Code must always be populated")

		_, dup := seen[info.Code]
		assert.False(t, dup, "country code %q returned more than once", info.Code)
		seen[info.Code] = struct{}{}

		// Every code must resolve back to the cache.
		_, ok := cachedCountyMetaData.MetadataInformation[info.Code]
		assert.True(t, ok, "returned code %q is not in the metadata map", info.Code)
	}
}

func TestGetCountriesByCodes_SortedByCountryName(t *testing.T) {
	got, err := GetCountriesByCodes([]string{"US", "IN", "SG", "AU", "GB"})
	require.NoError(t, err)
	require.Len(t, got, 5)

	names := make([]string, 0, len(got))
	for _, info := range got {
		names = append(names, info.CountryName)
	}
	assert.True(t, sort.StringsAreSorted(names), "expected names sorted ascending, got %v", names)

	// Ordering must not depend on the order of the input codes.
	reordered, err := GetCountriesByCodes([]string{"SG", "GB", "AU", "US", "IN"})
	require.NoError(t, err)
	assert.Equal(t, got, reordered)
}

func TestGetCountriesByCodes_DeterministicAcrossCalls(t *testing.T) {
	first, err := GetCountriesByCodes(nil)
	require.NoError(t, err)

	// Map iteration is randomised per run; repeated calls must still agree.
	for i := 0; i < 5; i++ {
		next, err := GetCountriesByCodes(nil)
		require.NoError(t, err)
		require.Equal(t, first, next, "GetCountriesByCodes must be deterministic")
	}

	names := make([]string, 0, len(first))
	for _, info := range first {
		names = append(names, info.CountryName)
	}
	assert.True(t, sort.StringsAreSorted(names))
}

func TestGetCountriesByCodes_ReturnsCopies(t *testing.T) {
	got, err := GetCountriesByCodes([]string{"IN"})
	require.NoError(t, err)
	require.Len(t, got, 1)

	cached := cachedCountyMetaData.MetadataInformation["IN"]
	require.NotEmpty(t, cached.SupportedCurrency)
	require.NotEmpty(t, cached.Timezones)
	require.NotEmpty(t, cached.Locales)

	originalCurrency := cached.SupportedCurrency[0]
	originalTimezoneCount := len(cached.Timezones)
	originalLocaleCount := len(cached.Locales)

	// Mutate everything the caller can reach.
	got[0].SupportedCurrency[0] = "MUTATED"
	got[0].Timezones["Mars/Olympus"] = Timezone{UTCOffset: "UTC +99:00"}
	got[0].Locales["zz_ZZ"] = Locale{Name: "Mutated"}
	got[0].CountryName = "Mutated"

	after := cachedCountyMetaData.MetadataInformation["IN"]
	assert.Equal(t, originalCurrency, after.SupportedCurrency[0])
	assert.Len(t, after.Timezones, originalTimezoneCount)
	assert.Len(t, after.Locales, originalLocaleCount)
	assert.Equal(t, "India", after.CountryName)
}

func TestGetCountriesByCodes_MatchesGetMetadataInformation(t *testing.T) {
	got, err := GetCountriesByCodes(nil)
	require.NoError(t, err)

	for _, info := range got {
		direct := GetMetadataInformation(info.Code)
		assert.Equal(t, direct.CountryName, info.CountryName)
		assert.Equal(t, direct.Alpha3, info.Alpha3)
		assert.Equal(t, direct.NumericCode, info.NumericCode)
	}
}
