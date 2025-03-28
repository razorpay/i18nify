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
        if (!res || !res.states) {
          throw new Error(
            `Cannot read properties of undefined (reading 'states')`,
          );
        }

        if (Object.keys(res.states).length === 0) {
          return null;
        }

        for (const [stateCode, stateData] of Object.entries(res.states)) {
          if (!stateData.cities || Object.keys(stateData.cities).length === 0) {
            continue;
          }

          for (const cityData of Object.values(stateData.cities)) {
            if (!cityData.zipcodes || cityData.zipcodes.length === 0) {
              continue;
            }

            if (cityData.zipcodes.includes(zipcode)) {
              return {
                code: stateCode,
                name: stateData.name,
                country: code,
              };
            }
          }
        }
        return null;
      }),
  );

  return Promise.all(searchPromises)
    .then((results) => {
      const stateInfo = results.find((info) => info !== null);
      if (stateInfo) {
        return stateInfo;
      }
      return Promise.reject(
        new Error(
          `Zipcode "${zipcode}" not found in any supported country. Please ensure you provide a valid zipcode that exists within the specified countries.`,
        ),
      );
    })
    .catch((err) => {
      throw new Error(
        `An error occurred while fetching state data. The error details are: ${err?.message || err}.`,
      );
    });
};

export default withErrorBoundary<typeof getStatesByZipCode>(getStatesByZipCode);
