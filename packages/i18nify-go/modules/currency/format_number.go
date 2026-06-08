package currency

import (
	"fmt"
	"strconv"
	"strings"
	"unicode"

	"golang.org/x/text/language"
	"golang.org/x/text/message"
	"golang.org/x/text/number"
)

const defaultLocale = "en-IN"

// NumberFormatOptions mirrors the JS options object accepted by formatNumber / formatNumberByParts.
type NumberFormatOptions struct {
	// Currency is an ISO 4217 code (e.g. "USD"). When set, fraction digits default to the
	// currency's minor_unit unless overridden.
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

// FormattedPart is a single component of a formatted number string,
// mirroring an entry from Intl.NumberFormat.formatToParts().
type FormattedPart struct {
	Type  string
	Value string
}

// FormatNumber formats amount as a locale-aware number or currency string.
// When opts.Currency is set the result includes the canonical i18nify currency symbol.
// Mirrors the JS formatNumber function in i18nify-js/src/modules/currency/formatNumber.ts.
func FormatNumber(amount interface{}, opts NumberFormatOptions) (string, error) {
	val, err := ValidateAndConvertAmount(amount)
	if err != nil {
		return "", fmt.Errorf("parameter 'amount' is not a valid number: %v", err)
	}

	parts, err := buildRawParts(val, opts)
	if err != nil {
		return "", fmt.Errorf("an error occurred while formatting the number: %v", err)
	}

	var sb strings.Builder
	for _, p := range parts {
		sb.WriteString(p.Value)
	}
	return sb.String(), nil
}

// buildRawParts constructs the []FormattedPart for the given amount and options.
func buildRawParts(amount float64, opts NumberFormatOptions) ([]FormattedPart, error) {
	locale := opts.Locale
	if locale == "" {
		locale = defaultLocale
	}

	tag, err := language.Parse(locale)
	if err != nil {
		return nil, fmt.Errorf("invalid locale '%s': %v", locale, err)
	}

	p := message.NewPrinter(tag)
	minFrac, maxFrac := resolveFractionDigits(opts)
	decSep, grpSep := detectLocaleSymbols(p)

	useGrouping := opts.UseGrouping == nil || *opts.UseGrouping
	numOpts := []number.Option{
		number.MinFractionDigits(minFrac),
		number.MaxFractionDigits(maxFrac),
	}
	if !useGrouping {
		numOpts = append(numOpts, number.NoSeparator())
		grpSep = ""
	}

	if opts.Currency != "" {
		return buildCurrencyParts(amount, opts.Currency, p, numOpts, decSep, grpSep)
	}

	// Plain decimal: format then split into parts.
	formatted := p.Sprintf("%v", number.Decimal(amount, numOpts...))
	return parseFormattedStr(formatted, decSep, grpSep), nil
}

// resolveFractionDigits returns the effective min/max fraction digit counts.
// Defaults to the currency's minor_unit when a currency code is set, or 0/3 for plain decimal.
func resolveFractionDigits(opts NumberFormatOptions) (min, max int) {
	// JS Intl.NumberFormat defaults for decimal style: min=0, max=3
	min, max = 0, 3
	if opts.Currency != "" {
		if info, err := GetCurrencyInformation(opts.Currency); err == nil {
			if mu, atoiErr := strconv.Atoi(info.MinorUnit); atoiErr == nil && mu >= 0 {
				min, max = mu, mu
			}
		}
	}
	if opts.MinimumFractionDigits != nil {
		min = *opts.MinimumFractionDigits
	}
	if opts.MaximumFractionDigits != nil {
		max = *opts.MaximumFractionDigits
	}
	return
}

// detectLocaleSymbols probes the printer by formatting 1000.1 and reading back the separator runes.
// The probe reliably yields both the decimal and group separators for the locale.
func detectLocaleSymbols(p *message.Printer) (decimal, group string) {
	// "1,000.1" (en) / "1.000,1" (de) / "1 000,1" (fr) / "1000.1" (no-grouping locale)
	probe := p.Sprintf("%v", number.Decimal(1000.1, number.MaxFractionDigits(1), number.MinFractionDigits(1)))
	runes := []rune(probe)
	n := len(runes)

	// Last rune is the fraction digit "1"; the rune before it is the decimal separator.
	if n >= 2 {
		decimal = string(runes[n-2])
	} else {
		decimal = "."
	}

	// The rune after the leading "1" is the group separator (if it's not a digit or the decimal sep).
	if n > 1 {
		candidate := string(runes[1])
		if candidate != decimal && !isAllDigits(candidate) {
			group = candidate
		}
	}
	return
}

func isAllDigits(s string) bool {
	for _, r := range s {
		if !unicode.IsDigit(r) {
			return false
		}
	}
	return s != ""
}

// buildCurrencyParts formats amount with the canonical i18nify currency symbol.
// Symbol position is read from the currency data (symbol_position field, derived from CLDR),
// the same source JS Intl.NumberFormat uses — no hardcoded language map needed.
func buildCurrencyParts(amount float64, currCode string, p *message.Printer, numOpts []number.Option, decSep, grpSep string) ([]FormattedPart, error) {
	info, infoErr := GetCurrencyInformation(currCode)
	unknownCurrency := infoErr != nil

	canonicalSymbol := currCode
	if !unknownCurrency {
		canonicalSymbol = info.Symbol
	}

	isNegative := amount < 0
	absAmount := amount
	if isNegative {
		absAmount = -amount
	}

	absNumStr := p.Sprintf("%v", number.Decimal(absAmount, numOpts...))

	// Symbol position comes from currency data (CLDR-derived symbol_position field).
	// Unknown currencies fall back to prefix with a space separator (matches JS Intl behaviour).
	isPrefix := true
	separator := ""
	if unknownCurrency {
		separator = " "
	} else {
		isPrefix = info.SymbolPosition != "suffix"
		if !isPrefix {
			separator = " "
		}
	}

	var parts []FormattedPart
	if isNegative {
		parts = append(parts, FormattedPart{Type: "minusSign", Value: "-"})
	}

	numericParts := parseNumericStr(absNumStr, decSep, grpSep)

	if isPrefix {
		parts = append(parts, FormattedPart{Type: "currency", Value: canonicalSymbol})
		if separator != "" {
			parts = append(parts, FormattedPart{Type: "literal", Value: separator})
		}
		parts = append(parts, numericParts...)
	} else {
		parts = append(parts, numericParts...)
		if separator != "" {
			parts = append(parts, FormattedPart{Type: "literal", Value: separator})
		}
		parts = append(parts, FormattedPart{Type: "currency", Value: canonicalSymbol})
	}

	return parts, nil
}

// parseFormattedStr splits a fully-formatted number string (may include a leading sign) into parts.
func parseFormattedStr(s, decSep, grpSep string) []FormattedPart {
	var parts []FormattedPart
	if strings.HasPrefix(s, "-") {
		parts = append(parts, FormattedPart{Type: "minusSign", Value: "-"})
		s = s[1:]
	} else if strings.HasPrefix(s, "+") {
		parts = append(parts, FormattedPart{Type: "plusSign", Value: "+"})
		s = s[1:]
	}
	return append(parts, parseNumericStr(s, decSep, grpSep)...)
}

// parseNumericStr splits a sign-free number string into integer, group, decimal, and fraction parts.
func parseNumericStr(s, decSep, grpSep string) []FormattedPart {
	var parts []FormattedPart

	intStr, fracStr := s, ""
	hasDecimal := false
	if decSep != "" {
		if idx := strings.Index(s, decSep); idx >= 0 {
			intStr = s[:idx]
			fracStr = s[idx+len(decSep):]
			hasDecimal = true
		}
	}

	// Split integer portion by group separator.
	if grpSep != "" && strings.Contains(intStr, grpSep) {
		groups := strings.Split(intStr, grpSep)
		for i, g := range groups {
			if i > 0 {
				parts = append(parts, FormattedPart{Type: "group", Value: grpSep})
			}
			if g != "" {
				parts = append(parts, FormattedPart{Type: "integer", Value: g})
			}
		}
	} else if intStr != "" {
		parts = append(parts, FormattedPart{Type: "integer", Value: intStr})
	}

	if hasDecimal {
		parts = append(parts, FormattedPart{Type: "decimal", Value: decSep})
		if fracStr != "" {
			parts = append(parts, FormattedPart{Type: "fraction", Value: fracStr})
		}
	}

	return parts
}
