package name_validation

import (
	"fmt"
	"strings"
	"unicode"
)

const (
	defaultSequentialThreshold    = 4
	defaultRepeatingThreshold     = 3
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
	// Reason is set when IsValid is false: "blocklisted", "sequential_chars",
	// "repeating_chars", or "non_alpha_dominant".
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

// IsValidName validates a human name against common garbage patterns.
func IsValidName(name string, opts *IsValidNameOptions) (NameValidationResult, error) {
	if name == "" {
		return NameValidationResult{}, fmt.Errorf("name_validation: IsValidName: name must be a non-empty string")
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

	normalized := strings.ToLower(strings.TrimSpace(name))

	for _, entry := range blocklist {
		if normalized == entry {
			return NameValidationResult{IsValid: false, Reason: "blocklisted"}, nil
		}
	}

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

// hasSequentialChars returns true if str contains a run of threshold or more
// runes whose code points increment or decrement by exactly 1 each step.
func hasSequentialChars(str string, threshold int) bool {
	runes := []rune(str)
	if len(runes) < threshold {
		return false
	}
	ascRun, descRun := 1, 1
	for i := 1; i < len(runes); i++ {
		diff := int(runes[i]) - int(runes[i-1])
		if diff == 1 {
			ascRun++
			if ascRun >= threshold {
				return true
			}
		} else {
			ascRun = 1
		}
		if diff == -1 {
			descRun++
			if descRun >= threshold {
				return true
			}
		} else {
			descRun = 1
		}
	}
	return false
}

// hasRepeatingChars returns true if str contains a run of threshold or more
// identical runes.
func hasRepeatingChars(str string, threshold int) bool {
	runes := []rune(str)
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

// isAlphaDominant returns true when the fraction of Unicode letter characters
// among all non-whitespace runes in str is at least threshold.
func isAlphaDominant(str string, threshold float64) bool {
	var nonWs, alphaCount int
	for _, r := range str {
		if unicode.IsSpace(r) {
			continue
		}
		nonWs++
		if unicode.IsLetter(r) {
			alphaCount++
		}
	}
	if nonWs == 0 {
		return false
	}
	return float64(alphaCount)/float64(nonWs) >= threshold
}
