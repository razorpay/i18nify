import { withErrorBoundary } from '../../common/errorBoundary';
import { CurrencyCodeType } from './types';
import CURRENCY_INFO from './data/currencyConfig.json';

/**
 * Converts an amount from a minor currency unit to a major currency unit.
 *
 * The function takes an amount in the minor unit (e.g., cents, pence) and a currency code,
 * then converts the amount to the major unit (e.g., dollars, pounds) using the conversion rate
 * defined in the CURRENCY_INFO object. If the currency code is not supported, it throws an error.
 *
 * @param {number} amount - The amount in the minor currency unit.
 * @param {object} options - The options object
 * @returns {number} - The amount converted to the major currency unit.
 * @throws Will throw an error if the currency code is not supported.
 */
const convertToMajorUnit = (
  amount: number,
  options: {
    currency: CurrencyCodeType;
  },
): number => {
  const currencyInfo = CURRENCY_INFO[options.currency];

  if (!currencyInfo)
    throw new Error(`Unsupported currency ${String(options.currency)}`);

  const majorUnitMultiplier =
    Math.pow(10, Number(currencyInfo.minor_unit)) || 100;

  const higherCurrencyValue = amount / majorUnitMultiplier;
  return higherCurrencyValue;
};

export default withErrorBoundary<typeof convertToMajorUnit>(convertToMajorUnit);
