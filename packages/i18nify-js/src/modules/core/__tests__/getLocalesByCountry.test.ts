import getLocalesByCountry from '../getLocalesByCountry'; 

describe('core - getLocalesByCountry', () => {
    it('should return locales for a valid country', () => {
        expect(getLocalesByCountry('AE')).toEqual(expect.arrayContaining(['ar_AE', 'en_AE']));
    });

    it('should throw an error for an invalid country code', () => {
        expect(() => getLocalesByCountry('INVALID_CODE' as any)).toThrow('Invalid countryCode!');
    });
});
