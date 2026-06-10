package currency

// IsValidCurrencyCode reports whether code is a recognised ISO 4217 alphabetic
// currency code present in the i18nify currency dataset.
// It returns false for empty strings and codes not in the dataset.
func IsValidCurrencyCode(code string) bool {
	if code == "" {
		return false
	}
	_, exists := cachedCurrencyData.CurrencyInformation[code]
	return exists
}
