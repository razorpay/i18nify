package bankcodes

import (
	"fmt"
	"regexp"
	"strings"
)

// gstinRegex validates GSTIN format: 2-digit state code + PAN + entity + 'Z' + checksum.
var gstinRegex = regexp.MustCompile(`^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$`)

// validStateCodes holds the valid GST state/UT codes per the GST Act (01–38, 97, 99).
var validStateCodes = map[string]bool{
	"01": true, "02": true, "03": true, "04": true, "05": true,
	"06": true, "07": true, "08": true, "09": true, "10": true,
	"11": true, "12": true, "13": true, "14": true, "15": true,
	"16": true, "17": true, "18": true, "19": true, "20": true,
	"21": true, "22": true, "23": true, "24": true, "26": true,
	"27": true, "29": true, "30": true, "31": true, "32": true,
	"33": true, "34": true, "35": true, "36": true, "37": true,
	"38": true, "97": true, "99": true,
}

// ValidateGSTIN validates an Indian Goods and Services Tax Identification Number (GSTIN).
// Returns true for a correctly formatted GSTIN with a valid state code, false otherwise.
// Returns an error only when the input is empty.
func ValidateGSTIN(gstin string) (bool, error) {
	if strings.TrimSpace(gstin) == "" {
		return false, fmt.Errorf("GSTIN must be a non-empty string")
	}
	normalised := strings.ToUpper(strings.TrimSpace(gstin))
	if !gstinRegex.MatchString(normalised) {
		return false, nil
	}
	return validStateCodes[normalised[:2]], nil
}
