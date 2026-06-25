package geo

import (
	"fmt"
	"strings"
)

// CountryTaxDefinition describes the primary indirect tax system for a country.
// StandardRate is the headline rate in percent; 0 means no general indirect tax
// or rate varies (see Notes).
type CountryTaxDefinition struct {
	TaxName      string  `json:"tax_name"`
	FullName     string  `json:"full_name"`
	StandardRate float64 `json:"standard_rate"`
	Notes        string  `json:"notes"`
}

// taxDefinitions maps ISO 3166-1 alpha-2 country codes to their tax definitions.
// Source: OECD Consumption Tax Trends 2024; country tax authority publications.
var taxDefinitions = map[string]CountryTaxDefinition{
	// GST — Goods and Services Tax
	"AU": {TaxName: "GST", FullName: "Goods and Services Tax", StandardRate: 10, Notes: ""},
	"IN": {TaxName: "GST", FullName: "Goods and Services Tax", StandardRate: 18, Notes: "Multiple slabs: 0%, 5%, 12%, 18%, 28%"},
	"NZ": {TaxName: "GST", FullName: "Goods and Services Tax", StandardRate: 15, Notes: ""},
	"SG": {TaxName: "GST", FullName: "Goods and Services Tax", StandardRate: 9, Notes: ""},
	"PK": {TaxName: "GST", FullName: "General Sales Tax", StandardRate: 17, Notes: ""},
	"CA": {TaxName: "GST/HST", FullName: "Goods and Services Tax / Harmonized Sales Tax", StandardRate: 5, Notes: "Federal GST 5%; provincial HST 13–15% in participating provinces"},
	// SST
	"MY": {TaxName: "SST", FullName: "Sales and Service Tax", StandardRate: 10, Notes: "Sales Tax 10%; Service Tax 8%"},
	// Sales Tax
	"US": {TaxName: "Sales Tax", FullName: "Sales Tax", StandardRate: 0, Notes: "No federal rate; varies by state (0–10.25%)"},
	// Consumption Tax
	"JP": {TaxName: "CT", FullName: "Consumption Tax", StandardRate: 10, Notes: ""},
	// VAT — EU members
	"AT": {TaxName: "MwSt", FullName: "Mehrwertsteuer", StandardRate: 20, Notes: ""},
	"BE": {TaxName: "TVA/BTW", FullName: "Taxe sur la Valeur Ajoutée / Belasting over de Toegevoegde Waarde", StandardRate: 21, Notes: ""},
	"BG": {TaxName: "ДДС", FullName: "Данък върху добавената стойност", StandardRate: 20, Notes: ""},
	"HR": {TaxName: "PDV", FullName: "Porez na dodanu vrijednost", StandardRate: 25, Notes: ""},
	"CY": {TaxName: "ΦΠΑ", FullName: "Φόρος Προστιθέμενης Αξίας", StandardRate: 19, Notes: ""},
	"CZ": {TaxName: "DPH", FullName: "Daň z přidané hodnoty", StandardRate: 21, Notes: ""},
	"DK": {TaxName: "MOMS", FullName: "Merværdiafgift", StandardRate: 25, Notes: ""},
	"EE": {TaxName: "KM", FullName: "Käibemaks", StandardRate: 22, Notes: ""},
	"FI": {TaxName: "ALV", FullName: "Arvonlisävero", StandardRate: 25.5, Notes: ""},
	"FR": {TaxName: "TVA", FullName: "Taxe sur la Valeur Ajoutée", StandardRate: 20, Notes: ""},
	"DE": {TaxName: "MwSt", FullName: "Mehrwertsteuer", StandardRate: 19, Notes: ""},
	"GR": {TaxName: "ΦΠΑ", FullName: "Φόρος Προστιθέμενης Αξίας", StandardRate: 24, Notes: ""},
	"HU": {TaxName: "ÁFA", FullName: "Általános Forgalmi Adó", StandardRate: 27, Notes: ""},
	"IE": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 23, Notes: ""},
	"IT": {TaxName: "IVA", FullName: "Imposta sul Valore Aggiunto", StandardRate: 22, Notes: ""},
	"LV": {TaxName: "PVN", FullName: "Pievienotās vērtības nodoklis", StandardRate: 21, Notes: ""},
	"LT": {TaxName: "PVM", FullName: "Pridėtinės vertės mokestis", StandardRate: 21, Notes: ""},
	"LU": {TaxName: "TVA", FullName: "Taxe sur la Valeur Ajoutée", StandardRate: 17, Notes: ""},
	"MT": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 18, Notes: ""},
	"NL": {TaxName: "BTW", FullName: "Belasting over de Toegevoegde Waarde", StandardRate: 21, Notes: ""},
	"PL": {TaxName: "VAT", FullName: "Podatek od towarów i usług", StandardRate: 23, Notes: ""},
	"PT": {TaxName: "IVA", FullName: "Imposto sobre o Valor Acrescentado", StandardRate: 23, Notes: ""},
	"RO": {TaxName: "TVA", FullName: "Taxa pe Valoarea Adăugată", StandardRate: 19, Notes: ""},
	"SK": {TaxName: "DPH", FullName: "Daň z pridanej hodnoty", StandardRate: 23, Notes: ""},
	"SI": {TaxName: "DDV", FullName: "Davek na dodano vrednost", StandardRate: 22, Notes: ""},
	"ES": {TaxName: "IVA", FullName: "Impuesto sobre el Valor Añadido", StandardRate: 21, Notes: ""},
	"SE": {TaxName: "MOMS", FullName: "Mervärdesskatt", StandardRate: 25, Notes: ""},
	// VAT — non-EU Europe
	"GB": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 20, Notes: ""},
	"NO": {TaxName: "MVA", FullName: "Merverdiavgift", StandardRate: 25, Notes: ""},
	"CH": {TaxName: "MWST", FullName: "Mehrwertsteuer", StandardRate: 8.1, Notes: ""},
	"IS": {TaxName: "VSK", FullName: "Virðisaukaskattur", StandardRate: 24, Notes: ""},
	"TR": {TaxName: "KDV", FullName: "Katma Değer Vergisi", StandardRate: 20, Notes: ""},
	"RU": {TaxName: "НДС", FullName: "Налог на добавленную стоимость", StandardRate: 20, Notes: ""},
	"UA": {TaxName: "ПДВ", FullName: "Податок на додану вартість", StandardRate: 20, Notes: ""},
	// VAT — Middle East & Africa
	"AE": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 5, Notes: ""},
	"SA": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 15, Notes: ""},
	"BH": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 10, Notes: ""},
	"EG": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 14, Notes: ""},
	"NG": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 7.5, Notes: ""},
	"ZA": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 15, Notes: ""},
	"KE": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 16, Notes: ""},
	"GH": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 15, Notes: ""},
	"ET": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 15, Notes: ""},
	"TZ": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 18, Notes: ""},
	// VAT — Asia Pacific
	"CN": {TaxName: "VAT", FullName: "Value Added Tax (增值税)", StandardRate: 13, Notes: "Reduced rates 9% and 6% apply to essential goods and services"},
	"KR": {TaxName: "VAT", FullName: "Value Added Tax (부가가치세)", StandardRate: 10, Notes: ""},
	"TW": {TaxName: "VAT", FullName: "Business Tax (加值型及非加值型營業稅)", StandardRate: 5, Notes: ""},
	"TH": {TaxName: "VAT", FullName: "Value Added Tax (ภาษีมูลค่าเพิ่ม)", StandardRate: 7, Notes: ""},
	"PH": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 12, Notes: ""},
	"ID": {TaxName: "PPN", FullName: "Pajak Pertambahan Nilai", StandardRate: 12, Notes: ""},
	"VN": {TaxName: "VAT", FullName: "Thuế Giá Trị Gia Tăng", StandardRate: 10, Notes: ""},
	"LK": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 18, Notes: ""},
	"BD": {TaxName: "VAT", FullName: "Value Added Tax (মূল্য সংযোজন কর)", StandardRate: 15, Notes: ""},
	"MM": {TaxName: "CT", FullName: "Commercial Tax", StandardRate: 5, Notes: ""},
	"KH": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 10, Notes: ""},
	// VAT — Americas
	"BR": {TaxName: "IBS/CBS", FullName: "Imposto sobre Bens e Serviços / Contribuição sobre Bens e Serviços", StandardRate: 26.5, Notes: "Under tax reform (2024–2033); previously ICMS/ISS/PIS/COFINS"},
	"MX": {TaxName: "IVA", FullName: "Impuesto al Valor Agregado", StandardRate: 16, Notes: ""},
	"AR": {TaxName: "IVA", FullName: "Impuesto al Valor Agregado", StandardRate: 21, Notes: ""},
	"CL": {TaxName: "IVA", FullName: "Impuesto al Valor Agregado", StandardRate: 19, Notes: ""},
	"CO": {TaxName: "IVA", FullName: "Impuesto al Valor Agregado", StandardRate: 19, Notes: ""},
	"PE": {TaxName: "IGV", FullName: "Impuesto General a las Ventas", StandardRate: 18, Notes: ""},
	"EC": {TaxName: "IVA", FullName: "Impuesto al Valor Agregado", StandardRate: 15, Notes: ""},
	"UY": {TaxName: "IVA", FullName: "Impuesto al Valor Agregado", StandardRate: 22, Notes: ""},
	// No general indirect tax
	"HK": {TaxName: "", FullName: "No general indirect tax", StandardRate: 0, Notes: "No VAT or GST"},
	"KW": {TaxName: "", FullName: "No general indirect tax", StandardRate: 0, Notes: "No VAT or GST"},
	"QA": {TaxName: "", FullName: "No general indirect tax", StandardRate: 0, Notes: "VAT planned but not yet implemented as of 2025"},
	"OM": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 5, Notes: ""},
}

// GetCountryTaxDefinition returns the primary indirect tax definition for the
// given ISO 3166-1 alpha-2 country code.
func GetCountryTaxDefinition(countryCode string) (CountryTaxDefinition, error) {
	if strings.TrimSpace(countryCode) == "" {
		return CountryTaxDefinition{}, fmt.Errorf("geo: GetCountryTaxDefinition: countryCode must be a non-empty string")
	}
	def, ok := taxDefinitions[strings.ToUpper(strings.TrimSpace(countryCode))]
	if !ok {
		return CountryTaxDefinition{}, fmt.Errorf("geo: GetCountryTaxDefinition: country code %q is not supported", countryCode)
	}
	return def, nil
}
