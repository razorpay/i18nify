package geo

import (
	"fmt"
	"strings"
)

// FormatAddress formats address components using a caller-supplied template string.
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
