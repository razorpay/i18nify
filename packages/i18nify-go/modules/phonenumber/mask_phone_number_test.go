package phonenumber

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

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
