package datetime

import "fmt"

// GetOrdinalSuffix returns the English ordinal suffix for n: "st", "nd", "rd", or "th".
//
// The teen exception applies: 11, 12, and 13 always return "th" regardless of
// the last digit (e.g. 111 -> "th", 112 -> "th", 113 -> "th").
// Returns an error when n < 1.
func GetOrdinalSuffix(n int) (string, error) {
	if n < 1 {
		return "", fmt.Errorf("getOrdinalSuffix: n must be a positive integer, got %d", n)
	}

	lastTwo := n % 100
	if lastTwo >= 11 && lastTwo <= 13 {
		return "th", nil
	}

	switch n % 10 {
	case 1:
		return "st", nil
	case 2:
		return "nd", nil
	case 3:
		return "rd", nil
	default:
		return "th", nil
	}
}
