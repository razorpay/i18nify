import getDefaultLocaleByCountry from '../getDefaultLocaleByCountry';

jest.mock('../data/countryToAllLocales.ts', () => ({
  COUNTRY_TO_ALL_LOCALES: {
    AE: ['ar-AE', 'en-AE'],
    US: ['en-US', 'es-US', 'haw-US'],
    IN: ['en-IN', 'hi-IN'],
    // ... more countries here
  },
}));

describe('core - getDefaultLocaleByCountry', () => {
  it('returns the default locale for a valid country code', async () => {
    await expect(getDefaultLocaleByCountry('AE')).resolves.toBe('ar-AE');
    await expect(getDefaultLocaleByCountry('US')).resolves.toBe('en-US');
    await expect(getDefaultLocaleByCountry('IN')).resolves.toBe('en-IN');
  });

  it('throws an error for an invalid country code', async () => {
    await expect(getDefaultLocaleByCountry('XX' as any)).rejects.toThrow(
      'Invalid countryCode: XX',
    );
  });

  it('returns the only locale for countries with a single locale', async () => {
    jest.mock('../data/countryToAllLocales', () => ({
      COUNTRY_TO_ALL_LOCALES: {
        IN: ['en-IN'], // Mocked to only have one locale
      },
    }));
    await expect(getDefaultLocaleByCountry('IN')).resolves.toBe('en-IN');
  });

  it('always returns the first locale for countries with multiple locales', async () => {
    await expect(getDefaultLocaleByCountry('US')).resolves.toBe('en-US');
  });
});
