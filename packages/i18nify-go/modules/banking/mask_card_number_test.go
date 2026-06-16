package banking

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestMaskCardNumber(t *testing.T) {
	groupOf4 := 4

	tests := []struct {
		name    string
		card    string
		opts    *MaskCardOptions
		want    string
		wantErr bool
	}{
		// ── default options (nil) ──────────────────────────────────────────
		{
			name: "16-digit Visa masked in groups of 4",
			card: "4111111111111111",
			opts: nil,
			want: "XXXX XXXX XXXX 1111",
		},
		{
			name: "15-digit Amex masked in groups of 4",
			card: "378282246310005",
			opts: nil,
			// 15 digits, 11 masked: XXXXXXXXXXX0005 → XXXX XXXX XXX0 005
			want: "XXXX XXXX XXX0 005",
		},
		{
			name: "accepts hyphen-separated input",
			card: "4111-1111-1111-1111",
			opts: nil,
			want: "XXXX XXXX XXXX 1111",
		},
		{
			name: "accepts space-separated input",
			card: "4111 1111 1111 1111",
			opts: nil,
			want: "XXXX XXXX XXXX 1111",
		},

		// ── custom maskChar ────────────────────────────────────────────────
		{
			name: "uses * as mask character",
			card: "4111111111111111",
			opts: &MaskCardOptions{MaskChar: "*"},
			want: "**** **** **** 1111",
		},
		{
			name: "uses # as mask character",
			card: "4111111111111111",
			opts: &MaskCardOptions{MaskChar: "#"},
			want: "#### #### #### 1111",
		},

		// ── custom visibleCount ────────────────────────────────────────────
		{
			name: "shows last 6 digits when visibleCount is 6",
			card: "4111111111111111",
			opts: &MaskCardOptions{VisibleCount: 6},
			// 16 digits, 10 masked: XXXXXXXXXX111111 → XXXX XXXX XX11 1111
			want: "XXXX XXXX XX11 1111",
		},
		{
			name: "shows all digits when visibleCount exceeds card length",
			card: "4111111111111111",
			opts: &MaskCardOptions{VisibleCount: 20},
			want: "4111 1111 1111 1111",
		},

		// ── groupSize ──────────────────────────────────────────────────────
		{
			name: "disables grouping when groupSize is 0",
			card: "4111111111111111",
			opts: &MaskCardOptions{GroupSizePtr: func() *int { z := 0; return &z }()},
			want: "XXXXXXXXXXXX1111",
		},
		{
			name: "groups in chunks of 4 when GroupSizePtr is set to 4",
			card: "4111111111111111",
			opts: &MaskCardOptions{GroupSizePtr: &groupOf4},
			want: "XXXX XXXX XXXX 1111",
		},

		// ── custom GroupSeparator ──────────────────────────────────────────
		{
			name: "uses hyphen as group separator",
			card: "4111111111111111",
			opts: &MaskCardOptions{GroupSeparator: "-"},
			want: "XXXX-XXXX-XXXX-1111",
		},

		// ── error cases ───────────────────────────────────────────────────
		{
			name:    "returns error for empty string",
			card:    "",
			opts:    nil,
			wantErr: true,
		},
		{
			name:    "returns error for whitespace-only string",
			card:    "   ",
			opts:    nil,
			wantErr: true,
		},
		{
			name:    "returns error for non-numeric characters",
			card:    "4111-ABCD-1111-1111",
			opts:    nil,
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := MaskCardNumber(tt.card, tt.opts)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			assert.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}
