package currency

import "fmt"

var minorUnitNames = map[string]string{
	// Major global
	"USD": "cent", "EUR": "cent", "GBP": "penny", "JPY": "sen",
	"CHF": "rappen", "CNY": "jiao", "HKD": "cent", "SGD": "cent",
	"AUD": "cent", "NZD": "cent", "CAD": "cent",

	// South / Southeast Asia
	"INR": "paisa", "PKR": "paisa", "BDT": "poisha", "LKR": "cent",
	"NPR": "paisa", "MVR": "laari", "MYR": "sen", "THB": "satang",
	"PHP": "sentimo", "IDR": "sen", "VND": "xu", "KHR": "sen",
	"MMK": "pya",

	// East Asia
	"KRW": "jeon", "TWD": "cent",

	// Middle East / Arabic (all RTL currencies + neighbours)
	"AED": "fils", "AFN": "pul", "BHD": "fils", "DZD": "centime",
	"EGP": "piastre", "IQD": "fils", "IRR": "dinar", "JOD": "fils",
	"KWD": "fils", "LBP": "piastre", "LYD": "dirham", "MAD": "centime",
	"OMR": "baisa", "QAR": "dirham", "SAR": "halala", "SDG": "piastre",
	"SYP": "piastre", "TND": "millime", "YER": "fils", "ILS": "agora",
	"TRY": "kuruş",

	// Europe
	"NOK": "øre", "SEK": "öre", "DKK": "øre", "PLN": "grosz",
	"CZK": "haléř", "HUF": "fillér", "RON": "ban", "RUB": "kopek",
	"UAH": "kopiyka", "HRK": "lipa", "BGN": "stotinka",

	// Americas
	"BRL": "centavo", "MXN": "centavo", "ARS": "centavo", "CLP": "centavo",
	"COP": "centavo", "PEN": "céntimo",

	// Africa
	"ZAR": "cent", "KES": "cent", "NGN": "kobo", "GHS": "pesewa",
	"ETB": "santim", "TZS": "cent", "XOF": "centime", "XAF": "centime",
}

// GetMinorUnitName returns the English name of the minor unit for the given currency code
// (e.g. "cent" for USD, "fils" for BHD, "paisa" for INR).
// Returns ("", nil) when the currency is valid but its subunit name is not in the lookup table.
func GetMinorUnitName(currencyCode string) (string, error) {
	if currencyCode == "" {
		return "", fmt.Errorf("currency code cannot be empty")
	}
	if _, err := GetCurrencyInformation(currencyCode); err != nil {
		return "", fmt.Errorf("failed to retrieve currency information for code '%s': %v", currencyCode, err)
	}
	return minorUnitNames[currencyCode], nil
}
