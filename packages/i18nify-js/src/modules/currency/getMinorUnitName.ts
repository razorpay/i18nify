import { withErrorBoundary } from '../../common/errorBoundary';
import { CurrencyCodeType } from './types';
import CURRENCY_INFO from './data/currencyConfig.json';

const MINOR_UNIT_NAMES: Partial<Record<string, string>> = {
  // Major global
  USD: 'cent',
  EUR: 'cent',
  GBP: 'penny',
  JPY: 'sen',
  CHF: 'rappen',
  CNY: 'jiao',
  HKD: 'cent',
  SGD: 'cent',
  AUD: 'cent',
  NZD: 'cent',
  CAD: 'cent',

  // South / Southeast Asia
  INR: 'paisa',
  PKR: 'paisa',
  BDT: 'poisha',
  LKR: 'cent',
  NPR: 'paisa',
  MVR: 'laari',
  MYR: 'sen',
  THB: 'satang',
  PHP: 'sentimo',
  IDR: 'sen',
  VND: 'xu',
  KHR: 'sen',
  MMK: 'pya',

  // East Asia
  KRW: 'jeon',
  TWD: 'cent',

  // Middle East / Arabic (all RTL currencies + neighbours)
  AED: 'fils',
  AFN: 'pul',
  BHD: 'fils',
  DZD: 'centime',
  EGP: 'piastre',
  IQD: 'fils',
  IRR: 'dinar',
  JOD: 'fils',
  KWD: 'fils',
  LBP: 'piastre',
  LYD: 'dirham',
  MAD: 'centime',
  OMR: 'baisa',
  QAR: 'dirham',
  SAR: 'halala',
  SDG: 'piastre',
  SYP: 'piastre',
  TND: 'millime',
  YER: 'fils',
  ILS: 'agora',
  TRY: 'kuruş',

  // Europe
  NOK: 'øre',
  SEK: 'öre',
  DKK: 'øre',
  PLN: 'grosz',
  CZK: 'haléř',
  HUF: 'fillér',
  RON: 'ban',
  RUB: 'kopek',
  UAH: 'kopiyka',
  HRK: 'lipa',
  BGN: 'stotinka',

  // Americas
  BRL: 'centavo',
  MXN: 'centavo',
  ARS: 'centavo',
  CLP: 'centavo',
  COP: 'centavo',
  PEN: 'céntimo',

  // Africa
  ZAR: 'cent',
  KES: 'cent',
  NGN: 'kobo',
  GHS: 'pesewa',
  ETB: 'santim',
  TZS: 'cent',
  XOF: 'centime',
  XAF: 'centime',
};

const getMinorUnitName = (currencyCode: CurrencyCodeType): string | null => {
  if (!(currencyCode in CURRENCY_INFO))
    throw new Error(
      `The provided currency code is invalid. The received value was: ${String(currencyCode)}.`,
    );
  return MINOR_UNIT_NAMES[currencyCode] ?? null;
};

export default withErrorBoundary<typeof getMinorUnitName>(getMinorUnitName);
