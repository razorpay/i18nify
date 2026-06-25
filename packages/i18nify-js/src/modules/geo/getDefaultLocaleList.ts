import { withErrorBoundary } from '../../common/errorBoundary';
import { I18NIFY_DATA_SOURCE } from '../shared';

/**
 * Interface defining the structure of country metadata response
 * from the i18nify-data source
 */
interface CountryMetadata {
  metadata_information: {
    [key: string]: {
      default_locale: string;
    };
  };
}

/**
 * Retrieves the default locale for all countries
 *
 * This function makes a network request to central i18nify-data source and
 * returns a promise for the default locales of all countries
 *
 * @returns {Promise<Record<string, string>>} Promise object containing default locale information for all countries
 * @throws {Error} If the API request fails or returns invalid data
 */
const getDefaultLocaleList = async (): Promise<Record<string, string>> => {
  try {
    // Make HTTP request to fetch country metadata
    const response = await fetch(
      `${I18NIFY_DATA_SOURCE}/country/metadata/data.json`,
    );

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response and type it as CountryMetadata
    const data = (await response.json()) as CountryMetadata;

    // Validate that the response contains the required metadata_information
    if (!data?.metadata_information) {
      throw new Error('Invalid response format: missing metadata_information');
    }

    // Initialize an empty object to store country code to default locale mapping
    const defaultLocales: Record<string, string> = {};

    // Iterate through each country's metadata and extract default locale
    // Skip countries that don't have a default_locale defined
    Object.entries(data.metadata_information).forEach(([code, info]) => {
      if (info?.default_locale) {
        defaultLocales[code] = info.default_locale;
      }
    });

    // Validate that we found at least one default locale
    if (Object.keys(defaultLocales).length === 0) {
      throw new Error('No default locales found in the response');
    }

    return defaultLocales;
  } catch (err) {
    // Wrap any errors in a descriptive message while preserving the original error details
    throw new Error(
      `An error occurred while fetching country metadata. The error details are: ${err instanceof Error ? err.message : String(err)}.`,
    );
  }
};

// Export the function wrapped with error boundary for consistent error handling
export default withErrorBoundary<typeof getDefaultLocaleList>(
  getDefaultLocaleList,
);
