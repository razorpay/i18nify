// Hand-written Go structs for names data.
// These mirror the data.json schema for the names module.

package names

// NamesData is the root structure loaded from data/data.json.
type NamesData struct {
	NamesInformation NamesInformation `json:"names_information"`
}

// NamesInformation holds honorific titles and validation rules.
type NamesInformation struct {
	HonorificTitles map[string][]HonorificTitle `json:"honorific_titles"`
	ValidationRules ValidationRules             `json:"validation_rules"`
}

// HonorificTitle represents a single honorific title entry.
type HonorificTitle struct {
	Code        string `json:"code"`
	Title       string `json:"title"`
	Gender      string `json:"gender"`
	Description string `json:"description"`
}

// ValidationRules defines the constraints for name validation.
type ValidationRules struct {
	MinLength int `json:"min_length"`
	MaxLength int `json:"max_length"`
}
