// Package currency provides functionality to handle information about currencies.
// This package uses the generated currency package from proto definitions.
// All public APIs return value types (not pointers) for better API design.
package currency

import (
	"fmt"

	// Import the generated currency package
	dataSource "github.com/razorpay/i18nify/i18nify-data/go/currency"
)

// CurrencyInfo is a value type that mirrors the proto-generated CurrencyInfo.
// We use a separate struct instead of exposing pointers from the generated package.
type CurrencyInfo struct {
	Name                          string   `json:"name,omitempty"`
	NumericCode                   string   `json:"numeric_code,omitempty"`
	MinorUnit                     string   `json:"minor_unit,omitempty"`
	Symbol                        string   `json:"symbol,omitempty"`
	PhysicalCurrencyDenominations []string `json:"physical_currency_denominations,omitempty"`
}

// CurrencyInformation is a type alias for backward compatibility.
type CurrencyInformation = CurrencyInfo

// GetCurrencyInformation retrieves currency information for a specific currency code.
// It uses the generated package's GetData() function and returns a value type (not pointer).
func GetCurrencyInformation(code string) (CurrencyInformation, error) {
	data := dataSource.GetData()
	currencyInfo, exists := data[code]
	if !exists {
		return CurrencyInformation{}, fmt.Errorf("currency code '%s' not found", code)
	}
	if currencyInfo == nil {
		return CurrencyInformation{}, fmt.Errorf("currency info for code '%s' is nil", code)
	}
	// Copy from pointer type to value type
	return CurrencyInfo{
		Name:                          currencyInfo.Name,
		NumericCode:                   currencyInfo.NumericCode,
		MinorUnit:                     currencyInfo.MinorUnit,
		Symbol:                        currencyInfo.Symbol,
		PhysicalCurrencyDenominations: currencyInfo.PhysicalCurrencyDenominations,
	}, nil
}

// NewCurrencyInformation creates a new CurrencyInformation instance.
func NewCurrencyInformation(minorUnit string, name string, numericCode string, physicalCurrencyDenominations []string, symbol string) *CurrencyInformation {
	return &CurrencyInformation{
		Name:                          name,
		NumericCode:                   numericCode,
		MinorUnit:                     minorUnit,
		Symbol:                        symbol,
		PhysicalCurrencyDenominations: physicalCurrencyDenominations,
	}
}

// Currency represents information about currencies (for backward compatibility).
type Currency struct {
	CurrencyInformation map[string]CurrencyInformation `json:"currency_information"`
}

// GetAllCurrencyInformation returns all currency information.
func (r *Currency) GetAllCurrencyInformation() map[string]CurrencyInformation {
	return r.CurrencyInformation
}

// NewCurrency creates a new Currency instance.
func NewCurrency(currencyInformation map[string]CurrencyInformation) *Currency {
	return &Currency{
		CurrencyInformation: currencyInformation,
	}
}

// GetCurrencySymbol retrieves the currency symbol for a specific currency code.
func GetCurrencySymbol(currencyCode string) (string, error) {
	// Validate the input code.
	if currencyCode == "" {
		return "", fmt.Errorf("currency code cannot be empty")
	}

	// Retrieve currency information for the specified code.
	currencyInfo, err := GetCurrencyInformation(currencyCode)
	if err != nil {
		return "", fmt.Errorf("failed to retrieve currency information for code '%s': %v", currencyCode, err)
	}

	// Validate the currency symbol.
	if currencyInfo.Symbol == "" {
		return "", fmt.Errorf("currency symbol for code '%s' is not available", currencyCode)
	}

	return currencyInfo.Symbol, nil
}
