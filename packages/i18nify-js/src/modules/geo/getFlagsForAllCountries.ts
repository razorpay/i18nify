import { withErrorBoundary } from '../../common/errorBoundary';
import { LIST_OF_ALL_COUNTRIES } from './data/listOfAllCountries';
import { FLAG_4X3_BASE_PATH, FLAG_BASE_PATH } from './constants';
import { GetFlagReturnType, CountryCodeType } from '../types';

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
  [countryCode in CountryCodeType]: GetFlagReturnType;
} => {
  // Initialize an empty object to hold the country code to flag URL mapping
  const flagsForAllCountriesMap = {} as {
    [countryCode in CountryCodeType]: GetFlagReturnType;
  };

  // Loop through each country code in the list
  LIST_OF_ALL_COUNTRIES.map((countryCode: CountryCodeType) => {
    let lowerCasedCountryCode = countryCode.toLowerCase() as CountryCodeType;
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
