package currency

import (
	"errors"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestUnmarshalCurrency(t *testing.T) {
	jsonData, err := os.ReadFile("data/data.json")
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

var readFileFunc = os.ReadFile

func TestGetCurrencyInformation(t *testing.T) {
	jsonData, err := os.ReadFile("data/data.json")
	// Mock implementation of os.ReadFile
	readFileFunc = func(filename string) ([]byte, error) {
		return jsonData, errors.New("error reading JSON file")
	}
	defer func() {
		// Restore the original implementation after the test
		readFileFunc = os.ReadFile
	}()

	_, err = readFileFunc(DataFile)
	if err != nil {
		return
	}
	// Validate specific details for USD as a sample
	result, _ := GetCurrencyInformation("USD")

	assert.Equal(t, "2", result.MinorUnit, "MinorUnit field mismatch")
	assert.Equal(t, "US Dollar", result.Name, "Name field mismatch")
	assert.Equal(t, "840", result.NumericCode, "NumericCode field mismatch")
	assert.Equal(t, []string{"1", "5", "10", "25", "50", "100"}, result.PhysicalCurrencyDenominations, "PhysicalCurrencyDenominations field mismatch")
	assert.Equal(t, "$", result.Symbol, "Symbol field mismatch")

	// Test multiple countries with table-driven tests
	countries := []struct {
		code    string
		name    string
		symbol  string
		numeric string
	}{
		// Asia
		{"CNY", "Yuan Renminbi", "CN¥", "156"},
		{"JPY", "Yen", "¥", "392"},
		{"INR", "Indian Rupee", "₹", "356"},
		{"RUB", "Russian Ruble", "₽", "643"},
		{"AED", "UAE Dirham", "د.إ", "784"},
		// North America
		{"USD", "US Dollar", "$", "840"},
		// South America
		{"BRL", "Brazilian Real", "R$", "986"},
		// Australia
		{"AUD", "Australian Dollar", "$", "36"},
		// Europe
		{"EUR", "Euro", "€", "978"},
		// Africa
		{"ZAR", "South African Rand", "R", "710"},
	}

	for _, country := range countries {
		t.Run(country.code, func(t *testing.T) {
			result, err := GetCurrencyInformation(country.code)
			//fmt.Println("Here:", country.name, ":", result.Name)
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
