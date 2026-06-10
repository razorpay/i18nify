import { withErrorBoundary } from '../../common/errorBoundary';
import CURRENCY_INFO from './data/currencyConfig.json';
import { CurrencyCodeType } from './types';
import {
  CurrencyFormatterStyle,
  CURRENCY_FORMATTERS,
  groupIntegerPart,
  substituteDigits,
} from './currencyFormatters';

/**
 * Formats a numeric amount using one of the nine locale-specific grouping styles
 * defined in CURRENCY_FORMATTERS.
 *
 * @param amount       - The number to format. NaN/Infinity will throw.
 * @param style        - One of the nine CurrencyFormatterStyle keys.
 * @param options.currency    - ISO 4217 code; used to derive default decimal places and optional symbol.
 * @param options.decimals    - Override decimal places (default: currency's minor_unit, or 2).
 * @param options.showSymbol  - When true and currency is provided, prepend/append the currency symbol.
 *
 * @example
 *   formatWithStyle(1234567.89, 'INDIAN',  { currency: 'INR', showSymbol: true })
 *   // → '₹12,34,567.89'
 *
 *   formatWithStyle(1234567.89, 'SWISS',   { currency: 'CHF' })
 *   // → "1'234'567.89"
 *
 *   formatWithStyle(1234567.89, 'ARABIC',  { decimals: 2 })
 *   // → '١٬٢٣٤٬٥٦٧٫٨٩'
 */
const formatWithStyle = (
  amount: number,
  style: CurrencyFormatterStyle,
  options: {
    currency?: CurrencyCodeType;
    decimals?: number;
    showSymbol?: boolean;
  } = {},
): string => {
  if (typeof amount !== 'number' || !isFinite(amount)) {
    throw new Error(
      `'amount' must be a finite number. Received: ${String(amount)}`,
    );
  }

  const config = CURRENCY_FORMATTERS[style];
  if (!config) {
    throw new Error(
      `Unknown formatter style: "${String(style)}". Valid styles: ${Object.keys(CURRENCY_FORMATTERS).join(', ')}`,
    );
  }

  // Resolve decimal places: explicit > currency minor_unit > default 2
  let decimalPlaces = options.decimals;
  if (decimalPlaces === undefined && options.currency) {
    const info = CURRENCY_INFO[options.currency];
    decimalPlaces = info ? Number(info.minor_unit) : 2;
  }
  if (decimalPlaces === undefined) decimalPlaces = 2;

  const isNegative = amount < 0;
  const absFixed = Math.abs(amount).toFixed(decimalPlaces);
  const [intPart, fracPart] = absFixed.split('.');

  const grouped = groupIntegerPart(
    intPart,
    config.groupSizes,
    config.thousandsSep,
  );
  let result =
    fracPart !== undefined && decimalPlaces > 0
      ? `${grouped}${config.decimalSep}${fracPart}`
      : grouped;

  if (config.digits) {
    result = substituteDigits(result, config.digits);
  }

  if (isNegative) result = `-${result}`;

  if (options.showSymbol && options.currency) {
    const info = CURRENCY_INFO[options.currency];
    if (info?.symbol) {
      const isPrefix = (info as any).symbol_position !== 'suffix';
      result = isPrefix
        ? `${info.symbol}${result}`
        : `${result} ${info.symbol}`;
    }
  }

  return result;
};

export default withErrorBoundary<typeof formatWithStyle>(formatWithStyle);
