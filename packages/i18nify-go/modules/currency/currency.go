// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    Currency, err := UnmarshalCurrency(bytes)
//    bytes, err = Currency.Marshal()

package currency

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
)

const DataFile = "modules/currency/data.json"

func UnmarshalCurrency(data []byte) (Currency, error) {
	var r Currency
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *Currency) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type Currency struct {
	CurrencyInformation map[string]CurrencyInformation `json:"currency_information"`
}

func (r *Currency) GetAllCurrencyInformation() map[string]CurrencyInformation {
	return r.CurrencyInformation
}

func GetCurrencyInformation(code string) CurrencyInformation {
	currencyJsonData, err := ioutil.ReadFile(DataFile)
	if err != nil {
		fmt.Println("Error reading JSON file:", err)
		return CurrencyInformation{}
	}
	allCurrencyData, _ := UnmarshalCurrency(currencyJsonData)
	return allCurrencyData.CurrencyInformation[code]
}

func NewCurrency(currencyInformation map[string]CurrencyInformation) *Currency {
	return &Currency{
		CurrencyInformation: currencyInformation,
	}
}

type CurrencyInformation struct {
	MinorUnit                     string   `json:"minor_unit"`
	Name                          string   `json:"name"`
	NumericCode                   string   `json:"numeric_code"`
	PhysicalCurrencyDenominations []string `json:"physical_currency_denominations"`
	Symbol                        string   `json:"symbol"`
}

func (r *CurrencyInformation) GetMinorUnit() string {
	return r.MinorUnit
}

func (r *CurrencyInformation) GetName() string {
	return r.Name
}

func (r *CurrencyInformation) GetNumericCode() string {
	return r.NumericCode
}

func (r *CurrencyInformation) GetPhysicalCurrencyDenominations() []string {
	return r.PhysicalCurrencyDenominations
}

func (r *CurrencyInformation) GetSymbol() string {
	return r.Symbol
}

func NewCurrencyInformation(minorUnit string, name string, numericCode string, physicalCurrencyDenominations []string, symbol string) *CurrencyInformation {
	return &CurrencyInformation{
		MinorUnit:                     minorUnit,
		Name:                          name,
		NumericCode:                   numericCode,
		PhysicalCurrencyDenominations: physicalCurrencyDenominations,
		Symbol:                        symbol,
	}
}
