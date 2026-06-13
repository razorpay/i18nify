package validator

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestIsValidCardNumber(t *testing.T) {
	tests := []struct {
		name    string
		card    string
		opts    *CardValidationOptions
		want    bool
		wantErr bool
	}{
		// ── valid numbers (Luhn pass) ──────────────────────────────────────
		{
			name: "valid 13-digit Visa",
			card: "4222222222222",
			want: true,
		},
		{
			name: "valid 16-digit Visa",
			card: "4111111111111111",
			want: true,
		},
		{
			name: "valid 16-digit Mastercard",
			card: "5500005555555559",
			want: true,
		},
		{
			name: "valid 15-digit Amex",
			card: "378282246310005",
			want: true,
		},
		{
			name: "valid 19-digit Visa",
			card: "4000000000000000006",
			want: true,
		},
		{
			name: "accepts space-separated input",
			card: "4111 1111 1111 1111",
			want: true,
		},
		{
			name: "accepts hyphen-separated input",
			card: "4111-1111-1111-1111",
			want: true,
		},

		// ── invalid numbers ────────────────────────────────────────────────
		{
			name: "fails Luhn check",
			card: "4111111111111112",
			want: false,
		},
		{
			name: "contains non-digit characters",
			card: "4111-ABCD-1111-1111",
			want: false,
		},
		{
			name: "too short (12 digits)",
			card: "411111111111",
			want: false,
		},
		{
			name: "too long (20 digits)",
			card: "41111111111111111111",
			want: false,
		},

		// ── custom allowedLengths ──────────────────────────────────────────
		{
			name: "accepts card matching allowedLengths",
			card: "4111111111111111",
			opts: &CardValidationOptions{AllowedLengths: []int{16}},
			want: true,
		},
		{
			name: "rejects card not in allowedLengths",
			card: "378282246310005", // 15 digits
			opts: &CardValidationOptions{AllowedLengths: []int{16}},
			want: false,
		},
		{
			name: "accepts card when length is one of multiple allowedLengths",
			card: "378282246310005",
			opts: &CardValidationOptions{AllowedLengths: []int{15, 16}},
			want: true,
		},

		// ── error cases ───────────────────────────────────────────────────
		{
			name:    "returns error for empty string",
			card:    "",
			wantErr: true,
		},
		{
			name:    "returns error for whitespace-only string",
			card:    "   ",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := IsValidCardNumber(tt.card, tt.opts)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			assert.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}
