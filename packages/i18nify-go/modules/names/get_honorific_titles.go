package names

import (
	"fmt"
	"strings"
)

// langCodeToName maps a BCP 47 base language subtag to the JSON key used in names data.
// This mirrors the LANG_CODE_TO_NAME map in getHonorificTitles.ts.
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
}

// GetHonorificTitlesByLocale returns honorific titles for the given BCP 47 base language tag.
//
// The locale is matched case-insensitively. If a full BCP 47 tag is supplied
// (e.g., "en-US"), only the base language subtag ("en") is used for lookup.
//
// Returns an error when locale is empty or unsupported.
func GetHonorificTitlesByLocale(locale string) ([]HonorificTitle, error) {
	trimmed := strings.TrimSpace(locale)
	if trimmed == "" {
		return nil, fmt.Errorf("locale must not be empty")
	}

	base := strings.ToLower(strings.SplitN(trimmed, "-", 2)[0])

	langName, ok := langCodeToName[base]
	if !ok {
		return nil, fmt.Errorf("no honorific titles found for locale: %q", trimmed)
	}

	raw, ok := cachedData.NamesInformation.HonorificTitles[langName]
	if !ok {
		return nil, fmt.Errorf("no honorific titles found for locale: %q", trimmed)
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
