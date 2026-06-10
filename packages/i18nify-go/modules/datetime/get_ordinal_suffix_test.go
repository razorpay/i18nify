package datetime

import (
	"strings"
	"testing"
)

func TestGetOrdinalSuffix(t *testing.T) {
	t.Run("Basic suffixes", func(t *testing.T) {
		cases := []struct {
			n    int
			want string
		}{
			{1, "st"},
			{2, "nd"},
			{3, "rd"},
			{4, "th"},
			{7, "th"},
			{10, "th"},
		}
		for _, tc := range cases {
			got, err := GetOrdinalSuffix(tc.n)
			if err != nil {
				t.Errorf("%d: unexpected error: %v", tc.n, err)
				continue
			}
			if got != tc.want {
				t.Errorf("%d: got %q, want %q", tc.n, got, tc.want)
			}
		}
	})

	t.Run("Teen exceptions 11–13 → th", func(t *testing.T) {
		for _, n := range []int{11, 12, 13} {
			got, err := GetOrdinalSuffix(n)
			if err != nil {
				t.Errorf("%d: unexpected error: %v", n, err)
				continue
			}
			if got != "th" {
				t.Errorf("%d: got %q, want \"th\"", n, got)
			}
		}
	})

	t.Run("Tens + 1/2/3 override teen rule", func(t *testing.T) {
		cases := []struct {
			n    int
			want string
		}{
			{21, "st"},
			{22, "nd"},
			{23, "rd"},
			{31, "st"},
		}
		for _, tc := range cases {
			got, err := GetOrdinalSuffix(tc.n)
			if err != nil {
				t.Errorf("%d: unexpected error: %v", tc.n, err)
				continue
			}
			if got != tc.want {
				t.Errorf("%d: got %q, want %q", tc.n, got, tc.want)
			}
		}
	})

	t.Run("Hundreds — teen exception via n%%100", func(t *testing.T) {
		cases := []struct {
			n    int
			want string
		}{
			{101, "st"},
			{111, "th"},
			{112, "th"},
			{113, "th"},
			{121, "st"},
		}
		for _, tc := range cases {
			got, err := GetOrdinalSuffix(tc.n)
			if err != nil {
				t.Errorf("%d: unexpected error: %v", tc.n, err)
				continue
			}
			if got != tc.want {
				t.Errorf("%d: got %q, want %q", tc.n, got, tc.want)
			}
		}
	})

	t.Run("Error — n < 1", func(t *testing.T) {
		for _, n := range []int{0, -1, -100} {
			_, err := GetOrdinalSuffix(n)
			if err == nil {
				t.Errorf("%d: expected error, got nil", n)
				continue
			}
			if !strings.Contains(err.Error(), "positive") {
				t.Errorf("%d: error %q should mention 'positive'", n, err.Error())
			}
		}
	})
}
