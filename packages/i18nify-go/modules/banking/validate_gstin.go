package banking

import (
	"fmt"
	"regexp"
	"strings"
)

var (
	gstinRegex = regexp.MustCompile(`^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$`)

	// Valid state/UT codes per the GST Act (01–38, 97 = Other Territory, 99 = Centre).
	validStateCodes = map[string]bool{
		"01": true, "02": true, "03": true, "04": true, "05": true,
		"06": true, "07": true, "08": true, "09": true, "10": true,
		"11": true, "12": true, "13": true, "14": true, "15": true,
		"16": true, "17": true, "18": true, "19": true, "20": true,
		"21": true, "22": true, "23": true, "24": true, "26": true,
		"27": true, "29": true, "30": true, "31": true, "32": true,
		"33": true, "34": true, "35": true, "36": true, "37": true,
		"38": true, "97": true, "99": true,
	}
)

// ValidateGSTIN reports whether gstin is a structurally valid Indian GST
// Identification Number. Returns an error only for an empty input.
func ValidateGSTIN(gstin string) (bool, error) {
	if strings.TrimSpace(gstin) == "" {
		return false, fmt.Errorf("banking: ValidateGSTIN: gstin must be a non-empty string")
	}
	n := strings.ToUpper(strings.TrimSpace(gstin))
	if !gstinRegex.MatchString(n) {
		return false, nil
	}
	return validStateCodes[n[:2]], nil
}
