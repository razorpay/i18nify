package currency

import (
	"fmt"
	"strconv"
	"strings"
)

// FormatNumberOptions defines options for formatting numbers.
type FormatNumberOptions struct {
	Currency    string // Optional currency code (e.g., "USD", "EUR").
	Precision   int    // Precision for formatting numbers.
	Locale      string // Optional locale for formatting (e.g., "en-IN").
	UseGrouping bool   // Whether to use grouping separators.
}

// FormatNumber formats a number based on provided options.
func FormatNumber(amount interface{}, options FormatNumberOptions) (string, error) {
	// Validate and parse the amount to float64.
	amountValue, err := parseAmount(amount)
	if err != nil {
		return "", fmt.Errorf("invalid amount: %v", err)
	}

	// Convert to major unit if a currency is provided.
	if options.Currency != "" {
		amountValue, err = ConvertToMajorUnit(options.Currency, amountValue)
		if err != nil {
			return "", fmt.Errorf("error converting amount to major unit: %v", err)
		}
	}

	// Format the number based on precision.
	formattedNumber := formatWithPrecision(amountValue, options.Precision)

	// Add currency symbol if specified.
	if options.Currency != "" {
		currencySymbol, err := GetCurrencySymbol(options.Currency)
		if err != nil {
			return "", fmt.Errorf("error retrieving currency symbol: %v", err)
		}
		formattedNumber = currencySymbol + formattedNumber
	}

	// Apply locale-specific formatting.
	if options.Locale != "" {
		formattedNumber = applyLocaleFormatting(formattedNumber, options.Locale, options.UseGrouping)
	}

	return formattedNumber, nil
}

// parseAmount converts the amount to a float64 for calculations.
func parseAmount(amount interface{}) (float64, error) {
	switch v := amount.(type) {
	case string:
		return strconv.ParseFloat(v, 64)
	case float64:
		return v, nil
	case int:
		return float64(v), nil
	default:
		return 0, fmt.Errorf("amount must be a valid number or string")
	}
}

// formatWithPrecision formats the number to the specified precision.
func formatWithPrecision(amount float64, precision int) string {
	format := fmt.Sprintf("%%.%df", precision)
	return fmt.Sprintf(format, amount)
}

// applyLocaleFormatting adjusts the formatted number based on locale.
func applyLocaleFormatting(amount string, locale string, useGrouping bool) string {
	if locale == "en-IN" && useGrouping {
		parts := strings.Split(amount, ".")
		integerPart := parts[0]

		// Apply Indian numbering system (lakh/crore).
		if len(integerPart) > 3 {
			lastThree := integerPart[len(integerPart)-3:]
			remaining := integerPart[:len(integerPart)-3]
			integerPart = addCommasIndian(remaining) + "," + lastThree
		}

		// Add fractional part if present.
		if len(parts) > 1 {
			return integerPart + "." + parts[1]
		}
		return integerPart
	}

	// Add more locale-specific formatting as needed.
	return amount
}

// addCommasIndian adds commas to the integer part in the Indian numbering format.
func addCommasIndian(number string) string {
	runes := []rune(number)
	length := len(runes)
	if length <= 2 {
		return number
	}

	var result []string
	for i := length - 1; i >= 0; i-- {
		if (length-i)%2 == 1 && i < length-3 {
			result = append([]string{","}, result...)
		}
		result = append([]string{string(runes[i])}, result...)
	}

	return strings.Join(result, "")
}
