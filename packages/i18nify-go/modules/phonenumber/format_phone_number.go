package phonenumber

import (
	"fmt"
	"strings"
)

// FormatPhoneNumber formats phoneNumber according to the format template stored
// for countryCode in the dataset. When countryCode is empty or absent from the
// dataset, the country is auto-detected from the number's dial code prefix.
//
// Algorithm (mirrors the JS formatPhoneNumber function exactly):
//  1. Validate and clean the input.
//  2. Resolve the effective country code.
//  3. Count the 'x' placeholders in the format template.
//  4. Slice off everything after the diff = len(phone) - xCount characters
//     as the "prefix" (e.g. "+91"), and the remainder as the digits to format.
//  5. Walk the template: replace each 'x' with the next digit, copy separators
//     literally, then join prefix + " " + formatted and trim whitespace.
func FormatPhoneNumber(phoneNumber string, countryCode string) (string, error) {
	if phoneNumber == "" {
		return "", fmt.Errorf(
			"parameter 'phoneNumber' is invalid! The received value was: %s. Please ensure you provide a valid phone number",
			phoneNumber,
		)
	}

	cleaned := cleanPhoneNumber(phoneNumber)

	// Resolve effective country code.
	activeCC := countryCode
	if GetCountryTeleInformation(activeCC).Format == "" {
		activeCC, _ = detectCountryAndDialCodeFromPhone(cleaned)
	}

	info := GetCountryTeleInformation(activeCC)
	pattern := info.Format

	// No format pattern available — return the cleaned number as-is.
	if pattern == "" {
		return cleaned, nil
	}

	// Count 'x' placeholders in the pattern.
	xCount := strings.Count(pattern, "x")

	// diff is the length of the prefix that sits before the formatted segment.
	// e.g. for "+917394926646" (len=13) and pattern "xxxx xxxxxx" (10 x's): diff=3.
	diff := len([]rune(cleaned)) - xCount
	if diff < 0 {
		diff = 0
	}
	runes := []rune(cleaned)
	phoneWithoutPrefix := runes[diff:] // digits that map to 'x' slots

	// Fill the pattern.
	result := make([]rune, 0, len([]rune(pattern)))
	digitIdx := 0
	for _, ch := range pattern {
		if ch == 'x' {
			if digitIdx < len(phoneWithoutPrefix) {
				result = append(result, phoneWithoutPrefix[digitIdx])
				digitIdx++
			}
		} else {
			result = append(result, ch)
		}
	}

	// Prefix (e.g. "+91") + space + formatted segment, trimmed.
	prefix := string(runes[:diff])
	formatted := strings.TrimSpace(prefix + " " + string(result))
	return formatted, nil
}
