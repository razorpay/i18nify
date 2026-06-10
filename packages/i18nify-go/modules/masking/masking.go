// Package masking provides display-safe masking utilities for sensitive values
// such as payment card numbers (PCI DSS §3.4) and phone numbers.
package masking

import (
	"fmt"
	"strings"
	"unicode"
)

const (
	defaultMaskChar   = "X"
	defaultVisible    = 4
	defaultGroupSize  = 4
	defaultGroupSep   = " "
)

// MaskCardOptions tunes MaskCardNumber behaviour.
type MaskCardOptions struct {
	// MaskChar is the replacement character for hidden digits. Default: "X".
	MaskChar string
	// VisibleCount is the number of trailing digits to leave visible. Default: 4.
	VisibleCount int
	// GroupSize is the number of digits per output group. Default: 4.
	// Set NoGrouping to true to suppress grouping entirely.
	GroupSize int
	// GroupSeparator is placed between groups. Default: " ".
	GroupSeparator string
	// NoGrouping disables group separation and returns a flat masked string.
	NoGrouping bool
}

// MaskCardNumber replaces all but the last VisibleCount digits of a card number
// with MaskChar, then re-groups the output into GroupSize-digit chunks.
//
// Input may contain digit, space, or hyphen characters; all other characters
// are rejected.
//
// Example:
//
//	MaskCardNumber("4111111111111111")     → "XXXX XXXX XXXX 1111"
//	MaskCardNumber("4111 1111 1111 1111") → "XXXX XXXX XXXX 1111"
func MaskCardNumber(cardNumber string, opts ...MaskCardOptions) (string, error) {
	if strings.TrimSpace(cardNumber) == "" {
		return "", fmt.Errorf("masking: MaskCardNumber: cardNumber must not be empty")
	}

	maskChar := defaultMaskChar
	visible := defaultVisible
	groupSize := defaultGroupSize
	groupSep := defaultGroupSep
	noGrouping := false

	if len(opts) > 0 {
		o := opts[0]
		if o.MaskChar != "" {
			maskChar = o.MaskChar
		}
		if o.VisibleCount > 0 {
			visible = o.VisibleCount
		}
		if o.GroupSize > 0 {
			groupSize = o.GroupSize
		}
		if o.GroupSeparator != "" {
			groupSep = o.GroupSeparator
		}
		noGrouping = o.NoGrouping
	}

	var digits strings.Builder
	for _, ch := range cardNumber {
		if ch == ' ' || ch == '-' {
			continue
		}
		if !unicode.IsDigit(ch) {
			return "", fmt.Errorf(
				"masking: MaskCardNumber: invalid character %q — only digits, spaces, and hyphens allowed",
				ch,
			)
		}
		digits.WriteRune(ch)
	}
	ds := digits.String()
	if ds == "" {
		return "", fmt.Errorf("masking: MaskCardNumber: cardNumber contains no digits")
	}

	maskLen := len(ds) - visible
	if maskLen < 0 {
		maskLen = 0
	}

	var masked strings.Builder
	for i, ch := range ds {
		if i < maskLen {
			masked.WriteString(maskChar)
		} else {
			masked.WriteRune(ch)
		}
	}

	if noGrouping {
		return masked.String(), nil
	}

	m := masked.String()
	var groups []string
	for i := 0; i < len(m); i += groupSize {
		end := i + groupSize
		if end > len(m) {
			end = len(m)
		}
		groups = append(groups, m[i:end])
	}
	return strings.Join(groups, groupSep), nil
}

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
		return "", fmt.Errorf("masking: MaskPhoneNumber: phone must not be empty")
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
