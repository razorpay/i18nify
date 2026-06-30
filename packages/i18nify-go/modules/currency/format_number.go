package currency

const defaultLocale = "en-IN"

// NumberFormatOptions mirrors the JS options object accepted by formatNumber / formatNumberByParts.
type NumberFormatOptions struct {
	// Currency is an ISO 4217 code (e.g. "USD").
	Currency string
	// Locale is a BCP 47 tag (e.g. "en-US"). Defaults to "en-IN" when empty.
	Locale string
	// MinimumFractionDigits overrides the currency/style default minimum fraction digits.
	MinimumFractionDigits *int
	// MaximumFractionDigits overrides the currency/style default maximum fraction digits.
	MaximumFractionDigits *int
	// UseGrouping controls thousand-separator grouping. nil means enabled (default).
	UseGrouping *bool
}

const (
	PartCurrency  = "currency"
	PartInteger   = "integer"
	PartGroup     = "group"
	PartDecimal   = "decimal"
	PartFraction  = "fraction"
	PartLiteral   = "literal"
	PartPlusSign  = "plusSign"
	PartMinusSign = "minusSign"
)

// FormattedPart is a single component of a formatted number string,
// mirroring an entry from Intl.NumberFormat.formatToParts().
type FormattedPart struct {
	Type  string `json:"type"`
	Value string `json:"value"`
}

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
