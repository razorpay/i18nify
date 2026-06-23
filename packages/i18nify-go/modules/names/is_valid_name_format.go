package names

import (
	"strings"
	"unicode"
)

const (
	minNameLength = 2
	maxNameLength = 100
)

// IsValidNameFormat reports whether name has a structurally valid personal name
// format. It mirrors the JS isValidNameFormat function exactly.
//
// A name has a valid format when it:
//   - Is at least 2 characters long (after trimming whitespace).
//   - Is at most 100 characters long.
//   - Contains only Unicode letters, combining marks (\p{M}), spaces, hyphens
//     (-), apostrophes ('), or periods (.).
//   - Contains at least one Unicode letter.
//
// This is a charset/structure check. For garbage-input detection (blocklists,
// sequential or repeating characters), use IsValidName.
func IsValidNameFormat(name string) bool {
	trimmed := strings.TrimSpace(name)

	runes := []rune(trimmed)
	if len(runes) < minNameLength || len(runes) > maxNameLength {
		return false
	}

	hasLetter := false
	for _, r := range runes {
		switch {
		case unicode.IsLetter(r):
			hasLetter = true
		case unicode.IsMark(r):
			// Combining marks (e.g., Devanagari vowel signs, Arabic diacritics)
			// are integral parts of correctly spelled names in many scripts.
		case r == ' ', r == '-', r == '\'', r == '.':
			// allowed punctuation/separators
		default:
			return false
		}
	}
	return hasLetter
}
