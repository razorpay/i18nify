// Package namevalidation provides heuristic name-quality checks:
// blocklist matching, sequential/repeating character detection, and
// alpha-dominance enforcement.
package namevalidation

import (
	"strings"
	"unicode"
)

// ValidationReason identifies why a name failed validation.
type ValidationReason string

const (
	ReasonBlocklisted       ValidationReason = "blocklisted"
	ReasonSequentialChars   ValidationReason = "sequential_chars"
	ReasonRepeatingChars    ValidationReason = "repeating_chars"
	ReasonNonAlphaDominant  ValidationReason = "non_alpha_dominant"
)

// ValidationResult is the return type of IsValidName.
type ValidationResult struct {
	IsValid bool
	// Reason is set only when IsValid is false.
	Reason ValidationReason
}

// Options tunes the validation thresholds and blocklist.
// Zero values fall back to the package defaults.
type Options struct {
	// Blocklist replaces the default blocklist.
	// Set AllowBlocklistExtension to append instead of replace.
	Blocklist []string
	// AllowBlocklistExtension merges Blocklist into the default list.
	AllowBlocklistExtension bool
	// SequentialThreshold is the minimum run of consecutive code-point
	// increments (ascending or descending) to reject. Default: 4.
	SequentialThreshold int
	// RepeatingThreshold is the minimum run of identical runes to reject.
	// Default: 3.
	RepeatingThreshold int
	// AlphaDominanceThreshold is the minimum fraction (0–1) of
	// non-whitespace characters that must be Unicode letters.
	// Names below this fraction are rejected. Default: 0.5.
	AlphaDominanceThreshold float64
}

const (
	defaultSequentialThreshold    = 4
	defaultRepeatingThreshold     = 3
	defaultAlphaDominanceThreshold = 0.5
)

// defaultBlocklist contains common placeholder, test, and garbage inputs.
var defaultBlocklist = []string{
	// test / placeholder inputs
	"test", "testing", "tester", "asdf", "asdfgh", "qwerty", "qwertyui",
	"qwer", "zxcv", "zxcvbn",
	// null-like values
	"null", "undefined", "none", "na", "n/a", "nil", "void",
	// role / system names
	"admin", "user", "noreply", "no-reply", "anonymous", "anon",
	"root", "guest", "system", "support", "contact",
	// empty label fillers
	"name", "fullname", "firstname", "lastname", "your name",
	"enter name", "enter your name", "placeholder", "sample",
	"example", "demo", "dummy", "fake",
	// numeric / sequential strings
	"abc", "abcd", "abcde", "xyz", "xyzabc",
	"aaa", "bbb", "ccc", "xxx", "yyy", "zzz",
	"123", "1234", "12345",
	"aaaa", "bbbb", "cccc",
	// miscellaneous garbage
	"password", "pass", "login", "default",
}

// IsValidName validates a personal name against heuristic quality rules.
// Checks are applied in priority order: blocklist → sequential chars →
// repeating chars → alpha dominance.
func IsValidName(name string, opts ...Options) ValidationResult {
	o := resolveOptions(opts)
	normalized := strings.ToLower(strings.TrimSpace(name))

	// 1. Blocklist
	for _, entry := range o.effectiveBlocklist {
		if normalized == entry {
			return ValidationResult{IsValid: false, Reason: ReasonBlocklisted}
		}
	}

	// 2. Sequential characters
	if hasSequentialChars(normalized, o.SequentialThreshold) {
		return ValidationResult{IsValid: false, Reason: ReasonSequentialChars}
	}

	// 3. Repeating characters
	if hasRepeatingChars(normalized, o.RepeatingThreshold) {
		return ValidationResult{IsValid: false, Reason: ReasonRepeatingChars}
	}

	// 4. Alpha dominance
	if !isAlphaDominant(normalized, o.AlphaDominanceThreshold) {
		return ValidationResult{IsValid: false, Reason: ReasonNonAlphaDominant}
	}

	return ValidationResult{IsValid: true}
}

// ── internal helpers ────────────────────────────────────────────────────────

type resolvedOptions struct {
	Options
	effectiveBlocklist []string
}

func resolveOptions(opts []Options) resolvedOptions {
	o := Options{
		SequentialThreshold:     defaultSequentialThreshold,
		RepeatingThreshold:      defaultRepeatingThreshold,
		AlphaDominanceThreshold: defaultAlphaDominanceThreshold,
	}
	if len(opts) > 0 {
		src := opts[0]
		if src.SequentialThreshold > 0 {
			o.SequentialThreshold = src.SequentialThreshold
		}
		if src.RepeatingThreshold > 0 {
			o.RepeatingThreshold = src.RepeatingThreshold
		}
		if src.AlphaDominanceThreshold > 0 {
			o.AlphaDominanceThreshold = src.AlphaDominanceThreshold
		}
		o.Blocklist = src.Blocklist
		o.AllowBlocklistExtension = src.AllowBlocklistExtension
	}

	var bl []string
	if o.Blocklist != nil {
		if o.AllowBlocklistExtension {
			bl = append(defaultBlocklist, o.Blocklist...)
		} else {
			bl = o.Blocklist
		}
	} else {
		bl = defaultBlocklist
	}

	return resolvedOptions{Options: o, effectiveBlocklist: bl}
}

// hasSequentialChars returns true when s contains a run of threshold or more
// runes whose code points increase or decrease by exactly 1 at each step.
func hasSequentialChars(s string, threshold int) bool {
	runes := []rune(s)
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

// hasRepeatingChars returns true when s contains a run of threshold or more
// identical runes.
func hasRepeatingChars(s string, threshold int) bool {
	runes := []rune(s)
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

// isAlphaDominant returns true when at least threshold fraction of the
// non-whitespace runes in s are Unicode letters.
func isAlphaDominant(s string, threshold float64) bool {
	var total, alpha int
	for _, r := range s {
		if unicode.IsSpace(r) {
			continue
		}
		total++
		if unicode.IsLetter(r) {
			alpha++
		}
	}
	if total == 0 {
		return false
	}
	return float64(alpha)/float64(total) >= threshold
}
