package banking

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetMandateFrequencyLabel(t *testing.T) {
	tests := []struct {
		name      string
		code      string
		wantLabel string
		wantDays  int
		noDays    bool // true when Days field is expected to be zero (AS_PRESENTED)
		wantErr   bool
	}{
		// ── standard codes ────────────────────────────────────────────────
		{name: "DAILY", code: "DAILY", wantLabel: "Daily", wantDays: 1},
		{name: "WEEKLY", code: "WEEKLY", wantLabel: "Weekly", wantDays: 7},
		{name: "FORTNIGHTLY", code: "FORTNIGHTLY", wantLabel: "Fortnightly", wantDays: 14},
		{name: "MONTHLY", code: "MONTHLY", wantLabel: "Monthly", wantDays: 30},
		{name: "BI_MONTHLY", code: "BI_MONTHLY", wantLabel: "Bi-Monthly", wantDays: 60},
		{name: "QUARTERLY", code: "QUARTERLY", wantLabel: "Quarterly", wantDays: 90},
		{name: "HALF_YEARLY", code: "HALF_YEARLY", wantLabel: "Half-Yearly", wantDays: 180},
		{name: "YEARLY", code: "YEARLY", wantLabel: "Yearly", wantDays: 365},
		{
			name:      "AS_PRESENTED has no days",
			code:      "AS_PRESENTED",
			wantLabel: "As Presented",
			noDays:    true,
		},

		// ── alias codes ───────────────────────────────────────────────────
		{
			name:      "BI_WEEKLY is alias for FORTNIGHTLY",
			code:      "BI_WEEKLY",
			wantLabel: "Bi-Weekly",
			wantDays:  14,
		},
		{
			name:      "SEMI_ANNUAL is alias for HALF_YEARLY",
			code:      "SEMI_ANNUAL",
			wantLabel: "Semi-Annual",
			wantDays:  180,
		},
		{
			name:      "ANNUAL is alias for YEARLY",
			code:      "ANNUAL",
			wantLabel: "Annual",
			wantDays:  365,
		},

		// ── case insensitivity ─────────────────────────────────────────────
		{name: "lowercase monthly", code: "monthly", wantLabel: "Monthly", wantDays: 30},
		{name: "mixed-case Weekly", code: "Weekly", wantLabel: "Weekly", wantDays: 7},

		// ── error cases ───────────────────────────────────────────────────
		{name: "empty string returns error", code: "", wantErr: true},
		{name: "unsupported code returns error", code: "HOURLY", wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetMandateFrequencyLabel(tt.code)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			assert.NoError(t, err)
			assert.Equal(t, tt.wantLabel, got.Label)
			if tt.noDays {
				assert.Zero(t, got.Days)
			} else {
				assert.Equal(t, tt.wantDays, got.Days)
			}
		})
	}
}
