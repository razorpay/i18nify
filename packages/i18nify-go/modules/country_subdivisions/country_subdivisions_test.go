package country_subdivisions

import (
	"errors"
	"github.com/stretchr/testify/assert"
	"os"
	"reflect"
	"testing"
)

var testJSONData = []byte(`{"country_name": "India", "states": {"KA": {"name": "Karnataka", "cities": [{"name": "Bengaluru", "timezone": "Asia/Kolkata", "zipcodes": ["560018", "560116", "560500"], "region_name/district_name": "nan"}]}}}`)

func TestUnmarshalCountrySubdivisions(t *testing.T) {
	jsonData, err := os.ReadFile("IN.json")
	subDivData, err := UnmarshalCountrySubdivisions(jsonData)
	assert.NoError(t, err, "Unexpected error during unmarshal")

	assert.Equal(t, "India", subDivData.GetCountryName())
	states := subDivData.GetStates()["KA"]
	assert.Equal(t, "Karnataka", states.GetName())
	assertIsArray(t, states.GetCities())
}

func TestMarshalCountrySubdivisions(t *testing.T) {
	var expectedJSON = `{"country_name": "India", "states": {"KA": {"name": "Karnataka", "cities": [{"name": "Bengaluru", "timezone": "Asia/Kolkata", "zipcodes": ["560018", "560116", "560500"], "region_name/district_name": "nan"}]}}}`

	data := CountrySubdivisions{
		CountryName: "India",
		States: map[string]State{
			"KA": {
				Cities: []City{
					{Name: "Bengaluru", RegionName: "nan", Timezone: "Asia/Kolkata", Zipcodes: []string{"560018", "560116", "560500"}},
				},
				Name: "Karnataka",
			},
		},
	}

	marshaledJSON, err := data.Marshal()
	assert.NoError(t, err)
	assert.JSONEq(t, expectedJSON, string(marshaledJSON))

}

var readFileFunc = os.ReadFile

func TestGetCountrySubdivisions(t *testing.T) {
	jsonData, err := os.ReadFile("IN.json")

	// Mock implementation of os.ReadFile
	readFileFunc = func(filename string) ([]byte, error) {
		return jsonData, errors.New("error reading JSON file")
	}
	defer func() {
		// Restore the original implementation after the test
		readFileFunc = os.ReadFile
	}()

	_, err = readFileFunc(DataFile)
	if err != nil {
		return
	}

	subDivData := GetCountrySubdivisions("IN")

	assert.Equal(t, "India", subDivData.GetCountryName())
	states := subDivData.GetStates()["KA"]
	assert.Equal(t, "Karnataka", states.GetName())
	assertIsArray(t, states)
}

func assertIsArray(t *testing.T, value interface{}) {
	t.Helper()
	if reflect.TypeOf(value).Kind() != reflect.Array && reflect.TypeOf(value).Kind() != reflect.Slice {
		t.Errorf("Expected an array or slice, but got %T", value)
	}
}
