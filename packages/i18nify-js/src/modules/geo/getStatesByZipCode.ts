import { withErrorBoundary } from '../../common/errorBoundary';
import {
  I18NIFY_DATA_SOURCE,
  I18NIFY_DATA_SUPPORTED_COUNTRIES,
} from '../shared';
import { CountryCodeType } from '../types/geo';
import { CountryDetailType } from './types';

/**
 * Retrieves the state information for a specific zipcode
 *
 * This function makes a network request to central i18nify-data source and
 * returns a promise for the state name that contains the provided zipcode.
 * If a country code is provided, it will only search in that country,
 * otherwise it will search across all supported countries.
 *
 * @param zipcode The zipcode to find the state for
 * @param countryCode Optional country code to narrow down the search
 * @returns {Promise<{code: string; name: string; country: string}>} Promise object containing state information
 */
const getStatesByZipCode = (
  _zipcode: string,
  _countryCode?: CountryCodeType,
) => {
  // Normalize inputs: convert country code to uppercase and trim zipcode
  const countryCode = _countryCode ? _countryCode.toUpperCase() : undefined;
  const zipcode = _zipcode.trim();

  // Validate country code if provided
  if (countryCode && !I18NIFY_DATA_SUPPORTED_COUNTRIES.includes(countryCode)) {
    return Promise.reject(
      new Error(
        `Invalid country code: ${countryCode}. Please ensure you provide a valid country code.`,
      ),
    );
  }

  // Validate zipcode is not empty
  if (!zipcode) {
    return Promise.reject(
      new Error('Zipcode is required. Please provide a valid zipcode.'),
    );
  }

  // Determine which countries to search based on provided country code
  const countriesToSearch = countryCode
    ? [countryCode]
    : I18NIFY_DATA_SUPPORTED_COUNTRIES;

  // Create an array of promises to search for the zipcode in each country
  const searchPromises = countriesToSearch.map((code) =>
    // Fetch country data from the API
    fetch(`${I18NIFY_DATA_SOURCE}/country/subdivisions/${code}.json`)
      .then((res) => res.json())
      .then((res: CountryDetailType) => {
        // Validate response structure
        if (!res || !res.states) {
          throw new Error(
            `Cannot read properties of undefined (reading 'states')`,
          );
        }

        // Skip if country has no states
        if (Object.keys(res.states).length === 0) {
          return null;
        }

        // Iterate through states to find matching zipcode
        for (const [stateCode, stateData] of Object.entries(res.states)) {
          // Skip states with no cities
          if (!stateData.cities || Object.keys(stateData.cities).length === 0) {
            continue;
          }

          // Check each city's zipcodes
          for (const cityData of Object.values(stateData.cities)) {
            // Skip cities with no zipcodes
            if (!cityData.zipcodes || cityData.zipcodes.length === 0) {
              continue;
            }

            // Return state info if zipcode is found
            if (cityData.zipcodes.includes(zipcode)) {
              return {
                code: stateCode,
                name: stateData.name,
                country: code,
              };
            }
          }
        }
        // Return null if zipcode not found in this country
        return null;
      }),
  );

  // Process all search results
  return Promise.all(searchPromises)
    .then((results) => {
      // Find the first non-null result (matching state)
      const stateInfo = results.find((info) => info !== null);
      if (stateInfo) {
        return stateInfo;
      }
      // Reject if zipcode not found in any country
      return Promise.reject(
        new Error(
          `Zipcode "${zipcode}" not found in any supported country. Please ensure you provide a valid zipcode that exists within the specified countries.`,
        ),
      );
    })
    .catch((err) => {
      // Handle any errors during the search process
      throw new Error(
        `An error occurred while fetching state data. The error details are: ${err?.message || err}.`,
      );
    });
};

export default withErrorBoundary<typeof getStatesByZipCode>(getStatesByZipCode);
