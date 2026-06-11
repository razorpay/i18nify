import { withErrorBoundary } from '../../common/errorBoundary';
import { CurrencyCodeType } from './types';
import CURRENCY_INFO from './data/currencyConfig.json';

const AMOUNT_REGEX = /^-?\d+(\.\d+)?$/;

/**
 * Validates that an amount string has no more decimal places than the currency supports.
 *
 * @param {string} amount - The amount string to validate (e.g. "10.99", "100", "-5.5").
 * @param {object} options - Options object containing the currency code.
 * @returns {boolean} True if the decimal precision is within the currency's allowed range.
 * @throws Will throw an error if the currency code is not supported.
 */
const isValidAmount = (
  amount: string,
  options: {
    currency: CurrencyCodeType;
  },
): boolean => {
  const currencyInfo = CURRENCY_INFO[options.currency];

  if (!options.currency || !currencyInfo) {
    throw new Error(
      `The provided currency code is either empty or not supported. The received value was ${(options.currency as string) === '' ? 'an empty string' : `: ${String(options.currency)}`}. Please ensure you pass a valid currency code. Check valid currency codes here: https://github.com/razorpay/i18nify/blob/master/i18nify-data/currency/data.json`,
    );
  }

  if (!AMOUNT_REGEX.test(amount)) {
    return false;
  }

  const minorUnit = Number(currencyInfo.minor_unit);
  const dotIndex = amount.indexOf('.');

  if (dotIndex === -1) {
    return true;
  }

  const decimalPlaces = amount.length - dotIndex - 1;
  return decimalPlaces <= minorUnit;
};

export default withErrorBoundary<typeof isValidAmount>(isValidAmount);
