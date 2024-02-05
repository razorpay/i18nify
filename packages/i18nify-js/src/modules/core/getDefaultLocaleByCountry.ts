import { withErrorBoundary } from '../../common/errorBoundary';
import { COUNTRY_TO_DEFAULT_LOCALES } from "./data/countryToDefaultLocales";

/**
 * Retrieves the default locale for a given country.
 * @param countryCode The country code to retrieve the default locale for.
 * @returns The default locale string for the given country.
 * @throws An error if the provided country code does not exist in the map.
 */
const getDefaultLocaleByCountry = (countryCode: keyof typeof COUNTRY_TO_DEFAULT_LOCALES): string => {
    if (countryCode in COUNTRY_TO_DEFAULT_LOCALES) return COUNTRY_TO_DEFAULT_LOCALES[countryCode];
    else throw new Error('Invalid countryCode!');
};

export default withErrorBoundary<typeof getDefaultLocaleByCountry>(getDefaultLocaleByCountry);