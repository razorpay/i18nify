export const ALLOWED_FORMAT_PARTS_KEYS = [
  'nan',
  'infinity',
  'percent',
  'integer',
  'group',
  'decimal',
  'fraction',
  'plusSign',
  'minusSign',
  'percentSign',
  'currency',
  'code',
  'symbol',
  'name',
  'compact',
  'exponentInteger',
  'exponentMinusSign',
  'exponentSeparator',
  'unit',
] as const;

/**
 * Intl sometimes returns a symbol for these currencies that differs from the
 * curated one in i18nify-data (e.g. "$" for SGD). The values are literals so
 * that formatters do not pull the whole currency table into the bundle; a unit
 * test keeps them in sync with currencyConfig.json.
 */
export const INTL_MAPPING = {
  SGD: { $: 'S$' }, // Singapore Dollar
  XCD: { $: 'EC$' }, // East Caribbean Dollar
  ARS: { $: 'ARS' }, // Argentine Peso
  AUD: { $: 'A$' }, // Australian Dollar
  BSD: { $: 'BSD' }, // Bahamian Dollar
  BBD: { $: 'Bds$' }, // Barbados Dollar
  BMD: { $: 'BD$' }, // Bermudian Dollar
  CVE: { $: 'CVE' }, // Cabo Verde Escudo
  CAD: { $: 'CA$' }, // Canadian Dollar
  KYD: { $: 'CI$' }, // Cayman Islands Dollar
  CLP: { $: 'CLP' }, // Chilean Peso
  COP: { $: 'COL$' }, // Colombian Peso
  NZD: { $: 'NZ$' }, // New Zealand Dollar
  CUP: { $: '$MN' }, // Cuban Peso
  SVC: { $: '₡' }, // El Salvador Colon
  FJD: { $: 'FJ$' }, // Fiji Dollar
  GYD: { $: 'GY$' }, // Guyana Dollar
  HKD: { $: 'HK$' }, // Hong Kong Dollar
  JMD: { $: 'J$' }, // Jamaican Dollar
  LRD: { $: 'L$' }, // Liberian Dollar
  MOP: { $: 'MOP$' }, // Pataca
  MXN: { $: 'Mex$' }, // Mexican Peso
  NAD: { $: 'N$' }, // Namibia Dollar
  SBD: { $: 'SI$' }, // Solomon Islands Dollar
  SRD: { $: 'SRD' }, // Surinam Dollar
  ZWL: { $: 'Z$' }, // Zimbabwe Dollar
  LSL: { L: 'M' }, // Loti
  AWG: { 'Afl.': 'Aƒ' }, // Aruban Florin
  BYN: { Br: 'Rbl' }, // Belarusian Ruble
  XAF: { FCFA: 'FCFA' }, // CFA Franc BEAC
  CNY: { '¥': 'CN¥' }, // Yuan Renminbi
  EGP: { '£': 'E£' }, // Egyptian Pound
  FKP: { '£': 'FK£' }, // Falkland Islands Pound
  LBP: { '£': 'L£' }, // Lebanese Pound
  SSP: { '£': 'SS£' }, // South Sudanese Pound
  WST: { T: 'WS$' }, // Tala
};
