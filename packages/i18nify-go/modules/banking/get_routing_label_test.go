package banking

import "testing"

func TestGetRoutingLabel(t *testing.T) {
	t.Run("returns IFSC label metadata", func(t *testing.T) {
		got, err := GetRoutingLabel("IFSC")
		if err != nil {
			t.Fatalf("expected no error, got %v", err)
		}
		if got.Label != "IFSC" || got.FullName != "Indian Financial System Code" || got.Country != "IN" {
			t.Fatalf("unexpected result: %+v", got)
		}
	})

	t.Run("lookup is case-insensitive", func(t *testing.T) {
		got, err := GetRoutingLabel("swift")
		if err != nil {
			t.Fatalf("expected no error, got %v", err)
		}
		if got.Label != "SWIFT Code" {
			t.Fatalf("unexpected label: %s", got.Label)
		}
	})

	t.Run("errors on empty input", func(t *testing.T) {
		if _, err := GetRoutingLabel(""); err == nil {
			t.Fatal("expected an error for empty input")
		}
	})

	t.Run("errors on unsupported types", func(t *testing.T) {
		if _, err := GetRoutingLabel("FOO"); err == nil {
			t.Fatal("expected an error for unsupported routing type")
		}
	})
}
