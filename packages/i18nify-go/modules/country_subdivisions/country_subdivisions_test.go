package country_subdivisions

import (
	"encoding/json"
	"reflect"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetCountrySubdivisions(t *testing.T) {
	tests := []struct {
		countryCode     string
		countryName     string
		sampleStateCode string
		sampleStateName string
	}{
		{countryCode: "IN", countryName: "India", sampleStateCode: "KA", sampleStateName: "Karnataka"},
		{countryCode: "MY", countryName: "Malaysia", sampleStateCode: "1", sampleStateName: "Johor"},
		{countryCode: "US", countryName: "United States", sampleStateCode: "TX", sampleStateName: "Texas"},
		// SG has no administrative subdivisions; omit sampleStateCode
		{countryCode: "SG", countryName: "Singapore"},
	}

	for _, tt := range tests {
		t.Run(tt.countryCode, func(t *testing.T) {
			subDivData := GetCountrySubdivisions(tt.countryCode)

			assert.Equal(t, tt.countryName, subDivData.GetCountryName())
			assert.NotEmpty(t, subDivData.GetStates())

			if tt.sampleStateCode != "" {
				state, exists := subDivData.GetStateByStateCode(tt.sampleStateCode)
				assert.True(t, exists)
				assert.Equal(t, tt.sampleStateName, state.GetName())
				assertIsArray(t, state.GetCities())
				assert.NotEmpty(t, state.GetCities())
			} else {
				for _, state := range subDivData.GetStates() {
					assertIsArray(t, state.GetCities())
					assert.NotEmpty(t, state.GetCities())
					break
				}
			}
		})
	}
}

func TestMarshalCountrySubdivisions(t *testing.T) {
	var expectedJSON = `{"country_name": "India", "states": {"KA": {"name": "Karnataka", "cities": {"Bengaluru" : {"name": "Bengaluru", "timezone": "Asia/Kolkata", "zipcodes": ["560018", "560116", "560500"], "region_name/district_name": "nan"}}}}}`

	data := CountrySubdivisions{
		CountryName: "India",
		States: map[string]State{
			"KA": {
				Cities: map[string]City{
					"Bengaluru": {Name: "Bengaluru", RegionName: "nan", Timezone: "Asia/Kolkata", Zipcodes: []string{"560018", "560116", "560500"}},
				},
				Name: "Karnataka",
			},
		},
	}

	marshaledJSON, err := json.Marshal(data)
	assert.NoError(t, err)
	assert.JSONEq(t, expectedJSON, string(marshaledJSON))
}

func TestGetStateByStateCode(t *testing.T) {
	data := CountrySubdivisions{
		CountryName: "India",
		States: map[string]State{
			"KA": {Name: "Karnataka"},
			"MH": {Name: "Maharashtra"},
		},
	}

	// Test: Valid state code
	state, exists := data.GetStateByStateCode("KA")
	assert.True(t, exists, "State should exist for valid state code")
	assert.Equal(t, "Karnataka", state.GetName())

	// Test: Invalid state code
	state, exists = data.GetStateByStateCode("TN")
	assert.False(t, exists, "State should not exist for invalid state code")
	assert.Equal(t, State{}, state, "State should be empty for invalid state code")
}


func assertIsArray(t *testing.T, value interface{}) {
	t.Helper()
	if reflect.TypeOf(value).Kind() != reflect.Array && reflect.TypeOf(value).Kind() != reflect.Slice {
		t.Errorf("Expected an array or slice, but got %T", value)
	}
}
