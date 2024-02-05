import getAllLocales from '../getAllLocales';

describe('core - getAllLocales', () => {
    it('should return all locales', () => {
        const locales = getAllLocales();
        expect(locales).toBeDefined();
        expect(locales.AE).toEqual(expect.arrayContaining(['ar_AE', 'en_AE']));
    });
});