import { withErrorBoundary } from '../../common/errorBoundary';
import { CURRENCIES } from './data/currencies';

/**
 * Converts an amount from a higher currency denomination to a lower currency denomination.
 *
 * The function takes an amount in the higher denomination (e.g., dollars, pounds) and a currency code,
 * then converts the amount to the lower denomination (e.g., cents, pence) using the conversion rate
 * defined in the CURRENCIES object. If the currency code is not supported, it throws an error.
 *
 * @param {number} amount - The amount in the higher currency denomination.
 * @param {object} options - The options object
 * @returns {number} - The amount converted to the lower currency denomination.
 * @throws Will throw an error if the currency code is not supported.
 */
const convertToLowerDenomination = (
  amount: number,
  options: {
    currency: keyof typeof CURRENCIES;
  },
): number => {
  const currencyInfo = CURRENCIES[options.currency];

  if (!currencyInfo)
    throw new Error(`Unsupported currency ${options.currency}`);

  const denominationMultiplier =
    ((currencyInfo as any).denominationMultiplier as number | undefined) || 100;

  const lowerCurrencyValue = amount * denominationMultiplier;
  return lowerCurrencyValue;
};

export default withErrorBoundary<typeof convertToLowerDenomination>(
  convertToLowerDenomination,
);
