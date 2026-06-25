package datetime

import "testing"

func TestFormatFromUnix(t *testing.T) {
	t.Run("formats UTC time with en-US layout", func(t *testing.T) {
		result, err := FormatFromUnix(0)
		if err != nil {
			t.Fatalf("expected no error, got %v", err)
		}

		if result != "1/1/1970, 12:00:00 AM" {
			t.Fatalf("unexpected result: %s", result)
		}
	})

	t.Run("applies timezone conversion", func(t *testing.T) {
		result, err := FormatFromUnix(0, FormatFromUnixOptions{Timezone: "America/New_York"})
		if err != nil {
			t.Fatalf("expected no error, got %v", err)
		}

		if result != "12/31/1969, 7:00:00 PM" {
			t.Fatalf("unexpected result: %s", result)
		}
	})

	t.Run("rejects invalid timezones", func(t *testing.T) {
		if _, err := FormatFromUnix(0, FormatFromUnixOptions{Timezone: "Not/A/Timezone"}); err == nil {
			t.Fatal("expected an error for an invalid timezone")
		}
	})
}
