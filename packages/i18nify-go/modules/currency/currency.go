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
	"path/filepath"
	"runtime"
)

//go:embed data
var currencyJsonDir embed.FS

// DataFile defines the path to the JSON data file containing currency information.
const DataFile = "data/data.json"

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
func GetCurrencyInformation(code string) CurrencyInformation {
	// Read JSON data file containing currency information.
	_, fileName, _, ok := runtime.Caller(0)
	if !ok {
		fmt.Println("Error getting current file directory")
		return CurrencyInformation{}
	}
	currencyJsonData, err := currencyJsonDir.ReadFile(filepath.Join(filepath.Dir(fileName), DataFile))
	if err != nil {
		// Handle error reading the file.
		fmt.Println("Error reading JSON file:", err)
		return CurrencyInformation{}
	}
	// Unmarshal JSON data into SupportedCurrency struct.
	allCurrencyData, _ := UnmarshalCurrency(currencyJsonData)
	// Retrieve currency information for the specified currency code.
	return allCurrencyData.CurrencyInformation[code]
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
func NewCurrencyInformation(minorUnit string, name string, numericCode string, physicalCurrencyDenominations []string, symbol string) *CurrencyInformation {
	return &CurrencyInformation{
		MinorUnit:                     minorUnit,
		Name:                          name,
		NumericCode:                   numericCode,
		PhysicalCurrencyDenominations: physicalCurrencyDenominations,
		Symbol:                        symbol,
	}
}
