import { withErrorBoundary } from '../../common/errorBoundary';
import {
  I18NIFY_DATA_SOURCE,
  I18NIFY_DATA_SUPPORTED_COUNTRIES,
} from '../shared';
import { CountryCodeType } from '../types';
import { CountryDetailType, CityType } from './types';

/**
 * Retrieves the list of all zipcodes for a specific city
 *
 * This function makes a network request to central i18nify-data source and
 * returns a promise for list of all zipcodes based on country and city identifier passed.
 * The city identifier can be either the complete city name or the city code.
 *
 * @param countryCode The country code to get zipcodes for
 * @param cityIdentifier The name or code of the city to get zipcodes for
 * @returns {Promise<string[]>} Promise object for all zipcodes in the city
 */
const getZipcodesByCity = (
  _countryCode: CountryCodeType,
  _cityIdentifier: string,
) => {
  const countryCode = _countryCode.toUpperCase();
  const cityIdentifier = _cityIdentifier.trim();

  if (!I18NIFY_DATA_SUPPORTED_COUNTRIES.includes(countryCode)) {
    return Promise.reject(
      new Error(
        `Invalid country code: ${countryCode}. Please ensure you provide a valid country code.`,
      ),
    );
  }

  if (!cityIdentifier) {
    return Promise.reject(
      new Error(
        'City identifier is required. Please provide a valid city name or city code.',
      ),
    );
  }

  return fetch(
    `${I18NIFY_DATA_SOURCE}/country/subdivisions/${countryCode}.json`,
  )
    .then((res) => res.json())
    .then((res: CountryDetailType) => {
      // Search for the city across all states
      for (const state of Object.values(res.states)) {
        // Try to find by exact city name match first
        const cityByExactName = Object.values(state.cities).find(
          (c: CityType) =>
            c.name.toUpperCase() === cityIdentifier.toUpperCase(),
        );
        if (cityByExactName) {
          return cityByExactName.zipcodes;
        }

        // Try to find by partial city name match
        const cityByPartialName = Object.values(state.cities).find(
          (c: CityType) =>
            c.name.toUpperCase().includes(cityIdentifier.toUpperCase()) ||
            cityIdentifier.toUpperCase().includes(c.name.toUpperCase()),
        );
        if (cityByPartialName) {
          return cityByPartialName.zipcodes;
        }
      }

      return Promise.reject(
        new Error(
          `City with identifier "${cityIdentifier}" not found in ${countryCode}. Please ensure you provide a valid city name or city code that exists within the specified country.`,
        ),
      );
    })
    .catch((err) => {
      throw new Error(
        `An error occurred while fetching zipcode data. The error details are: ${err?.message || err}.`,
      );
    });
};

export default withErrorBoundary<typeof getZipcodesByCity>(getZipcodesByCity);
