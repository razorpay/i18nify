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

// This has been taken from here: https://docs.google.com/spreadsheets/d/13VFVLJql-IPeIV5NTR5MNzeeJp5LVkelbt4jFGUpBlE/edit?usp=sharing
export const INTL_MAPPING = {
  SGD: { $: 'S$' }, // Singapore Dollar
  XCD: { $: 'EC$' }, // East Caribbean Dollar
  ARS: { $: 'ARS' }, // Argentine Peso
  AUD: { $: 'A$' }, // Australian Dollar
  BSD: { $: 'BSD' }, // Bahamian Dollar
  BBD: { $: 'Bds$' }, // Barbados Dollar
  BMD: { $: 'BD$' }, // Bermudian Dollar
  CVE: { $: 'CVE' }, // Cabo Verde Escudo
  CAD: { $: 'C$' }, // Canadian Dollar
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
};
