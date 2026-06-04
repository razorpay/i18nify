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

// langCodeToName maps a BCP 47 base language subtag to the full English name
// used as the key in honorific_titles within data.json.
var langCodeToName = map[string]string{
	"en": "english",
	"hi": "hindi",
	"fr": "french",
	"de": "german",
	"es": "spanish",
	"ar": "arabic",
	"ja": "japanese",
	"zh": "chinese",
	"pt": "portuguese",
	"ru": "russian",
	"it": "italian",
	"nl": "dutch",
	"ko": "korean",
	"vi": "vietnamese",
	"tr": "turkish",
	"pl": "polish",
	"sv": "swedish",
	"da": "danish",
	"no": "norwegian",
	"fi": "finnish",
	"el": "greek",
	"he": "hebrew",
	"fa": "persian",
	"ur": "urdu",
	"bn": "bengali",
	"th": "thai",
	"id": "indonesian",
	"ms": "malay",
	"sw": "swahili",
	"uk": "ukrainian",
	"ro": "romanian",
	"hu": "hungarian",
	"cs": "czech",
	"sk": "slovak",
	"bg": "bulgarian",
	"sr": "serbian",
	"hr": "croatian",
	"ca": "catalan",
}

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

// GetHonorificTitles returns the list of honorific titles for the given BCP 47
// base language tag (e.g., "en", "hi", "fr").
//
// The locale is matched case-insensitively against the base language subtag only
// (i.e., "en-US" → "en"). Returns an error for empty or unsupported locales.
func GetHonorificTitles(locale string) ([]HonorificTitle, error) {
	locale = strings.TrimSpace(locale)
	if locale == "" {
		return nil, fmt.Errorf("locale must not be empty")
	}

	base := strings.ToLower(strings.SplitN(locale, "-", 2)[0])

	key, known := langCodeToName[base]
	if !known {
		return nil, fmt.Errorf("no honorific titles found for locale: %q", locale)
	}

	raw, ok := cachedData.NamesInformation.HonorificTitles[key]
	if !ok {
		return nil, fmt.Errorf("no honorific titles found for locale: %q", locale)
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
