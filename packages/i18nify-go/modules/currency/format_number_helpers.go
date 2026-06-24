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

	formatted := p.Sprintf("%v", number.Decimal(amount, numOpts...))
	return parseFormattedStr(formatted, decSep, grpSep), nil
}

// resolveFractionDigits returns the effective min/max fraction digit counts.
// Defaults to the currency's minor_unit when a currency code is set, or 0/3 for plain decimal.
func resolveFractionDigits(opts NumberFormatOptions) (min, max int) {
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
func detectLocaleSymbols(p *message.Printer) (decimal, group string) {
	probe := p.Sprintf("%v", number.Decimal(1000.1, number.MaxFractionDigits(1), number.MinFractionDigits(1)))
	runes := []rune(probe)
	n := len(runes)

	if n >= 2 {
		decimal = string(runes[n-2])
	} else {
		decimal = "."
	}

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
// Symbol position is read from the currency data (symbol_position field, derived from CLDR).
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

	isPrefix := true
	separator := ""
	if unknownCurrency {
		separator = " "
	} else {
		isPrefix = info.SymbolPosition != "suffix"
		if !isPrefix {
			separator = " "
		}
	}

	var parts []FormattedPart
	if isNegative {
		parts = append(parts, FormattedPart{Type: PartMinusSign, Value: "-"})
	}

	numericParts := parseNumericStr(absNumStr, decSep, grpSep)

	if isPrefix {
		parts = append(parts, FormattedPart{Type: PartCurrency, Value: canonicalSymbol})
		if separator != "" {
			parts = append(parts, FormattedPart{Type: PartLiteral, Value: separator})
		}
		parts = append(parts, numericParts...)
	} else {
		parts = append(parts, numericParts...)
		if separator != "" {
			parts = append(parts, FormattedPart{Type: PartLiteral, Value: separator})
		}
		parts = append(parts, FormattedPart{Type: PartCurrency, Value: canonicalSymbol})
	}

	return parts, nil
}

// parseFormattedStr splits a fully-formatted number string (may include a leading sign) into parts.
func parseFormattedStr(s, decSep, grpSep string) []FormattedPart {
	var parts []FormattedPart
	if strings.HasPrefix(s, "-") {
		parts = append(parts, FormattedPart{Type: PartMinusSign, Value: "-"})
		s = s[1:]
	} else if strings.HasPrefix(s, "+") {
		parts = append(parts, FormattedPart{Type: PartPlusSign, Value: "+"})
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

	if grpSep != "" && strings.Contains(intStr, grpSep) {
		groups := strings.Split(intStr, grpSep)
		for i, g := range groups {
			if i > 0 {
				parts = append(parts, FormattedPart{Type: PartGroup, Value: grpSep})
			}
			if g != "" {
				parts = append(parts, FormattedPart{Type: PartInteger, Value: g})
			}
		}
	} else if intStr != "" {
		parts = append(parts, FormattedPart{Type: PartInteger, Value: intStr})
	}

	if hasDecimal {
		parts = append(parts, FormattedPart{Type: PartDecimal, Value: decSep})
		if fracStr != "" {
			parts = append(parts, FormattedPart{Type: PartFraction, Value: fracStr})
		}
	}

	return parts
}
