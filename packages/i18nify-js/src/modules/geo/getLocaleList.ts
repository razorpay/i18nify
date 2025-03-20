import { withErrorBoundary } from '../../common/errorBoundary';
import { CountryCodeType } from '../types';
import { I18NIFY_DATA_SOURCE } from '../shared';
// import { CountryMetaType } from './types';

/**
 * Retrieves the list of locales for a country or all countries
 *
 * This function makes a network request to central i18nify-data source and
 * returns a promise for the locales of a country or all countries
 *
 * @param {CountryCodeType} [countryCode] - Optional country code to get locales for a specific country
 * @returns {Promise} Promise object containing locale information
 */
const getLocaleList = (
  countryCode?: CountryCodeType,
): Promise<
  | Record<string, { name: string }>
  | Record<string, Record<string, { name: string }>>
> => {
  return fetch(`${I18NIFY_DATA_SOURCE}/country/metadata/data.json`)
    .then((res) => res.json())
    .then((res) => {
      if (countryCode) {
        return res.metadata_information[countryCode].locales;
      }
      const allLocales: Record<string, Record<string, { name: string }>> = {};
      Object.keys(res.metadata_information).forEach((code) => {
        allLocales[code] = res.metadata_information[code].locales;
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
