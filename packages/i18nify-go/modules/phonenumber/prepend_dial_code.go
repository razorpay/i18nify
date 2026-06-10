package phonenumber

import (
	"fmt"
	"strings"
)

// PrependDialCode prepends the international dial code for countryCode to phoneNumber.
//
// If phoneNumber already carries the correct '+' prefix it is returned normalised
// (non-digit characters stripped). Returns an error when phoneNumber carries a '+'
// prefix that belongs to a different country.
//
// Examples:
//
//	PrependDialCode("IN", "9876543210")       → "+919876543210", nil
//	PrependDialCode("IN", "+91 98765 43210")  → "+919876543210", nil
//	PrependDialCode("US", "6502530000")       → "+16502530000",  nil
func PrependDialCode(countryCode string, phoneNumber string) (string, error) {
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
				"phone number %q has a different dial code prefix (expected %s for country %q)",
				phoneNumber, info.DialCode, countryCode,
			)
		}
		return cleaned, nil
	}

	return "+" + callingDigits + cleaned, nil
}
