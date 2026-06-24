package names

import (
	"fmt"
	"strings"

	dataSource "github.com/razorpay/i18nify/i18nify-data/go/names"
	"google.golang.org/protobuf/types/known/structpb"
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

	info := data.GetNamesInformation()
	if info == nil {
		return nil, fmt.Errorf("names: GetHonorificTitles: names data is missing names_information")
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

func listValueStrings(list *structpb.ListValue) []string {
	if list == nil {
		return nil
	}

	values := list.GetValues()
	result := make([]string, 0, len(values))
	for _, value := range values {
		if text := value.GetStringValue(); text != "" {
			result = append(result, text)
		}
	}
	return result
}

func listValueHonorificTitles(list *structpb.ListValue) []HonorificTitle {
	if list == nil {
		return nil
	}

	values := list.GetValues()
	titles := make([]HonorificTitle, 0, len(values))
	for _, value := range values {
		fields := value.GetStructValue().GetFields()
		if fields == nil {
			continue
		}

		titles = append(titles, HonorificTitle{
			Code:        fields["code"].GetStringValue(),
			Title:       fields["title"].GetStringValue(),
			Gender:      fields["gender"].GetStringValue(),
			Description: fields["description"].GetStringValue(),
		})
	}
	return titles
}
