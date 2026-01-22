package i18nify

import (
	"testing"
)

func TestFormatCurrency(t *testing.T) {
	c := &CurrencyInformation{}

	tests := []struct {
		name     string
		amount   float64
		locale   string
		wantErr  bool
		validate func(t *testing.T, result string)
	}{
		{
			name:    "valid locale en-US with positive amount",
			amount:  1234.56,
			locale:  "en-US",
			wantErr: false,
			validate: func(t *testing.T, result string) {
				if result == "" {
					t.Error("expected non-empty result")
				}
				// Should format with 2 decimal places
				if len(result) < 1 {
					t.Errorf("result should contain formatted number, got: %s", result)
				}
			},
		},
		{
			name:    "valid locale en with integer amount",
			amount:  1000.0,
			locale:  "en",
			wantErr: false,
			validate: func(t *testing.T, result string) {
				if result == "" {
					t.Error("expected non-empty result")
				}
			},
		},
		{
			name:    "valid locale de-DE with decimal amount",
			amount:  99.99,
			locale:  "de-DE",
			wantErr: false,
			validate: func(t *testing.T, result string) {
				if result == "" {
					t.Error("expected non-empty result")
				}
			},
		},
		{
			name:    "zero amount",
			amount:  0.0,
			locale:  "en-US",
			wantErr: false,
			validate: func(t *testing.T, result string) {
				if result == "" {
					t.Error("expected non-empty result for zero amount")
				}
			},
		},
		{
			name:    "negative amount",
			amount:  -100.50,
			locale:  "en-US",
			wantErr: false,
			validate: func(t *testing.T, result string) {
				if result == "" {
					t.Error("expected non-empty result for negative amount")
				}
			},
		},
		{
			name:    "large amount",
			amount:  999999.99,
			locale:  "en-US",
			wantErr: false,
			validate: func(t *testing.T, result string) {
				if result == "" {
					t.Error("expected non-empty result for large amount")
				}
			},
		},
		{
			name:    "amount with many decimal places",
			amount:  123.456789,
			locale:  "en-US",
			wantErr: false,
			validate: func(t *testing.T, result string) {
				if result == "" {
					t.Error("expected non-empty result")
				}
			},
		},
		{
			name:    "invalid locale",
			amount:  100.0,
			locale:  "invalid-locale-xyz",
			wantErr: true,
			validate: func(t *testing.T, result string) {
				if result != "" {
					t.Errorf("expected empty result for invalid locale, got: %s", result)
				}
			},
		},
		{
			name:    "empty locale",
			amount:  100.0,
			locale:  "",
			wantErr: true,
			validate: func(t *testing.T, result string) {
				if result != "" {
					t.Errorf("expected empty result for empty locale, got: %s", result)
				}
			},
		},
		{
			name:    "valid locale fr-FR",
			amount:  1234.56,
			locale:  "fr-FR",
			wantErr: false,
			validate: func(t *testing.T, result string) {
				if result == "" {
					t.Error("expected non-empty result")
				}
			},
		},
		{
			name:    "valid locale ja-JP",
			amount:  1000.00,
			locale:  "ja-JP",
			wantErr: false,
			validate: func(t *testing.T, result string) {
				if result == "" {
					t.Error("expected non-empty result")
				}
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := c.FormatCurrency(tt.amount, tt.locale)

			if (err != nil) != tt.wantErr {
				t.Errorf("FormatCurrency() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if tt.validate != nil {
				tt.validate(t, result)
			}
		})
	}
}

