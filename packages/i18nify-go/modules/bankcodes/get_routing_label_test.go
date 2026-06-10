package bankcodes

import (
	"strings"
	"testing"
)

func TestGetRoutingLabel(t *testing.T) {
	t.Run("India — IFSC", func(t *testing.T) {
		label, err := GetRoutingLabel("IFSC")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if label.Label != "IFSC" {
			t.Errorf("Label = %q, want IFSC", label.Label)
		}
		if label.FullName != "Indian Financial System Code" {
			t.Errorf("FullName = %q", label.FullName)
		}
		if label.Country != "IN" {
			t.Errorf("Country = %q, want IN", label.Country)
		}
	})

	t.Run("Global — SWIFT", func(t *testing.T) {
		label, err := GetRoutingLabel("SWIFT")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if label.Label != "SWIFT Code" {
			t.Errorf("Label = %q, want SWIFT Code", label.Label)
		}
		if label.Country != "" {
			t.Errorf("Country = %q, want empty (global code)", label.Country)
		}
	})

	t.Run("Global — BIC alias", func(t *testing.T) {
		label, err := GetRoutingLabel("BIC")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if label.Label != "BIC" {
			t.Errorf("Label = %q, want BIC", label.Label)
		}
	})

	t.Run("US — ROUTING_NUMBER and ABA alias", func(t *testing.T) {
		for _, code := range []string{"ROUTING_NUMBER", "ABA"} {
			label, err := GetRoutingLabel(code)
			if err != nil {
				t.Errorf("%s: unexpected error: %v", code, err)
				continue
			}
			if label.Country != "US" {
				t.Errorf("%s: Country = %q, want US", code, label.Country)
			}
			if label.FullName != "ABA Routing Number" {
				t.Errorf("%s: FullName = %q, want ABA Routing Number", code, label.FullName)
			}
		}
	})

	t.Run("UK — SORT_CODE", func(t *testing.T) {
		label, err := GetRoutingLabel("SORT_CODE")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if label.Label != "Sort Code" {
			t.Errorf("Label = %q, want Sort Code", label.Label)
		}
		if label.Country != "GB" {
			t.Errorf("Country = %q, want GB", label.Country)
		}
	})

	t.Run("Australia — BSB", func(t *testing.T) {
		label, err := GetRoutingLabel("BSB")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if label.Label != "BSB Number" {
			t.Errorf("Label = %q, want BSB Number", label.Label)
		}
		if label.Country != "AU" {
			t.Errorf("Country = %q, want AU", label.Country)
		}
	})

	t.Run("Global — IBAN (no country)", func(t *testing.T) {
		label, err := GetRoutingLabel("IBAN")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if label.Label != "IBAN" {
			t.Errorf("Label = %q, want IBAN", label.Label)
		}
		if label.Country != "" {
			t.Errorf("Country = %q, want empty", label.Country)
		}
	})

	t.Run("Mexico — CLABE", func(t *testing.T) {
		label, err := GetRoutingLabel("CLABE")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if label.Country != "MX" {
			t.Errorf("Country = %q, want MX", label.Country)
		}
	})

	t.Run("China — CNAPS", func(t *testing.T) {
		label, err := GetRoutingLabel("CNAPS")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if label.Country != "CN" {
			t.Errorf("Country = %q, want CN", label.Country)
		}
	})

	t.Run("Canada — TRANSIT", func(t *testing.T) {
		label, err := GetRoutingLabel("TRANSIT")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if label.Country != "CA" {
			t.Errorf("Country = %q, want CA", label.Country)
		}
	})

	t.Run("India — MICR", func(t *testing.T) {
		label, err := GetRoutingLabel("MICR")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if label.Country != "IN" {
			t.Errorf("Country = %q, want IN", label.Country)
		}
	})

	t.Run("Case-insensitive lookup", func(t *testing.T) {
		label, err := GetRoutingLabel("ifsc")
		if err != nil {
			t.Fatalf("unexpected error for lowercase 'ifsc': %v", err)
		}
		if label.Label != "IFSC" {
			t.Errorf("Label = %q, want IFSC", label.Label)
		}

		sort, err := GetRoutingLabel("sort_code")
		if err != nil {
			t.Fatalf("unexpected error for lowercase 'sort_code': %v", err)
		}
		if sort.Label != "Sort Code" {
			t.Errorf("Label = %q, want Sort Code", sort.Label)
		}
	})

	t.Run("Description is non-empty for all entries", func(t *testing.T) {
		for _, code := range []string{"IFSC", "SWIFT", "BIC", "ROUTING_NUMBER", "ABA", "SORT_CODE", "BSB", "IBAN", "CLABE", "CNAPS", "TRANSIT", "MICR"} {
			label, err := GetRoutingLabel(code)
			if err != nil {
				t.Errorf("%s: unexpected error: %v", code, err)
				continue
			}
			if label.Description == "" {
				t.Errorf("%s: Description is empty", code)
			}
		}
	})

	t.Run("Error — unknown type", func(t *testing.T) {
		_, err := GetRoutingLabel("UNKNOWN")
		if err == nil {
			t.Fatal("expected error for 'UNKNOWN', got nil")
		}
		if !strings.Contains(err.Error(), "not supported") {
			t.Errorf("error %q should contain 'not supported'", err.Error())
		}
	})

	t.Run("Error — empty string", func(t *testing.T) {
		_, err := GetRoutingLabel("")
		if err == nil {
			t.Fatal("expected error for empty string, got nil")
		}
		if !strings.Contains(strings.ToLower(err.Error()), "empty") {
			t.Errorf("error %q should mention 'empty'", err.Error())
		}
	})

	t.Run("Error — whitespace-only", func(t *testing.T) {
		_, err := GetRoutingLabel("   ")
		if err == nil {
			t.Fatal("expected error for whitespace-only input, got nil")
		}
	})
}
