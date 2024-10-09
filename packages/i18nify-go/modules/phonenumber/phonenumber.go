// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    phoneNumber, err := UnmarshalPhoneNumber(bytes)
//    bytes, err = countryPhonenumber.Marshal()

// Package phonenumber provides functionality to handle telephone number formats and regular expressions for various countries.
package phonenumber

import (
	"encoding/json"
	"fmt"
	"os"
)

// DataFile defines the path to the JSON data file containing country telephone number information.
const DataFile = "data/data.json"

// UnmarshalPhoneNumber parses JSON data into a PhoneNumber struct.
func UnmarshalPhoneNumber(data []byte) (PhoneNumber, error) {
	var r PhoneNumber
	err := json.Unmarshal(data, &r)
	return r, err
}

// Marshal converts a PhoneNumber struct into JSON data.
func (r *PhoneNumber) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

// PhoneNumber contains telephone information for various countries.
type PhoneNumber struct {
	CountryTeleInformation map[string]CountryTeleInformation `json:"country_tele_information"`
}

// GetAllCountryTeleInformation returns all telephone information for all countries.
func (r *PhoneNumber) GetAllCountryTeleInformation() map[string]CountryTeleInformation {
	return r.CountryTeleInformation
}

// GetCountryTeleInformation retrieves telephone information for a specific country code.
func GetCountryTeleInformation(code string) CountryTeleInformation {
	teleJsonData, err := os.ReadFile(DataFile)
	if err != nil {
		fmt.Println("Error reading JSON file:", err)
		return CountryTeleInformation{}
	}
	// Unmarshal JSON data into PhoneNumber struct.
	allCountryTeleInfo, _ := UnmarshalPhoneNumber(teleJsonData)
	// Retrieve telephone information for the specified country code.
	return allCountryTeleInfo.CountryTeleInformation[code]
}

// NewPhoneNumber creates a new PhoneNumber instance.
func NewPhoneNumber(countryTeleInformation map[string]CountryTeleInformation) *PhoneNumber {
	return &PhoneNumber{
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
