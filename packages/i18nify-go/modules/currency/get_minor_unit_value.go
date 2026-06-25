package currency

import (
	"fmt"
	"strconv"
)

// GetMinorUnitValue returns the number of digits after the decimal point for the given ISO 4217 currency code.
// For example: USD → 2 (cents), JPY → 0 (no minor unit), KWD → 3 (fils).
func GetMinorUnitValue(currencyCode string) (int, error) {
	if currencyCode == "" {
		return 0, fmt.Errorf("currency code cannot be empty")
	}

	info, err := GetCurrencyInformation(currencyCode)
	if err != nil {
		return 0, fmt.Errorf("failed to retrieve currency information for code '%s': %v", currencyCode, err)
	}

	val, err := strconv.Atoi(info.MinorUnit)
	if err != nil {
		return 0, fmt.Errorf("invalid minor unit value '%s' for currency code '%s'", info.MinorUnit, currencyCode)
	}

	return val, nil
}
