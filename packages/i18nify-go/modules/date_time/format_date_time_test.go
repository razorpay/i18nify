package date_time

import (
	"testing"
	"time"
)

func TestFormatDateTime(t *testing.T) {
	now := time.Now()

	// Helper function to create hour12 option
	hour12True := true
	hour12False := false

	tests := []struct {
		name        string
		dateStr     string
		options     *DateTimeOptions
		expected    string
		expectError bool
	}{
		// Date Time Mode Tests
		{
			name:    "formats full date time with 12-Hour format",
			dateStr: "2025-01-23T14:36:23+05:30",
			options: &DateTimeOptions{
				DateTimeMode: DateTimeMode,
				IntlOptions: &IntlOptions{
					Hour12: &hour12True,
					Locale: "IST",
				},
			},
			expected: "1/23/2025, 2:36:23 PM IST",
		},
		{
			name:    "formats full date time with 24-Hour format",
			dateStr: now.Format(time.RFC3339),
			options: &DateTimeOptions{
				DateTimeMode: DateTimeMode,
				IntlOptions: &IntlOptions{
					Hour12: &hour12False,
				},
			},
			expected: now.Format("1/2/2006, 15:04:05"),
		},

		// Date Only Mode Tests
		{
			name:    "formats date only",
			dateStr: now.Format(time.RFC3339),
			options: &DateTimeOptions{
				DateTimeMode: DateOnlyMode,
			},
			expected: now.Format("1/2/2006"),
		},
		{
			name:     "defaults to date only mode when mode not specified",
			dateStr:  now.Format(time.RFC3339),
			options:  &DateTimeOptions{},
			expected: now.Format("1/2/2006"),
		},

		// Time Only Mode Tests
		{
			name:    "formats time only with 12-Hour format",
			dateStr: now.Format(time.RFC3339),
			options: &DateTimeOptions{
				DateTimeMode: TimeOnlyMode,
				IntlOptions: &IntlOptions{
					Hour12: &hour12True,
				},
			},
			expected: now.Format("3:04:05 PM"),
		},
		{
			name:    "formats time only with 24-Hour format",
			dateStr: now.Format(time.RFC3339),
			options: &DateTimeOptions{
				DateTimeMode: TimeOnlyMode,
				IntlOptions: &IntlOptions{
					Hour12: &hour12False,
				},
			},
			expected: now.Format("15:04:05"),
		},

		// Default Options Tests
		{
			name:     "handles nil options",
			dateStr:  now.Format(time.RFC3339),
			options:  nil,
			expected: now.Format("1/2/2006"),
		},

		// Error Cases
		{
			name:        "returns error for invalid date string",
			dateStr:     "invalid-date",
			options:     nil,
			expectError: true,
		},

		// Locale Tests
		{
			name:    "handles en-US locale",
			dateStr: now.Format(time.RFC3339),
			options: &DateTimeOptions{
				DateTimeMode: DateOnlyMode,
			},
			expected: now.Format("1/2/2006"),
		},
		{
			name:    "check Hour12 structure for dateTime",
			dateStr: "2024-01-01T12:00:00",
			options: &DateTimeOptions{
				DateTimeMode: DateTimeMode,
				IntlOptions: &IntlOptions{
					Hour12: boolPtr(hour12True),
				},
			},
			expected: "1/1/2024, 12:00:00 PM",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := FormatDateTime(tt.dateStr, tt.options)

			// Check error cases
			if tt.expectError {
				if err == nil {
					t.Error("expected error but got none")
				}
				return
			}

			if err != nil {
				t.Errorf("unexpected error: %v", err)
				return
			}

			if result != tt.expected {
				t.Errorf("got %v, want %v", result, tt.expected)
			}
		})
	}
}

// Test specific formatting functions
func TestFormatDateOnly(t *testing.T) {
	now := time.Now()
	result := formatDateOnly(now, &DateTimeOptions{})
	expected := now.Format("1/2/2006")

	if result != expected {
		t.Errorf("formatDateOnly() = %v, want %v", result, expected)
	}
}

func TestFormatTimeOnly(t *testing.T) {
	now := time.Now()

	tests := []struct {
		name     string
		hour12   *bool
		expected string
	}{
		{
			name:     "12-Hour format",
			hour12:   boolPtr(true),
			expected: now.Format("3:04:05 PM"),
		},
		{
			name:     "24-Hour format",
			hour12:   boolPtr(false),
			expected: now.Format("15:04:05"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			options := &DateTimeOptions{
				IntlOptions: &IntlOptions{
					Hour12: tt.hour12,
				},
			}
			result := formatTimeOnly(now, options)
			if result != tt.expected {
				t.Errorf("formatTimeOnly() = %v, want %v", result, tt.expected)
			}
		})
	}
}

// Helper function to create bool pointer
func boolPtr(b bool) *bool {
	return &b
}
