package locale

import (
	"os"
	"testing"
)

// setEnv sets one or more LANG-related env vars for the duration of a test
// and restores them in t.Cleanup.
func setEnv(t *testing.T, key, val string) {
	t.Helper()
	prev, existed := os.LookupEnv(key)
	if err := os.Setenv(key, val); err != nil {
		t.Fatalf("setenv %s: %v", key, err)
	}
	t.Cleanup(func() {
		if existed {
			_ = os.Setenv(key, prev)
		} else {
			_ = os.Unsetenv(key)
		}
	})
}

func unsetEnv(t *testing.T, key string) {
	t.Helper()
	prev, existed := os.LookupEnv(key)
	_ = os.Unsetenv(key)
	t.Cleanup(func() {
		if existed {
			_ = os.Setenv(key, prev)
		}
	})
}

func TestResolveLocale(t *testing.T) {
	// Ensure a clean env baseline for every sub-test
	for _, ev := range []string{"LC_ALL", "LC_MESSAGES", "LANG"} {
		unsetEnv(t, ev)
	}

	t.Run("Priority 1 — explicit Locale option", func(t *testing.T) {
		got := ResolveLocale(ResolveLocaleOptions{Locale: "fr-FR"})
		if got != "fr-FR" {
			t.Errorf("got %q, want %q", got, "fr-FR")
		}
	})

	t.Run("Locale option trims whitespace", func(t *testing.T) {
		got := ResolveLocale(ResolveLocaleOptions{Locale: "  de-DE  "})
		if got != "de-DE" {
			t.Errorf("got %q, want %q", got, "de-DE")
		}
	})

	t.Run("Explicit Locale beats OS env", func(t *testing.T) {
		setEnv(t, "LANG", "pt_BR.UTF-8")
		got := ResolveLocale(ResolveLocaleOptions{Locale: "es-ES"})
		if got != "es-ES" {
			t.Errorf("got %q, want %q", got, "es-ES")
		}
	})

	t.Run("Priority 2 — LANG env variable", func(t *testing.T) {
		setEnv(t, "LANG", "en_US.UTF-8")
		got := ResolveLocale(ResolveLocaleOptions{})
		if got != "en_US" {
			t.Errorf("got %q, want %q", got, "en_US")
		}
	})

	t.Run("Priority 2 — LC_ALL beats LANG", func(t *testing.T) {
		setEnv(t, "LANG", "en_US.UTF-8")
		setEnv(t, "LC_ALL", "ja_JP.UTF-8")
		got := ResolveLocale(ResolveLocaleOptions{})
		if got != "ja_JP" {
			t.Errorf("got %q, want %q", got, "ja_JP")
		}
	})

	t.Run("Priority 2 — charset suffix stripped", func(t *testing.T) {
		setEnv(t, "LANG", "zh_CN.UTF-8")
		got := ResolveLocale(ResolveLocaleOptions{})
		if got != "zh_CN" {
			t.Errorf("got %q, want %q", got, "zh_CN")
		}
	})

	t.Run("Priority 2 — skips C locale", func(t *testing.T) {
		setEnv(t, "LANG", "C")
		got := ResolveLocale(ResolveLocaleOptions{FallbackLocale: "en-US"})
		if got != "en-US" {
			t.Errorf("got %q, want %q", got, "en-US")
		}
	})

	t.Run("Priority 2 — skips POSIX locale", func(t *testing.T) {
		setEnv(t, "LANG", "POSIX")
		got := ResolveLocale(ResolveLocaleOptions{FallbackLocale: "en-GB"})
		if got != "en-GB" {
			t.Errorf("got %q, want %q", got, "en-GB")
		}
	})

	t.Run("Priority 3 — custom FallbackLocale", func(t *testing.T) {
		got := ResolveLocale(ResolveLocaleOptions{FallbackLocale: "ja"})
		if got != "ja" {
			t.Errorf("got %q, want %q", got, "ja")
		}
	})

	t.Run("Priority 3 — defaults to 'en' when FallbackLocale is empty", func(t *testing.T) {
		got := ResolveLocale(ResolveLocaleOptions{})
		if got != "en" {
			t.Errorf("got %q, want %q", got, "en")
		}
	})

	t.Run("Priority 3 — defaults to 'en' when FallbackLocale is whitespace", func(t *testing.T) {
		got := ResolveLocale(ResolveLocaleOptions{FallbackLocale: "   "})
		if got != "en" {
			t.Errorf("got %q, want %q", got, "en")
		}
	})

	t.Run("Never returns empty string", func(t *testing.T) {
		got := ResolveLocale(ResolveLocaleOptions{})
		if got == "" {
			t.Error("got empty string, want non-empty locale")
		}
	})
}
