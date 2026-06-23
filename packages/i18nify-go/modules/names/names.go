// Package names provides functions to validate personal names and retrieve
// locale-specific honorific titles.
package names

import (
	"fmt"
	"strings"

	dataSource "github.com/razorpay/i18nify/i18nify-data/go/names"
)

// HonorificTitle mirrors the data layer type for consumer use.
type HonorificTitle struct {
	Code        string
	Title       string
	Gender      string
	Description string
}

// langCodeToName maps a BCP 47 base language subtag to the full English name
// used as the key in honorific_titles data. Mirrors the JS LANG_CODE_TO_NAME
// map and extended to cover all 38 languages present in the dataset.
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

var cachedData *dataSource.NamesData

func init() {
	d, err := dataSource.GetNamesData()
	if err != nil {
		panic(fmt.Sprintf("failed to load names data: %v", err))
	}
	cachedData = d
}

// GetHonorificTitles returns the list of honorific titles for the given
// BCP 47 locale tag (e.g., "en", "hi", "en-US").
//
// The locale is matched case-insensitively. If a full BCP 47 tag is supplied
// (e.g., "en-US"), only the base language subtag ("en") is used for lookup.
// This mirrors the JS getHonorificTitles(locale) signature exactly.
func GetHonorificTitles(locale string) ([]HonorificTitle, error) {
	locale = strings.TrimSpace(locale)
	if locale == "" {
		return nil, fmt.Errorf("locale must not be empty")
	}

	// Extract BCP 47 base language subtag (e.g. "en-US" → "en").
	base := strings.ToLower(strings.SplitN(locale, "-", 2)[0])

	langName, ok := langCodeToName[base]
	if !ok {
		return nil, fmt.Errorf("no honorific titles found for locale: %q", locale)
	}

	raw, ok := cachedData.NamesInformation.HonorificTitles[langName]
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
