package banking

import (
	"fmt"
	"strings"
)

// NormalizeIFSC upper-cases and trims ifsc, returning an error if the result
// does not match the standard IFSC format (4 letters + '0' + 6 alphanumeric).
func NormalizeIFSC(ifsc string) (string, error) {
	if strings.TrimSpace(ifsc) == "" {
		return "", fmt.Errorf("banking: NormalizeIFSC: ifsc must be a non-empty string")
	}
	n := strings.ToUpper(strings.TrimSpace(ifsc))
	if !ifscRegex.MatchString(n) {
		return "", fmt.Errorf(
			"banking: NormalizeIFSC: invalid IFSC format %q — expected 4 letters + '0' + 6 alphanumeric (e.g. SBIN0001234)",
			ifsc,
		)
	}
	return n, nil
}
