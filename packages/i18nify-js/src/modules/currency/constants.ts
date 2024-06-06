import CURRENCY_INFO from './data/currencyConfig.json';

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

export const INTL_MAPPING = {
  SGD: { $: CURRENCY_INFO.SGD.symbol }, // Singapore Dollar
  XCD: { $: CURRENCY_INFO.XCD.symbol }, // East Caribbean Dollar
  ARS: { $: CURRENCY_INFO.ARS.symbol }, // Argentine Peso
  AUD: { $: CURRENCY_INFO.AUD.symbol }, // Australian Dollar
  BSD: { $: CURRENCY_INFO.BSD.symbol }, // Bahamian Dollar
  BBD: { $: CURRENCY_INFO.BBD.symbol }, // Barbados Dollar
  BMD: { $: CURRENCY_INFO.BMD.symbol }, // Bermudian Dollar
  CVE: { $: CURRENCY_INFO.CVE.symbol }, // Cabo Verde Escudo
  CAD: { $: CURRENCY_INFO.CAD.symbol }, // Canadian Dollar
  KYD: { $: CURRENCY_INFO.KYD.symbol }, // Cayman Islands Dollar
  CLP: { $: CURRENCY_INFO.CLP.symbol }, // Chilean Peso
  COP: { $: CURRENCY_INFO.COP.symbol }, // Colombian Peso
  NZD: { $: CURRENCY_INFO.NZD.symbol }, // New Zealand Dollar
  CUP: { $: CURRENCY_INFO.CUP.symbol }, // Cuban Peso
  SVC: { $: CURRENCY_INFO.SVC.symbol }, // El Salvador Colon
  FJD: { $: CURRENCY_INFO.FJD.symbol }, // Fiji Dollar
  GYD: { $: CURRENCY_INFO.GYD.symbol }, // Guyana Dollar
  HKD: { $: CURRENCY_INFO.HKD.symbol }, // Hong Kong Dollar
  JMD: { $: CURRENCY_INFO.JMD.symbol }, // Jamaican Dollar
  LRD: { $: CURRENCY_INFO.LRD.symbol }, // Liberian Dollar
  MOP: { $: CURRENCY_INFO.MOP.symbol }, // Pataca
  MXN: { $: CURRENCY_INFO.MXN.symbol }, // Mexican Peso
  NAD: { $: CURRENCY_INFO.NAD.symbol }, // Namibia Dollar
  SBD: { $: CURRENCY_INFO.SBD.symbol }, // Solomon Islands Dollar
  SRD: { $: CURRENCY_INFO.SRD.symbol }, // Surinam Dollar
  ZWL: { $: CURRENCY_INFO.ZWL.symbol }, // Zimbabwe Dollar
};
