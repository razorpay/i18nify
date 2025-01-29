import { withErrorBoundary } from '../../common/errorBoundary';
import {
  I18NIFY_DATA_SOURCE,
  I18NIFY_DATA_SUPPORTED_COUNTRIES,
} from '../shared/sourceConstants';
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
    return Promise.reject(
      new Error(
        `Invalid country code: ${countryCode}. Please ensure you provide a valid country code. Check valid country codes here: https://github.com/razorpay/i18nify/blob/master/i18nify-data/country/metadata/data.json`,
      ),
    );
  }

  return fetch(
    `${I18NIFY_DATA_SOURCE}/country/subdivisions/${countryCode}.json`,
  )
    .then((res) => res.json())
    .then((res) => res.states)
    .catch((err) => {
      throw new Error(
        `An error occurred while fetching state data. The error details are: ${err.message}.`,
      );
    });
};

export default withErrorBoundary<typeof getStates>(getStates);
