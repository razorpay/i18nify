package datetime

import (
	"fmt"
	"strings"
	"time"
)

// FYLabelFormat controls the financial year label style.
type FYLabelFormat string

const (
	FYLabelShort FYLabelFormat = "short" // "2024-25"
	FYLabelLong  FYLabelFormat = "long"  // "2024-2025"
	FYLabelFY    FYLabelFormat = "fy"    // "FY2025"
)

// GetFinancialYearOptions holds optional overrides for GetFinancialYear.
type GetFinancialYearOptions struct {
	LabelFormat FYLabelFormat
}

type fyCountryConfig struct {
	startMonth  int
	labelFormat FYLabelFormat
}

// fyConfigMap maps ISO 3166-1 alpha-2 country codes to their FY convention.
var fyConfigMap = map[string]fyCountryConfig{
	// April 1 → March 31 — label "2024-25"
	"IN": {4, FYLabelShort},
	"JP": {4, FYLabelShort},
	"GB": {4, FYLabelShort},
	"CA": {4, FYLabelShort},
	"NZ": {4, FYLabelShort},
	"SG": {4, FYLabelShort},
	"ZA": {4, FYLabelShort},
	// July 1 → June 30 — label "2024-25"
	"AU": {7, FYLabelShort},
	"BD": {7, FYLabelShort},
	"PK": {7, FYLabelShort},
	// October 1 → September 30 — label "FY2025"
	"US": {10, FYLabelFY},
}

// GetFinancialYear returns the financial year label for date in the given country.
//
// Supported label formats (override via opts.LabelFormat):
//   - "short" (default for most countries): "2024-25"
//   - "long":  "2024-2025"
//   - "fy"   (default for US):  "FY2025"
//
// Supported country codes: IN, JP, GB, CA, NZ, SG, ZA, AU, BD, PK, US.
//
// Examples:
//
//	GetFinancialYear(time.Date(2024, 11, 15, 0, 0, 0, 0, time.UTC), "IN")  → "2024-25"
//	GetFinancialYear(time.Date(2024, 2, 10, 0, 0, 0, 0, time.UTC),  "IN")  → "2023-24"
//	GetFinancialYear(time.Date(2024, 11, 15, 0, 0, 0, 0, time.UTC), "US")  → "FY2025"
func GetFinancialYear(date time.Time, countryCode string, opts ...GetFinancialYearOptions) (string, error) {
	if strings.TrimSpace(countryCode) == "" {
		return "", fmt.Errorf("getFinancialYear: country code must not be empty")
	}

	code := strings.ToUpper(strings.TrimSpace(countryCode))
	cfg, ok := fyConfigMap[code]
	if !ok {
		supported := make([]string, 0, len(fyConfigMap))
		for k := range fyConfigMap {
			supported = append(supported, k)
		}
		return "", fmt.Errorf(
			"getFinancialYear: country code %q is not supported; supported: %s",
			countryCode, strings.Join(supported, ", "),
		)
	}

	labelFormat := cfg.labelFormat
	if len(opts) > 0 && opts[0].LabelFormat != "" {
		labelFormat = opts[0].LabelFormat
	}

	year := date.Year()
	month := int(date.Month()) // time.Month is 1-indexed

	fyStartYear := year
	if month < cfg.startMonth {
		fyStartYear = year - 1
	}
	fyEndYear := fyStartYear + 1

	switch labelFormat {
	case FYLabelShort:
		return fmt.Sprintf("%d-%02d", fyStartYear, fyEndYear%100), nil
	case FYLabelLong:
		return fmt.Sprintf("%d-%d", fyStartYear, fyEndYear), nil
	case FYLabelFY:
		return fmt.Sprintf("FY%d", fyEndYear), nil
	default:
		return "", fmt.Errorf("getFinancialYear: unknown label format %q", labelFormat)
	}
}
