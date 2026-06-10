// Package i18n provides utilities for working with i18n message bundle JSON:
// flattening nested objects to dot-joined keys and unflattening them back.
package i18n

import (
	"fmt"
	"strings"
)

const defaultDelimiter = "."

// FlattenOptions tunes FlattenKeys behaviour.
type FlattenOptions struct {
	// Delimiter separates key segments in the flattened output. Default: ".".
	Delimiter string
}

func resolveDelimiter(opts []FlattenOptions) (string, error) {
	d := defaultDelimiter
	if len(opts) > 0 && opts[0].Delimiter != "" {
		d = opts[0].Delimiter
	}
	if d == "" {
		return "", fmt.Errorf("i18n: delimiter must not be empty")
	}
	return d, nil
}

// FlattenKeys converts a nested map[string]any to a flat map with delimiter-joined keys.
// Arrays ([]interface{}) and non-map values are treated as leaf values and not recursed into.
//
// Example:
//
//	FlattenKeys(map[string]any{"a": map[string]any{"b": "x"}})
//	→ map[string]any{"a.b": "x"}
func FlattenKeys(obj map[string]any, opts ...FlattenOptions) (map[string]any, error) {
	if obj == nil {
		return nil, fmt.Errorf("i18n: FlattenKeys: input map must not be nil")
	}
	delimiter, err := resolveDelimiter(opts)
	if err != nil {
		return nil, err
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

// UnflattenOptions tunes UnflattenKeys behaviour.
type UnflattenOptions struct {
	// Delimiter is the separator used in the flat keys. Default: ".".
	Delimiter string
}

// UnflattenKeys converts a flat map with delimiter-joined keys to a nested map[string]any.
// When a key collision occurs (a leaf is later expanded by a deeper key), the deeper key wins.
//
// Example:
//
//	UnflattenKeys(map[string]any{"a.b": "x"})
//	→ map[string]any{"a": map[string]any{"b": "x"}}
func UnflattenKeys(flat map[string]any, opts ...UnflattenOptions) (map[string]any, error) {
	if flat == nil {
		return nil, fmt.Errorf("i18n: UnflattenKeys: input map must not be nil")
	}
	d := defaultDelimiter
	if len(opts) > 0 && opts[0].Delimiter != "" {
		d = opts[0].Delimiter
	}
	if d == "" {
		return nil, fmt.Errorf("i18n: delimiter must not be empty")
	}

	result := make(map[string]any)
	for flatKey, val := range flat {
		parts := strings.Split(flatKey, d)
		cursor := result
		for _, part := range parts[:len(parts)-1] {
			existing, ok := cursor[part]
			if !ok {
				nested := make(map[string]any)
				cursor[part] = nested
				cursor = nested
			} else if nested, ok := existing.(map[string]any); ok {
				cursor = nested
			} else {
				// Overwrite non-map leaf — deeper key wins
				nested := make(map[string]any)
				cursor[part] = nested
				cursor = nested
			}
		}
		cursor[parts[len(parts)-1]] = val
	}
	return result, nil
}
