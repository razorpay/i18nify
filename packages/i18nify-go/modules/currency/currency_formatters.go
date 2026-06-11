package currency

import (
	"fmt"
	"strings"
	"unicode/utf8"
)

// FormatterStyle names the nine locale-specific number-grouping styles.
type FormatterStyle string

const (
	StyleWestern   FormatterStyle = "WESTERN"
	StyleIndian    FormatterStyle = "INDIAN"
	StyleEuropean  FormatterStyle = "EUROPEAN"
	StyleFrench    FormatterStyle = "FRENCH"
	StyleSwiss     FormatterStyle = "SWISS"
	StyleSwazi     FormatterStyle = "SWAZI"
	StyleArabic    FormatterStyle = "ARABIC"
	StyleBengali   FormatterStyle = "BENGALI"
	StyleNoGrouping FormatterStyle = "NO_GROUPING"
)

// FormatterConfig holds the separators, grouping sizes, and optional digit glyphs
// for a given locale-specific number-formatting style.
//
// GroupSizes is applied right-to-left. The last element repeats for all remaining groups:
//
//	[3]    → Western (all groups of 3)
//	[3, 2] → Indian  (rightmost group of 3, then groups of 2)
//	[]     → no grouping
//
// Digits, when non-empty, must be exactly 10 runes mapping index 0-9 to locale glyphs.
type FormatterConfig struct {
	ThousandsSep string
	DecimalSep   string
	GroupSizes   []int
	Digits       string // empty = use ASCII digits
}

// CurrencyFormatters maps each FormatterStyle to its configuration.
var CurrencyFormatters = map[FormatterStyle]FormatterConfig{
	StyleWestern:    {ThousandsSep: ",", DecimalSep: ".", GroupSizes: []int{3}},
	StyleIndian:     {ThousandsSep: ",", DecimalSep: ".", GroupSizes: []int{3, 2}},
	StyleEuropean:   {ThousandsSep: ".", DecimalSep: ",", GroupSizes: []int{3}},
	StyleFrench:     {ThousandsSep: " ", DecimalSep: ",", GroupSizes: []int{3}},
	StyleSwiss:      {ThousandsSep: "'", DecimalSep: ".", GroupSizes: []int{3}},
	StyleSwazi:      {ThousandsSep: " ", DecimalSep: ".", GroupSizes: []int{3}},
	StyleArabic:     {ThousandsSep: "٬", DecimalSep: "٫", GroupSizes: []int{3}, Digits: "٠١٢٣٤٥٦٧٨٩"},
	StyleBengali:    {ThousandsSep: ",", DecimalSep: ".", GroupSizes: []int{3, 2}, Digits: "০১২৩৪৫৬৭৮৯"},
	StyleNoGrouping: {ThousandsSep: "", DecimalSep: ".", GroupSizes: []int{}},
}

// FormatWithStyleOptions controls optional behaviour of FormatWithStyle.
type FormatWithStyleOptions struct {
	// Currency is an ISO 4217 code used to derive the default decimal places
	// and (when ShowSymbol is true) the currency symbol.
	Currency string
	// Decimals overrides the number of fractional digits. A negative value
	// means "derive from currency minor_unit, or default to 2".
	Decimals int
	// ShowSymbol, when true, prepends or appends the currency symbol derived
	// from the Currency field.
	ShowSymbol bool
}

// FormatWithStyle formats amount using one of the nine locale-specific grouping styles.
// Pass a zero FormatWithStyleOptions{} to use all defaults (style only, 2 decimal places).
func FormatWithStyle(amount float64, style FormatterStyle, opts FormatWithStyleOptions) (string, error) {
	config, ok := CurrencyFormatters[style]
	if !ok {
		return "", fmt.Errorf("unknown formatter style %q", style)
	}

	// Resolve decimal places: explicit (≥0) > currency minor_unit > default 2
	decimalPlaces := opts.Decimals
	if decimalPlaces < 0 {
		if opts.Currency != "" {
			info, err := GetCurrencyInformation(opts.Currency)
			if err == nil {
				dp := parseMinorUnit(info.MinorUnit)
				decimalPlaces = dp
			}
		}
		if decimalPlaces < 0 {
			decimalPlaces = 2
		}
	}

	isNegative := amount < 0
	absVal := amount
	if isNegative {
		absVal = -absVal
	}

	formatted := formatFloat(absVal, decimalPlaces)
	parts := strings.SplitN(formatted, ".", 2)
	intPart := parts[0]
	var fracPart string
	if len(parts) == 2 {
		fracPart = parts[1]
	}

	grouped := groupIntegerStr(intPart, config.GroupSizes, config.ThousandsSep)

	var result string
	if fracPart != "" && decimalPlaces > 0 {
		result = grouped + config.DecimalSep + fracPart
	} else {
		result = grouped
	}

	if config.Digits != "" {
		result = substituteDigitsStr(result, config.Digits)
	}

	if isNegative {
		result = "-" + result
	}

	if opts.ShowSymbol && opts.Currency != "" {
		info, err := GetCurrencyInformation(opts.Currency)
		if err == nil && info.Symbol != "" {
			if info.SymbolPosition == "suffix" {
				result = result + " " + info.Symbol
			} else {
				result = info.Symbol + result
			}
		}
	}

	return result, nil
}

// groupIntegerStr groups the integer string s using groupSizes and sep.
// The last element of groupSizes repeats for all remaining groups.
// Returns s unchanged when groupSizes is empty or sep is empty.
func groupIntegerStr(s string, groupSizes []int, sep string) string {
	if len(groupSizes) == 0 || sep == "" {
		return s
	}

	// Collect runes so multi-byte characters are handled correctly.
	runes := []rune(s)
	total := len(runes)
	var chunks []string
	pos := total
	groupIdx := 0

	for pos > 0 {
		size := groupSizes[min(groupIdx, len(groupSizes)-1)]
		start := pos - size
		if start < 0 {
			start = 0
		}
		chunks = append([]string{string(runes[start:pos])}, chunks...)
		pos -= size
		groupIdx++
	}

	// Filter empty strings that may appear when pos goes below 0.
	var nonEmpty []string
	for _, c := range chunks {
		if c != "" {
			nonEmpty = append(nonEmpty, c)
		}
	}
	return strings.Join(nonEmpty, sep)
}

// substituteDigitsStr replaces each ASCII digit 0-9 in s with the corresponding
// rune from digitGlyphs (a string of exactly 10 runes).
func substituteDigitsStr(s string, digitGlyphs string) string {
	glyphs := []rune(digitGlyphs)
	if len(glyphs) != 10 {
		return s
	}
	var b strings.Builder
	b.Grow(utf8.RuneCountInString(s) * 3)
	for _, r := range s {
		if r >= '0' && r <= '9' {
			b.WriteRune(glyphs[r-'0'])
		} else {
			b.WriteRune(r)
		}
	}
	return b.String()
}

// formatFloat formats f with exactly dp decimal places, using Go's strconv-based
// approach to avoid floating-point representation artefacts.
func formatFloat(f float64, dp int) string {
	return fmt.Sprintf("%.*f", dp, f)
}

// parseMinorUnit parses the minor unit string to an int. Returns 2 on failure.
func parseMinorUnit(s string) int {
	n := 0
	for _, c := range s {
		if c < '0' || c > '9' {
			return 2
		}
		n = n*10 + int(c-'0')
	}
	return n
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
