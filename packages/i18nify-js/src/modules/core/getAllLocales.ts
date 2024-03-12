import { withErrorBoundary } from '../../common/errorBoundary';

/**
 * Retrieves a map of all countries to their respective locales.
 * @returns A map where the key is the country code and the value is an array of locale strings.
 */
const getAllLocales = async (): Promise<typeof COUNTRY_TO_ALL_LOCALES> => {
  const { COUNTRY_TO_ALL_LOCALES } = await import('./data/countryToAllLocales');
  return COUNTRY_TO_ALL_LOCALES;
};

export default withErrorBoundary<typeof getAllLocales>(getAllLocales);
