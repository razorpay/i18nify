package currency

import (
	"errors"
	"github.com/stretchr/testify/assert"
	"os"
	"testing"
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
