package payment_translations

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"sync"
)

//go:embed data/paymentTranslationsConfig.json
var rawPaymentTranslations []byte

// PaymentTranslationsStrings holds UI strings for a single language/locale.
type PaymentTranslationsStrings struct {
	LanguageName       string `json:"language_name"`
	Script             string `json:"script"`
	PayNow             string `json:"pay_now"`
	Amount             string `json:"amount"`
	Cancel             string `json:"cancel"`
	Confirm            string `json:"confirm"`
	PaymentSuccessful  string `json:"payment_successful"`
	PaymentFailed      string `json:"payment_failed"`
	Processing         string `json:"processing"`
	Total              string `json:"total"`
	Retry              string `json:"retry"`
	EnterAmount        string `json:"enter_amount"`
	CardNumber         string `json:"card_number"`
	CardExpiry         string `json:"card_expiry"`
	CVV                string `json:"cvv"`
	NameOnCard         string `json:"name_on_card"`
	UPIID              string `json:"upi_id"`
	NetBanking         string `json:"net_banking"`
	Wallet             string `json:"wallet"`
	TransactionID      string `json:"transaction_id"`
	Back               string `json:"back"`
	ErrorTryAgain      string `json:"error_try_again"`
	OrderID            string `json:"order_id"`
	Receipt            string `json:"receipt"`
}

var (
	translationsOnce sync.Once
	translationsMap  map[string]PaymentTranslationsStrings
	translationsErr  error
)

func loadTranslations() (map[string]PaymentTranslationsStrings, error) {
	translationsOnce.Do(func() {
		if err := json.Unmarshal(rawPaymentTranslations, &translationsMap); err != nil {
			translationsErr = fmt.Errorf("payment_translations: failed to parse paymentTranslationsConfig.json: %w", err)
		}
	})
	return translationsMap, translationsErr
}

// GetPaymentTranslationsList returns the complete map of language/locale codes
// to their payment UI string translations.
func GetPaymentTranslationsList() (map[string]PaymentTranslationsStrings, error) {
	return loadTranslations()
}
