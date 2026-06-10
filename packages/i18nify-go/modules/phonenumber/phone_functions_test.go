package phonenumber

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// ---- IsValidPhoneNumber ----

func TestIsValidPhoneNumber(t *testing.T) {
	tests := []struct {
		name        string
		phoneNumber string
		countryCode string
		want        bool
	}{
		// Standard valid numbers
		{"IN valid with dial code", "+917394926646", "IN", true},
		{"MY valid with dial code", "+60123456789", "MY", true},
		// Numbers without leading '+' but valid country code provided
		{"IN valid without dial code", "7394926646", "IN", true},
		// Invalid numbers
		{"IN too short", "1234", "IN", false},
		{"MY too short", "60123", "MY", false},
		// Empty / blank inputs
		{"empty phone", "", "IN", false},
		{"whitespace only", "   ", "IN", false},
		{"plus only", "+", "IN", false},
		{"special chars only", "()- ", "IN", false},
		// Unknown / unsupported country code falls back to detection
		{"invalid CC falls back to detection", "+917394926646", "XX", true},
		{"unknown CC no detection possible", "+999999999999", "XX", false},
		// Explicit unsupported code with no detectable prefix
		{"unsupported CC and bad number", "1234567890", "XYZ", false},
		// Numbers with formatting characters — cleaned before validation
		{"IN with spaces and dashes", "+91-739-492-6646", "IN", true},
		{"IN with parens and spaces", "+91 (739) 492-6646", "IN", true},
		// Valid format but wrong country
		{"valid country code but short number", "+91123", "IN", false},
		// Auto-detect when CC is empty
		{"empty CC auto-detects IN", "+917394926646", "", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := IsValidPhoneNumber(tt.phoneNumber, tt.countryCode)
			assert.Equal(t, tt.want, got)
		})
	}
}

// ---- FormatPhoneNumber ----

func TestFormatPhoneNumber(t *testing.T) {
	tests := []struct {
		name        string
		phoneNumber string
		countryCode string
		want        string
		wantErr     bool
	}{
		{
			name:        "IN standard",
			phoneNumber: "+917394926646",
			countryCode: "IN",
			want:        "+91 7394 926646",
		},
		{
			name:        "MY standard",
			phoneNumber: "+60123456789",
			countryCode: "MY",
			want:        "+60 12 34567 89",
		},
		{
			name:        "US standard",
			phoneNumber: "+15853042806",
			countryCode: "US",
			want:        "+1 585-304-2806",
		},
		{
			name:        "GB standard",
			phoneNumber: "+447123456789",
			countryCode: "GB",
			want:        "+44 7123 456 789",
		},
		{
			name:        "invalid CC auto-detects from number",
			phoneNumber: "+917394926646",
			countryCode: "XYZ",
			want:        "+91 7394 926646",
		},
		{
			name:        "empty CC auto-detects",
			phoneNumber: "+917394926646",
			countryCode: "",
			want:        "+91 7394 926646",
		},
		{
			name:        "no pattern for undetectable number returns cleaned",
			phoneNumber: "+1969123456789",
			countryCode: "",
			want:        "+1969123456789",
		},
		{
			name:        "empty phone returns error",
			phoneNumber: "",
			countryCode: "MY",
			wantErr:     true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := FormatPhoneNumber(tt.phoneNumber, tt.countryCode)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			require.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}

// ---- ParsePhoneNumber ----

func TestParsePhoneNumber(t *testing.T) {
	t.Run("US with explicit country", func(t *testing.T) {
		info, err := ParsePhoneNumber("+15853042806", "US")
		require.NoError(t, err)
		assert.Equal(t, "US", info.CountryCode)
		assert.Equal(t, "+1", info.DialCode)
		assert.Equal(t, "+1 585-304-2806", info.FormattedPhoneNumber)
		assert.Equal(t, "xxx-xxx-xxxx", info.FormatTemplate)
		assert.Equal(t, "5853042806", info.PhoneNumber)
	})

	t.Run("GB auto-detected", func(t *testing.T) {
		info, err := ParsePhoneNumber("+447123456789", "")
		require.NoError(t, err)
		assert.Equal(t, "GB", info.CountryCode)
		assert.Equal(t, "+44", info.DialCode)
		assert.Equal(t, "+44 7123 456 789", info.FormattedPhoneNumber)
		assert.Equal(t, "xxxx xxx xxx", info.FormatTemplate)
		assert.Equal(t, "7123456789", info.PhoneNumber)
	})

	t.Run("IN auto-detected", func(t *testing.T) {
		info, err := ParsePhoneNumber("+917394926646", "")
		require.NoError(t, err)
		assert.Equal(t, "IN", info.CountryCode)
		assert.Equal(t, "+91", info.DialCode)
		assert.Equal(t, "+91 7394 926646", info.FormattedPhoneNumber)
		assert.Equal(t, "xxxx xxxxxx", info.FormatTemplate)
		assert.Equal(t, "7394926646", info.PhoneNumber)
	})

	t.Run("undetectable number returns raw cleaned", func(t *testing.T) {
		info, err := ParsePhoneNumber("+1969123456789", "")
		require.NoError(t, err)
		assert.Equal(t, "", info.CountryCode)
		assert.Equal(t, "", info.DialCode)
		assert.Equal(t, "+1969123456789", info.FormattedPhoneNumber)
		assert.Equal(t, "", info.FormatTemplate)
		assert.Equal(t, "+1969123456789", info.PhoneNumber)
	})

	t.Run("empty phone returns error", func(t *testing.T) {
		_, err := ParsePhoneNumber("", "")
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "phoneNumber")
	})
}

// ---- FormatE164 ----

func TestFormatE164(t *testing.T) {
	tests := []struct {
		name        string
		countryCode string
		phoneNumber string
		want        string
		wantErr     bool
	}{
		// National number input — calling code prepended
		{"IN national number", "IN", "9876543210", "+919876543210", false},
		{"IN with spaces", "IN", "98765 43210", "+919876543210", false},
		{"US national number", "US", "6502530000", "+16502530000", false},
		{"GB national number", "GB", "7911123456", "+447911123456", false},
		{"MY national number", "MY", "123456789", "+60123456789", false},
		// International prefix input — normalised
		{"IN with +91 prefix", "IN", "+91 98765 43210", "+919876543210", false},
		{"US with +1 prefix and dashes", "US", "+1-650-253-0000", "+16502530000", false},
		// Error cases
		{"empty phone", "IN", "", "", true},
		{"empty country code", "", "9876543210", "", true},
		{"unknown country code", "ZZ", "9876543210", "", true},
		{"mismatched prefix", "IN", "+447911123456", "", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := FormatE164(tt.countryCode, tt.phoneNumber)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			require.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}

// ---- internal helpers ----

func TestCleanPhoneNumber(t *testing.T) {
	tests := []struct {
		input string
		want  string
	}{
		{"+91 (739) 492-6646", "+917394926646"},
		{"+91-739-492-6646", "+917394926646"},
		{"917394926646", "917394926646"},
		{"+447123456789", "+447123456789"},
		{"   ", ""},
		{"()- ", ""},
		{"+", "+"},
		{"", ""},
	}
	for _, tt := range tests {
		assert.Equal(t, tt.want, cleanPhoneNumber(tt.input), "input=%q", tt.input)
	}
}

func TestMatchesEntirely(t *testing.T) {
	// IN regex from the data
	inRegex := `(?:000800|[2-9]\d\d)\d{7}|1\d{7,12}`
	assert.True(t, matchesEntirely("7394926646", inRegex))
	assert.False(t, matchesEntirely("1234", inRegex))
	assert.False(t, matchesEntirely("", inRegex))
}

func TestDetectCountryAndDialCodeFromPhone(t *testing.T) {
	tests := []struct {
		phone   string
		wantCC  string
		wantDC  string
	}{
		{"+917394926646", "IN", "+91"},
		{"+447123456789", "GB", "+44"},
		{"+60123456789", "MY", "+60"},
		{"+15853042806", "US", "+1"},
		{"917394926646", "", ""},  // no '+' prefix
		{"+999999999999", "", ""}, // unrecognised
	}
	for _, tt := range tests {
		cc, dc := detectCountryAndDialCodeFromPhone(tt.phone)
		assert.Equal(t, tt.wantCC, cc, "phone=%q", tt.phone)
		assert.Equal(t, tt.wantDC, dc, "phone=%q", tt.phone)
	}
}

// ---- StripDialCode ----

func TestStripDialCode(t *testing.T) {
	tests := []struct {
		name        string
		countryCode string
		phoneNumber string
		want        string
		wantErr     bool
	}{
		// Strips dial code from E.164 numbers
		{"IN E.164", "IN", "+919876543210", "9876543210", false},
		{"US E.164", "US", "+16502530000", "6502530000", false},
		{"GB E.164", "GB", "+447911123456", "7911123456", false},
		{"IN with spaces", "IN", "+91 98765 43210", "9876543210", false},
		{"US with dashes", "US", "+1-650-253-0000", "6502530000", false},
		// National number passthrough (no '+' prefix)
		{"IN already national", "IN", "9876543210", "9876543210", false},
		{"US already national", "US", "6502530000", "6502530000", false},
		// Error cases
		{"mismatched +prefix", "IN", "+447911123456", "", true},
		{"empty phone", "IN", "", "", true},
		{"empty countryCode", "", "+919876543210", "", true},
		{"unknown countryCode", "ZZ", "+919876543210", "", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := StripDialCode(tt.countryCode, tt.phoneNumber)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			require.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}

// ---- PrependDialCode ----

func TestPrependDialCode(t *testing.T) {
	tests := []struct {
		name        string
		countryCode string
		phoneNumber string
		want        string
		wantErr     bool
	}{
		// National number input — dial code prepended
		{"IN national number", "IN", "9876543210", "+919876543210", false},
		{"US national number", "US", "6502530000", "+16502530000", false},
		{"GB national number", "GB", "7911123456", "+447911123456", false},
		{"IN with spaces", "IN", "98765 43210", "+919876543210", false},
		// Already-prefixed number — normalised and returned
		{"IN already has +91", "IN", "+91 98765 43210", "+919876543210", false},
		{"US already has +1 with dashes", "US", "+1-650-253-0000", "+16502530000", false},
		// Error cases
		{"mismatched +prefix", "IN", "+447911123456", "", true},
		{"empty phone", "IN", "", "", true},
		{"empty countryCode", "", "9876543210", "", true},
		{"unknown countryCode", "ZZ", "9876543210", "", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := PrependDialCode(tt.countryCode, tt.phoneNumber)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			require.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}
