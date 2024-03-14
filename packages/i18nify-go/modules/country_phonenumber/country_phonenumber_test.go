package country_phonenumber

import (
	_ "encoding/json"
	"errors"
	"github.com/stretchr/testify/assert"
	"io/ioutil"
	"testing"
)

func TestUnmarshalCountryPhonenumber(t *testing.T) {
	jsonData, err := ioutil.ReadFile("data.json")
	result, err := UnmarshalCountryPhonenumber(jsonData)

	assert.NoError(t, err, "Unexpected error during unmarshal")

	information := result.CountryTeleInformation["IN"]
	assert.Equal(t, "+91", information.DialCode, "DialCode field mismatch")
	assert.Equal(t, "xxxx xxxxxx", information.Format, "Format field mismatch")
	assert.Equal(t, "/^(?:(?:\\+|0{0,2})91\\s*[-]?\\s*|[0]?)?[6789]\\d{9}$/", information.Regex, "Regex field mismatch")
}

func TestMarshalCountryPhonenumber(t *testing.T) {
	expectedJSON := `{"country_tele_information": {"IN": {"dial_code": "+91", "format": "xxxx xxxxxx", "regex": "/^(?:(?:\\+|0{0,2})91\\s*[-]?\\s*|[0]?)?[6789]\\d{9}$/"}}}`

	countryPhonenumber := NewCountryPhonenumber(map[string]CountryTeleInformation{
		"IN": {DialCode: "+91", Format: "xxxx xxxxxx", Regex: "/^(?:(?:\\+|0{0,2})91\\s*[-]?\\s*|[0]?)?[6789]\\d{9}$/"},
	})
	marshaledJSON, err := countryPhonenumber.Marshal()
	assert.NoError(t, err)

	assert.JSONEq(t, expectedJSON, string(marshaledJSON))
}

var readFileFunc = ioutil.ReadFile

func TestGetCountryTeleInformation(t *testing.T) {
	jsonData, err := ioutil.ReadFile("data.json")

	// Mock implementation of ioutil.ReadFile
	readFileFunc = func(filename string) ([]byte, error) {
		return jsonData, errors.New("error reading JSON file")
	}
	defer func() {
		// Restore the original implementation after the test
		readFileFunc = ioutil.ReadFile
	}()

	_, err = readFileFunc(DataFile)
	if err != nil {
		return
	}

	result := GetCountryTeleInformation("IN")

	// Use assert.Equal for assertions with inline expected values
	assert.Equal(t, "+1", result.DialCode, "DialCode field mismatch")
	assert.Equal(t, "XXX-XXX-XXXX", result.Format, "Format field mismatch")
	assert.Equal(t, "\\d{3}-\\d{3}-\\d{4}", result.Regex, "Regex field mismatch")
}
