import { withErrorBoundary } from '../../common/errorBoundary';
import {
  I18NIFY_DATA_SOURCE,
  I18NIFY_DATA_SUPPORTED_COUNTRIES,
} from './constants';
import { I18nifyCountryCodeType } from './types';

/**
 * Retrieves the bank code for the specified bank in a given country
 *
 * This function makes a network request to the central i18nify-data source and
 * returns a promise for the bank code associated with the bank name passed.
 * If the bank or country is invalid, it rejects with an appropriate error.
 *
 * @param {I18nifyCountryCodeType} _countryCode - The ISO country code (e.g., 'IN')
 * @param {string} bankName - The exact name of the bank (as it appears in the data)
 * @returns {Promise<string>} Promise that resolves to the bank code of the bank
 */
const getBankCode = (
  _countryCode: I18nifyCountryCodeType,
  bankName: string,
): Promise<string> => {
  const countryCode = _countryCode.toUpperCase();

  if (!I18NIFY_DATA_SUPPORTED_COUNTRIES.includes(countryCode)) {
    return Promise.reject(
      new Error(
        `Data not available for country code: ${countryCode}. Data only available for country codes mentioned here: https://github.com/razorpay/i18nify/blob/master/packages/i18nify-js/src/modules/geo/constants.ts#L8`,
      ),
    );
  }

  if (!bankName) {
    return Promise.reject(
      new Error(
        `Bank name is required to fetch the bank code. Please provide a valid bank name.`,
      ),
    );
  }

  return fetch(`${I18NIFY_DATA_SOURCE}/bankcodes/${countryCode}.json`)
    .then((res) => res.json())
    .then((res) => {
      const { details } = res;
      if (!details || !Array.isArray(details)) {
        return Promise.reject(
          new Error(
            `Bank data is not in the expected format for ${countryCode}.`,
          ),
        );
      }

      // Find the bank entry matching the passed bankName
      const bank = details.find(
        (bankItem: { name: string }) =>
          bankItem.name.toLowerCase() === bankName.toLowerCase(),
      );

      if (!bank || !bank.short_code) {
        return Promise.reject(
          new Error(
            `Unable to find bank code for bank "${bankName}" in ${countryCode}. Please ensure the bank name is correct.`,
          ),
        );
      }

      return bank.short_code;
    })
    .catch((err) => {
      throw new Error(
        `An error occurred while fetching bank bank code. The error details are: ${err.message}.`,
      );
    });
};

export default withErrorBoundary<typeof getBankCode>(getBankCode);
