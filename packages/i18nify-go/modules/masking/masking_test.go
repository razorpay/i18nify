package masking

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// ── MaskCardNumber ────────────────────────────────────────────────────────────

func TestMaskCardNumber_Default16Digit(t *testing.T) {
	got, err := MaskCardNumber("4111111111111111")
	require.NoError(t, err)
	assert.Equal(t, "XXXX XXXX XXXX 1111", got)
}

func TestMaskCardNumber_DefaultWithSpaces(t *testing.T) {
	got, err := MaskCardNumber("4111 1111 1111 1111")
	require.NoError(t, err)
	assert.Equal(t, "XXXX XXXX XXXX 1111", got)
}

func TestMaskCardNumber_DefaultWithHyphens(t *testing.T) {
	got, err := MaskCardNumber("4111-1111-1111-1111")
	require.NoError(t, err)
	assert.Equal(t, "XXXX XXXX XXXX 1111", got)
}

func TestMaskCardNumber_15Digit(t *testing.T) {
	got, err := MaskCardNumber("378282246310005")
	require.NoError(t, err)
	assert.Equal(t, "XXXX XXXX XXX0 005", got)
}

func TestMaskCardNumber_CustomMaskChar(t *testing.T) {
	got, err := MaskCardNumber("4111111111111111", MaskCardOptions{MaskChar: "*"})
	require.NoError(t, err)
	assert.Equal(t, "**** **** **** 1111", got)
}

func TestMaskCardNumber_CustomVisibleCount(t *testing.T) {
	got, err := MaskCardNumber("4111111111111111", MaskCardOptions{VisibleCount: 6})
	require.NoError(t, err)
	assert.Equal(t, "XXXX XXXX XX11 1111", got)
}

func TestMaskCardNumber_NoGrouping(t *testing.T) {
	got, err := MaskCardNumber("4111111111111111", MaskCardOptions{NoGrouping: true})
	require.NoError(t, err)
	assert.Equal(t, "XXXXXXXXXXXX1111", got)
}

func TestMaskCardNumber_CustomGroupSeparator(t *testing.T) {
	got, err := MaskCardNumber("4111111111111111", MaskCardOptions{GroupSeparator: "-"})
	require.NoError(t, err)
	assert.Equal(t, "XXXX-XXXX-XXXX-1111", got)
}

func TestMaskCardNumber_VisibleCountBeyondLength(t *testing.T) {
	got, err := MaskCardNumber("1234", MaskCardOptions{VisibleCount: 10})
	require.NoError(t, err)
	assert.Equal(t, "1234", got)
}

func TestMaskCardNumber_EmptyInput(t *testing.T) {
	_, err := MaskCardNumber("")
	assert.Error(t, err)
}

func TestMaskCardNumber_InvalidChar(t *testing.T) {
	_, err := MaskCardNumber("4111A111111B1111")
	assert.Error(t, err)
}

// ── MaskPhoneNumber ───────────────────────────────────────────────────────────

func TestMaskPhoneNumber_USWithSeparators(t *testing.T) {
	got, err := MaskPhoneNumber("+1-800-555-1234")
	require.NoError(t, err)
	assert.Equal(t, "+X-XXX-XXX-1234", got)
}

func TestMaskPhoneNumber_E164India(t *testing.T) {
	got, err := MaskPhoneNumber("+919876543210")
	require.NoError(t, err)
	assert.Equal(t, "+XXXXXXXX3210", got)
}

func TestMaskPhoneNumber_NoCountryCode(t *testing.T) {
	got, err := MaskPhoneNumber("9876543210")
	require.NoError(t, err)
	assert.Equal(t, "XXXXXX3210", got)
}

func TestMaskPhoneNumber_SpaceSeparators(t *testing.T) {
	got, err := MaskPhoneNumber("+44 020 1234 5678")
	require.NoError(t, err)
	assert.Equal(t, "+XX XXX XXXX 5678", got)
}

func TestMaskPhoneNumber_CustomMaskChar(t *testing.T) {
	got, err := MaskPhoneNumber("+919876543210", MaskPhoneOptions{MaskChar: "*"})
	require.NoError(t, err)
	assert.Equal(t, "+********3210", got)
}

func TestMaskPhoneNumber_CustomVisibleCount(t *testing.T) {
	got, err := MaskPhoneNumber("+919876543210", MaskPhoneOptions{VisibleCount: 6})
	require.NoError(t, err)
	assert.Equal(t, "+XXXXXX543210", got)
}

func TestMaskPhoneNumber_EmptyInput(t *testing.T) {
	_, err := MaskPhoneNumber("")
	assert.Error(t, err)
}
