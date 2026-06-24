package names

import (
	"fmt"
	"strings"

	dataSource "github.com/razorpay/i18nify/i18nify-data/go/names"
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

	data, err := dataSource.GetNamesData()
	if err != nil {
		return nil, fmt.Errorf("names: GetHonorificTitles: failed to load names data: %w", err)
	}

	languages, ok := data.NamesInformation.CountryToLanguages[cc]
	if !ok || len(languages) == 0 {
		return nil, fmt.Errorf("names: GetHonorificTitles: no honorific titles found for country code: %q", cc)
	}

	rawTitles, ok := data.NamesInformation.HonorificTitles[languages[0]]
	if !ok {
		return nil, fmt.Errorf("names: GetHonorificTitles: no honorific titles found for country code: %q", cc)
	}

	titles := make([]HonorificTitle, len(rawTitles))
	for i, title := range rawTitles {
		titles[i] = HonorificTitle{
			Code:        title.Code,
			Title:       title.Title,
			Gender:      title.Gender,
			Description: title.Description,
		}
	}

	return titles, nil
}
