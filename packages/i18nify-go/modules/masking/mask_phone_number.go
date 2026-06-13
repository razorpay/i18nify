package masking

import (
	"fmt"
	"strings"
	"unicode"
)

// MaskPhoneOptions configures MaskPhoneNumber behaviour.
type MaskPhoneOptions struct {
	MaskChar     string
	VisibleCount int
}

// MaskPhoneNumber masks all but the last VisibleCount digits of a phone number.
// A leading '+' (international prefix indicator) is preserved.
// Non-digit formatting characters (spaces, hyphens, dots, parentheses) are
// preserved in their original positions.
func MaskPhoneNumber(phone string, opts *MaskPhoneOptions) (string, error) {
	if strings.TrimSpace(phone) == "" {
		return "", fmt.Errorf("masking: MaskPhoneNumber: phone must be a non-empty string")
	}

	maskChar := defaultMaskChar
	visibleCount := defaultVisibleDigits

	if opts != nil {
		if opts.MaskChar != "" {
			maskChar = opts.MaskChar
		}
		if opts.VisibleCount > 0 {
			visibleCount = opts.VisibleCount
		}
	}

	trimmed := strings.TrimSpace(phone)
	hasPlus := strings.HasPrefix(trimmed, "+")
	rest := trimmed
	if hasPlus {
		rest = trimmed[1:]
	}

	digitCount := 0
	for _, ch := range rest {
		if unicode.IsDigit(ch) {
			digitCount++
		}
	}

	maskFrom := digitCount - visibleCount
	if maskFrom < 0 {
		maskFrom = 0
	}

	digitsSeen := 0
	var buf strings.Builder
	for _, ch := range rest {
		if unicode.IsDigit(ch) {
			if digitsSeen < maskFrom {
				buf.WriteString(maskChar)
			} else {
				buf.WriteRune(ch)
			}
			digitsSeen++
		} else {
			buf.WriteRune(ch)
		}
	}

	if hasPlus {
		return "+" + buf.String(), nil
	}
	return buf.String(), nil
}
