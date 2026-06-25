package datetime

import "testing"

func TestGetPrimaryTimezone(t *testing.T) {
	timezone, err := GetPrimaryTimezone("IN")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if timezone != "Asia/Kolkata" {
		t.Fatalf("unexpected timezone: %s", timezone)
	}

	timezone, err = GetPrimaryTimezone("us")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if timezone != "America/New_York" {
		t.Fatalf("unexpected timezone: %s", timezone)
	}

	if _, err := GetPrimaryTimezone(""); err == nil {
		t.Fatal("expected error for empty country code")
	}
}
