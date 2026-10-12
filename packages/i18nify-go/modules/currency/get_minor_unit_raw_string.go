package currency

import (
	"fmt"
	"math"
	"strconv"
)

// GetMinorUnitRawString converts an amount in major currency units to its minor-unit
// representation as a plain decimal string, with no locale formatting, currency symbol,
// or grouping separators.
//
// Intended for protocol boundaries (proto, XML, wire formats) where a locale-formatted
// string is not acceptable.
//
// Example: GetMinorUnitRawString("USD", 100.0) → "10000"
func GetMinorUnitRawString(code string, amount interface{}) (string, error) {
	amountValue, err := ValidateAndConvertAmount(amount)
	if err != nil {
		return "", err
	}

	currencyInfo, err := GetCurrencyInformation(code)
	if err != nil {
		return "", err
	}

	minorUnit, err := strconv.ParseInt(currencyInfo.MinorUnit, 10, 64)
	if err != nil {
		return "", fmt.Errorf("invalid minor unit for currency code '%s': %v", code, err)
	}

	minorUnitMultiplier := math.Pow(10, float64(minorUnit))
	minorUnitAmount := math.Round(amountValue * minorUnitMultiplier)

	return strconv.FormatInt(int64(minorUnitAmount), 10), nil
}
