package banking

import (
	"fmt"
	"strings"
)

// MandateFrequencyLabel describes a recurring mandate frequency.
// Days is the approximate number of days between recurrences; 0 means not applicable (AS_PRESENTED).
type MandateFrequencyLabel struct {
	Label       string `json:"label"`
	Description string `json:"description"`
	Days        int    `json:"days,omitempty"`
}

// frequencyLabelMap maps uppercase frequency code keys to their display labels.
// BI_WEEKLY is an alias for FORTNIGHTLY; SEMI_ANNUAL for HALF_YEARLY; ANNUAL for YEARLY.
var frequencyLabelMap = map[string]MandateFrequencyLabel{
	"DAILY":       {Label: "Daily", Description: "Recurring every day", Days: 1},
	"WEEKLY":      {Label: "Weekly", Description: "Recurring every week", Days: 7},
	"FORTNIGHTLY": {Label: "Fortnightly", Description: "Recurring every two weeks", Days: 14},
	"BI_WEEKLY":   {Label: "Bi-Weekly", Description: "Recurring every two weeks", Days: 14},
	"MONTHLY":     {Label: "Monthly", Description: "Recurring every month", Days: 30},
	"BI_MONTHLY":  {Label: "Bi-Monthly", Description: "Recurring every two months", Days: 60},
	"QUARTERLY":   {Label: "Quarterly", Description: "Recurring every three months", Days: 90},
	"HALF_YEARLY": {Label: "Half-Yearly", Description: "Recurring every six months", Days: 180},
	"SEMI_ANNUAL": {Label: "Semi-Annual", Description: "Recurring every six months", Days: 180},
	"YEARLY":      {Label: "Yearly", Description: "Recurring every year", Days: 365},
	"ANNUAL":      {Label: "Annual", Description: "Recurring every year", Days: 365},
	"AS_PRESENTED": {
		Label:       "As Presented",
		Description: "Collected as and when presented by the merchant",
	},
}

// GetMandateFrequencyLabel returns display label information for the given
// mandate frequency code (e.g. "MONTHLY", "WEEKLY"). Lookup is case-insensitive.
func GetMandateFrequencyLabel(frequencyCode string) (MandateFrequencyLabel, error) {
	if strings.TrimSpace(frequencyCode) == "" {
		return MandateFrequencyLabel{}, fmt.Errorf("banking: GetMandateFrequencyLabel: frequencyCode must be a non-empty string")
	}
	label, ok := frequencyLabelMap[strings.ToUpper(strings.TrimSpace(frequencyCode))]
	if !ok {
		return MandateFrequencyLabel{}, fmt.Errorf("banking: GetMandateFrequencyLabel: frequency code %q is not supported", frequencyCode)
	}
	return label, nil
}
