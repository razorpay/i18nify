package currency

import (
	"fmt"
	"strconv"
	"strings"
	"unicode"

	xcurrency "golang.org/x/text/currency"
	"golang.org/x/text/language"
	"golang.org/x/text/message"
	"golang.org/x/text/number"
)

const defaultLocale = "en-IN"

// suffixCurrencyBases lists BCP 47 language base codes whose locales conventionally place
// the currency symbol after the number (suffix position) per CLDR data.
var suffixCurrencyBases = map[string]bool{
	"de": true, "nl": true, "fr": true, "it": true,
	"es": true, "pt": true, "pl": true, "cs": true,
	"sk": true, "ro": true, "hu": true, "sv": true,
	"da": true, "nb": true, "nn": true, "fi": true,
	"et": true, "lv": true, "lt": true, "bg": true,
	"hr": true, "sl": true, "ca": true, "el": true,
	"sr": true, "uk": true, "tr": true,
}

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
		return buildCurrencyParts(amount, opts.Currency, tag, p, numOpts, decSep, grpSep)
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
//
// golang.org/x/text/currency does not implement locale-aware symbol positioning (it always
// prefixes). Position is therefore determined via isCurrencyPrefixLocale, which consults the
// BCP 47 language base against the CLDR-derived suffixCurrencyBases map.
//
// Separators follow browser/Intl conventions:
//   - Prefix + known currency: no separator        (e.g. "$1,234.56", "¥5,000")
//   - Suffix + known currency: U+00A0 (NBSP)       (e.g. "1.234,56 €")
//   - Unknown currency code:   prefix + U+00A0     (matches JS Intl output for unknown codes)
func buildCurrencyParts(amount float64, currCode string, tag language.Tag, p *message.Printer, numOpts []number.Option, decSep, grpSep string) ([]FormattedPart, error) {
	canonicalSymbol, err := GetCurrencySymbol(currCode)
	if err != nil {
		// Unknown currency code: fall back to the code string itself (matches JS Intl behaviour).
		canonicalSymbol = currCode
	}

	isNegative := amount < 0
	absAmount := amount
	if isNegative {
		absAmount = -amount
	}

	absNumStr := p.Sprintf("%v", number.Decimal(absAmount, numOpts...))

	// Determine prefix vs suffix and what separator lies between symbol and number.
	_, parseErr := xcurrency.ParseISO(currCode)
	isPrefix := isCurrencyPrefixLocale(tag)
	separator := ""
	if parseErr != nil {
		// Currency unknown to x/text (e.g. "XYZ"): JS Intl uses prefix + NBSP.
		isPrefix = true
		separator = " "
	} else if !isPrefix {
		// Suffix locale: U+00A0 between number and symbol, matching browser output.
		separator = " "
	}
	// Prefix + known currency: no separator (e.g. "$1,234.56" not "$ 1,234.56").

	var parts []FormattedPart

	// Minus sign is always the very first element, matching JS/Intl formatting.
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

// isCurrencyPrefixLocale returns true when the locale conventionally places the currency
// symbol before the number. Consults the BCP 47 language base against suffixCurrencyBases.
func isCurrencyPrefixLocale(tag language.Tag) bool {
	base, _, _ := tag.Raw()
	return !suffixCurrencyBases[base.String()]
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
