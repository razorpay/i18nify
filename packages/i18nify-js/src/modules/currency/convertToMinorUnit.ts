import { withErrorBoundary } from '../../common/errorBoundary';
import { CurrencyCodeType } from './types';
import CURRENCY_INFO from './data/currencyConfig.json';

/**
 * Converts an amount from a major currency unit to a minor currency unit.
 *
 * The function takes an amount in the major unit (e.g., dollars, pounds) and a currency code,
 * then converts the amount to the minor unit (e.g., cents, pence) using the conversion rate
 * defined in the CURRENCY_INFO object. If the currency code is not supported, it throws an error.
 *
 * @param {number} amount - The amount in the major currency unit.
 * @param {object} options - The options object
 * @returns {number} - The amount converted to the minor currency unit.
 * @throws Will throw an error if the currency code is not supported.
 */
const convertToMinorUnit = (
  amount: number,
  options: {
    currency: CurrencyCodeType;
  },
): number => {
  const currencyInfo = CURRENCY_INFO[options.currency];

  if (!options.currency || !currencyInfo) {
    throw new Error(
      `The provided currency code is either empty or not supported. The received value was ${(options.currency as any) === '' ? 'an empty string' : `: ${String(options.currency)}`}. Please ensure you pass a valid currency code that is included in the supported list.`,
    );
  }

  const minorUnitMultiplier =
    Math.pow(10, Number(currencyInfo.minor_unit)) || 100;

  const lowerCurrencyValue = amount * minorUnitMultiplier;
  return lowerCurrencyValue;
};

export default withErrorBoundary<typeof convertToMinorUnit>(convertToMinorUnit);
