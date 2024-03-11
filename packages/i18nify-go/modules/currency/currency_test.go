package currency

import (
	"errors"
	"github.com/stretchr/testify/assert"
	"io/ioutil"
	"testing"
)

func TestUnmarshalCurrency(t *testing.T) {
	jsonData, err := ioutil.ReadFile("data.json")
	result, err := UnmarshalCurrency(jsonData)

	assert.NoError(t, err, "Unexpected error during unmarshal")

	currency := result.CurrencyInformation["USD"]
	assert.Equal(t, "2", currency.GetMinorUnit(), "MinorUnit field mismatch")
	assert.Equal(t, "US Dollar", currency.GetName(), "Name field mismatch")
	assert.Equal(t, "840", currency.GetNumericCode(), "NumericCode field mismatch")
	assert.Equal(t, []string{"1", "5", "10", "25", "50", "100"}, currency.GetPhysicalCurrencyDenominations(), "PhysicalCurrencyDenominations field mismatch")
	assert.Equal(t, "$", currency.GetSymbol(), "Symbol field mismatch")
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

var readFileFunc = ioutil.ReadFile

func TestGetCurrencyInformation(t *testing.T) {
	jsonData, err := ioutil.ReadFile("data.json")
	// Mock implementation of ioutil.ReadFile
	readFileFunc = func(filename string) ([]byte, error) {
		return jsonData, errors.New("error reading JSON file")
	}
	defer func() {
		// Restore the original implementation after the test
		readFileFunc = ioutil.ReadFile
	}()

	_, err = readFileFunc(DataFile)
	if err != nil {
		return
	}

	result := GetCurrencyInformation("USD")

	// Use assert.Equal for assertions with inline expected values
	assert.Equal(t, "2", result.GetMinorUnit(), "MinorUnit field mismatch")
	assert.Equal(t, "US Dollar", result.GetName(), "Name field mismatch")
	assert.Equal(t, "840", result.GetNumericCode(), "NumericCode field mismatch")
	assert.Equal(t, []string{"1", "5", "10", "25", "50", "100"}, result.GetPhysicalCurrencyDenominations(), "PhysicalCurrencyDenominations field mismatch")
	assert.Equal(t, "$", result.GetSymbol(), "Symbol field mismatch")
}
