package payment_translations

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

var expectedLanguageCodes = []string{"hi", "bn", "mr", "gu", "ta", "te", "kn"}

func TestGetPaymentTranslationsList_NoError(t *testing.T) {
	result, err := GetPaymentTranslationsList()
	require.NoError(t, err)
	require.NotNil(t, result)
}

func TestGetPaymentTranslationsList_AllSevenLanguages(t *testing.T) {
	result, err := GetPaymentTranslationsList()
	require.NoError(t, err)

	for _, code := range expectedLanguageCodes {
		_, ok := result[code]
		assert.True(t, ok, "expected language code %q to be present", code)
	}
	assert.Len(t, result, len(expectedLanguageCodes))
}

func TestGetPaymentTranslationsList_LanguageMetadata(t *testing.T) {
	tests := []struct {
		code         string
		languageName string
		script       string
	}{
		{"hi", "Hindi", "Devanagari"},
		{"bn", "Bengali", "Bengali"},
		{"mr", "Marathi", "Devanagari"},
		{"gu", "Gujarati", "Gujarati"},
		{"ta", "Tamil", "Tamil"},
		{"te", "Telugu", "Telugu"},
		{"kn", "Kannada", "Kannada"},
	}

	result, err := GetPaymentTranslationsList()
	require.NoError(t, err)

	for _, tt := range tests {
		t.Run(tt.code, func(t *testing.T) {
			entry, ok := result[tt.code]
			require.True(t, ok, "code %q not found", tt.code)
			assert.Equal(t, tt.languageName, entry.LanguageName)
			assert.Equal(t, tt.script, entry.Script)
		})
	}
}

func TestGetPaymentTranslationsList_AllFieldsNonEmpty(t *testing.T) {
	result, err := GetPaymentTranslationsList()
	require.NoError(t, err)

	for _, code := range expectedLanguageCodes {
		entry := result[code]
		t.Run(code, func(t *testing.T) {
			assert.NotEmpty(t, entry.LanguageName, "language_name empty for %s", code)
			assert.NotEmpty(t, entry.Script, "script empty for %s", code)
			assert.NotEmpty(t, entry.PayNow, "pay_now empty for %s", code)
			assert.NotEmpty(t, entry.Amount, "amount empty for %s", code)
			assert.NotEmpty(t, entry.Cancel, "cancel empty for %s", code)
			assert.NotEmpty(t, entry.Confirm, "confirm empty for %s", code)
			assert.NotEmpty(t, entry.PaymentSuccessful, "payment_successful empty for %s", code)
			assert.NotEmpty(t, entry.PaymentFailed, "payment_failed empty for %s", code)
			assert.NotEmpty(t, entry.Processing, "processing empty for %s", code)
			assert.NotEmpty(t, entry.Total, "total empty for %s", code)
			assert.NotEmpty(t, entry.Retry, "retry empty for %s", code)
			assert.NotEmpty(t, entry.EnterAmount, "enter_amount empty for %s", code)
			assert.NotEmpty(t, entry.CardNumber, "card_number empty for %s", code)
			assert.NotEmpty(t, entry.CardExpiry, "card_expiry empty for %s", code)
			assert.NotEmpty(t, entry.CVV, "cvv empty for %s", code)
			assert.NotEmpty(t, entry.NameOnCard, "name_on_card empty for %s", code)
			assert.NotEmpty(t, entry.UPIID, "upi_id empty for %s", code)
			assert.NotEmpty(t, entry.NetBanking, "net_banking empty for %s", code)
			assert.NotEmpty(t, entry.Wallet, "wallet empty for %s", code)
			assert.NotEmpty(t, entry.TransactionID, "transaction_id empty for %s", code)
			assert.NotEmpty(t, entry.Back, "back empty for %s", code)
			assert.NotEmpty(t, entry.ErrorTryAgain, "error_try_again empty for %s", code)
			assert.NotEmpty(t, entry.OrderID, "order_id empty for %s", code)
			assert.NotEmpty(t, entry.Receipt, "receipt empty for %s", code)
		})
	}
}

func TestGetPaymentTranslationsList_UniquePayNowStrings(t *testing.T) {
	result, err := GetPaymentTranslationsList()
	require.NoError(t, err)

	seen := make(map[string]string)
	for _, code := range expectedLanguageCodes {
		payNow := result[code].PayNow
		if prev, exists := seen[payNow]; exists {
			t.Errorf("duplicate pay_now value %q for codes %s and %s", payNow, prev, code)
		}
		seen[payNow] = code
	}
}

func TestGetPaymentTranslationsList_Idempotent(t *testing.T) {
	r1, err1 := GetPaymentTranslationsList()
	r2, err2 := GetPaymentTranslationsList()
	require.NoError(t, err1)
	require.NoError(t, err2)
	assert.Equal(t, r1, r2)
}
