package currency

import (
	"fmt"
	"math"
	"strconv"
)

// Converts a given amount from major currency units (e.g., dollars) to minor units (e.g., cents) for a specified currency

func ConvertToMinorUnit(code string, amount interface{}) (float64, error) {

	amountValue, err := ValidateAndConvertAmount(amount)
	if err != nil {
		return 0, err
	}

	currencyInfo, err := GetCurrencyInformation(code)
	if err != nil {
		return 0, err
	}

	minorUnit, err := strconv.ParseInt(currencyInfo.MinorUnit, 10, 64)
	if err != nil {
		return 0, fmt.Errorf("invalid minor unit for currency code '%s': %v", code, err)
	}

	minorUnitMultiplier := math.Pow(10, float64(minorUnit))
	minorUnitAmount := amountValue * minorUnitMultiplier

	return minorUnitAmount, nil
}
