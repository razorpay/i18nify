package currency

import "fmt"

// FormatIndianNumber formats amount using the Indian number grouping system (en-IN locale).
// Groups: first 3 digits from the right, then 2 digits per group (e.g. 1,00,000 / 12,34,567).
// Equivalent to FormatNumber with opts.Locale = "en-IN".
func FormatIndianNumber(amount interface{}, opts NumberFormatOptions) (string, error) {
	opts.Locale = "en-IN"
	result, err := FormatNumber(amount, opts)
	if err != nil {
		return "", fmt.Errorf("FormatIndianNumber: %v", err)
	}
	return result, nil
}
