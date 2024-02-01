import { withErrorBoundary } from '../../common/errorBoundary';
import { COUNTRY_TO_DEFAULT_LOCALES } from "./data/countryToDefaultLocales";

const getDefaultLocaleForAllCountries = () => {
    return COUNTRY_TO_DEFAULT_LOCALES;
};

export default withErrorBoundary<typeof getDefaultLocaleForAllCountries>(getDefaultLocaleForAllCountries);