package geo

import (
	"fmt"
	"strings"
)

// FormatAddress formats the given address components using the provided
// template string.
//
// Placeholders of the form {field_name} are replaced with the corresponding
// value from components. Lines that are blank or whitespace-only after
// substitution are removed, so optional fields do not leave empty rows in the
// result.
//
// Unlike FormatAddressWithFormat, this function requires no country code lookup
// and no embedded data — the caller supplies the template directly. This makes
// it suitable for custom templates, pre-fetched templates, or any use case
// where a country code is not available.
//
// Example:
//
//	result, err := FormatAddress(
//	    "{name}\n{organization}\n{street_address}\n{city}, {state} {zip}",
//	    AddressComponents{Name: "John Doe", StreetAddress: "1 Main St",
//	        City: "Springfield", State: "IL", Zip: "62701"},
//	)
//	// → "John Doe\n1 Main St\nSpringfield, IL 62701"
func FormatAddress(template string, components AddressComponents) (string, error) {
	if strings.TrimSpace(template) == "" {
		return "", fmt.Errorf("template must be a non-empty string")
	}

	replacer := strings.NewReplacer(
		"{name}", components.Name,
		"{organization}", components.Organization,
		"{street_address}", components.StreetAddress,
		"{city}", components.City,
		"{state}", components.State,
		"{zip}", components.Zip,
		"{district}", components.District,
		"{sorting_code}", components.SortingCode,
	)
	substituted := replacer.Replace(template)

	rawLines := strings.Split(substituted, "\n")
	formatted := make([]string, 0, len(rawLines))
	for _, line := range rawLines {
		if trimmed := strings.TrimSpace(line); trimmed != "" {
			formatted = append(formatted, trimmed)
		}
	}

	return strings.Join(formatted, "\n"), nil
}
