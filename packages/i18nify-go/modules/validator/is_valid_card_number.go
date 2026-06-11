package validator

import (
	"fmt"
	"strings"
)

const (
	cardMinLength = 13
	cardMaxLength = 19
)

// CardValidationOptions allows overriding the accepted card number lengths.
type CardValidationOptions struct {
	AllowedLengths []int
}

// IsValidCardNumber validates a payment card number using the Luhn algorithm
// (ISO/IEC 7812-1 Annex B). Accepts digits with optional space or hyphen
// separators (e.g. "4111 1111 1111 1111").
func IsValidCardNumber(cardNumber string, opts *CardValidationOptions) (bool, error) {
	if strings.TrimSpace(cardNumber) == "" {
		return false, fmt.Errorf("validator: IsValidCardNumber: cardNumber must be a non-empty string")
	}

	// Strip spaces and hyphens.
	digits := strings.NewReplacer(" ", "", "-", "").Replace(cardNumber)

	for _, ch := range digits {
		if ch < '0' || ch > '9' {
			return false, nil
		}
	}

	length := len(digits)
	if opts != nil && len(opts.AllowedLengths) > 0 {
		found := false
		for _, l := range opts.AllowedLengths {
			if l == length {
				found = true
				break
			}
		}
		if !found {
			return false, nil
		}
	} else {
		if length < cardMinLength || length > cardMaxLength {
			return false, nil
		}
	}

	// Luhn mod-10: double every second digit from the right.
	sum := 0
	isEven := false
	for i := length - 1; i >= 0; i-- {
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
