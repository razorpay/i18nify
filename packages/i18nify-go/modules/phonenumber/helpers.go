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

// phoneContext holds validated and resolved data shared across all three public functions.
type phoneContext struct {
	Cleaned    string // cleaned phone number (leading '+' preserved)
	ActiveCC   string // resolved country code (provided or auto-detected)
	DetectedDC string // dial code detected from the number's prefix (e.g. "+91")
}

// preprocessPhone validates, cleans, and resolves the country code for a phone number.
// It is the single validation entry point for FormatPhoneNumber, IsValidPhoneNumber, and ParsePhoneNumber.
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

// invalidPhoneErr returns a standard validation error for an empty or missing phoneNumber.
func invalidPhoneErr(phoneNumber string) error {
	return fmt.Errorf(
		"parameter 'phoneNumber' is invalid! The received value was: %s. Please ensure you provide a valid phone number",
		phoneNumber,
	)
}

// splitAtXBoundary splits cleaned at the 'x'-count boundary of pattern.
// Returns (prefix, local) where prefix is the dial-code segment and local maps to 'x' slots.
func splitAtXBoundary(cleaned, pattern string) (prefix, local string) {
	xCount := strings.Count(pattern, "x")
	runes := []rune(cleaned)
	diff := len(runes) - xCount
	if diff < 0 {
		diff = 0
	}
	return string(runes[:diff]), string(runes[diff:])
}

// resolveCountryCode returns provided if it has a format entry in the dataset;
// otherwise returns detected.
func resolveCountryCode(provided, detected string) string {
	if GetCountryTeleInformation(provided).Format != "" {
		return provided
	}
	return detected
}
