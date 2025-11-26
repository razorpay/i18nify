// Code generated from JSON Schema. DO NOT EDIT.
package currency

// CurrencyInfo represents the structure of currency data
type CurrencyInfo struct {
    Name                          string   `json:"name"`
    NumericCode                   string   `json:"numeric_code"`
    MinorUnit                     string   `json:"minor_unit"`
    Symbol                        string   `json:"symbol"`
    PhysicalCurrencyDenominations []string `json:"physical_currency_denominations"`
}
