package names

import (
	"regexp"
)

func ValidateName(name string) bool {
	// Ensure rules are loaded
	regex := regexp.MustCompile(`^[\p{L}\s\-.\/']+$`)
	return regex.MatchString(name)
}
