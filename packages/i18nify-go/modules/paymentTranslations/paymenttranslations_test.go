package paymenttranslations

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetPaymentTranslationsList(t *testing.T) {
	list := GetPaymentTranslationsList()
	assert.NotEmpty(t, list)
	assert.Equal(t, 7, len(list), "should have 7 Indian language entries")
}

func TestGetPaymentTranslationsInfo_Hindi(t *testing.T) {
	info, err := GetPaymentTranslationsInfo("hi")
	assert.NoError(t, err)
	assert.NotEmpty(t, info.LanguageName)
	assert.NotEmpty(t, info.PayNow)
}

func TestGetPaymentTranslationsInfo_Invalid(t *testing.T) {
	_, err := GetPaymentTranslationsInfo("xx")
	assert.Error(t, err)

	_, err = GetPaymentTranslationsInfo("")
	assert.Error(t, err)
}

func TestUnmarshalPaymentTranslationsData(t *testing.T) {
	jsonData := `{"payment_translations_information":{"hi":{"language_name":"Hindi","pay_now":"अभी भुगतान करें"}}}`
	result, err := UnmarshalPaymentTranslationsData([]byte(jsonData))
	assert.NoError(t, err)
	assert.NotEmpty(t, result.PaymentTranslationsInformation)
	assert.Equal(t, "Hindi", result.PaymentTranslationsInformation["hi"].LanguageName)
	assert.Equal(t, "अभी भुगतान करें", result.PaymentTranslationsInformation["hi"].PayNow)
}
