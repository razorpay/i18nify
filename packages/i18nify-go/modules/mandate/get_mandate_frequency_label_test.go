package mandate

import "testing"

func TestGetMandateFrequencyLabel(t *testing.T) {
	t.Run("returns monthly frequency metadata", func(t *testing.T) {
		got, err := GetMandateFrequencyLabel("MONTHLY")
		if err != nil {
			t.Fatalf("expected no error, got %v", err)
		}
		if got.Label != "Monthly" || got.Description != "Recurring every month" || got.Days != 30 {
			t.Fatalf("unexpected result: %+v", got)
		}
	})

	t.Run("supports aliases and case-insensitive lookup", func(t *testing.T) {
		got, err := GetMandateFrequencyLabel("annual")
		if err != nil {
			t.Fatalf("expected no error, got %v", err)
		}
		if got.Label != "Annual" || got.Days != 365 {
			t.Fatalf("unexpected result: %+v", got)
		}
	})

	t.Run("handles AS_PRESENTED", func(t *testing.T) {
		got, err := GetMandateFrequencyLabel("AS_PRESENTED")
		if err != nil {
			t.Fatalf("expected no error, got %v", err)
		}
		if got.Label != "As Presented" || got.Days != 0 {
			t.Fatalf("unexpected result: %+v", got)
		}
	})

	t.Run("errors on empty input", func(t *testing.T) {
		if _, err := GetMandateFrequencyLabel(""); err == nil {
			t.Fatal("expected an error for empty input")
		}
	})

	t.Run("errors on unsupported codes", func(t *testing.T) {
		if _, err := GetMandateFrequencyLabel("HOURLY"); err == nil {
			t.Fatal("expected an error for unsupported code")
		}
	})
}
