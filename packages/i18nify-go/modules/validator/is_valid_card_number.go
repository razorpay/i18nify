package validator

import (
	"fmt"
	"regexp"
	"strings"
)

var cardSeparatorRegex = regexp.MustCompile(`[\s\-]`)
var digitsOnlyRegex = regexp.MustCompile(`^\d+$`)

// ISO/IEC 7812-1 primary account number (PAN) length bounds.
const (
	CardMinLength = 13
	CardMaxLength = 19
)

// CardOptions tunes IsValidCardNumber behaviour.
type CardOptions struct {
	// AllowedLengths restricts accepted digit lengths.
	// Defaults to the ISO/IEC 7812-1 range 13–19 when nil.
	AllowedLengths []int
}

// IsValidCardNumber validates a payment card number using the Luhn algorithm
// (ISO/IEC 7812-1 Annex B). Spaces and hyphens are stripped before validation.
// Returns an error only when cardNumber is empty.
func IsValidCardNumber(cardNumber string, opts ...CardOptions) (bool, error) {
	if strings.TrimSpace(cardNumber) == "" {
		return false, fmt.Errorf("cardNumber must be a non-empty string")
	}

	digits := cardSeparatorRegex.ReplaceAllString(cardNumber, "")
	if !digitsOnlyRegex.MatchString(digits) {
		return false, nil
	}

	o := CardOptions{}
	if len(opts) > 0 {
		o = opts[0]
	}

	l := len(digits)
	if len(o.AllowedLengths) > 0 {
		found := false
		for _, al := range o.AllowedLengths {
			if l == al {
				found = true
				break
			}
		}
		if !found {
			return false, nil
		}
	} else {
		if l < CardMinLength || l > CardMaxLength {
			return false, nil
		}
	}

	// Luhn mod-10: double every second digit from the right.
	sum := 0
	isEven := false
	for i := l - 1; i >= 0; i-- {
		digit := int(digits[i] - '0')
		if isEven {
			digit *= 2
			if digit > 9 {
				digit -= 9
			}
		}
		sum += digit
		isEven = !isEven
	}
	return sum%10 == 0, nil
}
