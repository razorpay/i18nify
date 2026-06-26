package banking

import "testing"

func TestGetPaymentNetwork(t *testing.T) {
	t.Run("returns payment networks for INR", func(t *testing.T) {
		got, err := GetPaymentNetwork("INR")
		if err != nil {
			t.Fatalf("expected no error, got %v", err)
		}
		if got.Primary != "UPI" || len(got.Networks) != 4 {
			t.Fatalf("unexpected result: %+v", got)
		}
	})

	t.Run("lookup is case-insensitive", func(t *testing.T) {
		got, err := GetPaymentNetwork("usd")
		if err != nil {
			t.Fatalf("expected no error, got %v", err)
		}
		if got.Primary != "ACH" {
			t.Fatalf("unexpected primary network: %s", got.Primary)
		}
	})

	t.Run("errors on empty input", func(t *testing.T) {
		if _, err := GetPaymentNetwork(""); err == nil {
			t.Fatal("expected an error for empty input")
		}
	})

	t.Run("errors on unsupported currencies", func(t *testing.T) {
		if _, err := GetPaymentNetwork("XXX"); err == nil {
			t.Fatal("expected an error for unsupported currency")
		}
	})
}
