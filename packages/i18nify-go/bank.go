package i18nify_go

import (
	"github.com/razorpay/i18nify/packages/i18nify-go/modules/bankcodes"
)

type Bank struct {
	CountryCode string
}

func (b *Bank) GetAllBanksWithShortCodes() (map[string]string, error) {
	return bankcodes.GetAllBanksWithShortCodes(b.CountryCode)
}

func (b *Bank) GetBaseBranchIdentifierFromShortCode(bankName string) (string, error) {
	return bankcodes.GetBaseBranchIdentifierFromShortCode(b.CountryCode, bankName)
}

func NewBank(countryCode string) *Bank {
	return &Bank{
		CountryCode: countryCode,
	}
}
