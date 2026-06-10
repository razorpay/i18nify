package validator

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestIsValidEmail_Valid(t *testing.T) {
	valid := []string{
		"user@example.com",
		"user.name+tag@sub.domain.co.uk",
		"user@domain.io",
		"first.last@company.org",
		"user123@host.net",
	}
	for _, email := range valid {
		ok, err := IsValidEmail(email)
		assert.NoError(t, err, "email: %q", email)
		assert.True(t, ok, "expected valid: %q", email)
	}
}

func TestIsValidEmail_Invalid(t *testing.T) {
	invalid := []string{
		"userexample.com",
		"@example.com",
		"user@@example.com",
		"user@",
		"user@localhost",
	}
	for _, email := range invalid {
		ok, err := IsValidEmail(email)
		assert.NoError(t, err, "email: %q", email)
		assert.False(t, ok, "expected invalid: %q", email)
	}
}

func TestIsValidEmail_AllowNoTld(t *testing.T) {
	ok, err := IsValidEmail("user@localhost")
	assert.NoError(t, err)
	assert.False(t, ok, "bare hostname should fail by default")

	ok, err = IsValidEmail("user@localhost", EmailOptions{AllowNoTld: true})
	assert.NoError(t, err)
	assert.True(t, ok, "bare hostname should pass with AllowNoTld=true")
}

func TestIsValidEmail_EmptyInput(t *testing.T) {
	_, err := IsValidEmail("")
	assert.Error(t, err)
}

func TestIsValidEmail_TrimsWhitespace(t *testing.T) {
	ok, err := IsValidEmail("  user@example.com  ")
	assert.NoError(t, err)
	assert.True(t, ok)
}
