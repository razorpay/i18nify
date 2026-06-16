package banking

import (
	"fmt"
	"strings"
	"unicode"
)

const (
	defaultMaskChar          = "X"
	defaultVisibleDigits     = 4
	defaultCardGroupSize     = 4
	defaultCardGroupSeparator = " "
)

// MaskCardOptions configures MaskCardNumber behaviour.
// Set GroupSizePtr to &0 to disable grouping; nil uses the default (4).
type MaskCardOptions struct {
	MaskChar       string
	VisibleCount   int
	GroupSizePtr   *int
	GroupSeparator string
}

// MaskCardNumber masks all but the last VisibleCount digits of a card number,
// grouping the result into chunks of GroupSize separated by GroupSeparator.
func MaskCardNumber(cardNumber string, opts *MaskCardOptions) (string, error) {
	if strings.TrimSpace(cardNumber) == "" {
		return "", fmt.Errorf("banking: MaskCardNumber: cardNumber must be a non-empty string")
	}

	maskChar := defaultMaskChar
	visibleCount := defaultVisibleDigits
	groupSize := defaultCardGroupSize
	groupSeparator := defaultCardGroupSeparator

	if opts != nil {
		if opts.MaskChar != "" {
			maskChar = opts.MaskChar
		}
		if opts.VisibleCount > 0 {
			visibleCount = opts.VisibleCount
		}
		if opts.GroupSizePtr != nil {
			groupSize = *opts.GroupSizePtr
		}
		if opts.GroupSeparator != "" {
			groupSeparator = opts.GroupSeparator
		}
	}

	// Strip spaces and hyphens, verify only digits remain.
	var digits strings.Builder
	for _, ch := range cardNumber {
		if ch == ' ' || ch == '-' {
			continue
		}
		if !unicode.IsDigit(ch) {
			return "", fmt.Errorf("banking: MaskCardNumber: cardNumber may only contain digits, spaces, or hyphens")
		}
		digits.WriteRune(ch)
	}
	d := digits.String()

	maskLen := len(d) - visibleCount
	if maskLen < 0 {
		maskLen = 0
	}
	masked := strings.Repeat(maskChar, maskLen) + d[maskLen:]

	if groupSize == 0 {
		return masked, nil
	}

	var groups []string
	for i := 0; i < len(masked); i += groupSize {
		end := i + groupSize
		if end > len(masked) {
			end = len(masked)
		}
		groups = append(groups, masked[i:end])
	}
	return strings.Join(groups, groupSeparator), nil
}
