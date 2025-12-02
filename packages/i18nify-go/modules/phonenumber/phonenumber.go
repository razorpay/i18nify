// Package phonenumber provides functionality to handle telephone number formats and regular expressions for various countries.
// This package uses the generated phone-number package from proto definitions.
// All public APIs return value types (not pointers) for better API design.
package phonenumber

import (
	// Import the generated phone-number package
	genphonenumber "github.com/razorpay/i18nify/i18nify-data/go/phone-number"
)

// CountryTeleInformation is a value type that mirrors the proto-generated CountryTeleInformation.
// We use a separate struct instead of exposing pointers from the generated package.
type CountryTeleInformation struct {
	DialCode string `json:"dial_code"` // DialCode represents the international dialing code for the country.
	Format   string `json:"format"`    // Format represents the format of telephone numbers in the country.
	Regex    string `json:"regex"`     // Regex represents the regular expression pattern for validating telephone numbers in the country.
}

// GetCountryTeleInformation retrieves telephone information for a specific country code.
// It uses the generated package's GetData() function and returns a value type (not pointer).
func GetCountryTeleInformation(code string) CountryTeleInformation {
	if code == "" {
		return CountryTeleInformation{}
	}

	data := genphonenumber.GetData()
	phoneInfo, exists := data[code]
	if !exists {
		return CountryTeleInformation{}
	}
	if phoneInfo == nil {
		return CountryTeleInformation{}
	}
	// Copy from pointer type to value type
	return CountryTeleInformation{
		DialCode: phoneInfo.DialCode,
		Format:   phoneInfo.Format,
		Regex:    phoneInfo.Regex,
	}
}

// NewCountryTeleInformation creates a new CountryTeleInformation instance.
func NewCountryTeleInformation(dialCode string, format string, regex string) *CountryTeleInformation {
	return &CountryTeleInformation{
		DialCode: dialCode,
		Format:   format,
		Regex:    regex,
	}
}

// PhoneNumber contains telephone information for various countries (for backward compatibility).
type PhoneNumber struct {
	CountryTeleInformation map[string]CountryTeleInformation `json:"country_tele_information"`
}

// GetAllCountryTeleInformation returns all telephone information for all countries.
func (r *PhoneNumber) GetAllCountryTeleInformation() map[string]CountryTeleInformation {
	return r.CountryTeleInformation
}

// NewPhoneNumber creates a new PhoneNumber instance.
func NewPhoneNumber(countryTeleInformation map[string]CountryTeleInformation) *PhoneNumber {
	return &PhoneNumber{
		CountryTeleInformation: countryTeleInformation,
	}
}
