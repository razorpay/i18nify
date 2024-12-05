// Package currency provides functionality to handle information about currencies.
package currency

import (
	"fmt"
	"math"
	"strconv"

	"github.com/razorpay/i18nify/packages/i18nify-go/modules/currency"
)

// ConvertToMajorUnit converts an amount from a minor currency unit to a major currency unit.
// For example, 100 cents to 1 dollar.
func ConvertToMajorUnit(code string, amount float64) (float64, error) {
	// Get currency information for the specified code.
	currencyInfo, err := currency.GetCurrencyInformation(code)
	if err != nil {
		return 0, err
	}

	// Convert MinorUnit to float64.
	minorUnit, err := strconv.ParseFloat(currencyInfo.MinorUnit, 64)
	if err != nil {
		return 0, fmt.Errorf("invalid minor unit for currency code '%s': %v", code, err)
	}

	// Calculate the minor unit multiplier to float64
	minorUnitMultiplier := math.Pow(10, minorUnit)
	if minorUnitMultiplier <= 0 {
		minorUnitMultiplier = 100 // Default fallback value.
		return 0, fmt.Errorf("invalid minor unit multiplier for currency code '%s'", code)
	}
	// 100 = Default fallback value.

	// Convert the amount from minor to major unit.
	majorUnitAmount := amount / minorUnitMultiplier

	return majorUnitAmount, nil
}
