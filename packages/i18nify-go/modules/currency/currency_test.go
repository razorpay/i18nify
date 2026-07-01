package currency

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestUnmarshalCurrency(t *testing.T) {
	jsonData := []byte(`{"currency_information":{"USD":{"name":"US Dollar","numeric_code":"840","minor_unit":"2","symbol":"$","physical_currency_denominations":["1","5","10","25","50","100"]}}}`)
	result, err := UnmarshalCurrency(jsonData)

	assert.NoError(t, err, "Unexpected error during unmarshal")

	currency := result.CurrencyInformation["USD"]
	assert.Equal(t, "2", currency.MinorUnit, "MinorUnit field mismatch")
	assert.Equal(t, "US Dollar", currency.Name, "Name field mismatch")
	assert.Equal(t, "840", currency.NumericCode, "NumericCode field mismatch")
	assert.Equal(t, []string{"1", "5", "10", "25", "50", "100"}, currency.PhysicalCurrencyDenominations, "PhysicalCurrencyDenominations field mismatch")
	assert.Equal(t, "$", currency.Symbol, "Symbol field mismatch")
}

func TestMarshalCurrency(t *testing.T) {
	expectedJSON := `{"currency_information": {"USD": {"name": "US Dollar", "numeric_code": "840", "minor_unit": "2", "symbol": "$", "physical_currency_denominations": ["1", "5", "10", "25", "50", "100"]}}}`

	inputData := map[string]CurrencyInformation{
		"USD": {
			MinorUnit:                     "2",
			Name:                          "US Dollar",
			NumericCode:                   "840",
			PhysicalCurrencyDenominations: []string{"1", "5", "10", "25", "50", "100"},
			Symbol:                        "$",
		},
	}
	currency := NewCurrency(inputData)
	marshaledJSON, err := currency.Marshal()
	assert.NoError(t, err)
	assert.JSONEq(t, expectedJSON, string(marshaledJSON))
}

func TestGetCurrencyInformation(t *testing.T) {
	// Validate specific details for USD as a sample
	result, err := GetCurrencyInformation("USD")
	assert.NoError(t, err, "Unexpected error for USD")
	assert.Equal(t, "2", result.MinorUnit, "MinorUnit field mismatch")
	assert.Equal(t, "US Dollar", result.Name, "Name field mismatch")
	assert.Equal(t, "840", result.NumericCode, "NumericCode field mismatch")
	assert.Equal(t, []string{"1", "5", "10", "25", "50", "100"}, result.PhysicalCurrencyDenominations, "PhysicalCurrencyDenominations field mismatch")
	assert.Equal(t, "$", result.Symbol, "Symbol field mismatch")

	countries := []struct {
		code    string
		name    string
		symbol  string
		numeric string
	}{
		{"CNY", "Yuan Renminbi", "CN¥", "156"},
		{"JPY", "Yen", "¥", "392"},
		{"INR", "Indian Rupee", "₹", "356"},
		{"RUB", "Russian Ruble", "₽", "643"},
		{"AED", "UAE Dirham", "د.إ", "784"},
		{"USD", "US Dollar", "$", "840"},
		{"BRL", "Brazilian Real", "R$", "986"},
		{"AUD", "Australian Dollar", "A$", "036"},
		{"EUR", "Euro", "€", "978"},
		{"ZAR", "South African Rand", "R", "710"},
	}

	for _, country := range countries {
		t.Run(country.code, func(t *testing.T) {
			result, err := GetCurrencyInformation(country.code)
			assert.NoError(t, err, "Unexpected error retrieving currency information for %s", country.code)
			assert.Equal(t, country.name, result.Name, "Name mismatch for %s", country.code)
			assert.Equal(t, country.symbol, result.Symbol, "Symbol mismatch for %s", country.code)
			assert.Equal(t, country.numeric, result.NumericCode, "Numeric code mismatch for %s", country.code)
		})
	}
}

func TestGetCurrencySymbol(t *testing.T) {
	countries := []struct {
		code   string
		symbol string
	}{
		{"CNY", "CN¥"},
		{"JPY", "¥"},
		{"INR", "₹"},
		{"RUB", "₽"},
		{"USD", "$"},
		{"AED", "د.إ"},
		{"BRL", "R$"},
		{"AUD", "A$"},
		{"SAR", "ر.س"},
		{"EUR", "€"},
		{"ZAR", "R"},
	}

	for _, country := range countries {
		symbol, err := GetCurrencySymbol(country.code)

		if err != nil {
			t.Errorf("Error for code %s: %v", country.code, err)
		} else {
			assert.Equal(t, country.symbol, symbol, "Symbol mismatch for %s", country.code)
		}
	}
}

func TestGetCurrencyCodeByISONumericCode(t *testing.T) {
	tests := []struct {
		name        string
		numericCode string
		wantCode    string
		wantErr     bool
	}{
		{"USD by numeric code 840", "840", "USD", false},
		{"INR by numeric code 356", "356", "INR", false},
		{"JPY by numeric code 392", "392", "JPY", false},
		{"CNY by numeric code 156", "156", "CNY", false},
		{"AED by numeric code 784", "784", "AED", false},
		{"unknown numeric code", "999", "", true},
		{"empty numeric code", "", "", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			code, err := GetCurrencyCodeByISONumericCode(tt.numericCode)
			if tt.wantErr {
				assert.Error(t, err)
				assert.Empty(t, code)
				return
			}
			assert.NoError(t, err)
			assert.Equal(t, tt.wantCode, code, "currency code mismatch for numeric code %s", tt.numericCode)
		})
	}
}

func TestFormatCurrency(t *testing.T) {
	c := &CurrencyInformation{}

	tests := []struct {
		name      string
		amount    float64
		locale    string
		wantErr   bool
		Eexpected string
	}{
		{
			name:      "valid locale en-US with positive amount",
			amount:    15300000,
			locale:    "en-US",
			wantErr:   false,
			Eexpected: "15,300,000.00",
		},
		{
			name:      "valid locale en-IN with positive amount",
			amount:    15300000,
			locale:    "en-IN",
			wantErr:   false,
			Eexpected: "1,53,00,000.00",
		},
		{
			name:      "valid locale en-MY with positive amount",
			amount:    15300000,
			locale:    "en-MY",
			wantErr:   false,
			Eexpected: "15,300,000.00",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, _ := c.FormatCurrency(tt.amount, tt.locale)
			assert.Equal(t, tt.Eexpected, result)
		})
	}
}

// boolPtr is a helper to get a pointer to a bool literal.
func boolPtr(b bool) *bool { return &b }

func TestFormatNumber(t *testing.T) {
	tests := []struct {
		name     string
		amount   interface{}
		opts     NumberFormatOptions
		expected string
		wantErr  bool
	}{
		{
			name:     "USD prefix symbol with grouping",
			amount:   1000.5,
			opts:     NumberFormatOptions{Currency: "USD"},
			expected: "$1,000.50",
		},
		{
			name:     "negative USD",
			amount:   -500.0,
			opts:     NumberFormatOptions{Currency: "USD"},
			expected: "-$500.00",
		},
		{
			name:     "zero USD",
			amount:   0,
			opts:     NumberFormatOptions{Currency: "USD"},
			expected: "$0.00",
		},
		{
			name:     "plain decimal no currency",
			amount:   "750.75",
			opts:     NumberFormatOptions{},
			expected: "750.75",
		},
		{
			name:     "large number plain decimal",
			amount:   12345.6789,
			opts:     NumberFormatOptions{},
			expected: "12,345.679",
		},
		{
			name:     "JPY zero fraction digits",
			amount:   5000,
			opts:     NumberFormatOptions{Currency: "JPY"},
			expected: "¥5,000",
		},
		{
			name:   "disable grouping",
			amount: 1234567.89,
			opts: NumberFormatOptions{
				UseGrouping: boolPtr(false),
			},
			expected: "1234567.89",
		},
		{
			name:     "EUR prefix symbol",
			amount:   1234.56,
			opts:     NumberFormatOptions{Currency: "EUR"},
			expected: "€1,234.56",
		},
		{
			name:    "invalid string amount",
			amount:  "not-a-number",
			opts:    NumberFormatOptions{Currency: "USD"},
			wantErr: true,
		},
		{
			name:    "string with commas (not parseable)",
			amount:  "1,234",
			opts:    NumberFormatOptions{},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := cachedCurrencyData.FormatNumber(tt.amount, tt.opts)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			require.NoError(t, err)
			assert.Equal(t, tt.expected, got)
		})
	}
}

func TestFormatNumber_IntlMappedCurrencies(t *testing.T) {
	cases := []struct {
		currency string
	}{
		{"SGD"},
		{"AUD"},
		{"HKD"},
		{"CAD"},
	}

	for _, tc := range cases {
		t.Run(tc.currency, func(t *testing.T) {
			result, err := cachedCurrencyData.FormatNumber(1000.0, NumberFormatOptions{
				Currency: tc.currency,
			})
			require.NoError(t, err)

			sym, symErr := GetCurrencySymbol(tc.currency)
			require.NoError(t, symErr)
			assert.Contains(t, result, sym,
				"formatted string should contain canonical symbol %q for %s", sym, tc.currency)
		})
	}
}

func TestFormatNumberByParts_USD(t *testing.T) {
	result, err := cachedCurrencyData.FormatNumberByParts(12345.67, NumberFormatOptions{
		Currency: "USD",
	})
	require.NoError(t, err)

	assert.Equal(t, "$", result.Currency)
	assert.Equal(t, "12,345", result.Integer)
	assert.Equal(t, ".", result.Decimal)
	assert.True(t, result.IsPrefixSymbol)
	assert.Equal(t, PartCurrency, result.RawParts[0].Type)
	assert.Equal(t, "$", result.RawParts[0].Value)
}

func TestFormatNumberByParts_EUR(t *testing.T) {
	result, err := cachedCurrencyData.FormatNumberByParts(12345.67, NumberFormatOptions{
		Currency: "EUR",
	})
	require.NoError(t, err)

	assert.Equal(t, "€", result.Currency)
	assert.Equal(t, "12,345", result.Integer)
	assert.Equal(t, ".", result.Decimal)
	assert.True(t, result.IsPrefixSymbol)
	assert.Equal(t, PartCurrency, result.RawParts[0].Type)
	assert.Equal(t, "€", result.RawParts[0].Value)
}

func TestFormatNumberByParts_Negative_Prefix(t *testing.T) {
	result, err := cachedCurrencyData.FormatNumberByParts(-500.0, NumberFormatOptions{
		Currency: "USD",
	})
	require.NoError(t, err)

	assert.Equal(t, "-", result.MinusSign)
	assert.True(t, result.IsPrefixSymbol)
	assert.Equal(t, PartMinusSign, result.RawParts[0].Type)
	assert.Equal(t, PartCurrency, result.RawParts[1].Type)
}

func TestFormatNumberByParts_Negative_Prefix_EUR(t *testing.T) {
	result, err := cachedCurrencyData.FormatNumberByParts(-1234567.0, NumberFormatOptions{
		Currency: "EUR",
	})
	require.NoError(t, err)

	assert.Equal(t, "-", result.MinusSign)
	assert.True(t, result.IsPrefixSymbol)
	assert.Equal(t, PartMinusSign, result.RawParts[0].Type)
	assert.Equal(t, PartCurrency, result.RawParts[1].Type)
}

func TestFormatNumberByParts_NoCurrency(t *testing.T) {
	result, err := cachedCurrencyData.FormatNumberByParts(123.45, NumberFormatOptions{})
	require.NoError(t, err)

	assert.Equal(t, "123", result.Integer)
	assert.Equal(t, ".", result.Decimal)
	assert.Empty(t, result.Currency)
	assert.True(t, result.IsPrefixSymbol)
}

func TestFormatNumberByParts_JPY(t *testing.T) {
	result, err := cachedCurrencyData.FormatNumberByParts(12346.0, NumberFormatOptions{
		Currency: "JPY",
	})
	require.NoError(t, err)

	assert.Empty(t, result.Decimal)
	assert.NotEmpty(t, result.Integer)
}

func TestFormatNumberByParts_InvalidAmount(t *testing.T) {
	_, err := cachedCurrencyData.FormatNumberByParts("not-a-number", NumberFormatOptions{
		Currency: "USD",
	})
	assert.Error(t, err)
}

func TestFormatNumberByParts_UnknownCurrency(t *testing.T) {
	result, err := cachedCurrencyData.FormatNumberByParts(12345.67, NumberFormatOptions{
		Currency: "XYZ",
	})
	require.NoError(t, err)

	assert.Equal(t, "XYZ", result.Currency)
	assert.True(t, result.IsPrefixSymbol)

	require.GreaterOrEqual(t, len(result.RawParts), 2)
	assert.Equal(t, PartCurrency, result.RawParts[0].Type)
	assert.Equal(t, PartLiteral, result.RawParts[1].Type)
}

func TestConvertStringToMinorUnit(t *testing.T) {
	tests := []struct {
		name          string
		currency      string
		amount        string
		expected      int64
		expectedError string
	}{
		{"USD plain", "USD", "10.50", 1050, ""},
		{"USD integer", "USD", "100", 10000, ""},
		{"USD small", "USD", "0.01", 1, ""},
		{"USD thousands", "USD", "1,234.56", 123456, ""},
		{"USD large", "USD", "1,000,000.00", 100000000, ""},
		{"USD with symbol", "USD", "$10.50", 1050, ""},
		{"INR with symbol", "INR", "₹4.14", 414, ""},
		{"GBP with symbol", "GBP", "£10.50", 1050, ""},
		{"EUR European decimal", "EUR", "10,50", 1050, ""},
		{"EUR European thousands", "EUR", "1.234,56", 123456, ""},
		{"EUR with symbol", "EUR", "€10,50", 1050, ""},
		{"JPY no minor unit", "JPY", "1234", 1234, ""},
		{"JPY with symbol", "JPY", "¥1,234", 1234, ""},
		{"BHD three minor units", "BHD", "10.500", 10500, ""},
		{"BHD small", "BHD", "1.234", 1234, ""},
		{"Invalid currency code", "XXX", "10.50", 0, "currency code 'XXX' not found"},
		{"Non-numeric string", "USD", "abc", 0, "invalid amount string"},
		{"Empty string", "USD", "", 0, "invalid amount string"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := ConvertStringToMinorUnit(tt.currency, tt.amount)
			if tt.expectedError != "" {
				assert.Error(t, err)
				assert.Contains(t, err.Error(), tt.expectedError)
				return
			}

			assert.NoError(t, err)
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestGetDenomination(t *testing.T) {
	tests := []struct {
		code     string
		wantErr  bool
		contains string
	}{
		{"USD", false, "1"},
		{"INR", false, "1"},
		{"JPY", false, "1000"},
		{"EUR", false, "5"},
		{"", true, ""},
		{"XXX", true, ""},
	}

	for _, tt := range tests {
		t.Run(tt.code, func(t *testing.T) {
			result, err := GetDenomination(tt.code)
			if tt.wantErr {
				assert.Error(t, err)
				assert.Nil(t, result)
				return
			}

			assert.NoError(t, err)
			assert.NotEmpty(t, result)
			if tt.contains != "" {
				assert.Contains(t, result, tt.contains)
			}
		})
	}
}

func TestGetISONumericCode_WellKnown(t *testing.T) {
	cases := []struct {
		code     string
		expected string
	}{
		{"USD", "840"},
		{"INR", "356"},
		{"EUR", "978"},
		{"JPY", "392"},
		{"GBP", "826"},
		{"AUD", "036"},
		{"CAD", "124"},
		{"CHF", "756"},
		{"CNY", "156"},
		{"BHD", "048"},
		{"KWD", "414"},
	}

	for _, tc := range cases {
		t.Run(tc.code, func(t *testing.T) {
			got, err := GetISONumericCode(tc.code)
			require.NoError(t, err)
			assert.Equal(t, tc.expected, got)
		})
	}
}

func TestGetISONumericCode_ZeroPadded(t *testing.T) {
	t.Run("ALL returns 008", func(t *testing.T) {
		got, err := GetISONumericCode("ALL")
		require.NoError(t, err)
		assert.Equal(t, "008", got)
	})

	t.Run("AUD returns 036", func(t *testing.T) {
		got, err := GetISONumericCode("AUD")
		require.NoError(t, err)
		assert.Equal(t, "036", got)
	})
}

func TestGetISONumericCode_ReturnType(t *testing.T) {
	got, err := GetISONumericCode("USD")
	require.NoError(t, err)
	assert.IsType(t, "", got, "result must be a string")
	assert.Len(t, got, 3, "numeric code must be exactly 3 characters")
}

func TestGetISONumericCode_InvalidCode(t *testing.T) {
	for _, code := range []string{"XYZ", "", "usd", "INVALID"} {
		t.Run(code, func(t *testing.T) {
			_, err := GetISONumericCode(code)
			assert.Error(t, err, "expected error for code %q", code)
		})
	}
}

func TestGetISONumericCode_AllCodesHaveThreeDigits(t *testing.T) {
	for code := range cachedCurrencyData.CurrencyInformation {
		got, err := GetISONumericCode(code)
		require.NoError(t, err, "unexpected error for code %s", code)
		assert.Len(t, got, 3, "numeric code for %s should be 3 chars, got %q", code, got)
	}
}

func TestGetMinimumValue_ExplicitValues(t *testing.T) {
	cases := []struct {
		code string
		want int
	}{
		{"USD", 50},
		{"INR", 50},
		{"EUR", 50},
		{"GBP", 30},
		{"JPY", 50},
		{"AED", 200},
		{"HKD", 400},
		{"HUF", 17500},
		{"CZK", 1500},
		{"MYR", 200},
		{"DKK", 250},
		{"NOK", 300},
		{"SEK", 300},
		{"MXN", 1000},
		{"THB", 1000},
	}

	for _, tc := range cases {
		t.Run(tc.code, func(t *testing.T) {
			got, err := GetMinimumValue(tc.code)
			require.NoError(t, err)
			assert.Equal(t, tc.want, got)
		})
	}
}

func TestGetMinimumValue_FallbackMinorUnit(t *testing.T) {
	got, err := GetMinimumValue("AFN")
	require.NoError(t, err)
	assert.Equal(t, 50, got)

	got, err = GetMinimumValue("XOF")
	require.NoError(t, err)
	assert.Equal(t, 1, got)
}

func TestGetMinimumValue_InvalidCode(t *testing.T) {
	_, err := GetMinimumValue("XX")
	assert.Error(t, err)
}

func TestGetMinimumValue_EmptyCode(t *testing.T) {
	_, err := GetMinimumValue("")
	assert.Error(t, err)
}

func TestGetMinorUnitName(t *testing.T) {
	tests := []struct {
		code string
		want string
	}{
		{"USD", "cent"},
		{"EUR", "cent"},
		{"GBP", "penny"},
		{"JPY", "sen"},
		{"INR", "paisa"},
		{"PKR", "paisa"},
		{"BHD", "fils"},
		{"KWD", "fils"},
		{"AED", "fils"},
		{"SAR", "halala"},
		{"OMR", "baisa"},
		{"TND", "millime"},
		{"ILS", "agora"},
		{"NOK", "øre"},
		{"SEK", "öre"},
		{"RUB", "kopek"},
		{"NGN", "kobo"},
		{"GHS", "pesewa"},
	}

	for _, tt := range tests {
		t.Run(tt.code, func(t *testing.T) {
			got, err := GetMinorUnitName(tt.code)
			assert.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestGetMinorUnitName_ValidButUnlisted(t *testing.T) {
	got, err := GetMinorUnitName("ALL")
	assert.NoError(t, err)
	assert.Equal(t, "", got)
}

func TestGetMinorUnitName_Errors(t *testing.T) {
	_, err := GetMinorUnitName("")
	assert.Error(t, err)

	_, err = GetMinorUnitName("XXX")
	assert.Error(t, err)
}

func TestIsValidAmount_USD(t *testing.T) {
	cases := []struct {
		amount string
		want   bool
	}{
		{"10", true},
		{"10.5", true},
		{"10.50", true},
		{"0.99", true},
		{"1000.00", true},
		{"-10.50", true},
		{"10.123", false},
		{"0.001", false},
	}

	for _, tc := range cases {
		t.Run(tc.amount, func(t *testing.T) {
			got, err := IsValidAmount(tc.amount, "USD")
			require.NoError(t, err)
			assert.Equal(t, tc.want, got)
		})
	}
}

func TestIsValidAmount_JPY(t *testing.T) {
	t.Run("integer allowed", func(t *testing.T) {
		got, err := IsValidAmount("100", "JPY")
		require.NoError(t, err)
		assert.True(t, got)
	})

	t.Run("any decimal rejected", func(t *testing.T) {
		for _, amount := range []string{"100.5", "100.00", "1.1"} {
			got, err := IsValidAmount(amount, "JPY")
			require.NoError(t, err)
			assert.False(t, got, "expected false for %s JPY", amount)
		}
	})
}

func TestIsValidAmount_KWD(t *testing.T) {
	for _, amount := range []string{"10", "10.1", "10.12", "10.123"} {
		t.Run(amount+" allowed", func(t *testing.T) {
			got, err := IsValidAmount(amount, "KWD")
			require.NoError(t, err)
			assert.True(t, got)
		})
	}

	t.Run("4 decimals rejected", func(t *testing.T) {
		got, err := IsValidAmount("10.1234", "KWD")
		require.NoError(t, err)
		assert.False(t, got)
	})
}

func TestIsValidAmount_CLF(t *testing.T) {
	t.Run("4 decimals allowed", func(t *testing.T) {
		got, err := IsValidAmount("1.1234", "CLF")
		require.NoError(t, err)
		assert.True(t, got)
	})

	t.Run("5 decimals rejected", func(t *testing.T) {
		got, err := IsValidAmount("1.12345", "CLF")
		require.NoError(t, err)
		assert.False(t, got)
	})
}

func TestIsValidAmount_InvalidCurrencyCode(t *testing.T) {
	for _, code := range []string{"XYZ", "", "usd", "INVALID"} {
		t.Run(code, func(t *testing.T) {
			_, err := IsValidAmount("10.50", code)
			assert.Error(t, err, "expected error for invalid code: %q", code)
		})
	}
}

func TestIsValidAmount_InvalidFormat(t *testing.T) {
	cases := []string{"abc", "10,50", "1e2", "", "   ", "1.2.3", "$10.50", "1 000.50"}
	for _, amount := range cases {
		t.Run(amount, func(t *testing.T) {
			got, err := IsValidAmount(amount, "USD")
			require.NoError(t, err)
			assert.False(t, got, "expected false for amount %q", amount)
		})
	}
}

func TestIsValidAmount_EdgeCases(t *testing.T) {
	t.Run("trims whitespace", func(t *testing.T) {
		got, err := IsValidAmount("  10.50  ", "USD")
		require.NoError(t, err)
		assert.True(t, got)
	})

	t.Run("zero with 2 decimals valid for USD", func(t *testing.T) {
		got, err := IsValidAmount("0.00", "USD")
		require.NoError(t, err)
		assert.True(t, got)
	})

	t.Run("negative amount valid", func(t *testing.T) {
		got, err := IsValidAmount("-100.50", "USD")
		require.NoError(t, err)
		assert.True(t, got)
	})
}

func TestIsValidCurrencyCode_Valid(t *testing.T) {
	valid := []string{"USD", "EUR", "INR", "GBP", "JPY", "AUD", "CAD", "CHF", "BHD", "KWD", "KRW"}
	for _, code := range valid {
		t.Run(code, func(t *testing.T) {
			assert.True(t, IsValidCurrencyCode(code), "expected valid: %s", code)
		})
	}
}

func TestIsValidCurrencyCode_Invalid(t *testing.T) {
	invalid := []string{"INVALID", "XYZ", "US", "usd", "xxx", "XXX"}
	for _, code := range invalid {
		t.Run(code, func(t *testing.T) {
			assert.False(t, IsValidCurrencyCode(code), "expected invalid: %s", code)
		})
	}
}

func TestIsValidCurrencyCode_Empty(t *testing.T) {
	assert.False(t, IsValidCurrencyCode(""))
}

func TestIsValidCurrencyCode_CaseSensitive(t *testing.T) {
	assert.False(t, IsValidCurrencyCode("usd"), "lowercase should be rejected")
	assert.False(t, IsValidCurrencyCode("Usd"), "mixed-case should be rejected")
	assert.True(t, IsValidCurrencyCode("USD"), "uppercase should be accepted")
}
