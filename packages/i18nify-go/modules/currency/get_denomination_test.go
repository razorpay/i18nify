package currency

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetDenomination(t *testing.T) {
	tests := []struct {
		code     string
		wantErr  bool
		contains string
	}{
		{"USD", false, "1"},
		{"INR", false, "1"},
		{"JPY", false, "1000"},
		{"EUR", false, "5"},
		{"", true, ""},
		{"XXX", true, ""},
	}

	for _, tt := range tests {
		t.Run(tt.code, func(t *testing.T) {
			result, err := GetDenomination(tt.code)
			if tt.wantErr {
				assert.Error(t, err)
				assert.Nil(t, result)
				return
			}
			assert.NoError(t, err)
			assert.NotEmpty(t, result)
			if tt.contains != "" {
				assert.Contains(t, result, tt.contains)
			}
		})
	}
}
