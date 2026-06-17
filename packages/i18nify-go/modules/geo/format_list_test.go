package geo

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFormatList_Basic(t *testing.T) {
	tests := []struct {
		name  string
		items []string
		opts  FormatListOptions
		want  string
	}{
		{"empty slice", []string{}, FormatListOptions{}, ""},
		{"single item", []string{"UPI"}, FormatListOptions{}, "UPI"},
		{"two items", []string{"UPI", "Card"}, FormatListOptions{}, "UPI and Card"},
		{"three items Oxford comma", []string{"UPI", "Card", "Wallet"}, FormatListOptions{}, "UPI, Card, and Wallet"},
		{"four items", []string{"A", "B", "C", "D"}, FormatListOptions{}, "A, B, C, and D"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := FormatList(tt.items, tt.opts)
			assert.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestFormatList_Locales(t *testing.T) {
	tests := []struct {
		locale string
		items  []string
		want   string
	}{
		{"en", []string{"A", "B", "C"}, "A, B, and C"},
		{"en-US", []string{"A", "B", "C"}, "A, B, and C"},
		{"fr", []string{"A", "B", "C"}, "A, B et C"},
		{"fr-FR", []string{"A", "B", "C"}, "A, B et C"},
		{"de", []string{"A", "B", "C"}, "A, B und C"},
		{"es", []string{"A", "B", "C"}, "A, B y C"},
		{"hi", []string{"A", "B", "C"}, "A, B और C"},
		{"ja", []string{"A", "B", "C"}, "A, B と C"},
	}
	for _, tt := range tests {
		t.Run(tt.locale, func(t *testing.T) {
			got, err := FormatList(tt.items, FormatListOptions{Locale: tt.locale})
			assert.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestFormatList_Disjunction(t *testing.T) {
	got, err := FormatList([]string{"A", "B", "C"}, FormatListOptions{Type: "disjunction"})
	assert.NoError(t, err)
	assert.Equal(t, "A, B, or C", got)
}

func TestFormatList_DisjunctionTwo(t *testing.T) {
	got, err := FormatList([]string{"A", "B"}, FormatListOptions{Type: "disjunction"})
	assert.NoError(t, err)
	assert.Equal(t, "A or B", got)
}

func TestFormatList_Truncation(t *testing.T) {
	tests := []struct {
		name     string
		items    []string
		maxItems int
		want     string
	}{
		{"2 hidden", []string{"UPI", "Card", "Wallet", "NetBanking"}, 2, "UPI, Card, and 2 others"},
		{"1 hidden singular", []string{"A", "B", "C"}, 2, "A, B, and 1 other"},
		{"maxItems >= len shows all", []string{"A", "B", "C"}, 5, "A, B, and C"},
		{"maxItems=1 three items", []string{"A", "B", "C", "D"}, 1, "A and 3 others"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := FormatList(tt.items, FormatListOptions{MaxItems: tt.maxItems})
			assert.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestFormatList_CustomOthersLabel(t *testing.T) {
	got, err := FormatList([]string{"A", "B", "C", "D"}, FormatListOptions{
		MaxItems:    2,
		OthersLabel: func(n int) string { return "and more" },
	})
	assert.NoError(t, err)
	assert.Equal(t, "A, B, and and more", got)
}

func TestFormatList_TruncationWithLocale(t *testing.T) {
	got, err := FormatList([]string{"A", "B", "C"}, FormatListOptions{Locale: "fr", MaxItems: 1})
	assert.NoError(t, err)
	assert.Equal(t, "A et 2 others", got)
}

func TestFormatList_UnknownLocaleFallsBackToEnglish(t *testing.T) {
	got, err := FormatList([]string{"A", "B", "C"}, FormatListOptions{Locale: "xx"})
	assert.NoError(t, err)
	assert.Equal(t, "A, B, and C", got)
}

func TestFormatList_InvalidType_Error(t *testing.T) {
	_, err := FormatList([]string{"A", "B"}, FormatListOptions{Type: "invalid"})
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "type must be")
}
