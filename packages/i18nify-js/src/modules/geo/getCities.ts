import { withErrorBoundary } from '../../common/errorBoundary';
import {
  I18NIFY_DATA_SOURCE,
  I18NIFY_DATA_SUPPORTED_COUNTRIES,
} from './constants';
import { I18nifyCountryCodeType } from './types';

/**
 * Retrieves the list of all cities of a state
 *
 * This function makes a network request to central i18nify-data source and
 * returns a promise for list of all cities with their meta data based on country and state code passed
 *
 * @returns {Promise} Promise object for all cities
 */
const getCities = (
  _countryCode: I18nifyCountryCodeType,
  _stateCode?: string,
) => {
  const countryCode = _countryCode.toUpperCase();
  const stateCode = _stateCode && _stateCode.toUpperCase();

  if (!I18NIFY_DATA_SUPPORTED_COUNTRIES.includes(countryCode)) {
    return Promise.reject(`Invalid country code: ${countryCode}`);
  }

  return fetch(
    `${I18NIFY_DATA_SOURCE}/country/subdivisions/${countryCode}.json`,
  )
    .then((res) => res.json())
    .then((res) => {
      // return cities from all states if state code is not provided
      if (!stateCode) {
        return Object.keys(res.states).reduce((acc, curr) => {
          acc = [...acc, ...res.states[curr].cities];
          return acc;
        }, [] as unknown[]);
      }

      if (!res.states[stateCode]) {
        return Promise.reject(
          `State code ${stateCode} missing in ${countryCode}`,
        );
      }

      return res.states[stateCode].cities;
    })
    .catch((err) => {
      throw new Error(`Error in API response ${err}`);
    });
};

export default withErrorBoundary<typeof getCities>(getCities);
