import { withErrorBoundary } from '../../common/errorBoundary';
import { CURRENCIES } from './data/currencies';
import { CurrencyCodeType, CurrencyType } from './types';

/**
 * Converts an amount from a major currency unit to a minor currency unit.
 *
 * The function takes an amount in the major unit (e.g., dollars, pounds) and a currency code,
 * then converts the amount to the minor unit (e.g., cents, pence) using the conversion rate
 * defined in the CURRENCIES object. If the currency code is not supported, it throws an error.
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
  const currencyInfo = CURRENCIES[options.currency] as CurrencyType;

  if (!currencyInfo)
    throw new Error(`Unsupported currency ${options.currency}`);

  const minorUnitMultiplier = currencyInfo.minorUnitMultiplier || 100;

  const lowerCurrencyValue = amount * minorUnitMultiplier;
  return lowerCurrencyValue;
};

export default withErrorBoundary<typeof convertToMinorUnit>(convertToMinorUnit);
