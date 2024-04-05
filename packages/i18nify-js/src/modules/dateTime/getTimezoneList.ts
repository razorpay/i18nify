import { withErrorBoundary } from '../../common/errorBoundary';
import { I18NIFY_DATA_SOURCE } from './constants';
import { CountryDataApiResponse, CountryMetaType } from './types';

/**
 * Dynamically imports country data and extracts timezone information for each country.
 *
 * This function transforms the imported COUNTRY_DATA dataset to a map where each key is a country code,
 * associated with an object that includes the timezones (an object with timezone names as keys
 * and their utc_offset as values) and the timezone_of_capital (the timezone in which the capital city resides).
 *
 * @returns A Promise that resolves to a map with country codes as keys and their respective timezone information.
 */
const getTimezoneList = async (): Promise<Record<string, CountryMetaType>> => {
  try {
    const response = await fetch(
      `${I18NIFY_DATA_SOURCE}/country/metadata/data.json`,
    );
    const data: CountryDataApiResponse = await response.json();

    return Object.entries(data.metadata_information).reduce(
      (acc, [countryCode, countryMetadata]) => ({
        ...acc,
        [countryCode]: {
          timezones: countryMetadata.timezones,
          timezone_of_capital: countryMetadata.timezone_of_capital,
        },
      }),
      {},
    );
  } catch (err) {
    throw new Error(`Error in API response: ${(err as Error).message}`);
  }
};

export default withErrorBoundary<typeof getTimezoneList>(getTimezoneList);
