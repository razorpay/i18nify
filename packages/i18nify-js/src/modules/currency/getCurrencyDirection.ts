import { withErrorBoundary } from '../../common/errorBoundary';
import { CurrencyCodeType } from './types';
import CURRENCY_INFO from './data/currencyConfig.json';

const RTL_RANGES: [number, number][] = [
  [0x0590, 0x05ff], // Hebrew
  [0x0600, 0x06ff], // Arabic
  [0x0750, 0x077f], // Arabic Supplement
  [0x08a0, 0x08ff], // Arabic Extended-A
  [0xfb50, 0xfdff], // Arabic Presentation Forms-A
  [0xfe70, 0xfeff], // Arabic Presentation Forms-B
];

const isRtlSymbol = (symbol: string): boolean =>
  [...symbol].some((ch) => {
    const cp = ch.codePointAt(0) ?? 0;
    return RTL_RANGES.some(([lo, hi]) => cp >= lo && cp <= hi);
  });

const getCurrencyDirection = (
  currencyCode: CurrencyCodeType,
): 'rtl' | 'ltr' => {
  if (!(currencyCode in CURRENCY_INFO))
    throw new Error(
      `The provided currency code is invalid. The received value was: ${String(currencyCode)}.`,
    );
  return isRtlSymbol(CURRENCY_INFO[currencyCode].symbol) ? 'rtl' : 'ltr';
};

export default withErrorBoundary<typeof getCurrencyDirection>(
  getCurrencyDirection,
);
