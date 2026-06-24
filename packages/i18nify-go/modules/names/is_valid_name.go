package names

import (
	"fmt"
	"strings"
	"unicode"

	dataSource "github.com/razorpay/i18nify/i18nify-data/go/names"
)

const (
	defaultSequentialThreshold     = 4
	defaultRepeatingThreshold      = 3
	defaultAlphaDominanceThreshold = 0.5
)

// defaultBlocklist contains common placeholder, test, and garbage name values.
var defaultBlocklist = []string{
	"test", "testing", "tester", "asdf", "asdfgh", "qwerty", "qwertyui", "qwer",
	"zxcv", "zxcvbn", "null", "undefined", "none", "na", "n/a", "nil", "void",
	"admin", "user", "noreply", "no-reply", "anonymous", "anon", "root", "guest",
	"system", "support", "contact", "name", "fullname", "firstname", "lastname",
	"your name", "enter name", "enter your name", "placeholder", "sample",
	"example", "demo", "dummy", "fake", "abc", "abcd", "abcde", "xyz", "xyzabc",
	"aaa", "bbb", "ccc", "xxx", "yyy", "zzz", "123", "1234", "12345",
	"aaaa", "bbbb", "cccc", "password", "pass", "login", "default",
}

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

	data, err := dataSource.GetNamesData()
	if err != nil {
		return NameValidationResult{}, fmt.Errorf("names: IsValidName: failed to load names data: %w", err)
	}

	rules := data.NamesInformation.ValidationRules
	nameLength := len([]rune(trimmed))
	if nameLength < rules.MinLength {
		return NameValidationResult{IsValid: false, Reason: "too_short"}, nil
	}
	if nameLength > rules.MaxLength {
		return NameValidationResult{IsValid: false, Reason: "too_long"}, nil
	}

	seqThreshold := defaultSequentialThreshold
	repThreshold := defaultRepeatingThreshold
	alphaThreshold := defaultAlphaDominanceThreshold
	blocklist := defaultBlocklist

	if opts != nil {
		if opts.SequentialThreshold > 0 {
			seqThreshold = opts.SequentialThreshold
		}
		if opts.RepeatingThreshold > 0 {
			repThreshold = opts.RepeatingThreshold
		}
		if opts.AlphaDominanceThreshold > 0 {
			alphaThreshold = opts.AlphaDominanceThreshold
		}
		if opts.Blocklist != nil {
			if opts.AllowBlocklistExtension {
				blocklist = append(defaultBlocklist, opts.Blocklist...)
			} else {
				blocklist = opts.Blocklist
			}
		}
	}

	for _, entry := range blocklist {
		if strings.EqualFold(trimmed, entry) {
			return NameValidationResult{IsValid: false, Reason: "blocklisted"}, nil
		}
	}

	normalized := strings.ToLower(trimmed)

	if hasSequentialChars(normalized, seqThreshold) {
		return NameValidationResult{IsValid: false, Reason: "sequential_chars"}, nil
	}

	if hasRepeatingChars(normalized, repThreshold) {
		return NameValidationResult{IsValid: false, Reason: "repeating_chars"}, nil
	}

	if !isAlphaDominant(normalized, alphaThreshold) {
		return NameValidationResult{IsValid: false, Reason: "non_alpha_dominant"}, nil
	}

	return NameValidationResult{IsValid: true}, nil
}

func hasSequentialChars(value string, threshold int) bool {
	runes := make([]rune, 0, len([]rune(value)))
	for _, r := range value {
		if unicode.IsSpace(r) {
			continue
		}
		runes = append(runes, r)
	}

	if len(runes) < threshold {
		return false
	}

	ascendingRun := 1
	descendingRun := 1

	for i := 1; i < len(runes); i++ {
		diff := int(runes[i]) - int(runes[i-1])
		if diff == 1 {
			ascendingRun++
			if ascendingRun >= threshold {
				return true
			}
		} else {
			ascendingRun = 1
		}

		if diff == -1 {
			descendingRun++
			if descendingRun >= threshold {
				return true
			}
		} else {
			descendingRun = 1
		}
	}

	return false
}

func hasRepeatingChars(value string, threshold int) bool {
	runes := []rune(value)
	if len(runes) < threshold {
		return false
	}

	run := 1

	for i := 1; i < len(runes); i++ {
		if runes[i] == runes[i-1] {
			run++
			if run >= threshold {
				return true
			}
		} else {
			run = 1
		}
	}

	return false
}

func isAlphaDominant(value string, threshold float64) bool {
	nonWhitespaceCount := 0
	letterCount := 0

	for _, r := range value {
		if unicode.IsSpace(r) {
			continue
		}

		nonWhitespaceCount++
		if unicode.IsLetter(r) {
			letterCount++
		}
	}

	if nonWhitespaceCount == 0 {
		return false
	}

	return float64(letterCount)/float64(nonWhitespaceCount) >= threshold
}
