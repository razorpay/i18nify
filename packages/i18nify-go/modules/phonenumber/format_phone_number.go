package phonenumber

import "strings"

// FormatPhoneNumber formats phoneNumber according to the format template stored
// for countryCode in the dataset. When countryCode is empty or absent from the
// dataset, the country is auto-detected from the number's dial code prefix.
//
// Algorithm (mirrors the JS formatPhoneNumber function exactly):
//  1. Validate and clean the input.
//  2. Resolve the effective country code.
//  3. Split at the 'x' boundary to get the dial-code prefix and local digits.
//  4. Walk the template: replace each 'x' with the next digit, copy separators
//     literally, then join prefix + " " + formatted and trim whitespace.
func FormatPhoneNumber(phoneNumber string, countryCode string) (string, error) {
	if phoneNumber == "" {
		return "", invalidPhoneErr(phoneNumber)
	}

	cleaned := cleanPhoneNumber(phoneNumber)

	detectedCC, _ := detectCountryAndDialCodeFromPhone(cleaned)
	activeCC := resolveCountryCode(countryCode, detectedCC)

	info := GetCountryTeleInformation(activeCC)
	pattern := info.Format

	// No format pattern available — return the cleaned number as-is.
	if pattern == "" {
		return cleaned, nil
	}

	prefix, local := splitAtXBoundary(cleaned, pattern)
	localRunes := []rune(local)

	// Fill the pattern.
	result := make([]rune, 0, len([]rune(pattern)))
	digitIdx := 0
	for _, ch := range pattern {
		if ch == 'x' {
			if digitIdx < len(localRunes) {
				result = append(result, localRunes[digitIdx])
				digitIdx++
			}
		} else {
			result = append(result, ch)
		}
	}

	formatted := strings.TrimSpace(prefix + " " + string(result))
	return formatted, nil
}
