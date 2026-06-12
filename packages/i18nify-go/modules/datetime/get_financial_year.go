package datetime

import (
	"fmt"
	"strings"
	"time"
)

// FYLabelFormat controls the financial year label style.
type FYLabelFormat string

const (
	FYLabelShort FYLabelFormat = "short"
	FYLabelLong  FYLabelFormat = "long"
	FYLabelFY    FYLabelFormat = "fy"
)

// GetFinancialYearOptions holds optional overrides for GetFinancialYear.
type GetFinancialYearOptions struct {
	LabelFormat FYLabelFormat
}

type fyCountryConfig struct {
	startMonth  int
	labelFormat FYLabelFormat
}

var (
	fySupportedCountries = []string{"IN", "JP", "GB", "CA", "NZ", "SG", "ZA", "AU", "BD", "PK", "US"}
	fyConfigMap          = map[string]fyCountryConfig{
		"IN": {startMonth: 4, labelFormat: FYLabelShort},
		"JP": {startMonth: 4, labelFormat: FYLabelShort},
		"GB": {startMonth: 4, labelFormat: FYLabelShort},
		"CA": {startMonth: 4, labelFormat: FYLabelShort},
		"NZ": {startMonth: 4, labelFormat: FYLabelShort},
		"SG": {startMonth: 4, labelFormat: FYLabelShort},
		"ZA": {startMonth: 4, labelFormat: FYLabelShort},
		"AU": {startMonth: 7, labelFormat: FYLabelShort},
		"BD": {startMonth: 7, labelFormat: FYLabelShort},
		"PK": {startMonth: 7, labelFormat: FYLabelShort},
		"US": {startMonth: 10, labelFormat: FYLabelFY},
	}
)

// GetFinancialYear returns the financial year label for a date and country code.
func GetFinancialYear(date time.Time, countryCode string, opts ...GetFinancialYearOptions) (string, error) {
	code := strings.ToUpper(strings.TrimSpace(countryCode))
	if code == "" {
		return "", fmt.Errorf("getFinancialYear: country code must not be empty")
	}

	config, exists := fyConfigMap[code]
	if !exists {
		return "", fmt.Errorf(
			"getFinancialYear: country code %q is not supported; supported: %s",
			countryCode,
			strings.Join(fySupportedCountries, ", "),
		)
	}

	labelFormat := config.labelFormat
	if len(opts) > 0 && opts[0].LabelFormat != "" {
		labelFormat = opts[0].LabelFormat
	}

	fyStartYear := date.Year()
	if int(date.Month()) < config.startMonth {
		fyStartYear--
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
