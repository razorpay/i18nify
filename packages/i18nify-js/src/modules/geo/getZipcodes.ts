import { withErrorBoundary } from '../../common/errorBoundary';
import { CountryCodeType } from '../types';
import {
  I18NIFY_DATA_SOURCE,
  I18NIFY_DATA_SUPPORTED_COUNTRIES,
} from '../sourceConstants';
import { CountryDetailType } from './types';

/**
 * Queries the response received from i18nify-data and returns a list of zipcodes within the state provided
 * @param response i18nify-data country specific response
 * @param stateCode code assigned to the State
 * @returns array of all zipcodes present in state provided
 */
function getZipcodesFromState(
  response: CountryDetailType,
  stateCode: string,
): string[] {
  const zipcodes = response.states[stateCode].cities.reduce(
    (_acc: string[], city: { zipcodes: string[] }) => [
      ..._acc,
      ...city.zipcodes,
    ],
    [],
  );
  // remove duplicate zipcodes
  return [...new Set(zipcodes)];
}

/**
 * Retrieves the list of all cities of a state
 *
 * This function makes a network request to central i18nify-data source and
 * returns a promise for list of all cities with their meta data based on country and state code passed
 *
 * @returns {Promise} Promise object for all cities
 */
const getZipcodes = (_countryCode: CountryCodeType, _stateCode?: string) => {
  const countryCode = _countryCode.toUpperCase();
  const stateCode = _stateCode && _stateCode.toUpperCase();

  if (!I18NIFY_DATA_SUPPORTED_COUNTRIES.includes(countryCode)) {
    return Promise.reject(
      new Error(
        `Invalid country code: ${countryCode}. Please ensure you provide a valid country code.`,
      ),
    );
  }

  return fetch(
    `${I18NIFY_DATA_SOURCE}/country/subdivisions/${countryCode}.json`,
  )
    .then((res) => res.json())
    .then((res) => {
      // return zipcodes of all states if state code is not provided
      if (!stateCode) {
        return Object.keys(res.states).reduce((acc, state) => {
          const stateZipcodes = getZipcodesFromState(res, state);

          return [...acc, ...stateZipcodes];
        }, [] as unknown[]);
      }

      if (!res.states[stateCode]) {
        return Promise.reject(
          `State code ${stateCode} is missing in ${countryCode}. Please ensure you provide a valid state code that exists within the specified country. Check valid state codes and country codes here: https://github.com/razorpay/i18nify/blob/master/i18nify-data/country/metadata/data.json`,
        );
      }

      return getZipcodesFromState(res, stateCode);
    })
    .catch((err) => {
      throw new Error(
        `An error occurred while fetching zipcode data. The error details are: ${err}.`,
      );
    });
};

export default withErrorBoundary<typeof getZipcodes>(getZipcodes);
