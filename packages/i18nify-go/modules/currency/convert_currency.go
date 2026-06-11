package currency

import (
	"fmt"
	"math"
	"strconv"
)

// ConvertCurrency converts an amount from one currency to another using the provided exchange rate.
// The result is rounded to the number of decimal places defined by toCurrency's minor unit.
//
// Example:
//
//	ConvertCurrency(100.0, "USD", "JPY", 149.50)  // → 14950, nil  (JPY: 0 decimal places)
//	ConvertCurrency(100.0, "USD", "KWD", 0.307)   // → 30.7, nil   (KWD: 3 decimal places)
func ConvertCurrency(amount float64, fromCurrency string, toCurrency string, exchangeRate float64) (float64, error) {
	if fromCurrency == "" {
		return 0, fmt.Errorf("fromCurrency cannot be empty")
	}
	if toCurrency == "" {
		return 0, fmt.Errorf("toCurrency cannot be empty")
	}
	if exchangeRate <= 0 {
		return 0, fmt.Errorf("exchangeRate must be a positive number, got %v", exchangeRate)
	}

	if _, err := GetCurrencyInformation(fromCurrency); err != nil {
		return 0, fmt.Errorf("invalid fromCurrency: %v", err)
	}

	toInfo, err := GetCurrencyInformation(toCurrency)
	if err != nil {
		return 0, fmt.Errorf("invalid toCurrency: %v", err)
	}

	toMinorUnit, err := strconv.Atoi(toInfo.MinorUnit)
	if err != nil {
		return 0, fmt.Errorf("invalid minor unit for currency '%s': %v", toCurrency, err)
	}

	multiplier := math.Pow(10, float64(toMinorUnit))
	return math.Round(amount*exchangeRate*multiplier) / multiplier, nil
}
