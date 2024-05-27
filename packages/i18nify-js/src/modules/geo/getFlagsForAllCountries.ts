import { withErrorBoundary } from '../../common/errorBoundary';
import { COUNTRY_LIST_FOR_ALL_FLAGS } from './data/countryListForAllFlags';
import { FLAG_4X3_BASE_PATH, FLAG_BASE_PATH } from './constants';
import { GetFlagReturnType, CountryCodeTypeForAllFlags } from '../types';

/**
 * Retrieves a mapping of country codes to their corresponding flag image URLs.
 *
 * This function iterates over a predefined list of country codes, constructs a URL
 * for each country's flag image based on the country code, and then returns an object
 * where each key is a country code and its value is the URL to that country's flag image.
 *
 * @returns An object mapping each country code from the list to its flag image URL.
 */
const getFlagsForAllCountries = (): {
  [countryCode in CountryCodeTypeForAllFlags]: GetFlagReturnType;
} => {
  // Initialize an empty object to hold the country code to flag URL mapping
  const flagsForAllCountriesMap = {} as {
    [countryCode in CountryCodeTypeForAllFlags]: GetFlagReturnType;
  };

  // Loop through each country code in the list
  COUNTRY_LIST_FOR_ALL_FLAGS.map((countryCode: CountryCodeTypeForAllFlags) => {
    let lowerCasedCountryCode =
      countryCode.toLowerCase() as CountryCodeTypeForAllFlags;
    // Construct the flag image URL and assign it to the corresponding country code in the map
    flagsForAllCountriesMap[countryCode] = {
      original: `${FLAG_BASE_PATH}/${lowerCasedCountryCode}.svg`,
      '4X3': `${FLAG_4X3_BASE_PATH}/${lowerCasedCountryCode}.svg`,
    };
  });

  // Return the populated map of country codes to flag image URLs
  return flagsForAllCountriesMap;
};

export default withErrorBoundary<typeof getFlagsForAllCountries>(
  getFlagsForAllCountries,
);
