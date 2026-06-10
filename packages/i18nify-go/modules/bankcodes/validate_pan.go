package bankcodes

import (
	"fmt"
	"regexp"
	"strings"
)

// panRegex validates Permanent Account Number format.
// 4th character encodes entity type: P=individual, C=company, H=HUF,
// F=firm, A=AOP, T=trust, B=BOI, L=local authority, J=juridical person, G=govt.
var panRegex = regexp.MustCompile(`^[A-Z]{3}[PCFHABLJTG][A-Z][0-9]{4}[A-Z]$`)

// ValidatePAN validates an Indian Permanent Account Number (PAN).
// Returns true for a correctly formatted PAN, false for an invalid format.
// Returns an error only when the input is empty.
func ValidatePAN(pan string) (bool, error) {
	if strings.TrimSpace(pan) == "" {
		return false, fmt.Errorf("PAN must be a non-empty string")
	}
	return panRegex.MatchString(strings.ToUpper(strings.TrimSpace(pan))), nil
}
