package currency

import (
	"fmt"
	"strconv"
)

// IsZeroDecimalCurrency reports whether the given ISO 4217 currency code has no minor unit
// (i.e. minor_unit == 0). Examples: JPY, KRW, VND.
func IsZeroDecimalCurrency(currencyCode string) (bool, error) {
	return hasMinorUnit(currencyCode, 0)
}

// IsThreeDecimalCurrency reports whether the given ISO 4217 currency code has three decimal places
// (i.e. minor_unit == 3). Examples: BHD, KWD, OMR.
func IsThreeDecimalCurrency(currencyCode string) (bool, error) {
	return hasMinorUnit(currencyCode, 3)
}

func hasMinorUnit(currencyCode string, target int) (bool, error) {
	if currencyCode == "" {
		return false, fmt.Errorf("currency code cannot be empty")
	}

	info, err := GetCurrencyInformation(currencyCode)
	if err != nil {
		return false, fmt.Errorf("failed to retrieve currency information for code '%s': %v", currencyCode, err)
	}

	val, err := strconv.Atoi(info.MinorUnit)
	if err != nil {
		return false, fmt.Errorf("invalid minor unit value '%s' for currency code '%s'", info.MinorUnit, currencyCode)
	}

	return val == target, nil
}
