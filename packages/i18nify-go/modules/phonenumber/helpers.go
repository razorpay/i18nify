package phonenumber

import (
	"fmt"
	"strings"
)

// invalidPhoneErr returns the standard validation error for a missing or empty
// phoneNumber parameter, keeping the message consistent across public functions.
func invalidPhoneErr(phoneNumber string) error {
	return fmt.Errorf(
		"parameter 'phoneNumber' is invalid! The received value was: %s. Please ensure you provide a valid phone number",
		phoneNumber,
	)
}

// splitAtXBoundary splits a cleaned phone number at the boundary defined by the
// count of 'x' placeholders in pattern. Returns (prefix, local) where prefix is
// the dial-code segment (e.g. "+91") and local is the digit string that maps to
// the 'x' slots in the template.
func splitAtXBoundary(cleaned, pattern string) (prefix, local string) {
	xCount := strings.Count(pattern, "x")
	runes := []rune(cleaned)
	diff := len(runes) - xCount
	if diff < 0 {
		diff = 0
	}
	return string(runes[:diff]), string(runes[diff:])
}

// resolveCountryCode returns the best country code to use for formatting.
// It prefers provided when it has a known format template in the dataset;
// otherwise it falls back to detected.
func resolveCountryCode(provided, detected string) string {
	if GetCountryTeleInformation(provided).Format != "" {
		return provided
	}
	return detected
}
