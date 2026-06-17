package geo

import (
	"fmt"
	"strings"
)

// ConvertCountryCode is a bidirectional ISO 3166-1 country code converter.
// It detects the input format by length and converts in the appropriate direction:
//   - 2-letter alpha-2 → 3-letter alpha-3  ("IN"  → "IND")
//   - 3-letter alpha-3 → 2-letter alpha-2  ("IND" → "IN")
func ConvertCountryCode(countryCode string) (string, error) {
	normalised := strings.ToUpper(strings.TrimSpace(countryCode))
	if normalised == "" {
		return "", fmt.Errorf("country code is required")
	}

	switch len(normalised) {
	case 2:
		return Alpha2ToAlpha3(normalised)
	case 3:
		return Alpha3ToAlpha2(normalised)
	default:
		return "", fmt.Errorf("invalid country code length %d for %q: expected 2 (alpha-2) or 3 (alpha-3)", len(normalised), countryCode)
	}
}
