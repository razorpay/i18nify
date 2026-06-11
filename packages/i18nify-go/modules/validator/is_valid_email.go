package validator

import (
	"fmt"
	"regexp"
	"strings"
)

// emailRegex is the W3C HTML Living Standard §4.10.1.1 valid e-mail address
// pattern. Allows bare domains (user@localhost).
// emailRegexRequireTLD additionally requires at least one dot after "@",
// enforcing a TLD-like segment (rejects user@localhost).
var (
	emailRegex           *regexp.Regexp
	emailRegexRequireTLD *regexp.Regexp
)

func init() {
	// The local-part character class includes a backtick which cannot appear
	// inside a Go raw string literal, so we build the pattern with concatenation.
	localPart := `[a-zA-Z0-9.!#$%&'*+/=?^_` + "`" + `{|}~-]+`
	domainLabel := `[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?`
	emailRegex = regexp.MustCompile(
		`^` + localPart + `@` + domainLabel + `(?:\.` + domainLabel + `)*$`,
	)
	emailRegexRequireTLD = regexp.MustCompile(
		`^` + localPart + `@` + domainLabel + `(?:\.` + domainLabel + `)+$`,
	)
}

// EmailValidationOptions configures IsValidEmail behaviour.
type EmailValidationOptions struct {
	// AllowNoTld uses a looser pattern that accepts bare domains like user@localhost.
	AllowNoTld bool
}

// IsValidEmail reports whether email is a valid e-mail address.
// By default it requires a TLD-like segment (rejects user@localhost).
// Pass AllowNoTld: true to accept bare domains.
func IsValidEmail(email string, opts *EmailValidationOptions) (bool, error) {
	if strings.TrimSpace(email) == "" {
		return false, fmt.Errorf("validator: IsValidEmail: email must be a non-empty string")
	}
	pattern := emailRegexRequireTLD
	if opts != nil && opts.AllowNoTld {
		pattern = emailRegex
	}
	return pattern.MatchString(strings.TrimSpace(email)), nil
}
