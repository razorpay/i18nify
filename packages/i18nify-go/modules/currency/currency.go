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
	"math"
	"regexp"
	"strconv"
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

var (
	nonCurrencyCharRe = regexp.MustCompile(`[^0-9.,-]`)
	amountPattern     = regexp.MustCompile(`^-?\d+(\.\d+)?$`)
)

// minimumValueMap holds minimum transaction amounts in minor units per ISO 4217 currency code.
// Source: Stripe's published minimum charge amounts.
// For currencies not listed here GetMinimumValue falls back to a default derived from minor_unit:
//   - minor_unit == 0 returns 1
//   - minor_unit >= 1 returns 50
var minimumValueMap = map[string]int{
	"AED": 200,
	"ARS": 50,
	"AUD": 50,
	"BRL": 50,
	"CAD": 50,
	"CHF": 50,
	"COP": 50,
	"CZK": 1500,
	"DKK": 250,
	"EUR": 50,
	"GBP": 30,
	"HKD": 400,
	"HUF": 17500,
	"IDR": 50,
	"ILS": 50,
	"INR": 50,
	"JPY": 50,
	"KRW": 50,
	"MXN": 1000,
	"MYR": 200,
	"NOK": 300,
	"NZD": 50,
	"PHP": 50,
	"PLN": 200,
	"RON": 200,
	"RUB": 50,
	"SEK": 300,
	"SGD": 50,
	"THB": 1000,
	"USD": 50,
	"ZAR": 50,
}

var minorUnitNames = map[string]string{
	// Major global
	"USD": "cent", "EUR": "cent", "GBP": "penny", "JPY": "sen",
	"CHF": "rappen", "CNY": "jiao", "HKD": "cent", "SGD": "cent",
	"AUD": "cent", "NZD": "cent", "CAD": "cent",

	// South / Southeast Asia
	"INR": "paisa", "PKR": "paisa", "BDT": "poisha", "LKR": "cent",
	"NPR": "paisa", "MVR": "laari", "MYR": "sen", "THB": "satang",
	"PHP": "sentimo", "IDR": "sen", "VND": "xu", "KHR": "sen",
	"MMK": "pya",

	// East Asia
	"KRW": "jeon", "TWD": "cent",

	// Middle East / Arabic currencies and neighbours
	"AED": "fils", "AFN": "pul", "BHD": "fils", "DZD": "centime",
	"EGP": "piastre", "IQD": "fils", "IRR": "dinar", "JOD": "fils",
	"KWD": "fils", "LBP": "piastre", "LYD": "dirham", "MAD": "centime",
	"OMR": "baisa", "QAR": "dirham", "SAR": "halala", "SDG": "piastre",
	"SYP": "piastre", "TND": "millime", "YER": "fils", "ILS": "agora",
	"TRY": "kuruş",

	// Europe
	"NOK": "øre", "SEK": "öre", "DKK": "øre", "PLN": "grosz",
	"CZK": "haléř", "HUF": "fillér", "RON": "ban", "RUB": "kopek",
	"UAH": "kopiyka", "HRK": "lipa", "BGN": "stotinka",

	// Americas
	"BRL": "centavo", "MXN": "centavo", "ARS": "centavo", "CLP": "centavo",
	"COP": "centavo", "PEN": "céntimo",

	// Africa
	"ZAR": "cent", "KES": "cent", "NGN": "kobo", "GHS": "pesewa",
	"ETB": "santim", "TZS": "cent", "XOF": "centime", "XAF": "centime",
}

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

// GetDenomination returns the list of physical currency denominations for the given ISO 4217 currency code.
// Denominations are returned as strings, for example ["1", "5", "10", "50", "100"].
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

// GetISONumericCode returns the ISO 4217 three-digit numeric code string for
// the given alphabetic currency code, for example "USD" to "840".
func GetISONumericCode(currencyCode string) (string, error) {
	info, exists := cachedCurrencyData.CurrencyInformation[currencyCode]
	if !exists {
		return "", fmt.Errorf("invalid currency code: %q", currencyCode)
	}
	return info.NumericCode, nil
}

// GetMinimumValue returns the minimum transaction amount in minor units for the given ISO 4217 currency code.
func GetMinimumValue(currencyCode string) (int, error) {
	if currencyCode == "" {
		return 0, fmt.Errorf("currency code cannot be empty")
	}

	if explicit, ok := minimumValueMap[currencyCode]; ok {
		return explicit, nil
	}

	info, err := GetCurrencyInformation(currencyCode)
	if err != nil {
		return 0, fmt.Errorf("failed to retrieve currency information for code %q: %v", currencyCode, err)
	}

	minorUnit, err := strconv.Atoi(info.MinorUnit)
	if err != nil {
		return 0, fmt.Errorf("invalid minor_unit value %q for currency %q", info.MinorUnit, currencyCode)
	}

	if minorUnit == 0 {
		return 1, nil
	}
	return 50, nil
}

// GetMinorUnitName returns the English name of the minor unit for the given currency code.
// It returns ("", nil) when the currency is valid but its subunit name is not in the lookup table.
func GetMinorUnitName(currencyCode string) (string, error) {
	if currencyCode == "" {
		return "", fmt.Errorf("currency code cannot be empty")
	}
	if _, err := GetCurrencyInformation(currencyCode); err != nil {
		return "", fmt.Errorf("failed to retrieve currency information for code '%s': %v", currencyCode, err)
	}
	return minorUnitNames[currencyCode], nil
}

// IsValidCurrencyCode reports whether code is a recognised ISO 4217 alphabetic
// currency code present in the i18nify currency dataset.
func IsValidCurrencyCode(code string) bool {
	if code == "" {
		return false
	}
	_, exists := cachedCurrencyData.CurrencyInformation[code]
	return exists
}

// IsValidAmount reports whether amount has decimal precision within the
// allowed minor units for currencyCode.
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

// ConvertStringToMinorUnit parses a locale-formatted currency string and returns
// the equivalent amount in minor units for the given currency code.
func ConvertStringToMinorUnit(code string, amount string) (int64, error) {
	currencyInfo, err := GetCurrencyInformation(code)
	if err != nil {
		return 0, err
	}

	minorUnit, err := strconv.ParseInt(currencyInfo.MinorUnit, 10, 64)
	if err != nil {
		return 0, fmt.Errorf("invalid minor unit for currency code '%s': %v", code, err)
	}

	cleaned := nonCurrencyCharRe.ReplaceAllString(strings.TrimSpace(amount), "")
	if cleaned == "" {
		return 0, fmt.Errorf("invalid amount string '%s': could not extract a numeric value", amount)
	}

	lastComma := strings.LastIndex(cleaned, ",")
	lastPeriod := strings.LastIndex(cleaned, ".")
	hasBoth := lastComma != -1 && lastPeriod != -1

	var normalised string
	switch {
	case hasBoth:
		if lastComma > lastPeriod {
			normalised = strings.ReplaceAll(cleaned, ".", "")
			normalised = strings.Replace(normalised, ",", ".", 1)
		} else {
			normalised = strings.ReplaceAll(cleaned, ",", "")
		}
	case lastComma != -1:
		digitsAfter := int64(len(cleaned) - lastComma - 1)
		if digitsAfter > minorUnit {
			normalised = strings.ReplaceAll(cleaned, ",", "")
		} else {
			normalised = strings.Replace(cleaned, ",", ".", 1)
		}
	case lastPeriod != -1:
		digitsAfter := int64(len(cleaned) - lastPeriod - 1)
		if digitsAfter > minorUnit {
			normalised = strings.ReplaceAll(cleaned, ".", "")
		} else {
			normalised = cleaned
		}
	default:
		normalised = cleaned
	}

	amountFloat, err := strconv.ParseFloat(normalised, 64)
	if err != nil {
		return 0, fmt.Errorf("invalid amount string '%s': %v", amount, err)
	}

	multiplier := math.Pow(10, float64(minorUnit))
	if multiplier <= 0 {
		multiplier = 1
	}
	return int64(math.Round(amountFloat * multiplier)), nil
}

// GetCurrency returns the package-level cached Currency instance.
func GetCurrency() *Currency {
	return cachedCurrencyData
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

	parts, err := buildRawParts(c.CurrencyInformation, val, opts)
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

	rawParts, err := buildRawParts(c.CurrencyInformation, val, opts)
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
