import { withErrorBoundary } from '../../common/errorBoundary';
import { CountryCodeType } from '../types';
import { I18NIFY_DATA_SOURCE } from './constants';
import { CountryMetaType } from './types';

/**
 * Retrieves the meta data for all countries
 *
 * This function makes a network request to central i18nify-data source and
 * returns a promise for list of all countries with their meta data
 *
 * @returns {Promise} Promise object for all countries
 */
const getAllCountries = (): Promise<
  Record<CountryCodeType, CountryMetaType>
> => {
  return fetch(`${I18NIFY_DATA_SOURCE}/country/metadata/data.json`)
    .then((res) => res.json())
    .then((res) => res.metadata_information)
    .catch((err) => {
      throw new Error(
        `An error occurred while fetching country metadata. The error details are: ${err.message}.`,
      );
    });
};

export default withErrorBoundary<typeof getAllCountries>(getAllCountries);
