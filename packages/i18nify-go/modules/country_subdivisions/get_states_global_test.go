package country_subdivisions

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// ── GetStatesByCountry ────────────────────────────────────────────────────────

func TestGetStatesByCountry_Shape(t *testing.T) {
	data, err := GetStatesByCountry("US")
	require.NoError(t, err)
	assert.NotEmpty(t, data.CountryName)
	assert.NotEmpty(t, data.Subdivisions)
}

func TestGetStatesByCountry_CountryName(t *testing.T) {
	data, err := GetStatesByCountry("US")
	require.NoError(t, err)
	assert.Contains(t, data.CountryName, "United States")
}

func TestGetStatesByCountry_USCount(t *testing.T) {
	data, err := GetStatesByCountry("US")
	require.NoError(t, err)
	assert.Len(t, data.Subdivisions, 51)
}

func TestGetStatesByCountry_SubdivisionShape(t *testing.T) {
	data, err := GetStatesByCountry("US")
	require.NoError(t, err)
	for _, s := range data.Subdivisions {
		assert.NotEmpty(t, s.Code)
		assert.NotEmpty(t, s.Name)
	}
}

func TestGetStatesByCountry_ISO3166_2Codes(t *testing.T) {
	data, err := GetStatesByCountry("US")
	require.NoError(t, err)
	for _, s := range data.Subdivisions {
		assert.Contains(t, s.Code, "-", "code should follow CC-XX ISO 3166-2 format")
	}
}

func TestGetStatesByCountry_KnownEntry(t *testing.T) {
	data, err := GetStatesByCountry("US")
	require.NoError(t, err)
	var ca *SubdivisionInfo
	for i := range data.Subdivisions {
		if data.Subdivisions[i].Code == "US-CA" {
			ca = &data.Subdivisions[i]
			break
		}
	}
	require.NotNil(t, ca, "US-CA (California) should be present")
	assert.Equal(t, "California", ca.Name)
}

func TestGetStatesByCountry_India(t *testing.T) {
	data, err := GetStatesByCountry("IN")
	require.NoError(t, err)
	assert.Contains(t, data.CountryName, "India")
	assert.Greater(t, len(data.Subdivisions), 20)
}

func TestGetStatesByCountry_Germany(t *testing.T) {
	data, err := GetStatesByCountry("DE")
	require.NoError(t, err)
	assert.Len(t, data.Subdivisions, 16)
}

func TestGetStatesByCountry_LowercaseInput(t *testing.T) {
	lower, err := GetStatesByCountry("us")
	require.NoError(t, err)
	upper, err := GetStatesByCountry("US")
	require.NoError(t, err)
	assert.Equal(t, upper, lower)
}

func TestGetStatesByCountry_EmptyInput(t *testing.T) {
	_, err := GetStatesByCountry("")
	assert.Error(t, err)
}

func TestGetStatesByCountry_UnknownCode(t *testing.T) {
	_, err := GetStatesByCountry("ZZ")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "no subdivision data")
}

// ── GetStatesByCountriesMap ───────────────────────────────────────────────────

func TestGetStatesByCountriesMap_Count(t *testing.T) {
	m, err := GetStatesByCountriesMap()
	require.NoError(t, err)
	assert.Equal(t, 228, len(m))
}

func TestGetStatesByCountriesMap_EntryShape(t *testing.T) {
	m, err := GetStatesByCountriesMap()
	require.NoError(t, err)
	for _, v := range m {
		assert.NotEmpty(t, v.Subdivisions)
	}
}

func TestGetStatesByCountriesMap_ContainsLargeCountries(t *testing.T) {
	m, err := GetStatesByCountriesMap()
	require.NoError(t, err)
	for _, cc := range []string{"US", "IN", "DE", "JP", "CN"} {
		assert.Contains(t, m, cc)
	}
}

func TestGetStatesByCountriesMap_USHas51(t *testing.T) {
	m, err := GetStatesByCountriesMap()
	require.NoError(t, err)
	assert.Len(t, m["US"].Subdivisions, 51)
	assert.Contains(t, m["US"].CountryName, "United States")
}
