import { withErrorBoundary } from '../../common/errorBoundary';
import { COUNTRY_TO_ALL_LOCALES } from './data/countryToAllLocales';

/**
 * Retrieves all locales for a given country.
 * @param countryCode The country code to retrieve the locales for.
 * @returns An array of locale strings for the given country.
 * @throws An error if the provided country code does not exist in the map.
 */
const getLocalesByCountry = (
  countryCode: keyof typeof COUNTRY_TO_ALL_LOCALES,
): string[] => {
  if (countryCode in COUNTRY_TO_ALL_LOCALES)
    return [...COUNTRY_TO_ALL_LOCALES[countryCode]];
  else throw new Error('Invalid countryCode!');
};

export default withErrorBoundary<typeof getLocalesByCountry>(
  getLocalesByCountry,
);
