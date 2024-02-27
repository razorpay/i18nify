import { withErrorBoundary } from '../../common/errorBoundary';
import getDialCodes from './getDialCodes';
import { GetDialCodesType } from './types';

/**
 * Retrieves the dial code for a specified country code.
 *
 * @param countryCode The country code for which the dial code is to be retrieved.
 *                    It must be a key of the object returned by the `getDialCodes` function.
 * @returns The corresponding dial code as a string.
 * @throws An error if the provided country code is not found in the dial code mapping.
 */
const getDialCodeByCountryCode = (countryCode: GetDialCodesType): string => {
  // Get the mapping of all country codes to their respective dial codes
  const dialCodeForAllCountries = getDialCodes();

  /** Check if the provided country code exists in the mapping.
   * Return the corresponding dial code if the country code is valid.
   * Throw an error if the country code is not found in the mapping
   * */
  if (countryCode in dialCodeForAllCountries)
    return dialCodeForAllCountries[countryCode];
  else throw new Error(`Invalid countryCode: ${countryCode}`);
};

export default withErrorBoundary<typeof getDialCodeByCountryCode>(
  getDialCodeByCountryCode,
);
