import { withErrorBoundary } from '../../common/errorBoundary';
import { LIST_OF_ALL_COUNTRIES } from './data/listOfAllCountries';

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
  [countryCode: string]: string;
} => {
  // Initialize an empty object to hold the country code to flag URL mapping
  const flagsForAllCountriesMap: { [countryCode: string]: string } = {};

  // Loop through each country code in the list
  LIST_OF_ALL_COUNTRIES.map((countryCode: string) => {
    // Construct the flag image URL and assign it to the corresponding country code in the map
    flagsForAllCountriesMap[countryCode] =
      `https://betacdn.np.razorpay.in/static/assets/flags/${countryCode.toLowerCase()}.svg`;
  });

  // Return the populated map of country codes to flag image URLs
  return flagsForAllCountriesMap;
};

export default withErrorBoundary<typeof getFlagsForAllCountries>(getFlagsForAllCountries);