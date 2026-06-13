package masking

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestMaskCardNumber(t *testing.T) {
	groupSizeZero := 0
	groupSizeTwo := 2

	tests := []struct {
		name    string
		card    string
		opts    *MaskCardOptions
		want    string
		wantErr bool
	}{
		{
			name: "masks all but last 4 digits with default grouping",
			card: "4111111111111111",
			want: "XXXX XXXX XXXX 1111",
		},
		{
			name: "accepts spaces and hyphens in input",
			card: "4111-1111 1111-1111",
			want: "XXXX XXXX XXXX 1111",
		},
		{
			name: "uses custom mask character",
			card: "4111111111111111",
			opts: &MaskCardOptions{MaskChar: "*"},
			want: "**** **** **** 1111",
		},
		{
			name: "supports custom visible count",
			card: "4111111111111111",
			opts: &MaskCardOptions{VisibleCount: 6},
			want: "XXXX XXXX XX11 1111",
		},
		{
			name: "disables grouping when group size is zero",
			card: "4111111111111111",
			opts: &MaskCardOptions{GroupSizePtr: &groupSizeZero},
			want: "XXXXXXXXXXXX1111",
		},
		{
			name: "supports custom group size and separator",
			card: "4111111111111111",
			opts: &MaskCardOptions{GroupSizePtr: &groupSizeTwo, GroupSeparator: "-"},
			want: "XX-XX-XX-XX-XX-XX-11-11",
		},
		{
			name: "shows full number when visible count exceeds digit count",
			card: "1234",
			opts: &MaskCardOptions{VisibleCount: 6},
			want: "1234",
		},
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
		{
			name:    "returns error for invalid characters",
			card:    "4111-1111-1111-ABCD",
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
