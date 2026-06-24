package names

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGetHonorificTitles(t *testing.T) {
	tests := []struct {
		name       string
		country    string
		wantCode   string
		wantTitle  string
		wantGender string
		wantErr    bool
	}{
		{
			name:       "US returns English titles",
			country:    "US",
			wantCode:   "MR",
			wantTitle:  "Mr.",
			wantGender: "male",
		},
		{
			name:       "IN returns Hindi titles",
			country:    "IN",
			wantCode:   "SHRI",
			wantTitle:  "Shri",
			wantGender: "male",
		},
		{
			name:       "country code is trimmed and case-insensitive",
			country:    " us ",
			wantCode:   "MR",
			wantTitle:  "Mr.",
			wantGender: "male",
		},
		{
			name:    "empty country code returns error",
			country: "",
			wantErr: true,
		},
		{
			name:    "unsupported country code returns error",
			country: "ZZ",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			titles, err := GetHonorificTitles(tt.country)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}

			require.NoError(t, err)
			require.NotEmpty(t, titles)
			assert.Equal(t, tt.wantCode, titles[0].Code)
			assert.Equal(t, tt.wantTitle, titles[0].Title)
			assert.Equal(t, tt.wantGender, titles[0].Gender)
			assert.NotEmpty(t, titles[0].Description)
		})
	}
}

func TestGetHonorificTitlesReturnsCopy(t *testing.T) {
	titles, err := GetHonorificTitles("US")
	require.NoError(t, err)
	require.NotEmpty(t, titles)

	titles[0].Title = "Changed"

	freshTitles, err := GetHonorificTitles("US")
	require.NoError(t, err)
	require.NotEmpty(t, freshTitles)
	assert.NotEqual(t, "Changed", freshTitles[0].Title)
}
