// Package names provides functions to validate personal names and retrieve
// locale-specific honorific titles.
package names

import (
	"fmt"
	"strings"
	"unicode"

	dataSource "github.com/razorpay/i18nify/i18nify-data/go/names"
)

// HonorificTitle mirrors the data layer type for consumer use.
type HonorificTitle struct {
	Code        string
	Title       string
	Gender      string
	Description string
}

var cachedData *dataSource.NamesData

func init() {
	d, err := dataSource.GetNamesData()
	if err != nil {
		panic(fmt.Sprintf("failed to load names data: %v", err))
	}
	cachedData = d
}

// IsValidName reports whether name is a well-formed personal name.
//
// A valid name must:
//   - Contain at least MinLength non-whitespace characters (default 2).
//   - Contain at most MaxLength characters (default 100).
//   - Consist only of Unicode letters, spaces, hyphens (-), apostrophes ('),
//     and periods (.).
//   - Contain at least one Unicode letter.
func IsValidName(name string) bool {
	trimmed := strings.TrimSpace(name)
	rules := cachedData.NamesInformation.ValidationRules

	if len([]rune(trimmed)) < rules.MinLength {
		return false
	}
	if len([]rune(trimmed)) > rules.MaxLength {
		return false
	}

	hasLetter := false
	for _, r := range trimmed {
		switch {
		case unicode.IsLetter(r):
			hasLetter = true
		case unicode.IsMark(r):
			// Unicode combining marks (e.g., Devanagari vowel signs, Arabic
			// diacritics) are integral parts of properly spelled names in many scripts.
		case r == ' ', r == '-', r == '\'', r == '.':
			// allowed separators
		default:
			return false
		}
	}
	return hasLetter
}

// GetHonorificTitles returns the list of honorific titles for the given
// ISO 3166-1 alpha-2 country code (e.g., "US", "IN", "DE").
//
// The country code is matched case-insensitively. The function resolves the
// country's primary language internally via country_to_languages data and
// returns the corresponding honorific titles.
func GetHonorificTitles(countryCode string) ([]HonorificTitle, error) {
	countryCode = strings.TrimSpace(countryCode)
	if countryCode == "" {
		return nil, fmt.Errorf("country code must not be empty")
	}

	cc := strings.ToUpper(countryCode)

	languages, ok := cachedData.NamesInformation.CountryToLanguages[cc]
	if !ok || len(languages) == 0 {
		return nil, fmt.Errorf("no honorific titles found for country code: %q", countryCode)
	}

	raw, ok := cachedData.NamesInformation.HonorificTitles[languages[0]]
	if !ok {
		return nil, fmt.Errorf("no honorific titles found for country code: %q", countryCode)
	}

	out := make([]HonorificTitle, len(raw))
	for i, h := range raw {
		out[i] = HonorificTitle{
			Code:        h.Code,
			Title:       h.Title,
			Gender:      h.Gender,
			Description: h.Description,
		}
	}
	return out, nil
}
