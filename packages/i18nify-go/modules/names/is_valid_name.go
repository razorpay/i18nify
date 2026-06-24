package names

import (
	"fmt"
	"strings"
)

// NameValidationResult is the return value of IsValidName.
type NameValidationResult struct {
	IsValid bool
	// Reason is set when IsValid is false: "too_short", "too_long",
	// "blocklisted", "sequential_chars", "repeating_chars", or
	// "non_alpha_dominant".
	Reason string
}

// IsValidNameOptions configures IsValidName behaviour.
type IsValidNameOptions struct {
	Blocklist               []string
	AllowBlocklistExtension bool
	SequentialThreshold     int
	RepeatingThreshold      int
	AlphaDominanceThreshold float64
}

// IsValidName validates a human name against common placeholder and garbage-input patterns.
func IsValidName(name string, opts *IsValidNameOptions) (NameValidationResult, error) {
	trimmed := strings.TrimSpace(name)
	if trimmed == "" {
		return NameValidationResult{}, fmt.Errorf("names: IsValidName: name must be a non-empty string")
	}

	rules, err := loadNameValidationRules("IsValidName")
	if err != nil {
		return NameValidationResult{}, err
	}

	nameLength := len([]rune(trimmed))
	if nameLength < int(rules.GetMinLength()) {
		return NameValidationResult{IsValid: false, Reason: "too_short"}, nil
	}
	if nameLength > int(rules.GetMaxLength()) {
		return NameValidationResult{IsValid: false, Reason: "too_long"}, nil
	}

	config := resolveNameValidationConfig(opts)
	if isBlocklisted(trimmed, config.blocklist) {
		return NameValidationResult{IsValid: false, Reason: "blocklisted"}, nil
	}

	normalized := strings.ToLower(trimmed)

	if hasSequentialChars(normalized, config.sequentialThreshold) {
		return NameValidationResult{IsValid: false, Reason: "sequential_chars"}, nil
	}

	if hasRepeatingChars(normalized, config.repeatingThreshold) {
		return NameValidationResult{IsValid: false, Reason: "repeating_chars"}, nil
	}

	if !isAlphaDominant(normalized, config.alphaDominanceThreshold) {
		return NameValidationResult{IsValid: false, Reason: "non_alpha_dominant"}, nil
	}

	return NameValidationResult{IsValid: true}, nil
}
