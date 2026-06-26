package banking

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

// ── ValidatePAN ────────────────────────────────────────────────────────────────

func TestValidatePAN(t *testing.T) {
	tests := []struct {
		name    string
		pan     string
		want    bool
		wantErr bool
	}{
		{name: "valid individual PAN (entity P)", pan: "ABCPK1234L", want: true},
		{name: "valid company PAN (entity C)", pan: "ABCCK1234L", want: true},
		{name: "valid firm PAN (entity F)", pan: "ABCFK1234L", want: true},
		{name: "valid HUF PAN (entity H)", pan: "ABCHK1234L", want: true},
		{name: "valid trust PAN (entity T)", pan: "ABCTK1234L", want: true},
		{name: "valid govt PAN (entity G)", pan: "ABCGK1234L", want: true},
		{name: "lowercase PAN is accepted", pan: "abcpk1234l", want: true},
		{name: "surrounding whitespace is trimmed", pan: "  ABCPK1234L  ", want: true},

		{name: "invalid entity char D", pan: "ABCDE1234L", want: false},
		{name: "too short", pan: "ABCPK123L", want: false},
		{name: "too long", pan: "ABCPK1234LL", want: false},
		{name: "digit in alpha block", pan: "AB1PK1234L", want: false},
		{name: "letters in numeric block", pan: "ABCPKABCDL", want: false},
		{name: "ends with a digit", pan: "ABCPK12345", want: false},
		{name: "contains special character", pan: "ABCPK-234L", want: false},

		{name: "empty string returns error", pan: "", wantErr: true},
		{name: "whitespace-only returns error", pan: "   ", wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := ValidatePAN(tt.pan)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			assert.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}
