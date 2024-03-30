import { ALLOWED_FORMAT_PARTS_KEYS } from './constants';
import CURRENCY_INFO from '../../../../../i18nify-data/currency/data.json';

export type FormattedPartsObject = {
  [key in (typeof ALLOWED_FORMAT_PARTS_KEYS)[number]]?: string | undefined;
};
export interface ByParts extends FormattedPartsObject {
  isPrefixSymbol: boolean;
  rawParts: Array<{ type: string; value: unknown }>;
}

export interface CurrencyType {
  symbol: string;
  name: string;
  lowerUnitName: string;
  minorUnitMultiplier?: number;
}

export interface I18nifyNumberFormatOptions {
  numberingSystem?: string;
  currencyDisplay?: 'code' | 'symbol' | 'narrowSymbol' | 'name' | undefined;
  currencySign?: 'standard' | 'accounting' | undefined;
  roundingPriority?: 'auto' | 'morePrecision' | 'lessPrecision';
  roundingIncrement?: number;
  roundingMode?:
    | 'ceil'
    | 'floor'
    | 'expand'
    | 'trunc'
    | 'halfCeil'
    | 'halfFloor'
    | 'halfExpand'
    | 'halfTrunc'
    | 'halfEven';
  trailingZeroDisplay?: 'auto' | 'stripIfInteger';
  useGrouping?: 'always' | 'auto' | 'min2' | true | false | undefined;
  signDisplay?:
    | 'auto'
    | 'always'
    | 'exceptZero'
    | 'negative'
    | 'never'
    | undefined;

  compactDisplay?: 'short' | 'long' | undefined;
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact' | undefined;
  unit?: string | undefined;
  unitDisplay?: 'short' | 'long' | 'narrow' | undefined;
  localeMatcher?: string | undefined;
  style?: string | undefined;
  currency?: string | undefined;
  minimumIntegerDigits?: number | undefined;
  minimumFractionDigits?: number | undefined;
  maximumFractionDigits?: number | undefined;
  minimumSignificantDigits?: number | undefined;
  maximumSignificantDigits?: number | undefined;
}

export type CurrencyCodeType = keyof typeof CURRENCY_INFO.currency_information;
