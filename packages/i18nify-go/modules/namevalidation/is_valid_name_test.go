package namevalidation

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestIsValidName_Valid(t *testing.T) {
	valid := []string{"John", "Sarah Connor", "María", "O'Brien", "Jean-Pierre", "Søren", "김철수"}
	for _, name := range valid {
		result := IsValidName(name)
		assert.True(t, result.IsValid, "expected valid: %q", name)
	}
}

func TestIsValidName_Blocklist(t *testing.T) {
	blocked := []string{"test", "asdf", "qwerty", "admin", "null", "undefined", "none"}
	for _, name := range blocked {
		result := IsValidName(name)
		assert.False(t, result.IsValid, "expected blocked: %q", name)
		assert.Equal(t, ReasonBlocklisted, result.Reason, "name: %q", name)
	}
}

func TestIsValidName_Blocklist_CaseInsensitive(t *testing.T) {
	assert.Equal(t, ReasonBlocklisted, IsValidName("TEST").Reason)
	assert.Equal(t, ReasonBlocklisted, IsValidName("Admin").Reason)
}

func TestIsValidName_CustomBlocklist_Replaces(t *testing.T) {
	// "test" is not in the custom list, so blocklist check passes
	result := IsValidName("test", Options{Blocklist: []string{"batman"}})
	assert.NotEqual(t, ReasonBlocklisted, result.Reason)
}

func TestIsValidName_CustomBlocklist_Extends(t *testing.T) {
	result := IsValidName("batman", Options{
		Blocklist:               []string{"batman"},
		AllowBlocklistExtension: true,
	})
	assert.False(t, result.IsValid)
	assert.Equal(t, ReasonBlocklisted, result.Reason)

	// Default entries still blocked
	result2 := IsValidName("test", Options{
		Blocklist:               []string{"batman"},
		AllowBlocklistExtension: true,
	})
	assert.Equal(t, ReasonBlocklisted, result2.Reason)
}

func TestIsValidName_SequentialChars(t *testing.T) {
	// Use strings not in the default blocklist so sequential is the first trigger.
	sequential := []string{"efgh", "5678", "hgfe", "8765", "mnop", "opqr"}
	for _, name := range sequential {
		result := IsValidName(name)
		assert.False(t, result.IsValid, "expected rejected: %q", name)
		assert.Equal(t, ReasonSequentialChars, result.Reason, "name: %q", name)
	}
}

func TestIsValidName_SequentialChars_CustomThreshold(t *testing.T) {
	// "klm" has 3 sequential chars — passes default threshold of 4
	assert.NotEqual(t, ReasonSequentialChars, IsValidName("klm").Reason)

	// but fails with threshold=3
	result := IsValidName("klm", Options{SequentialThreshold: 3})
	assert.False(t, result.IsValid)
	assert.Equal(t, ReasonSequentialChars, result.Reason)
}

func TestIsValidName_RepeatingChars(t *testing.T) {
	repeating := []string{"aaab", "bbbohn", "joh111n"}
	for _, name := range repeating {
		result := IsValidName(name)
		assert.False(t, result.IsValid, "expected rejected: %q", name)
		assert.Equal(t, ReasonRepeatingChars, result.Reason, "name: %q", name)
	}
}

func TestIsValidName_RepeatingChars_CustomThreshold(t *testing.T) {
	// "Aabbey" has 2 repeating — passes default threshold of 3
	assert.NotEqual(t, ReasonRepeatingChars, IsValidName("Aabbey").Reason)

	// fails with threshold=2
	result := IsValidName("Aabbey", Options{RepeatingThreshold: 2})
	assert.False(t, result.IsValid)
	assert.Equal(t, ReasonRepeatingChars, result.Reason)
}

func TestIsValidName_NonAlphaDominant(t *testing.T) {
	// These strings have <50% alpha, are not in the blocklist,
	// and contain no 4-char sequential or 3-char repeating run.
	// "@@##$$" → 0/6 alpha = 0%
	// "1j23"   → 1/4 alpha = 25%  (2→3 is only a 2-char sequence)
	// "j147"   → 1/4 alpha = 25%  (1→4→7: diffs 3,3 — not sequential by 1)
	nonAlpha := []string{"@@##$$", "1j23", "j147"}
	for _, name := range nonAlpha {
		result := IsValidName(name)
		assert.False(t, result.IsValid, "expected rejected: %q", name)
		assert.Equal(t, ReasonNonAlphaDominant, result.Reason, "name: %q", name)
	}
}

func TestIsValidName_AlphaDominance_IgnoresWhitespace(t *testing.T) {
	// "John Doe" → 7/7 non-ws alpha = 100% — must pass
	assert.True(t, IsValidName("John Doe").IsValid)
}

func TestIsValidName_AlphaDominance_CustomThreshold(t *testing.T) {
	// "Jo2n" → 3/4 = 75% alpha — passes 50% default but fails 80%
	result := IsValidName("Jo2n", Options{AlphaDominanceThreshold: 0.8})
	assert.False(t, result.IsValid)
	assert.Equal(t, ReasonNonAlphaDominant, result.Reason)
}

func TestIsValidName_Priority_BlocklistBeforeSequential(t *testing.T) {
	// "abcd" is in default blocklist AND sequential — blocklist wins
	assert.Equal(t, ReasonBlocklisted, IsValidName("abcd").Reason)
}

func TestIsValidName_Unicode(t *testing.T) {
	// Unicode letters must count as alpha
	assert.True(t, IsValidName("García").IsValid)
	assert.True(t, IsValidName("Müller").IsValid)
}
