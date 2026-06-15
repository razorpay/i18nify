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

func TestGetHonorificTitles_US(t *testing.T) {
	titles, err := GetHonorificTitles("US")
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

func TestGetHonorificTitles_IN(t *testing.T) {
	titles, err := GetHonorificTitles("IN")
	require.NoError(t, err)
	assert.NotEmpty(t, titles)

	codes := make(map[string]bool, len(titles))
	for _, tt := range titles {
		codes[tt.Code] = true
	}
	assert.True(t, codes["SHRI"])
	assert.True(t, codes["SMT"])
}

func TestGetHonorificTitles_SampleCountries(t *testing.T) {
	countries := []string{
		"US", "IN", "FR", "DE", "ES", "AE", "JP", "CN", "BR", "RU",
		"IT", "NL", "KR", "VN", "TR", "PL", "SE", "DK", "NO", "FI",
		"GR", "IL", "IR", "PK", "BD", "TH", "ID", "MY", "KE", "UA",
		"RO", "HU", "CZ", "SK", "BG", "RS", "HR", "AD",
	}
	for _, cc := range countries {
		t.Run(cc, func(t *testing.T) {
			titles, err := GetHonorificTitles(cc)
			require.NoError(t, err)
			assert.NotEmpty(t, titles)
		})
	}
}

func TestGetHonorificTitles_CaseInsensitive(t *testing.T) {
	upper, err := GetHonorificTitles("US")
	require.NoError(t, err)
	lower, err := GetHonorificTitles("us")
	require.NoError(t, err)
	assert.Equal(t, upper, lower)
}

func TestGetHonorificTitles_EmptyCode(t *testing.T) {
	_, err := GetHonorificTitles("")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "empty")
}

func TestGetHonorificTitles_UnsupportedCode(t *testing.T) {
	_, err := GetHonorificTitles("ZZ")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "no honorific titles found")
}

func TestGetHonorificTitles_WhitespaceTrimmed(t *testing.T) {
	titles, err := GetHonorificTitles("  US  ")
	require.NoError(t, err)
	assert.NotEmpty(t, titles)
}

func TestGetHonorificTitles_GenderValues(t *testing.T) {
	validGenders := map[string]bool{"male": true, "female": true, "neutral": true}
	titles, err := GetHonorificTitles("US")
	require.NoError(t, err)
	for _, tt := range titles {
		assert.True(t, validGenders[tt.Gender],
			"title %q has unknown gender %q", tt.Code, tt.Gender)
	}
}
