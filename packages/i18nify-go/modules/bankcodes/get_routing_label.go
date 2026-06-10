package bankcodes

import (
	"fmt"
	"strings"
)

// RoutingCodeLabel holds display metadata for a payment routing code type.
type RoutingCodeLabel struct {
	Label       string `json:"label"`
	FullName    string `json:"full_name"`
	Description string `json:"description"`
	Country     string `json:"country,omitempty"` // ISO 3166-1 alpha-2; empty for global codes
}

// routingLabelMap maps routing code type identifiers to their display metadata.
// Sources: ISO 9362 (SWIFT/BIC), ISO 13616 (IBAN), RBI (IFSC),
//
//	UK PSR (Sort Code), APCA (BSB), ABA (Routing Number),
//	Banco de México (CLABE), PBOC (CNAPS), Payments Canada (Transit).
var routingLabelMap = map[string]RoutingCodeLabel{
	"IFSC": {
		Label:       "IFSC",
		FullName:    "Indian Financial System Code",
		Description: "11-character alphanumeric code issued by the RBI that identifies bank branches in India; required for NEFT, RTGS, and IMPS transfers.",
		Country:     "IN",
	},
	"SWIFT": {
		Label:       "SWIFT Code",
		FullName:    "SWIFT/BIC Code",
		Description: "8 or 11-character Business Identifier Code (ISO 9362) that uniquely identifies a financial institution for international wire transfers.",
	},
	"BIC": {
		Label:       "BIC",
		FullName:    "Bank Identifier Code",
		Description: "8 or 11-character Business Identifier Code (ISO 9362) used for international interbank transactions; also known as SWIFT code.",
	},
	"ROUTING_NUMBER": {
		Label:       "Routing Number",
		FullName:    "ABA Routing Number",
		Description: "9-digit transit number assigned by the American Bankers Association that identifies a US financial institution for ACH and wire transfers.",
		Country:     "US",
	},
	"ABA": {
		Label:       "ABA Routing Number",
		FullName:    "ABA Routing Number",
		Description: "9-digit transit number assigned by the American Bankers Association that identifies a US financial institution for ACH and wire transfers.",
		Country:     "US",
	},
	"SORT_CODE": {
		Label:       "Sort Code",
		FullName:    "UK Sort Code",
		Description: "6-digit code (XX-XX-XX) assigned by UK banks that identifies the bank and branch for domestic Faster Payments, BACS, and CHAPS transfers.",
		Country:     "GB",
	},
	"BSB": {
		Label:       "BSB Number",
		FullName:    "Bank State Branch Number",
		Description: "6-digit code assigned by the Australian Payments Network that identifies a bank and branch for domestic direct credit and debit transactions.",
		Country:     "AU",
	},
	"IBAN": {
		Label:       "IBAN",
		FullName:    "International Bank Account Number",
		Description: "Up to 34-character alphanumeric code (ISO 13616) that internationally identifies a bank account, used across SEPA and 80+ countries.",
	},
	"CLABE": {
		Label:       "CLABE",
		FullName:    "Standardized Banking Code (CLABE)",
		Description: "18-digit standardized account number regulated by Banco de México; required for all electronic interbank transfers within Mexico.",
		Country:     "MX",
	},
	"CNAPS": {
		Label:       "CNAPS Code",
		FullName:    "CNAPS Routing Code",
		Description: "12-digit code assigned by the People's Bank of China that identifies financial institution branches within the China National Advanced Payment System.",
		Country:     "CN",
	},
	"TRANSIT": {
		Label:       "Transit Number",
		FullName:    "Bank Transit Number",
		Description: "9-digit Canadian bank transit number comprising a 5-digit branch number and 3-digit institution number, used for EFT and direct deposit.",
		Country:     "CA",
	},
	"MICR": {
		Label:       "MICR Code",
		FullName:    "MICR Code",
		Description: "9-digit code printed on Indian bank cheques using Magnetic Ink Character Recognition technology, used to identify the bank and branch during cheque processing.",
		Country:     "IN",
	},
}

// GetRoutingLabel returns the display metadata for the given routing code type identifier.
//
// Lookup is case-insensitive. Returns an error for empty or unsupported type strings.
//
// Examples:
//
//	GetRoutingLabel("IFSC")         → {IFSC, Indian Financial System Code, ..., IN}
//	GetRoutingLabel("sort_code")    → {Sort Code, UK Sort Code, ..., GB}
//	GetRoutingLabel("IBAN")         → {IBAN, International Bank Account Number, ..., ""}
func GetRoutingLabel(routingCodeType string) (RoutingCodeLabel, error) {
	if strings.TrimSpace(routingCodeType) == "" {
		return RoutingCodeLabel{}, fmt.Errorf("getRoutingLabel: routing code type must not be empty")
	}

	key := strings.ToUpper(strings.TrimSpace(routingCodeType))
	label, ok := routingLabelMap[key]
	if !ok {
		return RoutingCodeLabel{}, fmt.Errorf(
			"getRoutingLabel: routing code type %q is not supported",
			routingCodeType,
		)
	}
	return label, nil
}
