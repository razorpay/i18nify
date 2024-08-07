import { withErrorBoundary } from '../../common/errorBoundary';
import { CountryCodeType } from '../types';
import getDialCodes from './getDialCodes';

/**
 * Retrieves the dial code for a specified country code.
 *
 * @param countryCode The country code for which the dial code is to be retrieved.
 *                    It must be a key of the object returned by the `getDialCodes` function.
 * @returns The corresponding dial code as a string.
 * @throws An error if the provided country code is not found in the dial code mapping.
 */
const getDialCodeByCountryCode = (countryCode: CountryCodeType): string => {
  // Get the mapping of all country codes to their respective dial codes
  const dialCodeForAllCountries = getDialCodes();

  /** Check if the provided country code exists in the mapping.
   * Return the corresponding dial code if the country code is valid.
   * Throw an error if the country code is not found in the mapping
   * */
  if (countryCode in dialCodeForAllCountries)
    return dialCodeForAllCountries[countryCode];
  else
    throw new Error(
      `The provided country code is invalid. The received value was: ${countryCode}. Please ensure you pass a valid country code. Check valid country codes here: https://github.com/razorpay/i18nify/blob/master/i18nify-data/country/metadata/data.json`,
    );
};

export default withErrorBoundary<typeof getDialCodeByCountryCode>(
  getDialCodeByCountryCode,
);
