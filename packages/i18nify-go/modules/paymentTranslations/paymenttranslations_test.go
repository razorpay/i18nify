package paymenttranslations

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetPaymentTranslationsList(t *testing.T) {
	list := GetPaymentTranslationsList()
	assert.NotEmpty(t, list)
	assert.Len(t, list, 7, "should have 7 Indian language entries")
	for code := range list {
		assert.Len(t, code, 2, "language code should be 2 chars: %s", code)
	}
}

func TestGetPaymentTranslationsInfo_Valid(t *testing.T) {
	codes := []string{"hi", "bn", "mr", "gu", "ta", "te", "kn"}
	for _, code := range codes {
		info, err := GetPaymentTranslationsInfo(code)
		assert.NoError(t, err, "should not error for code %s", code)
		assert.NotEmpty(t, info.LanguageName)
		assert.NotEmpty(t, info.NativeName)
		assert.NotEmpty(t, info.Strings.PayNow)
		assert.NotEmpty(t, info.Strings.Cancel)
		assert.NotEmpty(t, info.Strings.Amount)
	}
}

func TestGetPaymentTranslationsInfo_Invalid(t *testing.T) {
	_, err := GetPaymentTranslationsInfo("XX")
	assert.Error(t, err)

	_, err = GetPaymentTranslationsInfo("")
	assert.Error(t, err)
}

func TestGetPaymentTranslationsInfo_Hindi(t *testing.T) {
	info, err := GetPaymentTranslationsInfo("hi")
	assert.NoError(t, err)
	assert.Equal(t, "Hindi", info.LanguageName)
	assert.Equal(t, "हिन्दी", info.NativeName)
	assert.Equal(t, "अभी भुगतान करें", info.Strings.PayNow)
}

func TestPaymentTranslationsData_JSON(t *testing.T) {
	list := GetPaymentTranslationsList()
	raw, err := json.Marshal(list)
	assert.NoError(t, err)
	assert.NotEmpty(t, raw)

	parsed, err := UnmarshalPaymentTranslationsData([]byte(`{"payment_translation_information":{}}`))
	assert.NoError(t, err)
	assert.NotNil(t, parsed)
}
