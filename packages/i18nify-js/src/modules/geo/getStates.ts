import { withErrorBoundary } from '../../common/errorBoundary';
import {
  I18NIFY_DATA_SOURCE,
  I18NIFY_DATA_SUPPORTED_COUNTRIES,
} from './constants';
import { I18nifyCountryCodeType } from './types';

/**
 * Retrieves the list of states for a country
 *
 * This function makes a network request to central i18nify-data source and
 * returns a promise for list of all states with their meta data based on country code passed
 *
 * @returns {Promise} Promise object for all states
 */
const getStates = (_countryCode: I18nifyCountryCodeType) => {
  const countryCode = _countryCode.toUpperCase();

  if (!I18NIFY_DATA_SUPPORTED_COUNTRIES.includes(countryCode)) {
    return Promise.reject(`Invalid country code: ${countryCode}`);
  }

  return fetch(
    `${I18NIFY_DATA_SOURCE}/country/subdivisions/${countryCode}.json`,
  )
    .then((res) => res.json())
    .then((res) => res.states)
    .catch((err) => {
      throw new Error(`Error in API response ${err}`);
    });
};

export default withErrorBoundary<typeof getStates>(getStates);
