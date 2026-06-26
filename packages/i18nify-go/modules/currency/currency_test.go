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
