import  getDefaultLocaleByCountry from '../getDefaultLocaleByCountry'; 

describe('core - getDefaultLocaleByCountry', () => {
    it('should return the default locale for a valid country', () => {
        expect(getDefaultLocaleByCountry('AE')).toEqual('ar-AE');
    });

    it('should throw an error for an invalid country code', () => {
        expect(() => getDefaultLocaleByCountry('INVALID_CODE' as any)).toThrow('Invalid countryCode!');
    });
});