package tax

import (
	"fmt"
	"strings"
)

// CountryTaxDefinition holds the tax system information for a country.
type CountryTaxDefinition struct {
	TaxName      string  `json:"tax_name"`
	FullName     string  `json:"full_name"`
	StandardRate float64 `json:"standard_rate"`
	Notes        string  `json:"notes,omitempty"`
}

// taxDefinitions maps ISO 3166-1 alpha-2 country codes to their tax system.
// standard_rate is the standard/headline rate as a percentage.
// 0 means no federal/general indirect tax or rate is non-uniform (see Notes).
// Source: OECD Consumption Tax Trends 2024; country tax authority publications.
var taxDefinitions = map[string]CountryTaxDefinition{
	// GST — Goods and Services Tax
	"AU": {TaxName: "GST", FullName: "Goods and Services Tax", StandardRate: 10},
	"IN": {TaxName: "GST", FullName: "Goods and Services Tax", StandardRate: 18, Notes: "Multiple slabs: 0%, 5%, 12%, 18%, 28%"},
	"NZ": {TaxName: "GST", FullName: "Goods and Services Tax", StandardRate: 15},
	"SG": {TaxName: "GST", FullName: "Goods and Services Tax", StandardRate: 9},
	"PK": {TaxName: "GST", FullName: "General Sales Tax", StandardRate: 17},
	"CA": {TaxName: "GST/HST", FullName: "Goods and Services Tax / Harmonized Sales Tax", StandardRate: 5, Notes: "Federal GST 5%; provincial HST 13–15% in participating provinces"},

	// SST — Sales and Service Tax
	"MY": {TaxName: "SST", FullName: "Sales and Service Tax", StandardRate: 10, Notes: "Sales Tax 10%; Service Tax 8%"},

	// Sales Tax (US: no federal rate)
	"US": {TaxName: "Sales Tax", FullName: "Sales Tax", StandardRate: 0, Notes: "No federal rate; varies by state (0–10.25%)"},

	// Consumption Tax
	"JP": {TaxName: "CT", FullName: "Consumption Tax", StandardRate: 10},

	// VAT — EU members
	"AT": {TaxName: "MwSt", FullName: "Mehrwertsteuer", StandardRate: 20},
	"BE": {TaxName: "TVA/BTW", FullName: "Taxe sur la Valeur Ajoutée / Belasting over de Toegevoegde Waarde", StandardRate: 21},
	"BG": {TaxName: "ДДС", FullName: "Данък върху добавената стойност", StandardRate: 20},
	"HR": {TaxName: "PDV", FullName: "Porez na dodanu vrijednost", StandardRate: 25},
	"CY": {TaxName: "ΦΠΑ", FullName: "Φόρος Προστιθέμενης Αξίας", StandardRate: 19},
	"CZ": {TaxName: "DPH", FullName: "Daň z přidané hodnoty", StandardRate: 21},
	"DK": {TaxName: "MOMS", FullName: "Merværdiafgift", StandardRate: 25},
	"EE": {TaxName: "KM", FullName: "Käibemaks", StandardRate: 22},
	"FI": {TaxName: "ALV", FullName: "Arvonlisävero", StandardRate: 25.5},
	"FR": {TaxName: "TVA", FullName: "Taxe sur la Valeur Ajoutée", StandardRate: 20},
	"DE": {TaxName: "MwSt", FullName: "Mehrwertsteuer", StandardRate: 19},
	"GR": {TaxName: "ΦΠΑ", FullName: "Φόρος Προστιθέμενης Αξίας", StandardRate: 24},
	"HU": {TaxName: "ÁFA", FullName: "Általános Forgalmi Adó", StandardRate: 27},
	"IE": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 23},
	"IT": {TaxName: "IVA", FullName: "Imposta sul Valore Aggiunto", StandardRate: 22},
	"LV": {TaxName: "PVN", FullName: "Pievienotās vērtības nodoklis", StandardRate: 21},
	"LT": {TaxName: "PVM", FullName: "Pridėtinės vertės mokestis", StandardRate: 21},
	"LU": {TaxName: "TVA", FullName: "Taxe sur la Valeur Ajoutée", StandardRate: 17},
	"MT": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 18},
	"NL": {TaxName: "BTW", FullName: "Belasting over de Toegevoegde Waarde", StandardRate: 21},
	"PL": {TaxName: "VAT", FullName: "Podatek od towarów i usług", StandardRate: 23},
	"PT": {TaxName: "IVA", FullName: "Imposto sobre o Valor Acrescentado", StandardRate: 23},
	"RO": {TaxName: "TVA", FullName: "Taxa pe Valoarea Adăugată", StandardRate: 19},
	"SK": {TaxName: "DPH", FullName: "Daň z pridanej hodnoty", StandardRate: 23},
	"SI": {TaxName: "DDV", FullName: "Davek na dodano vrednost", StandardRate: 22},
	"ES": {TaxName: "IVA", FullName: "Impuesto sobre el Valor Añadido", StandardRate: 21},
	"SE": {TaxName: "MOMS", FullName: "Mervärdesskatt", StandardRate: 25},

	// VAT — non-EU Europe
	"GB": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 20},
	"NO": {TaxName: "MVA", FullName: "Merverdiavgift", StandardRate: 25},
	"CH": {TaxName: "MWST", FullName: "Mehrwertsteuer", StandardRate: 8.1},
	"IS": {TaxName: "VSK", FullName: "Virðisaukaskattur", StandardRate: 24},
	"TR": {TaxName: "KDV", FullName: "Katma Değer Vergisi", StandardRate: 20},
	"RU": {TaxName: "НДС", FullName: "Налог на добавленную стоимость", StandardRate: 20},
	"UA": {TaxName: "ПДВ", FullName: "Податок на додану вартість", StandardRate: 20},

	// VAT — Middle East & Africa
	"AE": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 5},
	"SA": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 15},
	"BH": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 10},
	"OM": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 5},
	"EG": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 14},
	"NG": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 7.5},
	"ZA": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 15},
	"KE": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 16},
	"GH": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 15},
	"ET": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 15},
	"TZ": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 18},

	// VAT — Asia Pacific
	"CN": {TaxName: "VAT", FullName: "Value Added Tax (增值税)", StandardRate: 13, Notes: "Reduced rates 9% and 6% apply to essential goods and services"},
	"KR": {TaxName: "VAT", FullName: "Value Added Tax (부가가치세)", StandardRate: 10},
	"TW": {TaxName: "VAT", FullName: "Business Tax (加值型及非加值型營業稅)", StandardRate: 5},
	"TH": {TaxName: "VAT", FullName: "Value Added Tax (ภาษีมูลค่าเพิ่ม)", StandardRate: 7},
	"PH": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 12},
	"ID": {TaxName: "PPN", FullName: "Pajak Pertambahan Nilai", StandardRate: 12},
	"VN": {TaxName: "VAT", FullName: "Thuế Giá Trị Gia Tăng", StandardRate: 10},
	"LK": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 18},
	"BD": {TaxName: "VAT", FullName: "Value Added Tax (মূল্য সংযোজন কর)", StandardRate: 15},
	"MM": {TaxName: "CT", FullName: "Commercial Tax", StandardRate: 5},
	"KH": {TaxName: "VAT", FullName: "Value Added Tax", StandardRate: 10},

	// VAT — Americas
	"BR": {TaxName: "IBS/CBS", FullName: "Imposto sobre Bens e Serviços / Contribuição sobre Bens e Serviços", StandardRate: 26.5, Notes: "Under tax reform (2024–2033); previously ICMS/ISS/PIS/COFINS"},
	"MX": {TaxName: "IVA", FullName: "Impuesto al Valor Agregado", StandardRate: 16},
	"AR": {TaxName: "IVA", FullName: "Impuesto al Valor Agregado", StandardRate: 21},
	"CL": {TaxName: "IVA", FullName: "Impuesto al Valor Agregado", StandardRate: 19},
	"CO": {TaxName: "IVA", FullName: "Impuesto al Valor Agregado", StandardRate: 19},
	"PE": {TaxName: "IGV", FullName: "Impuesto General a las Ventas", StandardRate: 18},
	"EC": {TaxName: "IVA", FullName: "Impuesto al Valor Agregado", StandardRate: 15},
	"UY": {TaxName: "IVA", FullName: "Impuesto al Valor Agregado", StandardRate: 22},

	// No general indirect tax
	"HK": {TaxName: "", FullName: "No general indirect tax", StandardRate: 0, Notes: "No VAT or GST"},
	"KW": {TaxName: "", FullName: "No general indirect tax", StandardRate: 0, Notes: "No VAT or GST"},
	"QA": {TaxName: "", FullName: "No general indirect tax", StandardRate: 0, Notes: "VAT planned but not yet implemented as of 2025"},
}

// GetCountryTaxDefinition returns the tax system definition for the given ISO 3166-1 alpha-2 country code.
//
// Returns the tax_name (short label), full_name, standard_rate (%), and optional notes.
// standard_rate == 0 means no federal/general indirect tax or rate is non-uniform (see Notes).
// Country codes are case-insensitive.
//
// Examples:
//
//	GetCountryTaxDefinition("IN")  → {GST, Goods and Services Tax, 18, "Multiple slabs: 0%, 5%, 12%, 18%, 28%"}
//	GetCountryTaxDefinition("MY")  → {SST, Sales and Service Tax, 10, "Sales Tax 10%; Service Tax 8%"}
//	GetCountryTaxDefinition("US")  → {Sales Tax, Sales Tax, 0, "No federal rate; varies by state..."}
//	GetCountryTaxDefinition("GB")  → {VAT, Value Added Tax, 20, ""}
func GetCountryTaxDefinition(countryCode string) (CountryTaxDefinition, error) {
	if strings.TrimSpace(countryCode) == "" {
		return CountryTaxDefinition{}, fmt.Errorf("getCountryTaxDefinition: country code must not be empty")
	}

	code := strings.ToUpper(strings.TrimSpace(countryCode))
	def, ok := taxDefinitions[code]
	if !ok {
		return CountryTaxDefinition{}, fmt.Errorf(
			"getCountryTaxDefinition: country code %q is not supported",
			countryCode,
		)
	}
	return def, nil
}
