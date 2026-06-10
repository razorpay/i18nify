package mandate

import (
	"fmt"
	"strings"
)

// MandateFrequencyLabel holds the display metadata for a recurring payment frequency code.
// Days is nil for variable-frequency codes (e.g. AS_PRESENTED).
type MandateFrequencyLabel struct {
	Label       string `json:"label"`
	Description string `json:"description"`
	Days        *int   `json:"days,omitempty"` // approximate days between recurrences; nil for variable
}

func daysPtr(n int) *int { return &n }

// frequencyLabelMap maps SCREAMING_SNAKE_CASE frequency codes to display metadata.
// BI_WEEKLY is an alias for FORTNIGHTLY; SEMI_ANNUAL for HALF_YEARLY; ANNUAL for YEARLY.
var frequencyLabelMap = map[string]MandateFrequencyLabel{
	"DAILY":        {Label: "Daily", Description: "Recurring every day", Days: daysPtr(1)},
	"WEEKLY":       {Label: "Weekly", Description: "Recurring every week", Days: daysPtr(7)},
	"FORTNIGHTLY":  {Label: "Fortnightly", Description: "Recurring every two weeks", Days: daysPtr(14)},
	"BI_WEEKLY":    {Label: "Bi-Weekly", Description: "Recurring every two weeks", Days: daysPtr(14)},
	"MONTHLY":      {Label: "Monthly", Description: "Recurring every month", Days: daysPtr(30)},
	"BI_MONTHLY":   {Label: "Bi-Monthly", Description: "Recurring every two months", Days: daysPtr(60)},
	"QUARTERLY":    {Label: "Quarterly", Description: "Recurring every three months", Days: daysPtr(90)},
	"HALF_YEARLY":  {Label: "Half-Yearly", Description: "Recurring every six months", Days: daysPtr(180)},
	"SEMI_ANNUAL":  {Label: "Semi-Annual", Description: "Recurring every six months", Days: daysPtr(180)},
	"YEARLY":       {Label: "Yearly", Description: "Recurring every year", Days: daysPtr(365)},
	"ANNUAL":       {Label: "Annual", Description: "Recurring every year", Days: daysPtr(365)},
	"AS_PRESENTED": {Label: "As Presented", Description: "Collected as and when presented by the merchant"},
}

// GetMandateFrequencyLabel returns the display label for the given mandate frequency code.
//
// Lookup is case-insensitive. Returns an error for empty or unsupported codes.
//
// Examples:
//
//	GetMandateFrequencyLabel("DAILY")        → {Daily, Recurring every day, 1}
//	GetMandateFrequencyLabel("BI_MONTHLY")   → {Bi-Monthly, Recurring every two months, 60}
//	GetMandateFrequencyLabel("AS_PRESENTED") → {As Presented, Collected as and when..., nil}
func GetMandateFrequencyLabel(frequencyCode string) (MandateFrequencyLabel, error) {
	if strings.TrimSpace(frequencyCode) == "" {
		return MandateFrequencyLabel{}, fmt.Errorf("getMandateFrequencyLabel: frequency code must not be empty")
	}

	key := strings.ToUpper(strings.TrimSpace(frequencyCode))
	label, ok := frequencyLabelMap[key]
	if !ok {
		return MandateFrequencyLabel{}, fmt.Errorf(
			"getMandateFrequencyLabel: frequency code %q is not supported",
			frequencyCode,
		)
	}
	return label, nil
}
