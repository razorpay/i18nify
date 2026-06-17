import { withErrorBoundary } from '../../common/errorBoundary';
import { CountryTaxDefinition } from './types';

// Per-country tax system definitions.
// Fields: tax_name (short label), full_name, standard_rate (%), notes.
// standard_rate = 0 means no general indirect tax or rate varies (see notes).
// Source: OECD Consumption Tax Trends 2024; country tax authority publications.
const TAX_DEFINITIONS: Readonly<Record<string, CountryTaxDefinition>> = {
  // GST — Goods and Services Tax
  AU: {
    tax_name: 'GST',
    full_name: 'Goods and Services Tax',
    standard_rate: 10,
    notes: '',
  },
  IN: {
    tax_name: 'GST',
    full_name: 'Goods and Services Tax',
    standard_rate: 18,
    notes: 'Multiple slabs: 0%, 5%, 12%, 18%, 28%',
  },
  NZ: {
    tax_name: 'GST',
    full_name: 'Goods and Services Tax',
    standard_rate: 15,
    notes: '',
  },
  SG: {
    tax_name: 'GST',
    full_name: 'Goods and Services Tax',
    standard_rate: 9,
    notes: '',
  },
  PK: {
    tax_name: 'GST',
    full_name: 'General Sales Tax',
    standard_rate: 17,
    notes: '',
  },
  CA: {
    tax_name: 'GST/HST',
    full_name: 'Goods and Services Tax / Harmonized Sales Tax',
    standard_rate: 5,
    notes: 'Federal GST 5%; provincial HST 13–15% in participating provinces',
  },

  // SST — Sales and Service Tax
  MY: {
    tax_name: 'SST',
    full_name: 'Sales and Service Tax',
    standard_rate: 10,
    notes: 'Sales Tax 10%; Service Tax 8%',
  },

  // Sales Tax (US: no federal rate)
  US: {
    tax_name: 'Sales Tax',
    full_name: 'Sales Tax',
    standard_rate: 0,
    notes: 'No federal rate; varies by state (0–10.25%)',
  },

  // Consumption Tax
  JP: {
    tax_name: 'CT',
    full_name: 'Consumption Tax',
    standard_rate: 10,
    notes: '',
  },

  // VAT — EU members
  AT: {
    tax_name: 'MwSt',
    full_name: 'Mehrwertsteuer',
    standard_rate: 20,
    notes: '',
  },
  BE: {
    tax_name: 'TVA/BTW',
    full_name:
      'Taxe sur la Valeur Ajoutée / Belasting over de Toegevoegde Waarde',
    standard_rate: 21,
    notes: '',
  },
  BG: {
    tax_name: 'ДДС',
    full_name: 'Данък върху добавената стойност',
    standard_rate: 20,
    notes: '',
  },
  HR: {
    tax_name: 'PDV',
    full_name: 'Porez na dodanu vrijednost',
    standard_rate: 25,
    notes: '',
  },
  CY: {
    tax_name: 'ΦΠΑ',
    full_name: 'Φόρος Προστιθέμενης Αξίας',
    standard_rate: 19,
    notes: '',
  },
  CZ: {
    tax_name: 'DPH',
    full_name: 'Daň z přidané hodnoty',
    standard_rate: 21,
    notes: '',
  },
  DK: {
    tax_name: 'MOMS',
    full_name: 'Merværdiafgift',
    standard_rate: 25,
    notes: '',
  },
  EE: { tax_name: 'KM', full_name: 'Käibemaks', standard_rate: 22, notes: '' },
  FI: {
    tax_name: 'ALV',
    full_name: 'Arvonlisävero',
    standard_rate: 25.5,
    notes: '',
  },
  FR: {
    tax_name: 'TVA',
    full_name: 'Taxe sur la Valeur Ajoutée',
    standard_rate: 20,
    notes: '',
  },
  DE: {
    tax_name: 'MwSt',
    full_name: 'Mehrwertsteuer',
    standard_rate: 19,
    notes: '',
  },
  GR: {
    tax_name: 'ΦΠΑ',
    full_name: 'Φόρος Προστιθέμενης Αξίας',
    standard_rate: 24,
    notes: '',
  },
  HU: {
    tax_name: 'ÁFA',
    full_name: 'Általános Forgalmi Adó',
    standard_rate: 27,
    notes: '',
  },
  IE: {
    tax_name: 'VAT',
    full_name: 'Value Added Tax',
    standard_rate: 23,
    notes: '',
  },
  IT: {
    tax_name: 'IVA',
    full_name: 'Imposta sul Valore Aggiunto',
    standard_rate: 22,
    notes: '',
  },
  LV: {
    tax_name: 'PVN',
    full_name: 'Pievienotās vērtības nodoklis',
    standard_rate: 21,
    notes: '',
  },
  LT: {
    tax_name: 'PVM',
    full_name: 'Pridėtinės vertės mokestis',
    standard_rate: 21,
    notes: '',
  },
  LU: {
    tax_name: 'TVA',
    full_name: 'Taxe sur la Valeur Ajoutée',
    standard_rate: 17,
    notes: '',
  },
  MT: {
    tax_name: 'VAT',
    full_name: 'Value Added Tax',
    standard_rate: 18,
    notes: '',
  },
  NL: {
    tax_name: 'BTW',
    full_name: 'Belasting over de Toegevoegde Waarde',
    standard_rate: 21,
    notes: '',
  },
  PL: {
    tax_name: 'VAT',
    full_name: 'Podatek od towarów i usług',
    standard_rate: 23,
    notes: '',
  },
  PT: {
    tax_name: 'IVA',
    full_name: 'Imposto sobre o Valor Acrescentado',
    standard_rate: 23,
    notes: '',
  },
  RO: {
    tax_name: 'TVA',
    full_name: 'Taxa pe Valoarea Adăugată',
    standard_rate: 19,
    notes: '',
  },
  SK: {
    tax_name: 'DPH',
    full_name: 'Daň z pridanej hodnoty',
    standard_rate: 23,
    notes: '',
  },
  SI: {
    tax_name: 'DDV',
    full_name: 'Davek na dodano vrednost',
    standard_rate: 22,
    notes: '',
  },
  ES: {
    tax_name: 'IVA',
    full_name: 'Impuesto sobre el Valor Añadido',
    standard_rate: 21,
    notes: '',
  },
  SE: {
    tax_name: 'MOMS',
    full_name: 'Mervärdesskatt',
    standard_rate: 25,
    notes: '',
  },

  // VAT — non-EU Europe
  GB: {
    tax_name: 'VAT',
    full_name: 'Value Added Tax',
    standard_rate: 20,
    notes: '',
  },
  NO: {
    tax_name: 'MVA',
    full_name: 'Merverdiavgift',
    standard_rate: 25,
    notes: '',
  },
  CH: {
    tax_name: 'MWST',
    full_name: 'Mehrwertsteuer',
    standard_rate: 8.1,
    notes: '',
  },
  IS: {
    tax_name: 'VSK',
    full_name: 'Virðisaukaskattur',
    standard_rate: 24,
    notes: '',
  },
  TR: {
    tax_name: 'KDV',
    full_name: 'Katma Değer Vergisi',
    standard_rate: 20,
    notes: '',
  },
  RU: {
    tax_name: 'НДС',
    full_name: 'Налог на добавленную стоимость',
    standard_rate: 20,
    notes: '',
  },
  UA: {
    tax_name: 'ПДВ',
    full_name: 'Податок на додану вартість',
    standard_rate: 20,
    notes: '',
  },

  // VAT — Middle East & Africa
  AE: {
    tax_name: 'VAT',
    full_name: 'Value Added Tax',
    standard_rate: 5,
    notes: '',
  },
  SA: {
    tax_name: 'VAT',
    full_name: 'Value Added Tax',
    standard_rate: 15,
    notes: '',
  },
  BH: {
    tax_name: 'VAT',
    full_name: 'Value Added Tax',
    standard_rate: 10,
    notes: '',
  },
  EG: {
    tax_name: 'VAT',
    full_name: 'Value Added Tax',
    standard_rate: 14,
    notes: '',
  },
  NG: {
    tax_name: 'VAT',
    full_name: 'Value Added Tax',
    standard_rate: 7.5,
    notes: '',
  },
  ZA: {
    tax_name: 'VAT',
    full_name: 'Value Added Tax',
    standard_rate: 15,
    notes: '',
  },
  KE: {
    tax_name: 'VAT',
    full_name: 'Value Added Tax',
    standard_rate: 16,
    notes: '',
  },
  GH: {
    tax_name: 'VAT',
    full_name: 'Value Added Tax',
    standard_rate: 15,
    notes: '',
  },
  ET: {
    tax_name: 'VAT',
    full_name: 'Value Added Tax',
    standard_rate: 15,
    notes: '',
  },
  TZ: {
    tax_name: 'VAT',
    full_name: 'Value Added Tax',
    standard_rate: 18,
    notes: '',
  },

  // VAT — Asia Pacific
  CN: {
    tax_name: 'VAT',
    full_name: 'Value Added Tax (增值税)',
    standard_rate: 13,
    notes: 'Reduced rates 9% and 6% apply to essential goods and services',
  },
  KR: {
    tax_name: 'VAT',
    full_name: 'Value Added Tax (부가가치세)',
    standard_rate: 10,
    notes: '',
  },
  TW: {
    tax_name: 'VAT',
    full_name: 'Business Tax (加值型及非加值型營業稅)',
    standard_rate: 5,
    notes: '',
  },
  TH: {
    tax_name: 'VAT',
    full_name: 'Value Added Tax (ภาษีมูลค่าเพิ่ม)',
    standard_rate: 7,
    notes: '',
  },
  PH: {
    tax_name: 'VAT',
    full_name: 'Value Added Tax',
    standard_rate: 12,
    notes: '',
  },
  ID: {
    tax_name: 'PPN',
    full_name: 'Pajak Pertambahan Nilai',
    standard_rate: 12,
    notes: '',
  },
  VN: {
    tax_name: 'VAT',
    full_name: 'Thuế Giá Trị Gia Tăng',
    standard_rate: 10,
    notes: '',
  },
  LK: {
    tax_name: 'VAT',
    full_name: 'Value Added Tax',
    standard_rate: 18,
    notes: '',
  },
  BD: {
    tax_name: 'VAT',
    full_name: 'Value Added Tax (মূল্য সংযোজন কর)',
    standard_rate: 15,
    notes: '',
  },
  MM: {
    tax_name: 'CT',
    full_name: 'Commercial Tax',
    standard_rate: 5,
    notes: '',
  },
  KH: {
    tax_name: 'VAT',
    full_name: 'Value Added Tax',
    standard_rate: 10,
    notes: '',
  },

  // VAT — Americas
  BR: {
    tax_name: 'IBS/CBS',
    full_name:
      'Imposto sobre Bens e Serviços / Contribuição sobre Bens e Serviços',
    standard_rate: 26.5,
    notes: 'Under tax reform (2024–2033); previously ICMS/ISS/PIS/COFINS',
  },
  MX: {
    tax_name: 'IVA',
    full_name: 'Impuesto al Valor Agregado',
    standard_rate: 16,
    notes: '',
  },
  AR: {
    tax_name: 'IVA',
    full_name: 'Impuesto al Valor Agregado',
    standard_rate: 21,
    notes: '',
  },
  CL: {
    tax_name: 'IVA',
    full_name: 'Impuesto al Valor Agregado',
    standard_rate: 19,
    notes: '',
  },
  CO: {
    tax_name: 'IVA',
    full_name: 'Impuesto al Valor Agregado',
    standard_rate: 19,
    notes: '',
  },
  PE: {
    tax_name: 'IGV',
    full_name: 'Impuesto General a las Ventas',
    standard_rate: 18,
    notes: '',
  },
  EC: {
    tax_name: 'IVA',
    full_name: 'Impuesto al Valor Agregado',
    standard_rate: 15,
    notes: '',
  },
  UY: {
    tax_name: 'IVA',
    full_name: 'Impuesto al Valor Agregado',
    standard_rate: 22,
    notes: '',
  },

  // No general indirect tax
  HK: {
    tax_name: '',
    full_name: 'No general indirect tax',
    standard_rate: 0,
    notes: 'No VAT or GST',
  },
  KW: {
    tax_name: '',
    full_name: 'No general indirect tax',
    standard_rate: 0,
    notes: 'No VAT or GST',
  },
  QA: {
    tax_name: '',
    full_name: 'No general indirect tax',
    standard_rate: 0,
    notes: 'VAT planned but not yet implemented as of 2025',
  },
  OM: {
    tax_name: 'VAT',
    full_name: 'Value Added Tax',
    standard_rate: 5,
    notes: '',
  },
};

const getCountryTaxDefinition = (countryCode: string): CountryTaxDefinition => {
  if (!countryCode)
    throw new Error(
      `Parameter 'countryCode' is invalid! The received value was: ${countryCode}.`,
    );

  const definition = TAX_DEFINITIONS[countryCode.toUpperCase()];
  if (!definition)
    throw new Error(
      `Country code "${countryCode}" is not supported for tax definition lookup. ` +
        `Supported countries: ${Object.keys(TAX_DEFINITIONS).join(', ')}.`,
    );

  return definition;
};

export default withErrorBoundary<typeof getCountryTaxDefinition>(
  getCountryTaxDefinition,
);
