import { withErrorBoundary } from '../../common/errorBoundary';
import { I18nifyCountryCodeType } from '../geo/types';
import {
  I18NIFY_DATA_SOURCE,
  I18NIFY_DATA_SUPPORTED_COUNTRIES,
} from '../sourceConstants';

/**
 * Retrieves the list of all banks available for a specified country.
 *
 * This function makes a network request to the central i18nify-data source
 * and returns a promise that resolves to the array of banks (without branches).
 *
 * @param {I18nifyCountryCodeType} _countryCode - The ISO country code (e.g. "IN")
 * @returns {Promise<any[]>} A Promise that resolves to an array of banks
 *
 * @example
 * getBanks("IN").then((banks) => console.log(banks));
 */
const getListOfBanks = (_countryCode: I18nifyCountryCodeType) => {
  const countryCode = _countryCode.toUpperCase();

  if (!I18NIFY_DATA_SUPPORTED_COUNTRIES.includes(countryCode)) {
    return Promise.reject(
      new Error(
        `Data not available for country code: ${countryCode}. Data only available for country codes mentioned here: https://github.com/razorpay/i18nify/blob/master/packages/i18nify-js/src/modules/geo/constants.ts#L8`,
      ),
    );
  }

  return fetch(`${I18NIFY_DATA_SOURCE}/bankcodes/${countryCode}.json`)
    .then((res) => {
      if (!res.ok) {
        // Non-2xx HTTP status
        throw new Error(
          `Failed to load bank data for country: ${countryCode}.`,
        );
      }
      return res.json();
    })
    .then((data) => {
      // Return the array of banks (data.details) without branches
      return data.details || [];
    })
    .catch((err) => {
      throw new Error(
        `An error occurred while fetching bank data. The error details are: ${err.message}.`,
      );
    });
};

export default withErrorBoundary<typeof getListOfBanks>(getListOfBanks);
