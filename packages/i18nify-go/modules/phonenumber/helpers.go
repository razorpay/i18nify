package phonenumber

import (
	"errors"
	"fmt"
	"strings"
)

// Sentinel errors returned by FormatPhoneNumber and ParsePhoneNumber.
var (
	ErrEmptyPhoneNumber   = errors.New("phone number must not be empty")
	ErrInvalidPhoneNumber = errors.New("phone number contains no valid digits")
	ErrUnknownCountryCode = errors.New("country code not found in dataset")
)

// phoneContext holds the validated and resolved data produced by preprocessPhone.
// All three public functions consume it instead of repeating the same preamble.
type phoneContext struct {
	Cleaned    string // cleaned phone number (leading '+' preserved)
	ActiveCC   string // resolved country code (provided or auto-detected)
	DetectedDC string // dial code detected from the number's prefix (e.g. "+91")
}

// preprocessPhone validates phoneNumber, cleans it, auto-detects the country,
// and resolves the effective country code. It is the single source of truth for
// input validation shared by FormatPhoneNumber, IsValidPhoneNumber, and ParsePhoneNumber.
func preprocessPhone(phoneNumber, countryCode string) (phoneContext, error) {
	if phoneNumber == "" {
		return phoneContext{}, ErrEmptyPhoneNumber
	}

	cleaned := cleanPhoneNumber(phoneNumber)
	if cleaned == "" || cleaned == "+" {
		return phoneContext{}, fmt.Errorf("%w: %q", ErrInvalidPhoneNumber, phoneNumber)
	}

	detectedCC, detectedDC := detectCountryAndDialCodeFromPhone(cleaned)

	if countryCode != "" && GetCountryTeleInformation(countryCode).Format == "" {
		if detectedCC == "" {
			return phoneContext{}, fmt.Errorf("%w: %q", ErrUnknownCountryCode, countryCode)
		}
	}

	return phoneContext{
		Cleaned:    cleaned,
		ActiveCC:   resolveCountryCode(countryCode, detectedCC),
		DetectedDC: detectedDC,
	}, nil
}

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
