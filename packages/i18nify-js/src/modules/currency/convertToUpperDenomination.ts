import { withErrorBoundary } from '../../common/errorBoundary';
import { CURRENCIES, CurrencyType } from './data/currencies';

/**
 * Converts an amount from a lower currency denomination to a higher currency denomination.
 *
 * The function takes an amount in the lower denomination (e.g., cents, pence) and a currency code,
 * then converts the amount to the higher denomination (e.g., dollars, pounds) using the conversion rate
 * defined in the CURRENCIES object. If the currency code is not supported, it throws an error.
 *
 * @param {number} amount - The amount in the lower currency denomination.
 * @param {object} options - The options object
 * @returns {number} - The amount converted to the higher currency denomination.
 * @throws Will throw an error if the currency code is not supported.
 */
const convertToUpperDenomination = (
  amount: number,
  options: {
    currency: keyof typeof CURRENCIES;
  },
): number => {
  const currencyInfo = CURRENCIES[options.currency] as CurrencyType;

  if (!currencyInfo)
    throw new Error(`Unsupported currency ${options.currency}`);

  const denominationMultiplier = currencyInfo.denominationMultiplier || 100;

  const higherCurrencyValue = amount / denominationMultiplier;
  return higherCurrencyValue;
};

export default withErrorBoundary<typeof convertToUpperDenomination>(
  convertToUpperDenomination,
);
