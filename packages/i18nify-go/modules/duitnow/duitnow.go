// Package duitnow provides the bank master data for DuitNow online banking
// (PayNet, Malaysia): the supported bank codes, the FPX/OBW bank table, and the
// codes for which the OBW rail is enabled.
package duitnow

import (
	"fmt"

	dataSource "github.com/razorpay/i18nify/i18nify-data/go/duitnow"
)

// SupportedBank is a bank code accepted for DuitNow online banking, and the
// segments it is accepted for.
type SupportedBank struct {
	Code      string
	Retail    bool
	Corporate bool
}

// Bank maps a canonical bank key onto its FPX and OBW codes. An empty code means
// that rail is unavailable for the bank.
type Bank struct {
	Key     string
	Name    string
	FPXCode string
	OBWCode string
}

var (
	supportedBanks  []SupportedBank
	banks           []Bank
	obwEnabledCodes []string
)

func init() {
	d, err := dataSource.GetDuitNowBanks()
	if err != nil {
		panic(fmt.Sprintf("failed to load duitnow bank data: %v", err))
	}

	for _, b := range d.GetSupportedBanks() {
		supportedBanks = append(supportedBanks, SupportedBank{
			Code:      b.GetCode(),
			Retail:    b.GetRetail(),
			Corporate: b.GetCorporate(),
		})
	}
	for _, b := range d.GetBanks() {
		banks = append(banks, Bank{
			Key:     b.GetKey(),
			Name:    b.GetName(),
			FPXCode: b.GetFpxCode(),
			OBWCode: b.GetObwCode(),
		})
	}
	obwEnabledCodes = append(obwEnabledCodes, d.GetObwEnabledCodes()...)
}

// GetSupportedBanks returns every bank code accepted for DuitNow online banking.
func GetSupportedBanks() []SupportedBank {
	return append([]SupportedBank(nil), supportedBanks...)
}

// GetBanks returns the FPX/OBW bank table in data order. Rows can share a code,
// so callers that index the table by code must respect this order.
func GetBanks() []Bank {
	return append([]Bank(nil), banks...)
}

// GetObwEnabledCodes returns the bank codes for which the OBW rail is enabled.
func GetObwEnabledCodes() []string {
	return append([]string(nil), obwEnabledCodes...)
}
