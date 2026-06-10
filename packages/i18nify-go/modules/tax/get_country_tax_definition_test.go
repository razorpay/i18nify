package tax

import (
	"strings"
	"testing"
)

func TestGetCountryTaxDefinition(t *testing.T) {
	t.Run("GST countries", func(t *testing.T) {
		cases := []struct {
			code         string
			wantTaxName  string
			wantFullName string
			wantRate     float64
		}{
			{"IN", "GST", "Goods and Services Tax", 18},
			{"AU", "GST", "Goods and Services Tax", 10},
			{"SG", "GST", "Goods and Services Tax", 9},
			{"NZ", "GST", "Goods and Services Tax", 15},
			{"CA", "GST/HST", "Goods and Services Tax / Harmonized Sales Tax", 5},
		}
		for _, tc := range cases {
			def, err := GetCountryTaxDefinition(tc.code)
			if err != nil {
				t.Errorf("%s: unexpected error: %v", tc.code, err)
				continue
			}
			if def.TaxName != tc.wantTaxName {
				t.Errorf("%s: TaxName = %q, want %q", tc.code, def.TaxName, tc.wantTaxName)
			}
			if def.FullName != tc.wantFullName {
				t.Errorf("%s: FullName = %q, want %q", tc.code, def.FullName, tc.wantFullName)
			}
			if def.StandardRate != tc.wantRate {
				t.Errorf("%s: StandardRate = %v, want %v", tc.code, def.StandardRate, tc.wantRate)
			}
		}
	})

	t.Run("SST — Malaysia", func(t *testing.T) {
		def, err := GetCountryTaxDefinition("MY")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if def.TaxName != "SST" {
			t.Errorf("TaxName = %q, want SST", def.TaxName)
		}
		if def.FullName != "Sales and Service Tax" {
			t.Errorf("FullName = %q, want Sales and Service Tax", def.FullName)
		}
		if def.StandardRate != 10 {
			t.Errorf("StandardRate = %v, want 10", def.StandardRate)
		}
	})

	t.Run("Sales Tax — US, rate 0, has notes", func(t *testing.T) {
		def, err := GetCountryTaxDefinition("US")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if def.TaxName != "Sales Tax" {
			t.Errorf("TaxName = %q, want Sales Tax", def.TaxName)
		}
		if def.StandardRate != 0 {
			t.Errorf("StandardRate = %v, want 0", def.StandardRate)
		}
		if !strings.Contains(strings.ToLower(def.Notes), "state") {
			t.Errorf("Notes %q should mention 'state'", def.Notes)
		}
	})

	t.Run("VAT countries", func(t *testing.T) {
		cases := []struct {
			code     string
			taxName  string
			rate     float64
		}{
			{"GB", "VAT", 20},
			{"DE", "MwSt", 19},
			{"AE", "VAT", 5},
			{"HU", "ÁFA", 27},
			{"JP", "CT", 10},
		}
		for _, tc := range cases {
			def, err := GetCountryTaxDefinition(tc.code)
			if err != nil {
				t.Errorf("%s: unexpected error: %v", tc.code, err)
				continue
			}
			if def.TaxName != tc.taxName {
				t.Errorf("%s: TaxName = %q, want %q", tc.code, def.TaxName, tc.taxName)
			}
			if def.StandardRate != tc.rate {
				t.Errorf("%s: StandardRate = %v, want %v", tc.code, def.StandardRate, tc.rate)
			}
		}
	})

	t.Run("No-tax countries", func(t *testing.T) {
		for _, code := range []string{"HK", "KW"} {
			def, err := GetCountryTaxDefinition(code)
			if err != nil {
				t.Errorf("%s: unexpected error: %v", code, err)
				continue
			}
			if def.TaxName != "" {
				t.Errorf("%s: TaxName = %q, want empty string", code, def.TaxName)
			}
			if def.StandardRate != 0 {
				t.Errorf("%s: StandardRate = %v, want 0", code, def.StandardRate)
			}
		}
	})

	t.Run("Case-insensitive lookup", func(t *testing.T) {
		lower, err := GetCountryTaxDefinition("in")
		if err != nil {
			t.Fatalf("unexpected error for lowercase 'in': %v", err)
		}
		if lower.TaxName != "GST" {
			t.Errorf("lowercase 'in': TaxName = %q, want GST", lower.TaxName)
		}

		gbLower, err := GetCountryTaxDefinition("gb")
		if err != nil {
			t.Fatalf("unexpected error for lowercase 'gb': %v", err)
		}
		if gbLower.TaxName != "VAT" {
			t.Errorf("lowercase 'gb': TaxName = %q, want VAT", gbLower.TaxName)
		}
	})

	t.Run("Return shape — all fields present", func(t *testing.T) {
		def, err := GetCountryTaxDefinition("FR")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if def.TaxName == "" && def.FullName == "" {
			t.Error("FR: both TaxName and FullName are empty — unexpected")
		}
		_ = def.StandardRate
		_ = def.Notes
	})

	t.Run("Error — unknown country code", func(t *testing.T) {
		_, err := GetCountryTaxDefinition("XX")
		if err == nil {
			t.Fatal("expected error for 'XX', got nil")
		}
		if !strings.Contains(err.Error(), "not supported") {
			t.Errorf("error %q should contain 'not supported'", err.Error())
		}
	})

	t.Run("Error — empty string", func(t *testing.T) {
		_, err := GetCountryTaxDefinition("")
		if err == nil {
			t.Fatal("expected error for empty string, got nil")
		}
		if !strings.Contains(strings.ToLower(err.Error()), "empty") {
			t.Errorf("error %q should mention 'empty'", err.Error())
		}
	})

	t.Run("Error — whitespace-only string", func(t *testing.T) {
		_, err := GetCountryTaxDefinition("   ")
		if err == nil {
			t.Fatal("expected error for whitespace-only string, got nil")
		}
	})
}
