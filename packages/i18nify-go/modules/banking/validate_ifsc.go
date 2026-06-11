package banking

import (
	"fmt"
	"regexp"
	"strings"
)

// ifscRegex is shared by ValidateIFSC and NormalizeIFSC.
var ifscRegex = regexp.MustCompile(`^[A-Z]{4}0[A-Z0-9]{6}$`)

// ValidateIFSC reports whether ifsc is a structurally valid Indian Financial
// System Code (4 letters + '0' + 6 alphanumeric = 11 chars).
func ValidateIFSC(ifsc string) (bool, error) {
	if strings.TrimSpace(ifsc) == "" {
		return false, fmt.Errorf("banking: ValidateIFSC: ifsc must be a non-empty string")
	}
	return ifscRegex.MatchString(strings.ToUpper(strings.TrimSpace(ifsc))), nil
}
