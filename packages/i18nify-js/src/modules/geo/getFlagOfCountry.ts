import { CountryCodeType, GetFlagReturnType } from '../types';
import { withErrorBoundary } from '../../common/errorBoundary';
import { LIST_OF_ALL_COUNTRIES } from './data/listOfAllCountries';
import { FLAG_4X3_BASE_PATH, FLAG_BASE_PATH } from './constants';

/**
 * Retrieves the URL for the flag of a given country.
 *
 * This function checks if the provided country code is valid by verifying it against
 * a predefined list of country codes. If the country code is valid, it constructs and
 * returns a URL pointing to the flag image for that country. If the country code is not
 * found in the list, it throws an error indicating that the country code is invalid.
 *
 * @param countryCode - The country code for which to retrieve the flag URL. Must be a valid code from the list of all countries.
 * @returns The URL of the flag image for the given country code.
 * @throws {Error} If the country code is not in the list of valid country codes.
 */
const getFlagOfCountry = (_countryCode: CountryCodeType): GetFlagReturnType => {
  const countryCode = _countryCode.toUpperCase() as CountryCodeType;
  if (!LIST_OF_ALL_COUNTRIES.includes(countryCode)) {
    throw new Error(`Invalid country code: ${countryCode}`);
  }
  return {
    original: `${FLAG_BASE_PATH}/${countryCode}.svg`,
    '4X3': `${FLAG_4X3_BASE_PATH}/${countryCode}.svg`,
  };
};

export default withErrorBoundary<typeof getFlagOfCountry>(getFlagOfCountry);
