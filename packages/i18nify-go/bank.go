package i18nify_go

import (
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/bankcodes"
)

type Bank struct {
	CountryCode string
}

func (b *Bank) GetBankInfo() (map[string]interface{}, error) {
	return bankcodes.GetBanksInfo(b.CountryCode)
}

func (b *Bank) GetBankShortCodeFromBankName(bankName string) (string, error) {
	return bankcodes.GetSwiftCodeFromBankShortCode(b.CountryCode, bankName)
}

func NewBank(countryCode string) *Bank {
	return &Bank{
		CountryCode: countryCode,
	}
}
