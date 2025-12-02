// Package phonenumber provides functionality to handle telephone number formats and regular expressions for various countries.
// This package uses the generated phone-number package from proto definitions.
// All public APIs return value types (not pointers) for better API design.
package phonenumber

import (
	"fmt"
	"regexp"
	"strings"

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

// cleanPhoneNumber removes all non-numeric characters except the leading '+' sign.
func cleanPhoneNumber(phoneNumber string) string {
	if phoneNumber == "" {
		return ""
	}

	// Keep the leading '+' if present
	hasPlus := strings.HasPrefix(phoneNumber, "+")

	// Remove all non-numeric characters
	var cleaned strings.Builder
	if hasPlus {
		cleaned.WriteString("+")
	}

	for _, char := range phoneNumber {
		if char >= '0' && char <= '9' {
			cleaned.WriteRune(char)
		}
	}

	return cleaned.String()
}

// getPhoneNumberWithoutDialCode removes the dial code from a phone number.
func getPhoneNumberWithoutDialCode(phoneNumber string, dialCode string) string {
	if dialCode == "" {
		return phoneNumber
	}

	// Remove the dial code (with or without +)
	phoneNumber = strings.TrimPrefix(phoneNumber, dialCode)
	phoneNumber = strings.TrimPrefix(phoneNumber, strings.TrimPrefix(dialCode, "+"))

	return phoneNumber
}

// matchesEntirely checks if the text matches the entire regular expression pattern.
func matchesEntirely(text string, regexPattern string) bool {
	if regexPattern == "" {
		return false
	}

	// Anchor the regex to match the entire string
	pattern := fmt.Sprintf("^(?:%s)$", regexPattern)
	matched, err := regexp.MatchString(pattern, text)
	if err != nil {
		return false
	}

	return matched
}

// IsValidPhoneNumber validates whether a phone number is valid for a given country code.
// It checks if the phone number matches the regex pattern defined for that country.
// If countryCode is empty, it returns false (auto-detection not yet implemented).
func IsValidPhoneNumber(phoneNumber string, countryCode string) bool {
	// Return false if phoneNumber is empty
	if phoneNumber == "" {
		return false
	}

	// Return false if countryCode is empty (auto-detection requires dial-code-to-country mapping)
	if countryCode == "" {
		return false
	}

	// Clean the phone number
	cleanedPhoneNumber := cleanPhoneNumber(phoneNumber)
	if cleanedPhoneNumber == "" {
		return false
	}

	// Get country tele information
	countryInfo := GetCountryTeleInformation(countryCode)
	if countryInfo.Regex == "" {
		return false
	}

	// Remove dial code from phone number for validation
	phoneNumberWithoutDialCode := getPhoneNumberWithoutDialCode(cleanedPhoneNumber, countryInfo.DialCode)

	// Validate against regex pattern
	return matchesEntirely(phoneNumberWithoutDialCode, countryInfo.Regex)
}
