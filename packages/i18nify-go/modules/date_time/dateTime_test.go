package date_time

import (
	"testing"
	"time"
)

// Additional test for date parsing functionality
func TestParseDateTime(t *testing.T) {
	tests := []struct {
		name        string
		input       string
		expectError bool
	}{
		{
			name:  "parses RFC3339",
			input: time.Now().Format(time.RFC3339),
		},
		{
			name:  "parses ISO format",
			input: "2024-01-02T15:04:05",
		},
		{
			name:  "parses date only",
			input: "2024-01-02",
		},
		{
			name:        "fails on invalid format",
			input:       "invalid-date",
			expectError: true,
		},
		{
			name:        "fails on empty string",
			input:       "",
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := convertToStandardDate(tt.input)
			if tt.expectError && err == nil {
				t.Error("expected error but got none")
			}
			if !tt.expectError && err != nil {
				t.Errorf("unexpected error: %v", err)
			}
		})
	}
}

func TestStringToDate(t *testing.T) {
	dateStr := "2024-12-16 10:30:00"
	layout := "2006-01-02 15:04:05"

	// Positive case
	parsedDate, err := StringToDate(dateStr)
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}
	if parsedDate.Format(layout) != dateStr {
		t.Errorf("expected '%s', got '%s'", dateStr, parsedDate.Format(layout))
	}

	// Negative case
	_, err = StringToDate("not-a-date")
	if err == nil {
		t.Error("expected an error for invalid date string")
	}
}
