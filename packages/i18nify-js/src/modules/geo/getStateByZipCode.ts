import { withErrorBoundary } from '../../common/errorBoundary';
import {
  I18NIFY_DATA_SOURCE,
  I18NIFY_DATA_SUPPORTED_COUNTRIES,
} from '../shared';
import { CountryCodeType } from '../types';
import { CountryDetailType } from './types';

/**
 * Returns the state name for a given zipcode.
 *
 * Single-value convenience wrapper — returns the matched state name as a plain
 * string rather than the full `{code, name, country}` object returned by
 * `getStatesByZipCode`.
 *
 * @param zipcode - The postal/zip code to look up.
 * @param options.country - ISO 3166-1 alpha-2 country code to restrict the
 *   search. When omitted, all supported countries are searched.
 * @returns {Promise<string>} Resolves to the state name containing the zipcode.
 */
const getStateByZipCode = (
  _zipcode: string,
  options: { country?: CountryCodeType } = {},
): Promise<string> => {
  const countryCode = options.country
    ? options.country.toUpperCase()
    : undefined;
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

        if (Object.keys(res.states).length === 0) return null;

        for (const [, stateData] of Object.entries(res.states)) {
          if (!stateData.cities || Object.keys(stateData.cities).length === 0) {
            continue;
          }
          for (const cityData of Object.values(stateData.cities)) {
            if (cityData.zipcodes?.includes(zipcode)) {
              return stateData.name || null;
            }
          }
        }
        return null;
      }),
  );

  return Promise.all(searchPromises)
    .then((results) => {
      const stateName = results.find((name) => name != null);
      if (stateName) return stateName;
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

export default withErrorBoundary<typeof getStateByZipCode>(getStateByZipCode);
