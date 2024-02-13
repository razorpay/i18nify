import getDefaultLocaleForAllCountries from '../getDefaultLocaleForAllCountries';

// Mock the COUNTRY_TO_ALL_LOCALES data
jest.mock('../data/countryToAllLocales', () => ({
  COUNTRY_TO_ALL_LOCALES: {
    AE: ['ar-AE', 'en-AE'],
    US: ['en-US', 'es-US'],
    IN: ['hi-IN', 'en-IN'],
  },
}));

describe('locales - getDefaultLocaleForAllCountries', () => {
  it('should return a map of countries to their default locales', async () => {
    const expected = {
      AE: 'ar-AE',
      US: 'en-US',
      IN: 'hi-IN',
      // Expected default locales for mock countries
    };

    const result = await getDefaultLocaleForAllCountries();

    // Verify the result matches the expected object
    expect(result).toEqual(expected);
  });
});
