package bankcodes

import (
	"strings"
	"testing"
)

func TestGetPaymentNetwork(t *testing.T) {
	t.Run("Americas", func(t *testing.T) {
		cases := []struct {
			code    string
			primary string
			hasNet  string
		}{
			{"USD", "ACH", "Fedwire"},
			{"BRL", "Pix", "TED"},
			{"MXN", "SPEI", "SPEI"},
			{"CAD", "EFT", "Lynx"},
		}
		for _, tc := range cases {
			result, err := GetPaymentNetwork(tc.code)
			if err != nil {
				t.Errorf("%s: unexpected error: %v", tc.code, err)
				continue
			}
			if result.Primary != tc.primary {
				t.Errorf("%s: Primary = %q, want %q", tc.code, result.Primary, tc.primary)
			}
			found := false
			for _, n := range result.Networks {
				if n == tc.hasNet {
					found = true
					break
				}
			}
			if !found {
				t.Errorf("%s: expected %q in Networks %v", tc.code, tc.hasNet, result.Networks)
			}
		}
	})

	t.Run("Europe", func(t *testing.T) {
		if r, err := GetPaymentNetwork("GBP"); err != nil {
			t.Fatalf("GBP: %v", err)
		} else if r.Primary != "Faster Payments" {
			t.Errorf("GBP Primary = %q, want Faster Payments", r.Primary)
		}

		if r, err := GetPaymentNetwork("EUR"); err != nil {
			t.Fatalf("EUR: %v", err)
		} else if r.Primary != "SEPA" {
			t.Errorf("EUR Primary = %q, want SEPA", r.Primary)
		}

		if r, err := GetPaymentNetwork("PLN"); err != nil {
			t.Fatalf("PLN: %v", err)
		} else if r.Primary != "BLIK" {
			t.Errorf("PLN Primary = %q, want BLIK", r.Primary)
		}
	})

	t.Run("South Asia — INR has all four networks", func(t *testing.T) {
		result, err := GetPaymentNetwork("INR")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if result.Primary != "UPI" {
			t.Errorf("Primary = %q, want UPI", result.Primary)
		}
		for _, want := range []string{"UPI", "IMPS", "NEFT", "RTGS"} {
			found := false
			for _, n := range result.Networks {
				if n == want {
					found = true
					break
				}
			}
			if !found {
				t.Errorf("INR: expected %q in Networks %v", want, result.Networks)
			}
		}
	})

	t.Run("Asia Pacific", func(t *testing.T) {
		cases := []struct {
			code    string
			primary string
		}{
			{"SGD", "FAST"},
			{"MYR", "DuitNow"},
			{"JPY", "Zengin"},
			{"HKD", "FPS"},
			{"CNY", "CNAPS"},
			{"THB", "PromptPay"},
			{"PHP", "InstaPay"},
			{"IDR", "BI-FAST"},
		}
		for _, tc := range cases {
			result, err := GetPaymentNetwork(tc.code)
			if err != nil {
				t.Errorf("%s: unexpected error: %v", tc.code, err)
				continue
			}
			if result.Primary != tc.primary {
				t.Errorf("%s: Primary = %q, want %q", tc.code, result.Primary, tc.primary)
			}
		}
	})

	t.Run("Middle East", func(t *testing.T) {
		if r, _ := GetPaymentNetwork("AED"); r.Primary != "UAEFTS" {
			t.Errorf("AED Primary = %q, want UAEFTS", r.Primary)
		}
		if r, _ := GetPaymentNetwork("SAR"); r.Primary != "SARIE" {
			t.Errorf("SAR Primary = %q, want SARIE", r.Primary)
		}
	})

	t.Run("Africa", func(t *testing.T) {
		if r, _ := GetPaymentNetwork("KES"); r.Primary != "PesaLink" {
			t.Errorf("KES Primary = %q, want PesaLink", r.Primary)
		}
		if r, _ := GetPaymentNetwork("NGN"); r.Primary != "NIP" {
			t.Errorf("NGN Primary = %q, want NIP", r.Primary)
		}
	})

	t.Run("Case-insensitive lookup", func(t *testing.T) {
		result, err := GetPaymentNetwork("usd")
		if err != nil {
			t.Fatalf("unexpected error for lowercase 'usd': %v", err)
		}
		if result.Primary != "ACH" {
			t.Errorf("Primary = %q, want ACH", result.Primary)
		}
	})

	t.Run("Primary is always member of Networks", func(t *testing.T) {
		for _, code := range []string{"USD", "GBP", "EUR", "INR", "SGD", "BRL"} {
			result, err := GetPaymentNetwork(code)
			if err != nil {
				t.Errorf("%s: unexpected error: %v", code, err)
				continue
			}
			found := false
			for _, n := range result.Networks {
				if n == result.Primary {
					found = true
					break
				}
			}
			if !found {
				t.Errorf("%s: Primary %q not in Networks %v", code, result.Primary, result.Networks)
			}
		}
	})

	t.Run("Error — unknown currency code", func(t *testing.T) {
		_, err := GetPaymentNetwork("XXX")
		if err == nil {
			t.Fatal("expected error for 'XXX', got nil")
		}
		if !strings.Contains(err.Error(), "not supported") {
			t.Errorf("error %q should contain 'not supported'", err.Error())
		}
	})

	t.Run("Error — empty string", func(t *testing.T) {
		_, err := GetPaymentNetwork("")
		if err == nil {
			t.Fatal("expected error for empty string, got nil")
		}
		if !strings.Contains(strings.ToLower(err.Error()), "empty") {
			t.Errorf("error %q should mention 'empty'", err.Error())
		}
	})

	t.Run("Error — whitespace-only", func(t *testing.T) {
		_, err := GetPaymentNetwork("   ")
		if err == nil {
			t.Fatal("expected error for whitespace-only string, got nil")
		}
	})
}
