package currency

import "fmt"

// ByParts mirrors the JS ByParts type — a structured breakdown of a formatted number.
// Group separators are merged into Integer (matching JS formatNumberByParts behaviour).
// Fields are empty strings when the component is absent.
type ByParts struct {
	// Standard numeric components
	Integer  string
	Fraction string
	Decimal  string
	Currency string

	// Sign components
	PlusSign  string
	MinusSign string

	// IsPrefixSymbol is true when the currency symbol precedes the integer part in RawParts.
	// Mirrors JS: parts.findIndex(currency) < parts.findIndex(integer).
	// Defaults to true when no currency is present (matching JS behaviour).
	IsPrefixSymbol bool

	// RawParts is the full ordered slice of FormattedPart values, equivalent to
	// Intl.NumberFormat.formatToParts() output after symbol overrides are applied.
	RawParts []FormattedPart
}

// FormatNumberByParts formats amount and returns a ByParts struct with each component separated.
// Group separators are merged into the Integer field, matching JS formatNumberByParts.
// Mirrors the JS formatNumberByParts function in i18nify-js/src/modules/currency/formatNumberByParts.ts.
func FormatNumberByParts(amount interface{}, opts NumberFormatOptions) (*ByParts, error) {
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
		IsPrefixSymbol: true, // JS default when no currency symbol is present
	}

	// Determine isPrefixSymbol: currency part index < first integer part index.
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

	// Aggregate raw parts into named fields.
	// Group separator values are merged into Integer (mirrors JS logic).
	// Literal values are intentionally skipped from named fields and kept only
	// in RawParts.
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
