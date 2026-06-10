package phonenumber

import (
	"fmt"
	"strings"
)

// FormatE164 formats phoneNumber into E.164 international format (+[calling code][national number]).
//
// When countryCode is provided, the dial code is looked up from the dataset and
// prepended to the national number. If phoneNumber already carries an international
// prefix (starts with '+'), the function verifies that it matches the expected
// dial code for countryCode and normalises it by stripping non-digit characters.
//
// Examples:
//
//	FormatE164("IN", "9876543210")       → "+919876543210", nil
//	FormatE164("IN", "+91 98765 43210")  → "+919876543210", nil
//	FormatE164("US", "6502530000")       → "+16502530000",  nil
func FormatE164(countryCode string, phoneNumber string) (string, error) {
	if phoneNumber == "" {
		return "", fmt.Errorf(
			"parameter 'phoneNumber' is invalid! The received value was: %q. Please ensure you provide a valid phone number",
			phoneNumber,
		)
	}
	if countryCode == "" {
		return "", fmt.Errorf(
			"parameter 'countryCode' is invalid! The received value was: %q. Please ensure you provide a valid country code",
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
		// Number already has an international prefix — verify it matches.
		digits := cleaned[1:]
		if !strings.HasPrefix(digits, callingDigits) {
			return "", fmt.Errorf(
				"phone number %q does not match country code %q (expected calling code %s)",
				phoneNumber, countryCode, info.DialCode,
			)
		}
		return "+" + digits, nil
	}

	// National number — prepend the calling code.
	return "+" + callingDigits + cleaned, nil
}
