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
