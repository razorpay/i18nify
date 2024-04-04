import { withErrorBoundary } from '../../common/errorBoundary';

/**
 * Dynamically imports country data and extracts timezone information for each country.
 * 
 * This function transforms the imported COUNTRY_DATA dataset to a map where each key is a country code,
 * associated with an object that includes the timezones (an object with timezone names as keys
 * and their utc_offset as values) and the timezone_of_capital (the timezone in which the capital city resides).
 *
 * @returns A Promise that resolves to a map with country codes as keys and their respective timezone information.
 */
const getTimezoneList = async (): Promise<Record<string, { timezones: Record<string, { utc_offset: string }>, timezone_of_capital: string }>> => {
  // Dynamically import the COUNTRY_DATA
  const { default: COUNTRY_DATA } = await import('#/i18nify-data/country/metadata/data.json');

  return Object.entries(COUNTRY_DATA.metadata_information).reduce<Record<string, { timezones: Record<string, { utc_offset: string }>, timezone_of_capital: string }>>((acc, [countryCode, details]) => ({
    ...acc,
    [countryCode]: {
      timezones: details.timezones,
      timezone_of_capital: details.timezone_of_capital,
    }
  }), {});
};

export default withErrorBoundary<typeof getTimezoneList>(getTimezoneList);
