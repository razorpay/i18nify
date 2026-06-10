package currency

// GetCurrencyList returns all supported currency information keyed by ISO 4217 code.
// Mirrors the JS getCurrencyList function in i18nify-js/src/modules/currency/getCurrencyList.ts.
func GetCurrencyList() map[string]CurrencyInformation {
	return cachedCurrencyData.GetAllCurrencyInformation()
}
