package country_metadata

import (
	"strings"
	"testing"
)

func TestGetCountryCodeByName(t *testing.T) {
	t.Run("Exact ISO official names", func(t *testing.T) {
		cases := []struct {
			name string
			want string
		}{
			{"India", "IN"},
			{"Germany", "DE"},
			{"Japan", "JP"},
			{"Brazil", "BR"},
			{"Saudi Arabia", "SA"},
			{"Czechia", "CZ"},
			{"Türkiye", "TR"},
			{"Viet Nam", "VN"},
			{"Macao", "MO"},
		}
		for _, tc := range cases {
			got, err := GetCountryCodeByName(tc.name)
			if err != nil {
				t.Errorf("%q: unexpected error: %v", tc.name, err)
				continue
			}
			if got != tc.want {
				t.Errorf("%q: got %q, want %q", tc.name, got, tc.want)
			}
		}
	})

	t.Run("ISO names with article annotations", func(t *testing.T) {
		cases := []struct {
			name string
			want string
		}{
			{"Bahamas (the)", "BS"},
			{"United States of America (the)", "US"},
			{"United Kingdom of Great Britain and Northern Ireland (the)", "GB"},
			{"Russian Federation (the)", "RU"},
			{"Korea (the Republic of)", "KR"},
			{"Korea (the Democratic People's Republic of)", "KP"},
			{"Congo (the)", "CG"},
			{"Congo (the Democratic Republic of the)", "CD"},
		}
		for _, tc := range cases {
			got, err := GetCountryCodeByName(tc.name)
			if err != nil {
				t.Errorf("%q: unexpected error: %v", tc.name, err)
				continue
			}
			if got != tc.want {
				t.Errorf("%q: got %q, want %q", tc.name, got, tc.want)
			}
		}
	})

	t.Run("Stripped annotation forms", func(t *testing.T) {
		cases := []struct {
			name string
			want string
		}{
			{"Bahamas", "BS"},
			{"United States of America", "US"},
			{"Russian Federation", "RU"},
			{"Dominican Republic", "DO"},
			{"Falkland Islands", "FK"},
			{"France", "FR"},
			{"Taiwan", "TW"},
			{"Iran", "IR"},
			{"United Arab Emirates", "AE"},
		}
		for _, tc := range cases {
			got, err := GetCountryCodeByName(tc.name)
			if err != nil {
				t.Errorf("%q: unexpected error: %v", tc.name, err)
				continue
			}
			if got != tc.want {
				t.Errorf("%q: got %q, want %q", tc.name, got, tc.want)
			}
		}
	})

	t.Run("Common English aliases", func(t *testing.T) {
		cases := []struct {
			name string
			want string
		}{
			{"United States", "US"},
			{"USA", "US"},
			{"U.S.A.", "US"},
			{"United Kingdom", "GB"},
			{"UK", "GB"},
			{"Russia", "RU"},
			{"South Korea", "KR"},
			{"North Korea", "KP"},
			{"Vietnam", "VN"},
			{"Laos", "LA"},
			{"Tanzania", "TZ"},
			{"Ivory Coast", "CI"},
			{"DR Congo", "CD"},
			{"DRC", "CD"},
			{"Republic of Congo", "CG"},
			{"Turkey", "TR"},
			{"Czech Republic", "CZ"},
			{"Vatican", "VA"},
			{"Macau", "MO"},
			{"Burma", "MM"},
			{"Palestine", "PS"},
			{"Netherlands", "NL"},
			{"UAE", "AE"},
		}
		for _, tc := range cases {
			got, err := GetCountryCodeByName(tc.name)
			if err != nil {
				t.Errorf("%q: unexpected error: %v", tc.name, err)
				continue
			}
			if got != tc.want {
				t.Errorf("%q: got %q, want %q", tc.name, got, tc.want)
			}
		}
	})

	t.Run("Case insensitivity", func(t *testing.T) {
		cases := []struct {
			name string
			want string
		}{
			{"india", "IN"},
			{"INDIA", "IN"},
			{"germany", "DE"},
			{"united states", "US"},
			{"usa", "US"},
			{"south korea", "KR"},
		}
		for _, tc := range cases {
			got, err := GetCountryCodeByName(tc.name)
			if err != nil {
				t.Errorf("%q: unexpected error: %v", tc.name, err)
				continue
			}
			if got != tc.want {
				t.Errorf("%q: got %q, want %q", tc.name, got, tc.want)
			}
		}
	})

	t.Run("Whitespace trimming", func(t *testing.T) {
		got, err := GetCountryCodeByName("  India  ")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if got != "IN" {
			t.Errorf("got %q, want \"IN\"", got)
		}
	})

	t.Run("Error — empty name", func(t *testing.T) {
		for _, name := range []string{"", "   "} {
			_, err := GetCountryCodeByName(name)
			if err == nil {
				t.Errorf("%q: expected error, got nil", name)
				continue
			}
			if !strings.Contains(err.Error(), "empty") {
				t.Errorf("%q: error %q should mention 'empty'", name, err.Error())
			}
		}
	})

	t.Run("Error — unknown name", func(t *testing.T) {
		_, err := GetCountryCodeByName("Neverland")
		if err == nil {
			t.Fatal("expected error, got nil")
		}
		if !strings.Contains(err.Error(), "Neverland") {
			t.Errorf("error %q should contain the unrecognised name", err.Error())
		}
	})
}
