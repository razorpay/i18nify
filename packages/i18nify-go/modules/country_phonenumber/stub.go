// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    countryPhonenumber, err := UnmarshalCountryPhonenumber(bytes)
//    bytes, err = countryPhonenumber.Marshal()

package country_phonenumber

import "encoding/json"

func UnmarshalCountryPhonenumber(data []byte) (CountryPhonenumber, error) {
	var r CountryPhonenumber
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *CountryPhonenumber) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type CountryPhonenumber struct {
	CountryTeleInformation map[string]CountryTeleInformation `json:"country_tele_information"`
}

func (r *CountryPhonenumber) GetCountryTeleInformation() map[string]CountryTeleInformation {
	return r.CountryTeleInformation
}

func NewCountryPhonenumber(countryTeleInformation map[string]CountryTeleInformation) *CountryPhonenumber {
	return &CountryPhonenumber{
		CountryTeleInformation: countryTeleInformation,
	}
}

type CountryTeleInformation struct {
	DialCode string `json:"dial_code"`
	Format   string `json:"format"`
	Regex    string `json:"regex"`
}

func (r *CountryTeleInformation) GetDialCode() string {
	return r.DialCode
}

func (r *CountryTeleInformation) GetFormat() string {
	return r.Format
}

func (r *CountryTeleInformation) GetRegex() string {
	return r.Regex
}

func NewCountryTeleInformation(dialCode string, format string, regex string) *CountryTeleInformation {
	return &CountryTeleInformation{
		DialCode: dialCode,
		Format:   format,
		Regex:    regex,
	}
}
