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

	dataSource "github.com/razorpay/i18nify/i18nify-data/go/phone-number/country-code-to-phone-number"
)

// cachedPhoneData holds phone data loaded once at package initialization.
var cachedPhoneData *PhoneNumber

func init() {
	src, err := dataSource.GetCountryPhoneData()
	if err != nil {
		panic(fmt.Sprintf("failed to load phone number data: %v", err))
	}
	data := convertFromDataSource(src)
	cachedPhoneData = &data
}

// convertFromDataSource maps proto-generated CountryPhoneData to the module's PhoneNumber type.
func convertFromDataSource(src *dataSource.CountryPhoneData) PhoneNumber {
	if src == nil {
		return PhoneNumber{}
	}
	info := make(map[string]CountryTeleInformation, len(src.GetCountryTeleInformation()))
	for code, pi := range src.GetCountryTeleInformation() {
		if pi == nil {
			continue
		}
		info[code] = CountryTeleInformation{
			DialCode: pi.GetDialCode(),
			Format:   pi.GetFormat(),
			Regex:    pi.GetRegex(),
		}
	}
	return PhoneNumber{CountryTeleInformation: info}
}

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
	if code == "" {
		return CountryTeleInformation{}
	}
	info, exists := cachedPhoneData.CountryTeleInformation[code]
	if !exists {
		return CountryTeleInformation{}
	}
	return info
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
