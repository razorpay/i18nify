package names

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

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

func TestGetHonorificTitles_SampleLocales(t *testing.T) {
	locales := []string{
		"en", "hi", "fr", "de", "es", "ar", "ja", "zh", "pt", "ru",
		"it", "nl", "ko", "vi", "tr", "pl", "sv", "da", "no", "fi",
		"el", "he", "fa", "ur", "bn", "th", "id", "ms", "sw", "uk",
		"ro", "hu", "cs", "sk", "bg", "sr", "hr", "ca",
	}
	for _, locale := range locales {
		t.Run(locale, func(t *testing.T) {
			titles, err := GetHonorificTitles(locale)
			require.NoError(t, err)
			assert.NotEmpty(t, titles)
		})
	}
}

func TestGetHonorificTitles_BCPSubtagStripped(t *testing.T) {
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
