import { withErrorBoundary } from '../../common/errorBoundary';
import { I18nifyCountryCodeType } from '../geo/types';
import {
  I18NIFY_DATA_SOURCE,
  I18NIFY_DATA_SUPPORTED_COUNTRIES,
} from '../shared';

/**
 * Retrieves the full bank name for a given short code within a country.
 *
 * This function makes a network request to the central i18nify-data source,
 * locates the bank whose `short_code` matches (case-insensitive), and returns
 * its full display name.
 *
 * It mirrors the Go `GetBankNameFromShortCode(countryCode, shortCode)` function
 * in the i18nify-go bankcodes module, which performs the same case-insensitive
 * short-code lookup and returns the bank name or an error when not found.
 *
 * @param {I18nifyCountryCodeType} _countryCode - ISO 3166-1 alpha-2 country code.
 *   Only "IN", "MY", "SG", and "US" are supported.
 * @param {string} bankCode - The bank's short code (e.g., "HDFC", "SBIN").
 *   Comparison is case-insensitive.
 * @returns {Promise<string>} A promise resolving to the bank's full name.
 * @throws {Error} If the country code is unsupported, the bank code is empty,
 *   or no bank with the given short code is found.
 *
 * @example
 * getBankNameByCode('IN', 'HDFC')
 *   .then((name) => console.log(name));
 * // → "HDFC Bank"
 *
 * @example
 * getBankNameByCode('US', 'BOFAUS3N')
 *   .then((name) => console.log(name));
 */
const getBankNameByCode = (
  _countryCode: I18nifyCountryCodeType,
  bankCode: string,
): Promise<string> => {
  if (!bankCode || !bankCode.trim()) {
    return Promise.reject(new Error('Bank code must not be empty.'));
  }

  const countryCode = _countryCode.toUpperCase();

  if (I18NIFY_DATA_SUPPORTED_COUNTRIES.indexOf(countryCode) === -1) {
    return Promise.reject(
      new Error(
        `Data not available for country code: ${countryCode}. Data only available for country codes mentioned here: https://github.com/razorpay/i18nify/blob/master/packages/i18nify-js/src/modules/geo/constants.ts#L8`,
      ),
    );
  }

  const normalizedCode = bankCode.trim().toUpperCase();

  return fetch(`${I18NIFY_DATA_SOURCE}/bankcodes/${countryCode}.json`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(
          `Failed to load bank data for country: ${countryCode}.`,
        );
      }
      return res.json();
    })
    .then((data) => {
      const banks: Array<{ name: string; short_code: string }> =
        data.details || [];

      // Case-insensitive short_code match — mirrors Go's strings.EqualFold
      const bank = banks.find(
        (b) => b.short_code && b.short_code.toUpperCase() === normalizedCode,
      );

      if (!bank) {
        throw new Error(
          `No bank found with short code "${bankCode}" in country: ${countryCode}.`,
        );
      }

      return bank.name;
    })
    .catch((err) => {
      throw new Error(
        `An error occurred while fetching bank data. The error details are: ${err.message}.`,
      );
    });
};

export default withErrorBoundary<typeof getBankNameByCode>(getBankNameByCode);
