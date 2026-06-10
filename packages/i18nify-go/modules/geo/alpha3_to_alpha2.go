package geo

import (
	"fmt"
	"strings"
)

// Alpha3ToAlpha2 converts an ISO 3166-1 alpha-3 country code to its alpha-2 equivalent.
//
// Example:
//
//	Alpha3ToAlpha2("IND")  // → "IN", nil
//	Alpha3ToAlpha2("USA")  // → "US", nil
func Alpha3ToAlpha2(alpha3Code string) (string, error) {
	normalised := strings.ToUpper(strings.TrimSpace(alpha3Code))
	if normalised == "" {
		return "", fmt.Errorf("alpha-3 code is required")
	}

	if cachedCountryMetadata == nil {
		return "", fmt.Errorf("alpha3ToAlpha2: country metadata not loaded")
	}

	for cc, info := range cachedCountryMetadata.GetMetadataInformation() {
		if info != nil && strings.ToUpper(info.GetAlpha_3()) == normalised {
			return cc, nil
		}
	}

	return "", fmt.Errorf("alpha-3 code %q not found", alpha3Code)
}
