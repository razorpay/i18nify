package bankcodes

import (
	"fmt"
	"regexp"
	"strings"
)

// ifscRegex validates Indian Financial System Code format.
// 4 alpha (bank code) + '0' (reserved) + 6 alphanumeric (branch code) = 11 chars.
var ifscRegex = regexp.MustCompile(`^[A-Z]{4}0[A-Z0-9]{6}$`)

// ValidateIFSC validates an Indian Financial System Code (IFSC).
// Returns true for a correctly formatted IFSC, false for an invalid format.
// Returns an error only when the input is empty.
func ValidateIFSC(ifsc string) (bool, error) {
	if strings.TrimSpace(ifsc) == "" {
		return false, fmt.Errorf("IFSC must be a non-empty string")
	}
	return ifscRegex.MatchString(strings.ToUpper(strings.TrimSpace(ifsc))), nil
}

// NormalizeIFSC uppercases and trims an IFSC code.
// Returns an error if the input is empty or the normalised value is not a valid IFSC.
func NormalizeIFSC(ifsc string) (string, error) {
	if strings.TrimSpace(ifsc) == "" {
		return "", fmt.Errorf("IFSC must be a non-empty string")
	}
	normalised := strings.ToUpper(strings.TrimSpace(ifsc))
	if !ifscRegex.MatchString(normalised) {
		return "", fmt.Errorf("invalid IFSC format %q: expected 4 letters + '0' + 6 alphanumeric (e.g. SBIN0001234)", ifsc)
	}
	return normalised, nil
}
