package datetime

import "testing"

func TestTimezoneToCountry(t *testing.T) {
	countries, err := TimezoneToCountry("Asia/Kolkata")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if len(countries) != 1 || countries[0] != "IN" {
		t.Fatalf("unexpected countries: %#v", countries)
	}

	countries, err = TimezoneToCountry("America/Port_of_Spain")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if len(countries) != 1 || countries[0] != "TT" {
		t.Fatalf("unexpected countries for America/Port_of_Spain: %#v", countries)
	}

	if _, err := TimezoneToCountry(""); err == nil {
		t.Fatal("expected error for empty timezone")
	}
}
