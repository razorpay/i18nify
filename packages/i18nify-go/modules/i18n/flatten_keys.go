package i18n

import (
	"fmt"
)

const defaultDelimiter = "."

// FlattenOptions configures FlattenKeys behaviour.
type FlattenOptions struct {
	// Delimiter separates nested key segments. Defaults to ".".
	Delimiter string
}

// FlattenKeys recursively flattens a nested map[string]any into a single-level
// map using delimiter-joined keys. Arrays are treated as leaf values and are
// not recursed into.
func FlattenKeys(obj map[string]any, opts *FlattenOptions) (map[string]any, error) {
	if obj == nil {
		return nil, fmt.Errorf("i18n: FlattenKeys: input must be a non-nil map")
	}
	delimiter := defaultDelimiter
	if opts != nil && opts.Delimiter != "" {
		delimiter = opts.Delimiter
	}
	result := make(map[string]any)
	flattenRecursive(obj, delimiter, "", result)
	return result, nil
}

func flattenRecursive(obj map[string]any, delimiter, prefix string, result map[string]any) {
	for k, v := range obj {
		fullKey := k
		if prefix != "" {
			fullKey = prefix + delimiter + k
		}
		if nested, ok := v.(map[string]any); ok {
			flattenRecursive(nested, delimiter, fullKey, result)
		} else {
			result[fullKey] = v
		}
	}
}
