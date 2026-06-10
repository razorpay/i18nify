package bankcodes

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

// ─── ValidatePAN ─────────────────────────────────────────────────────────────

func TestValidatePAN_Valid(t *testing.T) {
	valid := []string{"ABCPD1234F", "AABCD1234E", "AAATD1234E", "AABHD1234E", "AABFD1234E"}
	for _, pan := range valid {
		t.Run(pan, func(t *testing.T) {
			got, err := ValidatePAN(pan)
			assert.NoError(t, err)
			assert.True(t, got)
		})
	}
}

func TestValidatePAN_Normalisation(t *testing.T) {
	got, err := ValidatePAN("abcpd1234f")
	assert.NoError(t, err)
	assert.True(t, got)

	got, err = ValidatePAN("  ABCPD1234F  ")
	assert.NoError(t, err)
	assert.True(t, got)
}

func TestValidatePAN_Invalid(t *testing.T) {
	invalid := []string{
		"ABCPD123",    // too short
		"ABCPD1234FX", // too long
		"ABCZD1234F",  // invalid entity char Z
		"1BCPD1234F",  // digit in first 3 chars
		"ABCPDABCDF",  // letters where digits expected
	}
	for _, pan := range invalid {
		t.Run(pan, func(t *testing.T) {
			got, err := ValidatePAN(pan)
			assert.NoError(t, err)
			assert.False(t, got)
		})
	}
}

func TestValidatePAN_Empty(t *testing.T) {
	_, err := ValidatePAN("")
	assert.Error(t, err)
}

// ─── ValidateGSTIN ───────────────────────────────────────────────────────────

func TestValidateGSTIN_Valid(t *testing.T) {
	valid := []string{
		"27ABCPD1234F1Z5", // Maharashtra
		"29AABCD1234E1Z3", // Karnataka
		"07AAATD1234E1Z6", // Delhi
		"37ABCPD1234F1Z4", // Andhra Pradesh (new)
		"38ABCPD1234F1Z2", // Ladakh
		"97ABCPD1234F1Z8", // Other Territory
		"99ABCPD1234F1Z0", // Centre
	}
	for _, g := range valid {
		t.Run(g, func(t *testing.T) {
			got, err := ValidateGSTIN(g)
			assert.NoError(t, err)
			assert.True(t, got)
		})
	}
}

func TestValidateGSTIN_Normalisation(t *testing.T) {
	got, err := ValidateGSTIN("27abcpd1234f1z5")
	assert.NoError(t, err)
	assert.True(t, got)
}

func TestValidateGSTIN_Invalid(t *testing.T) {
	cases := []struct {
		name  string
		input string
	}{
		{"state code 00", "00ABCPD1234F1Z5"},
		{"state code 39", "39ABCPD1234F1Z5"},
		{"state code 25 removed", "25ABCPD1234F1Z5"},
		{"missing Z separator", "27ABCPD1234F1X5"},
		{"entity number 0", "27ABCPD1234F0Z5"},
		{"too short", "27ABCPD1234F1Z"},
		{"too long", "27ABCPD1234F1Z55"},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			got, err := ValidateGSTIN(c.input)
			assert.NoError(t, err)
			assert.False(t, got)
		})
	}
}

func TestValidateGSTIN_Empty(t *testing.T) {
	_, err := ValidateGSTIN("")
	assert.Error(t, err)
}

// ─── ValidateIFSC ────────────────────────────────────────────────────────────

func TestValidateIFSC_Valid(t *testing.T) {
	valid := []string{"SBIN0001234", "HDFC0001234", "ICIC0A12345", "PUNB0123456"}
	for _, ifsc := range valid {
		t.Run(ifsc, func(t *testing.T) {
			got, err := ValidateIFSC(ifsc)
			assert.NoError(t, err)
			assert.True(t, got)
		})
	}
}

func TestValidateIFSC_Normalisation(t *testing.T) {
	got, err := ValidateIFSC("sbin0001234")
	assert.NoError(t, err)
	assert.True(t, got)
}

func TestValidateIFSC_Invalid(t *testing.T) {
	invalid := []string{
		"SBIN1001234", // 5th char not 0
		"SB1N0001234", // digit in bank code
		"SBIN000123",  // too short
		"SBIN0-01234", // special char in branch
	}
	for _, ifsc := range invalid {
		t.Run(ifsc, func(t *testing.T) {
			got, err := ValidateIFSC(ifsc)
			assert.NoError(t, err)
			assert.False(t, got)
		})
	}
}

func TestValidateIFSC_Empty(t *testing.T) {
	_, err := ValidateIFSC("")
	assert.Error(t, err)
}

// ─── NormalizeIFSC ───────────────────────────────────────────────────────────

func TestNormalizeIFSC_Valid(t *testing.T) {
	cases := [][2]string{
		{"SBIN0001234", "SBIN0001234"},
		{"sbin0001234", "SBIN0001234"},
		{"  HDFC0001234  ", "HDFC0001234"},
		{"icic0A12345", "ICIC0A12345"},
	}
	for _, c := range cases {
		t.Run(c[0], func(t *testing.T) {
			got, err := NormalizeIFSC(c[0])
			assert.NoError(t, err)
			assert.Equal(t, c[1], got)
		})
	}
}

func TestNormalizeIFSC_Errors(t *testing.T) {
	_, err := NormalizeIFSC("")
	assert.Error(t, err)

	_, err = NormalizeIFSC("SBIN1001234") // 5th char not 0
	assert.Error(t, err)

	_, err = NormalizeIFSC("SBIN00123") // too short
	assert.Error(t, err)
}
