package phonenumber

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetCountryTeleInformation(t *testing.T) {
	// Test with valid country code
	info := GetCountryTeleInformation("IN")
	assert.Equal(t, "+91", info.DialCode, "DialCode should match for IN")
	assert.NotEmpty(t, info.Format, "Format should not be empty")
	assert.NotEmpty(t, info.Regex, "Regex should not be empty")

	// Test with another valid country code
	usInfo := GetCountryTeleInformation("US")
	assert.Equal(t, "+1", usInfo.DialCode, "DialCode should match for US")
	assert.NotEmpty(t, usInfo.Format, "Format should not be empty")
	assert.NotEmpty(t, usInfo.Regex, "Regex should not be empty")

	// Test with empty country code
	emptyInfo := GetCountryTeleInformation("")
	assert.Empty(t, emptyInfo.DialCode, "DialCode should be empty for empty country code")
	assert.Empty(t, emptyInfo.Format, "Format should be empty for empty country code")
	assert.Empty(t, emptyInfo.Regex, "Regex should be empty for empty country code")

	// Test with invalid country code
	invalidInfo := GetCountryTeleInformation("XX")
	assert.Empty(t, invalidInfo.DialCode, "DialCode should be empty for invalid country code")
	assert.Empty(t, invalidInfo.Format, "Format should be empty for invalid country code")
	assert.Empty(t, invalidInfo.Regex, "Regex should be empty for invalid country code")
}
