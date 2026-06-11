import { withErrorBoundary } from '../../common/errorBoundary';
import CURRENCY_INFO from './data/currencyConfig.json';
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
  if (!(currencyCode in CURRENCY_INFO)) {
    throw new Error(
      `Invalid currency code: "${String(currencyCode)}". Please provide a valid ISO 4217 alphabetic currency code.`,
    );
  }
  type ExtendedCurrencyEntry =
    (typeof CURRENCY_INFO)[keyof typeof CURRENCY_INFO] & {
      numeric_code?: string;
    };
  const entry = CURRENCY_INFO[currencyCode] as ExtendedCurrencyEntry;
  if (!entry.numeric_code) {
    throw new Error(
      `No numeric code found for currency: "${String(currencyCode)}".`,
    );
  }
  return entry.numeric_code;
};

export default withErrorBoundary<typeof getISONumericCode>(getISONumericCode);
