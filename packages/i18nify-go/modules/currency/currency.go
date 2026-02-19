// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    SupportedCurrency, err := UnmarshalCurrency(bytes)
//    bytes, err = SupportedCurrency.Marshal()

// Package currency provides functionality to handle information about currencies.
package currency

import (
	"embed"
	"encoding/json"
	"fmt"

	"golang.org/x/text/language"
	"golang.org/x/text/message"
)

type ICurrencyInfo interface {
	FormatCurrency(amount float64, locale string) (string, error)
}

//go:embed data
var currencyJsonDir embed.FS

// DataFile defines the path to the JSON data file containing currency information.
const DataFile = "data/data.json"

// Package-level cache for currency data (loaded once at package initialization)
var cachedCurrencyData *Currency

// init loads the currency data from the embedded JSON file when the package is imported.
func init() {
	currencyJsonData, err := currencyJsonDir.ReadFile(DataFile)
	if err != nil {
		panic(fmt.Sprintf("failed to read currency data file: %v", err))
	}

	data, err := UnmarshalCurrency(currencyJsonData)
	if err != nil {
		panic(fmt.Sprintf("failed to unmarshal currency data: %v", err))
	}

	cachedCurrencyData = &data
}

// UnmarshalCurrency parses JSON data into a Currency struct.
func UnmarshalCurrency(data []byte) (Currency, error) {
	var r Currency
	err := json.Unmarshal(data, &r)
	return r, err
}

// Marshal converts a Currency struct into JSON data.
func (r *Currency) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

// Currency represents information about currencies.
type Currency struct {
	// CurrencyInformation holds currency information, keyed by currency code.
	CurrencyInformation map[string]CurrencyInformation `json:"currency_information"`
}

// GetAllCurrencyInformation returns all currency information.
func (r *Currency) GetAllCurrencyInformation() map[string]CurrencyInformation {
	return r.CurrencyInformation
}

// GetCurrencyInformation retrieves currency information for a specific currency code.
func GetCurrencyInformation(code string) (CurrencyInformation, error) {
	if cachedCurrencyData == nil || cachedCurrencyData.CurrencyInformation == nil {
		return CurrencyInformation{}, fmt.Errorf("currency data not loaded")
	}
	currencyInfo, exists := cachedCurrencyData.CurrencyInformation[code]

	if !exists {
		return CurrencyInformation{}, fmt.Errorf("currency code '%s' not found", code)
	}

	return currencyInfo, nil
}

// GetCurrencyCodeByISONumericCode returns the alphabetic currency code (e.g. "USD") for the given ISO 4217 numeric code (e.g. "840").
func GetCurrencyCodeByISONumericCode(numericCode string) (string, error) {
	if cachedCurrencyData == nil || cachedCurrencyData.CurrencyInformation == nil {
		return "", fmt.Errorf("currency data not loaded")
	}
	for code, currencyInfo := range cachedCurrencyData.CurrencyInformation {
		if currencyInfo.NumericCode == numericCode {
			return code, nil
		}
	}

	return "", fmt.Errorf("currency with numeric code '%s' not found", numericCode)
}

// NewCurrency creates a new Currency instance.
func NewCurrency(currencyInformation map[string]CurrencyInformation) *Currency {
	return &Currency{
		CurrencyInformation: currencyInformation,
	}
}

// CurrencyInformation contains details about a specific currency.
type CurrencyInformation struct {
	MinorUnit                     string   `json:"minor_unit"`                      // MinorUnit represents the minor unit of the currency.
	Name                          string   `json:"name"`                            // Name represents the name of the currency.
	NumericCode                   string   `json:"numeric_code"`                    // NumericCode represents the ISO 4217 numeric code of the currency.
	PhysicalCurrencyDenominations []string `json:"physical_currency_denominations"` // PhysicalCurrencyDenominations represents the physical denominations of the currency.
	Symbol                        string   `json:"symbol"`                          // Symbol represents the symbol or abbreviation of the currency.
}

// Getters for various fields of CurrencyInformation.

// NewCurrencyInformation creates a new CurrencyInformation instance.
func NewCurrencyInformation(minorUnit string, name string, numericCode string, physicalCurrencyDenominations []string, symbol string) ICurrencyInfo {
	return &CurrencyInformation{
		MinorUnit:                     minorUnit,
		Name:                          name,
		NumericCode:                   numericCode,
		PhysicalCurrencyDenominations: physicalCurrencyDenominations,
		Symbol:                        symbol,
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

// GetCurrencySymbol retrieves the currency symbol for a specific currency code.
func (c *CurrencyInformation) FormatCurrency(amount float64, locale string) (string, error) {
	tag, err := language.Parse(locale)
	if err != nil {
		return "", err
	}

	p := message.NewPrinter(tag)

	// Format with 2 decimal places
	return p.Sprintf("%.2f", amount), nil
}
