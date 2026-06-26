package names

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestIsValidName(t *testing.T) {
	tests := []struct {
		name    string
		input   string
		opts    *IsValidNameOptions
		want    NameValidationResult
		wantErr bool
	}{
		{
			name:  "normal full name",
			input: "Ada Lovelace",
			want:  NameValidationResult{IsValid: true},
		},
		{
			name:  "unicode letters",
			input: "निखिल",
			want:  NameValidationResult{IsValid: true},
		},
		{
			name:  "accented latin letters",
			input: "José Álvarez",
			want:  NameValidationResult{IsValid: true},
		},
		{
			name:  "surrounding whitespace is trimmed",
			input: "  Grace Hopper  ",
			want:  NameValidationResult{IsValid: true},
		},
		{
			name:  "blocklisted placeholder",
			input: "test",
			want:  NameValidationResult{IsValid: false, Reason: "blocklisted"},
		},
		{
			name:  "shorter than validation rules minimum",
			input: "A",
			want:  NameValidationResult{IsValid: false, Reason: "too_short"},
		},
		{
			name:  "longer than validation rules maximum",
			input: strings.Repeat("A", 101),
			want:  NameValidationResult{IsValid: false, Reason: "too_long"},
		},
		{
			name:  "sequential characters",
			input: "pqrs",
			want:  NameValidationResult{IsValid: false, Reason: "sequential_chars"},
		},
		{
			name:  "sequential characters split by spaces",
			input: "a b c d",
			want:  NameValidationResult{IsValid: false, Reason: "sequential_chars"},
		},
		{
			name:  "repeating characters",
			input: "Sss Sharma",
			want:  NameValidationResult{IsValid: false, Reason: "repeating_chars"},
		},
		{
			name:  "letters are not dominant",
			input: "12@#$ab",
			want:  NameValidationResult{IsValid: false, Reason: "non_alpha_dominant"},
		},
		{
			name:  "custom blocklist replaces defaults",
			input: "test",
			opts:  &IsValidNameOptions{Blocklist: []string{"blocked"}},
			want:  NameValidationResult{IsValid: true},
		},
		{
			name:  "custom blocklist value",
			input: "blocked",
			opts:  &IsValidNameOptions{Blocklist: []string{"blocked"}},
			want:  NameValidationResult{IsValid: false, Reason: "blocklisted"},
		},
		{
			name:  "custom blocklist extends defaults",
			input: "test",
			opts: &IsValidNameOptions{
				Blocklist:               []string{"blocked"},
				AllowBlocklistExtension: true,
			},
			want: NameValidationResult{IsValid: false, Reason: "blocklisted"},
		},
		{
			name:  "extended custom blocklist value",
			input: "blocked",
			opts: &IsValidNameOptions{
				Blocklist:               []string{"blocked"},
				AllowBlocklistExtension: true,
			},
			want: NameValidationResult{IsValid: false, Reason: "blocklisted"},
		},
		{
			name:  "custom sequential threshold",
			input: "wxy",
			opts:  &IsValidNameOptions{SequentialThreshold: 3},
			want:  NameValidationResult{IsValid: false, Reason: "sequential_chars"},
		},
		{
			name:  "custom sequential threshold can relax default",
			input: "mnop",
			opts:  &IsValidNameOptions{SequentialThreshold: 5},
			want:  NameValidationResult{IsValid: true},
		},
		{
			name:  "custom repeating threshold",
			input: "Annaa",
			opts:  &IsValidNameOptions{RepeatingThreshold: 2},
			want:  NameValidationResult{IsValid: false, Reason: "repeating_chars"},
		},
		{
			name:  "custom alpha dominance threshold",
			input: "a1 b2",
			opts:  &IsValidNameOptions{AlphaDominanceThreshold: 0.75},
			want:  NameValidationResult{IsValid: false, Reason: "non_alpha_dominant"},
		},
		{
			name:    "empty string returns error",
			input:   "",
			wantErr: true,
		},
		{
			name:    "whitespace-only returns error",
			input:   "   ",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := IsValidName(tt.input, tt.opts)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}

			require.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}
