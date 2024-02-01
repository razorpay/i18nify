import getDefaultLocaleForAllCountries from '../getDefaultLocaleForAllCountries';
import { COUNTRY_TO_DEFAULT_LOCALES } from '../data/countryToDefaultLocales';

describe('locales - getDefaultLocaleForAllCountries', () => {
  test('should return the correct country to default locale mapping', () => {
    const defaultLocaleForAllCountriesList = getDefaultLocaleForAllCountries();
    expect(defaultLocaleForAllCountriesList).toEqual(COUNTRY_TO_DEFAULT_LOCALES);
  });
});
