package name_validation

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestIsValidName(t *testing.T) {
	tests := []struct {
		name       string
		input      string
		opts       *IsValidNameOptions
		wantValid  bool
		wantReason string
		wantErr    bool
	}{
		// ── valid names ────────────────────────────────────────────────────
		{name: "simple full name", input: "John Doe", wantValid: true},
		{name: "two-word name", input: "Alice Smith", wantValid: true},
		{name: "name with apostrophe", input: "O'Brien", wantValid: true},
		{name: "accented name", input: "José", wantValid: true},
		{name: "surrounding whitespace is trimmed", input: "  John Doe  ", wantValid: true},

		// ── blocklisted (checked first) ────────────────────────────────────
		{name: "blocklisted test", input: "test", wantValid: false, wantReason: "blocklisted"},
		{name: "blocklisted admin", input: "admin", wantValid: false, wantReason: "blocklisted"},
		{name: "blocklisted qwerty", input: "qwerty", wantValid: false, wantReason: "blocklisted"},
		{name: "blocklist match is case-insensitive", input: "TEST", wantValid: false, wantReason: "blocklisted"},

		// ── sequential characters (default threshold 4) ────────────────────
		{name: "ascending run of 5", input: "defgh", wantValid: false, wantReason: "sequential_chars"},
		{name: "descending digit run", input: "4321", wantValid: false, wantReason: "sequential_chars"},

		// ── repeating characters (default threshold 3) ─────────────────────
		{name: "four repeated letters", input: "Hellllo", wantValid: false, wantReason: "repeating_chars"},
		{name: "three repeated leading letters", input: "Aaarav", wantValid: false, wantReason: "repeating_chars"},

		// ── non-alpha dominant (default threshold 0.5) ─────────────────────
		{name: "mostly symbols", input: "a@#b$%", wantValid: false, wantReason: "non_alpha_dominant"},

		// ── custom blocklist extension ─────────────────────────────────────
		{
			name:       "custom blocklist extension flags a name",
			input:      "John",
			opts:       &IsValidNameOptions{Blocklist: []string{"john"}, AllowBlocklistExtension: true},
			wantValid:  false,
			wantReason: "blocklisted",
		},
		{
			name:      "replacing blocklist clears default entries",
			input:     "test", // no longer blocklisted once default list is replaced
			opts:      &IsValidNameOptions{Blocklist: []string{"foobar"}},
			wantValid: true,
		},

		// ── custom thresholds ──────────────────────────────────────────────
		{
			name:      "repeating allowed by default (Anna)",
			input:     "Anna",
			wantValid: true,
		},
		{
			name:       "stricter repeating threshold flags Anna",
			input:      "Anna",
			opts:       &IsValidNameOptions{RepeatingThreshold: 2},
			wantValid:  false,
			wantReason: "repeating_chars",
		},
		{
			name:      "short sequential allowed by default (bcd)",
			input:     "bcd",
			wantValid: true,
		},
		{
			name:       "stricter sequential threshold flags bcd",
			input:      "bcd",
			opts:       &IsValidNameOptions{SequentialThreshold: 3},
			wantValid:  false,
			wantReason: "sequential_chars",
		},
		{
			name:      "half-alpha passes default dominance threshold",
			input:     "ab12",
			wantValid: true,
		},
		{
			name:       "stricter dominance threshold flags half-alpha",
			input:      "ab12",
			opts:       &IsValidNameOptions{AlphaDominanceThreshold: 0.6},
			wantValid:  false,
			wantReason: "non_alpha_dominant",
		},

		// ── error case ─────────────────────────────────────────────────────
		{name: "empty string returns error", input: "", wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := IsValidName(tt.input, tt.opts)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			assert.NoError(t, err)
			assert.Equal(t, tt.wantValid, got.IsValid)
			if tt.wantReason != "" {
				assert.Equal(t, tt.wantReason, got.Reason)
			}
		})
	}
}
