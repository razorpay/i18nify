package banking

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

// ── ValidateIFSC ───────────────────────────────────────────────────────────────

func TestValidateIFSC(t *testing.T) {
	tests := []struct {
		name    string
		ifsc    string
		want    bool
		wantErr bool
	}{
		{name: "valid IFSC HDFC0001234", ifsc: "HDFC0001234", want: true},
		{name: "valid IFSC SBIN0000001", ifsc: "SBIN0000001", want: true},
		{name: "branch code with letters", ifsc: "ICIC0ABC123", want: true},
		{name: "lowercase IFSC is accepted", ifsc: "hdfc0001234", want: true},
		{name: "surrounding whitespace is trimmed", ifsc: "  HDFC0001234  ", want: true},

		{name: "5th char not 0", ifsc: "HDFC1001234", want: false},
		{name: "digit in bank code", ifsc: "HD120001234", want: false},
		{name: "too short", ifsc: "HDFC000123", want: false},
		{name: "too long", ifsc: "HDFC00012345", want: false},
		{name: "contains special character", ifsc: "HDFC0-01234", want: false},

		{name: "empty string returns error", ifsc: "", wantErr: true},
		{name: "whitespace-only returns error", ifsc: "   ", wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := ValidateIFSC(tt.ifsc)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			assert.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}
