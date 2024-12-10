package currency

import (
"fmt"
"math"
"regexp"
"strings"
)

// ByParts represents the formatted number split into components.
type ByParts struct {
	Integer       string
	Decimal       string
	Fraction      string
	Currency      string
	IsPrefixSymbol bool
	RawParts      []FormattedPart
}

// FormattedPart represents each part of the formatted output.
type FormattedPart struct {
	Type  string
	Value string
}

// FormatNumberByPartsOptions provides configuration for formatting numbers.
type FormatNumberByPartsOptions struct {
	Currency   string // Currency code (e.g., "USD", "EUR").
	Locale     string // Locale for formatting (e.g., "en-IN").
	Precision  int    // Number of decimal places.
	UseGrouping bool  // Whether to use grouping separators.
}

// FormatNumberByParts formats a number and splits it into parts based on options.
func FormatNumberByParts(amount interface{}, options FormatNumberByPartsOptions) (ByParts, error) {
	// Validate the input amount.
	amountValue, err := parseAmount(amount)
	if err != nil {
		return ByParts{}, fmt.Errorf("invalid amount: %v", err)
	}

	// Convert to major unit if a currency is provided.
	currencySymbol := ""
	if options.Currency != "" {
		amountValue, err = ConvertToMajorUnit(options.Currency, amountValue)
		if err != nil {
			return ByParts{}, fmt.Errorf("error converting amount to major unit: %v", err)
		}

		currencySymbol, err = GetCurrencySymbol(options.Currency)
		if err != nil {
			return ByParts{}, fmt.Errorf("error retrieving currency symbol: %v", err)
		}
	}

	// Format the number with precision and grouping.
	formattedNumber := formatWithPrecision(amountValue, options.Precision)
	if options.UseGrouping {
		formattedNumber = applyLocaleFormatting(formattedNumber, options.Locale, options.UseGrouping)
	}

	// Parse the formatted number into parts.
	parts := parseFormattedParts(formattedNumber, currencySymbol)

	return parts, nil
}

// parseFormattedParts splits the formatted number into structured parts.
func parseFormattedParts(formattedNumber string, currencySymbol string) ByParts {
	var integer, decimal, fraction string
	var rawParts []FormattedPart
	isPrefixSymbol := false

	// Check for currency symbol position.
	if strings.HasPrefix(formattedNumber, currencySymbol) {
		isPrefixSymbol = true
		formattedNumber = strings.TrimPrefix(formattedNumber, currencySymbol)
		rawParts = append(rawParts, FormattedPart{Type: "currency", Value: currencySymbol})
	}

	// Use regex to split into parts.
	re := regexp.MustCompile(`(\d+)(\.\d+)?`)
	matches := re.FindStringSubmatch(formattedNumber)
	if len(matches) > 0 {package currency

		import (
			"fmt"
		"math"
		"regexp"
		"strings"
		)

		// ByParts represents the formatted number split into components.
		type ByParts struct {
			Integer       string
			Decimal       string
			Fraction      string
			Currency      string
			IsPrefixSymbol bool
			RawParts      []FormattedPart
		}

		// FormattedPart represents each part of the formatted output.
		type FormattedPart struct {
			Type  string
			Value string
		}

		// FormatNumberByPartsOptions provides configuration for formatting numbers.
		type FormatNumberByPartsOptions struct {
			Currency   string // Currency code (e.g., "USD", "EUR").
			Locale     string // Locale for formatting (e.g., "en-IN").
			Precision  int    // Number of decimal places.
			UseGrouping bool  // Whether to use grouping separators.
		}

		// FormatNumberByParts formats a number and splits it into parts based on options.
		func FormatNumberByParts(amount interface{}, options FormatNumberByPartsOptions) (ByParts, error) {
		// Validate the input amount.
		amountValue, err := parseAmount(amount)
		if err != nil {
		return ByParts{}, fmt.Errorf("invalid amount: %v", err)
		}

		// Convert to major unit if a currency is provided.
		currencySymbol := ""
		if options.Currency != "" {
		amountValue, err = ConvertToMajorUnit(options.Currency, amountValue)
		if err != nil {
		return ByParts{}, fmt.Errorf("error converting amount to major unit: %v", err)
		}

		currencySymbol, err = GetCurrencySymbol(options.Currency)
		if err != nil {
		return ByParts{}, fmt.Errorf("error retrieving currency symbol: %v", err)
		}
		}

		// Format the number with precision and grouping.
		formattedNumber := formatWithPrecision(amountValue, options.Precision)
		if options.UseGrouping {
		formattedNumber = applyLocaleFormatting(formattedNumber, options.Locale, options.UseGrouping)
		}

		// Parse the formatted number into parts.
		parts := parseFormattedParts(formattedNumber, currencySymbol)

		return parts, nil
		}

		// parseFormattedParts splits the formatted number into structured parts.
		func parseFormattedParts(formattedNumber string, currencySymbol string) ByParts {
		var integer, decimal, fraction string
		var rawParts []FormattedPart
		isPrefixSymbol := false

		// Check for currency symbol position.
		if strings.HasPrefix(formattedNumber, currencySymbol) {
		isPrefixSymbol = true
		formattedNumber = strings.TrimPrefix(formattedNumber, currencySymbol)
		rawParts = append(rawParts, FormattedPart{Type: "currency", Value: currencySymbol})
		}

		// Use regex to split into parts.
		re := regexp.MustCompile(`(\d+)(\.\d+)?`)
		matches := re.FindStringSubmatch(formattedNumber)
		if len(matches) > 0 {
		integer = matches[1]
		rawParts = append(rawParts, FormattedPart{Type: "integer", Value: integer})
		if len(matches) > 2 && matches[2] != "" {
		decimal = "."
		fraction = matches[2][1:]
		rawParts = append(rawParts, FormattedPart{Type: "decimal", Value: decimal})
		rawParts = append(rawParts, FormattedPart{Type: "fraction", Value: fraction})
		}
		}

		return ByParts{
		Integer:       integer,
		Decimal:       decimal,
		Fraction:      fraction,
		Currency:      currencySymbol,
		IsPrefixSymbol: isPrefixSymbol,
		RawParts:      rawParts,
		}
		}

		integer = matches[1]
		rawParts = append(rawParts, FormattedPart{Type: "integer", Value: integer})
		if len(matches) > 2 && matches[2] != "" {
			decimal = "."
			fraction = matches[2][1:]
			rawParts = append(rawParts, FormattedPart{Type: "decimal", Value: decimal})
			rawParts = append(rawParts, FormattedPart{Type: "fraction", Value: fraction})
		}
	}

	return ByParts{
		Integer:       integer,
		Decimal:       decimal,
		Fraction:      fraction,
		Currency:      currencySymbol,
		IsPrefixSymbol: isPrefixSymbol,
		RawParts:      rawParts,
	}
}
