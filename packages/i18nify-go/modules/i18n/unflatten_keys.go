package i18n

import (
	"fmt"
	"strings"
)

// UnflattenOptions configures UnflattenKeys behaviour.
type UnflattenOptions struct {
	// Delimiter separates key segments. Defaults to ".".
	Delimiter string
}

// UnflattenKeys rebuilds a nested map[string]any from a flat map with
// delimiter-joined keys produced by FlattenKeys.
func UnflattenKeys(obj map[string]any, opts *UnflattenOptions) (map[string]any, error) {
	if obj == nil {
		return nil, fmt.Errorf("i18n: UnflattenKeys: input must be a non-nil map")
	}
	delimiter := defaultDelimiter
	if opts != nil && opts.Delimiter != "" {
		delimiter = opts.Delimiter
	}
	result := make(map[string]any)
	for flatKey, value := range obj {
		parts := strings.Split(flatKey, delimiter)
		cursor := result
		for i := 0; i < len(parts)-1; i++ {
			part := parts[i]
			if existing, ok := cursor[part]; ok {
				if nested, ok := existing.(map[string]any); ok {
					cursor = nested
					continue
				}
			}
			nested := make(map[string]any)
			cursor[part] = nested
			cursor = nested
		}
		leafKey := parts[len(parts)-1]
		if existing, ok := cursor[leafKey]; ok {
			if _, isNested := existing.(map[string]any); isNested {
				continue
			}
		}
		cursor[leafKey] = value
	}
	return result, nil
}
