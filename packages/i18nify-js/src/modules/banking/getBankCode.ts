import { withErrorBoundary } from '../../common/errorBoundary';
import { I18nifyCountryCodeType } from '../geo/types';
import {
  I18NIFY_DATA_SOURCE,
  I18NIFY_DATA_SUPPORTED_COUNTRIES,
} from '../shared';

/**
 * Retrieves the short code for a bank given its full name within a country.
 *
 * This function makes a network request to the central i18nify-data source,
 * locates the bank whose `name` matches (case-insensitive), and returns its
 * `short_code`.
 *
 * It is the logical complement of `getBankNameByCode`: where that function
 * maps short code → name, this function maps name → short code. Together they
 * mirror the bidirectional lookup available in the Go i18nify-go bankcodes
 * module via `GetBankNameFromShortCode` and `GetAllBanksWithShortCodes`.
 *
 * @param {I18nifyCountryCodeType} _countryCode - ISO 3166-1 alpha-2 country code.
 *   Only "IN", "MY", "SG", and "US" are supported.
 * @param {string} bankName - The bank's full display name (e.g., "HDFC Bank").
 *   Comparison is case-insensitive.
 * @returns {Promise<string>} A promise resolving to the bank's short code
 *   (e.g., "HDFC").
 * @throws {Error} If the country code is unsupported, the bank name is empty,
 *   no bank with that name is found, or the matched bank has no short code.
 *
 * @example
 * getBankCode('IN', 'HDFC Bank')
 *   .then((code) => console.log(code));
 * // → "HDFC"
 *
 * @example
 * getBankCode('US', 'Bank of America')
 *   .then((code) => console.log(code));
 */
const getBankCode = (
  _countryCode: I18nifyCountryCodeType,
  bankName: string,
): Promise<string> => {
  if (!bankName || !bankName.trim()) {
    return Promise.reject(new Error('Bank name must not be empty.'));
  }

  const countryCode = _countryCode.toUpperCase();

  if (I18NIFY_DATA_SUPPORTED_COUNTRIES.indexOf(countryCode) === -1) {
    return Promise.reject(
      new Error(
        `Data not available for country code: ${countryCode}. Data only available for country codes mentioned here: https://github.com/razorpay/i18nify/blob/master/packages/i18nify-js/src/modules/geo/constants.ts#L8`,
      ),
    );
  }

  const normalizedName = bankName.trim().toLowerCase();

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

      // Case-insensitive name match — mirrors Go's strings.EqualFold behaviour
      const bank = banks.find(
        (b) => b.name && b.name.toLowerCase() === normalizedName,
      );

      if (!bank) {
        throw new Error(
          `No bank found with name "${bankName}" in country: ${countryCode}.`,
        );
      }

      if (!bank.short_code) {
        throw new Error(
          `Bank "${bankName}" in country ${countryCode} does not have a short code.`,
        );
      }

      return bank.short_code;
    })
    .catch((err) => {
      throw new Error(
        `An error occurred while fetching bank data. The error details are: ${err.message}.`,
      );
    });
};

export default withErrorBoundary<typeof getBankCode>(getBankCode);
