package currency

import "fmt"

// FormatAmountByParts formats amount as a currency string and returns each component separately.
// Unlike FormatNumberByParts, currency is a required positional argument — it enforces that
// callers explicitly name the currency when dealing with monetary amounts.
// Mirrors the JS formatAmountByParts function in i18nify-js/src/modules/currency/formatAmountByParts.ts.
func FormatAmountByParts(amount interface{}, currency string, opts NumberFormatOptions) (*ByParts, error) {
	if currency == "" {
		return nil, fmt.Errorf("currency code cannot be empty")
	}
	opts.Currency = currency
	return FormatNumberByParts(amount, opts)
}
