import { withErrorBoundary } from '../../common/errorBoundary';
import {
  I18NIFY_DATA_SOURCE,
  I18NIFY_DATA_SUPPORTED_COUNTRIES,
} from '../shared';
import { I18nifyCountryCodeType, CountryDetailType } from './types';

/**
 * Validates if a zipcode exists in a country or across all supported countries.
 * If a country code is provided, it checks only in that country.
 * If no country code is provided, it searches across all supported countries.
 *
 * @param {string} zipcode - The zipcode to validate
 * @param {I18nifyCountryCodeType} [countryCode] - Optional country code to validate against
 * @returns {Promise<boolean>} Promise that resolves to true if zipcode exists, false otherwise
 *
 * @throws {Error} If zipcode is empty or invalid
 * @throws {Error} If provided country code is not supported
 * @throws {Error} If API request fails when searching in a specific country
 */
export const validateZipCode = async (
  zipcode: string,
  countryCode?: I18nifyCountryCodeType,
): Promise<boolean> => {
  // Input validation: Ensure zipcode is not empty or just whitespace
  if (!zipcode?.trim()) {
    throw new Error('Zipcode is required. Please provide a valid zipcode.');
  }

  // Normalize zipcode by removing leading/trailing spaces
  const normalizedZipcode = zipcode.trim();

  // If country code is provided, validate only for that country
  if (countryCode) {
    // Validate that the provided country code is supported
    if (!I18NIFY_DATA_SUPPORTED_COUNTRIES.includes(countryCode)) {
      throw new Error(
        `Invalid country code: ${countryCode}. Please ensure you provide a valid country code.`,
      );
    }

    try {
      // Fetch country data from the API
      const res = await fetch(
        `${I18NIFY_DATA_SOURCE}/country/subdivisions/${countryCode}.json`,
      );
      const data: CountryDetailType = await res.json();

      // Validate response structure: check if data and states exist
      if (!data || !data.states) {
        return false;
      }

      // Get array of states and validate it's not empty
      const states = Object.values(data.states);
      if (!states.length) {
        return false;
      }

      // Search through each state for the zipcode
      return states.some((state) => {
        // Validate state and cities exist
        if (!state || !state.cities) {
          return false;
        }

        // Get array of cities and validate it's not empty
        const cities = Object.values(state.cities);
        if (!cities.length) {
          return false;
        }

        // Search through each city for the zipcode
        return cities.some((city) => {
          // Validate city and zipcodes array exist
          if (!city || !city.zipcodes) {
            return false;
          }

          // Check if zipcode exists in the city's zipcodes array
          return city.zipcodes.includes(normalizedZipcode);
        });
      });
    } catch (error: unknown) {
      // Propagate error with additional context when searching in a specific country
      throw new Error(
        `An error occurred while validating zipcode. The error details are: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  // When no country code is provided, search across all supported countries
  const supportedCountries = [...I18NIFY_DATA_SUPPORTED_COUNTRIES];

  // Fetch and validate data from all supported countries in parallel
  const results = await Promise.all(
    supportedCountries.map(async (code) => {
      try {
        // Fetch country data from the API
        const res = await fetch(
          `${I18NIFY_DATA_SOURCE}/country/subdivisions/${code}.json`,
        );
        const data: CountryDetailType = await res.json();

        // Validate response structure: check if data and states exist
        if (!data || !data.states) {
          return false;
        }

        // Get array of states and validate it's not empty
        const states = Object.values(data.states);
        if (!states.length) {
          return false;
        }

        // Search through each state for the zipcode
        return states.some((state) => {
          // Validate state and cities exist
          if (!state || !state.cities) {
            return false;
          }

          // Get array of cities and validate it's not empty
          const cities = Object.values(state.cities);
          if (!cities.length) {
            return false;
          }

          // Search through each city for the zipcode
          return cities.some((city) => {
            // Validate city and zipcodes array exist
            if (!city || !city.zipcodes) {
              return false;
            }

            // Check if zipcode exists in the city's zipcodes array
            return city.zipcodes.includes(normalizedZipcode);
          });
        });
      } catch (error) {
        // Silently handle errors in multi-country search by returning false
        // This allows the search to continue with other countries
        return false;
      }
    }),
  );

  // Return true if zipcode is found in any country, false otherwise
  return results.some((result) => result === true);
};

// Wrap the function with error boundary for consistent error handling
export default withErrorBoundary(validateZipCode);
