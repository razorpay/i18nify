// Package paymenttranslations provides payment UI string translations for 7 Indian languages.
package paymenttranslations

import (
	"encoding/json"
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
	Cvv string `json:"cvv"`
	NameOnCard string `json:"name_on_card"`
	UpiId string `json:"upi_id"`
	NetBanking string `json:"net_banking"`
	Wallet string `json:"wallet"`
	TransactionId string `json:"transaction_id"`
	Back string `json:"back"`
	ErrorTryAgain string `json:"error_try_again"`
	OrderId string `json:"order_id"`
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
	data := convertFromDataSource(src)
	cachedPaymentTranslationsData = &data
}

func convertFromDataSource(src *dataSource.PaymentTranslationsData) PaymentTranslationsData {
	if src == nil {
		return PaymentTranslationsData{}
	}
	info := make(map[string]PaymentTranslationsInfo, len(src.GetPaymentTranslationsInformation()))
	for code, entry := range src.GetPaymentTranslationsInformation() {
		if entry == nil {
			continue
		}
		b, _ := json.Marshal(entry)
		var v PaymentTranslationsInfo
		if err := json.Unmarshal(b, &v); err != nil {
			continue
		}
		info[code] = v
	}
	return PaymentTranslationsData{PaymentTranslationsInformation: info}
}

// UnmarshalPaymentTranslationsData parses JSON data into a PaymentTranslationsData struct.
func UnmarshalPaymentTranslationsData(data []byte) (PaymentTranslationsData, error) {
	var r PaymentTranslationsData
	err := json.Unmarshal(data, &r)
	return r, err
}

// GetPaymentTranslationsList returns all locale translation sets keyed by BCP 47 language code.
func GetPaymentTranslationsList() map[string]PaymentTranslationsInfo {
	return cachedPaymentTranslationsData.PaymentTranslationsInformation
}

// GetPaymentTranslationsInfo returns translation strings for the given BCP 47 language code.
func GetPaymentTranslationsInfo(code string) (PaymentTranslationsInfo, error) {
	if code == "" {
		return PaymentTranslationsInfo{}, fmt.Errorf("language code cannot be empty")
	}
	info, exists := cachedPaymentTranslationsData.PaymentTranslationsInformation[code]
	if !exists {
		return PaymentTranslationsInfo{}, fmt.Errorf("payment translations for language code '%s' not found", code)
	}
	return info, nil
}
