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
	list := GetPaymentTranslationsList()
	assert.NotEmpty(t, list)
}
