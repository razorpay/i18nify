package paymenttranslations

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetPaymentTranslationsList(t *testing.T) {
	list := GetPaymentTranslationsList()
	assert.NotEmpty(t, list)
	assert.Equal(t, 7, len(list), "should have 7 Indian language entries")
}

func TestGetPaymentTranslationsInfo_Valid(t *testing.T) {
	info, err := GetPaymentTranslationsInfo("hi")
	assert.NoError(t, err)
	assert.Equal(t, "Hindi", info.LanguageName)
	assert.NotEmpty(t, info.PayNow)
}

func TestGetPaymentTranslationsInfo_Invalid(t *testing.T) {
	_, err := GetPaymentTranslationsInfo("xx")
	assert.Error(t, err)

	_, err = GetPaymentTranslationsInfo("")
	assert.Error(t, err)
}

func TestUnmarshalPaymentTranslationsData(t *testing.T) {
	list := GetPaymentTranslationsList()
	assert.NotEmpty(t, list)

	// Marshal the data back to JSON and unmarshal via the dedicated function.
	b, err := json.Marshal(PaymentTranslationsData{PaymentTranslationsInformation: list})
	assert.NoError(t, err)

	var restored PaymentTranslationsData
	err = json.Unmarshal(b, &restored)
	assert.NoError(t, err)
	assert.Equal(t, len(list), len(restored.PaymentTranslationsInformation))
}
