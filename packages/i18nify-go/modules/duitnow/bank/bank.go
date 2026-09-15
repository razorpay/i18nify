// Package bank provides the bank master data for DuitNow online banking
// (PayNet, Malaysia): the supported bank codes, the FPX/OBW bank table, the codes
// for which the OBW rail is enabled, and lookups over them.
package bank

import (
	"fmt"
	"strings"

	dataSource "github.com/razorpay/i18nify/i18nify-data/go/duitnow"
)

// CorporateSuffix marks a corporate bank code: "PHBM" is retail, "PHBM_C" is corporate.
const CorporateSuffix = "_C"

// Bank maps a canonical bank key onto its FPX and OBW codes. An empty code means
// that rail is unavailable for the bank.
type Bank struct {
	Key     string
	Name    string
	FPXCode string
	OBWCode string
}

var (
	banks           []Bank
	obwEnabledCodes []string

	retailBanks    []string
	corporateBanks []string

	supportedSet  map[string]struct{}
	obwEnabledSet map[string]struct{}
	bankIndex     map[string]Bank
)

func init() {
	d, err := dataSource.GetDuitNowBanks()
	if err != nil {
		panic(fmt.Sprintf("failed to load duitnow bank data: %v", err))
	}

	supported := d.GetSupportedBanks()
	supportedSet = make(map[string]struct{}, len(supported)*2)
	for _, b := range supported {
		if b.GetRetail() {
			retailBanks = append(retailBanks, b.GetCode())
			supportedSet[b.GetCode()] = struct{}{}
		}
		if b.GetCorporate() {
			code := b.GetCode() + CorporateSuffix
			corporateBanks = append(corporateBanks, code)
			supportedSet[code] = struct{}{}
		}
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
	obwEnabledSet = make(map[string]struct{}, len(obwEnabledCodes))
	for _, code := range obwEnabledCodes {
		obwEnabledSet[code] = struct{}{}
	}

	bankIndex = buildBankIndex(banks)
}

// buildBankIndex resolves a rail code onto its table row.
//
// Rows overlap: CIMB has both {Key: CIBB, FPX: CIBB, OBW: CIMY} and {Key: CIMY, OBW: CIMY}, so
// the code CIMY matches two rows. Indexing OBW then FPX per row, in table order, makes the LAST
// matching row win, so CIMY keys as CIMY. Taking the first match instead would key it as CIBB,
// collapsing CIMB's online-banking entry into its FPX one. Keep the build order.
func buildBankIndex(rows []Bank) map[string]Bank {
	m := make(map[string]Bank, len(rows)*2)
	for _, b := range rows {
		if b.OBWCode != "" {
			m[b.OBWCode] = b
		}
		if b.FPXCode != "" {
			m[b.FPXCode] = b
		}
	}
	// Canonical keys resolve to themselves unless a rail code already claimed them.
	for _, b := range rows {
		if _, taken := m[b.Key]; !taken {
			m[b.Key] = b
		}
	}
	return m
}

// GetSupportedBanks returns every accepted bank code: the retail codes followed by the
// corporate codes, which carry CorporateSuffix.
func GetSupportedBanks() []string {
	out := make([]string, 0, len(retailBanks)+len(corporateBanks))
	out = append(out, retailBanks...)
	return append(out, corporateBanks...)
}

// GetRetailBanks returns the supported retail bank codes, in data order.
func GetRetailBanks() []string {
	return append([]string(nil), retailBanks...)
}

// GetCorporateBanks returns the supported corporate bank codes, each carrying CorporateSuffix.
func GetCorporateBanks() []string {
	return append([]string(nil), corporateBanks...)
}

// GetBanks returns the FPX/OBW bank table in data order.
func GetBanks() []Bank {
	return append([]Bank(nil), banks...)
}

// GetObwEnabledCodes returns the bank codes for which the OBW rail is enabled.
func GetObwEnabledCodes() []string {
	return append([]string(nil), obwEnabledCodes...)
}

// IsSupportedBank reports whether a bank code, retail or corporate, is accepted.
// Matching is exact: codes are upper-case and corporate codes carry CorporateSuffix.
func IsSupportedBank(code string) bool {
	_, ok := supportedSet[code]
	return ok
}

// IsCorporateBank reports whether a bank code is a corporate code, i.e. ends in CorporateSuffix.
// It checks the code's form only; use IsSupportedBank to check that the bank is accepted.
func IsCorporateBank(code string) bool {
	return strings.HasSuffix(code, CorporateSuffix)
}

// IsObwEnabled reports whether the OBW rail is enabled for a bank code.
func IsObwEnabled(code string) bool {
	_, ok := obwEnabledSet[code]
	return ok
}

// LookupBank returns the table row for a bank code, matching on the canonical key or
// either rail's code. Corporate codes have no row of their own, so CorporateSuffix is
// stripped first and a corporate code resolves onto its retail row.
func LookupBank(code string) (Bank, bool) {
	b, ok := bankIndex[strings.TrimSuffix(code, CorporateSuffix)]
	return b, ok
}

// CanonicalKey maps a rail code onto its bank's canonical key, falling back to the code
// itself so an unrecognised bank is passed through.
func CanonicalKey(code string) string {
	if b, ok := bankIndex[code]; ok {
		return b.Key
	}
	return code
}
