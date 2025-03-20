import { withErrorBoundary } from '../../common/errorBoundary';
import { CountryCodeType } from '../types';
import { I18NIFY_DATA_SOURCE } from '../shared';

/**
 * Retrieves all supported locales for a country
 *
 * This function makes a network request to central i18nify-data source and
 * returns a promise for an array of supported locale codes for a country
 *
 * @returns {Promise} Promise object for array of supported locales of a country
 */
const getLocaleByCountry = (
  _countryCode: CountryCodeType,
): Promise<string[]> => {
  return fetch(`${I18NIFY_DATA_SOURCE}/country/metadata/data.json`)
    .then((res) => res.json())
    .then((res) => Object.keys(res.metadata_information[_countryCode].locales))
    .catch((err) => {
      throw new Error(
        `An error occurred while fetching country locales. The error details are: ${err.message}.`,
      );
    });
};

export default withErrorBoundary<typeof getLocaleByCountry>(getLocaleByCountry);
