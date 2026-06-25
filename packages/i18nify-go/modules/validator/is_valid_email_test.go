package validator

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestIsValidEmail(t *testing.T) {
	tests := []struct {
		name    string
		email   string
		opts    *EmailValidationOptions
		want    bool
		wantErr bool
	}{
		// ── valid addresses (default: TLD required) ────────────────────────
		{
			name:  "simple address",
			email: "user@example.com",
			want:  true,
		},
		{
			name:  "multi-level domain",
			email: "john.doe@sub.example.co.uk",
			want:  true,
		},
		{
			name:  "local part with allowed special characters",
			email: "user.name+tag@example.com",
			want:  true,
		},
		{
			name:  "short two-letter TLD",
			email: "a@b.co",
			want:  true,
		},
		{
			name:  "surrounding whitespace is trimmed",
			email: "  user@example.com  ",
			want:  true,
		},

		// ── invalid addresses (default: TLD required) ──────────────────────
		{
			name:  "bare domain rejected without AllowNoTld",
			email: "user@localhost",
			want:  false,
		},
		{
			name:  "missing @ separator",
			email: "plainaddress",
			want:  false,
		},
		{
			name:  "missing local part",
			email: "@example.com",
			want:  false,
		},
		{
			name:  "missing domain",
			email: "user@",
			want:  false,
		},
		{
			name:  "double @",
			email: "user@@example.com",
			want:  false,
		},
		{
			name:  "empty domain label",
			email: "user@.com",
			want:  false,
		},
		{
			name:  "space inside local part",
			email: "user name@example.com",
			want:  false,
		},

		// ── AllowNoTld option ──────────────────────────────────────────────
		{
			name:  "bare domain accepted with AllowNoTld",
			email: "user@localhost",
			opts:  &EmailValidationOptions{AllowNoTld: true},
			want:  true,
		},
		{
			name:  "TLD address still valid with AllowNoTld",
			email: "user@example.com",
			opts:  &EmailValidationOptions{AllowNoTld: true},
			want:  true,
		},

		// ── error cases ────────────────────────────────────────────────────
		{
			name:    "returns error for empty string",
			email:   "",
			wantErr: true,
		},
		{
			name:    "returns error for whitespace-only string",
			email:   "   ",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := IsValidEmail(tt.email, tt.opts)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			assert.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}
