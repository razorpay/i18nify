package geo

import (
	"fmt"
	"sort"
	"strconv"
	"strings"
)

// DetectLocaleOptions holds the available locale detection signals.
// At least one field must be non-empty. Signals are tried in priority order:
// CountryCode → AcceptLanguage → BrowserLocale → Currency.
type DetectLocaleOptions struct {
	CountryCode    string
	Currency       string
	AcceptLanguage string
	BrowserLocale  string
}

// DetectLocale resolves a BCP 47 locale string from one or more signals.
//
// Priority: CountryCode → AcceptLanguage → BrowserLocale → Currency.
//
// Example:
//
//	DetectLocale(DetectLocaleOptions{CountryCode: "IN"})                     // → "en_IN", nil
//	DetectLocale(DetectLocaleOptions{AcceptLanguage: "en-US,en;q=0.9"})     // → "en-US", nil
//	DetectLocale(DetectLocaleOptions{BrowserLocale: "de-DE"})               // → "de-DE", nil
//	DetectLocale(DetectLocaleOptions{Currency: "INR"})                      // → "en_IN", nil
func DetectLocale(opts DetectLocaleOptions) (string, error) {
	if opts.CountryCode == "" && opts.Currency == "" && opts.AcceptLanguage == "" && opts.BrowserLocale == "" {
		return "", fmt.Errorf("at least one detection signal must be provided: CountryCode, Currency, AcceptLanguage, or BrowserLocale")
	}

	if cachedCountryMetadata == nil {
		return "", fmt.Errorf("detectLocale: country metadata not loaded")
	}

	meta := cachedCountryMetadata.GetMetadataInformation()

	// Priority 1: CountryCode
	if opts.CountryCode != "" {
		cc := strings.ToUpper(strings.TrimSpace(opts.CountryCode))
		if info, ok := meta[cc]; ok && info.GetDefaultLocale() != "" {
			return info.GetDefaultLocale(), nil
		}
	}

	// Priority 2: AcceptLanguage header
	if opts.AcceptLanguage != "" {
		if locale := parseAcceptLanguageHeader(opts.AcceptLanguage); locale != "" {
			return locale, nil
		}
	}

	// Priority 3: BrowserLocale (already a locale string)
	if trimmed := strings.TrimSpace(opts.BrowserLocale); trimmed != "" {
		return trimmed, nil
	}

	// Priority 4: Currency reverse lookup
	if opts.Currency != "" {
		cu := strings.ToUpper(strings.TrimSpace(opts.Currency))

		// Prefer the ISO currency prefix when it maps back to a country using
		// the same default currency, e.g. USD -> US, INR -> IN.
		if len(cu) >= 2 {
			if info, ok := meta[cu[:2]]; ok && info != nil && strings.ToUpper(info.GetDefaultCurrency()) == cu && info.GetDefaultLocale() != "" {
				return info.GetDefaultLocale(), nil
			}
		}

		matchingLocales := make([]string, 0)
		for _, info := range meta {
			if info != nil && strings.ToUpper(info.GetDefaultCurrency()) == cu && info.GetDefaultLocale() != "" {
				matchingLocales = append(matchingLocales, info.GetDefaultLocale())
			}
		}

		if len(matchingLocales) > 0 {
			sort.Strings(matchingLocales)
			return matchingLocales[0], nil
		}
	}

	return "", fmt.Errorf("could not determine locale from the provided signals")
}

// parseAcceptLanguageHeader parses an RFC 7231 Accept-Language value and
// returns the highest-priority (q-value) locale tag, ignoring wildcards.
func parseAcceptLanguageHeader(header string) string {
	type entry struct {
		locale string
		q      float64
	}
	var entries []entry

	for _, part := range strings.Split(header, ",") {
		part = strings.TrimSpace(part)
		if part == "" {
			continue
		}
		idx := strings.Index(part, ";q=")
		var locale string
		var q float64
		if idx == -1 {
			locale = strings.TrimSpace(part)
			q = 1.0
		} else {
			locale = strings.TrimSpace(part[:idx])
			parsed, err := strconv.ParseFloat(strings.TrimSpace(part[idx+3:]), 64)
			if err != nil {
				continue
			}
			q = parsed
		}
		if locale == "" || locale == "*" {
			continue
		}
		entries = append(entries, entry{locale: locale, q: q})
	}

	if len(entries) == 0 {
		return ""
	}
	sort.Slice(entries, func(i, j int) bool { return entries[i].q > entries[j].q })
	return entries[0].locale
}
