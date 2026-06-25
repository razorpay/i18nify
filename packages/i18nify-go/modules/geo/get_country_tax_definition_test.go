package geo

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetCountryTaxDefinition(t *testing.T) {
	tests := []struct {
		name        string
		input       string
		wantTaxName string
		wantRate    float64
		wantErr     bool
		errContains string
	}{
		// GST countries
		{name: "India GST", input: "IN", wantTaxName: "GST", wantRate: 18},
		{name: "Australia GST", input: "AU", wantTaxName: "GST", wantRate: 10},
		{name: "Singapore GST", input: "SG", wantTaxName: "GST", wantRate: 9},
		{name: "New Zealand GST", input: "NZ", wantTaxName: "GST", wantRate: 15},
		// VAT countries
		{name: "Germany MwSt", input: "DE", wantTaxName: "MwSt", wantRate: 19},
		{name: "UK VAT", input: "GB", wantTaxName: "VAT", wantRate: 20},
		{name: "France TVA", input: "FR", wantTaxName: "TVA", wantRate: 20},
		{name: "UAE VAT", input: "AE", wantTaxName: "VAT", wantRate: 5},
		{name: "Hungary highest EU rate", input: "HU", wantTaxName: "ÁFA", wantRate: 27},
		{name: "Finland decimal rate", input: "FI", wantTaxName: "ALV", wantRate: 25.5},
		// Other systems
		{name: "US Sales Tax zero rate", input: "US", wantTaxName: "Sales Tax", wantRate: 0},
		{name: "Malaysia SST", input: "MY", wantTaxName: "SST", wantRate: 10},
		{name: "Japan Consumption Tax", input: "JP", wantTaxName: "CT", wantRate: 10},
		{name: "Brazil IBS/CBS", input: "BR", wantTaxName: "IBS/CBS", wantRate: 26.5},
		// No indirect tax
		{name: "Hong Kong no tax", input: "HK", wantTaxName: "", wantRate: 0},
		{name: "Kuwait no tax", input: "KW", wantTaxName: "", wantRate: 0},
		// Input normalisation
		{name: "lowercase accepted", input: "in", wantTaxName: "GST", wantRate: 18},
		{name: "padded whitespace trimmed", input: "  DE  ", wantTaxName: "MwSt", wantRate: 19},
		// Errors
		{name: "empty string errors", input: "", wantErr: true, errContains: "non-empty"},
		{name: "whitespace only errors", input: "   ", wantErr: true, errContains: "non-empty"},
		{name: "unsupported code errors", input: "XX", wantErr: true, errContains: "not supported"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := GetCountryTaxDefinition(tt.input)
			if tt.wantErr {
				assert.Error(t, err)
				if tt.errContains != "" {
					assert.True(t, strings.Contains(err.Error(), tt.errContains),
						"expected error to contain %q, got %q", tt.errContains, err.Error())
				}
				return
			}
			assert.NoError(t, err)
			assert.Equal(t, tt.wantTaxName, result.TaxName)
			assert.Equal(t, tt.wantRate, result.StandardRate)
		})
	}
}

func TestGetCountryTaxDefinition_FullFields(t *testing.T) {
	result, err := GetCountryTaxDefinition("IN")
	assert.NoError(t, err)
	assert.Equal(t, "GST", result.TaxName)
	assert.Equal(t, "Goods and Services Tax", result.FullName)
	assert.Equal(t, float64(18), result.StandardRate)
	assert.Contains(t, result.Notes, "Multiple slabs")
}

func TestGetCountryTaxDefinition_NotesPresent(t *testing.T) {
	// US has notes about no federal rate
	result, err := GetCountryTaxDefinition("US")
	assert.NoError(t, err)
	assert.Contains(t, result.Notes, "No federal rate")

	// CA has notes about HST
	result, err = GetCountryTaxDefinition("CA")
	assert.NoError(t, err)
	assert.Contains(t, result.Notes, "HST")
}

func TestGetCountryTaxDefinition_NoTaxCountries(t *testing.T) {
	result, err := GetCountryTaxDefinition("HK")
	assert.NoError(t, err)
	assert.Equal(t, "", result.TaxName)
	assert.Equal(t, float64(0), result.StandardRate)
	assert.Contains(t, result.Notes, "No VAT or GST")
}
