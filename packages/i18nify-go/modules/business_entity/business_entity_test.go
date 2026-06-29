package business_entity

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// ---- GetBusinessCategories ----

func TestGetBusinessCategories(t *testing.T) {
	cats, err := GetBusinessCategories()
	require.NoError(t, err)
	assert.NotEmpty(t, cats)
	for _, c := range cats {
		assert.NotEmpty(t, c.Code, "every category must have a Code")
		assert.NotEmpty(t, c.Name, "every category must have a Name")
	}
}

func TestGetBusinessCategories_ContainsExpectedCodes(t *testing.T) {
	cats, err := GetBusinessCategories()
	require.NoError(t, err)

	codes := make(map[string]bool, len(cats))
	for _, c := range cats {
		codes[c.Code] = true
	}

	expected := []string{
		"SOLE_PROPRIETORSHIP",
		"PARTNERSHIP",
		"LIMITED_LIABILITY",
		"CORPORATION",
		"NON_PROFIT",
		"COOPERATIVE",
		"TRUST",
		"GOVERNMENT",
	}
	for _, code := range expected {
		assert.True(t, codes[code], "expected category code %q to be present", code)
	}
}

// ---- GetBusinessSubCategories ----

func TestGetBusinessSubCategories_Corporation(t *testing.T) {
	subs, err := GetBusinessSubCategories("CORPORATION")
	require.NoError(t, err)
	assert.NotEmpty(t, subs)
	for _, s := range subs {
		assert.NotEmpty(t, s.Code)
		assert.NotEmpty(t, s.Name)
	}
}

func TestGetBusinessSubCategories_Partnership(t *testing.T) {
	subs, err := GetBusinessSubCategories("PARTNERSHIP")
	require.NoError(t, err)
	assert.Len(t, subs, 3)

	codes := make(map[string]bool, len(subs))
	for _, s := range subs {
		codes[s.Code] = true
	}
	assert.True(t, codes["GENERAL_PARTNERSHIP"])
	assert.True(t, codes["LIMITED_PARTNERSHIP"])
	assert.True(t, codes["LIMITED_LIABILITY_PARTNERSHIP"])
}

func TestGetBusinessSubCategories_AllParentCategories(t *testing.T) {
	cats, err := GetBusinessCategories()
	require.NoError(t, err)
	for _, c := range cats {
		subs, err := GetBusinessSubCategories(c.Code)
		require.NoError(t, err, "category %q should have sub-categories", c.Code)
		assert.NotEmpty(t, subs, "category %q should have at least one sub-category", c.Code)
	}
}

func TestGetBusinessSubCategories_EmptyCode(t *testing.T) {
	_, err := GetBusinessSubCategories("")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "empty")
}

func TestGetBusinessSubCategories_UnknownCode(t *testing.T) {
	_, err := GetBusinessSubCategories("UNKNOWN_CATEGORY")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "unknown category code")
}

func TestGetBusinessSubCategories_CaseInsensitive(t *testing.T) {
	subsUpper, err := GetBusinessSubCategories("CORPORATION")
	require.NoError(t, err)
	subsLower, err := GetBusinessSubCategories("corporation")
	require.NoError(t, err)
	assert.Equal(t, subsUpper, subsLower)
}

func TestGetBusinessSubCategories_WhitespaceTrimmed(t *testing.T) {
	subs, err := GetBusinessSubCategories("  SOLE_PROPRIETORSHIP  ")
	require.NoError(t, err)
	assert.NotEmpty(t, subs)
}

// ---- GetBusinessEntityType ----

func TestGetBusinessEntityType_India(t *testing.T) {
	types, err := GetBusinessEntityType("IN")
	require.NoError(t, err)
	assert.NotEmpty(t, types)

	for _, et := range types {
		assert.NotEmpty(t, et.Code, "every entity type must have an ELF code")
		assert.NotEmpty(t, et.Name, "every entity type must have a name")
	}
}

func TestGetBusinessEntityType_US(t *testing.T) {
	types, err := GetBusinessEntityType("US")
	require.NoError(t, err)
	assert.NotEmpty(t, types)

	for _, et := range types {
		assert.NotEmpty(t, et.Code)
		assert.NotEmpty(t, et.Name)
	}
}

func TestGetBusinessEntityType_AllSupportedCountries(t *testing.T) {
	countries := []string{"IN", "US", "GB", "SG", "AU", "MY"}
	for _, cc := range countries {
		t.Run(cc, func(t *testing.T) {
			types, err := GetBusinessEntityType(cc)
			require.NoError(t, err)
			assert.NotEmpty(t, types)
		})
	}
}

func TestGetBusinessEntityType_EmptyCode(t *testing.T) {
	_, err := GetBusinessEntityType("")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "empty")
}

func TestGetBusinessEntityType_UnsupportedCountry(t *testing.T) {
	_, err := GetBusinessEntityType("ZZ")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "no entity types found")
}

func TestGetBusinessEntityType_CaseInsensitive(t *testing.T) {
	upper, err := GetBusinessEntityType("IN")
	require.NoError(t, err)
	lower, err := GetBusinessEntityType("in")
	require.NoError(t, err)
	assert.Equal(t, upper, lower)
}

func TestGetBusinessEntityType_WhitespaceTrimmed(t *testing.T) {
	types, err := GetBusinessEntityType("  US  ")
	require.NoError(t, err)
	assert.NotEmpty(t, types)
}

func TestGetBusinessEntityType_ELFFieldsValid(t *testing.T) {
	types, err := GetBusinessEntityType("IN")
	require.NoError(t, err)
	require.NotEmpty(t, types)
	for _, et := range types {
		// GLEIF ELF codes are 4-character alphanumeric (ISO 20275).
		assert.Len(t, et.Code, 4, "ELF code %q should be 4 chars", et.Code)
		assert.NotEmpty(t, et.Name, "entity %q must have a name", et.Code)
	}
}
