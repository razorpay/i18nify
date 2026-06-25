package country_subdivisions

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetStateByZipCode(t *testing.T) {
	tests := []struct {
		name        string
		zipCode     string
		countryCode string
		wantErr     bool
		errContains string
		check       func(t *testing.T, result string)
	}{
		{
			name:        "valid IN zipcode returns state name",
			zipCode:     "560001",
			countryCode: "IN",
			check: func(t *testing.T, result string) {
				assert.NotEmpty(t, result)
				assert.IsType(t, "", result, "result must be a plain string")
			},
		},
		{
			// US state names are empty strings in source data — function still succeeds
			name:        "valid US zipcode returns without error",
			zipCode:     "10001",
			countryCode: "US",
			check:       func(t *testing.T, result string) {},
		},
		{
			name:        "valid MY zipcode returns non-empty state name",
			zipCode:     "83000",
			countryCode: "MY",
			check: func(t *testing.T, result string) {
				assert.NotEmpty(t, result)
			},
		},
		{
			name:        "empty zipCode returns error",
			zipCode:     "",
			countryCode: "IN",
			wantErr:     true,
			errContains: "zipCode is required",
		},
		{
			name:        "not found zipcode returns error",
			zipCode:     "ZZZZZ",
			countryCode: "IN",
			wantErr:     true,
			errContains: "not found",
		},
		{
			name:    "empty countryCode searches all countries",
			zipCode: "560001",
			check: func(t *testing.T, result string) {
				assert.NotEmpty(t, result)
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := GetStateByZipCode(tt.zipCode, tt.countryCode)
			if tt.wantErr {
				assert.Error(t, err)
				if tt.errContains != "" {
					assert.True(t, strings.Contains(err.Error(), tt.errContains),
						"expected error to contain %q, got %q", tt.errContains, err.Error())
				}
				return
			}
			assert.NoError(t, err)
			if tt.check != nil {
				tt.check(t, result)
			}
		})
	}
}

func TestGetCityByZipCode(t *testing.T) {
	tests := []struct {
		name        string
		zipCode     string
		countryCode string
		wantErr     bool
		errContains string
		check       func(t *testing.T, result string)
	}{
		{
			name:        "valid IN zipcode returns city name",
			zipCode:     "560001",
			countryCode: "IN",
			check: func(t *testing.T, result string) {
				assert.NotEmpty(t, result)
				assert.IsType(t, "", result, "result must be a plain string")
			},
		},
		{
			name:        "valid US zipcode returns city name",
			zipCode:     "10001",
			countryCode: "US",
			check: func(t *testing.T, result string) {
				assert.NotEmpty(t, result)
			},
		},
		{
			name:        "empty zipCode returns error",
			zipCode:     "",
			countryCode: "IN",
			wantErr:     true,
			errContains: "zipCode is required",
		},
		{
			name:        "not found zipcode returns error",
			zipCode:     "ZZZZZ",
			countryCode: "IN",
			wantErr:     true,
			errContains: "not found",
		},
		{
			name:    "empty countryCode searches all countries",
			zipCode: "560001",
			check: func(t *testing.T, result string) {
				assert.NotEmpty(t, result)
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := GetCityByZipCode(tt.zipCode, tt.countryCode)
			if tt.wantErr {
				assert.Error(t, err)
				if tt.errContains != "" {
					assert.True(t, strings.Contains(err.Error(), tt.errContains),
						"expected error to contain %q, got %q", tt.errContains, err.Error())
				}
				return
			}
			assert.NoError(t, err)
			if tt.check != nil {
				tt.check(t, result)
			}
		})
	}
}
