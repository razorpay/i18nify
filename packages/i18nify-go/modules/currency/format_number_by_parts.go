package currency

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
