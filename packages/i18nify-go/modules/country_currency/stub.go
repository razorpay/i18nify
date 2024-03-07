// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    countryCurrency, err := UnmarshalCountryCurrency(bytes)
//    bytes, err = countryCurrency.Marshal()

package country_currency

import "encoding/json"

func UnmarshalCountryCurrency(data []byte) (CountryCurrency, error) {
	var r CountryCurrency
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *CountryCurrency) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type CountryCurrency struct {
	CurrencyInformation CurrencyInformation `json:"currency_information"`
}

func (r *CountryCurrency) GetCurrencyInformation() CurrencyInformation {
	return r.CurrencyInformation
}

func NewCountryCurrency(currencyInformation CurrencyInformation) *CountryCurrency {
	return &CountryCurrency{
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
