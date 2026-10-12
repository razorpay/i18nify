package currency

import (
	"math"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestConvertBasisPointsToPercent(t *testing.T) {
	tests := []struct {
		name        string
		basisPoints float64
		expected    float64
		expectError bool
	}{
		{"250 bps to 2.5%", 250, 2.5, false},
		{"100 bps to 1%", 100, 1.0, false},
		{"1 bps to 0.01%", 1, 0.01, false},
		{"0 bps to 0%", 0, 0.0, false},
		{"10000 bps to 100%", 10000, 100.0, false},
		{"negative bps", -50, -0.5, false},
		{"NaN input", math.NaN(), 0, true},
		{"Inf input", math.Inf(1), 0, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := ConvertBasisPointsToPercent(tt.basisPoints)
			if tt.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.InDelta(t, tt.expected, result, 1e-9)
			}
		})
	}
}

func TestConvertPercentToBasisPoints(t *testing.T) {
	tests := []struct {
		name        string
		percent     float64
		expected    float64
		expectError bool
	}{
		{"2.5% to 250 bps", 2.5, 250, false},
		{"1% to 100 bps", 1.0, 100, false},
		{"0.01% to 1 bps", 0.01, 1, false},
		{"0% to 0 bps", 0, 0, false},
		{"100% to 10000 bps", 100, 10000, false},
		{"negative percent", -0.5, -50, false},
		{"NaN input", math.NaN(), 0, true},
		{"Inf input", math.Inf(-1), 0, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := ConvertPercentToBasisPoints(tt.percent)
			if tt.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.InDelta(t, tt.expected, result, 1e-9)
			}
		})
	}
}
