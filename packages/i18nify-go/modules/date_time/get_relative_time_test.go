package date_time

import (
	"testing"
	"time"
)

func TestGetRelativeTime(t *testing.T) {
	now := time.Now()

	tests := []struct {
		name        string
		setup       func() (string, string) // returns date and baseDate
		options     *DateTimeOptions
		expected    string
		expectError bool
	}{
		// Seconds tests
		{
			name: "returns correct relative time for seconds - past",
			setup: func() (string, string) {
				date := now.Add(-30 * time.Second)
				return date.Format(time.RFC3339), now.Format(time.RFC3339)
			},
			expected: "30 seconds ago",
		},
		{
			name: "returns correct relative time for seconds - future",
			setup: func() (string, string) {
				date := now.Add(30 * time.Second)
				return date.Format(time.RFC3339), now.Format(time.RFC3339)
			},
			expected: "in 30 seconds",
		},

		// Minutes tests
		{
			name: "returns correct relative time for minutes - past",
			setup: func() (string, string) {
				date := now.Add(-5 * time.Minute)
				return date.Format(time.RFC3339), now.Format(time.RFC3339)
			},
			expected: "5 minutes ago",
		},
		{
			name: "returns correct relative time for minutes - future",
			setup: func() (string, string) {
				date := now.Add(5 * time.Minute)
				return date.Format(time.RFC3339), now.Format(time.RFC3339)
			},
			expected: "in 5 minutes",
		},

		// Hours tests
		{
			name: "returns correct relative time for hours - past",
			setup: func() (string, string) {
				date := now.Add(-2 * time.Hour)
				return date.Format(time.RFC3339), now.Format(time.RFC3339)
			},
			expected: "2 hours ago",
		},
		{
			name: "returns correct relative time for hours - future",
			setup: func() (string, string) {
				date := now.Add(2 * time.Hour)
				return date.Format(time.RFC3339), now.Format(time.RFC3339)
			},
			expected: "in 2 hours",
		},

		// Days tests
		{
			name: "returns correct relative time for days - past",
			setup: func() (string, string) {
				date := now.Add(-3 * 24 * time.Hour)
				return date.Format(time.RFC3339), now.Format(time.RFC3339)
			},
			expected: "3 days ago",
		},
		{
			name: "returns correct relative time for days - future",
			setup: func() (string, string) {
				date := now.Add(3 * 24 * time.Hour)
				return date.Format(time.RFC3339), now.Format(time.RFC3339)
			},
			expected: "in 3 days",
		},

		// Weeks tests
		{
			name: "returns correct relative time for weeks - past",
			setup: func() (string, string) {
				date := now.Add(-2 * 7 * 24 * time.Hour)
				return date.Format(time.RFC3339), now.Format(time.RFC3339)
			},
			expected: "2 weeks ago",
		},
		{
			name: "returns correct relative time for weeks - future",
			setup: func() (string, string) {
				date := now.Add(2 * 7 * 24 * time.Hour)
				return date.Format(time.RFC3339), now.Format(time.RFC3339)
			},
			expected: "in 2 weeks",
		},

		// Months tests
		{
			name: "returns correct relative time for months - past",
			setup: func() (string, string) {
				date := now.Add(-3 * 30 * 24 * time.Hour)
				return date.Format(time.RFC3339), now.Format(time.RFC3339)
			},
			expected: "3 months ago",
		},
		{
			name: "returns correct relative time for months - future",
			setup: func() (string, string) {
				date := now.Add(3 * 30 * 24 * time.Hour)
				return date.Format(time.RFC3339), now.Format(time.RFC3339)
			},
			expected: "in 3 months",
		},

		// Years tests
		{
			name: "returns correct relative time for years - past",
			setup: func() (string, string) {
				date := now.Add(-365 * 24 * time.Hour)
				return date.Format(time.RFC3339), now.Format(time.RFC3339)
			},
			expected: "1 Year ago",
		},
		{
			name: "returns correct relative time for years - future",
			setup: func() (string, string) {
				date := now.Add(365 * 24 * time.Hour)
				return date.Format(time.RFC3339), now.Format(time.RFC3339)
			},
			expected: "in 1 Year",
		},

		// Error cases
		{
			name: "throws error for invalid date input",
			setup: func() (string, string) {
				return "invalid-date", now.Format(time.RFC3339)
			},
			expectError: true,
		},

		// Locale tests
		{
			name: "handles different locales - en-US",
			setup: func() (string, string) {
				date := now.Add(-24 * time.Hour)
				return date.Format(time.RFC3339), now.Format(time.RFC3339)
			},
			expected: "1 Day ago",
		},
		// locale to be supported later
		//{
		//	name: "handles different locales - fr-FR",
		//	setup: func() (string, string) {
		//		date := now.Add(-24 * time.Hour)
		//		return date.Format(time.RFC3339), now.Format(time.RFC3339)
		//	},
		//	options: &DateTimeOptions{
		//		Locale: "fr-FR",
		//	},
		//	expected: "il y a 1 jour",
		//},

		// Undefined options test
		{
			name: "returns correct relative time for days with undefined options",
			setup: func() (string, string) {
				date := now.Add(-3 * 24 * time.Hour)
				return date.Format(time.RFC3339), now.Format(time.RFC3339)
			},
			options:  nil,
			expected: "3 days ago",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			date, baseDate := tt.setup()
			options := DateTimeOptions{
				BaseDate: baseDate,
			}

			result, err := GetRelativeTime(date, options)

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
				t.Errorf("got %q, want %q", result, tt.expected)
			}
		})
	}
}
