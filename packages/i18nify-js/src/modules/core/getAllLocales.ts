import { withErrorBoundary } from '../../common/errorBoundary';
import { COUNTRY_TO_ALL_LOCALES } from './data/countryToAllLocales';

/**
 * Retrieves a map of all countries to their respective locales.
 * @returns A map where the key is the country code and the value is an array of locale strings.
 */
const getAllLocales = (): typeof COUNTRY_TO_ALL_LOCALES => {
    return COUNTRY_TO_ALL_LOCALES;
};

export default withErrorBoundary<typeof getAllLocales>(getAllLocales);