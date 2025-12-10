package phonenumber

import (
	"fmt"
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

func TestIsValidPhoneNumber(t *testing.T) {
	fmt.Println("[Testing] IsValidPhoneNumber")
	// Test with valid phone number and country code
	assert.True(t, IsValidPhoneNumber("+919876543210", "IN"), "Valid Indian phone number should return true")
	assert.True(t, IsValidPhoneNumber("9876543210", "IN"), "Valid Indian phone number without + should return true")

	// Test with valid US phone number
	assert.True(t, IsValidPhoneNumber("+15853042806", "US"), "Valid US phone number should return true")
	assert.True(t, IsValidPhoneNumber("5853042806", "US"), "Valid US phone number without + should return true")

	// Test with invalid phone number
	assert.False(t, IsValidPhoneNumber("123", "IN"), "Invalid phone number should return false")
	assert.False(t, IsValidPhoneNumber("+91123", "IN"), "Invalid phone number should return false")
	assert.False(t, IsValidPhoneNumber("+9181036abc02", "IN"), "Invalid phone number should return false")

	// Test with empty phone number
	assert.False(t, IsValidPhoneNumber("", "IN"), "Empty phone number should return false")

	// Test with empty country code
	assert.False(t, IsValidPhoneNumber("+919876543210", ""), "Empty country code should return false")

	// Test with invalid country code
	assert.False(t, IsValidPhoneNumber("+919876543210", "XX"), "Invalid country code should return false")

	// Test with phone number containing non-numeric characters (should be cleaned)
	assert.True(t, IsValidPhoneNumber("+91 (987) 654-3210", "IN"), "Phone number with formatting should be cleaned and validated")
	assert.True(t, IsValidPhoneNumber("(585) 304-2806", "US"), "US phone number with formatting should be cleaned and validated")
}
