import { withErrorBoundary } from '../../common/errorBoundary';
import { CountryCodeType } from '../types';
import { I18NIFY_DATA_SOURCE } from '../shared';
import { CountryMetaType } from './types';

/**
 * Retrieves the meta data for a country
 *
 * This function makes a network request to central i18nify-data source and
 * returns a promise for the meta data for a country
 *
 * @returns {Promise} Promise object for data of a country
 */
const getByCountry = (
  _countryCode: CountryCodeType,
): Promise<CountryMetaType> => {
  return fetch(`${I18NIFY_DATA_SOURCE}/country/metadata/data.json`)
    .then((res) => res.json())
    .then((res) => res.metadata_information[_countryCode])
    .catch((err) => {
      throw new Error(
        `An error occurred while fetching country metadata. The error details are: ${err.message}.`,
      );
    });
};

export default withErrorBoundary<typeof getByCountry>(getByCountry);
