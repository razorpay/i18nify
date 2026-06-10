package validator

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestIsValidCardNumber_Valid(t *testing.T) {
	valid := []struct {
		label string
		pan   string
	}{
		{"Visa test PAN", "4111111111111111"},
		{"Mastercard test PAN", "5500005555555559"},
		{"Amex test PAN", "378282246310005"},
		{"Discover test PAN", "6011111111111117"},
		{"Visa with spaces", "4111 1111 1111 1111"},
		{"Visa with hyphens", "4111-1111-1111-1111"},
	}
	for _, tc := range valid {
		ok, err := IsValidCardNumber(tc.pan)
		assert.NoError(t, err, tc.label)
		assert.True(t, ok, "expected valid (%s): %q", tc.label, tc.pan)
	}
}

func TestIsValidCardNumber_Invalid(t *testing.T) {
	invalid := []struct {
		label string
		pan   string
	}{
		{"Luhn check fails", "4111111111111112"},
		{"too short", "411111111111"},
		{"too long", "41111111111111110000"},
		{"contains letters", "4111111111111a11"},
	}
	for _, tc := range invalid {
		ok, err := IsValidCardNumber(tc.pan)
		assert.NoError(t, err, tc.label)
		assert.False(t, ok, "expected invalid (%s): %q", tc.label, tc.pan)
	}
}

func TestIsValidCardNumber_AllowedLengths(t *testing.T) {
	// Amex is 15 digits — should fail if only 16-digit cards allowed
	ok, err := IsValidCardNumber("378282246310005", CardOptions{AllowedLengths: []int{16}})
	assert.NoError(t, err)
	assert.False(t, ok)

	// Allow both 15 and 16
	ok, err = IsValidCardNumber("378282246310005", CardOptions{AllowedLengths: []int{15, 16}})
	assert.NoError(t, err)
	assert.True(t, ok)
}

func TestIsValidCardNumber_EmptyInput(t *testing.T) {
	_, err := IsValidCardNumber("")
	assert.Error(t, err)
}
