// Package validator provides general-purpose input validation utilities:
// RFC 5322 / W3C HTML5 email address checking and ISO/IEC 7812-1 Luhn card number checking.
package validator

import (
	"fmt"
	"regexp"
	"strings"
)

// emailRegex is the W3C HTML Living Standard valid e-mail address pattern.
// Source: https://html.spec.whatwg.org/#valid-e-mail-address
var emailRegex = regexp.MustCompile(
	`^[a-zA-Z0-9.!#$%&'*+/=?^_` + "`" + `{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$`,
)

// emailRegexRequireTLD additionally requires at least one dot after "@",
// rejecting bare hostnames such as "user@localhost".
var emailRegexRequireTLD = regexp.MustCompile(
	`^[a-zA-Z0-9.!#$%&'*+/=?^_` + "`" + `{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$`,
)

// EmailOptions tunes IsValidEmail behaviour.
type EmailOptions struct {
	// AllowNoTld permits addresses without a dot-separated TLD (e.g. "user@localhost").
	// Default: false — a TLD segment is required.
	AllowNoTld bool
}

// IsValidEmail reports whether email is a well-formed e-mail address.
// By default a TLD segment is required; set AllowNoTld to permit bare hostnames.
// Returns an error only when email is empty.
func IsValidEmail(email string, opts ...EmailOptions) (bool, error) {
	if strings.TrimSpace(email) == "" {
		return false, fmt.Errorf("email must be a non-empty string")
	}

	o := EmailOptions{}
	if len(opts) > 0 {
		o = opts[0]
	}

	trimmed := strings.TrimSpace(email)
	if o.AllowNoTld {
		return emailRegex.MatchString(trimmed), nil
	}
	return emailRegexRequireTLD.MatchString(trimmed), nil
}
