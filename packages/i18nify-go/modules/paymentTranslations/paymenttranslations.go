// Package paymenttranslations provides payment UI string translations for 7 Indian languages.
package paymenttranslations

import (
	"fmt"

	dataSource "github.com/razorpay/i18nify/i18nify-data/go/paymenttranslations"
)

// PaymentTranslationsInfo contains payment UI strings for one locale.
type PaymentTranslationsInfo struct {
	LanguageName string `json:"language_name"`
	Script string `json:"script"`
	PayNow string `json:"pay_now"`
	Amount string `json:"amount"`
	Cancel string `json:"cancel"`
	Confirm string `json:"confirm"`
	PaymentSuccessful string `json:"payment_successful"`
	PaymentFailed string `json:"payment_failed"`
	Processing string `json:"processing"`
	Total string `json:"total"`
	Retry string `json:"retry"`
	EnterAmount string `json:"enter_amount"`
	CardNumber string `json:"card_number"`
	CardExpiry string `json:"card_expiry"`
	CVV string `json:"cvv"`
	NameOnCard string `json:"name_on_card"`
	UPIID string `json:"upi_id"`
	NetBanking string `json:"net_banking"`
	Wallet string `json:"wallet"`
	TransactionID string `json:"transaction_id"`
	Back string `json:"back"`
	ErrorTryAgain string `json:"error_try_again"`
	OrderID string `json:"order_id"`
	Receipt string `json:"receipt"`
}

// PaymentTranslationsData holds translations keyed by BCP 47 language code.
type PaymentTranslationsData struct {
	PaymentTranslationsInformation map[string]PaymentTranslationsInfo `json:"payment_translations_information"`
}

var cachedPaymentTranslationsData *PaymentTranslationsData

func init() {
	src, err := dataSource.GetPaymentTranslationsData()
	if err != nil {
		panic(fmt.Sprintf("failed to load paymenttranslations data: %v", err))
	}
	result := convertFromDataSource(src)
	cachedPaymentTranslationsData = &result
}

// FIX 5: direct field assignment — no marshal→unmarshal roundtrip.
func convertFromDataSource(src *dataSource.PaymentTranslationsData) PaymentTranslationsData {
	if src == nil {
		return PaymentTranslationsData{}
	}
	info := make(map[string]PaymentTranslationsInfo, len(src.GetPaymentTranslationsInformation()))
	for code, entry := range src.GetPaymentTranslationsInformation() {
		if entry == nil {
			continue
		}
		info[code] = PaymentTranslationsInfo{
			LanguageName: entry.GetLanguageName(),
			Script: entry.GetScript(),
			PayNow: entry.GetPayNow(),
			Amount: entry.GetAmount(),
			Cancel: entry.GetCancel(),
			Confirm: entry.GetConfirm(),
			PaymentSuccessful: entry.GetPaymentSuccessful(),
			PaymentFailed: entry.GetPaymentFailed(),
			Processing: entry.GetProcessing(),
			Total: entry.GetTotal(),
			Retry: entry.GetRetry(),
			EnterAmount: entry.GetEnterAmount(),
			CardNumber: entry.GetCardNumber(),
			CardExpiry: entry.GetCardExpiry(),
			CVV: entry.GetCVV(),
			NameOnCard: entry.GetNameOnCard(),
			UPIID: entry.GetUPIID(),
			NetBanking: entry.GetNetBanking(),
			Wallet: entry.GetWallet(),
			TransactionID: entry.GetTransactionID(),
			Back: entry.GetBack(),
			ErrorTryAgain: entry.GetErrorTryAgain(),
			OrderID: entry.GetOrderID(),
			Receipt: entry.GetReceipt(),
		}
	}
	return PaymentTranslationsData{PaymentTranslationsInformation: info}
}

// GetPaymentTranslationsList returns all locale translation sets keyed by BCP 47 language code.
func GetPaymentTranslationsList() map[string]PaymentTranslationsInfo {
	return cachedPaymentTranslationsData.PaymentTranslationsInformation
}

// GetPaymentTranslationsInfo returns translation strings for the given BCP 47 language code.
// Returns an error for empty or unknown codes.
func GetPaymentTranslationsInfo(code string) (PaymentTranslationsInfo, error) {
	if code == "" {
		return PaymentTranslationsInfo{}, fmt.Errorf("language code cannot be empty")
	}
	info, exists := cachedPaymentTranslationsData.PaymentTranslationsInformation[code]
	if !exists {
		return PaymentTranslationsInfo{}, fmt.Errorf("payment translations for language '%s' not found", code)
	}
	return info, nil
}
