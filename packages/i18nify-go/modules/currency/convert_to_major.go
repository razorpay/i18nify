package currency

import (
	"fmt"
	"math"
	"strconv"
)

// Converts given amount from minor (e.g., paise) to major unit (e.g., rupees) for a specified currency

func ConvertToMajorUnit(code string, amount interface{}) (float64, error) {

	amountValue, err := ValidateAndConvertAmount(amount)
	if err != nil {
		return 0, err
	}

	currencyInfo, err := GetCurrencyInformation(code)
	if err != nil {
		return 0, err
	}

	minorUnit, err := strconv.ParseFloat(currencyInfo.MinorUnit, 64)
	if err != nil {
		return 0, fmt.Errorf("invalid minor unit for currency code '%s': %v", code, err)
	}

	minorUnitMultiplier := math.Pow(10, minorUnit)
	if minorUnitMultiplier <= 0 {
		return 0, fmt.Errorf("invalid minor unit multiplier for currency code '%s'", code)
	}

	majorUnitAmount := amountValue / minorUnitMultiplier

	return majorUnitAmount, nil
}
