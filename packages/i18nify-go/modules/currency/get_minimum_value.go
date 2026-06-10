package currency

import (
	"fmt"
	"strconv"
)

// minimumValueMap holds minimum transaction amounts in minor units per ISO 4217 currency code.
// Source: Stripe's published minimum charge amounts (https://stripe.com/docs/currencies).
// For currencies not listed here GetMinimumValue falls back to a default derived from minor_unit:
//   minor_unit == 0  →  1
//   minor_unit >= 1  →  50
var minimumValueMap = map[string]int{
	"AED": 200,
	"ARS": 50,
	"AUD": 50,
	"BRL": 50,
	"CAD": 50,
	"CHF": 50,
	"COP": 50,
	"CZK": 1500,
	"DKK": 250,
	"EUR": 50,
	"GBP": 30,
	"HKD": 400,
	"HUF": 17500,
	"IDR": 50,
	"ILS": 50,
	"INR": 50,
	"JPY": 50,
	"KRW": 50,
	"MXN": 1000,
	"MYR": 200,
	"NOK": 300,
	"NZD": 50,
	"PHP": 50,
	"PLN": 200,
	"RON": 200,
	"RUB": 50,
	"SEK": 300,
	"SGD": 50,
	"THB": 1000,
	"USD": 50,
	"ZAR": 50,
}

// GetMinimumValue returns the minimum transaction amount in minor units for the given ISO 4217 currency code.
//
// For the 31 most common payment currencies, explicit values are used (sourced from Stripe).
// For all other valid currency codes a default is computed from the currency's minor unit:
//   - minor_unit == 0: returns 1
//   - minor_unit >= 1: returns 50
//
// Examples:
//
//	GetMinimumValue("USD")  → 50    (50 cents)
//	GetMinimumValue("GBP")  → 30    (30 pence)
//	GetMinimumValue("HUF")  → 17500 (175 forints)
//	GetMinimumValue("XOF")  → 1     (0-decimal currency, fallback)
//	GetMinimumValue("AFN")  → 50    (2-decimal currency, fallback)
func GetMinimumValue(currencyCode string) (int, error) {
	if currencyCode == "" {
		return 0, fmt.Errorf("currency code cannot be empty")
	}

	if explicit, ok := minimumValueMap[currencyCode]; ok {
		return explicit, nil
	}

	info, err := GetCurrencyInformation(currencyCode)
	if err != nil {
		return 0, fmt.Errorf("failed to retrieve currency information for code %q: %v", currencyCode, err)
	}

	minorUnit, err := strconv.Atoi(info.MinorUnit)
	if err != nil {
		return 0, fmt.Errorf("invalid minor_unit value %q for currency %q", info.MinorUnit, currencyCode)
	}

	if minorUnit == 0 {
		return 1, nil
	}
	return 50, nil
}
