package datetime

import (
	"testing"
	"time"
)

func TestGetFinancialYear(t *testing.T) {
	indiaDate := time.Date(2024, time.April, 1, 0, 0, 0, 0, time.UTC)
	result, err := GetFinancialYear(indiaDate, "IN")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if result != "2024-25" {
		t.Fatalf("unexpected result: %s", result)
	}

	usDate := time.Date(2024, time.October, 1, 0, 0, 0, 0, time.UTC)
	result, err = GetFinancialYear(usDate, "US")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if result != "FY2025" {
		t.Fatalf("unexpected result: %s", result)
	}

	if _, err := GetFinancialYear(indiaDate, "DE"); err == nil {
		t.Fatal("expected unsupported country error")
	}
}
