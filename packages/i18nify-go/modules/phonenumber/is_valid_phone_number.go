package phonenumber

// IsValidPhoneNumber reports whether phoneNumber is valid for the given
// countryCode. When countryCode is empty or not present in the dataset the
// country is auto-detected from the number's dial code prefix.
//
// Mirrors the JS isValidPhoneNumber function:
//   - Clean the number (strip non-digits, preserve leading '+').
//   - Resolve the effective country code: use the provided code if it exists
//     in the data, otherwise fall back to auto-detection.
//   - Strip the dial code, then test the remainder against the country's regex.
func IsValidPhoneNumber(phoneNumber string, countryCode string) bool {
	if phoneNumber == "" {
		return false
	}

	cleaned := cleanPhoneNumber(phoneNumber)
	// An empty result or a bare '+' carries no usable digits.
	if cleaned == "" || cleaned == "+" {
		return false
	}

	// Auto-detect country and dial code (used as fallback below).
	detectedCC, _ := detectCountryAndDialCodeFromPhone(cleaned)

	// Prefer the explicitly provided code when it has a regex entry in the data;
	// otherwise fall back to the detected code.
	activeCC := countryCode
	if GetCountryTeleInformation(countryCode).Regex == "" {
		activeCC = detectedCC
	}

	if activeCC == "" {
		return false
	}

	info := GetCountryTeleInformation(activeCC)
	if info.Regex == "" {
		return false
	}

	numWithoutDialCode := getPhoneNumberWithoutDialCode(cleaned)
	return matchesEntirely(numWithoutDialCode, info.Regex)
}
