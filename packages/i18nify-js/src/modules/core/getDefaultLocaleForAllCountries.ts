import { withErrorBoundary } from '../../common/errorBoundary';

/**
 * Retrieves a map of all countries to their default locale.
 * @returns A map where the key is the country code and the value is the default locale string.
 */
const getDefaultLocaleForAllCountries = async (): Promise<
  typeof COUNTRY_TO_DEFAULT_LOCALES
> => {
  const { COUNTRY_TO_DEFAULT_LOCALES } = await import(
    './data/countryToDefaultLocales'
  );
  return COUNTRY_TO_DEFAULT_LOCALES;
};

export default withErrorBoundary<typeof getDefaultLocaleForAllCountries>(
  getDefaultLocaleForAllCountries,
);
