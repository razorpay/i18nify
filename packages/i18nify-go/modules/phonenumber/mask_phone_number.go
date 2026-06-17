package phonenumber

import (
	"fmt"
	"strings"
	"unicode"
)

const (
	defaultMaskChar  = "X"
	defaultVisible   = 4
)

// MaskPhoneOptions tunes MaskPhoneNumber behaviour.
type MaskPhoneOptions struct {
	// MaskChar is the replacement character for hidden digits. Default: "X".
	MaskChar string
	// VisibleCount is the number of trailing digits to leave visible. Default: 4.
	VisibleCount int
}

// MaskPhoneNumber replaces all but the last VisibleCount digit characters with
// MaskChar, preserving non-digit separators (spaces, hyphens, dots, parentheses)
// and the leading '+' sign in their original positions.
//
// Example:
//
//	MaskPhoneNumber("+1-800-555-1234") → "+X-XXX-XXX-1234"
//	MaskPhoneNumber("+919876543210")   → "+XXXXXXXX3210"
func MaskPhoneNumber(phone string, opts ...MaskPhoneOptions) (string, error) {
	if strings.TrimSpace(phone) == "" {
		return "", fmt.Errorf("phonenumber: MaskPhoneNumber: phone must not be empty")
	}

	maskChar := defaultMaskChar
	visible := defaultVisible

	if len(opts) > 0 {
		o := opts[0]
		if o.MaskChar != "" {
			maskChar = o.MaskChar
		}
		if o.VisibleCount > 0 {
			visible = o.VisibleCount
		}
	}

	trimmed := strings.TrimSpace(phone)
	prefix := ""
	rest := trimmed
	if strings.HasPrefix(trimmed, "+") {
		prefix = "+"
		rest = trimmed[1:]
	}

	digitCount := 0
	for _, ch := range rest {
		if unicode.IsDigit(ch) {
			digitCount++
		}
	}

	maskFrom := digitCount - visible
	if maskFrom < 0 {
		maskFrom = 0
	}

	var result strings.Builder
	result.WriteString(prefix)
	digitsSeen := 0
	for _, ch := range rest {
		if unicode.IsDigit(ch) {
			if digitsSeen < maskFrom {
				result.WriteString(maskChar)
			} else {
				result.WriteRune(ch)
			}
			digitsSeen++
		} else {
			result.WriteRune(ch)
		}
	}
	return result.String(), nil
}
