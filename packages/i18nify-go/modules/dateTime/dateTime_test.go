package dateTime

import (
	"testing"
	"time"
)

func TestFormatDateTime(t *testing.T) {
	tests := []struct {
		name      string
		date      string
		options   *FormatDateTimeOptions
		want      string
		expectErr bool
	}{
		{
			name:      "Valid date with dateOnly mode",
			date:      "2024-01-01T12:00:00",
			options:   &FormatDateTimeOptions{DateTimeMode: "dateOnly"},
			want:      "1/1/2024",
			expectErr: false,
		},
		{
			name:      "Valid date with timeOnly mode 24-hour clock",
			date:      "2024-01-01T23:59:59",
			options:   &FormatDateTimeOptions{DateTimeMode: "timeOnly", Hour12: new(bool)},
			want:      "23:59:59",
			expectErr: false,
		},
		{
			name: "Valid date with timeOnly mode 12-hour clock",
			date: "2024-01-01T23:59:59Z",
			options: &FormatDateTimeOptions{
				DateTimeMode: "timeOnly",
				Hour12:       func() *bool { b := true; return &b }(),
			},
			want:      "11:59:59 PM",
			expectErr: false,
		},
		{
			name:      "Valid date with dateTime mode and 24-hour clock",
			date:      "2024-01-01T12:00:00Z",
			options:   &FormatDateTimeOptions{DateTimeMode: "dateTime"},
			want:      "1/1/2024, 12:00:00 PM",
			expectErr: false,
		},
		{
			name: "Valid date with dateTime mode and 12-hour clock",
			date: "2024-12-31T23:59:59",
			options: &FormatDateTimeOptions{
				DateTimeMode: "dateTime",
				Hour12:       func() *bool { b := true; return &b }(),
				Locale:       "en-US",
			},
			want:      "12/31/2024, 11:59:59 PM",
			expectErr: false,
		},
		{
			name:      "Invalid date format",
			date:      "invalid-date",
			options:   &FormatDateTimeOptions{DateTimeMode: "dateTime"},
			want:      "",
			expectErr: true,
		},
		{
			name:      "Default mode with valid date",
			date:      "2024-01-01T12:00:00Z",
			options:   nil,
			want:      "1/1/2024",
			expectErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var formatOptions *FormatOptions
			if tt.options != nil {
				formatOptions = &FormatOptions{
					Locale:       tt.options.Locale,
					DateTimeMode: DateTimeMode(tt.options.DateTimeMode),
					IntlOptions:  make(map[string]interface{}),
				}
				if tt.options.Hour12 != nil {
					formatOptions.IntlOptions["hour12"] = *tt.options.Hour12
				}
			}
			got, err := FormatDateTime(tt.date, formatOptions)
			if err != nil {
				if !tt.expectErr {
					t.Errorf("Did not expect error but got %v in  %s", err, tt.name)
				}
			}
			if got != tt.want {
				t.Errorf("FormatDateTime() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestGetRelativeTime(t *testing.T) {
	baseDate := time.Date(2024, 12, 16, 10, 30, 0, 0, time.UTC)
	earlierDate := baseDate.Add(-2 * time.Hour)
	laterDate := baseDate.Add(3 * 24 * time.Hour)

	// Positive case
	relativeTime := GetRelativeTime(earlierDate, baseDate)
	if relativeTime != "2 hours ago" {
		t.Errorf("expected '2 hours ago', got '%s'", relativeTime)
	}

	relativeTime = GetRelativeTime(laterDate, baseDate)
	if relativeTime != "3 days ago" {
		t.Errorf("expected '3 days ago', got '%s'", relativeTime)
	}
}

func TestGetWeekdays(t *testing.T) {
	weekdays := GetWeekdays()
	expectedWeekdays := []string{"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"}

	for i, weekday := range weekdays {
		if weekday != expectedWeekdays[i] {
			t.Errorf("expected '%s', got '%s'", expectedWeekdays[i], weekday)
		}
	}
}

func TestParseDateTime(t *testing.T) {
	dateStr := "2024-12-16 10:30:00"
	layout := "2006-01-02 15:04:05"

	// Positive case
	parsedDate, err := ParseDateTime(dateStr, layout)
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}
	if parsedDate.Year() != 2024 || parsedDate.Month() != 12 || parsedDate.Day() != 16 {
		t.Errorf("parsed date does not match expected date: %v", parsedDate)
	}

	// Negative case
	_, err = ParseDateTime("invalid-date", layout)
	if err == nil {
		t.Error("expected an error for invalid date string")
	}
}

func TestStringToDate(t *testing.T) {
	dateStr := "2024-12-16 10:30:00"
	layout := "2006-01-02 15:04:05"

	// Positive case
	parsedDate, err := StringToDate(dateStr, layout)
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}
	if parsedDate.Format(layout) != dateStr {
		t.Errorf("expected '%s', got '%s'", dateStr, parsedDate.Format(layout))
	}

	// Negative case
	_, err = StringToDate("not-a-date", layout)
	if err == nil {
		t.Error("expected an error for invalid date string")
	}
}
