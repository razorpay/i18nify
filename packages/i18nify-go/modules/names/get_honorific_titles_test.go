package names

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGetHonorificTitlesByLocale_English(t *testing.T) {
	titles, err := GetHonorificTitlesByLocale("en")
	require.NoError(t, err)
	assert.NotEmpty(t, titles)

	codes := make(map[string]bool, len(titles))
	for _, tt := range titles {
		codes[tt.Code] = true
	}
	assert.True(t, codes["MR"])
	assert.True(t, codes["MRS"])
	assert.True(t, codes["DR"])
}

func TestGetHonorificTitlesByLocale_Hindi(t *testing.T) {
	titles, err := GetHonorificTitlesByLocale("hi")
	require.NoError(t, err)
	assert.NotEmpty(t, titles)

	codes := make(map[string]bool, len(titles))
	for _, tt := range titles {
		codes[tt.Code] = true
	}
	assert.True(t, codes["SHRI"])
	assert.True(t, codes["SMT"])
}

func TestGetHonorificTitlesByLocale_AllSupportedLocales(t *testing.T) {
	locales := []string{"en", "hi", "fr", "de", "es", "ar", "ja", "zh", "pt", "ru"}
	for _, locale := range locales {
		t.Run(locale, func(t *testing.T) {
			titles, err := GetHonorificTitlesByLocale(locale)
			require.NoError(t, err)
			assert.NotEmpty(t, titles)
		})
	}
}

func TestGetHonorificTitlesByLocale_CaseInsensitive(t *testing.T) {
	lower, err := GetHonorificTitlesByLocale("en")
	require.NoError(t, err)
	upper, err := GetHonorificTitlesByLocale("EN")
	require.NoError(t, err)
	assert.Equal(t, lower, upper)
}

func TestGetHonorificTitlesByLocale_BCPRegionSubtag(t *testing.T) {
	enUS, err := GetHonorificTitlesByLocale("en-US")
	require.NoError(t, err)
	en, err := GetHonorificTitlesByLocale("en")
	require.NoError(t, err)
	assert.Equal(t, en, enUS)
}

func TestGetHonorificTitlesByLocale_WhitespaceTrimmed(t *testing.T) {
	titles, err := GetHonorificTitlesByLocale("  en  ")
	require.NoError(t, err)
	assert.NotEmpty(t, titles)
}

func TestGetHonorificTitlesByLocale_TitleFields(t *testing.T) {
	validGenders := map[string]bool{"male": true, "female": true, "neutral": true}
	titles, err := GetHonorificTitlesByLocale("en")
	require.NoError(t, err)
	for _, tt := range titles {
		assert.NotEmpty(t, tt.Code)
		assert.NotEmpty(t, tt.Title)
		assert.True(t, validGenders[tt.Gender],
			"title %q has unknown gender %q", tt.Code, tt.Gender)
	}
}

func TestGetHonorificTitlesByLocale_EmptyLocale(t *testing.T) {
	_, err := GetHonorificTitlesByLocale("")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "empty")
}

func TestGetHonorificTitlesByLocale_WhitespaceOnlyLocale(t *testing.T) {
	_, err := GetHonorificTitlesByLocale("   ")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "empty")
}

func TestGetHonorificTitlesByLocale_UnsupportedLocale(t *testing.T) {
	_, err := GetHonorificTitlesByLocale("zz")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "no honorific titles found")
}

func TestGetHonorificTitlesByLocale_UnsupportedLocalePreservesOriginal(t *testing.T) {
	_, err := GetHonorificTitlesByLocale("xx-YY")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "xx-YY")
}
