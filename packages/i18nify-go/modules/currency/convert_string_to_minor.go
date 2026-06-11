package currency

import (
	"fmt"
	"math"
	"regexp"
	"strconv"
	"strings"
)

var nonCurrencyCharRe = regexp.MustCompile(`[^0-9.,-]`)

// ConvertStringToMinorUnit parses a locale-formatted currency string and returns
// the equivalent amount in minor units for the given currency code.
//
// Disambiguation rules for the decimal separator:
//   - Both comma AND period present → the one appearing last is the decimal separator.
//   - Only one separator present → if the digit count after it exceeds the currency's
//     minor unit, it is a thousands separator; otherwise it is the decimal separator.
//
// Examples:
//
//	"$1,234.56" + "USD" → 123456
//	"1.234,56"  + "EUR" → 123456
//	"10,50"     + "EUR" → 1050
//	"¥1,234"    + "JPY" → 1234   (JPY has 0 minor units; comma = thousands)
//	"₹4.14"     + "INR" → 414
//	"1.234"     + "BHD" → 1234   (BHD has 3 minor units; period = decimal)
func ConvertStringToMinorUnit(code string, amount string) (int64, error) {
	currencyInfo, err := GetCurrencyInformation(code)
	if err != nil {
		return 0, err
	}

	minorUnit, err := strconv.ParseInt(currencyInfo.MinorUnit, 10, 64)
	if err != nil {
		return 0, fmt.Errorf("invalid minor unit for currency code '%s': %v", code, err)
	}

	// Strip currency symbols and whitespace; keep digits, comma, period, minus.
	cleaned := nonCurrencyCharRe.ReplaceAllString(strings.TrimSpace(amount), "")
	if cleaned == "" {
		return 0, fmt.Errorf("invalid amount string '%s': could not extract a numeric value", amount)
	}

	lastComma := strings.LastIndex(cleaned, ",")
	lastPeriod := strings.LastIndex(cleaned, ".")
	hasBoth := lastComma != -1 && lastPeriod != -1

	var normalised string
	switch {
	case hasBoth:
		// Both separators: last one is the decimal separator.
		if lastComma > lastPeriod {
			normalised = strings.ReplaceAll(cleaned, ".", "")
			normalised = strings.Replace(normalised, ",", ".", 1)
		} else {
			normalised = strings.ReplaceAll(cleaned, ",", "")
		}
	case lastComma != -1:
		digitsAfter := int64(len(cleaned) - lastComma - 1)
		if digitsAfter > minorUnit {
			// More digits than the currency allows → comma is a thousands separator.
			normalised = strings.ReplaceAll(cleaned, ",", "")
		} else {
			// Comma is the decimal separator (European format).
			normalised = strings.Replace(cleaned, ",", ".", 1)
		}
	case lastPeriod != -1:
		digitsAfter := int64(len(cleaned) - lastPeriod - 1)
		if digitsAfter > minorUnit {
			// More digits than the currency allows → period is a thousands separator.
			normalised = strings.ReplaceAll(cleaned, ".", "")
		} else {
			normalised = cleaned
		}
	default:
		normalised = cleaned
	}

	amountFloat, err := strconv.ParseFloat(normalised, 64)
	if err != nil {
		return 0, fmt.Errorf("invalid amount string '%s': %v", amount, err)
	}

	multiplier := math.Pow(10, float64(minorUnit))
	if multiplier <= 0 {
		multiplier = 1
	}
	return int64(math.Round(amountFloat * multiplier)), nil
}
