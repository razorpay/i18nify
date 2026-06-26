package banking

import (
	"fmt"
	"strings"
)

// PaymentNetworkResult holds the payment networks available for a currency.
type PaymentNetworkResult struct {
	Networks []string `json:"networks"`
	Primary  string   `json:"primary"`
}

// paymentNetworkMap maps ISO 4217 currency codes to their payment networks.
// Sources: BIS CPMI Red Book 2024; central bank / payment scheme operator publications.
var paymentNetworkMap = map[string]PaymentNetworkResult{
	// Americas
	"USD": {Networks: []string{"ACH", "Fedwire", "CHIPS"}, Primary: "ACH"},
	"CAD": {Networks: []string{"EFT", "Lynx"}, Primary: "EFT"},
	"BRL": {Networks: []string{"Pix", "TED"}, Primary: "Pix"},
	"MXN": {Networks: []string{"SPEI"}, Primary: "SPEI"},
	// Europe
	"GBP": {Networks: []string{"Faster Payments", "CHAPS", "BACS"}, Primary: "Faster Payments"},
	"EUR": {Networks: []string{"SEPA", "TARGET2", "SEPA Instant"}, Primary: "SEPA"},
	"CHF": {Networks: []string{"SIC", "SEPA"}, Primary: "SIC"},
	"NOK": {Networks: []string{"NICS"}, Primary: "NICS"},
	"SEK": {Networks: []string{"Bankgirot", "Swish"}, Primary: "Bankgirot"},
	"DKK": {Networks: []string{"Straks", "NETS"}, Primary: "Straks"},
	"PLN": {Networks: []string{"BLIK", "ELIXIR", "SORBNET"}, Primary: "BLIK"},
	"CZK": {Networks: []string{"CERTIS"}, Primary: "CERTIS"},
	"RON": {Networks: []string{"ReGIS", "SENT"}, Primary: "ReGIS"},
	"HUF": {Networks: []string{"GIRO", "VIBER"}, Primary: "GIRO"},
	"TRY": {Networks: []string{"FAST", "EFT"}, Primary: "FAST"},
	// Asia Pacific
	"INR": {Networks: []string{"UPI", "IMPS", "NEFT", "RTGS"}, Primary: "UPI"},
	"AUD": {Networks: []string{"NPP", "BECS"}, Primary: "NPP"},
	"NZD": {Networks: []string{"BECS", "ESAS"}, Primary: "BECS"},
	"SGD": {Networks: []string{"FAST", "MEPS+"}, Primary: "FAST"},
	"MYR": {Networks: []string{"DuitNow", "IBG"}, Primary: "DuitNow"},
	"JPY": {Networks: []string{"Zengin", "BOJ-NET"}, Primary: "Zengin"},
	"HKD": {Networks: []string{"FPS", "CHATS"}, Primary: "FPS"},
	"CNY": {Networks: []string{"CNAPS", "CIPS"}, Primary: "CNAPS"},
	"KRW": {Networks: []string{"KFTC", "EFT"}, Primary: "KFTC"},
	"TWD": {Networks: []string{"CIFS"}, Primary: "CIFS"},
	"IDR": {Networks: []string{"BI-FAST", "BI-RTGS"}, Primary: "BI-FAST"},
	"THB": {Networks: []string{"PromptPay", "BAHTNET"}, Primary: "PromptPay"},
	"PHP": {Networks: []string{"InstaPay", "PESONet"}, Primary: "InstaPay"},
	"VND": {Networks: []string{"NAPAS"}, Primary: "NAPAS"},
	"PKR": {Networks: []string{"Raast", "RTGS"}, Primary: "Raast"},
	"BDT": {Networks: []string{"BEFTN", "BD-RTGS"}, Primary: "BEFTN"},
	"LKR": {Networks: []string{"LankaPay", "SLIPS"}, Primary: "LankaPay"},
	// Middle East
	"AED": {Networks: []string{"UAEFTS", "IPP"}, Primary: "UAEFTS"},
	"SAR": {Networks: []string{"SARIE"}, Primary: "SARIE"},
	"QAR": {Networks: []string{"QATCH"}, Primary: "QATCH"},
	"BHD": {Networks: []string{"Fawri+", "RTGS"}, Primary: "Fawri+"},
	"OMR": {Networks: []string{"BFTS", "RTGS"}, Primary: "BFTS"},
	// Africa
	"ZAR": {Networks: []string{"RTC", "SAMOS"}, Primary: "RTC"},
	"KES": {Networks: []string{"PesaLink", "RTGS"}, Primary: "PesaLink"},
	"NGN": {Networks: []string{"NIP", "RTGS"}, Primary: "NIP"},
	"GHS": {Networks: []string{"GhIPSS"}, Primary: "GhIPSS"},
	"EGP": {Networks: []string{"ACH", "RTGS"}, Primary: "ACH"},
}

// GetPaymentNetwork returns the payment networks available for the given ISO 4217
// currency code. Returns an error if the currency is not in the supported set.
func GetPaymentNetwork(currencyCode string) (PaymentNetworkResult, error) {
	if strings.TrimSpace(currencyCode) == "" {
		return PaymentNetworkResult{}, fmt.Errorf("banking: GetPaymentNetwork: currencyCode must be a non-empty string")
	}
	result, ok := paymentNetworkMap[strings.ToUpper(strings.TrimSpace(currencyCode))]
	if !ok {
		return PaymentNetworkResult{}, fmt.Errorf("banking: GetPaymentNetwork: currency code %q is not supported", currencyCode)
	}
	return result, nil
}
