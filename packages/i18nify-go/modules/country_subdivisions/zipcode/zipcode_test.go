package zipcode

import (
	"testing"

	"github.com/razorpay/i18nify/packages/i18nify-go/modules/country_subdivisions"
	"github.com/stretchr/testify/assert"
)

func getTestCountrySubdivisions() country_subdivisions.CountrySubdivisions {
	return country_subdivisions.CountrySubdivisions{
		CountryName: "India",
		States: map[string]country_subdivisions.State{
			"KA": {
				Name: "Karnataka",
				Cities: []country_subdivisions.City{
					{Name: "Bengaluru", Timezone: "Asia/Kolkata", Zipcodes: []string{"560018", "560116"}},
					{Name: "Mysore", Timezone: "Asia/Kolkata", Zipcodes: []string{"570001"}},
				},
			},
			"MH": {
				Name: "Maharashtra",
				Cities: []country_subdivisions.City{
					{Name: "Mumbai", Timezone: "Asia/Kolkata", Zipcodes: []string{"400001"}},
					{Name: "Pune", Timezone: "Asia/Kolkata", Zipcodes: []string{"560116"}},
				},
			},
		},
	}
}

func setupTestData() {
	subdivision := getTestCountrySubdivisions()
	zipCodeStore["IN"] = initializeZipCodeMap(subdivision)
}

func TestGetStatesFromZipCode(t *testing.T) {
	setupTestData()

	states := GetStatesFromZipCode("560116", "IN")
	assert.Equal(t, 2, len(states))
	assert.Equal(t, "Karnataka", states[0].Name)
	assert.Equal(t, "Maharashtra", states[1].Name)

	states = GetStatesFromZipCode("400001", "IN")
	assert.Equal(t, 1, len(states))
	assert.Equal(t, "Maharashtra", states[0].Name)

	states = GetStatesFromZipCode("570001", "IN")
	assert.Equal(t, 1, len(states))
	assert.Equal(t, "Karnataka", states[0].Name)

	// Test case with invalid country code
	states = GetStatesFromZipCode("570001", "IND")
	assert.Equal(t, 0, len(states), "Invalid country code should not break and return empty array")
}

func TestGetCitiesFromZipCode(t *testing.T) {
	setupTestData()

	cities := GetCitiesFromZipCode("560116", "IN")
	assert.Equal(t, 2, len(cities))
	assert.Equal(t, "Bengaluru", cities[0].Name)
	assert.Equal(t, "Pune", cities[1].Name)

	cities = GetCitiesFromZipCode("400001", "IN")
	assert.Equal(t, 1, len(cities))
	assert.Equal(t, "Mumbai", cities[0].Name)

	cities = GetCitiesFromZipCode("570001", "IN")
	assert.Equal(t, 1, len(cities))
	assert.Equal(t, "Mysore", cities[0].Name)
}

func TestIsValidPinCode(t *testing.T) {
	setupTestData()

	assert.True(t, IsValidPinCode("560116", "IN"))
	assert.True(t, IsValidPinCode("400001", "IN"))
	assert.False(t, IsValidPinCode("999999", "IN"))
	assert.False(t, IsValidPinCode("123456", "IN"))
}

func TestGetPinCodesFromCity(t *testing.T) {
	setupTestData()

	pincodes := GetPinCodesFromCity("Bengaluru", "IN")
	assert.Equal(t, 2, len(pincodes))
	assert.Contains(t, pincodes, "560018")
	assert.Contains(t, pincodes, "560116")

	pincodes = GetPinCodesFromCity("Mumbai", "IN")
	assert.Equal(t, 1, len(pincodes))
	assert.Equal(t, "400001", pincodes[0])

	pincodes = GetPinCodesFromCity("Indore", "IN")
	assert.Equal(t, 0, len(pincodes)) // City not present in test data

	pincodes = GetPinCodesFromCity("Pune", "IN")
	assert.Equal(t, 1, len(pincodes))
	assert.Equal(t, "560116", pincodes[0])
}

// Benchmark test for GetStatesFromZipCode
func BenchmarkGetStatesFromZipCode(b *testing.B) {
	b.ResetTimer()
	zipCode := []string{
		"110001", "110002", "110003", "110007", "110092", "400001", "400011", "400080", "411001", "411004",
		"560001", "560017", "560034", "570001", "577101", "600001", "600020", "600017", "641001", "625001",
		"700001", "700019", "700091", "713103", "734001", "201301", "202001", "221001", "226001", "281001",
		"302001", "313001", "342001", "312001", "331001", "380001", "390001", "395001", "360001", "382421",
		"141001", "143001", "160017", "147001", "144001", "800001", "812001", "845438", "854301", "852113",
	}
	n := len(zipCode)
	for i := 0; i < b.N; i++ {
		GetStatesFromZipCode(zipCode[i%n], "IN")
	}
}

// Benchmark test for GetCitiesFromZipCode
func BenchmarkGetCitiesFromZipCode(b *testing.B) {
	b.ResetTimer()
	zipCode := []string{
		"110001", "110002", "110003", "110007", "110092", "400001", "400011", "400080", "411001", "411004",
		"560001", "560017", "560034", "570001", "577101", "600001", "600020", "600017", "641001", "625001",
		"700001", "700019", "700091", "713103", "734001", "201301", "202001", "221001", "226001", "281001",
		"302001", "313001", "342001", "312001", "331001", "380001", "390001", "395001", "360001", "382421",
		"141001", "143001", "160017", "147001", "144001", "800001", "812001", "845438", "854301", "852113",
	}
	n := len(zipCode)
	for i := 0; i < b.N; i++ {
		GetCitiesFromZipCode(zipCode[i%n], "IN")
	}
}

// Benchmark test for IsValidPinCode
func BenchmarkIsValidPinCode(b *testing.B) {
	b.ResetTimer()
	zipCode := []string{
		"110001", "110002", "110003", "110007", "110092", "400001", "400011", "400080", "411001", "411004",
		"560001", "560017", "560034", "570001", "577101", "600001", "600020", "600017", "641001", "625001",
		"700001", "700019", "700091", "713103", "734001", "201301", "202001", "221001", "226001", "281001",
		"302001", "313001", "342001", "312001", "331001", "380001", "390001", "395001", "360001", "382421",
		"141001", "143001", "160017", "147001", "144001", "800001", "812001", "845438", "854301", "852113",
	}
	n := len(zipCode)
	for i := 0; i < b.N; i++ {
		IsValidPinCode(zipCode[i%n], "IN")
	}
}
