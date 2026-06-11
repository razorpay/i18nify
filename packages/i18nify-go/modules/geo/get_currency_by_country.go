package geo

import (
	"fmt"
	"strings"
)

// GetCurrencyByCountry returns the default ISO 4217 currency code for the given
// ISO 3166-1 alpha-2 country code (e.g. "IN" → "INR", "US" → "USD").
func GetCurrencyByCountry(countryCode string) (string, error) {
	cc := strings.ToUpper(strings.TrimSpace(countryCode))
	if cc == "" {
		return "", fmt.Errorf("countryCode is required")
	}

	if cachedCountryMetadata == nil {
		return "", fmt.Errorf("getCurrencyByCountry: country metadata not loaded")
	}

	meta := cachedCountryMetadata.GetMetadataInformation()
	info, ok := meta[cc]
	if !ok || info == nil {
		return "", fmt.Errorf("the provided country code is invalid: %q", countryCode)
	}

	currency := info.GetDefaultCurrency()
	if currency == "" {
		return "", fmt.Errorf("no default currency found for country code: %q", countryCode)
	}

	return currency, nil
}
