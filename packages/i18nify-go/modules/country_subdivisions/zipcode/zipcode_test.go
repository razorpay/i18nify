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
