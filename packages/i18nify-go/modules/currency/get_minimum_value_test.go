package currency

import (
	"testing"
)

func TestGetMinimumValue_ExplicitValues(t *testing.T) {
	cases := []struct {
		code string
		want int
	}{
		{"USD", 50},
		{"INR", 50},
		{"EUR", 50},
		{"GBP", 30},
		{"JPY", 50},
		{"AED", 200},
		{"HKD", 400},
		{"HUF", 17500},
		{"CZK", 1500},
		{"MYR", 200},
		{"DKK", 250},
		{"NOK", 300},
		{"SEK", 300},
		{"MXN", 1000},
		{"THB", 1000},
	}
	for _, tc := range cases {
		got, err := GetMinimumValue(tc.code)
		if err != nil {
			t.Errorf("GetMinimumValue(%q) unexpected error: %v", tc.code, err)
			continue
		}
		if got != tc.want {
			t.Errorf("GetMinimumValue(%q) = %d, want %d", tc.code, got, tc.want)
		}
	}
}

func TestGetMinimumValue_FallbackMinorUnit(t *testing.T) {
	// AFN has minor_unit=2 and is NOT in the explicit map → should return 50
	got, err := GetMinimumValue("AFN")
	if err != nil {
		t.Fatalf("GetMinimumValue(AFN) unexpected error: %v", err)
	}
	if got != 50 {
		t.Errorf("GetMinimumValue(AFN) = %d, want 50", got)
	}

	// XOF has minor_unit=0 and is NOT in the explicit map → should return 1
	got, err = GetMinimumValue("XOF")
	if err != nil {
		t.Fatalf("GetMinimumValue(XOF) unexpected error: %v", err)
	}
	if got != 1 {
		t.Errorf("GetMinimumValue(XOF) = %d, want 1", got)
	}
}

func TestGetMinimumValue_InvalidCode(t *testing.T) {
	_, err := GetMinimumValue("XX")
	if err == nil {
		t.Error("GetMinimumValue(XX) expected error, got nil")
	}
}

func TestGetMinimumValue_EmptyCode(t *testing.T) {
	_, err := GetMinimumValue("")
	if err == nil {
		t.Error("GetMinimumValue('') expected error, got nil")
	}
}
