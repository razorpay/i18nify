package datetime

import "testing"

func TestGetOrdinalSuffix(t *testing.T) {
	t.Run("basic suffixes", func(t *testing.T) {
		testCases := map[int]string{
			1:  "st",
			2:  "nd",
			3:  "rd",
			4:  "th",
			7:  "th",
			10: "th",
		}

		for n, expected := range testCases {
			got, err := GetOrdinalSuffix(n)
			if err != nil {
				t.Fatalf("expected no error for %d, got %v", n, err)
			}
			if got != expected {
				t.Fatalf("unexpected suffix for %d: got %q want %q", n, got, expected)
			}
		}
	})

	t.Run("teen exceptions", func(t *testing.T) {
		for _, n := range []int{11, 12, 13, 111, 112, 113} {
			got, err := GetOrdinalSuffix(n)
			if err != nil {
				t.Fatalf("expected no error for %d, got %v", n, err)
			}
			if got != "th" {
				t.Fatalf("unexpected suffix for %d: got %q want %q", n, got, "th")
			}
		}
	})

	t.Run("tens override", func(t *testing.T) {
		testCases := map[int]string{
			21:  "st",
			22:  "nd",
			23:  "rd",
			31:  "st",
			121: "st",
		}

		for n, expected := range testCases {
			got, err := GetOrdinalSuffix(n)
			if err != nil {
				t.Fatalf("expected no error for %d, got %v", n, err)
			}
			if got != expected {
				t.Fatalf("unexpected suffix for %d: got %q want %q", n, got, expected)
			}
		}
	})

	t.Run("invalid values", func(t *testing.T) {
		for _, n := range []int{0, -1} {
			if _, err := GetOrdinalSuffix(n); err == nil {
				t.Fatalf("expected an error for %d", n)
			}
		}
	})
}
