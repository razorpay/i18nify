import getLocalesByCountry from '../getLocalesByCountry';

// Mock the COUNTRY_TO_ALL_LOCALES data for consistent testing
jest.mock('../data/countryToAllLocales', () => ({
    COUNTRY_TO_ALL_LOCALES: {
      US: ['en-US', 'es-US'],
      GB: ['en-GB', 'cy-GB'],
    },
  }));
  

describe('core - getLocalesByCountry', () => {
    it('returns all locales for a valid country code', () => {
        expect(getLocalesByCountry('US')).toEqual(['en-US', 'es-US']);
        expect(getLocalesByCountry('GB')).toEqual(['en-GB', 'cy-GB']);
      });
    
      it('throws an error for an invalid country code', () => {
        const invalidCountryCode = 'XX'; // 'XX' is not a valid country code
        // @ts-expect-error
        expect(() => getLocalesByCountry(invalidCountryCode)).toThrow(`Invalid countryCode: ${invalidCountryCode}`);
      });
    
});
