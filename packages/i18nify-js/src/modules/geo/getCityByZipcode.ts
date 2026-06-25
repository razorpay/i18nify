import { withErrorBoundary } from '../../common/errorBoundary';
import {
  I18NIFY_DATA_SOURCE,
  I18NIFY_DATA_SUPPORTED_COUNTRIES,
} from '../shared';
import { CountryCodeType } from '../types';
import { CountryDetailType } from './types';

/**
 * Retrieves the city name for a specific zipcode
 *
 * This function makes a network request to central i18nify-data source and
 * returns a promise for the city name that contains the provided zipcode.
 *
 * @param zipcode The zipcode to find the city for
 * @param countryCode The country code to search in
 * @returns {Promise<string>} Promise object for the city name
 */
const getCityByZipcode = (_zipcode: string, _countryCode?: CountryCodeType) => {
  const countryCode = _countryCode ? _countryCode.toUpperCase() : undefined;
  const zipcode = _zipcode.trim();

  if (countryCode && !I18NIFY_DATA_SUPPORTED_COUNTRIES.includes(countryCode)) {
    return Promise.reject(
      new Error(
        `Invalid country code: ${countryCode}. Please ensure you provide a valid country code.`,
      ),
    );
  }

  if (!zipcode) {
    return Promise.reject(
      new Error('Zipcode is required. Please provide a valid zipcode.'),
    );
  }

  const countriesToSearch = countryCode
    ? [countryCode]
    : I18NIFY_DATA_SUPPORTED_COUNTRIES;

  const searchPromises = countriesToSearch.map((code) =>
    fetch(`${I18NIFY_DATA_SOURCE}/country/subdivisions/${code}.json`)
      .then((res) => res.json())
      .then((res: CountryDetailType) => {
        for (const state of Object.values(res.states)) {
          for (const [cityName, cityData] of Object.entries(state.cities)) {
            if (cityData.zipcodes.includes(zipcode)) {
              return cityName;
            }
          }
        }
        return null;
      }),
  );

  return Promise.all(searchPromises)
    .then((results) => {
      const cityName = results.find((name) => name !== null);
      if (cityName) {
        return cityName;
      }
      return Promise.reject(
        new Error(
          `Zipcode "${zipcode}" not found in any supported country. Please ensure you provide a valid zipcode that exists within the specified countries.`,
        ),
      );
    })
    .catch((err) => {
      throw new Error(
        `An error occurred while fetching city data. The error details are: ${err?.message || err}.`,
      );
    });
};

export default withErrorBoundary<typeof getCityByZipcode>(getCityByZipcode);
