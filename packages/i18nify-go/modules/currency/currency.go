// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    SupportedCurrency, err := UnmarshalCurrency(bytes)
//    bytes, err = SupportedCurrency.Marshal()

// Package currency provides functionality to handle information about currencies.
package currency

import (
	"encoding/json"
	"fmt"
	"strings"

	dataSource "github.com/razorpay/i18nify/i18nify-data/go/currency"
	"golang.org/x/text/language"
	"golang.org/x/text/message"
)

type ICurrencyInfo interface {
	FormatCurrency(amount float64, locale string) (string, error)
}

// Package-level cache for currency data (loaded once at package initialization)
var cachedCurrencyData *Currency

// init loads the currency data from the externalized data package when the package is imported.
func init() {
	src, err := dataSource.GetCurrencyData()
	if err != nil {
		panic(fmt.Sprintf("failed to load currency data: %v", err))
	}

	data := convertFromDataSource(src)
	cachedCurrencyData = &data
}

// convertFromDataSource maps the proto-generated CurrencyData to the module's Currency type.
func convertFromDataSource(src *dataSource.CurrencyData) Currency {
	if src == nil {
		return Currency{}
	}
	info := make(map[string]CurrencyInformation, len(src.GetCurrencyInformation()))
	for code, ci := range src.GetCurrencyInformation() {
		if ci == nil {
			continue
		}
		info[code] = CurrencyInformation{
			Name:                          ci.GetName(),
			NumericCode:                   ci.GetNumericCode(),
			MinorUnit:                     ci.GetMinorUnit(),
			Symbol:                        ci.GetSymbol(),
			PhysicalCurrencyDenominations: ci.GetPhysicalCurrencyDenominations(),
		}
	}
	return Currency{CurrencyInformation: info}
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
	currencyInfo, exists := cachedCurrencyData.CurrencyInformation[code]

	if !exists {
		return CurrencyInformation{}, fmt.Errorf("currency code '%s' not found", code)
	}

	return currencyInfo, nil
}

// GetCurrencyCodeByISONumericCode returns the alphabetic currency code (e.g. "USD") for the given ISO 4217 numeric code (e.g. "840").
func GetCurrencyCodeByISONumericCode(numericCode string) (string, error) {
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
	SymbolPosition                string   `json:"symbol_position,omitempty"`       // SymbolPosition represents whether the symbol is prefix or suffix when available.
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

// FormatNumber formats amount as a locale-aware number or currency string.
// When opts.Currency is set the result includes the canonical i18nify currency symbol.
// Mirrors the JS formatNumber function in i18nify-js/src/modules/currency/formatNumber.ts.
func (c *Currency) FormatNumber(amount interface{}, opts NumberFormatOptions) (string, error) {
	val, err := ValidateAndConvertAmount(amount)
	if err != nil {
		return "", fmt.Errorf("parameter 'amount' is not a valid number: %v", err)
	}

	parts, err := buildRawParts(val, opts)
	if err != nil {
		return "", err
	}

	var sb strings.Builder
	for _, p := range parts {
		sb.WriteString(p.Value)
	}
	return sb.String(), nil
}

// FormatNumberByParts formats amount and returns a ByParts struct with each component separated.
// Group separators are merged into the Integer field, matching JS formatNumberByParts.
// Mirrors the JS formatNumberByParts function in i18nify-js/src/modules/currency/formatNumberByParts.ts.
func (c *Currency) FormatNumberByParts(amount interface{}, opts NumberFormatOptions) (*ByParts, error) {
	val, err := ValidateAndConvertAmount(amount)
	if err != nil {
		return nil, fmt.Errorf("parameter 'amount' is not a valid number: %v", err)
	}

	rawParts, err := buildRawParts(val, opts)
	if err != nil {
		return nil, fmt.Errorf("an error occurred while formatting the number: %v", err)
	}

	result := &ByParts{
		RawParts:       rawParts,
		IsPrefixSymbol: true,
	}

	currencyIdx := -1
	integerIdx := -1
	for i, p := range rawParts {
		if p.Type == PartCurrency && currencyIdx == -1 {
			currencyIdx = i
		}
		if p.Type == PartInteger && integerIdx == -1 {
			integerIdx = i
		}
	}
	if currencyIdx >= 0 && integerIdx >= 0 {
		result.IsPrefixSymbol = currencyIdx < integerIdx
	}

	for _, p := range rawParts {
		switch p.Type {
		case PartGroup:
			result.Integer += p.Value
		case PartInteger:
			result.Integer += p.Value
		case PartFraction:
			result.Fraction += p.Value
		case PartDecimal:
			result.Decimal += p.Value
		case PartCurrency:
			result.Currency += p.Value
		case PartPlusSign:
			result.PlusSign += p.Value
		case PartMinusSign:
			result.MinusSign += p.Value
		}
	}

	return result, nil
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
