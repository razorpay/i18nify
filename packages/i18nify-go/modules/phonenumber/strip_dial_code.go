package phonenumber

import (
	"fmt"
	"strings"
)

// StripDialCode strips the international dial code for countryCode from phoneNumber
// and returns the national subscriber number.
//
// If phoneNumber has no leading '+', it is already a national number and is
// returned cleaned (non-digit characters removed).
// Returns an error when phoneNumber carries a '+' prefix that does not match
// the dial code for the given countryCode.
//
// Examples:
//
//	StripDialCode("IN", "+919876543210")    → "9876543210", nil
//	StripDialCode("US", "+16502530000")     → "6502530000",  nil
//	StripDialCode("IN", "9876543210")       → "9876543210", nil  (already national)
func StripDialCode(countryCode string, phoneNumber string) (string, error) {
	if phoneNumber == "" {
		return "", fmt.Errorf(
			"parameter 'phoneNumber' is invalid! The received value was: %q",
			phoneNumber,
		)
	}
	if countryCode == "" {
		return "", fmt.Errorf(
			"parameter 'countryCode' is invalid! The received value was: %q",
			countryCode,
		)
	}

	info := GetCountryTeleInformation(countryCode)
	if info.DialCode == "" {
		return "", fmt.Errorf("country code %q not found in phone number data", countryCode)
	}

	cleaned := cleanPhoneNumber(phoneNumber)
	callingDigits := strings.TrimPrefix(info.DialCode, "+") // e.g. "91"

	if strings.HasPrefix(cleaned, "+") {
		if !strings.HasPrefix(cleaned[1:], callingDigits) {
			return "", fmt.Errorf(
				"phone number %q does not start with dial code %s for country %q",
				phoneNumber, info.DialCode, countryCode,
			)
		}
		return cleaned[1+len(callingDigits):], nil
	}

	return cleaned, nil
}
