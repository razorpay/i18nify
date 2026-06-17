package geo

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestAlpha2ToAlpha3(t *testing.T) {
	tests := []struct {
		name        string
		input       string
		want        string
		wantErr     bool
		errContains string
	}{
		{name: "IN → IND", input: "IN", want: "IND"},
		{name: "US → USA", input: "US", want: "USA"},
		{name: "DE → DEU", input: "DE", want: "DEU"},
		{name: "SG → SGP", input: "SG", want: "SGP"},
		{name: "lowercase input normalised", input: "in", want: "IND"},
		{name: "empty string returns error", input: "", wantErr: true, errContains: "required"},
		{name: "unknown code returns error", input: "XX", wantErr: true, errContains: "not found"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := Alpha2ToAlpha3(tt.input)
			if tt.wantErr {
				assert.Error(t, err)
				if tt.errContains != "" {
					assert.True(t, strings.Contains(err.Error(), tt.errContains),
						"expected error to contain %q, got %q", tt.errContains, err.Error())
				}
				return
			}
			assert.NoError(t, err)
			assert.Equal(t, tt.want, result)
		})
	}
}

func TestAlpha3ToAlpha2(t *testing.T) {
	tests := []struct {
		name        string
		input       string
		want        string
		wantErr     bool
		errContains string
	}{
		{name: "IND → IN", input: "IND", want: "IN"},
		{name: "USA → US", input: "USA", want: "US"},
		{name: "DEU → DE", input: "DEU", want: "DE"},
		{name: "SGP → SG", input: "SGP", want: "SG"},
		{name: "lowercase input normalised", input: "ind", want: "IN"},
		{name: "padded whitespace normalised", input: "  IND  ", want: "IN"},
		{name: "empty string returns error", input: "", wantErr: true, errContains: "required"},
		{name: "unknown code returns error", input: "XYZ", wantErr: true, errContains: "not found"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := Alpha3ToAlpha2(tt.input)
			if tt.wantErr {
				assert.Error(t, err)
				if tt.errContains != "" {
					assert.True(t, strings.Contains(err.Error(), tt.errContains),
						"expected error to contain %q, got %q", tt.errContains, err.Error())
				}
				return
			}
			assert.NoError(t, err)
			assert.Equal(t, tt.want, result)
		})
	}
}

func TestAlpha2ToAlpha3_RoundTrip(t *testing.T) {
	pairs := [][2]string{
		{"IN", "IND"}, {"US", "USA"}, {"GB", "GBR"}, {"JP", "JPN"}, {"CN", "CHN"},
	}
	for _, pair := range pairs {
		alpha2, alpha3 := pair[0], pair[1]
		t.Run(alpha2+"↔"+alpha3, func(t *testing.T) {
			got3, err := Alpha2ToAlpha3(alpha2)
			assert.NoError(t, err)
			assert.Equal(t, alpha3, got3)

			got2, err := Alpha3ToAlpha2(alpha3)
			assert.NoError(t, err)
			assert.Equal(t, alpha2, got2)
		})
	}
}
