package masking

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestMaskPhoneNumber(t *testing.T) {
	tests := []struct {
		name    string
		phone   string
		opts    *MaskPhoneOptions
		want    string
		wantErr bool
	}{
		// ── default options (nil) ──────────────────────────────────────────
		{
			name:  "masks all but last 4 digits with default X",
			phone: "9876543210",
			opts:  nil,
			want:  "XXXXXX3210",
		},
		{
			name:  "preserves leading + with default options",
			phone: "+919876543210",
			opts:  nil,
			// digits: 919876543210 (12) → maskFrom=8 → XXXXXXXX3210
			want: "+XXXXXXXX3210",
		},
		{
			name:  "preserves formatting characters in their original positions",
			phone: "+1 234-567-8901",
			opts:  nil,
			// digits: 1,2,3,4,5,6,7,8,9,0,1 (11) → maskFrom=7 → X XXX-XXX-8901
			want: "+X XXX-XXX-8901",
		},

		// ── custom maskChar ────────────────────────────────────────────────
		{
			name:  "uses custom mask character",
			phone: "9876543210",
			opts:  &MaskPhoneOptions{MaskChar: "*"},
			want:  "******3210",
		},

		// ── custom visibleCount ────────────────────────────────────────────
		{
			name:  "shows last 6 digits when visibleCount is 6",
			phone: "9876543210",
			opts:  &MaskPhoneOptions{VisibleCount: 6},
			want:  "XXXX543210",
		},
		{
			name:  "masks nothing when visibleCount exceeds digit count",
			phone: "1234",
			opts:  &MaskPhoneOptions{VisibleCount: 6},
			want:  "1234",
		},
		{
			name:  "masks all digits when visibleCount is 0 (falls back to default 4)",
			phone: "9876543210",
			opts:  &MaskPhoneOptions{VisibleCount: 0},
			want:  "XXXXXX3210",
		},

		// ── combined custom options ────────────────────────────────────────
		{
			name:  "custom char and visibleCount together",
			phone: "+12025550199",
			opts:  &MaskPhoneOptions{MaskChar: "#", VisibleCount: 3},
			// digits: 12025550199 (11) → maskFrom=8 → ########199
			want: "+########199",
		},

		// ── error cases ───────────────────────────────────────────────────
		{
			name:    "returns error for empty string",
			phone:   "",
			opts:    nil,
			wantErr: true,
		},
		{
			name:    "returns error for whitespace-only string",
			phone:   "   ",
			opts:    nil,
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := MaskPhoneNumber(tt.phone, tt.opts)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			assert.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}
