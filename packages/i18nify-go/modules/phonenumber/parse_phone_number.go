package phonenumber

import (
	"fmt"
)

// PhoneInfo holds the structured result of parsing a phone number.
// It mirrors the JS PhoneInfo interface returned by parsePhoneNumber.
type PhoneInfo struct {
	// CountryCode is the ISO 3166-1 alpha-2 country code (e.g. "US", "IN").
	CountryCode string `json:"countryCode"`
	// DialCode is the international dialling prefix including '+' (e.g. "+1", "+91").
	DialCode string `json:"dialCode"`
	// FormattedPhoneNumber is the number formatted according to the country template.
	FormattedPhoneNumber string `json:"formattedPhoneNumber"`
	// FormatTemplate is the raw 'x'-placeholder template used for formatting (e.g. "xxx-xxx-xxxx").
	FormatTemplate string `json:"formatTemplate"`
	// PhoneNumber is the local subscriber number (dial code and prefix stripped).
	PhoneNumber string `json:"phoneNumber"`
}

// ParsePhoneNumber parses phoneNumber, auto-detects or validates the country,
// and returns a PhoneInfo with the dial code, formatted number, format template,
// and the local subscriber number. An error is returned when phoneNumber is empty.
//
// The country parameter is optional (pass "" to auto-detect). When provided, it
// is used as the country code only if it has a format entry in the dataset;
// otherwise the detected country is used. The dial code always comes from
// auto-detection, not from the country override — mirroring the JS behaviour.
//
// Mirrors the JS parsePhoneNumber function exactly.
func ParsePhoneNumber(phoneNumber string, country string) (PhoneInfo, error) {
	if phoneNumber == "" {
		return PhoneInfo{}, fmt.Errorf(
			"parameter 'phoneNumber' is invalid! The received value was: %s. Please ensure you provide a valid phone number",
			phoneNumber,
		)
	}

	cleaned := cleanPhoneNumber(phoneNumber)

	// Detect country/dial code from the phone number itself (dial code is always detected).
	detectedCC, detectedDC := detectCountryAndDialCodeFromPhone(cleaned)
	dialCode := detectedDC

	// Resolve effective country code: prefer the explicit parameter when the
	// dataset has a format entry for it, otherwise fall back to detection.
	activeCC := detectedCC
	if country != "" && GetCountryTeleInformation(country).Format != "" {
		activeCC = country
	}

	// Format the number.
	formattedPhoneNumber, err := FormatPhoneNumber(cleaned, activeCC)
	if err != nil {
		// FormatPhoneNumber only errors on empty input, which we've already
		// guarded against, so this path should not be reached in normal usage.
		formattedPhoneNumber = cleaned
	}

	info := GetCountryTeleInformation(activeCC)
	pattern := info.Format

	// When no pattern is available, return the raw cleaned number in all fields.
	if pattern == "" {
		return PhoneInfo{
			CountryCode:          activeCC,
			DialCode:             dialCode,
			FormattedPhoneNumber: cleaned,
			FormatTemplate:       "",
			PhoneNumber:          cleaned,
		}, nil
	}

	// Count 'x' placeholders to determine the local subscriber number.
	xCount := 0
	for _, ch := range pattern {
		if ch == 'x' {
			xCount++
		}
	}
	diff := len([]rune(cleaned)) - xCount
	if diff < 0 {
		diff = 0
	}
	localNumber := string([]rune(cleaned)[diff:])

	return PhoneInfo{
		CountryCode:          activeCC,
		DialCode:             dialCode,
		FormattedPhoneNumber: formattedPhoneNumber,
		FormatTemplate:       pattern,
		PhoneNumber:          localNumber,
	}, nil
}
