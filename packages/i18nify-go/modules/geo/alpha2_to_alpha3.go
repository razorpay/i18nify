package geo

import (
	"fmt"
	"strings"
)

// Alpha2ToAlpha3 converts an ISO 3166-1 alpha-2 country code to its alpha-3 equivalent.
//
// Example:
//
//	Alpha2ToAlpha3("IN")  // → "IND", nil
//	Alpha2ToAlpha3("US")  // → "USA", nil
func Alpha2ToAlpha3(countryCode string) (string, error) {
	if countryCode == "" {
		return "", fmt.Errorf("country code is required")
	}
	cc := strings.ToUpper(strings.TrimSpace(countryCode))

	if cachedCountryMetadata == nil {
		return "", fmt.Errorf("alpha2ToAlpha3: country metadata not loaded")
	}

	info, exists := cachedCountryMetadata.GetMetadataInformation()[cc]
	if !exists || info == nil {
		return "", fmt.Errorf("country code %q not found", countryCode)
	}

	alpha3 := info.GetAlpha_3()
	if alpha3 == "" {
		return "", fmt.Errorf("no alpha-3 code available for country %q", countryCode)
	}

	return alpha3, nil
}
