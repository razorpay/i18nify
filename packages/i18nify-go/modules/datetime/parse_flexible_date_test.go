package datetime

import (
	"testing"
	"time"
)

func TestParseFlexibleDate(t *testing.T) {
	previousLocal := time.Local
	time.Local = time.UTC
	defer func() {
		time.Local = previousLocal
	}()

	t.Run("parses time.Time input", func(t *testing.T) {
		input := time.Date(2024, time.January, 15, 10, 30, 45, 0, time.UTC)
		result, err := ParseFlexibleDate(input)
		if err != nil {
			t.Fatalf("expected no error, got %v", err)
		}

		if result.Year != 2024 || result.Month != 1 || result.Day != 15 {
			t.Fatalf("unexpected parsed date: %+v", result)
		}
	})

	t.Run("parses millisecond timestamp input", func(t *testing.T) {
		result, err := ParseFlexibleDate(int64(1609459200000))
		if err != nil {
			t.Fatalf("expected no error, got %v", err)
		}

		if result.Year != 2021 || result.Month != 1 || result.Day != 1 {
			t.Fatalf("unexpected parsed date: %+v", result)
		}
	})

	t.Run("parses supported string layouts", func(t *testing.T) {
		result, err := ParseFlexibleDate("2024-01-15")
		if err != nil {
			t.Fatalf("expected no error, got %v", err)
		}

		if result.Day != 15 {
			t.Fatalf("unexpected parsed date: %+v", result)
		}
	})

	t.Run("rejects invalid input", func(t *testing.T) {
		if _, err := ParseFlexibleDate(""); err == nil {
			t.Fatal("expected error for empty input")
		}

		if _, err := ParseFlexibleDate("not-a-date"); err == nil {
			t.Fatal("expected error for invalid date string")
		}
	})
}
