package banking

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

// ── ValidateGSTIN ──────────────────────────────────────────────────────────────

func TestValidateGSTIN(t *testing.T) {
	tests := []struct {
		name    string
		gstin   string
		want    bool
		wantErr bool
	}{
		{name: "valid GSTIN state 27 (Maharashtra)", gstin: "27ABCDE1234F1Z5", want: true},
		{name: "valid GSTIN state 29 (Karnataka)", gstin: "29ABCDE1234F2Z6", want: true},
		{name: "valid state 97 (Other Territory)", gstin: "97ABCDE1234F1Z5", want: true},
		{name: "valid state 99 (Centre)", gstin: "99ABCDE1234F1Z5", want: true},
		{name: "lowercase GSTIN is accepted", gstin: "27abcde1234f1z5", want: true},
		{name: "surrounding whitespace is trimmed", gstin: "  27ABCDE1234F1Z5  ", want: true},

		{name: "invalid state code 25", gstin: "25ABCDE1234F1Z5", want: false},
		{name: "invalid state code 28", gstin: "28ABCDE1234F1Z5", want: false},
		{name: "invalid state code 00", gstin: "00ABCDE1234F1Z5", want: false},
		{name: "out-of-range state code 39", gstin: "39ABCDE1234F1Z5", want: false},

		{name: "14th char not Z", gstin: "27ABCDE1234F1A5", want: false},
		{name: "too short", gstin: "27ABCDE1234F1Z", want: false},
		{name: "too long", gstin: "27ABCDE1234F1Z55", want: false},
		{name: "entity char 0 is rejected", gstin: "27ABCDE1234F0Z5", want: false},
		{name: "letters in PAN numeric block", gstin: "27ABCDEABCDF1Z5", want: false},

		{name: "empty string returns error", gstin: "", wantErr: true},
		{name: "whitespace-only returns error", gstin: "   ", wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := ValidateGSTIN(tt.gstin)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			assert.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}
