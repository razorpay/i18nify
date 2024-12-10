package currency

import (
	"fmt"
	"math"
	"strconv"
)

func ConvertToMinorUnit(code string, amount interface{}) (float64, error) {

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
	minorUnitAmount := amountValue * minorUnitMultiplier

	return minorUnitAmount, nil
}
