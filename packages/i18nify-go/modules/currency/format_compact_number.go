package currency

import (
	"fmt"
	"math"
	"strconv"
	"strings"
)

const (
	crore float64 = 10_000_000 // 1,00,00,000
	lakh  float64 = 100_000    // 1,00,000
)

// FormatCompactNumber formats amount using the Indian compact notation.
// Values ≥ 1 Crore are expressed as "X Cr"; values ≥ 1 Lakh as "X L".
// Values below 1 Lakh fall through to FormatNumber with the supplied opts.
// Mirrors the JS formatCompactNumber in i18nify-js/src/modules/currency/formatCompactNumber.ts.
func FormatCompactNumber(amount interface{}, opts NumberFormatOptions) (string, error) {
	val, err := ValidateAndConvertAmount(amount)
	if err != nil {
		return "", fmt.Errorf("parameter 'amount' is not a valid number: %v", err)
	}

	sign := ""
	abs := val
	if val < 0 {
		sign = "-"
		abs = -val
	}

	if abs >= crore {
		return sign + compactStr(abs/crore) + " Cr", nil
	}
	if abs >= lakh {
		return sign + compactStr(abs/lakh) + " L", nil
	}

	return FormatNumber(amount, opts)
}

// compactStr formats a compact coefficient, trimming insignificant trailing zeros.
// 1.00 → "1", 1.50 → "1.5", 1.53 → "1.53".
func compactStr(v float64) string {
	if v == math.Trunc(v) {
		return strconv.FormatInt(int64(v), 10)
	}
	s := strconv.FormatFloat(v, 'f', 2, 64)
	s = strings.TrimRight(s, "0")
	s = strings.TrimRight(s, ".")
	return s
}
