import { withErrorBoundary } from '../../common/errorBoundary';
import { COUNTRY_TO_DEFAULT_LOCALES } from "./data/countryToDefaultLocales";

/**
 * Retrieves a map of all countries to their default locale.
 * @returns A map where the key is the country code and the value is the default locale string.
 */
const getDefaultLocaleForAllCountries = (): typeof COUNTRY_TO_DEFAULT_LOCALES => {
    return COUNTRY_TO_DEFAULT_LOCALES;
};

export default withErrorBoundary<typeof getDefaultLocaleForAllCountries>(getDefaultLocaleForAllCountries);