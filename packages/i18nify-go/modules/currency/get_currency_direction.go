package currency

import "fmt"

// GetCurrencyDirection returns "rtl" when the currency's canonical symbol contains
// Arabic- or Hebrew-script characters, "ltr" otherwise.
// Detected RTL currencies (from i18nify canonical data): AED, AFN, BHD, DZD, IQD, IRR, KWD, OMR, QAR, SAR, YER.
func GetCurrencyDirection(currencyCode string) (string, error) {
	if currencyCode == "" {
		return "", fmt.Errorf("currency code cannot be empty")
	}
	info, err := GetCurrencyInformation(currencyCode)
	if err != nil {
		return "", fmt.Errorf("failed to retrieve currency information for code '%s': %v", currencyCode, err)
	}
	for _, r := range info.Symbol {
		if isRTLRune(r) {
			return "rtl", nil
		}
	}
	return "ltr", nil
}

// isRTLRune reports whether r belongs to a right-to-left Unicode script
// (Hebrew, Arabic, Arabic Supplement/Extended, Arabic Presentation Forms A/B).
func isRTLRune(r rune) bool {
	return (r >= 0x0590 && r <= 0x05FF) || // Hebrew
		(r >= 0x0600 && r <= 0x06FF) || // Arabic
		(r >= 0x0750 && r <= 0x077F) || // Arabic Supplement
		(r >= 0x08A0 && r <= 0x08FF) || // Arabic Extended-A
		(r >= 0xFB50 && r <= 0xFDFF) || // Arabic Presentation Forms-A
		(r >= 0xFE70 && r <= 0xFEFF) // Arabic Presentation Forms-B
}
