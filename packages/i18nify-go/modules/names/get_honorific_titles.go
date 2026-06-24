package names

import (
	"fmt"
	"strings"
)

// HonorificTitle represents a locale-specific honorific title entry.
type HonorificTitle struct {
	Code        string
	Title       string
	Gender      string
	Description string
}

// GetHonorificTitles returns honorific titles for the given ISO 3166-1 alpha-2
// country code.
//
// The country code is matched case-insensitively. The function resolves the
// country's primary language via names data and returns that language's titles.
func GetHonorificTitles(countryCode string) ([]HonorificTitle, error) {
	cc := strings.ToUpper(strings.TrimSpace(countryCode))
	if cc == "" {
		return nil, fmt.Errorf("names: GetHonorificTitles: countryCode must not be empty")
	}

	info, err := loadNamesInformation("GetHonorificTitles")
	if err != nil {
		return nil, err
	}

	languageList, ok := info.GetCountryToLanguages()[cc]
	languages := listValueStrings(languageList)
	if !ok || len(languages) == 0 {
		return nil, fmt.Errorf("names: GetHonorificTitles: no honorific titles found for country code: %q", cc)
	}

	rawTitles, ok := info.GetHonorificTitles()[languages[0]]
	if !ok {
		return nil, fmt.Errorf("names: GetHonorificTitles: no honorific titles found for country code: %q", cc)
	}

	titles := listValueHonorificTitles(rawTitles)
	if len(titles) == 0 {
		return nil, fmt.Errorf("names: GetHonorificTitles: no honorific titles found for country code: %q", cc)
	}

	return titles, nil
}
