import getAllLocales from '../getAllLocales';

// Mock the COUNTRY_TO_ALL_LOCALES data
jest.mock('../data/countryToAllLocales', () => ({
  COUNTRY_TO_ALL_LOCALES: {
    US: ['en-US', 'es-US'],
    GB: ['en-GB', 'cy-GB'],
    CA: ['en-CA', 'fr-CA'],
  },
}));

describe('core - getAllLocales', () => {
  it('should return all countries with their respective locales', async () => {
    const expected = {
      US: ['en-US', 'es-US'],
      GB: ['en-GB', 'cy-GB'],
      CA: ['en-CA', 'fr-CA'],
      // Expected data matching the mock
    };

    const result = await getAllLocales();

    // Verify the result matches the expected object
    expect(result).toEqual(expected);
  });
});
