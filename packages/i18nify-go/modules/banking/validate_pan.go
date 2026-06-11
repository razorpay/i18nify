package banking

import (
	"fmt"
	"regexp"
	"strings"
)

// 4th character encodes entity type: P=individual, C=company, H=HUF,
// F=firm, A=AOP, T=trust, B=BOI, L=local authority, J=juridical, G=govt.
var panRegex = regexp.MustCompile(`^[A-Z]{3}[PCFHABLJTG][A-Z][0-9]{4}[A-Z]$`)

// ValidatePAN reports whether pan is a structurally valid Indian Permanent
// Account Number.
func ValidatePAN(pan string) (bool, error) {
	if strings.TrimSpace(pan) == "" {
		return false, fmt.Errorf("banking: ValidatePAN: pan must be a non-empty string")
	}
	return panRegex.MatchString(strings.ToUpper(strings.TrimSpace(pan))), nil
}
