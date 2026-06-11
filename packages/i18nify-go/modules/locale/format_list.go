package locale

import (
	"fmt"
	"strings"
)

var conjunctions = map[string]string{
	"en": "and", "fr": "et", "de": "und", "es": "y", "pt": "e",
	"it": "e", "nl": "en", "ja": "と", "zh": "和", "ko": "및",
	"hi": "और", "ar": "و", "ru": "и", "pl": "i", "sv": "och",
	"no": "og", "da": "og", "fi": "ja", "tr": "ve",
}

var disjunctions = map[string]string{
	"en": "or", "fr": "ou", "de": "oder", "es": "o", "pt": "ou",
	"it": "o", "nl": "of", "ja": "か", "zh": "或者", "ko": "또는",
	"hi": "या", "ar": "أو", "ru": "или", "pl": "lub", "sv": "eller",
	"no": "eller", "da": "eller", "fi": "tai", "tr": "veya",
}

// FormatListOptions configures FormatList behaviour.
type FormatListOptions struct {
	Locale      string           // BCP 47 locale tag; defaults to "en"
	Type        string           // "conjunction" (and) or "disjunction" (or); defaults to "conjunction"
	MaxItems    int              // 0 = no limit; N = show first N items then "M others"
	OthersLabel func(int) string // label for hidden items; nil = default "N others" / "1 other"
}

// FormatList joins items into a locale-aware grammatical list.
// Only English applies an Oxford comma; all other locales omit it.
//
// Example:
//
//	FormatList([]string{"UPI", "Card", "Wallet"}, FormatListOptions{Locale: "en"})
//	// → "UPI, Card, and Wallet"
//
//	FormatList([]string{"A", "B", "C", "D"}, FormatListOptions{Locale: "en", MaxItems: 2})
//	// → "A, B, and 2 others"
func FormatList(items []string, opts FormatListOptions) (string, error) {
	if len(items) == 0 {
		return "", nil
	}

	locale := opts.Locale
	if locale == "" {
		locale = "en"
	}
	lang := baseLang(locale)

	listType := opts.Type
	if listType == "" {
		listType = "conjunction"
	}
	if listType != "conjunction" && listType != "disjunction" {
		return "", fmt.Errorf("type must be \"conjunction\" or \"disjunction\", got %q", listType)
	}

	display := items
	if opts.MaxItems > 0 && len(items) > opts.MaxItems {
		hidden := len(items) - opts.MaxItems
		label := defaultOthersLabel(hidden)
		if opts.OthersLabel != nil {
			label = opts.OthersLabel(hidden)
		}
		display = append(append([]string{}, items[:opts.MaxItems]...), label)
	}

	var wordMap map[string]string
	if listType == "conjunction" {
		wordMap = conjunctions
	} else {
		wordMap = disjunctions
	}

	word, ok := wordMap[lang]
	if !ok {
		word = wordMap["en"]
		lang = "en" // apply full English rules (Oxford comma) on fallback
	}

	n := len(display)
	switch n {
	case 1:
		return display[0], nil
	case 2:
		return display[0] + " " + word + " " + display[1], nil
	default:
		// Oxford comma for English only
		prefix := strings.Join(display[:n-1], ", ")
		if lang == "en" {
			return prefix + ", " + word + " " + display[n-1], nil
		}
		return prefix + " " + word + " " + display[n-1], nil
	}
}

func baseLang(locale string) string {
	if idx := strings.IndexAny(locale, "-_"); idx != -1 {
		return strings.ToLower(locale[:idx])
	}
	return strings.ToLower(locale)
}

func defaultOthersLabel(n int) string {
	if n == 1 {
		return "1 other"
	}
	return fmt.Sprintf("%d others", n)
}
