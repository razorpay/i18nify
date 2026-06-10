package currency

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

var amountPattern = regexp.MustCompile(`^-?\d+(\.\d+)?$`)

// IsValidAmount reports whether amount has decimal precision within the
// allowed minor units for currencyCode. It returns an error when the
// currency code is not found in the dataset.
func IsValidAmount(amount string, currencyCode string) (bool, error) {
	currencyInfo, exists := cachedCurrencyData.CurrencyInformation[currencyCode]
	if !exists {
		return false, fmt.Errorf("invalid currency code: %s", currencyCode)
	}

	trimmed := strings.TrimSpace(amount)
	if !amountPattern.MatchString(trimmed) {
		return false, nil
	}

	allowedDecimals, err := strconv.Atoi(currencyInfo.MinorUnit)
	if err != nil {
		return false, fmt.Errorf("malformed minor_unit for currency %s", currencyCode)
	}

	dotIdx := strings.Index(trimmed, ".")
	actualDecimals := 0
	if dotIdx != -1 {
		actualDecimals = len(trimmed) - dotIdx - 1
	}

	return actualDecimals <= allowedDecimals, nil
}
