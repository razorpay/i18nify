import { withErrorBoundary } from '../../common/errorBoundary';
import { I18NIFY_DATA_SOURCE } from '../shared';

/**
 * Retrieves the list of locales for a country or all countries
 *
 * This function makes a network request to central i18nify-data source and
 * returns a promise for the locales of a country or all countries
 *
 * @param {CountryCodeType} [countryCode] - Optional country code to get locales for a specific country
 * @returns {Promise} Promise object containing locale information
 */
const getLocaleList = (): Promise<Record<string, string[]>> => {
  return fetch(`${I18NIFY_DATA_SOURCE}/country/metadata/data.json`)
    .then((res) => res.json())
    .then((res) => {
      const allLocales: Record<string, string[]> = {};
      Object.keys(res.metadata_information).forEach((code) => {
        allLocales[code] = Object.keys(res.metadata_information[code].locales);
      });
      return allLocales;
    })
    .catch((err) => {
      throw new Error(
        `An error occurred while fetching country metadata. The error details are: ${err.message}.`,
      );
    });
};

export default withErrorBoundary<typeof getLocaleList>(getLocaleList);
