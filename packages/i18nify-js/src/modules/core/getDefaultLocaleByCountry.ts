import { withErrorBoundary } from '../../common/errorBoundary';
import { CountryCode } from './types';

/**
 * Retrieves the default locale for a given country.
 * @param countryCode The country code to retrieve the default locale for.
 * @returns The default locale string for the given country.
 * @throws An error if the provided country code does not exist in the map.
 */
const getDefaultLocaleByCountry = async (
  countryCode: CountryCode,
): Promise<string> => {
  const { COUNTRY_TO_ALL_LOCALES } = await import('./data/countryToAllLocales');

  if (countryCode in COUNTRY_TO_ALL_LOCALES)
    return COUNTRY_TO_ALL_LOCALES[countryCode][0];
  else throw new Error(`Invalid countryCode: ${countryCode}`);
};

export default withErrorBoundary<typeof getDefaultLocaleByCountry>(
  getDefaultLocaleByCountry,
);
