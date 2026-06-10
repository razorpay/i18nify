// Hand-written Go structs mirroring paymenttranslations.proto — protoc not available.
// Matches the canonical i18nify-data/paymenttranslations/data.json schema.

package paymenttranslations

// PaymentTranslationsData is the root container.
type PaymentTranslationsData struct {
	PaymentTranslationsInformation map[string]*PaymentTranslationsInfo `json:"payment_translations_information,omitempty"`
}

func (x *PaymentTranslationsData) GetPaymentTranslationsInformation() map[string]*PaymentTranslationsInfo {
	if x != nil {
		return x.PaymentTranslationsInformation
	}
	return nil
}

// PaymentTranslationsInfo holds all payment UI string fields for one locale.
type PaymentTranslationsInfo struct {
	LanguageName string `json:"language_name,omitempty"`
	Script string `json:"script,omitempty"`
	PayNow string `json:"pay_now,omitempty"`
	Amount string `json:"amount,omitempty"`
	Cancel string `json:"cancel,omitempty"`
	Confirm string `json:"confirm,omitempty"`
	PaymentSuccessful string `json:"payment_successful,omitempty"`
	PaymentFailed string `json:"payment_failed,omitempty"`
	Processing string `json:"processing,omitempty"`
	Total string `json:"total,omitempty"`
	Retry string `json:"retry,omitempty"`
	EnterAmount string `json:"enter_amount,omitempty"`
	CardNumber string `json:"card_number,omitempty"`
	CardExpiry string `json:"card_expiry,omitempty"`
	Cvv string `json:"cvv,omitempty"`
	NameOnCard string `json:"name_on_card,omitempty"`
	UpiId string `json:"upi_id,omitempty"`
	NetBanking string `json:"net_banking,omitempty"`
	Wallet string `json:"wallet,omitempty"`
	TransactionId string `json:"transaction_id,omitempty"`
	Back string `json:"back,omitempty"`
	ErrorTryAgain string `json:"error_try_again,omitempty"`
	OrderId string `json:"order_id,omitempty"`
	Receipt string `json:"receipt,omitempty"`
}

func (x *PaymentTranslationsInfo) GetLanguageName() string {
	if x != nil { return x.LanguageName }
	return ""
}

func (x *PaymentTranslationsInfo) GetScript() string {
	if x != nil { return x.Script }
	return ""
}

func (x *PaymentTranslationsInfo) GetPayNow() string {
	if x != nil { return x.PayNow }
	return ""
}

func (x *PaymentTranslationsInfo) GetAmount() string {
	if x != nil { return x.Amount }
	return ""
}

func (x *PaymentTranslationsInfo) GetCancel() string {
	if x != nil { return x.Cancel }
	return ""
}

func (x *PaymentTranslationsInfo) GetConfirm() string {
	if x != nil { return x.Confirm }
	return ""
}

func (x *PaymentTranslationsInfo) GetPaymentSuccessful() string {
	if x != nil { return x.PaymentSuccessful }
	return ""
}

func (x *PaymentTranslationsInfo) GetPaymentFailed() string {
	if x != nil { return x.PaymentFailed }
	return ""
}

func (x *PaymentTranslationsInfo) GetProcessing() string {
	if x != nil { return x.Processing }
	return ""
}

func (x *PaymentTranslationsInfo) GetTotal() string {
	if x != nil { return x.Total }
	return ""
}

func (x *PaymentTranslationsInfo) GetRetry() string {
	if x != nil { return x.Retry }
	return ""
}

func (x *PaymentTranslationsInfo) GetEnterAmount() string {
	if x != nil { return x.EnterAmount }
	return ""
}

func (x *PaymentTranslationsInfo) GetCardNumber() string {
	if x != nil { return x.CardNumber }
	return ""
}

func (x *PaymentTranslationsInfo) GetCardExpiry() string {
	if x != nil { return x.CardExpiry }
	return ""
}

func (x *PaymentTranslationsInfo) GetCvv() string {
	if x != nil { return x.Cvv }
	return ""
}

func (x *PaymentTranslationsInfo) GetNameOnCard() string {
	if x != nil { return x.NameOnCard }
	return ""
}

func (x *PaymentTranslationsInfo) GetUpiId() string {
	if x != nil { return x.UpiId }
	return ""
}

func (x *PaymentTranslationsInfo) GetNetBanking() string {
	if x != nil { return x.NetBanking }
	return ""
}

func (x *PaymentTranslationsInfo) GetWallet() string {
	if x != nil { return x.Wallet }
	return ""
}

func (x *PaymentTranslationsInfo) GetTransactionId() string {
	if x != nil { return x.TransactionId }
	return ""
}

func (x *PaymentTranslationsInfo) GetBack() string {
	if x != nil { return x.Back }
	return ""
}

func (x *PaymentTranslationsInfo) GetErrorTryAgain() string {
	if x != nil { return x.ErrorTryAgain }
	return ""
}

func (x *PaymentTranslationsInfo) GetOrderId() string {
	if x != nil { return x.OrderId }
	return ""
}

func (x *PaymentTranslationsInfo) GetReceipt() string {
	if x != nil { return x.Receipt }
	return ""
}
