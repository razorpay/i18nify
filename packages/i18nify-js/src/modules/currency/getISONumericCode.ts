import { withErrorBoundary } from '../../common/errorBoundary';
import NUMERIC_CODES from './data/numericCodes.json';
import { CurrencyCodeType } from './types';

/**
 * Returns the ISO 4217 three-digit numeric code for the given alphabetic
 * currency code (e.g. "USD" → "840", "INR" → "356").
 *
 * @param {CurrencyCodeType} currencyCode - A valid ISO 4217 alpha-3 code.
 * @returns {string} Zero-padded three-digit numeric code string (e.g. "008").
 * @throws When the currency code is not in the dataset.
 */
const getISONumericCode = (currencyCode: CurrencyCodeType): string => {
  if (!(currencyCode in NUMERIC_CODES)) {
    throw new Error(
      `Invalid currency code: "${String(currencyCode)}". Please provide a valid ISO 4217 alphabetic currency code.`,
    );
  }
  const numericCode = NUMERIC_CODES[currencyCode as keyof typeof NUMERIC_CODES];
  if (!numericCode) {
    throw new Error(
      `No numeric code found for currency: "${String(currencyCode)}".`,
    );
  }
  return numericCode;
};

export default /*#__PURE__*/ withErrorBoundary<typeof getISONumericCode>(
  getISONumericCode,
);
