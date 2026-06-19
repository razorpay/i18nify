package phonenumber

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

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
	inRegex := `[6-9]\d{9}`
	assert.True(t, matchesEntirely("7394926646", inRegex))
	assert.False(t, matchesEntirely("1234", inRegex))
	assert.False(t, matchesEntirely("", inRegex))
	assert.False(t, matchesEntirely("7394926646extra", inRegex))
}

func TestCompiledRegex(t *testing.T) {
	re, err := compiledRegex(`\d{10}`)
	assert.NoError(t, err)
	assert.NotNil(t, re)
	assert.True(t, re.MatchString("1234567890"))
	assert.False(t, re.MatchString("123"))

	_, err = compiledRegex(`[invalid`)
	assert.Error(t, err)

	re2, err := compiledRegex(`\d{10}`)
	assert.NoError(t, err)
	assert.Equal(t, re, re2)
}

func TestDetectCountryAndDialCodeFromPhone(t *testing.T) {
	tests := []struct {
		phone  string
		wantCC string
		wantDC string
	}{
		{"+917394926646", "IN", "+91"},
		{"+447123456789", "GB", "+44"},
		{"+60123456789", "MY", "+60"},
		{"+15853042806", "US", "+1"},
		{"917394926646", "", ""},
		{"+999999999999", "", ""},
		{"", "", ""},
	}
	for _, tt := range tests {
		cc, dc := detectCountryAndDialCodeFromPhone(tt.phone)
		assert.Equal(t, tt.wantCC, cc, "phone=%q", tt.phone)
		assert.Equal(t, tt.wantDC, dc, "phone=%q", tt.phone)
	}
}

func TestGetPhoneNumberWithoutDialCode(t *testing.T) {
	tests := []struct {
		phone string
		want  string
	}{
		{"+917394926646", "7394926646"},
		{"+447123456789", "7123456789"},
		{"7394926646", "7394926646"},
		{"+", "+"},
		{"", ""},
	}
	for _, tt := range tests {
		assert.Equal(t, tt.want, getPhoneNumberWithoutDialCode(tt.phone), "phone=%q", tt.phone)
	}
}

func TestSplitAtXBoundary(t *testing.T) {
	tests := []struct {
		cleaned    string
		pattern    string
		wantPrefix string
		wantLocal  string
	}{
		{"+917394926646", "xxxx xxxxxx", "+91", "7394926646"},
		{"+15853042806", "xxx-xxx-xxxx", "+1", "5853042806"},
		{"7394926646", "xxxx xxxxxx", "", "7394926646"},
		{"12345", "xxxx xxxxxx", "", "12345"},
	}
	for _, tt := range tests {
		prefix, local := splitAtXBoundary(tt.cleaned, tt.pattern)
		assert.Equal(t, tt.wantPrefix, prefix, "cleaned=%q pattern=%q", tt.cleaned, tt.pattern)
		assert.Equal(t, tt.wantLocal, local, "cleaned=%q pattern=%q", tt.cleaned, tt.pattern)
	}
}

func TestResolveCountryCode(t *testing.T) {
	assert.Equal(t, "IN", resolveCountryCode("IN", "GB"))
	assert.Equal(t, "GB", resolveCountryCode("XX", "GB"))
	assert.Equal(t, "", resolveCountryCode("", ""))
}

func TestInvalidPhoneErr(t *testing.T) {
	err := invalidPhoneErr("+123")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "+123")
	assert.Contains(t, err.Error(), "phoneNumber")
}

func TestIsValidPhoneNumber(t *testing.T) {
	tests := []struct {
		name        string
		phoneNumber string
		countryCode string
		want        bool
	}{
		{"IN valid with dial code", "+917394926646", "IN", true},
		{"MY valid with dial code", "+60123456789", "MY", true},
		{"IN valid without dial code", "7394926646", "IN", true},
		{"IN too short", "1234", "IN", false},
		{"MY too short", "60123", "MY", false},
		{"empty phone", "", "IN", false},
		{"whitespace only", "   ", "IN", false},
		{"plus only", "+", "IN", false},
		{"special chars only", "()- ", "IN", false},
		{"invalid CC falls back to detection", "+917394926646", "XX", true},
		{"unknown CC no detection possible", "+999999999999", "XX", false},
		{"unsupported CC and bad number", "1234567890", "XYZ", false},
		{"IN with spaces and dashes", "+91-739-492-6646", "IN", true},
		{"IN with parens and spaces", "+91 (739) 492-6646", "IN", true},
		{"valid CC but short number", "+91123", "IN", false},
		{"empty CC auto-detects IN", "+917394926646", "", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.want, IsValidPhoneNumber(tt.phoneNumber, tt.countryCode))
		})
	}
}

func TestFormatPhoneNumber(t *testing.T) {
	tests := []struct {
		name        string
		phoneNumber string
		countryCode string
		want        string
		wantErr     error
	}{
		{"IN standard", "+917394926646", "IN", "+91 7394 926646", nil},
		{"MY standard", "+60123456789", "MY", "+60 12 34567 89", nil},
		{"US standard", "+15853042806", "US", "+1 585-304-2806", nil},
		{"GB standard", "+447123456789", "GB", "+44 7123 456 789", nil},
		{"invalid CC falls back to auto-detect", "+917394926646", "XYZ", "+91 7394 926646", nil},
		{"empty CC auto-detects", "+917394926646", "", "+91 7394 926646", nil},
		{"undetectable number returns cleaned", "+1969123456789", "", "+1969123456789", nil},
		{"empty phone", "", "IN", "", ErrEmptyPhoneNumber},
		{"whitespace only", "   ", "IN", "", ErrInvalidPhoneNumber},
		{"special chars only", "()- ", "IN", "", ErrInvalidPhoneNumber},
		{"plus only", "+", "IN", "", ErrInvalidPhoneNumber},
		{"invalid CC and undetectable number", "+999999999999", "XYZ", "", ErrUnknownCountryCode},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := FormatPhoneNumber(tt.phoneNumber, tt.countryCode)
			if tt.wantErr != nil {
				require.Error(t, err)
				assert.ErrorIs(t, err, tt.wantErr)
				return
			}
			require.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}

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

	t.Run("empty phone", func(t *testing.T) {
		_, err := ParsePhoneNumber("", "")
		require.Error(t, err)
		assert.ErrorIs(t, err, ErrEmptyPhoneNumber)
	})

	t.Run("whitespace only phone", func(t *testing.T) {
		_, err := ParsePhoneNumber("   ", "IN")
		require.Error(t, err)
		assert.ErrorIs(t, err, ErrInvalidPhoneNumber)
	})

	t.Run("special chars only phone", func(t *testing.T) {
		_, err := ParsePhoneNumber("()- ", "IN")
		require.Error(t, err)
		assert.ErrorIs(t, err, ErrInvalidPhoneNumber)
	})

	t.Run("invalid CC and undetectable number", func(t *testing.T) {
		_, err := ParsePhoneNumber("+999999999999", "XYZ")
		require.Error(t, err)
		assert.ErrorIs(t, err, ErrUnknownCountryCode)
	})

	t.Run("invalid CC falls back to auto-detect", func(t *testing.T) {
		info, err := ParsePhoneNumber("+917394926646", "XYZ")
		require.NoError(t, err)
		assert.Equal(t, "IN", info.CountryCode)
		assert.Equal(t, "+91", info.DialCode)
	})
}
