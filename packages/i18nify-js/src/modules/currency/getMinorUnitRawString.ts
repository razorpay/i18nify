import { withErrorBoundary } from '../../common/errorBoundary';
import { CurrencyCodeType } from './types';
import CURRENCY_INFO from './data/currencyConfig.json';

/**
 * Returns the minor-unit value of an amount as a plain decimal string,
 * with no locale formatting, currency symbol, or grouping separators.
 *
 * Intended for protocol boundaries (proto, XML, wire formats) where a
 * locale-formatted string is not acceptable.
 *
 * For example:
 *   getMinorUnitRawString(100, { currency: 'USD' }) → "10000"
 *   getMinorUnitRawString(4.14, { currency: 'INR' }) → "414"
 *
 * @param {number} amount - The amount in the major currency unit.
 * @param {object} options - Options object with a required `currency` field.
 * @returns {string} Plain integer string of the minor-unit amount.
 * @throws Will throw an error if the currency code is not supported.
 */
const getMinorUnitRawString = (
  amount: number,
  options: {
    currency: CurrencyCodeType;
  },
): string => {
  const currencyInfo = CURRENCY_INFO[options.currency];

  if (!options.currency || !currencyInfo) {
    throw new Error(
      `The provided currency code is either empty or not supported. The received value was ${(options.currency as any) === '' ? 'an empty string' : `: ${String(options.currency)}`}. Please ensure you pass a valid currency code. Check valid currency codes here: https://github.com/razorpay/i18nify/blob/master/i18nify-data/currency/data.json`,
    );
  }

  const minorUnitMultiplier =
    Math.pow(10, Number(currencyInfo.minor_unit)) || 100;

  const minorUnitValue = parseFloat((amount * minorUnitMultiplier).toFixed(0));

  return String(minorUnitValue);
};

export default withErrorBoundary<typeof getMinorUnitRawString>(
  getMinorUnitRawString,
);
