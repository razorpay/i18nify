// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    countryPhonenumber, err := UnmarshalCountryPhonenumber(bytes)
//    bytes, err = countryPhonenumber.Marshal()

// Package country_phonenumber provides functionality to handle telephone number formats and regular expressions for various countries.
package country_phonenumber

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
)

// DataFile defines the path to the JSON data file containing country telephone number information.
const DataFile = "modules/country_phonenumber/data.json"

// UnmarshalCountryPhonenumber parses JSON data into a CountryPhonenumber struct.
func UnmarshalCountryPhonenumber(data []byte) (CountryPhonenumber, error) {
	var r CountryPhonenumber
	err := json.Unmarshal(data, &r)
	return r, err
}

// Marshal converts a CountryPhonenumber struct into JSON data.
func (r *CountryPhonenumber) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

// CountryPhonenumber contains telephone information for various countries.
type CountryPhonenumber struct {
	CountryTeleInformation map[string]CountryTeleInformation `json:"country_tele_information"`
}

// GetAllCountryTeleInformation returns all telephone information for all countries.
func (r *CountryPhonenumber) GetAllCountryTeleInformation() map[string]CountryTeleInformation {
	return r.CountryTeleInformation
}

// GetCountryTeleInformation retrieves telephone information for a specific country code.
func GetCountryTeleInformation(code string) CountryTeleInformation {
	// Read JSON data file containing country telephone information.
	teleJsonData, err := ioutil.ReadFile(DataFile)
	if err != nil {
		fmt.Println("Error reading JSON file:", err)
		return CountryTeleInformation{}
	}
	// Unmarshal JSON data into CountryPhonenumber struct.
	allCountryTeleInfo, _ := UnmarshalCountryPhonenumber(teleJsonData)
	// Retrieve telephone information for the specified country code.
	return allCountryTeleInfo.CountryTeleInformation[code]
}

// NewCountryPhonenumber creates a new CountryPhonenumber instance.
func NewCountryPhonenumber(countryTeleInformation map[string]CountryTeleInformation) *CountryPhonenumber {
	return &CountryPhonenumber{
		CountryTeleInformation: countryTeleInformation,
	}
}

// CountryTeleInformation contains dial code, format, and regex for telephone numbers of a specific country.
type CountryTeleInformation struct {
	DialCode string `json:"dial_code"` // DialCode represents the international dialing code for the country.
	Format   string `json:"format"`    // Format represents the format of telephone numbers in the country.
	Regex    string `json:"regex"`     // Regex represents the regular expression pattern for validating telephone numbers in the country.
}

// Getters for various fields of CountryTeleInformation.

// NewCountryTeleInformation creates a new CountryTeleInformation instance.
func NewCountryTeleInformation(dialCode string, format string, regex string) *CountryTeleInformation {
	return &CountryTeleInformation{
		DialCode: dialCode,
		Format:   format,
		Regex:    regex,
	}
}
