package currency

import "fmt"

// GetISONumericCode returns the ISO 4217 three-digit numeric code string for
// the given alphabetic currency code (e.g. "USD" → "840", "INR" → "356").
//
// The returned value is a zero-padded string as defined by ISO 4217
// (e.g. "008" for ALL, not "8"). It returns an error when the code is not
// found in the dataset.
func GetISONumericCode(currencyCode string) (string, error) {
	info, exists := cachedCurrencyData.CurrencyInformation[currencyCode]
	if !exists {
		return "", fmt.Errorf("invalid currency code: %q", currencyCode)
	}
	return info.NumericCode, nil
}
