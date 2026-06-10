package currency

import (
	"testing"
)

// ── groupIntegerStr unit tests ────────────────────────────────────────────────

func TestGroupIntegerStr(t *testing.T) {
	cases := []struct {
		name       string
		input      string
		groupSizes []int
		sep        string
		want       string
	}{
		{"western [3]", "1234567", []int{3}, ",", "1,234,567"},
		{"indian [3,2] 7-digit", "1234567", []int{3, 2}, ",", "12,34,567"},
		{"indian [3,2] 8-digit", "12345678", []int{3, 2}, ",", "1,23,45,678"},
		{"empty groupSizes", "1234567", []int{}, ",", "1234567"},
		{"empty sep", "1234567", []int{3}, "", "1234567"},
		{"single group", "567", []int{3}, ",", "567"},
		{"shorter than group", "12", []int{3}, ",", "12"},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			got := groupIntegerStr(c.input, c.groupSizes, c.sep)
			if got != c.want {
				t.Errorf("got %q, want %q", got, c.want)
			}
		})
	}
}

// ── substituteDigitsStr unit tests ───────────────────────────────────────────

func TestSubstituteDigitsStr(t *testing.T) {
	arabicDigits := "٠١٢٣٤٥٦٧٨٩"
	bengaliDigits := "০১২৩৪৫৬৭৮৯"

	cases := []struct {
		name   string
		input  string
		glyphs string
		want   string
	}{
		{"arabic digits", "1234567", arabicDigits, "١٢٣٤٥٦٧"},
		{"bengali digits", "1234567", bengaliDigits, "১২৩৪৫৬৭"},
		{"separators pass through", "1,234.56", arabicDigits, "١,٢٣٤.٥٦"},
		{"wrong glyph length", "123", "abc", "123"},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			got := substituteDigitsStr(c.input, c.glyphs)
			if got != c.want {
				t.Errorf("got %q, want %q", got, c.want)
			}
		})
	}
}

// ── CurrencyFormatters constant ───────────────────────────────────────────────

func TestCurrencyFormattersMap(t *testing.T) {
	styles := []FormatterStyle{
		StyleWestern, StyleIndian, StyleEuropean, StyleFrench, StyleSwiss,
		StyleSwazi, StyleArabic, StyleBengali, StyleNoGrouping,
	}
	if len(CurrencyFormatters) != len(styles) {
		t.Errorf("expected %d styles, got %d", len(styles), len(CurrencyFormatters))
	}
	for _, s := range styles {
		if _, ok := CurrencyFormatters[s]; !ok {
			t.Errorf("missing style %q", s)
		}
	}

	if CurrencyFormatters[StyleIndian].GroupSizes[0] != 3 || CurrencyFormatters[StyleIndian].GroupSizes[1] != 2 {
		t.Error("INDIAN should have GroupSizes [3,2]")
	}
	if CurrencyFormatters[StyleArabic].Digits != "٠١٢٣٤٥٦٧٨٩" {
		t.Error("ARABIC missing digit glyphs")
	}
	if CurrencyFormatters[StyleNoGrouping].ThousandsSep != "" {
		t.Error("NO_GROUPING should have empty ThousandsSep")
	}
}

// ── FormatWithStyle integration tests ────────────────────────────────────────

func TestFormatWithStyle(t *testing.T) {
	type args struct {
		amount float64
		style  FormatterStyle
		opts   FormatWithStyleOptions
	}

	cases := []struct {
		name string
		args args
		want string
	}{
		{"WESTERN basic", args{1234567.89, StyleWestern, FormatWithStyleOptions{Decimals: 2}}, "1,234,567.89"},
		{"INDIAN basic", args{1234567.89, StyleIndian, FormatWithStyleOptions{Decimals: 2}}, "12,34,567.89"},
		{"EUROPEAN basic", args{1234567.89, StyleEuropean, FormatWithStyleOptions{Decimals: 2}}, "1.234.567,89"},
		{"FRENCH basic", args{1234567.89, StyleFrench, FormatWithStyleOptions{Decimals: 2}}, "1 234 567,89"},
		{"SWISS basic", args{1234567.89, StyleSwiss, FormatWithStyleOptions{Decimals: 2}}, "1'234'567.89"},
		{"SWAZI basic", args{1234567.89, StyleSwazi, FormatWithStyleOptions{Decimals: 2}}, "1 234 567.89"},
		{"ARABIC basic", args{1234567.89, StyleArabic, FormatWithStyleOptions{Decimals: 2}}, "١٬٢٣٤٬٥٦٧٫٨٩"},
		{"BENGALI basic", args{1234567.89, StyleBengali, FormatWithStyleOptions{Decimals: 2}}, "১২,৩৪,৫৬৭.৮৯"},
		{"NO_GROUPING basic", args{1234567.89, StyleNoGrouping, FormatWithStyleOptions{Decimals: 2}}, "1234567.89"},

		// Currency-aware decimal places
		{"INR 2 decimals", args{1234.5, StyleIndian, FormatWithStyleOptions{Currency: "INR", Decimals: -1}}, "1,234.50"},
		{"JPY 0 decimals", args{1234.9, StyleWestern, FormatWithStyleOptions{Currency: "JPY", Decimals: -1}}, "1,235"},
		{"BHD 3 decimals", args{1.5, StyleWestern, FormatWithStyleOptions{Currency: "BHD", Decimals: -1}}, "1.500"},

		// Negative
		{"WESTERN negative", args{-1234.56, StyleWestern, FormatWithStyleOptions{Decimals: 2}}, "-1,234.56"},
		{"EUROPEAN negative", args{-1234.56, StyleEuropean, FormatWithStyleOptions{Decimals: 2}}, "-1.234,56"},

		// Decimals override
		{"3 decimal places", args{1234.567, StyleWestern, FormatWithStyleOptions{Decimals: 3}}, "1,234.567"},
		{"0 decimal places", args{1234.567, StyleWestern, FormatWithStyleOptions{Decimals: 0}}, "1,235"},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			got, err := FormatWithStyle(c.args.amount, c.args.style, c.args.opts)
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if got != c.want {
				t.Errorf("got %q, want %q", got, c.want)
			}
		})
	}
}

func TestFormatWithStyleShowSymbol(t *testing.T) {
	got, err := FormatWithStyle(1000, StyleIndian, FormatWithStyleOptions{
		Currency:   "INR",
		Decimals:   -1,
		ShowSymbol: true,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if got != "₹1,000.00" {
		t.Errorf("got %q, want %q", got, "₹1,000.00")
	}
}

func TestFormatWithStyleUnknownStyle(t *testing.T) {
	_, err := FormatWithStyle(100, "INVALID_STYLE", FormatWithStyleOptions{Decimals: 2})
	if err == nil {
		t.Error("expected error for unknown style, got nil")
	}
}
