package currency

import "fmt"

// GetDenomination returns the list of physical currency denominations for the given ISO 4217 currency code.
// Denominations are returned as strings (e.g. ["1", "5", "10", "50", "100"]).
func GetDenomination(currencyCode string) ([]string, error) {
	if currencyCode == "" {
		return nil, fmt.Errorf("currency code cannot be empty")
	}

	info, err := GetCurrencyInformation(currencyCode)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve currency information for code '%s': %v", currencyCode, err)
	}

	return info.PhysicalCurrencyDenominations, nil
}
