package mandate

import (
	"strings"
	"testing"
)

func TestGetMandateFrequencyLabel(t *testing.T) {
	t.Run("Primary frequency codes", func(t *testing.T) {
		cases := []struct {
			code  string
			label string
			days  int
		}{
			{"DAILY", "Daily", 1},
			{"WEEKLY", "Weekly", 7},
			{"FORTNIGHTLY", "Fortnightly", 14},
			{"MONTHLY", "Monthly", 30},
			{"BI_MONTHLY", "Bi-Monthly", 60},
			{"QUARTERLY", "Quarterly", 90},
			{"HALF_YEARLY", "Half-Yearly", 180},
			{"YEARLY", "Yearly", 365},
		}
		for _, tc := range cases {
			result, err := GetMandateFrequencyLabel(tc.code)
			if err != nil {
				t.Errorf("%s: unexpected error: %v", tc.code, err)
				continue
			}
			if result.Label != tc.label {
				t.Errorf("%s: Label = %q, want %q", tc.code, result.Label, tc.label)
			}
			if result.Days == nil {
				t.Errorf("%s: Days is nil, want %d", tc.code, tc.days)
			} else if *result.Days != tc.days {
				t.Errorf("%s: Days = %d, want %d", tc.code, *result.Days, tc.days)
			}
		}
	})

	t.Run("Alias codes", func(t *testing.T) {
		aliases := []struct {
			code  string
			label string
			days  int
		}{
			{"BI_WEEKLY", "Bi-Weekly", 14},
			{"SEMI_ANNUAL", "Semi-Annual", 180},
			{"ANNUAL", "Annual", 365},
		}
		for _, tc := range aliases {
			result, err := GetMandateFrequencyLabel(tc.code)
			if err != nil {
				t.Errorf("%s: unexpected error: %v", tc.code, err)
				continue
			}
			if result.Label != tc.label {
				t.Errorf("%s: Label = %q, want %q", tc.code, result.Label, tc.label)
			}
			if result.Days == nil || *result.Days != tc.days {
				t.Errorf("%s: Days = %v, want %d", tc.code, result.Days, tc.days)
			}
		}
	})

	t.Run("AS_PRESENTED — variable frequency, nil days", func(t *testing.T) {
		result, err := GetMandateFrequencyLabel("AS_PRESENTED")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if result.Label != "As Presented" {
			t.Errorf("Label = %q, want As Presented", result.Label)
		}
		if result.Days != nil {
			t.Errorf("Days = %d, want nil (variable frequency)", *result.Days)
		}
	})

	t.Run("Case-insensitive lookup", func(t *testing.T) {
		lower, err := GetMandateFrequencyLabel("daily")
		if err != nil {
			t.Fatalf("unexpected error for lowercase 'daily': %v", err)
		}
		if lower.Label != "Daily" {
			t.Errorf("Label = %q, want Daily", lower.Label)
		}

		mixed, err := GetMandateFrequencyLabel("bi_monthly")
		if err != nil {
			t.Fatalf("unexpected error for 'bi_monthly': %v", err)
		}
		if mixed.Label != "Bi-Monthly" {
			t.Errorf("Label = %q, want Bi-Monthly", mixed.Label)
		}
	})

	t.Run("Description is non-empty for all entries", func(t *testing.T) {
		codes := []string{"DAILY", "WEEKLY", "FORTNIGHTLY", "BI_WEEKLY", "MONTHLY",
			"BI_MONTHLY", "QUARTERLY", "HALF_YEARLY", "SEMI_ANNUAL", "YEARLY", "ANNUAL", "AS_PRESENTED"}
		for _, code := range codes {
			result, err := GetMandateFrequencyLabel(code)
			if err != nil {
				t.Errorf("%s: unexpected error: %v", code, err)
				continue
			}
			if result.Description == "" {
				t.Errorf("%s: Description is empty", code)
			}
		}
	})

	t.Run("Error — unknown frequency code", func(t *testing.T) {
		_, err := GetMandateFrequencyLabel("DECADELY")
		if err == nil {
			t.Fatal("expected error for 'DECADELY', got nil")
		}
		if !strings.Contains(err.Error(), "not supported") {
			t.Errorf("error %q should contain 'not supported'", err.Error())
		}
	})

	t.Run("Error — empty string", func(t *testing.T) {
		_, err := GetMandateFrequencyLabel("")
		if err == nil {
			t.Fatal("expected error for empty string, got nil")
		}
		if !strings.Contains(strings.ToLower(err.Error()), "empty") {
			t.Errorf("error %q should mention 'empty'", err.Error())
		}
	})

	t.Run("Error — whitespace-only", func(t *testing.T) {
		_, err := GetMandateFrequencyLabel("   ")
		if err == nil {
			t.Fatal("expected error for whitespace-only string, got nil")
		}
	})
}
