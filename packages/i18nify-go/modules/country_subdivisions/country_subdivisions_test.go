package country_subdivisions

import (
	"reflect"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetCountrySubdivisions(t *testing.T) {
	subDivData := GetCountrySubdivisions("IN")

	assert.Equal(t, "India", subDivData.GetCountryName())
	states := subDivData.GetStates()["KA"]
	assert.Equal(t, "Karnataka", states.GetName())
	assertIsArray(t, states.GetCities())
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

	marshaledJSON, err := data.Marshal()
	assert.NoError(t, err)
	assert.JSONEq(t, expectedJSON, string(marshaledJSON))
}

func assertIsArray(t *testing.T, value interface{}) {
	t.Helper()
	if reflect.TypeOf(value).Kind() != reflect.Array && reflect.TypeOf(value).Kind() != reflect.Slice {
		t.Errorf("Expected an array or slice, but got %T", value)
	}
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
