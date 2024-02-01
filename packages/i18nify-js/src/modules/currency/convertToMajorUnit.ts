import { withErrorBoundary } from '../../common/errorBoundary';
import { CURRENCIES } from './data/currencies';
import { CurrencyCodeType, CurrencyType } from './types';

/**
 * Converts an amount from a minor currency unit to a major currency unit.
 *
 * The function takes an amount in the minor unit (e.g., cents, pence) and a currency code,
 * then converts the amount to the major unit (e.g., dollars, pounds) using the conversion rate
 * defined in the CURRENCIES object. If the currency code is not supported, it throws an error.
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
  const currencyInfo = CURRENCIES[options.currency] as CurrencyType;

  if (!currencyInfo)
    throw new Error(`Unsupported currency ${options.currency}`);

  const minorUnitMultiplier = currencyInfo.minorUnitMultiplier || 100;

  const higherCurrencyValue = amount / minorUnitMultiplier;
  return higherCurrencyValue;
};

export default withErrorBoundary<typeof convertToMajorUnit>(convertToMajorUnit);
