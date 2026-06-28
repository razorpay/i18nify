package names

import (
	"fmt"
	"sort"
	"strings"

	metadataSource "github.com/razorpay/i18nify/i18nify-data/go/country/metadata"
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
// The country code is matched case-insensitively. Titles are sourced from
// country metadata locales.
func GetHonorificTitles(countryCode string) ([]HonorificTitle, error) {
	cc := strings.ToUpper(strings.TrimSpace(countryCode))
	if cc == "" {
		return nil, fmt.Errorf("names: GetHonorificTitles: countryCode must not be empty")
	}

	data, err := metadataSource.GetCountryMetadataData()
	if err != nil {
		return nil, fmt.Errorf("names: GetHonorificTitles: failed to load country metadata: %w", err)
	}

	country, ok := data.GetMetadataInformation()[cc]
	if !ok || country == nil {
		return nil, fmt.Errorf("names: GetHonorificTitles: no honorific titles found for country code: %q", cc)
	}

	titles := honorificTitlesFromCountry(country)
	if len(titles) == 0 {
		return nil, fmt.Errorf("names: GetHonorificTitles: no honorific titles found for country code: %q", cc)
	}

	return titles, nil
}

func honorificTitlesFromCountry(country *metadataSource.CountryMetadata) []HonorificTitle {
	locales := country.GetLocales()
	if len(locales) == 0 {
		return nil
	}

	if defaultLocale := country.GetDefaultLocale(); defaultLocale != "" {
		if titles := convertHonorificTitles(locales[defaultLocale].GetHonorificTitles()); len(titles) > 0 {
			return titles
		}
	}

	keys := make([]string, 0, len(locales))
	for key := range locales {
		keys = append(keys, key)
	}
	sort.Strings(keys)

	for _, key := range keys {
		if titles := convertHonorificTitles(locales[key].GetHonorificTitles()); len(titles) > 0 {
			return titles
		}
	}

	return nil
}

func convertHonorificTitles(src []*metadataSource.HonorificTitle) []HonorificTitle {
	if len(src) == 0 {
		return nil
	}

	titles := make([]HonorificTitle, 0, len(src))
	for _, title := range src {
		if title == nil {
			continue
		}
		titles = append(titles, HonorificTitle{
			Code:        title.GetCode(),
			Title:       title.GetTitle(),
			Gender:      title.GetGender(),
			Description: title.GetDescription(),
		})
	}

	return titles
}
