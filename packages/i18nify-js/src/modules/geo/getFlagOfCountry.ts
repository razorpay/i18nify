import { CountryCodeType, GetFlagReturnType } from '../types';
import { withErrorBoundary } from '../../common/errorBoundary';
import {
  FLAG_1X1_BASE_PATH,
  FLAG_4X3_BASE_PATH,
  FLAG_BASE_PATH,
} from '../shared';
import { isCountryValid } from './utils';

/**
 * Retrieves the URL for the flag of a given country.
 *
 * This function checks if the provided country code is valid by verifying it against
 * a predefined list of country codes. If the country code is valid, it constructs and
 * returns URLs pointing to the flag image for that country: the original aspect
 * ratio (flagcdn), the 4:3 version and the 1:1 version (for circular avatars). If the country code is not
 * found in the list, it throws an error indicating that the country code is invalid.
 *
 * @param countryCode - The country code for which to retrieve the flag URL. Must be a valid code from the list of all countries.
 * @returns The URL of the flag image for the given country code.
 * @throws {Error} If the country code is not in the list of valid country codes.
 */
const getFlagOfCountry = (_countryCode: CountryCodeType): GetFlagReturnType => {
  if (!isCountryValid(_countryCode)) {
    throw new Error(
      `The provided country code is invalid. The received value was: ${_countryCode}. Please ensure you pass a valid country code. Check valid country codes here: https://github.com/razorpay/i18nify/blob/master/i18nify-data/country/metadata/data.json`,
    );
  }

  const countryCode = _countryCode.toLowerCase() as CountryCodeType;
  return {
    original: `${FLAG_BASE_PATH}/${countryCode}.svg`,
    '4X3': `${FLAG_4X3_BASE_PATH}/${countryCode}.svg`,
    '1X1': `${FLAG_1X1_BASE_PATH}/${countryCode}.svg`,
  };
};

export default /*#__PURE__*/ withErrorBoundary<typeof getFlagOfCountry>(
  getFlagOfCountry,
);
