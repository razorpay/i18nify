// Package paymenttranslations provides payment UI translation strings for 7 Indian languages.
package paymenttranslations

import (
	"encoding/json"
	"fmt"

	dataSource "github.com/razorpay/i18nify/i18nify-data/go/paymenttranslations"
)

// PaymentStrings contains the translated payment UI strings.
type PaymentStrings struct {
	PayNow            string `json:"pay_now"`
	Cancel            string `json:"cancel"`
	Amount            string `json:"amount"`
	CardNumber        string `json:"card_number"`
	CVV               string `json:"cvv"`
	ExpiryDate        string `json:"expiry_date"`
	NameOnCard        string `json:"name_on_card"`
	UPIID             string `json:"upi_id"`
	Bank              string `json:"bank"`
	Processing        string `json:"processing"`
	PaymentSuccessful string `json:"payment_successful"`
	PaymentFailed     string `json:"payment_failed"`
	Retry             string `json:"retry"`
	MobileNumber      string `json:"mobile_number"`
	OTP               string `json:"otp"`
	EnterOTP          string `json:"enter_otp"`
	ResendOTP         string `json:"resend_otp"`
	Wallet            string `json:"wallet"`
	NetBanking        string `json:"net_banking"`
	SelectBank        string `json:"select_bank"`
	EnterAmount       string `json:"enter_amount"`
	MinimumAmount     string `json:"minimum_amount"`
	MaximumAmount     string `json:"maximum_amount"`
	TransactionID     string `json:"transaction_id"`
	OrderID           string `json:"order_id"`
	Back              string `json:"back"`
	Next              string `json:"next"`
	Confirm           string `json:"confirm"`
	Done              string `json:"done"`
	Save              string `json:"save"`
	ErrorOccurred     string `json:"error_occurred"`
	TryAgain          string `json:"try_again"`
}

// PaymentTranslationsInfo contains translation data for a single language.
type PaymentTranslationsInfo struct {
	LanguageName string         `json:"language_name"`
	NativeName   string         `json:"native_name"`
	Strings      PaymentStrings `json:"strings"`
}

// PaymentTranslationsData holds translation information keyed by BCP 47 language code.
type PaymentTranslationsData struct {
	PaymentTranslationInformation map[string]PaymentTranslationsInfo `json:"payment_translation_information"`
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
	info := make(map[string]PaymentTranslationsInfo, len(src.GetPaymentTranslationInformation()))
	for code, entry := range src.GetPaymentTranslationInformation() {
		if entry == nil {
			continue
		}
		b, merr := json.Marshal(entry)
		if merr != nil {
			continue
		}
		var v PaymentTranslationsInfo
		if err := json.Unmarshal(b, &v); err != nil {
			continue
		}
		info[code] = v
	}
	return PaymentTranslationsData{PaymentTranslationInformation: info}
}

// UnmarshalPaymentTranslationsData parses JSON data into a PaymentTranslationsData struct.
func UnmarshalPaymentTranslationsData(data []byte) (PaymentTranslationsData, error) {
	var r PaymentTranslationsData
	err := json.Unmarshal(data, &r)
	return r, err
}

// GetPaymentTranslationsList returns all language translation entries keyed by language code.
func GetPaymentTranslationsList() map[string]PaymentTranslationsInfo {
	return cachedPaymentTranslationsData.PaymentTranslationInformation
}

// GetPaymentTranslationsInfo returns the translation entry for the given BCP 47 language code.
func GetPaymentTranslationsInfo(langCode string) (PaymentTranslationsInfo, error) {
	if langCode == "" {
		return PaymentTranslationsInfo{}, fmt.Errorf("language code cannot be empty")
	}
	info, exists := cachedPaymentTranslationsData.PaymentTranslationInformation[langCode]
	if !exists {
		return PaymentTranslationsInfo{}, fmt.Errorf("payment translations for language code '%s' not found", langCode)
	}
	return info, nil
}
