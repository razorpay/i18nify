package currency

import (
	"fmt"
	"reflect"
	"strconv"
)

func ValidateAndConvertAmount(amount interface{}) (float64, error) {
	var amountValue float64
	switch v := amount.(type) {
	case float64:
		amountValue = v
	case int:
		amountValue = float64(v)
	case string:
		parsedAmount, err := strconv.ParseFloat(v, 64)
		if err != nil {
			return 0, fmt.Errorf("invalid amount value '%v': %v", v, err)
		}
		amountValue = parsedAmount
	default:
		return 0, fmt.Errorf("amount must be a number (float64, int, or string that can be parsed to float64), but got %v", reflect.TypeOf(amount))
	}

	if amountValue < 0 {
		return 0, fmt.Errorf("amount cannot be negative")
	}

	return amountValue, nil
}
