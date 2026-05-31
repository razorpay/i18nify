package names

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// ---- IsValidName ----

func TestIsValidName(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  bool
	}{
		// Valid names
		{"simple ASCII", "John", true},
		{"full name with space", "John Smith", true},
		{"hyphenated surname", "Mary-Jane Watson", true},
		{"apostrophe surname", "O'Brien", true},
		{"suffix with period", "Dr. Smith", true},
		{"unicode letters – Hindi", "रामलाल", true},
		{"unicode letters – Arabic", "محمد", true},
		{"unicode letters – Chinese", "李明", true},
		{"unicode letters – Japanese", "田中", true},
		{"exactly min length (2)", "Jo", true},
		{"100 char name", strings.Repeat("A", 100), true},
		{"name with leading/trailing spaces", "  Alice  ", true},

		// Invalid names
		{"empty string", "", false},
		{"single char", "A", false},
		{"only spaces", "   ", false},
		{"digits", "John2", false},
		{"only digits", "12345", false},
		{"special chars – @", "John@Doe", false},
		{"special chars – #", "John#", false},
		{"101 char name", strings.Repeat("A", 101), false},
		{"tab character", "John\tDoe", false},
		{"newline", "John\nDoe", false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.want, IsValidName(tt.input))
		})
	}
}

// ---- GetHonorificTitles ----

func TestGetHonorificTitles_English(t *testing.T) {
	titles, err := GetHonorificTitles("en")
	require.NoError(t, err)
	assert.NotEmpty(t, titles)

	codes := make(map[string]bool, len(titles))
	for _, tt := range titles {
		codes[tt.Code] = true
		assert.NotEmpty(t, tt.Code)
		assert.NotEmpty(t, tt.Title)
		assert.NotEmpty(t, tt.Gender)
	}
	assert.True(t, codes["MR"])
	assert.True(t, codes["MRS"])
	assert.True(t, codes["DR"])
	assert.True(t, codes["PROF"])
}

func TestGetHonorificTitles_Hindi(t *testing.T) {
	titles, err := GetHonorificTitles("hi")
	require.NoError(t, err)
	assert.NotEmpty(t, titles)

	codes := make(map[string]bool, len(titles))
	for _, tt := range titles {
		codes[tt.Code] = true
	}
	assert.True(t, codes["SHRI"])
	assert.True(t, codes["SMT"])
}

func TestGetHonorificTitles_AllSupportedLocales(t *testing.T) {
	locales := []string{"en", "hi", "fr", "de", "es", "ar", "ja", "zh", "pt", "ru"}
	for _, locale := range locales {
		t.Run(locale, func(t *testing.T) {
			titles, err := GetHonorificTitles(locale)
			require.NoError(t, err)
			assert.NotEmpty(t, titles)
		})
	}
}

func TestGetHonorificTitles_BCP47TagStripped(t *testing.T) {
	// "en-US" should resolve to the same data as "en"
	enUS, err := GetHonorificTitles("en-US")
	require.NoError(t, err)
	en, err := GetHonorificTitles("en")
	require.NoError(t, err)
	assert.Equal(t, en, enUS)
}

func TestGetHonorificTitles_CaseInsensitive(t *testing.T) {
	upper, err := GetHonorificTitles("EN")
	require.NoError(t, err)
	lower, err := GetHonorificTitles("en")
	require.NoError(t, err)
	assert.Equal(t, upper, lower)
}

func TestGetHonorificTitles_EmptyLocale(t *testing.T) {
	_, err := GetHonorificTitles("")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "empty")
}

func TestGetHonorificTitles_UnsupportedLocale(t *testing.T) {
	_, err := GetHonorificTitles("zz")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "no honorific titles found")
}

func TestGetHonorificTitles_WhitespaceTrimmed(t *testing.T) {
	titles, err := GetHonorificTitles("  en  ")
	require.NoError(t, err)
	assert.NotEmpty(t, titles)
}

func TestGetHonorificTitles_GenderValues(t *testing.T) {
	validGenders := map[string]bool{"male": true, "female": true, "neutral": true}
	titles, err := GetHonorificTitles("en")
	require.NoError(t, err)
	for _, tt := range titles {
		assert.True(t, validGenders[tt.Gender],
			"title %q has unknown gender %q", tt.Code, tt.Gender)
	}
}
