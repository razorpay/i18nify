import { withErrorBoundary } from '../../common/errorBoundary';
import { CountryToLocalesMap } from './types';

/**
 * Retrieves a map of all countries to their default locale.
 * @returns A map where the key is the country code and the value is the default locale string.
 */
const getDefaultLocaleForAllCountries = async (): Promise<{
  [key: string]: string;
}> => {
  const {
    COUNTRY_TO_ALL_LOCALES,
  }: { COUNTRY_TO_ALL_LOCALES: CountryToLocalesMap } = await import(
    './data/countryToAllLocales'
  );

  return Object.keys(COUNTRY_TO_ALL_LOCALES).reduce<{ [key: string]: string }>(
    (acc, key) => {
      const locale = COUNTRY_TO_ALL_LOCALES[key][0];
      if (locale) {
        acc[key] = locale;
      }
      return acc;
    },
    {} as { [key: string]: string },
  );
};

export default withErrorBoundary<typeof getDefaultLocaleForAllCountries>(
  getDefaultLocaleForAllCountries,
);
