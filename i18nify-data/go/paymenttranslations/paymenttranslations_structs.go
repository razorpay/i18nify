// Hand-written Go structs for paymenttranslations.
// Matches the canonical i18nify-data/payment-translations/data.json schema.

package paymenttranslations

// PaymentTranslationsData is the root container.
type PaymentTranslationsData struct {
	PaymentTranslationInformation map[string]*PaymentTranslationsInfo `json:"payment_translation_information,omitempty"`
}

func (x *PaymentTranslationsData) GetPaymentTranslationInformation() map[string]*PaymentTranslationsInfo {
	if x != nil {
		return x.PaymentTranslationInformation
	}
	return nil
}

// PaymentTranslationsInfo holds all fields for a single language entry.
type PaymentTranslationsInfo struct {
	LanguageName string          `json:"language_name,omitempty"`
	NativeName   string          `json:"native_name,omitempty"`
	Strings      *PaymentStrings `json:"strings,omitempty"`
}

func (x *PaymentTranslationsInfo) GetLanguageName() string {
	if x != nil {
		return x.LanguageName
	}
	return ""
}

func (x *PaymentTranslationsInfo) GetNativeName() string {
	if x != nil {
		return x.NativeName
	}
	return ""
}

func (x *PaymentTranslationsInfo) GetStrings() *PaymentStrings {
	if x != nil {
		return x.Strings
	}
	return nil
}

// PaymentStrings contains the translated payment UI strings.
type PaymentStrings struct {
	PayNow            string `json:"pay_now,omitempty"`
	Cancel            string `json:"cancel,omitempty"`
	Amount            string `json:"amount,omitempty"`
	CardNumber        string `json:"card_number,omitempty"`
	CVV               string `json:"cvv,omitempty"`
	ExpiryDate        string `json:"expiry_date,omitempty"`
	NameOnCard        string `json:"name_on_card,omitempty"`
	UPIID             string `json:"upi_id,omitempty"`
	Bank              string `json:"bank,omitempty"`
	Processing        string `json:"processing,omitempty"`
	PaymentSuccessful string `json:"payment_successful,omitempty"`
	PaymentFailed     string `json:"payment_failed,omitempty"`
	Retry             string `json:"retry,omitempty"`
	MobileNumber      string `json:"mobile_number,omitempty"`
	OTP               string `json:"otp,omitempty"`
	EnterOTP          string `json:"enter_otp,omitempty"`
	ResendOTP         string `json:"resend_otp,omitempty"`
	Wallet            string `json:"wallet,omitempty"`
	NetBanking        string `json:"net_banking,omitempty"`
	SelectBank        string `json:"select_bank,omitempty"`
	EnterAmount       string `json:"enter_amount,omitempty"`
	MinimumAmount     string `json:"minimum_amount,omitempty"`
	MaximumAmount     string `json:"maximum_amount,omitempty"`
	TransactionID     string `json:"transaction_id,omitempty"`
	OrderID           string `json:"order_id,omitempty"`
	Back              string `json:"back,omitempty"`
	Next              string `json:"next,omitempty"`
	Confirm           string `json:"confirm,omitempty"`
	Done              string `json:"done,omitempty"`
	Save              string `json:"save,omitempty"`
	ErrorOccurred     string `json:"error_occurred,omitempty"`
	TryAgain          string `json:"try_again,omitempty"`
}
