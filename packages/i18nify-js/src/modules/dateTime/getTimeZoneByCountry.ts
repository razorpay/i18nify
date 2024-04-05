import { withErrorBoundary } from '../../common/errorBoundary';
import { I18NIFY_DATA_SOURCE } from './constants';

/**
 * Asynchronously retrieves the timezone of the capital city for a given country code.
 *
 * @param countryCode The country code for which the timezone of the capital city is requested.
 * @returns A promise that resolves to the timezone of the capital city for the specified country code.
 * @throws Error if the country code is not found in the dynamically imported dataset or if there's an API response error.
 */
const getTimeZoneByCountry = async (countryCode: string): Promise<string> => {
  try {
    const response = await fetch(
      `${I18NIFY_DATA_SOURCE}/country/metadata/data.json`,
    );
    const data = await response.json();

    const timezone =
      data.metadata_information[countryCode]?.timezone_of_capital;

    if (!timezone) {
      throw new Error(`Invalid countryCode: ${countryCode}`);
    }

    return timezone;
  } catch (err) {
    throw new Error(`Error in API response: ${(err as Error).message}`);
  }
};

export default withErrorBoundary<typeof getTimeZoneByCountry>(
  getTimeZoneByCountry,
);
