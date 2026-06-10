package locale

import (
	"os"
	"strings"
)

// ResolveLocaleOptions configures the locale resolution priority chain.
type ResolveLocaleOptions struct {
	// Locale is an explicit locale preference — the "options" layer.
	// Corresponds to the options layer in the client-side priority chain.
	Locale string

	// FallbackLocale is returned when no higher-priority signal resolves.
	// Defaults to "en" when empty.
	FallbackLocale string
}

// ResolveLocale resolves a BCP 47 locale string by walking a priority chain.
//
// The server-side chain maps the four client-side layers as follows:
//
//	Client-side    → Go equivalent
//	───────────────────────────────────────────────────────────────
//	storage        → (not applicable — no localStorage in Go)
//	options        → ResolveLocaleOptions.Locale
//	browser        → LC_ALL / LC_MESSAGES / LANG environment variables
//	fallback       → ResolveLocaleOptions.FallbackLocale (default: "en")
//
// POSIX charset suffixes are stripped: "en_US.UTF-8" → "en_US".
// "C" and "POSIX" locale values are treated as absent.
// The function always returns a non-empty string — it never errors.
//
// Example:
//
//	ResolveLocale(ResolveLocaleOptions{Locale: "fr-FR"})
//	// → "fr-FR"
//
//	ResolveLocale(ResolveLocaleOptions{FallbackLocale: "ja"})
//	// → value of LANG env, or "ja" if LANG is unset
//
//	ResolveLocale(ResolveLocaleOptions{})
//	// → value of LANG env, or "en" if LANG is unset
func ResolveLocale(opts ResolveLocaleOptions) string {
	// Priority 1: explicit locale option (corresponds to "options" layer)
	if trimmed := strings.TrimSpace(opts.Locale); trimmed != "" {
		return trimmed
	}

	// Priority 2: OS locale environment variables (corresponds to "browser" layer)
	for _, envVar := range []string{"LC_ALL", "LC_MESSAGES", "LANG"} {
		val := strings.TrimSpace(os.Getenv(envVar))
		if val == "" || val == "C" || val == "POSIX" {
			continue
		}
		// Strip charset suffix: "en_US.UTF-8" → "en_US"
		if dot := strings.IndexByte(val, '.'); dot != -1 {
			val = val[:dot]
		}
		return val
	}

	// Priority 3: fallback
	if fallback := strings.TrimSpace(opts.FallbackLocale); fallback != "" {
		return fallback
	}
	return "en"
}
