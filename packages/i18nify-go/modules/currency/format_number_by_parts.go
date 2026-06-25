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

	// Sign / special value components
	NaN               string
	Infinity          string
	PlusSign          string
	MinusSign         string
	Percent           string
	PercentSign       string

	// Extended components (compact notation, exponent, unit, etc.)
	Code              string
	Symbol            string
	Name              string
	Compact           string
	ExponentInteger   string
	ExponentMinusSign string
	ExponentSeparator string
	Unit              string

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
		if p.Type == "currency" && currencyIdx == -1 {
			currencyIdx = i
		}
		if p.Type == "integer" && integerIdx == -1 {
			integerIdx = i
		}
	}
	if currencyIdx >= 0 && integerIdx >= 0 {
		result.IsPrefixSymbol = currencyIdx < integerIdx
	}

	// Aggregate raw parts into named fields.
	// Group separator values are merged into Integer (mirrors JS logic).
	// The "literal" type (e.g. the space between number and suffix symbol) is intentionally skipped,
	// since it is not in JS ALLOWED_FORMAT_PARTS_KEYS.
	for _, p := range rawParts {
		switch p.Type {
		case "group":
			result.Integer += p.Value
		case "integer":
			result.Integer += p.Value
		case "fraction":
			result.Fraction += p.Value
		case "decimal":
			result.Decimal += p.Value
		case "currency":
			result.Currency += p.Value
		case "nan":
			result.NaN += p.Value
		case "infinity":
			result.Infinity += p.Value
		case "percent":
			result.Percent += p.Value
		case "plusSign":
			result.PlusSign += p.Value
		case "minusSign":
			result.MinusSign += p.Value
		case "percentSign":
			result.PercentSign += p.Value
		case "code":
			result.Code += p.Value
		case "symbol":
			result.Symbol += p.Value
		case "name":
			result.Name += p.Value
		case "compact":
			result.Compact += p.Value
		case "exponentInteger":
			result.ExponentInteger += p.Value
		case "exponentMinusSign":
			result.ExponentMinusSign += p.Value
		case "exponentSeparator":
			result.ExponentSeparator += p.Value
		case "unit":
			result.Unit += p.Value
		// "literal" is intentionally omitted — not in ALLOWED_FORMAT_PARTS_KEYS.
		}
	}

	return result, nil
}
